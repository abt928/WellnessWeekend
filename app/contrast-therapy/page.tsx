"use client";

import { useState } from "react";
import Link from "next/link";

const C = {
  bg: "#F7F3EC",
  card: "#FBF9F4",
  charcoal: "#333533",
  muted: "rgba(51,53,51,0.6)",
  faint: "rgba(51,53,51,0.38)",
  teal: "#2E7A6D",
  tealLight: "rgba(46,122,109,0.1)",
  tealBorder: "rgba(46,122,109,0.3)",
  gold: "#C9983F",
  border: "rgba(51,53,51,0.12)",
  error: "#B84A2B",
  errorBg: "rgba(184,74,43,0.07)",
};

const SLOTS = [
  { key: "fri-3pm",    day: "Friday · Aug 7",    time: "3:00 PM" },
  { key: "sat-930am",  day: "Saturday · Aug 8",  time: "9:30 AM" },
  { key: "sat-530pm",  day: "Saturday · Aug 8",  time: "5:30 PM" },
  { key: "sun-9am",    day: "Sunday · Aug 9",    time: "9:00 AM" },
  { key: "sun-1130am", day: "Sunday · Aug 9",    time: "11:30 AM" },
];

export default function ContrastTherapyPage() {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  function toggle(key: string) {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key); else next.add(key);
      return next;
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (selected.size === 0) {
      setErrorMsg("Please select at least one session.");
      return;
    }
    setStatus("sending");
    setErrorMsg("");

    try {
      const res = await fetch("/api/contrast-booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          slots: [...selected].join(", "),
          notes: notes.trim(),
        }),
      });

      if (res.ok) {
        setStatus("sent");
      } else {
        const d = await res.json();
        setErrorMsg(d.error || "Something went wrong. Please try again.");
        setStatus("error");
      }
    } catch {
      setErrorMsg("Connection error. Please try again.");
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <main style={{ minHeight: "100vh", background: C.bg, display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
        <div style={{ maxWidth: 480, width: "100%", textAlign: "center" }}>
          <div style={{ fontSize: 48, marginBottom: "1rem" }}>🧊🔥</div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.6rem,4vw,2.2rem)", color: C.charcoal, marginBottom: "0.75rem" }}>
            You&apos;re on the list.
          </h1>
          <p style={{ color: C.muted, lineHeight: 1.6, marginBottom: "2rem" }}>
            Ashleigh will confirm your session slot by email before the event.
            Sessions are limited to 4 people — arrive a few minutes early.
          </p>
          <Link href="/" style={{ color: C.teal, fontWeight: 600, textDecoration: "none" }}>
            ← Back to the festival
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main style={{ minHeight: "100vh", background: C.bg, padding: "0 0 5rem" }}>

      {/* Header */}
      <div style={{ background: C.charcoal, color: "#fff", padding: "3.5rem 1.5rem 3rem", textAlign: "center" }}>
        <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.8rem", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "0.75rem" }}>
          Add-On Experience · Facilitated by Ashleigh Bicknell
        </p>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2rem,5vw,3rem)", fontWeight: 600, marginBottom: "0.5rem" }}>
          Contrast Therapy
        </h1>
        <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "1rem", maxWidth: 520, margin: "0 auto" }}>
          Cold water immersion + heat cycling · 30 minutes · Lakeside
        </p>
      </div>

      <div style={{ maxWidth: 640, margin: "0 auto", padding: "2.5rem 1.25rem 0" }}>

        {/* About */}
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: "2rem", marginBottom: "2rem" }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.25rem", color: C.charcoal, marginBottom: "0.75rem" }}>
            About the experience
          </h2>
          <p style={{ color: C.muted, lineHeight: 1.75, margin: 0 }}>
            Alternating cold water immersion and heat activates circulation, reduces inflammation,
            and powerfully grounds the nervous system. Sessions run in 30-minute slots throughout
            the weekend — the sauna holds <strong style={{ color: C.charcoal }}>4 people maximum</strong>.
            Bookings are confirmed by email before the event.
          </p>
        </div>

        <form onSubmit={handleSubmit}>

          {/* Slot selection */}
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.1rem", color: C.charcoal, marginBottom: "1rem" }}>
            Choose your session(s)
          </h2>
          <div style={{ display: "grid", gap: "0.6rem", marginBottom: "2rem" }}>
            {SLOTS.map(slot => {
              const active = selected.has(slot.key);
              return (
                <button
                  key={slot.key}
                  type="button"
                  onClick={() => toggle(slot.key)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem",
                    padding: "1rem 1.25rem",
                    background: active ? C.tealLight : C.card,
                    border: `2px solid ${active ? C.teal : C.border}`,
                    borderRadius: 12,
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "all 0.15s ease",
                  }}
                >
                  <span style={{
                    width: 22, height: 22, borderRadius: 6,
                    border: `2px solid ${active ? C.teal : C.faint}`,
                    background: active ? C.teal : "transparent",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0, transition: "all 0.15s ease",
                  }}>
                    {active && <span style={{ color: "#fff", fontSize: 13, fontWeight: 700 }}>✓</span>}
                  </span>
                  <span>
                    <span style={{ display: "block", fontWeight: 600, color: C.charcoal, fontSize: "0.95rem" }}>
                      {slot.time}
                    </span>
                    <span style={{ display: "block", color: C.muted, fontSize: "0.82rem", marginTop: 2 }}>
                      {slot.day}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>

          {/* Contact info */}
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.1rem", color: C.charcoal, marginBottom: "1rem" }}>
            Your details
          </h2>
          <div style={{ display: "grid", gap: "0.85rem", marginBottom: "2rem" }}>
            <input
              required
              type="text"
              placeholder="Full name *"
              value={name}
              onChange={e => setName(e.target.value)}
              style={inputStyle}
            />
            <input
              required
              type="email"
              placeholder="Email address *"
              value={email}
              onChange={e => setEmail(e.target.value)}
              style={inputStyle}
            />
            <input
              type="tel"
              placeholder="Phone (optional)"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              style={inputStyle}
            />
            <textarea
              placeholder="Any health considerations or questions for Ashleigh? (optional)"
              value={notes}
              onChange={e => setNotes(e.target.value)}
              rows={3}
              style={{ ...inputStyle, resize: "vertical" }}
            />
          </div>

          {errorMsg && (
            <p style={{ color: C.error, background: C.errorBg, border: `1px solid ${C.error}30`, borderRadius: 8, padding: "0.75rem 1rem", fontSize: "0.875rem", marginBottom: "1rem" }}>
              {errorMsg}
            </p>
          )}

          <button
            type="submit"
            disabled={status === "sending"}
            style={{
              width: "100%",
              padding: "1rem",
              background: C.teal,
              color: "#fff",
              border: "none",
              borderRadius: 12,
              fontSize: "1rem",
              fontWeight: 700,
              cursor: status === "sending" ? "not-allowed" : "pointer",
              opacity: status === "sending" ? 0.7 : 1,
              letterSpacing: "0.02em",
            }}
          >
            {status === "sending" ? "Sending…" : "Request Booking"}
          </button>

          <p style={{ color: C.faint, fontSize: "0.78rem", textAlign: "center", marginTop: "0.75rem" }}>
            Ashleigh will confirm your spot by email. Sessions are limited to 4 people.
          </p>
        </form>

        <div style={{ textAlign: "center", marginTop: "2.5rem" }}>
          <Link href="/" style={{ color: C.teal, fontSize: "0.875rem", textDecoration: "none" }}>
            ← Back to the festival
          </Link>
        </div>
      </div>
    </main>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "0.875rem 1rem",
  background: "#fff",
  border: `1.5px solid rgba(51,53,51,0.15)`,
  borderRadius: 10,
  fontSize: "0.95rem",
  color: "#333533",
  outline: "none",
  boxSizing: "border-box",
};
