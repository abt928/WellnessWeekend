"use client";

import { useState } from "react";
import Link from "next/link";

const C = {
  bg: "#F7F3EC",
  card: "#FBF9F4",
  charcoal: "#333533",
  muted: "rgba(51,53,51,0.6)",
  faint: "rgba(51,53,51,0.38)",
  gold: "#C9983F",
  goldLight: "rgba(201,152,63,0.12)",
  goldBorder: "rgba(201,152,63,0.35)",
  border: "rgba(51,53,51,0.12)",
  error: "#B84A2B",
  errorBg: "rgba(184,74,43,0.07)",
};

const PRACTITIONERS = [
  {
    key: "flow-massage",
    name: "Flow Massage",
    role: "Licensed Massage Therapy · Chair Sessions",
    desc: "Flow Massage offers 20-minute chair massage sessions throughout the weekend — perfect for tension release, nervous system support, and a quick reset between sessions.",
  },
  {
    key: "alaska-massage-band",
    name: "Alaska Massage Band",
    role: "Therapeutic Bodywork · Alice Sullivan & Nalani",
    desc: "Alice Sullivan and Nalani offer deep therapeutic bodywork in 30, 60, or 90-minute sessions. Choose 2 Hands (one therapist) or 4 Hands — Alice and Nalani working in sync on one body. Price doubles for the 4-hands experience.",
  },
  {
    key: "no-preference",
    name: "No Preference",
    role: "First available",
    desc: "We'll match you with the next available therapist.",
  },
];

// Slots when Alice is teaching paddleboard yoga — unavailable for 4 Hands
const ALICE_BUSY_SLOTS = new Set(["fri-2pm", "sat-1pm", "sun-1pm", "sun-3pm"]);

const AMB_DURATIONS = ["30 minutes", "60 minutes", "90 minutes", "No preference"];
const HANDS_OPTIONS = [
  { key: "2-hands", label: "2 Hands", sub: "1 therapist" },
  { key: "4-hands", label: "4 Hands", sub: "Alice + Nalani · price doubles" },
];

type DaySlot = {
  key: string;
  time: string;
  booked?: boolean;
  bookedNote?: string;
};

const DAYS: { label: string; date: string; slots: DaySlot[] }[] = [
  {
    label: "Friday",
    date: "Aug 7",
    slots: [
      { key: "fri-2pm",  time: "2:00 PM" },
      { key: "fri-3pm",  time: "3:00 PM" },
      { key: "fri-4pm",  time: "4:00 PM" },
      { key: "fri-5pm",  time: "5:00 PM" },
      { key: "fri-6pm",  time: "6:00 PM" },
      { key: "fri-7pm",  time: "7:00 PM" },
    ],
  },
  {
    label: "Saturday",
    date: "Aug 8",
    slots: [
      { key: "sat-9am",   time: "9:00 AM" },
      { key: "sat-10am",  time: "10:00 AM" },
      { key: "sat-11am",  time: "11:00 AM", booked: true, bookedNote: "Nalani — private session" },
      { key: "sat-12pm",  time: "12:00 PM" },
      { key: "sat-1pm",   time: "1:00 PM" },
      { key: "sat-2pm",   time: "2:00 PM" },
      { key: "sat-3pm",   time: "3:00 PM" },
      { key: "sat-4pm",   time: "4:00 PM" },
      { key: "sat-5pm",   time: "5:00 PM" },
      { key: "sat-6pm",   time: "6:00 PM" },
      { key: "sat-7pm",   time: "7:00 PM" },
    ],
  },
  {
    label: "Sunday",
    date: "Aug 9",
    slots: [
      { key: "sun-10am",  time: "10:00 AM" },
      { key: "sun-11am",  time: "11:00 AM", booked: true, bookedNote: "Nalani — private session" },
      { key: "sun-12pm",  time: "12:00 PM" },
      { key: "sun-1pm",   time: "1:00 PM" },
      { key: "sun-2pm",   time: "2:00 PM" },
      { key: "sun-3pm",   time: "3:00 PM" },
      { key: "sun-4pm",   time: "4:00 PM" },
    ],
  },
];

const SESSION_TYPES = ["30 minutes", "60 minutes", "No preference"];

