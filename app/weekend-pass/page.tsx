"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

const TOTAL = 25;
const VARIATION_ID = "TRYEWJV7VC2XUYWSSEWTIVBP";

const C = {
  bg: "#090912",
  card: "rgba(255,255,255,0.05)",
  border: "rgba(255,255,255,0.1)",
  borderSubtle: "rgba(255,255,255,0.06)",
  white: "#fff",
  dim: "rgba(255,255,255,0.6)",
  faint: "rgba(255,255,255,0.3)",
  gold: "#C9983F",
  goldBorder: "rgba(201,152,63,0.35)",
  sage: "#5E8A6A",
  error: "#ff8a72",
  errorBg: "rgba(184,74,43,0.12)",
};

export default function WeekendPassPage() {
  const [remaining, setRemaining] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/weekend-pass")
      .then(r => r.json())
      .then(d => setRemaining(d.remaining ?? 0))
      .catch(() => setRemaining(0));
  }, []);

  async function handleCheckout() {
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/square/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: [{ variationId: VARIATION_ID, quantity: 1, name: "Weekend Pass" }],
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
  const isLow = remaining !== null && remaining > 0 && remaining <= 5;

  return (
    <div style={{ minHeight: "100vh", background: C.bg, color: C.white }}>
      <div style={{
        position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0,
        background:
          "radial-gradient(ellipse at 25% 15%, rgba(94,138,106,0.14) 0%, transparent 55%)," +
          "radial-gradient(ellipse at 80% 85%, rgba(201,152,63,0.09) 0%, transparent 50%)",
      }} />

      <nav style={{ position: "relative", zIndex: 1, borderBottom: `1px solid ${C.borderSubtle}`, padding: "0.9rem 1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Link href="/" style={{ fontSize: "0.82rem", color: C.faint, textDecoration: "none" }}>
          ← Wellness Weekend
        </Link>
        <span style={{
          fontSize: "0.6rem", letterSpacing: "0.14em", textTransform: "uppercase",
          color: C.gold, fontWeight: 700,
          background: "rgba(201,152,63,0.1)", border: `1px solid ${C.goldBorder}`,
          padding: "0.2rem 0.6rem", borderRadius: "20px",
        }}>
          Black Friday
        </span>
      </nav>

      <main style={{ position: "relative", zIndex: 1, maxWidth: "560px", margin: "0 auto", padding: "3.5rem 1.5rem 6rem" }}>

        <div style={{ textAlign: "center", marginBottom: "2.75rem" }}>
          <p style={{ fontSize: "0.62rem", letterSpacing: "0.2em", textTransform: "uppercase", color: C.sage, fontWeight: 700, marginBottom: "0.9rem" }}>
            Black Friday · 2027 · Limited
          </p>
          <h1 style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(2.4rem, 7vw, 3.8rem)",
            fontWeight: 700, lineHeight: 1.05, marginBottom: "0.75rem",
            background: "linear-gradient(135deg, #fff 30%, rgba(94,138,106,0.85) 100%)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          }}>
            Weekend Pass
          </h1>
          <div style={{ display: "inline-flex", alignItems: "baseline", gap: "0.5rem", marginBottom: "1rem" }}>
            <span style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 800, color: C.sage }}>$77</span>
            <span style={{ fontSize: "0.85rem", color: C.faint }}>Black Friday price · full 3-day pass</span>
          </div>
          <p style={{ fontSize: "0.95rem", lineHeight: 1.8, color: C.dim, maxWidth: "420px", margin: "0 auto" }}>
            Only {TOTAL} passes at this price. Pay now through Square — secure checkout.
          </p>
        </div>

        <div style={{ background: C.card, border: `1px solid rgba(94,138,106,0.3)`, borderRadius: "16px", padding: "1.5rem 1.75rem", marginBottom: "1.75rem" }}>
          <p style={{ fontSize: "0.65rem", letterSpacing: "0.14em", textTransform: "uppercase", color: C.sage, marginBottom: "1rem", fontWeight: 700 }}>
            ✓ What&apos;s Included
          </p>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.65rem" }}>
            {[
              "Full 3-day weekend pass — 2027",
              "All workshops, ceremonies & healing arts",
              "Grounds camping at Warrior Lodge",
              "Live music, ecstatic dance & sound healing",
              "Morning movement, yoga & breathwork",
              "Community fire circle",
            ].map(item => (
              <li key={item} style={{ fontSize: "0.88rem", color: "rgba(255,255,255,0.75)", display: "flex", gap: "0.6rem", lineHeight: 1.5 }}>
                <span style={{ color: C.sage, flexShrink: 0, fontWeight: 700 }}>✓</span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div style={{ background: "rgba(201,152,63,0.07)", border: `1px solid rgba(201,152,63,0.2)`, borderRadius: "10px", padding: "0.9rem 1.1rem", marginBottom: "1.75rem", display: "flex", gap: "0.6rem" }}>
          <span style={{ color: C.gold, flexShrink: 0 }}>↩</span>
          <p style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.5)", lineHeight: 1.6, margin: 0 }}>
            <strong style={{ color: C.gold }}>Refund eligible</strong> — purchased before dates &amp; schedule are announced.{" "}
            <Link href="/refunds" style={{ color: C.gold, textDecoration: "underline" }}>See policy →</Link>
          </p>
        </div>

        {claimed !== null && (
          <div style={{ marginBottom: "1.75rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.4rem" }}>
              <span style={{ fontSize: "0.78rem", color: C.faint }}>{claimed} of {TOTAL} sold</span>
              <span style={{ fontSize: "0.78rem", fontWeight: 600, color: isFull ? C.faint : isLow ? C.error : C.sage }}>
                {isFull ? "Sold out" : `${remaining} remaining`}
              </span>
            </div>
            <div style={{ height: "4px", background: "rgba(255,255,255,0.08)", borderRadius: "2px", overflow: "hidden" }}>
              <div style={{
                height: "100%",
                width: `${Math.min(((claimed ?? 0) / TOTAL) * 100, 100)}%`,
                background: isFull ? "rgba(255,255,255,0.15)" : `linear-gradient(90deg, ${C.sage}, ${C.gold})`,
                borderRadius: "2px", transition: "width 0.6s ease",
              }} />
            </div>
            {isLow && !isFull && (
              <p style={{ fontSize: "0.76rem", color: C.error, fontWeight: 600, marginTop: "0.4rem", textAlign: "center" }}>
                🔥 Only {remaining} left
              </p>
            )}
          </div>
        )}

        {remaining === null && (
          <p style={{ textAlign: "center", color: C.faint, padding: "1.5rem 0", fontSize: "0.85rem" }}>Checking availability…</p>
        )}

        {isFull ? (
          <div style={{ textAlign: "center", background: C.card, border: `1px solid ${C.border}`, borderRadius: "16px", padding: "2.5rem 2rem" }}>
            <p style={{ fontSize: "0.7rem", letterSpacing: "0.14em", textTransform: "uppercase", color: C.faint, marginBottom: "0.75rem", fontWeight: 700 }}>Sold Out</p>
            <p style={{ fontSize: "1rem", color: C.dim, lineHeight: 1.75, marginBottom: "1.5rem" }}>
              All {TOTAL} Weekend Passes have been sold. See more options below.
            </p>
            <Link href="/#packages" style={{
              display: "inline-block", padding: "0.8rem 2rem",
              background: `linear-gradient(135deg, ${C.gold}, #FF6B35)`,
              color: "#fff", fontWeight: 700, fontSize: "0.95rem",
              borderRadius: "30px", textDecoration: "none",
            }}>
              View All Options →
            </Link>
          </div>
        ) : remaining !== null && (
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {error && (
              <p style={{ fontSize: "0.88rem", color: C.error, background: C.errorBg, border: "1px solid rgba(184,74,43,0.25)", borderRadius: "8px", padding: "0.75rem 1rem", margin: 0 }}>
                {error}
              </p>
            )}

            <button onClick={handleCheckout} disabled={loading} style={{
              padding: "1rem 2rem",
              background: loading ? "rgba(94,138,106,0.25)" : `linear-gradient(135deg, ${C.sage}, ${C.gold})`,
              color: "#fff", fontWeight: 700, fontSize: "1rem",
              border: "none", borderRadius: "30px",
              cursor: loading ? "not-allowed" : "pointer",
              letterSpacing: "0.03em", transition: "opacity 0.2s",
            }}>
              {loading ? "Opening checkout…" : "Buy My Weekend Pass — $77 →"}
            </button>

            <p style={{ fontSize: "0.76rem", color: C.faint, textAlign: "center", lineHeight: 1.7 }}>
              Secure checkout via Square.{" "}
              <Link href="/refunds" style={{ color: C.faint, textDecoration: "underline" }}>Refund eligible</Link> — 2027 dates not yet announced.
            </p>
          </div>
        )}

      </main>
    </div>
  );
}
