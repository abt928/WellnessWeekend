"use client";
import { useEffect } from "react";

/**
 * RefCapture — reads the ?ref= query param from the URL on mount,
 * stores it in localStorage as "ww-ref", then cleans the URL.
 * Returns null (no UI rendered).
 */
export default function RefCapture() {
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const ref = params.get("ref");
      if (ref && ref.trim()) {
        localStorage.setItem("ww-ref", ref.trim().toUpperCase());
        // Remove ?ref= from URL without causing a navigation
        params.delete("ref");
        const newSearch = params.toString();
        const newUrl =
          window.location.pathname +
          (newSearch ? `?${newSearch}` : "") +
          window.location.hash;
        window.history.replaceState({}, "", newUrl);
      }
    } catch {
      // Silently fail — localStorage may be blocked
    }
  }, []);

  return null;
}
