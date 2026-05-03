/**
 * Unified tracking library for TikTok + Meta pixels and server-side Events API.
 *
 * Key match-rate optimizations:
 *  - Shared event_id between client pixel + server CAPI (deduplication)
 *  - Email hashing (SHA-256) for server-side user matching
 *  - TikTok identify() call with email for Advanced Matching
 *  - Meta Advanced Matching via fbq('init', ..., { em }) 
 *  - fbc/fbp cookie forwarding to Meta CAPI
 *  - ttclid forwarding to TikTok CAPI
 */

// ─── Types ───────────────────────────────────────────────────────────

declare global {
  interface Window {
    ttq: {
      page: () => void;
      track: (event: string, params?: Record<string, unknown>, opts?: { event_id: string }) => void;
      identify: (params: Record<string, unknown>) => void;
    };
    fbq: (...args: unknown[]) => void;
    gtag: (...args: unknown[]) => void;
    dataLayer: unknown[];
  }
}

export interface TrackingEventData {
  value?: number;        // monetary value in dollars
  currency?: string;     // e.g. "USD"
  contentId?: string;    // product/variation ID
  contentName?: string;  // product name
  contentType?: string;  // e.g. "product"
  quantity?: number;
  email?: string;        // for server-side matching + Advanced Matching
  phone?: string;        // for server-side matching
  description?: string;  // form type etc.
}

// ─── Utilities ───────────────────────────────────────────────────────

