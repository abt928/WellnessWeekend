"use client";
import { useState } from "react";
import Link from "next/link";
import BookingModal from "@/components/BookingModal";

type ClassType = "aerial" | "paddle";

const ADDONS: { type: ClassType | null; href?: string; icon: string; title: string; subtitle: string; desc: string; cta: string; fee?: boolean }[] = [
  {
    type: null,
    href: "/massage",
    icon: "🌿",
    title: "Massage",
    subtitle: "Flow Massage · Alaska Massage Band",
    desc: "Book a therapeutic massage session with Flow Massage or Alaska Massage Band — available throughout the weekend. 30 or 60 minute sessions.",
    cta: "Book a Session",
  },
  {
    type: null,
    href: "/contrast-therapy",
    icon: "🔥",
    title: "Contrast Therapy",
    subtitle: "Hot · Cold · Reset",
    desc: "Alternating sauna heat and cold plunge to activate circulation, reduce inflammation, and ground your nervous system. 30-minute facilitated sessions at Lakeside.",
    cta: "View Sessions",
  },
  {
    type: "aerial" as ClassType,
    icon: "🎋",
    title: "Aerial Silk",
    subtitle: "Fly · Float · Flow",
    desc: "Beginner silks flow with instructor Beth — no experience needed. Small groups of 6 create an intimate, supportive environment to discover the freedom of movement in the air.",
    cta: "Reserve a Spot",
  },
  {
    type: "paddle" as ClassType,
    icon: "🏄",
    title: "Paddleboard Yoga",
    subtitle: "Water · Balance · Breath",
    desc: "All-levels flow on the lake under the Alaskan sun. You might get wet — that's part of the magic. Limited to 7 per session.",
    cta: "Reserve a Spot",
  },
];

export default function BuildYourWeekend() {
  const [booking, setBooking] = useState<ClassType | null>(null);

  return (
    <>
      <section id="build" className="section build-weekend">
        <p className="section-label">Deepen Your Experience</p>
        <h2 className="section-title">Build Your Weekend.</h2>
        <p className="section-desc">
          Layer in what calls to you — each add-on session is bookable ahead of time so you arrive ready.
        </p>
        <div className="build-grid">
          {ADDONS.map((a) => (
            <div key={a.title} className="build-card">
              <div className="build-card-icon">{a.icon}</div>
              <div className="build-card-body">
                <h3 className="build-card-title">{a.title}</h3>
                <p className="build-card-sub">{a.subtitle}</p>
                <p className="build-card-desc">{a.desc}</p>
              </div>
              {a.fee ? (
                <span className="build-card-fee">{a.cta}</span>
              ) : a.href ? (
                <Link href={a.href} className="build-card-cta">
                  {a.cta}
                </Link>
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
          ))}
        </div>
      </section>

      {booking && (
        <BookingModal classType={booking} onClose={() => setBooking(null)} />
      )}
    </>
  );
}
