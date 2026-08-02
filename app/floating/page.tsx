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
  violet: "#9B7FD4",
  violetLight: "rgba(155,127,212,0.1)",
  gold: "#C9983F",
  border: "rgba(51,53,51,0.12)",
  error: "#B84A2B",
  errorBg: "rgba(184,74,43,0.07)",
};

const SESSIONS = [
  {
    key: "sat-7am",
    time: "7:00 AM",
    label: "Floating Sound Bath",
    detail: "Peace Pixy's handpan fills the morning air as you float — 45 minutes of pure sound on the lake.",
  },
  {
    key: "sat-8am",
    time: "8:00 AM",
    label: "Lionsgate Activation + Sound Bath",
    detail: "Ceremony at 8:08 AM — the Lion's Gate Portal opens as Avalon holds space above the water.",
  },
];

const MODES = [
  {
    key: "water",
    label: "Float on Water",
    sub: "Paddleboard · Alaska Fly Dog",
    desc: "Lie back on a stable stand-up paddleboard and let the sound carry you across the still morning lake. No paddling required — just arrive and float.",
    color: C.teal,
    colorLight: C.tealLight,
    icon: "🏄",
  },
  {
    key: "air",
    label: "Float on Air",
    sub: "Silk Hammock · Alaska Fly Dog",
    desc: "Suspended in a silk aerial hammock inches above the ground — weightless, wrapped, and held by sound while the music moves through you.",
    color: C.violet,
    colorLight: C.violetLight,
    icon: "🕸️",
  },
];

interface SlotAvail { booked: number; capacity: number; full: boolean; }

