import { NextRequest, NextResponse } from "next/server";
import { WebhooksHelper } from "square";
import { getSquareClient } from "@/lib/square";
import { neon } from "@neondatabase/serverless";

export const dynamic = "force-dynamic";

/**
 * Square Webhook handler — listens for payment.updated events (gated on
 * payment.status === "COMPLETED") and fires server-side conversion events to
 * TikTok Events API and Meta Conversions API.
 *
 * Square never emits a "payment.completed" event; a payment moves through
 * status changes (APPROVED → COMPLETED) via payment.updated, so we subscribe
 * to payment.updated and filter on the COMPLETED status.
 *
 * This is the failsafe: even if the user closes their browser after paying
 * on Square (and never hits /thank-you), this webhook still fires the
 * purchase conversion.
 *
 * Setup in Square Dashboard:
 *   Webhooks → Create Subscription → URL: https://www.wellnessweekendak.com/api/square/webhook
 *   Events: payment.updated
 */

interface SquareWebhookPayload {
  type: string;
  data?: {
    object?: {
      payment?: {
        id?: string;
        amount_money?: {
          amount?: number;
          currency?: string;
        };
        buyer_email_address?: string;
        order_id?: string;
        status?: string;
      };
    };
  };
}

// ─── Utilities ───────────────────────────────────────────────────────

/**
 * SHA-256 hash a string for server-side PII matching. Normalization
 * (trim + lowercase before digest) mirrors app/api/tracking/route.ts so the
 * webhook and the client relay produce identical hashes for the same email.
 */
async function sha256(input: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(input.trim().toLowerCase());
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

// ─── TikTok Events API ───────────────────────────────────────────────

async function fireTikTokPurchase(value: number, currency: string, eventId: string, emailHash?: string) {
  const accessToken = process.env.TIKTOK_ACCESS_TOKEN;
  const pixelId = process.env.TIKTOK_PIXEL_ID;
  if (!accessToken || !pixelId) return;

  try {
    await fetch("https://business-api.tiktok.com/open_api/v1.3/pixel/track/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Access-Token": accessToken,
      },
      body: JSON.stringify({
        pixel_code: pixelId,
        event: "CompletePayment",
        event_id: eventId,
        timestamp: new Date().toISOString(),
        // Test Events mode: routes to the TikTok Events Manager test tab when
        // TIKTOK_TEST_EVENT_CODE is set; omitted entirely otherwise (live).
        ...(process.env.TIKTOK_TEST_EVENT_CODE
          ? { test_event_code: process.env.TIKTOK_TEST_EVENT_CODE }
          : {}),
        context: {
          page: { url: "https://www.wellnessweekendak.com/thank-you" },
          ...(emailHash ? { user: { email: emailHash } } : {}),
        },
        properties: {
          value,
          currency,
          content_id: "wellness-weekend-purchase",
          content_type: "product",
          description: "square_webhook_purchase",
          contents: [{
            content_id: "wellness-weekend-purchase",
            content_type: "product",
            quantity: 1,
            price: value,
          }],
        },
      }),
    });
  } catch (e) {
    console.error("[Webhook] TikTok API error:", e);
  }
}

// ─── Meta Conversions API ────────────────────────────────────────────

