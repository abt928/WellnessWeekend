"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

const TOTAL_BEDS = 40;

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
      <nav className="legal-nav">
        <Link href="/" className="legal-nav-back">← Back to Wellness Weekend</Link>
      </nav>

      <main style={{ minHeight: "100vh", padding: "3rem 1.5rem 5rem", maxWidth: "680px", margin: "0 auto" }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <p style={{ fontSize: "0.75rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--gold)", marginBottom: "0.75rem" }}>
            Warrior Lodge · Sutton, Alaska
          </p>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 700, lineHeight: 1.15, marginBottom: "1rem", color: "var(--warm-white)" }}>
            Warriors Welcome.
          </h1>
          <p style={{ fontSize: "1.05rem", lineHeight: 1.75, color: "rgba(255,255,255,0.72)", maxWidth: "520px", margin: "0 auto" }}>
            We are donating 4 cabins — 40 beds — to veterans and their families as a gesture of gratitude from our artists, healers, and community. If you or someone you love has served, this is for you.
          </p>
        </div>

        {/* What's Included */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "2.5rem" }}>
          <div style={{ background: "rgba(201,152,63,0.08)", border: "1px solid rgba(201,152,63,0.25)", borderRadius: "12px", padding: "1.25rem" }}>
            <p style={{ fontSize: "0.7rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--gold)", marginBottom: "0.75rem", fontWeight: 600 }}>
              ✓ What&apos;s Included
            </p>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {[
                "Full weekend pass — all three days",
                "Lodging at Warrior Lodge",
              ].map((item) => (
                <li key={item} style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.85)", lineHeight: 1.5 }}>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", padding: "1.25rem" }}>
            <p style={{ fontSize: "0.7rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.45)", marginBottom: "0.75rem", fontWeight: 600 }}>
              Not Included
            </p>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {[
                "Limited-space workshops may have a booking fee",
                "Equipment rental where applicable",
                "Add-ons (sauna, meals) paid directly to vendors",
              ].map((item) => (
                <li key={item} style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.45)", lineHeight: 1.5 }}>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bed availability bar */}
        {bedsClaimed !== null && (
          <div style={{ marginBottom: "2rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.4rem" }}>
              <span style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.5)" }}>
                {bedsClaimed} of {TOTAL_BEDS} beds claimed
              </span>
              <span style={{ fontSize: "0.8rem", color: isFull ? "rgba(255,255,255,0.4)" : "var(--gold)", fontWeight: 600 }}>
                {isFull ? "All beds claimed" : `${bedsRemaining} remaining`}
              </span>
            </div>
            <div style={{ height: "6px", background: "rgba(255,255,255,0.1)", borderRadius: "3px", overflow: "hidden" }}>
              <div style={{
                height: "100%",
                width: `${Math.min((bedsClaimed / TOTAL_BEDS) * 100, 100)}%`,
                background: isFull ? "rgba(255,255,255,0.3)" : "linear-gradient(90deg, var(--gold), #FF6B35)",
                borderRadius: "3px",
                transition: "width 0.6s ease",
              }} />
            </div>
          </div>
        )}

        {/* State: loading */}
        {bedsRemaining === null && (
          <p style={{ textAlign: "center", color: "rgba(255,255,255,0.4)", padding: "3rem 0" }}>Checking availability…</p>
        )}

        {/* State: all beds claimed */}
        {isFull && !submitted && (
          <div style={{ textAlign: "center", background: "rgba(201,152,63,0.07)", border: "1px solid rgba(201,152,63,0.2)", borderRadius: "16px", padding: "2.5rem 2rem" }}>
            <p style={{ fontSize: "0.8rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--gold)", marginBottom: "1rem" }}>
              Cabin beds are fully claimed
            </p>
            <p style={{ fontSize: "1rem", color: "rgba(255,255,255,0.7)", lineHeight: 1.7, marginBottom: "1.5rem" }}>
              All 40 donated beds have been reserved. We&apos;re so grateful for the response. You can still join us — use the code below for 30% off your ticket.
            </p>
            <div style={{ background: "rgba(0,0,0,0.3)", border: "1px dashed rgba(201,152,63,0.5)", borderRadius: "10px", padding: "1.25rem 2rem", display: "inline-block", marginBottom: "1.5rem" }}>
              <p style={{ fontSize: "0.7rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--gold)", marginBottom: "0.35rem" }}>30% Discount Code</p>
              <p style={{ fontFamily: "var(--font-display)", fontSize: "2rem", fontWeight: 800, color: "var(--warm-white)", letterSpacing: "0.08em" }}>WARRIOR</p>
            </div>
            <p style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.45)" }}>
              Enter this code at checkout on our <Link href="/#store" style={{ color: "var(--gold)" }}>tickets page</Link>.
            </p>
          </div>
        )}

        {/* State: submitted successfully */}
        {submitted && (
          <div style={{ textAlign: "center", background: "rgba(201,152,63,0.07)", border: "1px solid rgba(201,152,63,0.2)", borderRadius: "16px", padding: "2.5rem 2rem" }}>
            <p style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", fontWeight: 700, color: "var(--warm-white)", marginBottom: "0.75rem" }}>
              Application received. ✦
            </p>
            <p style={{ fontSize: "1rem", color: "rgba(255,255,255,0.7)", lineHeight: 1.7 }}>
              Thank you, {name.split(" ")[0]}. We&apos;ll be in touch at {email} with your confirmation and everything you need to know before arriving.
            </p>
            <p style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.4)", marginTop: "1rem" }}>
              Questions? <a href="mailto:support@thesoundspace.us" style={{ color: "var(--gold)" }}>support@thesoundspace.us</a>
            </p>
          </div>
        )}

        {/* State: form available */}
        {!isFull && !submitted && bedsRemaining !== null && (
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
              <label style={{ fontSize: "0.8rem", letterSpacing: "0.06em", textTransform: "uppercase", color: "rgba(255,255,255,0.55)" }}>
                Full Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your full name"
                style={inputStyle}
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
              <label style={{ fontSize: "0.8rem", letterSpacing: "0.06em", textTransform: "uppercase", color: "rgba(255,255,255,0.55)" }}>
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                style={inputStyle}
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                <label style={{ fontSize: "0.8rem", letterSpacing: "0.06em", textTransform: "uppercase", color: "rgba(255,255,255,0.55)" }}>
                  People in Your Family
                </label>
                <input
                  type="number"
                  required
                  min={1}
                  max={20}
                  value={familySize}
                  onChange={(e) => setFamilySize(e.target.value)}
                  placeholder="e.g. 4"
                  style={inputStyle}
                />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                <label style={{ fontSize: "0.8rem", letterSpacing: "0.06em", textTransform: "uppercase", color: "rgba(255,255,255,0.55)" }}>
                  Beds Needed
                </label>
                <input
                  type="number"
                  required
                  min={1}
                  max={Math.min(bedsRemaining, 10)}
                  value={bedsNeeded}
                  onChange={(e) => setBedsNeeded(e.target.value)}
                  placeholder="e.g. 2"
                  style={inputStyle}
                />
                <span style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.35)" }}>
                  {bedsRemaining} bed{bedsRemaining === 1 ? "" : "s"} available
                </span>
              </div>
            </div>

            {error && (
              <p style={{ fontSize: "0.9rem", color: "#FF8C55", background: "rgba(255,107,53,0.08)", border: "1px solid rgba(255,107,53,0.2)", borderRadius: "8px", padding: "0.75rem 1rem" }}>
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                marginTop: "0.5rem",
                padding: "0.9rem 2rem",
                background: loading ? "rgba(201,152,63,0.4)" : "linear-gradient(135deg, var(--gold), #FF6B35)",
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

            <p style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.35)", textAlign: "center" }}>
              We&apos;ll confirm your reservation by email. Questions? <a href="mailto:support@thesoundspace.us" style={{ color: "var(--gold)" }}>support@thesoundspace.us</a>
            </p>
          </form>
        )}
      </main>
    </>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "0.75rem 1rem",
  background: "rgba(255,255,255,0.05)",
  border: "1px solid rgba(255,255,255,0.15)",
  borderRadius: "8px",
  color: "var(--warm-white)",
  fontSize: "1rem",
  outline: "none",
  boxSizing: "border-box",
};
