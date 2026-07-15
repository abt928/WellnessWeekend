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

import Clarity from "@microsoft/clarity";

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
  transactionId?: string; // GA4 purchase dedup key (Square order id)
  contents?: { contentId: string; quantity: number; price?: number; name?: string }[];
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

/** Format a US phone number to E.164 (+1) for Meta/TikTok matching */
export function formatPhoneE164(phone?: string): string | undefined {
  if (!phone) return undefined;
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 10) return `+1${digits}`;
  if (digits.length === 11 && digits.startsWith("1")) return `+${digits}`;
  return digits.length > 0 ? digits : undefined;
}

/** Set a first-party cookie */
function setCookie(name: string, value: string, days: number) {
  if (typeof document === "undefined") return;
  const expires = new Date(Date.now() + days * 86400000).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)};expires=${expires};path=/;SameSite=Lax`;
}

/** Get ttclid from URL params or cookie */
function getTtclid(): string | undefined {
  if (typeof window === "undefined") return undefined;
  const params = new URLSearchParams(window.location.search);
  const fromUrl = params.get("ttclid");
  if (fromUrl) {
    // Persist as first-party cookie so it survives navigation (90 days)
    setCookie("ttclid", fromUrl, 90);
    return fromUrl;
  }
  return getCookie("ttclid") || undefined;
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
      // Persist as first-party cookie so it survives navigation (90 days)
      setCookie("_fbc", fbc, 90);
    }
  }
  
  return { fbc, fbp };
}

// ─── Client-side pixel firing ────────────────────────────────────────

function fireTikTok(event: string, eventId: string, data?: TrackingEventData) {
  if (typeof window === "undefined" || !window.ttq) return;

  // Identify user for Advanced Matching — always send external_id,
  // add email/phone when available
  try {
    const identifyParams: Record<string, unknown> = {
      external_id: getHashedExternalIdSync(),
    };
    if (data?.email) identifyParams.email = data.email.trim().toLowerCase();
    if (data?.phone) {
      const e164 = formatPhoneE164(data.phone);
      if (e164) identifyParams.phone_number = e164;
    }
    window.ttq.identify(identifyParams);
  } catch (e) {
    console.warn("[Tracking] TikTok identify error:", e);
  }

  const params: Record<string, unknown> = {};
  if (data?.value) params.value = data.value;
  if (data?.currency) params.currency = data.currency || "USD";
  if (data?.quantity) params.quantity = data.quantity;
  if (data?.description) params.description = data.description;

  // TikTok requires content_id on commerce events — always include it
  params.content_id = data?.contentId || data?.contentName || "wellness-weekend";
  if (data?.contentName) params.content_name = data.contentName;
  if (data?.contentType) params.content_type = data.contentType || "product";

  // Build contents array for TikTok (required for AddToCart, Checkout, Purchase)
  if (data?.contents && data.contents.length > 0) {
    params.contents = data.contents.map((c) => ({
      content_id: c.contentId,
      content_name: c.name || c.contentId,
      content_type: "product",
      quantity: c.quantity,
      price: c.price,
    }));
  } else if (data?.contentId || data?.contentName) {
    params.contents = [{
      content_id: data.contentId || data.contentName || "wellness-weekend",
      content_name: data.contentName || data.contentId || "Wellness Weekend",
      content_type: data.contentType || "product",
      quantity: data.quantity || 1,
      price: data.value,
    }];
  }

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

  // Reinit pixel with Advanced Matching when PII is available
  if (data?.email) {
    const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;
    if (pixelId) {
      try {
        const amParams: Record<string, string> = {
          em: data.email.trim().toLowerCase(),
          external_id: getHashedExternalIdSync(),
        };
        const e164 = formatPhoneE164(data.phone);
        if (e164) amParams.ph = e164.replace("+", ""); // Meta accepts numeric with or without +, but +1 format is best
        window.fbq("init", pixelId, amParams);
      } catch (e) {
        console.warn("[Tracking] Meta Advanced Matching reinit error:", e);
      }
    }
  }

  const params: Record<string, unknown> = {
    eventID: eventId, // Meta uses eventID in the client pixel for dedup
  };
  if (data?.value) params.value = data.value;
  if (data?.currency) params.currency = data.currency || "USD";
  if (data?.contentName) params.content_name = data.contentName;
  if (data?.contentType) params.content_type = data.contentType;
  if (data?.quantity) params.num_items = data.quantity;

  // Meta needs content_ids array
  if (data?.contents && data.contents.length > 0) {
    params.content_ids = data.contents.map((c) => c.contentId);
    params.contents = data.contents.map((c) => ({
      id: c.contentId,
      quantity: c.quantity,
      item_price: c.price,
    }));
  } else if (data?.contentId) {
    params.content_ids = [data.contentId];
  } else if (data?.contentName) {
    params.content_ids = [data.contentName];
  }

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
  // GA4 dedupes purchases by transaction_id — send the Square order id on the
  // browser purchase so it collapses with the webhook Measurement Protocol fire.
  if (event === "purchase" && data?.transactionId) {
    params.transaction_id = data.transactionId;
  }

  try {
    window.gtag("event", event, params);
  } catch (e) {
    console.warn("[Tracking] GA4 event error:", e);
  }
}

// ─── Server-side redundant event ─────────────────────────────────────

/** Get or create a persistent external ID for cross-device matching */
function getExternalId(): string {
  if (typeof window === "undefined") return "";
  let eid = localStorage.getItem("ww-eid");
  if (!eid) {
    eid = `ww_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
    localStorage.setItem("ww-eid", eid);
  }
  return eid;
}

