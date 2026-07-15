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

    // Read checkout context saved before the Square redirect. Only a fresh
    // ww-checkout entry is evidence of a real purchase — without it (direct
    // visit, bookmark, refresh, organic hit) we must NOT fire a phantom
    // Purchase conversion that would poison ad optimization and audiences.
    let checkout: {
      value?: number;
      currency?: string;
      quantity?: number;
      items?: string;
      orderId?: string;
      contents?: { contentId: string; quantity: number; price?: number; name?: string }[];
      timestamp?: number;
    } | null = null;

    try {
      const raw = localStorage.getItem("ww-checkout");
      if (raw) {
        checkout = JSON.parse(raw);
        // Clear it so it doesn't fire again on a future visit
        localStorage.removeItem("ww-checkout");
      }
    } catch {
      /* noop */
    }

    // Require a fresh checkout (saved less than 2 hours ago) before firing.
    if (
      !checkout?.timestamp ||
      Date.now() - checkout.timestamp >= 2 * 60 * 60 * 1000
    ) {
      return;
    }

    const value = checkout.value;
    const currency = checkout.currency || "USD";
    const quantity = checkout.quantity;
    const description = checkout.items || "square_checkout_complete";
    const checkoutTimestamp = checkout.timestamp;
    const orderId = checkout.orderId;
    const contents = Array.isArray(checkout.contents) ? checkout.contents : undefined;
    // Representative product for platforms that also want a single content id/name.
    const primary = contents?.[0];

    // Shared derivation rule — MUST stay byte-identical to the server side in
    // app/api/square/webhook/route.ts: event_id = `purchase_${squareOrderId}`.
    // Matching ids let this browser Purchase and the webhook Purchase dedupe on
    // Meta/TikTok; the Square order id doubles as the GA4 transaction_id.
    trackPurchase(
      {
        value,
        currency,
        quantity,
        description,
        contents,
        contentId: primary?.contentId,
        contentName: primary?.name,
        ...(orderId ? { transactionId: orderId } : {}),
      },
      orderId ? `purchase_${orderId}` : undefined,
    );

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