/** Generate a unique event ID shared between client pixel + server CAPI */
function generateEventId(eventName: string): string {
  return `${eventName}_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

/** SHA-256 hash a string (for server-side PII hashing) */
async function sha256(input: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(input.trim().toLowerCase());
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

/** Read a cookie value by name */
function getCookie(name: string): string | undefined {
  if (typeof document === "undefined") return undefined;
  const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
  return match ? decodeURIComponent(match[2]) : undefined;
}

/** Get ttclid from URL params or cookie */
function getTtclid(): string | undefined {
  if (typeof window === "undefined") return undefined;
  const params = new URLSearchParams(window.location.search);
  return params.get("ttclid") || getCookie("ttclid") || undefined;
}

/** Get fbclid / fbc / fbp for Meta matching */
function getMetaClickIds(): { fbc?: string; fbp?: string } {
  if (typeof window === "undefined") return {};
  
  // fbp is the browser ID cookie set by the pixel
  const fbp = getCookie("_fbp") || undefined;
  
  // fbc can be the cookie or constructed from fbclid URL param
  let fbc = getCookie("_fbc") || undefined;
  if (!fbc) {
    const fbclid = new URLSearchParams(window.location.search).get("fbclid");
    if (fbclid) {
      fbc = `fb.1.${Date.now()}.${fbclid}`;
    }
  }
  
  return { fbc, fbp };
}

// ─── Client-side pixel firing ────────────────────────────────────────

function fireTikTok(event: string, eventId: string, data?: TrackingEventData) {
  if (typeof window === "undefined" || !window.ttq) return;

  // Identify user for Advanced Matching if email provided
  if (data?.email) {
    try {
      window.ttq.identify({
        email: data.email.trim().toLowerCase(),
        ...(data.phone ? { phone_number: data.phone } : {}),
      });
    } catch (e) {
      console.warn("[Tracking] TikTok identify error:", e);
    }
  }

  const params: Record<string, unknown> = {};
  if (data?.value) params.value = data.value;
  if (data?.currency) params.currency = data.currency || "USD";
  if (data?.contentId) params.content_id = data.contentId;
  if (data?.contentName) params.content_name = data.contentName;
  if (data?.contentType) params.content_type = data.contentType;
  if (data?.quantity) params.quantity = data.quantity;
  if (data?.description) params.description = data.description;

  try {
    window.ttq.track(
      event,
      Object.keys(params).length > 0 ? params : undefined,
      { event_id: eventId }
    );
  } catch (e) {
    console.warn("[Tracking] TikTok pixel error:", e);
  }
}

function fireMeta(event: string, eventId: string, data?: TrackingEventData) {
  if (typeof window === "undefined" || !window.fbq) return;

  const params: Record<string, unknown> = {
    eventID: eventId, // Meta uses eventID in the client pixel for dedup
  };
  if (data?.value) params.value = data.value;
  if (data?.currency) params.currency = data.currency || "USD";
  if (data?.contentId) params.content_ids = [data.contentId];
  if (data?.contentName) params.content_name = data.contentName;
  if (data?.contentType) params.content_type = data.contentType;
  if (data?.quantity) params.num_items = data.quantity;

  try {
    window.fbq("track", event, params, { eventID: eventId });
  } catch (e) {
    console.warn("[Tracking] Meta pixel error:", e);
  }
}

function fireGA(event: string, eventId: string, data?: TrackingEventData) {
  if (typeof window === "undefined" || !window.gtag) return;

  const params: Record<string, unknown> = {
    event_id: eventId,
  };
  if (data?.value) params.value = data.value;
  if (data?.currency) params.currency = data.currency || "USD";
  if (data?.contentId) params.item_id = data.contentId;
  if (data?.contentName) params.item_name = data.contentName;
  if (data?.quantity) params.quantity = data.quantity;
  if (data?.description) params.description = data.description;

  try {
    window.gtag("event", event, params);
  } catch (e) {
    console.warn("[Tracking] GA4 event error:", e);
  }
}

// ─── Server-side redundant event ─────────────────────────────────────

async function fireServerEvent(
  event: string,
  eventId: string,
  data?: TrackingEventData
) {
  try {
    // Hash email for server-side matching
    const hashedEmail = data?.email
      ? await sha256(data.email)
      : undefined;
    
    const hashedPhone = data?.phone
      ? await sha256(data.phone.replace(/\D/g, ""))
      : undefined;

    const { fbc, fbp } = getMetaClickIds();
    const ttclid = getTtclid();

    await fetch("/api/tracking", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        event,
        eventId,
        ...data,
        hashedEmail,
        hashedPhone,
        fbc,
        fbp,
        ttclid,
        url: typeof window !== "undefined" ? window.location.href : undefined,
        userAgent:
          typeof navigator !== "undefined" ? navigator.userAgent : undefined,
      }),
    });
  } catch (e) {
    console.warn("[Tracking] Server event error:", e);
  }
}

// ─── Event mapping ──────────────────────────────────────────────────

const TIKTOK_EVENT_MAP: Record<string, string> = {
  Lead: "CompleteRegistration",
  SubmitForm: "SubmitForm",
  AddToCart: "AddToCart",
  InitiateCheckout: "InitiateCheckout",
  Purchase: "CompletePayment",
  ViewContent: "ViewContent",
};

const META_EVENT_MAP: Record<string, string> = {
  Lead: "Lead",
  SubmitForm: "Lead",
  AddToCart: "AddToCart",
  InitiateCheckout: "InitiateCheckout",
  Purchase: "Purchase",
  ViewContent: "ViewContent",
};

const GA_EVENT_MAP: Record<string, string> = {
  Lead: "generate_lead",
  SubmitForm: "form_submit",
  AddToCart: "add_to_cart",
  InitiateCheckout: "begin_checkout",
  Purchase: "purchase",
  ViewContent: "view_item",
};

/** Core tracking function — fires both pixels + server CAPI with shared event_id */
function trackEvent(
  internalEvent: string,
  data?: TrackingEventData,
  options?: { skipServer?: boolean }
) {
  const eventId = generateEventId(internalEvent);
  const tiktokEvent = TIKTOK_EVENT_MAP[internalEvent] || internalEvent;
  const metaEvent = META_EVENT_MAP[internalEvent] || internalEvent;
  const gaEvent = GA_EVENT_MAP[internalEvent] || internalEvent;

  // Client-side pixels (immediate)
  fireTikTok(tiktokEvent, eventId, data);
  fireMeta(metaEvent, eventId, data);
  fireGA(gaEvent, eventId, data);

  // Server-side CAPI (async, fire-and-forget)
  if (!options?.skipServer) {
    fireServerEvent(internalEvent, eventId, data);
  }
}

// ─── Public API ──────────────────────────────────────────────────────

/** Track a lead / newsletter signup */
export function trackLead(data?: TrackingEventData) {
  trackEvent("Lead", data);
}

/** Track form submission (vendor/volunteer applications) */
export function trackFormSubmit(data?: TrackingEventData) {
  trackEvent("SubmitForm", data);
}

/** Track add-to-cart */
export function trackAddToCart(data?: TrackingEventData) {
  trackEvent("AddToCart", data);
}

/** Track checkout initiation */
export function trackInitiateCheckout(data?: TrackingEventData) {
  trackEvent("InitiateCheckout", data);
}

/** Track completed purchase (fires on thank-you page) */
export function trackPurchase(data?: TrackingEventData) {
  trackEvent("Purchase", data);
}

/** Track content view */
export function trackViewContent(data?: TrackingEventData) {
  trackEvent("ViewContent", { ...data }, { skipServer: true });
}
