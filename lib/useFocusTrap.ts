"use client";
import { type RefObject, useEffect } from "react";

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * When `active` is true, traps focus within `containerRef`, locks body scroll,
 * autofocuses the first input, and returns focus to whatever was focused before
 * the dialog opened. Honors `prefers-reduced-motion` for the autofocus scroll.
 */
export function useFocusTrap(active: boolean, containerRef: RefObject<HTMLElement | null>) {
  useEffect(() => {
    if (!active) return;
    const container = containerRef.current;
    if (!container) return;

    const previousActive = document.activeElement as HTMLElement | null;

    // Lock body scroll
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // Auto-focus the first form input, falling back to the first focusable element
    const firstInput = container.querySelector<HTMLElement>(
      'input:not([type="checkbox"]):not([type="radio"]):not([disabled]), textarea:not([disabled]), select:not([disabled])'
    );
    if (firstInput) {
      firstInput.focus({ preventScroll: true });
    } else {
      const list = container.querySelectorAll<HTMLElement>(FOCUSABLE);
      list[0]?.focus({ preventScroll: true });
    }

    function onKeyDown(e: KeyboardEvent) {
      if (e.key !== "Tab") return;
      const list = Array.from(container!.querySelectorAll<HTMLElement>(FOCUSABLE));
      if (list.length === 0) return;
      const first = list[0];
      const last = list[list.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }

    container.addEventListener("keydown", onKeyDown);

    return () => {
      container.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      // Return focus to the element that was focused before the dialog opened
      if (previousActive && document.body.contains(previousActive)) {
        previousActive.focus({ preventScroll: true });
      }
    };
  }, [active, containerRef]);
}
