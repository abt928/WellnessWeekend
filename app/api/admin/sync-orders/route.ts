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

    // Add customer_name column if it doesn't exist yet
    await sql`ALTER TABLE orders ADD COLUMN IF NOT EXISTS customer_name VARCHAR(255)`;

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
        let lineItems: any[] = [];
        let customerName: string | null = null;

        if (squareOrderId) {
          try {
            const orderRes = await client.orders.get({ orderId: squareOrderId });
            const order = orderRes?.order;

            if (order?.referenceId?.startsWith("ref:")) {
              referralCode = order.referenceId.slice(4);
            }

            if (order?.lineItems) {
              lineItems = order.lineItems.map((li: any) => ({
                name: li.name || "Unknown",
                quantity: Number(li.quantity || 1),
                priceCents: Number(li.totalMoney?.amount || 0),
              }));
            }

            // Try to get customer name from fulfillment recipient
            const fulfillment = order?.fulfillments?.[0];
            const recipient =
              fulfillment?.pickupDetails?.recipient ??
              fulfillment?.shipmentDetails?.recipient ??
              fulfillment?.deliveryDetails?.recipient;
            if (recipient?.displayName) {
              customerName = recipient.displayName;
            }

            // Fall back to Square customer directory
            if (!customerName && order?.customerId) {
              try {
                const custRes = await client.customers.get({ customerId: order.customerId });
                const c = custRes?.customer;
                if (c) {
                  customerName = [c.givenName, c.familyName].filter(Boolean).join(" ") || c.emailAddress || null;
                }
              } catch { /* customer lookup failed */ }
            }
          } catch {
            // order detail fetch failed — save payment without extra details
          }
        }

        // Fall back to email prefix as display name
        if (!customerName && customerEmail) {
          customerName = customerEmail.split("@")[0].replace(/[._-]/g, " ");
        }

        const inserted = await sql`
          INSERT INTO orders (
            square_payment_id, square_order_id, amount_cents, currency,
            customer_email, customer_name, referral_code, line_items, status, created_at
          )
          VALUES (
            ${squarePaymentId}, ${squareOrderId ?? null}, ${amountCents}, ${currency},
            ${customerEmail}, ${customerName}, ${referralCode}, ${JSON.stringify(lineItems)},
            'completed', ${createdAt}
          )
          ON CONFLICT (square_payment_id) DO UPDATE
            SET customer_name = EXCLUDED.customer_name,
                line_items    = EXCLUDED.line_items
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
