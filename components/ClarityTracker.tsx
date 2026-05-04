"use client";

import { useEffect } from "react";
import Clarity from "@microsoft/clarity";

const CLARITY_PROJECT_ID = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID || "wlnikp7pcm";

export default function ClarityTracker() {
  useEffect(() => {
    try {
      Clarity.init(CLARITY_PROJECT_ID);

      // Tag session with referrer context for filtering
      const params = new URLSearchParams(window.location.search);
      const utmSource = params.get("utm_source");
      const utmMedium = params.get("utm_medium");
      const utmCampaign = params.get("utm_campaign");
      const fbclid = params.get("fbclid");
      const ttclid = params.get("ttclid");
      const gclid = params.get("gclid");

      if (utmSource) Clarity.setTag("utm_source", utmSource);
      if (utmMedium) Clarity.setTag("utm_medium", utmMedium);
      if (utmCampaign) Clarity.setTag("utm_campaign", utmCampaign);

      // Tag traffic source for quick filtering
      if (fbclid) Clarity.setTag("traffic_source", "meta_ads");
      else if (ttclid) Clarity.setTag("traffic_source", "tiktok_ads");
      else if (gclid) Clarity.setTag("traffic_source", "google_ads");
      else if (utmSource) Clarity.setTag("traffic_source", utmSource);
      else if (document.referrer) {
        try {
          const ref = new URL(document.referrer).hostname;
          Clarity.setTag("traffic_source", ref);
        } catch { Clarity.setTag("traffic_source", "direct"); }
      } else {
        Clarity.setTag("traffic_source", "direct");
      }

      // Tag device type
      const isMobile = /Mobi|Android/i.test(navigator.userAgent);
      Clarity.setTag("device", isMobile ? "mobile" : "desktop");

      // Identify returning users from our existing external ID
      const eid = localStorage.getItem("ww-eid");
      if (eid) {
        const email = localStorage.getItem("ww-em");
        Clarity.identify(eid, undefined, undefined, email || undefined);
        Clarity.setTag("returning_user", "true");
      } else {
        Clarity.setTag("returning_user", "false");
      }

      // Check if they have items in cart from a previous session
      try {
        const cart = localStorage.getItem("ww-cart");
        if (cart) {
          const items = JSON.parse(cart);
          if (items.length > 0) {
            Clarity.setTag("has_cart", "true");
            Clarity.setTag("cart_items", String(items.length));
          }
        }
      } catch { /* ignore */ }

    } catch (e) {
      console.warn("[Clarity] Initialization failed:", e);
    }
  }, []);

  return null;
}
