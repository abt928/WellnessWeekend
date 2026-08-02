"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const C = {
  bg: "#F7F3EC",
  card: "#FBF9F4",
  charcoal: "#333533",
  muted: "rgba(51,53,51,0.6)",
  faint: "rgba(51,53,51,0.38)",
  violet: "#8B5FBF",
  violetLight: "rgba(139,95,191,0.1)",
  violetBorder: "rgba(139,95,191,0.35)",
  gold: "#C9983F",
  border: "rgba(51,53,51,0.12)",
  error: "#B84A2B",
  errorBg: "rgba(184,74,43,0.07)",
};

const MODES = [
  {
    key: "class",
    title: "Join a Class",
    sub: "Guided · Small group · 6 max",
    desc: "Instructor Beth guides you through a beginner-friendly aerial silk flow — floating, stretching, and moving in three dimensions. No experience needed. At least two sessions run every day of the weekend.",
  },
  {
    key: "solo",
    title: "Go Solo",
    sub: "Unguided · Rent a hammock · 7 available",
    desc: "Rent a silk hammock during any Sound offering, Ecstatic Dance, or live music set — settle in, and let the frequency hold you. No instruction, no choreography — just you, suspended, motionless in sound while the room moves around you.",
  },
];

const CLASS_SLOTS = [
  { key: "fri-3pm",     day: "Friday · Aug 7",   time: "3:00 PM",  note: "Intro Aerial" },
  { key: "fri-7pm",     day: "Friday · Aug 7",   time: "7:00 PM",  note: "Intro Aerial · Sunset Session" },
  { key: "sat-10am",    day: "Saturday · Aug 8", time: "10:00 AM", note: "Intro Aerial" },
  { key: "sat-2pm",     day: "Saturday · Aug 8", time: "2:00 PM",  note: "Intro Aerial" },
  { key: "sun-1030am",  day: "Sunday · Aug 9",   time: "10:30 AM", note: "Intro Aerial" },
  { key: "sun-2pm-kids", day: "Sunday · Aug 9",  time: "2:00 PM",  note: "Intro Aerial for Kids" },
];

const SOLO_SLOTS = [
  // Sound offerings
  { key: "fri-4pm",    day: "Friday · Aug 7",   time: "4:00 PM",  note: "During Yin Yoga & Sound Savasana" },
  { key: "sat-7am",    day: "Saturday · Aug 8", time: "7:00 AM",  note: "During Floating Sound Bath" },
  { key: "sat-8am",    day: "Saturday · Aug 8", time: "8:00 AM",  note: "During Lionsgate Activation + Floating Sound Bath" },
  { key: "sat-4pm",    day: "Saturday · Aug 8", time: "4:00 PM",  note: "During Roots for Recovery" },
  { key: "sat-5pm",    day: "Saturday · Aug 8", time: "5:00 PM",  note: "During Guzheng · Five Elements Sound Healing" },
  { key: "sun-8am",    day: "Sunday · Aug 9",   time: "8:00 AM",  note: "During Sound Journey" },
  { key: "sun-10am",   day: "Sunday · Aug 9",   time: "10:00 AM", note: "During Activate Your Light Floating Sound Bath" },
  // Ecstatic Dance
  { key: "fri-8pm",    day: "Friday · Aug 7",   time: "8:00 PM",  note: "During Ecstatic Dance · Opening Night" },
  { key: "sat-8pm",    day: "Saturday · Aug 8", time: "8:00 PM",  note: "During Ecstatic Dance · Lion's Gate Dance" },
  { key: "sat-10pm",   day: "Saturday · Aug 8", time: "10:00 PM", note: "During Ecstatic Dance · Late Night Journey" },
  { key: "sun-1111am", day: "Sunday · Aug 9",   time: "11:11 AM", note: "During Message from the Bees · Ecstatic Dance" },
  { key: "sun-7pm",    day: "Sunday · Aug 9",   time: "7:00 PM",  note: "During Ecstatic Dance · Closing Dance" },
  // Live Music
  { key: "sat-6pm",    day: "Saturday · Aug 8", time: "6:00 PM",  note: "During S7INGRAE & Brackish" },
  { key: "sun-12pm",   day: "Sunday · Aug 9",   time: "12:00 PM", note: "During Shawn Zuke" },
  { key: "sun-1pm",    day: "Sunday · Aug 9",   time: "1:00 PM",  note: "During Kuf Knotz + Christine Elise" },
  { key: "sun-315pm",  day: "Sunday · Aug 9",   time: "3:15 PM",  note: "During J Brave" },
  { key: "sun-4pm",    day: "Sunday · Aug 9",   time: "4:00 PM",  note: "During ÂKÅTÂLĖ" },
];

