import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/app/api/admin/auth/route";
import { getSquareClient } from "@/lib/square";
import { neon } from "@neondatabase/serverless";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  if (!isAdminAuthenticated(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) return NextResponse.json({ error: "DATABASE_URL not set" }, { status: 500 });

  try {
    const sql = neon(dbUrl);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const client = getSquareClient() as any;

    const beginTime = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString();
    let cursor: string | undefined;
    let synced = 0;
    let skipped = 0;

    do {
      const res = await client.payments.list({
        beginTime,
        sortOrder: "DESC",
        limit: 100,
        ...(cursor ? { cursor } : {}),
      });

      const payments: any[] = res?.payments ?? [];
      cursor = res?.cursor;

      for (const payment of payments) {
        if (payment.status !== "COMPLETED") continue;

        const squarePaymentId = payment.id;
        const squareOrderId = payment.orderId;
        const amountCents = Number(payment.amountMoney?.amount ?? 0);
        const currency = payment.amountMoney?.currency ?? "USD";
        const customerEmail = payment.buyerEmailAddress ?? null;
        const createdAt = payment.createdAt ?? new Date().toISOString();

        let referralCode: string | null = null;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let lineItems: any[] = [];

        if (squareOrderId) {
          try {
            const orderRes = await client.orders.get({ orderId: squareOrderId });
            const order = orderRes?.order;
            if (order?.referenceId?.startsWith("ref:")) {
              referralCode = order.referenceId.slice(4);
            }
            if (order?.lineItems) {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              lineItems = order.lineItems.map((li: any) => ({
                name: li.name || "Unknown",
                quantity: Number(li.quantity || 1),
                priceCents: Number(li.totalMoney?.amount || 0),
              }));
            }
          } catch {
            // order detail fetch failed — save payment without line items
          }
        }

        const inserted = await sql`
          INSERT INTO orders (square_payment_id, square_order_id, amount_cents, currency, customer_email, referral_code, line_items, status, created_at)
          VALUES (${squarePaymentId}, ${squareOrderId ?? null}, ${amountCents}, ${currency}, ${customerEmail}, ${referralCode}, ${JSON.stringify(lineItems)}, 'completed', ${createdAt})
          ON CONFLICT (square_payment_id) DO NOTHING
          RETURNING id
        `;

        if (inserted.length > 0) synced++;
        else skipped++;
      }
    } while (cursor);

    return NextResponse.json({ synced, skipped, total: synced + skipped });
  } catch (e) {
    console.error("[sync-orders] error:", e);
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
