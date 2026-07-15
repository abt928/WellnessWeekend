"use client";
import { useState, useEffect } from "react";
import BookingModal from "@/components/BookingModal";

type ClassType = "sauna" | "aerial" | "paddle";

type SlotAvailability = {
  booked: number;
  capacity: number;
  full: boolean;
  hidden?: boolean;
};

// Confirmed static capacities (owner decision B holds sauna/Contrast until its true
// capacity is resolved, so it deliberately gets no hint). These are non-scarcity facts:
// safe to show as the default when live counts don't justify a scarcity label.
const FIXED_CAP: Partial<Record<ClassType, string>> = {
  aerial: "Small groups of 6",
  paddle: "7 per session",
};

// Derive an availability hint for a card type from DB-backed booking counts.
// Never returns a scarcity label ("Waitlist" / "Filling up") unless the counts justify it.
function hintFor(
  type: ClassType | null,
  avail: Record<string, SlotAvailability> | null,
): string | null {
  if (!type || !(type in FIXED_CAP)) return null; // sauna + non-bookable: no hint
  const fixed = FIXED_CAP[type]!;
  if (!avail) return fixed;
  const visible = Object.entries(avail).filter(
    ([key, slot]) => key.startsWith(`${type}-`) && !slot.hidden,
  );
  if (visible.length === 0) return fixed;
  const allFull = visible.every(([, slot]) => slot.full || slot.booked >= slot.capacity);
  if (allFull) return "Waitlist";
  const anyLow = visible.some(([, slot]) => slot.capacity - slot.booked <= 2);
  if (anyLow) return "Filling up";
  return fixed;
}

const ADDONS: { type: ClassType | null; icon: string; title: string; subtitle: string; desc: string; cta: string; fee?: boolean }[] = [
  {
    type: "sauna" as ClassType,
    icon: "🔥",
    title: "Contrast Therapy",
    subtitle: "Hot · Cold · Reset",
    desc: "Alternating sauna heat and cold plunge to activate circulation, reduce inflammation, and ground your nervous system. 30-minute facilitated sessions at Lakeside.",
    cta: "Reserve a Session",
  },
  {
    type: "aerial" as ClassType,
    icon: "🎋",
    title: "Aerial Silk",
    subtitle: "Fly · Float · Flow",
    desc: "Beginner silks flow with instructor Beth, no experience needed. Small groups of 6 create an intimate, supportive environment to discover the freedom of movement in the air.",
    cta: "Reserve a Spot",
  },
  {
    type: "paddle" as ClassType,
    icon: "🏄",
    title: "Paddleboard Yoga",
    subtitle: "Water · Balance · Breath",
    desc: "All-levels flow on the lake under the Alaskan sun. You might get wet. That's part of the magic. Limited to 7 per session.",
    cta: "Reserve a Spot",
  },
  {
    type: null,
    icon: "🌿",
    title: "Ayni Despacho",
    subtitle: "Ceremony · Offering · Reciprocity",
    desc: "An Andean ceremony of sacred reciprocity: a bundle of seeds, flowers, and offerings built together and given back to the mountain spirits. Saturday 11 AM in the Lodge.",
    cta: "Workshop materials fee · $75",
    fee: true,
  },
];

export default function BuildYourWeekend() {
  const [booking, setBooking] = useState<ClassType | null>(null);
  const [avail, setAvail] = useState<Record<string, SlotAvailability> | null>(null);

  // Fetch live booking availability once on mount. If it fails (no DB locally),
  // hints fall back to the fixed-capacity fact, never an unfounded scarcity claim.
  useEffect(() => {
    let cancelled = false;
    fetch("/api/bookings")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (!cancelled && d?.availability) setAvail(d.availability);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <>
      <section id="build" className="section build-weekend">
        <p className="section-label">Deepen Your Experience</p>
        <h2 className="section-title">Build Your Weekend.</h2>
        <p className="section-desc">
          Layer in what calls to you: each add-on session is bookable ahead of time so you arrive ready.
        </p>
        <div className="build-grid">
          {ADDONS.map((a) => {
            const hint = hintFor(a.type, avail);
            const scarce = hint === "Waitlist" || hint === "Filling up";
            return (
            <div key={a.title} className="build-card">
              <div className="build-card-icon">{a.icon}</div>
              <div className="build-card-body">
                <h3 className="build-card-title">{a.title}</h3>
                <p className="build-card-sub">{a.subtitle}</p>
                <p className="build-card-desc">{a.desc}</p>
                {hint && (
                  <span className={`build-card-hint${scarce ? " scarce" : ""}`}>
                    {hint}
                  </span>
                )}
              </div>
              {a.fee ? (
                <span className="build-card-fee">{a.cta}</span>
              ) : (
                <button
                  className={`build-card-cta${a.type ? "" : " no-book"}`}
                  onClick={() => a.type && setBooking(a.type)}
                  disabled={!a.type}
                >
                  {a.cta}
                </button>
              )}
            </div>
            );
          })}
        </div>
      </section>

      {booking && (
        <BookingModal classType={booking} onClose={() => setBooking(null)} />
      )}
    </>
  );
}
