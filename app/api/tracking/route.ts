import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/**
 * Server-side tracking endpoint — receives events from the client and fans out
 * to TikTok Events API and Meta Conversions API for redundant signal.
 *
 * Key: uses the SAME event_id as the client-side pixel for deduplication.
 * Also receives pre-hashed email, fbc/fbp, and ttclid for match rate.
 */

interface TrackingPayload {
  event: string;
  eventId: string; // shared with client pixel for deduplication
  value?: number;
  currency?: string;
  contentId?: string;
  contentName?: string;
  contentType?: string;
  quantity?: number;
  email?: string;        // raw email (also used for TikTok)
  hashedEmail?: string;  // SHA-256 hashed email for Meta
  hashedPhone?: string;  // SHA-256 hashed phone for Meta
  phone?: string;        // raw phone for TikTok
  description?: string;
  url?: string;
  userAgent?: string;
  fbc?: string;          // Meta click ID cookie
  fbp?: string;          // Meta browser ID cookie
  ttclid?: string;       // TikTok click ID
}

// ─── TikTok Events API ──────────────────────────────────────────────

async function sendTikTokEvent(payload: TrackingPayload, ip: string) {
  const accessToken = process.env.TIKTOK_ACCESS_TOKEN;
  const pixelId = process.env.TIKTOK_PIXEL_ID;

  if (!accessToken || !pixelId) return;

  // Map our event names to TikTok standard events
  const eventMap: Record<string, string> = {
    Lead: "CompleteRegistration",
    SubmitForm: "SubmitForm",
    AddToCart: "AddToCart",
    InitiateCheckout: "InitiateCheckout",
    Purchase: "CompletePayment",
    CompletePayment: "CompletePayment",
    ViewContent: "ViewContent",
    PageView: "PageView",
  };

  const tiktokEvent = eventMap[payload.event] || payload.event;

  const body = {
    pixel_code: pixelId,
    event: tiktokEvent,
    event_id: payload.eventId, // MUST match client pixel event_id for dedup
    timestamp: new Date().toISOString(),
    context: {
      user_agent: payload.userAgent || "",
      ip: ip,
      page: {
        url: payload.url || "",
      },
      user: {
        ...(payload.email ? { email: payload.email.trim().toLowerCase() } : {}),
        ...(payload.phone ? { phone_number: payload.phone.replace(/\D/g, "") } : {}),
        ...(payload.ttclid ? { ttclid: payload.ttclid } : {}),
      },
    },
    properties: {
      ...(payload.value
        ? { value: payload.value, currency: payload.currency || "USD" }
        : {}),
      ...(payload.contentId ? { content_id: payload.contentId } : {}),
      ...(payload.contentName ? { content_name: payload.contentName } : {}),
      ...(payload.contentType ? { content_type: payload.contentType } : {}),
      ...(payload.quantity ? { quantity: payload.quantity } : {}),
      ...(payload.description ? { description: payload.description } : {}),
    },
  };

  try {
    const res = await fetch(
      "https://business-api.tiktok.com/open_api/v1.3/event/track/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Access-Token": accessToken,
        },
        body: JSON.stringify(body),
      }
    );

    if (!res.ok) {
      const errorText = await res.text();
      console.error(
        "[Tracking] TikTok Events API error:",
        res.status,
        errorText
      );
    }
  } catch (e) {
    console.error("[Tracking] TikTok Events API request failed:", e);
  }
}

// ─── Meta Conversions API ────────────────────────────────────────────

async function sendMetaEvent(payload: TrackingPayload, ip: string) {
  const accessToken = process.env.META_ACCESS_TOKEN;
  const pixelId = process.env.META_PIXEL_ID;

  if (!accessToken || !pixelId) return;

  // Map our event names to Meta standard events
  const eventMap: Record<string, string> = {
    Lead: "Lead",
    SubmitForm: "Lead",
    AddToCart: "AddToCart",
    InitiateCheckout: "InitiateCheckout",
    Purchase: "Purchase",
    CompletePayment: "Purchase",
    ViewContent: "ViewContent",
    PageView: "PageView",
  };

  const metaEvent = eventMap[payload.event] || payload.event;

  // Build user_data with hashed PII + click identifiers
  const userData: Record<string, unknown> = {
    client_ip_address: ip,
    client_user_agent: payload.userAgent || "",
  };

  // Use pre-hashed email/phone for CAPI (Meta requires SHA-256)
  if (payload.hashedEmail) userData.em = [payload.hashedEmail];
  if (payload.hashedPhone) userData.ph = [payload.hashedPhone];

  // Click ID cookies — critical for match rate
  if (payload.fbc) userData.fbc = payload.fbc;
  if (payload.fbp) userData.fbp = payload.fbp;

  const eventData: Record<string, unknown> = {
    event_name: metaEvent,
    event_time: Math.floor(Date.now() / 1000),
    event_id: payload.eventId, // MUST match client pixel eventID for dedup
    event_source_url: payload.url || "",
    action_source: "website",
    user_data: userData,
  };

  if (payload.value || payload.contentId) {
    eventData.custom_data = {
      ...(payload.value
        ? { value: payload.value, currency: payload.currency || "USD" }
        : {}),
      ...(payload.contentId ? { content_ids: [payload.contentId] } : {}),
      ...(payload.contentName ? { content_name: payload.contentName } : {}),
      ...(payload.contentType ? { content_type: payload.contentType } : {}),
      ...(payload.quantity ? { num_items: payload.quantity } : {}),
    };
  }

  try {
    const res = await fetch(
      `https://graph.facebook.com/v21.0/${pixelId}/events?access_token=${accessToken}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: [eventData] }),
      }
    );

    if (!res.ok) {
      const errorText = await res.text();
      console.error(
        "[Tracking] Meta Conversions API error:",
        res.status,
        errorText
      );
    }
  } catch (e) {
    console.error("[Tracking] Meta Conversions API request failed:", e);
  }
}

// ─── Route Handler ───────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const payload: TrackingPayload = await req.json();

    if (!payload.event) {
      return NextResponse.json(
        { error: "Event name required" },
        { status: 400 }
      );
    }

    // Get client IP from headers
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "0.0.0.0";

    // Fan out to both APIs concurrently
    await Promise.allSettled([
      sendTikTokEvent(payload, ip),
      sendMetaEvent(payload, ip),
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[Tracking] Route error:", error);
    return NextResponse.json(
      { error: "Tracking failed" },
      { status: 500 }
    );
  }
}