async function fireMetaPurchase(value: number, currency: string, eventId: string, emailHash?: string) {
  const accessToken = process.env.META_ACCESS_TOKEN;
  const pixelId = process.env.META_PIXEL_ID;
  if (!accessToken || !pixelId) return;

  try {
    await fetch(
      `https://graph.facebook.com/v21.0/${pixelId}/events?access_token=${accessToken}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          data: [
            {
              event_name: "Purchase",
              event_time: Math.floor(Date.now() / 1000),
              event_id: eventId,
              event_source_url: "https://www.wellnessweekendak.com/thank-you",
              action_source: "website",
              user_data: {
                ...(emailHash ? { em: [emailHash] } : {}),
              },
              custom_data: {
                value,
                currency,
                content_type: "product",
                content_ids: ["wellness-weekend-purchase"],
                content_name: "Wellness Weekend Tickets",
              },
            },
          ],
          // Test Events mode: routes to the Meta Events Manager test tab when
          // META_TEST_EVENT_CODE is set; omitted entirely otherwise (live).
          ...(process.env.META_TEST_EVENT_CODE
            ? { test_event_code: process.env.META_TEST_EVENT_CODE }
            : {}),
        }),
      }
    );
  } catch (e) {
    console.error("[Webhook] Meta API error:", e);
  }
}

// ─── GA4 Measurement Protocol ────────────────────────────────────────

async function fireGA4Purchase(value: number, currency: string, transactionId: string) {
  const measurementId = process.env.NEXT_PUBLIC_GA_ID || "G-1BNLVMK3HB";
  const apiSecret = process.env.GA4_API_SECRET;
  if (!apiSecret) return;

  try {
    await fetch(
      `https://www.google-analytics.com/mp/collect?measurement_id=${measurementId}&api_secret=${apiSecret}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          client_id: `webhook_${Date.now()}`,
          events: [
            {
              name: "purchase",
              params: {
                value,
                currency,
                // GA4 dedupes purchases by transaction_id — carry the raw Square
                // order id, which the client GA4 purchase sends too, so the
                // browser and this server failsafe collapse to one purchase.
                transaction_id: transactionId,
                items: [{
                  item_id: "wellness-weekend-purchase",
                  item_name: "Wellness Weekend Tickets",
                  quantity: 1,
                  price: value,
                }],
                engagement_time_msec: "100",
                session_id: String(Math.floor(Date.now() / 1000)),
              },
            },
          ],
        }),
      }
    );
  } catch (e) {
    console.error("[Webhook] GA4 API error:", e);
  }
}

// ─── Save order to DB + record referral ─────────────────────────────

interface LineItemSummary {
  name: string;
  category: string;
  quantity: number;
  priceCents: number;
}

interface SquareOrderContext {
  referralCode: string | null;
  lineItems: LineItemSummary[];
  memberId: number | null;
  redemptionId: number | null;
}

type OrderInsertOutcome = "inserted" | "duplicate";

const MAX_POINTS_PER_PAYMENT = 1500;

function parseMetadataId(value: string | null | undefined): number | null {
  if (value == null) return null;
  if (!/^\d+$/.test(value)) return null;
  const parsed = Number(value);
  return Number.isSafeInteger(parsed) && parsed > 0 ? parsed : null;
}

async function getSquareOrderContext(
  squareOrderId: string | undefined,
): Promise<SquareOrderContext> {
  if (!squareOrderId) {
    return {
      referralCode: null,
      lineItems: [],
      memberId: null,
      redemptionId: null,
    };
  }

  const client = getSquareClient();
  const orderRes = await client.orders.get({ orderId: squareOrderId });
  const order = orderRes.order;
  if (!order) {
    throw new Error(`Square order ${squareOrderId} was not found`);
  }

  const memberId = parseMetadataId(order.metadata?.member_id);
  const redemptionId = parseMetadataId(order.metadata?.member_redemption_id);
  if (order.metadata?.member_id != null && memberId == null) {
    throw new Error("Square order has invalid member metadata");
  }
  if (order.metadata?.member_redemption_id != null && redemptionId == null) {
    throw new Error("Square order has invalid redemption metadata");
  }
  if (redemptionId != null && memberId == null) {
    throw new Error("Square order redemption is missing its member binding");
  }

  const referralCode = order.referenceId?.startsWith("ref:")
    ? order.referenceId.slice(4)
    : null;
  const lineItems = (order.lineItems || []).map((lineItem) => ({
    name: lineItem.name || "Unknown",
    category: lineItem.catalogObjectId ? "item" : "custom",
    quantity: Number(lineItem.quantity || 1),
    priceCents: Number(lineItem.totalMoney?.amount || 0),
  }));

  return { referralCode, lineItems, memberId, redemptionId };
}

