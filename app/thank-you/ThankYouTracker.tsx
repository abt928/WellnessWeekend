"use client";
import { useEffect, useRef } from "react";
import { trackPurchase } from "@/lib/tracking";

/**
 * Client component that fires a purchase conversion event once on mount.
 * Reads cart context from localStorage (saved before Square redirect) to
 * include the actual purchase value, item names, and content IDs in the
 * conversion event for TikTok, Meta, and GA4.
 * Uses a ref guard to prevent double-firing in React strict mode.
 */
export default function ThankYouTracker() {
  const hasFired = useRef(false);

  useEffect(() => {
    if (hasFired.current) return;
    hasFired.current = true;

    // Read checkout context saved before the Square redirect
    let value: number | undefined;
    let currency = "USD";
    let quantity: number | undefined;
    let contentId = "wellness-weekend-purchase";
    let contentName = "Wellness Weekend Tickets";
    let description = "square_checkout_complete";
    let contents: { contentId: string; quantity: number; price?: number; name?: string }[] | undefined;

    try {
      const raw = localStorage.getItem("ww-checkout");
      if (raw) {
        const checkout = JSON.parse(raw);
        // Only use if it was saved less than 2 hours ago (avoid stale data)
        if (checkout.timestamp && Date.now() - checkout.timestamp < 2 * 60 * 60 * 1000) {
          value = checkout.value;
          currency = checkout.currency || "USD";
          quantity = checkout.quantity;
          description = checkout.items || description;
          contentName = checkout.items || contentName;
          // Restore individual item content IDs if available
          if (checkout.contents) {
            contents = checkout.contents;
            contentId = checkout.contents[0]?.contentId || contentId;
          }
        }
        // Clear it so it doesn't fire again on a future visit
        localStorage.removeItem("ww-checkout");
      }
    } catch {
      /* noop */
    }

    // Clear cart after successful purchase
    localStorage.removeItem("ww-cart");

    trackPurchase({
      value,
      currency,
      quantity,
      contentId,
      contentName,
      contentType: "product",
      description,
      contents,
    });
  }, []);

  return null;
}
