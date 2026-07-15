"use client";

import { useEffect } from "react";
import Clarity from "@microsoft/clarity";

const ATTRIBUTION_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  "fbclid",
  "gclid",
  "ttclid",
] as const;

type EventParams = Record<string, string | number | boolean>;

function sendEvent(name: string, params: EventParams = {}) {
  try {
    if (typeof window.gtag === "function") {
      window.gtag("event", name, params);
    } else if (Array.isArray(window.dataLayer)) {
      window.dataLayer.push({ event: name, ...params });
    }
  } catch {
    // Analytics must never interrupt the purchase path.
  }

  try {
    Clarity.event(name);
  } catch {
    // Clarity may still be initializing on the first interaction.
  }
}

function currentAttribution() {
  const params = new URLSearchParams(window.location.search);
  return Object.fromEntries(
    ATTRIBUTION_KEYS.flatMap((key) => {
      const value = params.get(key);
      return value ? [[key, value]] : [];
    }),
  );
}

export default function ConversionTracker() {
  useEffect(() => {
    const attribution = currentAttribution();
    const visit = {
      ...attribution,
      landing_path: `${window.location.pathname}${window.location.search}`,
      captured_at: new Date().toISOString(),
    };

    try {
      if (!window.localStorage.getItem("ww-attribution-first")) {
        window.localStorage.setItem("ww-attribution-first", JSON.stringify(visit));
      }
      window.localStorage.setItem("ww-attribution-last", JSON.stringify(visit));
    } catch {
      // Storage can be unavailable in private browsing; event tracking still works.
    }

    try {
      if (!window.sessionStorage.getItem("ww-landing-view")) {
        sendEvent("landing_view", {
          ...attribution,
          device_group: window.matchMedia("(max-width: 760px)").matches
            ? "mobile"
            : "desktop",
          landing_variant: "field_guide_v1",
        });
        window.sessionStorage.setItem("ww-landing-view", "1");
      }
    } catch {
      sendEvent("landing_view", {
        ...attribution,
        landing_variant: "field_guide_v1",
      });
    }

    const onClick = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;

      const cta = target.closest<HTMLElement>("[data-cta]");
      if (cta) {
        sendEvent("cta_click", {
          cta_name: cta.dataset.cta || "unknown",
          landing_variant: "field_guide_v1",
        });
      }

      const addButton = target.closest<HTMLElement>(
        "#store .store-add-btn, #store .store-variant-btn",
      );
      if (addButton) {
        const card = addButton.closest(".store-card");
        const name = card?.querySelector(".store-card-name")?.textContent?.trim();
        sendEvent("pass_selected", {
          pass_name: name || "catalog_item",
          landing_variant: "field_guide_v1",
        });
      }

      if (target.closest(".cart-bar")) {
        sendEvent("view_cart", { landing_variant: "field_guide_v1" });
      }

      const faqSummary = target.closest(".ww-faq-item summary");
      const faqItem = faqSummary?.closest("details");
      if (faqSummary && faqItem && !faqItem.hasAttribute("open")) {
        sendEvent("faq_open", {
          question: faqSummary.textContent?.trim().slice(0, 100) || "unknown",
        });
      }
    };

    document.addEventListener("click", onClick);

    const onCheckoutLinkCreated = (event: Event) => {
      const detail = (event as CustomEvent<{ value?: number; quantity?: number }>).detail;
      sendEvent("checkout_link_created", {
        value: detail?.value || 0,
        quantity: detail?.quantity || 0,
        landing_variant: "field_guide_v1",
      });
    };

    const onCheckoutError = (event: Event) => {
      const detail = (event as CustomEvent<{ reason?: string }>).detail;
      sendEvent("checkout_error", {
        reason: detail?.reason || "unknown",
        landing_variant: "field_guide_v1",
      });
    };

    window.addEventListener("ww-checkout-link-created", onCheckoutLinkCreated);
    window.addEventListener("ww-checkout-error", onCheckoutError);

    const seenSections = new Set<string>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const section = (entry.target as HTMLElement).dataset.conversionSection;
          if (!section || seenSections.has(section)) continue;
          seenSections.add(section);
          sendEvent(section === "store" ? "offer_view" : "section_view", {
            section_name: section,
            landing_variant: "field_guide_v1",
          });
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.35 },
    );

    document
      .querySelectorAll<HTMLElement>("[data-conversion-section]")
      .forEach((section) => observer.observe(section));

    return () => {
      document.removeEventListener("click", onClick);
      window.removeEventListener("ww-checkout-link-created", onCheckoutLinkCreated);
      window.removeEventListener("ww-checkout-error", onCheckoutError);
      observer.disconnect();
    };
  }, []);

  return null;
}
