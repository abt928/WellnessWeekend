"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

type ClassType = "aerial" | "paddle";

interface Slot {
  key: string;
  label: string;
  day: string;
  time: string;
  booked: number;
  capacity: number;
  full: boolean;
  overflow?: string;
  hidden?: boolean;
}

const TYPE_INFO: Record<ClassType, { title: string; icon: string; desc: string; color: string }> = {
  aerial: {
    title: "Aerial Silk",
    icon: "🎋",
    desc: "Beginner silks flow with instructor Beth — no experience needed. Groups of 6 for hands-on attention.",
    color: "#9B7FD4",
  },
  paddle: {
    title: "Paddleboard Yoga",
    icon: "🏄",
    desc: "All-levels flow on the lake under the Alaskan sun. You might get wet — that's part of the magic. 7 per session.",
    color: "#3DB8AF",
  },
};

const PREFIX: Record<ClassType, string> = { aerial: "aerial-", paddle: "paddle-" };

export default function BookingPageClient({ type, confirmed }: { type: ClassType; confirmed?: boolean }) {
  const info = TYPE_INFO[type];
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(null);

  async function loadSlots() {
    setLoading(true);
    const { availability } = await fetch("/api/bookings").then((r) => r.json());
    const prefix = PREFIX[type];
    const list: Slot[] = [];
    for (const [key, slot] of Object.entries(availability as Record<string, Slot>)) {
      if (!key.startsWith(prefix)) continue;
      if ((slot as any).hidden) {
        const primaryKey = Object.keys(availability).find(
          (k) => k.startsWith(prefix) && !(availability as any)[k].hidden && (availability as any)[k].overflow === key
        );
        if (!primaryKey || !(availability as any)[primaryKey].full) continue;
      }
      list.push({ key, ...(slot as Slot) });
    }
    list.sort((a, b) => (a.day + a.time).localeCompare(b.day + b.time));
    setSlots(list);
    setLoading(false);
  }

  useEffect(() => { loadSlots(); }, [type]);

  async function submit() {
    if (!selected || !name.trim() || !email.trim()) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ classKey: selected, name: name.trim(), email: email.trim() }),
      });
      const data = await res.json();
      if (res.ok) {
        setResult({ ok: true, message: `You're reserved for ${data.label}! Check your email for a confirmation.` });
      } else if (res.status === 409 && data.overflow) {
        setResult({ ok: false, message: "That slot just filled — the next available time is selected below." });
        await loadSlots();
        setSelected(data.overflow);
      } else {
        setResult({ ok: false, message: data.error || "Something went wrong. Please try again." });
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main style={{ background: "#0a0a14", color: "#fff", minHeight: "100vh" }}>
      <div style={{ maxWidth: 560, margin: "0 auto", padding: "4rem 1.5rem 6rem" }}>

        {/* Back */}
        <Link href="/" style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.78rem", letterSpacing: "0.1em", textTransform: "uppercase", textDecoration: "none", display: "block", marginBottom: "2.5rem" }}>
          ← Back to Home
        </Link>

        {/* Ticket confirmed banner */}
        {confirmed && (
          <div style={{
            background: "rgba(61,184,175,0.12)",
            border: "1px solid rgba(61,184,175,0.3)",
            borderRadius: 12,
            padding: "1rem 1.25rem",
            marginBottom: "2rem",
            display: "flex",
            gap: "0.75rem",
            alignItems: "flex-start",
          }}>
            <span style={{ fontSize: "1.3rem" }}>✓</span>
            <div>
              <strong style={{ display: "block", fontSize: "0.9rem", marginBottom: "0.2rem" }}>Ticket confirmed!</strong>
              <span style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.6)" }}>Your purchase is complete. Now pick your time slot below to lock in your spot.</span>
            </div>
          </div>
        )}

        {/* Header */}
        <div style={{ marginBottom: "2.5rem" }}>
          <div style={{ fontSize: "2.5rem", marginBottom: "0.75rem" }}>{info.icon}</div>
          <h1 style={{ fontFamily: "var(--font-display, serif)", fontSize: "clamp(2rem, 6vw, 3rem)", marginBottom: "0.5rem" }}>
            {info.title}
          </h1>
          <p style={{ color: "rgba(255,255,255,0.6)", lineHeight: 1.7, fontSize: "0.95rem" }}>{info.desc}</p>
        </div>

        {result?.ok ? (
          <div style={{ background: "rgba(61,184,175,0.1)", border: "1px solid rgba(61,184,175,0.3)", borderRadius: 14, padding: "2rem", textAlign: "center" }}>
            <div style={{ fontSize: "2rem", marginBottom: "0.75rem" }}>✦</div>
            <p style={{ fontSize: "1rem", lineHeight: 1.7, marginBottom: "1.5rem" }}>{result.message}</p>
            <Link href="/" style={{
              display: "inline-block", background: info.color, color: "#fff",
              fontWeight: 700, padding: "0.7rem 1.75rem", borderRadius: 30, textDecoration: "none", fontSize: "0.9rem",
            }}>
              Back to Home
            </Link>
          </div>
        ) : (
          <>
            {/* Slot picker */}
            <div style={{ marginBottom: "1.5rem" }}>
              <p style={{ fontSize: "0.72rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.45)", marginBottom: "0.75rem" }}>
                Choose your session
              </p>
              {loading && (
                <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.9rem" }}>Checking availability…</p>
              )}
              {!loading && slots.length === 0 && (
                <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.9rem" }}>No sessions available at this time — check back soon.</p>
              )}
              <div style={{ display: "grid", gap: "0.6rem" }}>
                {slots.map((slot) => (
                  <button
                    key={slot.key}
                    onClick={() => !slot.full && setSelected(slot.key)}
                    disabled={slot.full}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "0.9rem 1.1rem",
                      borderRadius: 10,
                      border: selected === slot.key ? `1.5px solid ${info.color}` : "1.5px solid rgba(255,255,255,0.1)",
                      background: selected === slot.key ? `${info.color}18` : "rgba(255,255,255,0.04)",
                      color: slot.full ? "rgba(255,255,255,0.3)" : "#fff",
                      cursor: slot.full ? "not-allowed" : "pointer",
                      fontSize: "0.9rem",
                      textAlign: "left",
                      transition: "border-color 0.15s, background 0.15s",
                    }}
                  >
                    <span>{slot.day} · {slot.time}</span>
                    <span style={{ fontSize: "0.78rem", color: slot.full ? "rgba(255,255,255,0.25)" : info.color, fontWeight: 600 }}>
                      {slot.full ? "Full" : `${slot.capacity - slot.booked} open`}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {result && !result.ok && (
              <p style={{ color: "#f08080", fontSize: "0.85rem", marginBottom: "1rem" }}>{result.message}</p>
            )}

            {/* Form */}
            {selected && (
              <div style={{ display: "grid", gap: "0.75rem" }}>
                <p style={{ fontSize: "0.72rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.45)", marginBottom: "0" }}>
                  Your details
                </p>
                <input
                  type="text"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{
                    background: "rgba(255,255,255,0.07)", border: "1.5px solid rgba(255,255,255,0.12)",
                    borderRadius: 10, padding: "0.85rem 1rem", color: "#fff", fontSize: "0.95rem", width: "100%",
                  }}
                />
                <input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    background: "rgba(255,255,255,0.07)", border: "1.5px solid rgba(255,255,255,0.12)",
                    borderRadius: 10, padding: "0.85rem 1rem", color: "#fff", fontSize: "0.95rem", width: "100%",
                  }}
                />
                <button
                  onClick={submit}
                  disabled={submitting || !name.trim() || !email.trim()}
                  style={{
                    background: info.color, color: "#fff", border: "none",
                    borderRadius: 30, padding: "0.9rem", fontSize: "0.95rem", fontWeight: 700,
                    cursor: submitting || !name.trim() || !email.trim() ? "not-allowed" : "pointer",
                    opacity: submitting || !name.trim() || !email.trim() ? 0.6 : 1,
                    transition: "opacity 0.15s",
                  }}
                >
                  {submitting ? "Reserving…" : "Reserve My Spot"}
                </button>
                <p style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.35)", textAlign: "center", lineHeight: 1.6 }}>
                  Reservations are free — your ticket purchase is separate.
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
