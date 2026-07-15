import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/**
 * Server-side tracking endpoint — receives events from the client and fans out
 * to TikTok Events API and Meta Conversions API for redundant signal.
 *
 * Sends: event_id (dedup), hashed email/phone, IP, user agent, click IDs,
 * external_id, page URL, and all custom_data for maximum match rate.
 */

interface TrackingPayload {
  event: string;
  eventId: string;
  value?: number;
  currency?: string;
  contentId?: string;
  contentName?: string;
  contentType?: string;
  quantity?: number;
  email?: string;
  hashedEmail?: string;
  hashedPhone?: string;
  phone?: string;
  description?: string;
  transactionId?: string; // GA4 purchase dedup key (Square order id)
  url?: string;
  userAgent?: string;
  fbc?: string;
  fbp?: string;
  ttclid?: string;
  externalId?: string;    // unique visitor ID for cross-device matching
  fbclid?: string;        // raw Facebook click ID
  gclid?: string;         // Google click ID (for GA4 server-side)
  contents?: { contentId: string; quantity: number; price?: number; name?: string }[];
}

// ─── Utilities ───────────────────────────────────────────────────────

/** Server-side SHA-256 hash */
async function sha256(input: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(input.trim().toLowerCase());
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

/**
 * Hash a value only if it is not already a SHA-256 hex digest. Newer clients
 * pre-hash external_id so it matches the browser pixels; older clients still
 * send it raw. A 64-char hex string is treated as already hashed.
 */
async function ensureHashed(value: string): Promise<string> {
  return /^[a-f0-9]{64}$/i.test(value) ? value.toLowerCase() : await sha256(value);
}

// ─── Abuse controls ──────────────────────────────────────────────────

/** Hosts permitted to POST events. sendBeacon may omit Origin/Referer, which
 *  is handled separately in isAllowedOrigin (missing header = allowed). */
const ALLOWED_HOSTS = new Set([
  "wellnessweekendak.com",
  "www.wellnessweekendak.com",
  "localhost",
  "127.0.0.1",
]);

/**
 * Reject cross-origin abuse. Returns false ONLY when an Origin (or Referer
 * fallback) is present and its host is not allow-listed. Requests with no
 * Origin/Referer are allowed — sendBeacon can legitimately omit both, and
 * dropping them would break real tracking. Fails open on unparseable headers.
 */
function isAllowedOrigin(req: NextRequest): boolean {
  const source = req.headers.get("origin") || req.headers.get("referer");
  if (!source) return true;
  try {
    return ALLOWED_HOSTS.has(new URL(source).hostname);
  } catch {
    return true;
  }
}

// Light per-IP sliding-window limiter. Module-level Map survives across
// invocations under Fluid Compute warm reuse; a cold start simply resets it.
const RATE_LIMIT_MAX = 60;
const RATE_LIMIT_WINDOW_MS = 60_000;
const rateLimitHits = new Map<string, number[]>();

/**
 * Sliding-window per-IP limiter, 60 events/min. Returns true when the request
 * is allowed. Fail-open by contract: any internal error returns true so a
 * limiter bug can never block a real conversion event.
 */
function checkRateLimit(ip: string): boolean {
  try {
    const now = Date.now();
    const windowStart = now - RATE_LIMIT_WINDOW_MS;

    // Opportunistic sweep so the Map cannot grow without bound across many IPs.
    if (rateLimitHits.size > 10_000) {
      for (const [key, times] of rateLimitHits) {
        if (times.length === 0 || times[times.length - 1] <= windowStart) {
          rateLimitHits.delete(key);
        }
      }
    }

    const hits = (rateLimitHits.get(ip) || []).filter((t) => t > windowStart);
    if (hits.length >= RATE_LIMIT_MAX) {
      rateLimitHits.set(ip, hits);
      return false;
    }
    hits.push(now);
    rateLimitHits.set(ip, hits);
    return true;
  } catch {
    return true;
  }
}

// ─── TikTok Events API ──────────────────────────────────────────────

async function sendTikTokEvent(payload: TrackingPayload, ip: string) {
  const accessToken = process.env.TIKTOK_ACCESS_TOKEN;
  const pixelId = process.env.TIKTOK_PIXEL_ID;

  if (!accessToken || !pixelId) return;

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

  // Build contents array for commerce events
  const contents = payload.contents?.map((c) => ({
    content_id: c.contentId,
    content_name: c.name || c.contentId,
    content_type: "product",
    quantity: c.quantity,
    price: c.price,
  })) || (payload.contentId ? [{
    content_id: payload.contentId,
    content_name: payload.contentName || payload.contentId,
    content_type: payload.contentType || "product",
    quantity: payload.quantity || 1,
    price: payload.value,
  }] : undefined);

  // Hash user data for TikTok (requires SHA-256 for email, phone, external_id)
  const ttHashedEmail = payload.hashedEmail
    || (payload.email ? await sha256(payload.email) : undefined);
    
  let ttHashedPhone = payload.hashedPhone;
  if (!ttHashedPhone && payload.phone) {
    const e164 = payload.phone.replace(/\D/g, "").length === 10 
      ? `+1${payload.phone.replace(/\D/g, "")}` 
      : `+${payload.phone.replace(/\D/g, "")}`;
    ttHashedPhone = await sha256(e164);
  }

  const ttHashedExternalId = payload.externalId
    ? await ensureHashed(payload.externalId) : undefined;

  const body = {
    pixel_code: pixelId,
    event: tiktokEvent,
    event_id: payload.eventId,
    timestamp: new Date().toISOString(),
    // Test Events mode: routes this event to the TikTok Events Manager test tab
    // instead of live optimization when TIKTOK_TEST_EVENT_CODE is set.
    ...(process.env.TIKTOK_TEST_EVENT_CODE
      ? { test_event_code: process.env.TIKTOK_TEST_EVENT_CODE }
      : {}),
    context: {
      user_agent: payload.userAgent || "",
      ip: ip,
      page: {
        url: payload.url || "",
        referrer: "",
      },
      user: {
        ...(ttHashedEmail ? { email: ttHashedEmail } : {}),
        ...(ttHashedPhone ? { phone_number: ttHashedPhone } : {}),
        ...(payload.ttclid ? { ttclid: payload.ttclid } : {}),
        ...(ttHashedExternalId ? { external_id: ttHashedExternalId } : {}),
      },
    },
    properties: {
      ...(payload.value ? { value: payload.value, currency: payload.currency || "USD" } : {}),
      ...(payload.contentId ? { content_id: payload.contentId } : {}),
      ...(payload.contentName ? { content_name: payload.contentName } : {}),
      ...(payload.contentType ? { content_type: payload.contentType } : {}),
      ...(payload.quantity ? { quantity: payload.quantity } : {}),
      ...(payload.description ? { description: payload.description } : {}),
      ...(contents ? { contents } : {}),
    },
  };

  try {
    const res = await fetch(
      "https://business-api.tiktok.com/open_api/v1.3/pixel/track/",
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
      console.error("[Tracking] TikTok Events API error:", res.status, errorText);
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

  // Build user_data — every possible matching signal
  const userData: Record<string, unknown> = {
    client_ip_address: ip,
    client_user_agent: payload.userAgent || "",
  };

  // Hashed PII for matching (Meta requires SHA-256 lowercase hex)
  if (payload.hashedEmail) userData.em = [payload.hashedEmail];
  if (payload.hashedPhone) userData.ph = [payload.hashedPhone];

  // Click ID cookies — critical for match rate
  if (payload.fbc) userData.fbc = payload.fbc;
  if (payload.fbp) userData.fbp = payload.fbp;

  // External ID for cross-device matching (Meta requires SHA-256 hash)
  if (payload.externalId) {
    const hashedExternalId = await ensureHashed(payload.externalId);
    userData.external_id = [hashedExternalId];
  }

  // Build content_ids from contents array or single contentId
  const contentIds = payload.contents?.map((c) => c.contentId) ||
    (payload.contentId ? [payload.contentId] : undefined);

  // ALWAYS include custom_data — Meta needs it for Lead, Purchase, etc.
  const customData: Record<string, unknown> = {};
  if (payload.value) customData.value = payload.value;
  customData.currency = payload.currency || "USD";
  if (contentIds) customData.content_ids = contentIds;
  if (payload.contentName) customData.content_name = payload.contentName;
  if (payload.contentType) customData.content_type = payload.contentType;
  if (payload.quantity) customData.num_items = payload.quantity;
  if (payload.description) customData.lead_event_source = payload.description;
  if (payload.contents) {
    customData.contents = payload.contents.map((c) => ({
      id: c.contentId,
      quantity: c.quantity,
      item_price: c.price,
    }));
  }

  const eventData: Record<string, unknown> = {
    event_name: metaEvent,
    event_time: Math.floor(Date.now() / 1000),
    event_id: payload.eventId,
    event_source_url: payload.url || "",
    action_source: "website",
    user_data: userData,
    custom_data: customData,
  };

  try {
    const res = await fetch(
      `https://graph.facebook.com/v21.0/${pixelId}/events?access_token=${accessToken}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Test Events mode: routes this event to the Meta Events Manager test
        // tab instead of live optimization when META_TEST_EVENT_CODE is set.
        body: JSON.stringify({
          data: [eventData],
          ...(process.env.META_TEST_EVENT_CODE
            ? { test_event_code: process.env.META_TEST_EVENT_CODE }
            : {}),
        }),
      }
    );

    if (!res.ok) {
      const errorText = await res.text();
      console.error("[Tracking] Meta Conversions API error:", res.status, errorText);
    }
  } catch (e) {
    console.error("[Tracking] Meta Conversions API request failed:", e);
  }
}

// ─── GA4 Measurement Protocol ────────────────────────────────────────

async function sendGA4Event(payload: TrackingPayload) {
  const measurementId = process.env.NEXT_PUBLIC_GA_ID || "G-1BNLVMK3HB";
  const apiSecret = process.env.GA4_API_SECRET;

  if (!apiSecret) return;

  const gaEventMap: Record<string, string> = {
    Lead: "generate_lead",
    SubmitForm: "form_submit",
    AddToCart: "add_to_cart",
    InitiateCheckout: "begin_checkout",
    Purchase: "purchase",
    CompletePayment: "purchase",
    ViewContent: "view_item",
    PageView: "page_view",
  };

  const gaEvent = gaEventMap[payload.event] || payload.event;

  // Purchases are owned by the browser gtag and backstopped by the Square
  // webhook's Measurement Protocol fire (both carry the same transaction_id).
  // Skip the /api/tracking purchase relay so GA4 does not count the same order
  // a third time.
  if (gaEvent === "purchase") return;

  // Build items array for GA4 (required for ecommerce events)
  const items = payload.contents?.map((c) => ({
    item_id: c.contentId,
    item_name: c.name || c.contentId,
    quantity: c.quantity,
    price: c.price,
  })) || (payload.contentId ? [{
    item_id: payload.contentId,
    item_name: payload.contentName || payload.contentId,
    quantity: payload.quantity || 1,
    price: payload.value,
  }] : undefined);

  const eventParams: Record<string, unknown> = {};
  if (payload.value) eventParams.value = payload.value;
  eventParams.currency = payload.currency || "USD";
  if (items) eventParams.items = items;
  if (payload.description) eventParams.event_category = payload.description;
  if (payload.contentName) eventParams.item_name = payload.contentName;
  // GA4 dedupes purchases by transaction_id (Square order id). Purchase relays
  // return early above, but the mapping stays so any GA4 fire carries the id.
  if (payload.transactionId) eventParams.transaction_id = payload.transactionId;

  // Use externalId as client_id for cross-device, or generate one
  const clientId = payload.externalId || `server_${Date.now()}`;

  const body = {
    client_id: clientId,
    events: [
      {
        name: gaEvent,
        params: {
          ...eventParams,
          event_id: payload.eventId,
          engagement_time_msec: "100",
          session_id: String(Math.floor(Date.now() / 1000)),
        },
      },
    ],
  };

  try {
    const res = await fetch(
      `https://www.google-analytics.com/mp/collect?measurement_id=${measurementId}&api_secret=${apiSecret}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }
    );

    if (!res.ok) {
      const errorText = await res.text();
      console.error("[Tracking] GA4 Measurement Protocol error:", res.status, errorText);
    }
  } catch (e) {
    console.error("[Tracking] GA4 Measurement Protocol request failed:", e);
  }
}

// ─── Route Handler ───────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    // Abuse control: reject events from a foreign Origin/Referer host. Missing
    // headers are allowed so sendBeacon (which can omit them) still works.
    if (!isAllowedOrigin(req)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Get client IP from Vercel/proxy headers
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      req.headers.get("cf-connecting-ip") ||
      "0.0.0.0";

    // Abuse control: light per-IP rate limit. checkRateLimit fails open on any
    // internal error, so a limiter fault forwards the event rather than dropping it.
    if (!checkRateLimit(ip)) {
      return NextResponse.json({ error: "Rate limited" }, { status: 429 });
    }

    const payload: TrackingPayload = await req.json();

    if (!payload.event) {
      return NextResponse.json(
        { error: "Event name required" },
        { status: 400 }
      );
    }

    // Fan out to all 3 APIs concurrently
    await Promise.allSettled([
      sendTikTokEvent(payload, ip),
      sendMetaEvent(payload, ip),
      sendGA4Event(payload),
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
