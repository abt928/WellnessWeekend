"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const C = {
  bg: "#F7F3EC",
  card: "#FBF9F4",
  charcoal: "#333533",
  muted: "rgba(51,53,51,0.6)",
  faint: "rgba(51,53,51,0.38)",
  teal: "#3DB8AF",
  tealLight: "rgba(61,184,175,0.1)",
  gold: "#C9983F",
  border: "rgba(51,53,51,0.12)",
  error: "#B84A2B",
  errorBg: "rgba(184,74,43,0.07)",
};

const SLOTS = [
  { key: "fri-2pm",      day: "Friday · Aug 7",   time: "2:00 PM", note: "Paddleboard Yoga · with Alice" },
  { key: "sat-1pm",      day: "Saturday · Aug 8", time: "1:00 PM", note: "Paddleboard Yoga · with Alice" },
  { key: "sun-1pm-kids", day: "Sunday · Aug 9",   time: "1:00 PM", note: "Kids Paddleboard · with Alice" },
  { key: "sun-3pm",      day: "Sunday · Aug 9",   time: "3:00 PM", note: "Paddleboard Yoga · with Alice" },
];

interface SlotAvailability { booked: number; capacity: number; full: boolean; }

export default function PaddleboardPage() {
  const [slot, setSlot] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [availability, setAvailability] = useState<Record<string, SlotAvailability>>({});

  useEffect(() => {
    fetch("/api/paddleboard-booking")
      .then(r => r.json())
      .then(d => { if (d.availability) setAvailability(d.availability); })
      .catch(() => {});
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!slot) { setErrorMsg("Please select a session time."); return; }
    setStatus("sending");
    setErrorMsg("");

    try {
      const res = await fetch("/api/paddleboard-booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), email: email.trim(), phone: phone.trim(), slot, notes: notes.trim() }),
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
          <div style={{ fontSize: 48, marginBottom: "1rem" }}>🏄</div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.6rem,4vw,2.2rem)", color: C.charcoal, marginBottom: "0.75rem" }}>
            You&apos;re on the water.
          </h1>
          <p style={{ color: C.muted, lineHeight: 1.6, marginBottom: "2rem" }}>
            Your instructor will confirm your spot by email before the event.
            Wear clothes you don&apos;t mind getting wet.
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
          Add-On Experience · Lakeside
        </p>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2rem,5vw,3rem)", fontWeight: 600, marginBottom: "0.5rem" }}>
          Paddleboard Yoga
        </h1>
        <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "1rem", maxWidth: 520, margin: "0 auto" }}>
          All-levels flow on the lake under the Alaskan sun. Boards provided by Alaska Fly Dog.
        </p>
      </div>

      <div style={{ maxWidth: 640, margin: "0 auto", padding: "2.5rem 1.25rem 0" }}>

        {/* About */}
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: "2rem", marginBottom: "2rem" }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.25rem", color: C.charcoal, marginBottom: "0.75rem" }}>
            About the experience
          </h2>
          <p style={{ color: C.muted, lineHeight: 1.75, margin: 0 }}>
            All-levels stand-up paddleboard yoga on the still morning lake — expect to get wet, and expect to feel amazing.
            Sessions run <strong style={{ color: C.charcoal }}>7 people maximum</strong>, boards and paddles provided by our
            adventure equipment partner, Alaska Fly Dog. Bookings are confirmed by email before the event.
          </p>
        </div>

        <form onSubmit={handleSubmit}>

          {/* Slot selection */}
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.1rem", color: C.charcoal, marginBottom: "1rem" }}>
            Choose your session
          </h2>
          <div style={{ display: "grid", gap: "0.6rem", marginBottom: "2rem" }}>
            {SLOTS.map(s => {
              const active = slot === s.key;
              const a = availability[s.key];
              const isFull = a?.full ?? false;
              const remaining = a ? a.capacity - a.booked : null;
              return (
                <button
                  key={s.key}
                  type="button"
                  onClick={() => !isFull && setSlot(s.key)}
                  disabled={isFull}
                  style={{
                    display: "flex", alignItems: "center", gap: "1rem",
                    padding: "1rem 1.25rem",
                    background: isFull ? "rgba(51,53,51,0.04)" : active ? C.tealLight : C.card,
                    border: `2px solid ${isFull ? "rgba(51,53,51,0.1)" : active ? C.teal : C.border}`,
                    borderRadius: 12, cursor: isFull ? "not-allowed" : "pointer", textAlign: "left",
                    opacity: isFull ? 0.6 : 1, transition: "all 0.15s ease",
                  }}
                >
                  <span style={{ flex: 1 }}>
                    <span style={{ display: "block", fontWeight: 600, color: isFull ? C.muted : C.charcoal, fontSize: "0.95rem" }}>
                      {s.day} · {s.time}
                    </span>
                    <span style={{ display: "block", color: C.muted, fontSize: "0.82rem", marginTop: 2 }}>{s.note}</span>
                  </span>
                  {isFull ? (
                    <span style={{ fontSize: "0.72rem", fontWeight: 700, color: "#B84A2B", background: "rgba(184,74,43,0.1)", padding: "0.2rem 0.55rem", borderRadius: 20, flexShrink: 0 }}>
                      Full
                    </span>
                  ) : remaining !== null && remaining <= 2 ? (
                    <span style={{ fontSize: "0.72rem", fontWeight: 600, color: C.gold, background: "rgba(201,152,63,0.12)", padding: "0.2rem 0.55rem", borderRadius: 20, flexShrink: 0 }}>
                      {remaining} left
                    </span>
                  ) : active ? (
                    <span style={{ fontSize: "0.72rem", fontWeight: 700, color: C.teal, flexShrink: 0 }}>Selected ✓</span>
                  ) : null}
                </button>
              );
            })}
          </div>

          {/* Contact info */}
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.1rem", color: C.charcoal, marginBottom: "1rem" }}>
            Your details
          </h2>
          <div style={{ display: "grid", gap: "0.85rem", marginBottom: "2rem" }}>
            <input required type="text" placeholder="Full name *" value={name} onChange={e => setName(e.target.value)} style={inputStyle} />
            <input required type="email" placeholder="Email address *" value={email} onChange={e => setEmail(e.target.value)} style={inputStyle} />
            <input type="tel" placeholder="Phone (optional)" value={phone} onChange={e => setPhone(e.target.value)} style={inputStyle} />
            <textarea
              placeholder="Anything your instructor should know? (optional)"
              value={notes} onChange={e => setNotes(e.target.value)} rows={3}
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
              width: "100%", padding: "1rem", background: C.teal, color: "#fff",
              border: "none", borderRadius: 12, fontSize: "1rem", fontWeight: 700,
              cursor: status === "sending" ? "not-allowed" : "pointer",
              opacity: status === "sending" ? 0.7 : 1, letterSpacing: "0.02em",
            }}
          >
            {status === "sending" ? "Sending…" : "Request Booking"}
          </button>

          <p style={{ color: C.faint, fontSize: "0.78rem", textAlign: "center", marginTop: "0.75rem" }}>
            Your instructor will confirm your spot by email. Sessions are limited to 7 people.
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
  width: "100%", padding: "0.875rem 1rem", background: "#fff",
  border: "1.5px solid rgba(51,53,51,0.15)", borderRadius: 10,
  fontSize: "0.95rem", color: "#333533", outline: "none", boxSizing: "border-box",
};
