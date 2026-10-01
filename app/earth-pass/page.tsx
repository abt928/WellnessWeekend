"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

const TOTAL = 10;

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
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    fetch("/api/earth-pass")
      .then((r) => r.json())
      .then((d) => setRemaining(d.remaining ?? 0));
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/earth-pass", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong. Please try again.");
      } else {
        setRemaining(data.remaining);
        setSubmitted(true);
      }
    } catch {
      setError("Unable to submit. Please try again.");
    } finally {
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
              ⚡ Flash Deal · Limited Availability
            </p>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2.2rem, 6vw, 3.4rem)", fontWeight: 700, lineHeight: 1.1, marginBottom: "0.75rem", color: C.charcoal }}>
              Earth Pass
            </h1>
            <div style={{ display: "inline-flex", alignItems: "baseline", gap: "0.4rem", marginBottom: "1rem" }}>
              <span style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 800, color: C.sage }}>$299</span>
              <span style={{ fontSize: "0.85rem", color: C.muted }}>· full 3-day weekend pass</span>
            </div>
            <p style={{ fontSize: "1rem", lineHeight: 1.75, color: C.muted, maxWidth: "480px", margin: "0 auto" }}>
              Claim your spot now — we&apos;ll follow up within minutes with a payment link. Only 10 passes available at this price.
            </p>
          </div>

          {/* What's included */}
          <div style={{ background: C.card, border: `1px solid ${C.goldBorder}`, borderRadius: "14px", padding: "1.5rem 1.75rem", marginBottom: "2rem" }}>
            <p style={{ fontSize: "0.68rem", letterSpacing: "0.12em", textTransform: "uppercase", color: C.gold, marginBottom: "0.9rem", fontWeight: 700 }}>
              ✓ What&apos;s Included
            </p>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.6rem" }}>
              {[
                "Full 3-day weekend pass — August 7, 8 & 9",
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

          {/* Success */}
          {submitted && (
            <div style={{ textAlign: "center", background: C.card, border: `1px solid ${C.goldBorder}`, borderRadius: "16px", padding: "2.5rem 2rem" }}>
              <div style={{ fontSize: "2.5rem", marginBottom: "0.75rem" }}>🌿</div>
              <p style={{ fontFamily: "var(--font-display)", fontSize: "1.6rem", fontWeight: 700, color: C.charcoal, marginBottom: "0.75rem", lineHeight: 1.2 }}>
                Spot claimed. ✦
              </p>
              <p style={{ fontSize: "1rem", color: C.muted, lineHeight: 1.75, marginBottom: "1rem" }}>
                Thank you, {name.split(" ")[0]}. We&apos;ll send a payment link to{" "}
                <strong style={{ color: C.charcoal }}>{email}</strong> within minutes.
              </p>
              <p style={{ fontSize: "0.85rem", color: C.muted, lineHeight: 1.7, marginBottom: "1.75rem" }}>
                Your spot is held for <strong>24 hours</strong> while payment processes. Complete it before it expires.
              </p>
              <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: "1.5rem" }}>
                <a href="/#schedule" style={{
                  display: "inline-block",
                  padding: "0.75rem 2rem",
                  background: `linear-gradient(135deg, ${C.gold}, #FF6B35)`,
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: "0.95rem",
                  borderRadius: "30px",
                  textDecoration: "none",
                }}>
                  View the Schedule →
                </a>
              </div>
              <p style={{ fontSize: "0.8rem", color: C.faint, marginTop: "1.25rem" }}>
                Questions? <a href="mailto:support@thesoundspace.us" style={{ color: C.gold }}>support@thesoundspace.us</a>
              </p>
            </div>
          )}

          {/* Form */}
          {!isFull && !submitted && remaining !== null && (
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>

              <Field label="Full Name">
                <input
                  type="text" required value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your full name"
                  style={inputStyle}
                />
              </Field>

              <Field label="Email Address">
                <input
                  type="email" required value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  style={inputStyle}
                />
              </Field>

              <Field label="Phone Number (optional)">
                <input
                  type="tel" value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="(907) 555-0100"
                  style={inputStyle}
                />
              </Field>

              {error && (
                <p style={{ fontSize: "0.9rem", color: C.error, background: C.errorBg, border: `1px solid rgba(184,74,43,0.2)`, borderRadius: "8px", padding: "0.75rem 1rem", margin: 0 }}>
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                style={{
                  marginTop: "0.25rem",
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
                {loading ? "Claiming…" : "Claim My Earth Pass →"}
              </button>

              <p style={{ fontSize: "0.78rem", color: C.faint, textAlign: "center", lineHeight: 1.6 }}>
                We&apos;ll email you a Square payment link within minutes. Spot held 24 hrs.{" "}
                Questions? <a href="mailto:support@thesoundspace.us" style={{ color: C.gold }}>support@thesoundspace.us</a>
              </p>
            </form>
          )}

        </div>
      </main>
    </>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
      <label style={{ fontSize: "0.75rem", letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(51,53,51,0.55)", fontWeight: 600 }}>
        {label}
      </label>
      {children}
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "0.75rem 1rem",
  background: "#fff",
  border: "1px solid rgba(51,53,51,0.18)",
  borderRadius: "8px",
  color: "#333533",
  fontSize: "1rem",
  outline: "none",
  boxSizing: "border-box",
};
