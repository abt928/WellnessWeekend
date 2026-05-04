"use client";

import { useState, useEffect, useCallback, useId, useRef } from "react";
import { trackLead } from "@/lib/tracking";
import { useFocusTrap } from "@/lib/useFocusTrap";
import { LeafIcon, CloseIcon, MoonIcon, SparklesIcon } from "@/components/Icons";

/**
 * Gentle conversion nudges:
 * 1. Exit-intent email capture — spiritual tone, appears once per session
 * 2. Return visitor welcome — subtle "welcome back" message
 * 3. Cart idle pulse — gentle glow on cart FAB after 45s of inactivity
 */
export default function ConversionNudges() {
  const [showExitIntent, setShowExitIntent] = useState(false);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [showWelcomeBack, setShowWelcomeBack] = useState(false);
  const exitShown = useRef(false);
  const scrollDepth = useRef(0);
  const exitModalRef = useRef<HTMLDivElement>(null);
  const exitTitleId = useId();
  useFocusTrap(showExitIntent, exitModalRef);

  // Escape closes exit-intent
  useEffect(() => {
    if (!showExitIntent) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setShowExitIntent(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [showExitIntent]);

  // ── Return visitor detection ──
  useEffect(() => {
    const visits = parseInt(localStorage.getItem("ww-visits") || "0", 10);
    localStorage.setItem("ww-visits", String(visits + 1));
    localStorage.setItem("ww-last-visit", String(Date.now()));

    // Show welcome back on 2nd+ visit (but not if they've already subscribed)
    if (visits >= 1 && !localStorage.getItem("ww-subscribed")) {
      setTimeout(() => setShowWelcomeBack(true), 2000);
      setTimeout(() => setShowWelcomeBack(false), 8000);
    }
  }, []);

  // ── Track scroll depth ──
  useEffect(() => {
    const handler = () => {
      const depth = window.scrollY / (document.body.scrollHeight - window.innerHeight);
      scrollDepth.current = Math.max(scrollDepth.current, depth);
    };
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  // ── Exit intent (desktop: mouse leave, mobile: back button / tab switch) ──
  useEffect(() => {
    // Don't show if already subscribed or already shown this session
    if (localStorage.getItem("ww-subscribed")) return;
    if (sessionStorage.getItem("ww-exit-shown")) return;

    const handleMouseLeave = (e: MouseEvent) => {
      // Only trigger when cursor leaves through the top of the page
      if (e.clientY > 10) return;
      // Only show if user has scrolled at least 30% (engaged enough to be worth capturing)
      if (scrollDepth.current < 0.3) return;
      if (exitShown.current) return;

      exitShown.current = true;
      sessionStorage.setItem("ww-exit-shown", "1");
      setShowExitIntent(true);
    };

    // Mobile: visibility change (switching tabs / closing)
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden" && scrollDepth.current > 0.3 && !exitShown.current) {
        exitShown.current = true;
        sessionStorage.setItem("ww-exit-shown", "1");
        // Show when they come back
        const showOnReturn = () => {
          if (document.visibilityState === "visible") {
            setShowExitIntent(true);
            document.removeEventListener("visibilitychange", showOnReturn);
          }
        };
        document.addEventListener("visibilitychange", showOnReturn);
      }
    };

    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  // ── Cart idle pulse ──
  useEffect(() => {
    const interval = setInterval(() => {
      try {
        const saved = localStorage.getItem("ww-cart");
        if (saved) {
          const cart = JSON.parse(saved);
          if (cart.length > 0) {
            const fab = document.querySelector(".fab-cart");
            if (fab && !fab.classList.contains("fab-glow")) {
              fab.classList.add("fab-glow");
              // Remove glow after 5 seconds
              setTimeout(() => fab.classList.remove("fab-glow"), 5000);
            }
          }
        }
      } catch { /* noop */ }
    }, 45000); // Check every 45 seconds

    return () => clearInterval(interval);
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus("sending");

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });

      if (res.ok) {
        trackLead({
          email: email.trim(),
          description: "exit_intent_capture",
          contentName: "Exit Intent Newsletter",
        });
        localStorage.setItem("ww-subscribed", "1");
        setStatus("sent");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }, [email]);

  return (
    <>
      {/* ── Return Visitor Welcome Toast — suppressed if exit-intent is active (one nudge at a time) ── */}
      {showWelcomeBack && !showExitIntent && (
        <div className="welcome-toast" role="status" aria-live="polite">
          <span className="welcome-toast-icon"><LeafIcon size={18} color="var(--sage-light)" /></span>
          <span>Welcome back, seeker. Your journey continues.</span>
        </div>
      )}

      {/* ── Exit Intent Overlay ── */}
      {showExitIntent && (
        <div
          className="exit-overlay"
          onClick={() => setShowExitIntent(false)}
        >
          <div
            className="exit-content"
            onClick={(e) => e.stopPropagation()}
            ref={exitModalRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={exitTitleId}
          >
            <button
              className="exit-close"
              onClick={() => setShowExitIntent(false)}
              aria-label="Close"
            >
              <CloseIcon size={16} />
            </button>

            {status === "sent" ? (
              <div className="exit-success">
                <div className="exit-icon"><MoonIcon size={36} color="var(--aurora-light)" /></div>
                <h3 id={exitTitleId} className="exit-title">
                  Connected.
                </h3>
                <p className="exit-desc">
                  We&apos;ll send gentle updates as the gathering draws near.
                  Trust the timing of your journey.
                </p>
              </div>
            ) : (
              <>
                <div className="exit-icon"><SparklesIcon size={36} color="var(--gold)" /></div>
                <h3 id={exitTitleId} className="exit-title">
                  Before you go.
                </h3>
                <p className="exit-desc">
                  Be first to know when early-bird tickets open and when the schedule drops.
                  No noise. A few thoughtful updates as the gathering approaches.
                </p>
                <form className="exit-form" onSubmit={handleSubmit}>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="exit-input"
                    aria-label="Email address"
                    autoFocus
                  />
                  <button
                    type="submit"
                    className="exit-submit"
                    disabled={status === "sending"}
                  >
                    {status === "sending" ? "..." : "Stay Connected"}
                  </button>
                </form>
                {status === "error" && (
                  <p className="exit-error">Couldn&apos;t send. Please try once more.</p>
                )}
                <button
                  className="exit-skip"
                  onClick={() => setShowExitIntent(false)}
                >
                  Continue exploring
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