export default function MassagePage() {
  const [practitioner, setPractitioner] = useState("");
  const [slot, setSlot] = useState("");
  const [sessionType, setSessionType] = useState("");
  const [hands, setHands] = useState("");
  const [name, setName] = useState("");

  function selectPractitioner(key: string) {
    setPractitioner(key);
    setSessionType(key === "flow-massage" ? "20 minutes (Chair)" : "");
    setHands("");
    setSlot("");
  }

  function selectHands(key: string) {
    setHands(key);
    // Clear slot if it's blocked for 4 Hands (Alice teaching)
    if (key === "4-hands" && ALICE_BUSY_SLOTS.has(slot)) setSlot("");
  }
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!practitioner) { setErrorMsg("Please choose a practitioner."); return; }
    if (!slot) { setErrorMsg("Please select a session time."); return; }
    setStatus("sending");
    setErrorMsg("");

    try {
      const res = await fetch("/api/massage-booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), email: email.trim(), phone: phone.trim(), practitioner, slot, sessionType, hands, notes: notes.trim() }),
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
          <div style={{ fontSize: 48, marginBottom: "1rem" }}>🌿</div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.6rem,4vw,2.2rem)", color: C.charcoal, marginBottom: "0.75rem" }}>
            You&apos;re on the books.
          </h1>
          <p style={{ color: C.muted, lineHeight: 1.6, marginBottom: "2rem" }}>
            Your practitioner will confirm your session by email before the event.
            Arrive 5 minutes early and stay hydrated.
          </p>
          <Link href="/" style={{ color: C.gold, fontWeight: 600, textDecoration: "none" }}>
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
          Add-On Experience · Therapeutic Massage
        </p>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2rem,5vw,3rem)", fontWeight: 600, marginBottom: "0.5rem" }}>
          Massage Booking
        </h1>
        <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "1rem", maxWidth: 520, margin: "0 auto" }}>
          Flow Massage · Alaska Massage Band · All weekend at Warrior Lodge
        </p>
      </div>

      <div style={{ maxWidth: 660, margin: "0 auto", padding: "2.5rem 1.25rem 0" }}>

        <form onSubmit={handleSubmit}>

          {/* Step 1 — Practitioner */}
          <h2 style={sectionHead}>1. Choose your practitioner</h2>
          <div style={{ display: "grid", gap: "0.6rem", marginBottom: "2rem" }}>
            {PRACTITIONERS.map(p => {
              const active = practitioner === p.key;
              return (
                <button
                  key={p.key}
                  type="button"
                  onClick={() => selectPractitioner(p.key)}
                  style={{
                    display: "flex", alignItems: "flex-start", gap: "1rem",
                    padding: "1rem 1.25rem",
                    background: active ? C.goldLight : C.card,
                    border: `2px solid ${active ? C.gold : C.border}`,
                    borderRadius: 12, cursor: "pointer", textAlign: "left",
                    transition: "all 0.15s ease",
                  }}
                >
                  <span style={{
                    width: 22, height: 22, borderRadius: "50%", flexShrink: 0, marginTop: 2,
                    border: `2px solid ${active ? C.gold : C.faint}`,
                    background: active ? C.gold : "transparent",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    transition: "all 0.15s ease",
                  }}>
                    {active && <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#fff", display: "block" }} />}
                  </span>
                  <span>
                    <span style={{ display: "block", fontWeight: 700, color: C.charcoal, fontSize: "0.95rem" }}>{p.name}</span>
                    <span style={{ display: "block", color: C.gold, fontSize: "0.78rem", fontWeight: 600, letterSpacing: "0.05em", marginTop: 2 }}>{p.role}</span>
                    <span style={{ display: "block", color: C.muted, fontSize: "0.83rem", marginTop: 4, lineHeight: 1.5 }}>{p.desc}</span>
                  </span>
                </button>
              );
            })}
          </div>

          {/* Step 2 — Session length (conditional by practitioner) */}
          <h2 style={sectionHead}>2. Session type</h2>

          {/* Flow Massage — fixed 20-min chair, just show a confirmation badge */}
          {practitioner === "flow-massage" && (
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "2rem", padding: "0.9rem 1.1rem", background: C.goldLight, border: `2px solid ${C.gold}`, borderRadius: 12 }}>
              <span style={{ fontSize: "1.25rem" }}>💺</span>
              <span>
                <span style={{ display: "block", fontWeight: 700, color: C.charcoal, fontSize: "0.95rem" }}>20-Minute Chair Massage</span>
                <span style={{ display: "block", color: C.muted, fontSize: "0.82rem", marginTop: 2 }}>Flow Massage offers chair sessions only — 20 minutes each.</span>
              </span>
            </div>
          )}

          {/* Alaska Massage Band — duration + hands */}
          {practitioner === "alaska-massage-band" && (
            <div style={{ marginBottom: "2rem" }}>
              <p style={{ color: C.muted, fontSize: "0.83rem", marginBottom: "0.75rem" }}>Session length</p>
              <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap", marginBottom: "1.25rem" }}>
                {AMB_DURATIONS.map(s => {
                  const active = sessionType === s;
                  return (
                    <button key={s} type="button" onClick={() => setSessionType(s)} style={{
                      padding: "0.6rem 1.2rem",
                      background: active ? C.goldLight : C.card,
                      border: `2px solid ${active ? C.gold : C.border}`,
                      borderRadius: 30, cursor: "pointer", fontSize: "0.9rem",
                      color: active ? C.charcoal : C.muted, fontWeight: active ? 700 : 400,
                      transition: "all 0.15s ease",
                    }}>{s}</button>
                  );
                })}
              </div>
              <p style={{ color: C.muted, fontSize: "0.83rem", marginBottom: "0.75rem" }}>Hands</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.6rem" }}>
                {HANDS_OPTIONS.map(h => {
                  const active = hands === h.key;
                  return (
                    <button key={h.key} type="button" onClick={() => selectHands(h.key)} style={{
                      padding: "0.75rem 1rem", textAlign: "left",
                      background: active ? C.goldLight : C.card,
                      border: `2px solid ${active ? C.gold : C.border}`,
                      borderRadius: 12, cursor: "pointer",
                      transition: "all 0.15s ease",
                    }}>
                      <span style={{ display: "block", fontWeight: 700, color: C.charcoal, fontSize: "0.95rem" }}>{h.label}</span>
                      <span style={{ display: "block", color: C.muted, fontSize: "0.78rem", marginTop: 2 }}>{h.sub}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* No preference — general options */}
          {(practitioner === "no-preference" || practitioner === "") && (
            <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap", marginBottom: "2rem" }}>
              {["30 minutes", "60 minutes", "90 minutes", "No preference"].map(s => {
                const active = sessionType === s;
                return (
                  <button key={s} type="button" onClick={() => setSessionType(s)} style={{
                    padding: "0.6rem 1.2rem",
                    background: active ? C.goldLight : C.card,
                    border: `2px solid ${active ? C.gold : C.border}`,
                    borderRadius: 30, cursor: "pointer", fontSize: "0.9rem",
                    color: active ? C.charcoal : C.muted, fontWeight: active ? 700 : 400,
                    transition: "all 0.15s ease",
                  }}>{s}</button>
                );
              })}
            </div>
          )}

          {/* Step 3 — Time slot */}
          <h2 style={sectionHead}>3. Choose a time</h2>
          <p style={{ color: C.muted, fontSize: "0.83rem", marginBottom: "1.25rem" }}>
            Sessions are approximately the length you selected above. Your practitioner will confirm the exact time.
          </p>
          <div style={{ display: "grid", gap: "1.5rem", marginBottom: "2rem" }}>
            {DAYS.map(day => (
              <div key={day.label}>
                <p style={{ fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: C.gold, marginBottom: "0.6rem" }}>
                  {day.label} · {day.date}
                </p>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))", gap: "0.5rem" }}>
                  {day.slots.map(s => {
                    const active = slot === s.key;
                    const aliceBusy = practitioner === "alaska-massage-band" && hands === "4-hands" && ALICE_BUSY_SLOTS.has(s.key);
                    if (s.booked || aliceBusy) {
                      return (
                        <div
                          key={s.key}
                          title={aliceBusy ? "Alice is teaching paddleboard yoga at this time" : s.bookedNote}
                          style={{
                            padding: "0.7rem 0.75rem", borderRadius: 10, textAlign: "center",
                            background: "rgba(51,53,51,0.04)", border: `1.5px solid ${C.border}`,
                            opacity: 0.45,
                          }}
                        >
                          <span style={{ display: "block", fontWeight: 600, color: C.charcoal, fontSize: "0.88rem" }}>{s.time}</span>
                          <span style={{ display: "block", fontSize: "0.68rem", color: C.faint, marginTop: 2 }}>
                            {aliceBusy ? "Alice teaching" : "Booked"}
                          </span>
                        </div>
                      );
                    }
                    return (
                      <button
                        key={s.key}
                        type="button"
                        onClick={() => setSlot(s.key)}
                        style={{
                          padding: "0.7rem 0.75rem", borderRadius: 10, cursor: "pointer", textAlign: "center",
                          background: active ? C.goldLight : C.card,
                          border: `2px solid ${active ? C.gold : C.border}`,
                          transition: "all 0.15s ease",
                        }}
                      >
                        <span style={{ display: "block", fontWeight: 600, color: C.charcoal, fontSize: "0.88rem" }}>{s.time}</span>
                        {active && <span style={{ display: "block", fontSize: "0.68rem", color: C.gold, marginTop: 2, fontWeight: 700 }}>Selected ✓</span>}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Step 4 — Contact info */}
          <h2 style={sectionHead}>4. Your details</h2>
          <div style={{ display: "grid", gap: "0.85rem", marginBottom: "2rem" }}>
            <input required type="text" placeholder="Full name *" value={name} onChange={e => setName(e.target.value)} style={inputStyle} />
            <input required type="email" placeholder="Email address *" value={email} onChange={e => setEmail(e.target.value)} style={inputStyle} />
            <input type="tel" placeholder="Phone (optional)" value={phone} onChange={e => setPhone(e.target.value)} style={inputStyle} />
            <textarea
              placeholder="Anything your therapist should know? (injuries, focus areas, pressure preferences…)"
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
              width: "100%", padding: "1rem", background: C.charcoal, color: "#fff",
              border: "none", borderRadius: 12, fontSize: "1rem", fontWeight: 700,
              cursor: status === "sending" ? "not-allowed" : "pointer",
              opacity: status === "sending" ? 0.7 : 1, letterSpacing: "0.02em",
            }}
          >
            {status === "sending" ? "Sending…" : "Request Booking"}
          </button>

          <p style={{ color: C.faint, fontSize: "0.78rem", textAlign: "center", marginTop: "0.75rem" }}>
            Your practitioner will confirm your spot by email before the event.
          </p>
        </form>

        <div style={{ textAlign: "center", marginTop: "2.5rem" }}>
          <Link href="/" style={{ color: C.gold, fontSize: "0.875rem", textDecoration: "none" }}>
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