// The server (/api/tracking) hashes external_id with SHA-256 before sending to
// Meta/TikTok. The browser pixels must send the SAME hashed value or the two
// identities never reconcile. We hash the raw eid once and cache it so both the
// synchronous pixel fires and the async server payload use an identical value.
let cachedHashedEid: string | undefined;

/** SHA-256 of the external id, matching the server so external_id reconciles. Cached after first call. */
async function getHashedExternalId(): Promise<string> {
  if (cachedHashedEid) return cachedHashedEid;
  const raw = getExternalId();
  if (!raw) return "";
  try {
    cachedHashedEid = await sha256(raw);
  } catch {
    return raw; // crypto.subtle unavailable — fall back to raw (server tolerates both)
  }
  return cachedHashedEid;
}

/**
 * Best-effort synchronous hashed external id for the pixel fires. Returns the
 * cached hash once primed (see module-load prime below); before that it falls
 * back to the raw eid, which the server also accepts (it only hashes values
 * that are not already a 64-char hex string).
 */
function getHashedExternalIdSync(): string {
  return cachedHashedEid || getExternalId();
}

/** Persist known user PII for cross-event matching */
function saveKnownUser(email?: string, phone?: string) {
  if (typeof window === "undefined") return;
  try {
    if (email) {
      const cleaned = email.trim().toLowerCase();
      localStorage.setItem("ww-em", cleaned);
      if (typeof Clarity !== "undefined") {
         try { Clarity.identify(getExternalId(), undefined, undefined, cleaned); } catch {}
      }
    }
    if (phone) {
      const e164 = formatPhoneE164(phone);
      if (e164) localStorage.setItem("ww-ph", e164);
    }
  } catch { /* quota exceeded, ignore */ }
}

