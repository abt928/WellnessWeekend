"use client";
import { useState } from "react";
import BookingModal from "@/components/BookingModal";

type ClassType = "sauna" | "aerial" | "paddle";

const ADDONS = [
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
  {
    type: null,
    icon: "🙌",
    title: "Massage",
    subtitle: "Restore · Release · Renew",
    desc: "Multiple licensed massage therapists on-site all weekend — Flow Massage, Starfish Wellness & Massage, Tundra Wellness, and Alaska Fly Dog. Book directly at their vendor booth.",
    cta: "Available On-Site",
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
              <button
                className={`build-card-cta${a.type ? "" : " no-book"}`}
                onClick={() => a.type && setBooking(a.type)}
                disabled={!a.type}
              >
                {a.cta}
              </button>
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
