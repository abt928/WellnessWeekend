import { NextRequest, NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";
import { getSquareClient } from "@/lib/square";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

interface LineItemSummary {
  name: string;
  category: string;
  quantity: number;
  priceCents: number;
}

export async function GET(req: NextRequest) {
  // Vercel Cron sends Authorization: Bearer <CRON_SECRET>
  const cronSecret = process.env.CRON_SECRET;
  const auth = req.headers.get("authorization");
  if (cronSecret && auth !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) return NextResponse.json({ error: "DATABASE_URL not configured" }, { status: 500 });

  try {
    const sql = neon(dbUrl);
    const client = getSquareClient();

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

    const beginTime = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const paymentsRes = await (client as any).payments.list({
      beginTime,
      sortOrder: "DESC",
      limit: 100,
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const payments: any[] = paymentsRes?.result?.payments ?? paymentsRes?.payments ?? [];

    let imported = 0;
    let skipped = 0;
    const errors: string[] = [];

    for (const payment of payments) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const p = payment as any;
      if (p.status !== "COMPLETED") { skipped++; continue; }

      const paymentId = String(p.id ?? "");
      if (!paymentId) { skipped++; continue; }

      const orderId: string | undefined = p.orderId ?? p.order_id;
      const amountCents = Number(p.amountMoney?.amount ?? p.amount_money?.amount ?? 0);
      const currency = String(p.amountMoney?.currency ?? p.amount_money?.currency ?? "USD");
      const email: string | undefined = p.buyerEmailAddress ?? p.buyer_email_address;

      const existing = await sql`SELECT id FROM orders WHERE square_payment_id = ${paymentId}`;
      if (existing.length > 0) { skipped++; continue; }

      let lineItems: LineItemSummary[] = [];
      let referralCode: string | null = null;

      if (orderId) {
        try {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const orderRes = await (client as any).orders.get({ orderId });
          const order = orderRes?.result?.order ?? orderRes?.order;
          if (order?.referenceId?.startsWith("ref:")) referralCode = order.referenceId.slice(4);
          if (order?.lineItems) {
            lineItems = order.lineItems.map((li: { name?: string; catalogObjectId?: string; quantity?: string | number; totalMoney?: { amount?: number } }) => ({
              name: li.name || "Unknown",
              category: li.catalogObjectId ? "item" : "custom",
              quantity: Number(li.quantity || 1),
              priceCents: Number(li.totalMoney?.amount || 0),
            }));
          }
        } catch (e) {
          errors.push(`Order fetch failed for ${paymentId}: ${e}`);
        }
      }

      try {
        await sql`
          INSERT INTO orders (square_payment_id, square_order_id, amount_cents, currency, customer_email, referral_code, line_items, status, created_at)
          VALUES (
            ${paymentId}, ${orderId ?? null}, ${amountCents}, ${currency},
            ${email ?? null}, ${referralCode}, ${JSON.stringify(lineItems)},
            'completed', ${p.createdAt ?? p.created_at ?? new Date().toISOString()}
          )
          ON CONFLICT (square_payment_id) DO NOTHING
        `;
        imported++;
      } catch (e) {
        errors.push(`DB insert failed for ${paymentId}: ${e}`);
      }
    }

    console.log(`[cron/sync-square] imported=${imported} skipped=${skipped} errors=${errors.length}`);
    return NextResponse.json({ success: true, imported, skipped, errors, total: payments.length });
  } catch (e) {
    console.error("[cron/sync-square] fatal:", e);
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
