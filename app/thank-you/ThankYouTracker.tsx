"use client";
import { useEffect, useRef } from "react";
import { trackPurchase } from "@/lib/tracking";

/**
 * Client component that fires a purchase conversion event once on mount.
 * Uses a ref guard to prevent double-firing in React strict mode.
 */
export default function ThankYouTracker() {
  const hasFired = useRef(false);

  useEffect(() => {
    if (hasFired.current) return;
    hasFired.current = true;

    trackPurchase({
      description: "square_checkout_complete",
      currency: "USD",
    });
  }, []);

  return null;
}
