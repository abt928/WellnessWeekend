"use client";
import { useState, useEffect, useRef } from "react";
import { useFocusTrap } from "@/lib/useFocusTrap";

type ClassType = "sauna" | "aerial" | "paddle";

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

const TYPE_INFO: Record<ClassType, { title: string; icon: string; desc: string }> = {
  sauna:  { title: "Contrast Therapy / Sauna",  icon: "🔥", desc: "Cold plunge + heat cycling · 30 min facilitated sessions at Lakeside" },
  aerial: { title: "Aerial Silk",               icon: "🎋", desc: "Beginner silks flow with Beth · 6 people max per session" },
  paddle: { title: "Paddleboard Yoga",           icon: "🏄", desc: "All levels welcome on the lake · you might get wet!" },
};

const PREFIX: Record<ClassType, string> = { sauna: "sauna-", aerial: "aerial-", paddle: "paddle-" };

export default function BookingModal({ classType, onClose }: { classType: ClassType; onClose: () => void }) {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const info = TYPE_INFO[classType];

  // Trap focus, autofocus, restore focus, and lock body scroll while open
  useFocusTrap(true, modalRef);

  useEffect(() => {
    fetch("/api/bookings")
      .then((r) => r.json())
      .then(({ availability }) => {
        const prefix = PREFIX[classType];
        const list: Slot[] = [];
        const av = availability as Record<string, Slot & { overflow?: string; hidden?: boolean }>;
        for (const [key, slot] of Object.entries(av)) {
          if (!key.startsWith(prefix)) continue;
          if (slot.hidden) {
            // Only show overflow slots if their primary slot is full
            const primaryKey = Object.keys(av).find(
              (k) => k.startsWith(prefix) && !av[k].hidden && av[k].overflow === key
            );
            if (!primaryKey || !av[primaryKey].full) continue;
          }
          list.push({ ...slot, key });
        }
        list.sort((a, b) => (a.day + a.time).localeCompare(b.day + b.time));
        setSlots(list);
      })
      .finally(() => setLoading(false));
  }, [classType]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

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
        setResult({ ok: false, message: `That slot is full. A new time has opened! Please select it above.` });
        // Refresh slots to show overflow
        setSlots((prev) => prev.map((s) => s.key === selected ? { ...s, full: true } : s));
        // Re-fetch to get overflow slot
        fetch("/api/bookings").then(r => r.json()).then(({ availability }) => {
          const prefix = PREFIX[classType];
          const list: Slot[] = [];
          const av = availability as Record<string, Slot & { overflow?: string; hidden?: boolean }>;
          for (const [key, slot] of Object.entries(av)) {
            if (!key.startsWith(prefix)) continue;
            if (slot.hidden) {
              const primaryKey = Object.keys(av).find(k => k.startsWith(prefix) && !av[k].hidden && av[k].overflow === key);
              if (!primaryKey || !av[primaryKey].full) continue;
            }
            list.push({ ...slot, key });
          }
          list.sort((a, b) => (a.day + a.time).localeCompare(b.day + b.time));
          setSlots(list);
        });
        setSelected(data.overflow);
      } else {
        setResult({ ok: false, message: data.error || "Something went wrong. Please try again." });
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div
      className="booking-overlay"
      ref={overlayRef}
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
      role="dialog"
      aria-modal="true"
      aria-label={`Reserve ${info.title}`}
    >
      <div className="booking-modal" ref={modalRef}>
        <button className="booking-close" onClick={onClose} aria-label="Close">✕</button>

        <div className="booking-header">
          <span className="booking-icon">{info.icon}</span>
          <h2 className="booking-title">{info.title}</h2>
          <p className="booking-desc">{info.desc}</p>
        </div>

        {result?.ok ? (
          <div className="booking-success">
            <span className="booking-success-icon">✦</span>
            <p>{result.message}</p>
            <button className="booking-btn" onClick={onClose}>Close</button>
          </div>
        ) : (
          <>
            <div className="booking-slots">
              {loading && <p className="booking-loading">Checking availability…</p>}
              {!loading && slots.length === 0 && (
                <p className="booking-loading">No sessions available at this time.</p>
              )}
              {slots.map((slot) => (
                <button
                  key={slot.key}
                  className={`booking-slot${selected === slot.key ? " selected" : ""}${slot.full ? " full" : ""}`}
                  onClick={() => !slot.full && setSelected(slot.key)}
                  disabled={slot.full}
                >
                  <span className="booking-slot-label">{slot.day} · {slot.time}</span>
                  <span className="booking-slot-avail">
                    {slot.full ? "Full" : `${slot.capacity - slot.booked} of ${slot.capacity} open`}
                  </span>
                </button>
              ))}
            </div>

            {result && !result.ok && (
              <p className="booking-error">{result.message}</p>
            )}

            {selected && (
              <div className="booking-form">
                <input
                  className="booking-input"
                  type="text"
                  placeholder="Your name"
                  aria-label="Your name"
                  autoComplete="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <input
                  className="booking-input"
                  type="email"
                  placeholder="Email address"
                  aria-label="Email address"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <button
                  className="booking-btn"
                  onClick={submit}
                  disabled={submitting || !name.trim() || !email.trim()}
                >
                  {submitting ? "Reserving…" : "Reserve My Spot"}
                </button>
                <p className="booking-note">Reservations are free to hold. Your ticket purchase is separate, in the <a href="#store" onClick={onClose}>store</a>.</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
