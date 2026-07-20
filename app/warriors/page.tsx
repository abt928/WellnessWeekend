"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

const TOTAL_BEDS = 40;

const C = {
  bg: "#F7F3EC",
  card: "#FBF9F4",
  charcoal: "#333533",
  muted: "rgba(51,53,51,0.6)",
  faint: "rgba(51,53,51,0.38)",
  gold: "#C9983F",
  goldBorder: "rgba(201,152,63,0.35)",
  border: "rgba(51,53,51,0.12)",
  error: "#B84A2B",
  errorBg: "rgba(184,74,43,0.07)",
};

export default function WarriorsPage() {
  const [bedsRemaining, setBedsRemaining] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [familySize, setFamilySize] = useState("");
  const [bedsNeeded, setBedsNeeded] = useState("");

  useEffect(() => {
    fetch("/api/warriors")
      .then((r) => r.json())
      .then((d) => setBedsRemaining(d.bedsRemaining ?? 0));
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/warriors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          familySize: parseInt(familySize),
          bedsNeeded: parseInt(bedsNeeded),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong. Please try again.");
      } else {
        setBedsRemaining(data.bedsRemaining);
        setSubmitted(true);
      }
    } catch {
      setError("Unable to submit. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const bedsClaimed = bedsRemaining !== null ? TOTAL_BEDS - bedsRemaining : null;
  const isFull = bedsRemaining !== null && bedsRemaining <= 0;

  return (
    <>
      <nav style={{ background: C.bg, borderBottom: `1px solid ${C.border}`, padding: "0.9rem 1.5rem" }}>
        <Link href="/" style={{ fontSize: "0.85rem", color: C.muted, textDecoration: "none" }}>
          ← Back to Wellness Weekend
        </Link>
      </nav>

      <main style={{ minHeight: "100vh", background: C.bg, padding: "3rem 1.5rem 5rem" }}>
        <div style={{ maxWidth: "640px", margin: "0 auto" }}>

          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
            <p style={{ fontSize: "0.7rem", letterSpacing: "0.14em", textTransform: "uppercase", color: C.gold, marginBottom: "0.75rem", fontWeight: 600 }}>
              Warrior Lodge · Sutton, Alaska
            </p>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 700, lineHeight: 1.15, marginBottom: "1rem", color: C.charcoal }}>
              Warriors Welcome.
            </h1>
            <p style={{ fontSize: "1.05rem", lineHeight: 1.75, color: C.muted, maxWidth: "500px", margin: "0 auto" }}>
              We are partnering with Alaska Healing Hearts to offer 40 beds to veterans and their families as a gesture of gratitude from our artists, healers, and community. If you or someone you love has served, this is for you.
            </p>
          </div>

          {/* What's Included / Not Included */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "2.5rem" }}>
            <div style={{ background: C.card, border: `1px solid ${C.goldBorder}`, borderRadius: "12px", padding: "1.25rem" }}>
              <p style={{ fontSize: "0.68rem", letterSpacing: "0.12em", textTransform: "uppercase", color: C.gold, marginBottom: "0.75rem", fontWeight: 700 }}>
                ✓ What&apos;s Included
              </p>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {[
                  "Full weekend pass — all three days",
                  "Lodging at Warrior Lodge",
                ].map((item) => (
                  <li key={item} style={{ fontSize: "0.9rem", color: C.charcoal, lineHeight: 1.55 }}>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: "12px", padding: "1.25rem" }}>
              <p style={{ fontSize: "0.68rem", letterSpacing: "0.12em", textTransform: "uppercase", color: C.faint, marginBottom: "0.75rem", fontWeight: 700 }}>
                Not Included
              </p>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {[
                  "Limited-space workshops may have a booking fee",
                  "Equipment rental where applicable",
                  "Add-ons (sauna, meals) paid directly to vendors",
                ].map((item) => (
                  <li key={item} style={{ fontSize: "0.85rem", color: C.muted, lineHeight: 1.55 }}>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Availability bar */}
          {bedsClaimed !== null && (
            <div style={{ marginBottom: "2rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.4rem" }}>
                <span style={{ fontSize: "0.8rem", color: C.muted }}>
                  {bedsClaimed} of {TOTAL_BEDS} beds claimed
                </span>
                <span style={{ fontSize: "0.8rem", color: isFull ? C.faint : C.gold, fontWeight: 600 }}>
                  {isFull ? "All beds claimed" : `${bedsRemaining} remaining`}
                </span>
              </div>
              <div style={{ height: "6px", background: C.border, borderRadius: "3px", overflow: "hidden" }}>
                <div style={{
                  height: "100%",
                  width: `${Math.min(((bedsClaimed) / TOTAL_BEDS) * 100, 100)}%`,
                  background: isFull ? C.faint : `linear-gradient(90deg, ${C.gold}, #FF6B35)`,
                  borderRadius: "3px",
                  transition: "width 0.6s ease",
                }} />
              </div>
            </div>
          )}

          {/* Loading */}
          {bedsRemaining === null && (
            <p style={{ textAlign: "center", color: C.faint, padding: "3rem 0" }}>Checking availability…</p>
          )}

          {/* All beds claimed → show discount code */}
          {isFull && !submitted && (
            <div style={{ textAlign: "center", background: C.card, border: `1px solid ${C.goldBorder}`, borderRadius: "16px", padding: "2.5rem 2rem" }}>
              <p style={{ fontSize: "0.72rem", letterSpacing: "0.12em", textTransform: "uppercase", color: C.gold, marginBottom: "1rem", fontWeight: 600 }}>
                Cabin beds are fully claimed
              </p>
              <p style={{ fontSize: "1rem", color: C.charcoal, lineHeight: 1.7, marginBottom: "1.75rem" }}>
                All 40 donated beds have been reserved. We&apos;re so grateful for the response. You can still join us — use the code below for 30% off your ticket.
              </p>
              <div style={{ background: C.bg, border: `1.5px dashed ${C.goldBorder}`, borderRadius: "10px", padding: "1.25rem 2.5rem", display: "inline-block", marginBottom: "1.5rem" }}>
                <p style={{ fontSize: "0.68rem", letterSpacing: "0.12em", textTransform: "uppercase", color: C.gold, marginBottom: "0.4rem", fontWeight: 600 }}>30% Discount Code</p>
                <p style={{ fontFamily: "var(--font-display)", fontSize: "2.2rem", fontWeight: 800, color: C.charcoal, letterSpacing: "0.08em" }}>WARRIOR</p>
              </div>
              <p style={{ fontSize: "0.85rem", color: C.muted }}>
                Enter this code at checkout on our <Link href="/#store" style={{ color: C.gold }}>tickets page</Link>.
              </p>
            </div>
          )}

          {/* Success state */}
          {submitted && (
            <div style={{ textAlign: "center", background: C.card, border: `1px solid ${C.goldBorder}`, borderRadius: "16px", padding: "2.5rem 2rem" }}>
              <p style={{ fontFamily: "var(--font-display)", fontSize: "1.6rem", fontWeight: 700, color: C.charcoal, marginBottom: "0.75rem" }}>
                Application received. ✦
              </p>
              <p style={{ fontSize: "1rem", color: C.muted, lineHeight: 1.75 }}>
                Thank you, {name.split(" ")[0]}. We&apos;ll be in touch at <strong style={{ color: C.charcoal }}>{email}</strong> with your confirmation and everything you need to know before arriving.
              </p>
              <p style={{ fontSize: "0.85rem", color: C.faint, marginTop: "1.25rem" }}>
                Questions? <a href="mailto:support@thesoundspace.us" style={{ color: C.gold }}>support@thesoundspace.us</a>
              </p>
            </div>
          )}

          {/* Form */}
          {!isFull && !submitted && bedsRemaining !== null && (
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>

              <Field label="Full Name">
                <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Your full name" style={inputStyle} />
              </Field>

              <Field label="Email Address">
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" style={inputStyle} />
              </Field>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <Field label="People in Your Family">
                  <input type="number" required min={1} max={20} value={familySize} onChange={(e) => setFamilySize(e.target.value)} placeholder="e.g. 4" style={inputStyle} />
                </Field>
                <Field label="Beds Needed" hint={`${bedsRemaining} bed${bedsRemaining === 1 ? "" : "s"} available`}>
                  <input type="number" required min={1} max={Math.min(bedsRemaining, 10)} value={bedsNeeded} onChange={(e) => setBedsNeeded(e.target.value)} placeholder="e.g. 2" style={inputStyle} />
                </Field>
              </div>

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
                  background: loading ? `rgba(201,152,63,0.5)` : `linear-gradient(135deg, ${C.gold}, #FF6B35)`,
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
                {loading ? "Submitting…" : "Claim Your Cabin Beds →"}
              </button>

              <p style={{ fontSize: "0.8rem", color: C.faint, textAlign: "center" }}>
                We&apos;ll confirm by email. Questions?{" "}
                <a href="mailto:support@thesoundspace.us" style={{ color: C.gold }}>support@thesoundspace.us</a>
              </p>
            </form>
          )}

        </div>
      </main>
    </>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
      <label style={{ fontSize: "0.75rem", letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(51,53,51,0.55)", fontWeight: 600 }}>
        {label}
      </label>
      {children}
      {hint && <span style={{ fontSize: "0.75rem", color: "rgba(51,53,51,0.4)" }}>{hint}</span>}
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
