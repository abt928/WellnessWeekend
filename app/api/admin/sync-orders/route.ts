import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/app/api/admin/auth/route";
import { getSquareClient, getLocationId } from "@/lib/square";
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
    const locationId = getLocationId();

    let cursor: string | undefined;
    let synced = 0;
    let skipped = 0;

    // Use Orders Search — more comprehensive than Payments List for ticket sales
    do {
      const searchRes = await client.orders.search({
        locationIds: [locationId],
        query: {
          filter: {
            stateFilter: { states: ["COMPLETED"] },
            dateTimeFilter: {
              createdAt: {
                startAt: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString(),
              },
            },
          },
          sort: { sortField: "CREATED_AT", sortOrder: "DESC" },
        },
        limit: 500,
        ...(cursor ? { cursor } : {}),
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const orders: any[] = searchRes?.orders ?? [];
      cursor = searchRes?.cursor;

      for (const order of orders) {
        // Skip orders with no payment
        const tenders = order.tenders ?? [];
        if (tenders.length === 0) continue;

        const squareOrderId   = order.id;
        const squarePaymentId = tenders[0]?.id ?? squareOrderId;
        const amountCents     = Number(order.totalMoney?.amount ?? 0);
        const currency        = order.totalMoney?.currency ?? "USD";
        const createdAt       = order.createdAt ?? new Date().toISOString();

        // Referral code from order reference ID
        let referralCode: string | null = null;
        if (order.referenceId?.startsWith("ref:")) {
          referralCode = order.referenceId.slice(4);
        }

        // Line items
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const lineItems = (order.lineItems ?? []).map((li: any) => ({
          name:       li.name || "Unknown",
          quantity:   Number(li.quantity || 1),
          priceCents: Number(li.totalMoney?.amount || 0),
        }));

        // Customer email — from fulfillment recipient or customer ID lookup
        let customerEmail: string | null = null;
        let customerName:  string | null = null;

        const fulfillment = order.fulfillments?.[0];
        const recipient   =
          fulfillment?.pickupDetails?.recipient ??
          fulfillment?.shipmentDetails?.recipient ??
          fulfillment?.deliveryDetails?.recipient;

        if (recipient?.emailAddress) customerEmail = recipient.emailAddress;
        if (recipient?.displayName)  customerName  = recipient.displayName;

        // Payment-level email (tender buyer email)
        if (!customerEmail && tenders[0]?.paymentId) {
          try {
            const payRes = await client.payments.get({ paymentId: tenders[0].paymentId });
            customerEmail = payRes?.payment?.buyerEmailAddress ?? null;
          } catch { /* ignore */ }
        }

        // Customer directory lookup for name
        if (!customerName && order.customerId) {
          try {
            const custRes = await client.customers.get({ customerId: order.customerId });
            const c = custRes?.customer;
            if (c) {
              customerName = [c.givenName, c.familyName].filter(Boolean).join(" ") || null;
              if (!customerEmail) customerEmail = c.emailAddress ?? null;
            }
          } catch { /* ignore */ }
        }

        // Derive name from email if still missing
        if (!customerName && customerEmail) {
          customerName = customerEmail.split("@")[0].replace(/[._-]/g, " ");
        }

        const result = await sql`
          INSERT INTO orders (
            square_payment_id, square_order_id, amount_cents, currency,
            customer_email, customer_name, referral_code, line_items, status, created_at
          )
          VALUES (
            ${squarePaymentId}, ${squareOrderId}, ${amountCents}, ${currency},
            ${customerEmail}, ${customerName}, ${referralCode},
            ${JSON.stringify(lineItems)}, 'completed', ${createdAt}
          )
          ON CONFLICT (square_payment_id) DO UPDATE
            SET customer_name = COALESCE(orders.customer_name, EXCLUDED.customer_name),
                customer_email= COALESCE(orders.customer_email, EXCLUDED.customer_email),
                line_items    = EXCLUDED.line_items
          RETURNING id
        `;

        if (result.length > 0) synced++;
        else skipped++;
      }
    } while (cursor);

    return NextResponse.json({ synced, skipped, total: synced + skipped });
  } catch (e) {
    console.error("[sync-orders] error:", e);
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
