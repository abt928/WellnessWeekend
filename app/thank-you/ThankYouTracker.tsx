"use client";
import { useEffect, useRef } from "react";
import { trackPurchase } from "@/lib/tracking";

/**
 * Client component that fires a purchase conversion event once on mount.
 * Reads cart context from localStorage (saved before Square redirect) to
 * include the actual purchase value and item names in the conversion event.
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
    let description = "square_checkout_complete";
    let checkoutTimestamp: number | undefined;

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
          checkoutTimestamp = checkout.timestamp;
        }
        // Clear it so it doesn't fire again on a future visit
        localStorage.removeItem("ww-checkout");
      }
    } catch {
      /* noop */
    }

    trackPurchase({
      value,
      currency,
      quantity,
      description,
    });

    // Award purchase points to logged-in members (1 pt per $1)
    if (value && value > 0 && checkoutTimestamp) {
      fetch("/api/members/earn", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ value, checkoutTimestamp }),
      }).catch(() => { /* silent fail — points can be reconciled manually */ });
    }
  }, []);

  return null;
}