/** Retrieve previously captured user PII */
function getKnownUser(): { email?: string; phone?: string } {
  if (typeof window === "undefined") return {};
  try {
    const email = localStorage.getItem("ww-em") || undefined;
    const phone = localStorage.getItem("ww-ph") || undefined;
    return { email, phone };
  } catch {
    return {};
  }
}

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

    const e164Phone = formatPhoneE164(data?.phone);
    const hashedPhone = e164Phone
      ? await sha256(e164Phone)
      : undefined;

    const { fbc, fbp } = getMetaClickIds();
    const ttclid = getTtclid();
    // Send the already-hashed external id so the server does not double-hash it
    // (it only hashes values that are not already a 64-char hex string).
    const externalId = await getHashedExternalId();

    // Capture fbclid and gclid from URL
    const urlParams = typeof window !== "undefined"
      ? new URLSearchParams(window.location.search)
      : null;
    const fbclid = urlParams?.get("fbclid") || undefined;
    const gclid = urlParams?.get("gclid") || undefined;

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
        externalId,
        fbclid,
        gclid,
        url: typeof window !== "undefined" ? window.location.href : undefined,
        userAgent:
          typeof navigator !== "undefined" ? navigator.userAgent : undefined,
      }),
    });

    try {
      if (typeof Clarity !== "undefined") {
        Clarity.event(event);

        // Tag the session with commerce context for Clarity filters
        if (data?.value) Clarity.setTag("value", `$${data.value}`);
        if (data?.contentName) Clarity.setTag("item", data.contentName);
        if (data?.currency) Clarity.setTag("currency", data.currency);

        // Funnel stage tagging — lets you filter recordings by where users dropped off
        const funnelStage: Record<string, string> = {
          ViewContent: "browsing",
          AddToCart: "cart",
          InitiateCheckout: "checkout",
          Purchase: "purchased",
          Lead: "lead",
          SubmitForm: "applied",
        };
        if (funnelStage[event]) {
          Clarity.setTag("funnel_stage", funnelStage[event]);
        }

        // Upgrade high-value sessions so Clarity prioritizes recording them
        const highValueEvents = ["InitiateCheckout", "Purchase", "Lead"];
        if (highValueEvents.includes(event)) {
          Clarity.upgrade(event);
        }
      }
    } catch { /* Clarity not loaded yet, safe to ignore */ }
    
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
  options?: { skipServer?: boolean; eventId?: string }
) {
  // Deterministic override (e.g. `purchase_${orderId}`) so client + server
  // fires share an id; random fallback when none is supplied.
  const eventId = options?.eventId || generateEventId(internalEvent);
  const tiktokEvent = TIKTOK_EVENT_MAP[internalEvent] || internalEvent;
  const metaEvent = META_EVENT_MAP[internalEvent] || internalEvent;
  const gaEvent = GA_EVENT_MAP[internalEvent] || internalEvent;

  // Persist email/phone when provided, and enrich events that lack them
  if (data?.email || data?.phone) {
    saveKnownUser(data.email, data.phone);
  }
  const enriched: TrackingEventData = { ...data };
  if (!enriched.email || !enriched.phone) {
    const known = getKnownUser();
    if (!enriched.email && known.email) enriched.email = known.email;
    if (!enriched.phone && known.phone) enriched.phone = known.phone;
  }

  // Client-side pixels (immediate)
  fireTikTok(tiktokEvent, eventId, enriched);
  fireMeta(metaEvent, eventId, enriched);
  fireGA(gaEvent, eventId, enriched);

  // Server-side CAPI (async, fire-and-forget)
  if (!options?.skipServer) {
    fireServerEvent(internalEvent, eventId, enriched);
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

/**
 * Track completed purchase (fires on thank-you page). Pass the deterministic
 * `purchase_${orderId}` event id so this browser Purchase dedupes with the
 * Square webhook's server Purchase; omit it to fall back to a random id.
 */
export function trackPurchase(data?: TrackingEventData, eventId?: string) {
  trackEvent("Purchase", data, eventId ? { eventId } : undefined);
}

/** Track content view */
export function trackViewContent(data?: TrackingEventData) {
  trackEvent("ViewContent", { ...data }, { skipServer: true });
}

// Prime the hashed external id on module load so the synchronous pixel fires
// (fireTikTok / fireMeta) can read the cached hash instead of the raw eid.
if (typeof window !== "undefined") {
  getHashedExternalId().catch(() => { /* fail-open */ });
}
