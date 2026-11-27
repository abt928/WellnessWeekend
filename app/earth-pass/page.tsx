"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

const TOTAL = 10;
const VARIATION_ID = "X36FSIIGPG4BKGU6QOZYLMTH";

const C = {
  bg: "#F7F3EC",
  card: "#FBF9F4",
  charcoal: "#333533",
  muted: "rgba(51,53,51,0.6)",
  faint: "rgba(51,53,51,0.38)",
  gold: "#C9983F",
  goldBorder: "rgba(201,152,63,0.35)",
  border: "rgba(51,53,51,0.12)",
  sage: "#5E8A6A",
  error: "#B84A2B",
  errorBg: "rgba(184,74,43,0.07)",
};

export default function EarthPassPage() {
  const [remaining, setRemaining] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/earth-pass")
      .then((r) => r.json())
      .then((d) => setRemaining(d.remaining ?? 0));
  }, []);

  async function handleCheckout() {
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/square/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: [{ variationId: VARIATION_ID, quantity: 1, name: "Earth Pass" }],
          returnUrl: window.location.origin,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Checkout failed");
      window.location.href = data.checkoutUrl;
    } catch {
      setError("Unable to start checkout. Please try again or contact support@thesoundspace.us");
      setLoading(false);
    }
  }

  const claimed = remaining !== null ? TOTAL - remaining : null;
  const isFull = remaining !== null && remaining <= 0;
  const isLow = remaining !== null && remaining > 0 && remaining <= 3;

  return (
    <>
      <nav style={{ background: C.bg, borderBottom: `1px solid ${C.border}`, padding: "0.9rem 1.5rem" }}>
        <Link href="/" style={{ fontSize: "0.85rem", color: C.muted, textDecoration: "none" }}>
          ← Back to Wellness Weekend
        </Link>
      </nav>

      <main style={{ minHeight: "100vh", background: C.bg, padding: "3rem 1.5rem 5rem" }}>
        <div style={{ maxWidth: "600px", margin: "0 auto" }}>

          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
            <p style={{ fontSize: "0.68rem", letterSpacing: "0.14em", textTransform: "uppercase", color: C.gold, marginBottom: "0.6rem", fontWeight: 600 }}>
              🖤 Black Friday · Limited · 10 Spots
            </p>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2.2rem, 6vw, 3.4rem)", fontWeight: 700, lineHeight: 1.1, marginBottom: "0.75rem", color: C.charcoal }}>
              Earth Pass
            </h1>
            <div style={{ display: "inline-flex", alignItems: "baseline", gap: "0.4rem", marginBottom: "1rem" }}>
              <span style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 800, color: C.sage }}>$177</span>
              <span style={{ fontSize: "0.85rem", color: C.muted }}>Black Friday price · full 3-day pass</span>
            </div>
            <p style={{ fontSize: "1rem", lineHeight: 1.75, color: C.muted, maxWidth: "480px", margin: "0 auto" }}>
              Claim your spot now — we&apos;ll follow up within minutes with a payment link. Only 10 Earth Passes at this Black Friday price.
            </p>
          </div>

          {/* Refund eligible note */}
          <div style={{ background: "rgba(201,152,63,0.07)", border: `1px solid ${C.goldBorder}`, borderRadius: "10px", padding: "0.9rem 1.1rem", marginBottom: "1.5rem", display: "flex", gap: "0.6rem" }}>
            <span style={{ color: C.gold, flexShrink: 0 }}>↩</span>
            <p style={{ fontSize: "0.78rem", color: C.muted, lineHeight: 1.6, margin: 0 }}>
              <strong style={{ color: C.gold }}>Refund eligible</strong> — purchased before 2027 dates &amp; schedule are announced.{" "}
              <Link href="/refunds" style={{ color: C.gold, textDecoration: "underline" }}>See policy →</Link>
            </p>
          </div>

          {/* What's included */}
          <div style={{ background: C.card, border: `1px solid ${C.goldBorder}`, borderRadius: "14px", padding: "1.5rem 1.75rem", marginBottom: "2rem" }}>
            <p style={{ fontSize: "0.68rem", letterSpacing: "0.12em", textTransform: "uppercase", color: C.gold, marginBottom: "0.9rem", fontWeight: 700 }}>
              ✓ What&apos;s Included
            </p>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.6rem" }}>
              {[
                "Full 3-day weekend pass — 2027",
                "All main-stage ceremonies, music & healing arts",
                "On-site camping at Warrior Lodge",
                "Access to morning movement, yoga & breathwork",
                "Sound healing, drumming circles & ecstatic dance",
              ].map((item) => (
                <li key={item} style={{ fontSize: "0.9rem", color: C.charcoal, lineHeight: 1.55, display: "flex", gap: "0.5rem" }}>
                  <span style={{ color: C.sage, fontWeight: 700, flexShrink: 0 }}>✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Availability bar */}
          {claimed !== null && (
            <div style={{ marginBottom: "1.75rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.4rem" }}>
                <span style={{ fontSize: "0.8rem", color: C.muted }}>
                  {claimed} of {TOTAL} spots claimed
                </span>
                <span style={{ fontSize: "0.8rem", fontWeight: 600, color: isFull ? C.faint : isLow ? C.error : C.gold }}>
                  {isFull ? "Sold out" : `${remaining} remaining`}
                </span>
              </div>
              <div style={{ height: "6px", background: C.border, borderRadius: "3px", overflow: "hidden" }}>
                <div style={{
                  height: "100%",
                  width: `${Math.min((claimed / TOTAL) * 100, 100)}%`,
                  background: isFull ? C.faint : `linear-gradient(90deg, ${C.sage}, ${C.gold})`,
                  borderRadius: "3px",
                  transition: "width 0.6s ease",
                }} />
              </div>
              {isLow && !isFull && (
                <p style={{ fontSize: "0.78rem", color: C.error, fontWeight: 600, marginTop: "0.4rem", textAlign: "center" }}>
                  🔥 Almost gone — only {remaining} left
                </p>
              )}
            </div>
          )}

          {remaining === null && (
            <p style={{ textAlign: "center", color: C.faint, padding: "2rem 0" }}>Checking availability…</p>
          )}

          {/* Sold out */}
          {isFull && !submitted && (
            <div style={{ textAlign: "center", background: C.card, border: `1px solid ${C.border}`, borderRadius: "16px", padding: "2.5rem 2rem" }}>
              <p style={{ fontSize: "0.72rem", letterSpacing: "0.12em", textTransform: "uppercase", color: C.faint, marginBottom: "0.75rem", fontWeight: 600 }}>
                Flash deal sold out
              </p>
              <p style={{ fontSize: "1rem", color: C.charcoal, lineHeight: 1.7, marginBottom: "1.5rem" }}>
                All 10 Earth Pass spots have been claimed. Check out our regular ticket options for the full weekend.
              </p>
              <a href="/#store" style={{
                display: "inline-block",
                padding: "0.75rem 2rem",
                background: `linear-gradient(135deg, ${C.gold}, #FF6B35)`,
                color: "#fff",
                fontWeight: 700,
                fontSize: "0.95rem",
                borderRadius: "30px",
                textDecoration: "none",
              }}>
                View All Tickets →
              </a>
            </div>
          )}

          {/* Checkout button */}
          {!isFull && remaining !== null && (
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {error && (
                <p style={{ fontSize: "0.9rem", color: C.error, background: C.errorBg, border: `1px solid rgba(184,74,43,0.2)`, borderRadius: "8px", padding: "0.75rem 1rem", margin: 0 }}>
                  {error}
                </p>
              )}
              <button
                onClick={handleCheckout}
                disabled={loading}
                style={{
                  padding: "0.9rem 2rem",
                  background: loading ? `rgba(94,138,106,0.5)` : `linear-gradient(135deg, ${C.sage}, ${C.gold})`,
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: "1rem",
                  border: "none",
                  borderRadius: "30px",
                  cursor: loading ? "not-allowed" : "pointer",
                  letterSpacing: "0.03em",
                  transition: "opacity 0.2s",
                }}
              >
                {loading ? "Opening checkout…" : "Buy My Earth Pass — $177 →"}
              </button>
              <p style={{ fontSize: "0.78rem", color: C.faint, textAlign: "center", lineHeight: 1.6 }}>
                Secure checkout via Square.{" "}
                <Link href="/refunds" style={{ color: C.gold, textDecoration: "underline" }}>Refund eligible</Link> — 2027 dates not yet announced.
              </p>
            </div>
          )}

        </div>
      </main>
    </>
  );
}

