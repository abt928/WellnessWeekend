"use client";
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

/**
 * Fires a PageView on client-side (SPA) route changes. The initial page load is
 * already tracked by the inline pixel snippets in app/layout.tsx, so this skips
 * the first render and fires only on subsequent pathname changes. Each pixel
 * call is guarded so a missing/blocked script never breaks navigation.
 */
export default function RouteTracker() {
  const pathname = usePathname();
  const isFirst = useRef(true);

  useEffect(() => {
    if (isFirst.current) {
      isFirst.current = false;
      return;
    }

    try {
      window.fbq?.("track", "PageView");
    } catch { /* noop */ }

    try {
      window.ttq?.page?.();
    } catch { /* noop */ }

    try {
      window.gtag?.("event", "page_view", {
        page_path: pathname,
        page_location: typeof window !== "undefined" ? window.location.href : undefined,
      });
    } catch { /* noop */ }
  }, [pathname]);

  return null;
}