async function saveOrderToDB(
  squarePaymentId: string,
  squareOrderId: string | undefined,
  amountCents: number,
  currency: string,
  customerEmail: string | undefined,
): Promise<OrderInsertOutcome> {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    throw new Error("DATABASE_URL is not set; webhook idempotency is unavailable");
  }

  const sql = neon(dbUrl);
  const { referralCode, lineItems, memberId, redemptionId } =
    await getSquareOrderContext(squareOrderId);

  // A redemption is merely reserved when the payment link is created. Only a
  // signed COMPLETED payment may finalize it, and the order metadata binds the
  // redemption to the same authenticated member that reserved it.
  if (memberId != null && redemptionId != null) {
    const redemptionRows = await sql`
      UPDATE member_redemptions AS redemption
      SET status = 'used', used_at = COALESCE(redemption.used_at, NOW())
      FROM members AS member
      WHERE redemption.id = ${redemptionId}
        AND redemption.member_code = member.code
        AND member.id = ${memberId}
        AND redemption.status IN ('pending', 'reserved', 'used')
      RETURNING redemption.id
    `;
    if (redemptionRows.length === 0) {
      throw new Error("Completed payment redemption/member binding did not match");
    }
  }

  // Loyalty credit is based only on Square's completed payment amount. A
  // server-set member_id in Square order metadata establishes ownership, and a
  // unique payment id makes retries idempotent.
  const pointsToAward = Math.min(
    Math.floor(amountCents / 100),
    MAX_POINTS_PER_PAYMENT,
  );
  if (memberId != null && pointsToAward > 0) {
    await sql`
      CREATE TABLE IF NOT EXISTS member_square_purchase_events (
        id SERIAL PRIMARY KEY,
        member_id INTEGER NOT NULL,
        square_payment_id VARCHAR(100) NOT NULL UNIQUE,
        square_order_id VARCHAR(100),
        points_awarded INTEGER NOT NULL,
        earned_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
      )
    `;
    await sql`
      WITH new_event AS (
        INSERT INTO member_square_purchase_events (
          member_id,
          square_payment_id,
          square_order_id,
          points_awarded
        )
        SELECT id, ${squarePaymentId}, ${squareOrderId ?? null}, ${pointsToAward}
        FROM members
        WHERE id = ${memberId}
        ON CONFLICT (square_payment_id) DO NOTHING
        RETURNING member_id, points_awarded
      )
      UPDATE members AS member
      SET points_balance = member.points_balance + new_event.points_awarded
      FROM new_event
      WHERE member.id = new_event.member_id
    `;
  }

  // The order insert is the idempotency gate. If a referral applies, record it
  // in the same statement/transaction so any DB failure rolls both writes back
  // and reaches the route's 500 response rather than masquerading as a 200.
  if (referralCode) {
    const rows = await sql`
      WITH inserted_order AS (
        INSERT INTO orders (square_payment_id, square_order_id, amount_cents, currency, customer_email, referral_code, line_items, status)
        VALUES (${squarePaymentId}, ${squareOrderId ?? null}, ${amountCents}, ${currency}, ${customerEmail ?? null}, ${referralCode}, ${JSON.stringify(lineItems)}, 'completed')
        ON CONFLICT (square_payment_id) DO NOTHING
        RETURNING id
      ), inserted_referral AS (
        INSERT INTO referral_events (affiliate_code, event_type, order_id, order_amount_cents, commission_cents, email)
        SELECT
          ${referralCode},
          'purchase',
          ${squareOrderId ?? null},
          ${amountCents},
          ROUND(${amountCents} * affiliate.commission_pct / 100.0)::integer,
          ${customerEmail ?? null}
        FROM affiliates AS affiliate
        CROSS JOIN inserted_order
        WHERE affiliate.code = ${referralCode}
          AND affiliate.status = 'active'
        RETURNING id
      )
      SELECT EXISTS (SELECT 1 FROM inserted_order) AS inserted
    `;
    return rows[0]?.inserted ? "inserted" : "duplicate";
  }

  const insertedRows = await sql`
    INSERT INTO orders (square_payment_id, square_order_id, amount_cents, currency, customer_email, referral_code, line_items, status)
    VALUES (${squarePaymentId}, ${squareOrderId ?? null}, ${amountCents}, ${currency}, ${customerEmail ?? null}, NULL, ${JSON.stringify(lineItems)}, 'completed')
    ON CONFLICT (square_payment_id) DO NOTHING
    RETURNING id
  `;
  return insertedRows.length > 0 ? "inserted" : "duplicate";
}