interface SlotAvailability { booked: number; capacity: number; full: boolean; }

export default function AerialPage() {
  const [mode, setMode] = useState<"" | "class" | "solo">("");
  const [slot, setSlot] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [availability, setAvailability] = useState<Record<string, Record<string, SlotAvailability>>>({});

  useEffect(() => {
    fetch("/api/aerial-booking")
      .then(r => r.json())
      .then(d => { if (d.availability) setAvailability(d.availability); })
      .catch(() => {});
  }, []);

  function chooseMode(key: "class" | "solo") {
    setMode(key);
    setSlot("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!mode) { setErrorMsg("Please choose Join a Class or Go Solo."); return; }
    if (!slot) { setErrorMsg("Please select a time."); return; }
    setStatus("sending");
    setErrorMsg("");

    try {
      const res = await fetch("/api/aerial-booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), email: email.trim(), phone: phone.trim(), mode, slot, notes: notes.trim() }),
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
          <div style={{ fontSize: 48, marginBottom: "1rem" }}>🕸️</div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.6rem,4vw,2.2rem)", color: C.charcoal, marginBottom: "0.75rem" }}>
            You&apos;re floating on the schedule.
          </h1>
          <p style={{ color: C.muted, lineHeight: 1.6, marginBottom: "2rem" }}>
            Beth will confirm your session by email before the event.
            Wear comfortable clothing that covers the backs of your knees.
          </p>
          <Link href="/" style={{ color: C.violet, fontWeight: 600, textDecoration: "none" }}>
            ← Back to the festival
          </Link>
        </div>
      </main>
    );
  }

  const slots = mode === "class" ? CLASS_SLOTS : mode === "solo" ? SOLO_SLOTS : [];
  const avail = mode ? availability[mode] : undefined;

  return (
    <main style={{ minHeight: "100vh", background: C.bg, padding: "0 0 5rem" }}>

      {/* Header */}
      <div style={{ background: C.charcoal, color: "#fff", padding: "3.5rem 1.5rem 3rem", textAlign: "center" }}>
        <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.8rem", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "0.75rem" }}>
          Add-On Experience · The Aerial Rig · Instructed by Beth
        </p>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2rem,5vw,3rem)", fontWeight: 600, marginBottom: "0.5rem" }}>
          Become Motionless in Sound
        </h1>
        <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "1rem", maxWidth: 560, margin: "0 auto" }}>
          The floating ecstatic dance experience — suspended in a silk hammock, held by sound instead of movement. Silks and paddleboards provided by Alaska Fly Dog.
        </p>
      </div>

      <div style={{ maxWidth: 700, margin: "0 auto", padding: "2.5rem 1.25rem 0" }}>

        {/* About */}
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: "2rem", marginBottom: "2rem" }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.25rem", color: C.charcoal, marginBottom: "0.75rem" }}>
            What is this?
          </h2>
          <div style={{ display: "grid", gap: "1rem", color: C.muted, lineHeight: 1.75 }}>
            <p style={{ margin: 0 }}>
              Ecstatic Dance asks the body to move freely. This is the opposite invitation: to go completely still. Wrapped in a silk aerial hammock — floating, weightless, cradled — you let the sound move through you instead of the other way around. It&apos;s the same surrender, the same ceremony, just held in stillness instead of motion.
            </p>
            <p style={{ margin: 0 }}>
              Every session is <strong style={{ color: C.charcoal }}>$20 for 30 minutes</strong> — whether you join a guided class or go solo. Classes run at least twice daily, beginner-friendly, six people max. Solo hammock rentals are available during any Sound offering, Ecstatic Dance, or live music set on the schedule, with seven hammocks to go around.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>

          {/* Step 1 — Experience */}
          <h2 style={sectionHead}>1. Choose your experience</h2>
          <div style={{ display: "grid", gap: "0.6rem", marginBottom: "2rem" }}>
            {MODES.map(m => {
              const active = mode === m.key;
              return (
                <button
                  key={m.key}
                  type="button"
                  onClick={() => chooseMode(m.key as "class" | "solo")}
                  style={{
                    display: "flex", alignItems: "flex-start", gap: "1rem",
                    padding: "1rem 1.25rem",
                    background: active ? C.violetLight : C.card,
                    border: `2px solid ${active ? C.violet : C.border}`,
                    borderRadius: 12, cursor: "pointer", textAlign: "left",
                    transition: "all 0.15s ease",
                  }}
                >
                  <span style={{
                    width: 22, height: 22, borderRadius: "50%", flexShrink: 0, marginTop: 2,
                    border: `2px solid ${active ? C.violet : C.faint}`,
                    background: active ? C.violet : "transparent",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    transition: "all 0.15s ease",
                  }}>
                    {active && <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#fff", display: "block" }} />}
                  </span>
                  <span>
                    <span style={{ display: "block", fontWeight: 700, color: C.charcoal, fontSize: "0.95rem" }}>{m.title}</span>
                    <span style={{ display: "block", color: C.violet, fontSize: "0.78rem", fontWeight: 600, letterSpacing: "0.05em", marginTop: 2 }}>{m.sub}</span>
                    <span style={{ display: "block", color: C.muted, fontSize: "0.83rem", marginTop: 4, lineHeight: 1.5 }}>{m.desc}</span>
                  </span>
                </button>
              );
            })}
          </div>

          {/* Step 2 — Time slot */}
          {mode && (
            <>
              <h2 style={sectionHead}>2. Choose a time</h2>
              <p style={{ color: C.muted, fontSize: "0.83rem", marginBottom: "1.25rem" }}>
                Each session is 30 minutes. {mode === "class" ? "Beth will confirm your class spot by email." : "Your hammock is reserved the moment you book."}
              </p>
              <div style={{ display: "grid", gap: "0.6rem", marginBottom: "2rem" }}>
                {slots.map(s => {
                  const active = slot === s.key;
                  const a = avail?.[s.key];
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
                        padding: "0.9rem 1.1rem",
                        background: isFull ? "rgba(51,53,51,0.04)" : active ? C.violetLight : C.card,
                        border: `2px solid ${isFull ? "rgba(51,53,51,0.1)" : active ? C.violet : C.border}`,
                        borderRadius: 12, cursor: isFull ? "not-allowed" : "pointer", textAlign: "left",
                        opacity: isFull ? 0.6 : 1, transition: "all 0.15s ease",
                      }}
                    >
                      <span style={{ flex: 1 }}>
                        <span style={{ display: "block", fontWeight: 600, color: isFull ? C.muted : C.charcoal, fontSize: "0.92rem" }}>
                          {s.day} · {s.time}
                        </span>
                        <span style={{ display: "block", color: C.muted, fontSize: "0.78rem", marginTop: 2 }}>{s.note}</span>
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
                        <span style={{ fontSize: "0.72rem", fontWeight: 700, color: C.violet, flexShrink: 0 }}>Selected ✓</span>
                      ) : null}
                    </button>
                  );
                })}
              </div>
            </>
          )}

          {/* Step 3 — Contact info */}
          {mode && slot && (
            <>
              <h2 style={sectionHead}>3. Your details</h2>
              <div style={{ display: "grid", gap: "0.85rem", marginBottom: "2rem" }}>
                <input required type="text" placeholder="Full name *" value={name} onChange={e => setName(e.target.value)} style={inputStyle} />
                <input required type="email" placeholder="Email address *" value={email} onChange={e => setEmail(e.target.value)} style={inputStyle} />
                <input type="tel" placeholder="Phone (optional)" value={phone} onChange={e => setPhone(e.target.value)} style={inputStyle} />
                <textarea
                  placeholder="Anything Beth should know? (optional)"
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
            disabled={status === "sending" || !mode || !slot}
            style={{
              width: "100%", padding: "1rem", background: C.violet, color: "#fff",
              border: "none", borderRadius: 12, fontSize: "1rem", fontWeight: 700,
              cursor: status === "sending" ? "not-allowed" : "pointer",
              opacity: status === "sending" || !mode || !slot ? 0.5 : 1, letterSpacing: "0.02em",
            }}
          >
            {status === "sending" ? "Sending…" : "Book · $20 / 30 min"}
          </button>

          <p style={{ color: C.faint, fontSize: "0.78rem", textAlign: "center", marginTop: "0.75rem" }}>
            Payment is collected on-site. Your spot is confirmed by email before the event.
          </p>
        </form>

        <div style={{ textAlign: "center", marginTop: "2.5rem", display: "flex", gap: "1.5rem", justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/ecstatic-dance" style={{ color: C.violet, fontSize: "0.875rem", textDecoration: "none" }}>
            What is Ecstatic Dance? →
          </Link>
          <Link href="/" style={{ color: C.muted, fontSize: "0.875rem", textDecoration: "none" }}>
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
