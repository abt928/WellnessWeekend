"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

const TOTAL = 10;

const C = {
  bg: "#0e0d16",
  surface: "rgba(255,255,255,0.04)",
  card: "rgba(255,255,255,0.06)",
  border: "rgba(255,255,255,0.1)",
  borderSubtle: "rgba(255,255,255,0.06)",
  white: "#fff",
  dim: "rgba(255,255,255,0.6)",
  faint: "rgba(255,255,255,0.3)",
  gold: "#C9983F",
  goldBorder: "rgba(201,152,63,0.35)",
  violet: "#9B7FD4",
  violetBorder: "rgba(155,127,212,0.3)",
  violetGlow: "rgba(155,127,212,0.12)",
  error: "#ff8a72",
  errorBg: "rgba(184,74,43,0.12)",
};

export default function SanctuaryPassPage() {
  const [remaining, setRemaining] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    fetch("/api/sanctuary-pass")
      .then((r) => r.json())
      .then((d) => setRemaining(d.remaining ?? 0))
      .catch(() => {});
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/sanctuary-pass", {
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
    <div style={{ minHeight: "100vh", background: C.bg, color: C.white }}>

      {/* Background glow */}
      <div style={{
        position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0,
        background:
          "radial-gradient(ellipse at 30% 10%, rgba(155,127,212,0.14) 0%, transparent 55%)," +
          "radial-gradient(ellipse at 75% 85%, rgba(201,152,63,0.08) 0%, transparent 50%)",
      }} />

      {/* Nav */}
      <nav style={{ position: "relative", zIndex: 1, borderBottom: `1px solid ${C.borderSubtle}`, padding: "0.9rem 1.5rem" }}>
        <Link href="/" style={{ fontSize: "0.82rem", color: C.faint, textDecoration: "none", letterSpacing: "0.04em" }}>
          ← Wellness Weekend
        </Link>
      </nav>

      <main style={{ position: "relative", zIndex: 1, maxWidth: "580px", margin: "0 auto", padding: "3.5rem 1.5rem 6rem" }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "2.75rem" }}>
          <p style={{
            fontSize: "0.62rem", letterSpacing: "0.2em", textTransform: "uppercase",
            color: C.violet, fontWeight: 700, marginBottom: "0.9rem",
          }}>
            Warrior Lodge · Sutton, Alaska · August 7–9
          </p>
          <h1 style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(2.4rem, 7vw, 3.8rem)",
            fontWeight: 700, lineHeight: 1.05,
            marginBottom: "1rem",
            background: "linear-gradient(135deg, #fff 30%, rgba(155,127,212,0.85) 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}>
            Sanctuary Pass
          </h1>
          <p style={{ fontSize: "1rem", lineHeight: 1.8, color: C.dim, maxWidth: "440px", margin: "0 auto" }}>
            A curated, intimate experience at Wellness Weekend — reserved for those seeking deeper immersion. Only {TOTAL} passes available.
          </p>
        </div>

        {/* Inclusions */}
        <div style={{
          background: C.card,
          border: `1px solid ${C.violetBorder}`,
          borderRadius: "16px",
          padding: "1.75rem",
          marginBottom: "1.75rem",
        }}>
          <p style={{ fontSize: "0.65rem", letterSpacing: "0.14em", textTransform: "uppercase", color: C.violet, marginBottom: "1.1rem", fontWeight: 700 }}>
            ✦ What&apos;s Included
          </p>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.7rem" }}>
            {[
              "Full 3-day weekend pass — Friday, Saturday & Sunday",
              "Priority access to all ceremonies & workshops",
              "On-site camping at Warrior Lodge",
              "Morning movement, yoga & breathwork sessions",
              "All main-stage music, sound healing & ecstatic dance",
              "Lion's Gate Activation Ceremony — August 8",
            ].map((item) => (
              <li key={item} style={{ fontSize: "0.88rem", color: "rgba(255,255,255,0.78)", lineHeight: 1.6, display: "flex", gap: "0.6rem" }}>
                <span style={{ color: C.violet, flexShrink: 0, marginTop: "0.05rem" }}>✦</span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Availability */}
        {claimed !== null && (
          <div style={{ marginBottom: "1.75rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.45rem" }}>
              <span style={{ fontSize: "0.78rem", color: C.faint }}>
                {claimed} of {TOTAL} spots reserved
              </span>
              <span style={{
                fontSize: "0.78rem", fontWeight: 600,
                color: isFull ? C.faint : isLow ? C.error : C.violet,
              }}>
                {isFull ? "Fully reserved" : `${remaining} remaining`}
              </span>
            </div>
            <div style={{ height: "4px", background: "rgba(255,255,255,0.08)", borderRadius: "2px", overflow: "hidden" }}>
              <div style={{
                height: "100%",
                width: `${Math.min((claimed / TOTAL) * 100, 100)}%`,
                background: isFull
                  ? "rgba(255,255,255,0.15)"
                  : "linear-gradient(90deg, #9B7FD4, #C9983F)",
                borderRadius: "2px",
                transition: "width 0.6s ease",
              }} />
            </div>
            {isLow && !isFull && (
              <p style={{ fontSize: "0.76rem", color: C.error, fontWeight: 600, marginTop: "0.5rem", textAlign: "center" }}>
                Only {remaining} spot{remaining === 1 ? "" : "s"} left
              </p>
            )}
          </div>
        )}

        {remaining === null && (
          <p style={{ textAlign: "center", color: C.faint, padding: "2rem 0", fontSize: "0.85rem" }}>
            Checking availability…
          </p>
        )}

        {/* Sold out */}
        {isFull && !submitted && (
          <div style={{
            textAlign: "center",
            background: C.card,
            border: `1px solid ${C.border}`,
            borderRadius: "16px",
            padding: "2.5rem 2rem",
          }}>
            <p style={{ fontSize: "0.7rem", letterSpacing: "0.14em", textTransform: "uppercase", color: C.faint, marginBottom: "0.75rem", fontWeight: 700 }}>
              All passes reserved
            </p>
            <p style={{ fontSize: "1rem", color: C.dim, lineHeight: 1.75, marginBottom: "1.5rem" }}>
              All {TOTAL} Sanctuary Pass spots have been claimed. Join us with a regular weekend ticket.
            </p>
            <a href="/#store" style={{
              display: "inline-block",
              padding: "0.8rem 2rem",
              background: `linear-gradient(135deg, ${C.gold}, #FF6B35)`,
              color: "#fff", fontWeight: 700, fontSize: "0.95rem",
              borderRadius: "30px", textDecoration: "none",
            }}>
              View All Tickets →
            </a>
          </div>
        )}

        {/* Success */}
        {submitted && (
          <div style={{
            textAlign: "center",
            background: C.card,
            border: `1px solid ${C.violetBorder}`,
            borderRadius: "16px",
            padding: "2.75rem 2rem",
          }}>
            <div style={{
              width: "52px", height: "52px", borderRadius: "50%",
              background: C.violetGlow, border: `1px solid ${C.violetBorder}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 1.25rem", fontSize: "1.4rem",
            }}>
              ✦
            </div>
            <p style={{ fontFamily: "var(--font-display)", fontSize: "1.7rem", fontWeight: 700, color: C.white, marginBottom: "0.75rem", lineHeight: 1.2 }}>
              Your spot is held.
            </p>
            <p style={{ fontSize: "1rem", color: C.dim, lineHeight: 1.8, marginBottom: "0.5rem" }}>
              Thank you, {name.split(" ")[0]}. We&apos;ll be in touch at{" "}
              <strong style={{ color: C.white }}>{email}</strong> with everything you need — payment details, schedule, and how to make the most of your Sanctuary experience.
            </p>
            <p style={{ fontSize: "0.82rem", color: C.faint, lineHeight: 1.7, marginBottom: "2rem" }}>
              Expect to hear from us within a few hours.
            </p>
            <div style={{ borderTop: `1px solid ${C.borderSubtle}`, paddingTop: "1.75rem" }}>
              <a href="/#schedule" style={{
                display: "inline-block",
                padding: "0.75rem 2rem",
                background: "rgba(155,127,212,0.2)",
                color: C.violet, fontWeight: 700, fontSize: "0.9rem",
                borderRadius: "30px", textDecoration: "none",
                border: `1px solid ${C.violetBorder}`,
              }}>
                Preview the Schedule →
              </a>
            </div>
            <p style={{ fontSize: "0.78rem", color: C.faint, marginTop: "1.25rem" }}>
              Questions?{" "}
              <a href="mailto:support@thesoundspace.us" style={{ color: C.violet }}>
                support@thesoundspace.us
              </a>
            </p>
          </div>
        )}

        {/* Form */}
        {!isFull && !submitted && remaining !== null && (
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.1rem" }}>

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
              <p style={{
                fontSize: "0.88rem", color: C.error,
                background: C.errorBg, border: "1px solid rgba(184,74,43,0.25)",
                borderRadius: "8px", padding: "0.75rem 1rem", margin: 0,
              }}>
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                marginTop: "0.5rem",
                padding: "1rem 2rem",
                background: loading
                  ? "rgba(155,127,212,0.25)"
                  : "linear-gradient(135deg, rgba(155,127,212,0.9), rgba(139,95,191,0.8))",
                color: "#fff",
                fontWeight: 700, fontSize: "1rem",
                border: `1px solid ${C.violetBorder}`,
                borderRadius: "30px",
                cursor: loading ? "not-allowed" : "pointer",
                letterSpacing: "0.03em",
                transition: "opacity 0.2s",
              }}
            >
              {loading ? "Reserving…" : "Reserve My Sanctuary Pass →"}
            </button>

            <p style={{ fontSize: "0.76rem", color: C.faint, textAlign: "center", lineHeight: 1.7 }}>
              We&apos;ll follow up with payment details within a few hours. Questions?{" "}
              <a href="mailto:support@thesoundspace.us" style={{ color: C.violet }}>
                support@thesoundspace.us
              </a>
            </p>

          </form>
        )}

      </main>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
      <label style={{
        fontSize: "0.7rem", letterSpacing: "0.1em", textTransform: "uppercase",
        color: "rgba(255,255,255,0.35)", fontWeight: 600,
      }}>
        {label}
      </label>
      {children}
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "0.8rem 1rem",
  background: "rgba(255,255,255,0.05)",
  border: "1px solid rgba(255,255,255,0.12)",
  borderRadius: "8px",
  color: "#fff",
  fontSize: "1rem",
  outline: "none",
  boxSizing: "border-box",
};
