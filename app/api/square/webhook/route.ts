import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/**
 * Square Webhook handler — listens for payment.completed events and fires
 * server-side conversion events to TikTok Events API and Meta Conversions API.
 *
 * This is the failsafe: even if the user closes their browser after paying
 * on Square (and never hits /thank-you), this webhook still fires the
 * purchase conversion.
 *
 * Setup in Square Dashboard:
 *   Webhooks → Create Subscription → URL: https://wellnessweekendak.com/api/square/webhook
 *   Events: payment.completed
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

// ─── TikTok Events API ───────────────────────────────────────────────

async function fireTikTokPurchase(value: number, currency: string, email?: string) {
  const accessToken = process.env.TIKTOK_ACCESS_TOKEN;
  const pixelId = process.env.TIKTOK_PIXEL_ID;
  if (!accessToken || !pixelId) return;

  try {
    await fetch("https://business-api.tiktok.com/open_api/v1.3/event/track/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Access-Token": accessToken,
      },
      body: JSON.stringify({
        pixel_code: pixelId,
        event: "CompletePayment",
        event_id: `webhook_purchase_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
        timestamp: new Date().toISOString(),
        context: {
          page: { url: "https://wellnessweekendak.com/thank-you" },
          ...(email ? { user: { email } } : {}),
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

async function fireMetaPurchase(value: number, currency: string, email?: string) {
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
              event_id: `webhook_purchase_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
              event_source_url: "https://wellnessweekendak.com/thank-you",
              action_source: "website",
              user_data: {
                ...(email ? { em: [email] } : {}),
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
        }),
      }
    );
  } catch (e) {
    console.error("[Webhook] Meta API error:", e);
  }
}

// ─── GA4 Measurement Protocol ────────────────────────────────────────

async function fireGA4Purchase(value: number, currency: string) {
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
                transaction_id: `wh_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
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

// ─── Route Handler ───────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const payload: SquareWebhookPayload = await req.json();

    // Only process payment.completed events
    if (payload.type !== "payment.completed") {
      return NextResponse.json({ received: true });
    }

    const payment = payload.data?.object?.payment;
    if (!payment || payment.status !== "COMPLETED") {
      return NextResponse.json({ received: true });
    }

    const amountCents = payment.amount_money?.amount || 0;
    const currency = payment.amount_money?.currency || "USD";
    const value = amountCents / 100;
    const email = payment.buyer_email_address;

    console.log(
      `[Webhook] payment.completed — $${value} ${currency}`,
      payment.id,
      email || "(no email)"
    );

    // Fire conversion events to all 3 platforms
    await Promise.allSettled([
      fireTikTokPurchase(value, currency, email),
      fireMetaPurchase(value, currency, email),
      fireGA4Purchase(value, currency),
    ]);

    return NextResponse.json({ received: true, tracked: true });
  } catch (error) {
    console.error("[Webhook] Error:", error);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}
