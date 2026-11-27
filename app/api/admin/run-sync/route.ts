import { NextRequest, NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";
import { getSquareClient } from "@/lib/square";

export const dynamic = "force-dynamic";

const ONE_TIME_SECRET = "ww-sync-nov27-2026";

interface LineItemSummary {
  name: string;
  category: string;
  quantity: number;
  priceCents: number;
}

export async function GET(req: NextRequest) {
  if (req.nextUrl.searchParams.get("secret") !== ONE_TIME_SECRET) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) return NextResponse.json({ error: "No DATABASE_URL" }, { status: 500 });

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
  const paymentsRes = await (client as any).payments.list({ beginTime, sortOrder: "DESC", limit: 100 });
  const payments = paymentsRes?.payments ?? [];

  let imported = 0;
  let skipped = 0;
  const results: string[] = [];

  for (const payment of payments) {
    if (payment.status !== "COMPLETED") { skipped++; continue; }

    const paymentId: string = payment.id;
    const orderId: string | undefined = payment.orderId;
    const amountCents: number = Number(payment.amountMoney?.amount ?? 0);
    const currency: string = payment.amountMoney?.currency ?? "USD";
    const email: string | undefined = payment.buyerEmailAddress;

    const existing = await sql`SELECT id FROM orders WHERE square_payment_id = ${paymentId}`;
    if (existing.length > 0) { skipped++; continue; }

    let lineItems: LineItemSummary[] = [];
    let referralCode: string | null = null;

    if (orderId) {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const orderRes = await (client as any).orders.get({ orderId });
        const order = orderRes?.order;
        if (order?.referenceId?.startsWith("ref:")) referralCode = order.referenceId.slice(4);
        if (order?.lineItems) {
          lineItems = order.lineItems.map((li: { name?: string; catalogObjectId?: string; quantity?: string | number; totalMoney?: { amount?: number } }) => ({
            name: li.name || "Unknown",
            category: li.catalogObjectId ? "item" : "custom",
            quantity: Number(li.quantity || 1),
            priceCents: Number(li.totalMoney?.amount || 0),
          }));
        }
      } catch { /* skip order fetch errors */ }
    }

    await sql`
      INSERT INTO orders (square_payment_id, square_order_id, amount_cents, currency, customer_email, referral_code, line_items, status, created_at)
      VALUES (${paymentId}, ${orderId ?? null}, ${amountCents}, ${currency}, ${email ?? null}, ${referralCode}, ${JSON.stringify(lineItems)}, 'completed', ${payment.createdAt ?? new Date().toISOString()})
      ON CONFLICT (square_payment_id) DO NOTHING
    `;
    imported++;
    results.push(`${email ?? "unknown"} $${amountCents / 100} ${payment.createdAt}`);
  }

  return NextResponse.json({ imported, skipped, total: payments.length, results });
}