export default function FloatingPage() {
  const [mode, setMode] = useState<"" | "water" | "air">("");
  const [session, setSession] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [padAvail, setPadAvail] = useState<Record<string, SlotAvail>>({});
  const [silkAvail, setSilkAvail] = useState<Record<string, SlotAvail>>({});

  useEffect(() => {
    fetch("/api/paddleboard-booking")
      .then(r => r.json())
      .then(d => { if (d.availability) setPadAvail(d.availability); })
      .catch(() => {});
    fetch("/api/aerial-booking")
      .then(r => r.json())
      .then(d => { if (d.availability?.solo) setSilkAvail(d.availability.solo); })
      .catch(() => {});
  }, []);

  function pickMode(key: "water" | "air") {
    setMode(key);
    setSession("");
  }

  function getAvail(slot: string): SlotAvail | null {
    if (mode === "water") return padAvail[slot] ?? null;
    if (mode === "air") return silkAvail[slot] ?? null;
    return null;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!mode) { setErrorMsg("Please choose paddleboard or silk hammock."); return; }
    if (!session) { setErrorMsg("Please select a session time."); return; }
    setStatus("sending");
    setErrorMsg("");

    try {
      const endpoint = mode === "water" ? "/api/paddleboard-booking" : "/api/aerial-booking";
      const body = mode === "water"
        ? { name: name.trim(), email: email.trim(), phone: phone.trim(), slot: session, notes: notes.trim() }
        : { name: name.trim(), email: email.trim(), phone: phone.trim(), mode: "solo", slot: session, notes: notes.trim() };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
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

  const activeMode = MODES.find(m => m.key === mode);

  if (status === "sent") {
    return (
      <main style={{ minHeight: "100vh", background: C.bg, display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
        <div style={{ maxWidth: 480, width: "100%", textAlign: "center" }}>
          <div style={{ fontSize: 48, marginBottom: "1rem" }}>{mode === "water" ? "🏄" : "🕸️"}</div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.6rem,4vw,2.2rem)", color: C.charcoal, marginBottom: "0.75rem" }}>
            {mode === "water" ? "You're on the water." : "You're floating on air."}
          </h1>
          <p style={{ color: C.muted, lineHeight: 1.6, marginBottom: "2rem" }}>
            Your spot will be confirmed by email before the event. Arrive 10 minutes early to get settled before the sound begins.
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
      <div style={{
        background: C.charcoal, color: "#fff",
        padding: "3.5rem 1.5rem 3rem", textAlign: "center",
      }}>
        <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.8rem", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "0.75rem" }}>
          Add-On Experience · Saturday August 8 · Lakeside
        </p>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2rem,5vw,3rem)", fontWeight: 600, marginBottom: "0.5rem" }}>
          Float on Water, Float on Air
        </h1>
        <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "1rem", maxWidth: 540, margin: "0 auto" }}>
          The Floating Sound Bath — suspend yourself on a paddleboard or in a silk hammock as Peace Pixy and Avalon Starling hold space above the Alaskan lake.
        </p>
      </div>

      <div style={{ maxWidth: 660, margin: "0 auto", padding: "2.5rem 1.25rem 0" }}>
        <form onSubmit={handleSubmit}>

          {/* Step 1 — Water or Air */}
          <h2 style={sectionHead}>1. Choose your float</h2>
          <div style={{ display: "grid", gap: "0.75rem", marginBottom: "2rem" }}>
            {MODES.map(m => {
              const active = mode === m.key;
              return (
                <button
                  key={m.key}
                  type="button"
                  onClick={() => pickMode(m.key as "water" | "air")}
                  style={{
                    display: "flex", alignItems: "flex-start", gap: "1rem",
                    padding: "1.1rem 1.25rem",
                    background: active ? m.colorLight : C.card,
                    border: `2px solid ${active ? m.color : C.border}`,
                    borderRadius: 14, cursor: "pointer", textAlign: "left",
                    transition: "all 0.15s ease",
                  }}
                >
                  <span style={{ fontSize: "1.75rem", lineHeight: 1, flexShrink: 0, marginTop: 2 }}>{m.icon}</span>
                  <span>
                    <span style={{ display: "block", fontWeight: 700, color: C.charcoal, fontSize: "1rem" }}>{m.label}</span>
                    <span style={{ display: "block", color: m.color, fontSize: "0.78rem", fontWeight: 600, letterSpacing: "0.05em", marginTop: 2 }}>{m.sub}</span>
                    <span style={{ display: "block", color: C.muted, fontSize: "0.83rem", marginTop: 4, lineHeight: 1.55 }}>{m.desc}</span>
                  </span>
                </button>
              );
            })}
          </div>

          {/* Step 2 — Session */}
          {mode && (
            <>
              <h2 style={sectionHead}>2. Choose your session</h2>
              <div style={{ display: "grid", gap: "0.75rem", marginBottom: "2rem" }}>
                {SESSIONS.map(s => {
                  const active = session === s.key;
                  const avail = getAvail(s.key);
                  const isFull = avail?.full ?? false;
                  const remaining = avail ? avail.capacity - avail.booked : null;
                  const accentColor = activeMode!.color;
                  const accentLight = activeMode!.colorLight;
                  return (
                    <button
                      key={s.key}
                      type="button"
                      onClick={() => !isFull && setSession(s.key)}
                      disabled={isFull}
                      style={{
                        display: "flex", alignItems: "center", gap: "1rem",
                        padding: "1rem 1.25rem",
                        background: isFull ? "rgba(51,53,51,0.04)" : active ? accentLight : C.card,
                        border: `2px solid ${isFull ? "rgba(51,53,51,0.1)" : active ? accentColor : C.border}`,
                        borderRadius: 12, cursor: isFull ? "not-allowed" : "pointer", textAlign: "left",
                        opacity: isFull ? 0.6 : 1, transition: "all 0.15s ease",
                      }}
                    >
                      <span style={{ flex: 1 }}>
                        <span style={{ display: "flex", alignItems: "baseline", gap: "0.5rem" }}>
                          <span style={{ fontWeight: 700, fontSize: "1.05rem", color: isFull ? C.muted : C.charcoal }}>
                            {s.time}
                          </span>
                          <span style={{ fontWeight: 600, fontSize: "0.88rem", color: isFull ? C.faint : C.charcoal }}>
                            · {s.label}
                          </span>
                        </span>
                        <span style={{ display: "block", color: C.muted, fontSize: "0.8rem", marginTop: "0.25rem", lineHeight: 1.5 }}>
                          {s.detail}
                        </span>
                      </span>
                      {isFull ? (
                        <span style={{ fontSize: "0.72rem", fontWeight: 700, color: C.error, background: "rgba(184,74,43,0.1)", padding: "0.2rem 0.55rem", borderRadius: 20, flexShrink: 0 }}>
                          Full
                        </span>
                      ) : remaining !== null && remaining <= 2 ? (
                        <span style={{ fontSize: "0.72rem", fontWeight: 600, color: C.gold, background: "rgba(201,152,63,0.12)", padding: "0.2rem 0.55rem", borderRadius: 20, flexShrink: 0 }}>
                          {remaining} left
                        </span>
                      ) : active ? (
                        <span style={{ fontSize: "0.72rem", fontWeight: 700, color: accentColor, flexShrink: 0 }}>Selected ✓</span>
                      ) : null}
                    </button>
                  );
                })}
              </div>
            </>
          )}

          {/* Step 3 — Contact */}
          {mode && session && (
            <>
              <h2 style={sectionHead}>3. Your details</h2>
              <div style={{ display: "grid", gap: "0.85rem", marginBottom: "2rem" }}>
                <input required type="text" placeholder="Full name *" value={name} onChange={e => setName(e.target.value)} style={inputStyle} />
                <input required type="email" placeholder="Email address *" value={email} onChange={e => setEmail(e.target.value)} style={inputStyle} />
                <input type="tel" placeholder="Phone (optional)" value={phone} onChange={e => setPhone(e.target.value)} style={inputStyle} />
                <textarea
                  placeholder="Anything we should know? (optional)"
                  value={notes} onChange={e => setNotes(e.target.value)} rows={3}
                  style={{ ...inputStyle, resize: "vertical" }}
                />
              </div>
            </>
          )}

          {errorMsg && (
            <p style={{ color: C.error, background: C.errorBg, border: `1px solid ${C.error}30`, borderRadius: 8, padding: "0.75rem 1rem", fontSize: "0.875rem", marginBottom: "1rem" }}>
              {errorMsg}
            </p>
          )}

          <button
            type="submit"
            disabled={status === "sending" || !mode || !session}
            style={{
              width: "100%", padding: "1rem",
              background: activeMode ? activeMode.color : C.charcoal,
              color: "#fff", border: "none", borderRadius: 12,
              fontSize: "1rem", fontWeight: 700,
              cursor: status === "sending" || !mode || !session ? "not-allowed" : "pointer",
              opacity: status === "sending" || !mode || !session ? 0.5 : 1,
              letterSpacing: "0.02em", transition: "background 0.2s",
            }}
          >
            {status === "sending" ? "Sending…" : "Reserve My Float"}
          </button>

          <p style={{ color: C.faint, fontSize: "0.78rem", textAlign: "center", marginTop: "0.75rem" }}>
            Your spot will be confirmed by email before the event. Arrive 10 minutes early.
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

const sectionHead: React.CSSProperties = {
  fontFamily: "var(--font-display)",
  fontSize: "1.1rem",
  color: "#333533",
  marginBottom: "1rem",
};

const inputStyle: React.CSSProperties = {
  width: "100%", padding: "0.875rem 1rem", background: "#fff",
  border: "1.5px solid rgba(51,53,51,0.15)", borderRadius: 10,
  fontSize: "0.95rem", color: "#333533", outline: "none", boxSizing: "border-box",
};