// ─── Route Handler ───────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("x-square-hmacsha256-signature");
    const signatureKey = process.env.SQUARE_WEBHOOK_SIGNATURE_KEY;
    const notificationUrl = process.env.SQUARE_WEBHOOK_URL || "https://www.wellnessweekendak.com/api/square/webhook";

    // Payment events must always be authenticated. A missing server key is a
    // deployment error, never permission to accept unsigned order data.
    if (!signatureKey) {
      console.error("[Webhook] SQUARE_WEBHOOK_SIGNATURE_KEY is not configured");
      return NextResponse.json(
        { error: "Webhook verification is not configured" },
        { status: 500 },
      );
    }
    if (!signature) {
      console.error("[Webhook] Missing Square signature");
      return NextResponse.json({ error: "Invalid signature" }, { status: 403 });
    }

    let isValid = false;
    try {
      isValid = await WebhooksHelper.verifySignature({
        requestBody: rawBody,
        signatureHeader: signature,
        signatureKey,
        notificationUrl,
      });
    } catch (error) {
      console.error("[Webhook] Square signature verification failed:", error);
    }
    if (!isValid) {
      console.error("[Webhook] Invalid Square signature");
      return NextResponse.json({ error: "Invalid signature" }, { status: 403 });
    }

    const payload: SquareWebhookPayload = JSON.parse(rawBody);

    // Square emits payment.updated (not payment.completed); COMPLETED status is
    // the completion filter within that event stream.
    if (payload.type !== "payment.updated") {
      return NextResponse.json({ received: true });
    }

    const payment = payload.data?.object?.payment;
    if (!payment || payment.status !== "COMPLETED") {
      return NextResponse.json({ received: true });
    }
    if (!payment.id) {
      throw new Error("Completed Square payment is missing its id");
    }

    const amountCents = payment.amount_money?.amount || 0;
    const currency = payment.amount_money?.currency || "USD";
    const value = amountCents / 100;
    const email = payment.buyer_email_address;
    const orderId = payment.order_id;

    // Shared derivation rule — MUST stay byte-identical to the client side in
    // app/thank-you/ThankYouTracker.tsx: event_id = `purchase_${squareOrderId}`.
    // Identical ids let the browser Purchase and this server Purchase dedupe on
    // Meta/TikTok. Random fallback only when Square omits order_id (no client
    // id to match anyway), so the conversion still fires.
    const purchaseEventId = orderId
      ? `purchase_${orderId}`
      : `webhook_purchase_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
    // GA4 dedupes by transaction_id — the raw Square order id, matching the
    // client GA4 purchase.
    const transactionId = orderId || `wh_${Date.now()}`;

    console.log(
      `[Webhook] payment.updated COMPLETED — $${value} ${currency}`,
      payment.id,
      email || "(no email)"
    );

    // Idempotency gate: persist the order first and fire conversions ONLY when
    // this delivery actually created the row. Square retries deliveries and a
    // payment emits multiple payment.updated events; gating on the insert keeps
    // every Meta/TikTok/GA4 conversion to exactly one per order.
    const outcome = await saveOrderToDB(
      payment.id,
      orderId,
      amountCents,
      currency,
      email,
    );
    if (outcome === "duplicate") {
      return NextResponse.json({ received: true, duplicate: true });
    }

    // Hash email for Meta/TikTok server-side matching (never send raw PII).
    const emailHash = email ? await sha256(email) : undefined;

    await Promise.allSettled([
      fireTikTokPurchase(value, currency, purchaseEventId, emailHash),
      fireMetaPurchase(value, currency, purchaseEventId, emailHash),
      fireGA4Purchase(value, currency, transactionId),
    ]);

    return NextResponse.json({ received: true, tracked: true });
  } catch (error) {
    console.error("[Webhook] Error:", error);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}
