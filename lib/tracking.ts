/**
 * Unified tracking library for TikTok + Meta pixels and server-side Events API.
 *
 * Client-side: fires pixel events via window.ttq / window.fbq
 * Server-side: POST /api/tracking for redundant server events
 */

// ─── Types ───────────────────────────────────────────────────────────

declare global {
  interface Window {
    ttq: {
      page: () => void;
      track: (event: string, params?: Record<string, unknown>) => void;
      identify: (params: Record<string, unknown>) => void;
    };
    fbq: (...args: unknown[]) => void;
  }
}

export interface TrackingEventData {
  value?: number;        // monetary value in dollars
  currency?: string;     // e.g. "USD"
  contentId?: string;    // product/variation ID
  contentName?: string;  // product name
  contentType?: string;  // e.g. "product"
  quantity?: number;
  email?: string;        // for server-side matching
  description?: string;  // form type etc.
}

type TrackingEvent =
  | "PageView"
  | "Lead"
  | "AddToCart"
  | "InitiateCheckout"
  | "CompletePayment"     // TikTok
  | "CompleteRegistration" // TikTok lead event
  | "Purchase"           // Meta
  | "SubmitForm"
  | "ViewContent";

// ─── Client-side pixel firing ────────────────────────────────────────

function fireTikTok(event: TrackingEvent, data?: TrackingEventData) {
  if (typeof window === "undefined" || !window.ttq) return;

  const params: Record<string, unknown> = {};
  if (data?.value) params.value = data.value;
  if (data?.currency) params.currency = data.currency || "USD";
  if (data?.contentId) params.content_id = data.contentId;
  if (data?.contentName) params.content_name = data.contentName;
  if (data?.contentType) params.content_type = data.contentType;
  if (data?.quantity) params.quantity = data.quantity;
  if (data?.description) params.description = data.description;

  try {
    window.ttq.track(event, Object.keys(params).length > 0 ? params : undefined);
  } catch (e) {
    console.warn("[Tracking] TikTok pixel error:", e);
  }
}

function fireMeta(event: string, data?: TrackingEventData) {
  if (typeof window === "undefined" || !window.fbq) return;

  const params: Record<string, unknown> = {};
  if (data?.value) params.value = data.value;
  if (data?.currency) params.currency = data.currency || "USD";
  if (data?.contentId) params.content_ids = [data.contentId];
  if (data?.contentName) params.content_name = data.contentName;
  if (data?.contentType) params.content_type = data.contentType;
  if (data?.quantity) params.num_items = data.quantity;

  try {
    window.fbq("track", event, Object.keys(params).length > 0 ? params : undefined);
  } catch (e) {
    console.warn("[Tracking] Meta pixel error:", e);
  }
}

// ─── Server-side redundant event ─────────────────────────────────────

async function fireServerEvent(event: string, data?: TrackingEventData) {
  try {
    await fetch("/api/tracking", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        event,
        ...data,
        url: typeof window !== "undefined" ? window.location.href : undefined,
        userAgent: typeof navigator !== "undefined" ? navigator.userAgent : undefined,
      }),
    });
  } catch (e) {
    console.warn("[Tracking] Server event error:", e);
  }
}

// ─── Public API ──────────────────────────────────────────────────────

/** Track a lead / newsletter signup */
export function trackLead(data?: TrackingEventData) {
  fireTikTok("CompleteRegistration", data);
  fireMeta("Lead", data);
  fireServerEvent("Lead", data);
}

/** Track form submission (vendor/volunteer applications) */
export function trackFormSubmit(data?: TrackingEventData) {
  fireTikTok("SubmitForm", data);
  fireMeta("Lead", data);
  fireServerEvent("SubmitForm", data);
}

/** Track add-to-cart */
export function trackAddToCart(data?: TrackingEventData) {
  fireTikTok("AddToCart", data);
  fireMeta("AddToCart", data);
  fireServerEvent("AddToCart", data);
}

/** Track checkout initiation */
export function trackInitiateCheckout(data?: TrackingEventData) {
  fireTikTok("InitiateCheckout", data);
  fireMeta("InitiateCheckout", data);
  fireServerEvent("InitiateCheckout", data);
}

/** Track completed purchase (fires on thank-you page) */
export function trackPurchase(data?: TrackingEventData) {
  fireTikTok("CompletePayment", data);
  fireMeta("Purchase", data);
  fireServerEvent("Purchase", data);
}

/** Track content view */
export function trackViewContent(data?: TrackingEventData) {
  fireTikTok("ViewContent", data);
  fireMeta("ViewContent", data);
}
