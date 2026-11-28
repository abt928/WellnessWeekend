import { NextRequest, NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";
import { getSquareClient } from "@/lib/square";
import { isAdminAuthenticated } from "@/app/api/admin/auth/route";

export const dynamic = "force-dynamic";

interface LineItemSummary {
  name: string;
  category: string;
  quantity: number;
  priceCents: number;
}

export async function POST(req: NextRequest) {
  if (!isAdminAuthenticated(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) return NextResponse.json({ error: "DATABASE_URL not configured" }, { status: 500 });

  try {
    const sql = neon(dbUrl);
    const client = getSquareClient();

    // Ensure orders table exists
    await sql`
      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        square_payment_id TEXT NOT NULL UNIQUE,
        square_order_id TEXT,
        amount_cents INTEGER NOT NULL,
        currency TEXT NOT NULL DEFAULT 'USD',
        customer_email TEXT,
        referral_code TEXT,
        line_items TEXT DEFAULT '[]',
        status TEXT NOT NULL DEFAULT 'completed',
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `.catch(() => {});

    // Search Square for completed payments — look back 90 days
    const beginTime = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString();

    // Square SDK v44 returns an async iterable from payments.list()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const iter = (client as any).payments.list({ beginTime, sortOrder: "DESC" });
    const payments: Record<string, unknown>[] = [];
    for await (const p of iter) {
      payments.push(p);
      if (payments.length >= 200) break;
    }
    let imported = 0;
    let skipped = 0;
    const errors: string[] = [];

    for (const payment of payments) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const p = payment as any;
      if (p.status !== "COMPLETED") { skipped++; continue; }

      const paymentId: string = String(p.id ?? "");
      if (!paymentId) { skipped++; continue; }
      const orderId: string | undefined = p.orderId ?? p.order_id;
      const amountCents: number = Number(p.amountMoney?.amount ?? p.amount_money?.amount ?? 0);
      const currency: string = p.amountMoney?.currency ?? p.amount_money?.currency ?? "USD";
      const email: string | undefined = p.buyerEmailAddress ?? p.buyer_email_address;

      // Check if already in DB
      const existing = await sql`SELECT id FROM orders WHERE square_payment_id = ${paymentId}`;
      if (existing.length > 0) { skipped++; continue; }

      let lineItems: LineItemSummary[] = [];
      let referralCode: string | null = null;

      // Fetch order details for line items
      if (orderId) {
        try {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const orderRes = await (client as any).orders.get({ orderId });
          const order = orderRes?.order;
          if (order?.referenceId?.startsWith("ref:")) {
            referralCode = order.referenceId.slice(4);
          }
          if (order?.lineItems) {
            lineItems = order.lineItems.map((li: { name?: string; catalogObjectId?: string; quantity?: string | number; totalMoney?: { amount?: number } }) => ({
              name: li.name || "Unknown",
              category: li.catalogObjectId ? "item" : "custom",
              quantity: Number(li.quantity || 1),
              priceCents: Number(li.totalMoney?.amount || 0),
            }));
          }
        } catch (e) {
          errors.push(`Order fetch failed for payment ${paymentId}: ${e}`);
        }
      }

      try {
        await sql`
          INSERT INTO orders (square_payment_id, square_order_id, amount_cents, currency, customer_email, referral_code, line_items, status, created_at)
          VALUES (
            ${paymentId},
            ${orderId ?? null},
            ${amountCents},
            ${currency},
            ${email ?? null},
            ${referralCode},
            ${JSON.stringify(lineItems)},
            'completed',
            ${(p.createdAt ?? p.created_at ?? new Date().toISOString())}
          )
          ON CONFLICT (square_payment_id) DO NOTHING
        `;
        imported++;
      } catch (e) {
        errors.push(`DB insert failed for payment ${paymentId}: ${e}`);
      }
    }

    return NextResponse.json({ success: true, imported, skipped, errors, total: payments.length });
  } catch (e) {
    console.error("[sync-square POST] error:", e);
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
