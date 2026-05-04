"use client";
import { useState, type ReactNode } from "react";
import { LeafIcon, FlameIcon, SoundWaveIcon, CommunityIcon, MoonIcon } from "@/components/Icons";
import EventGloss from "@/components/EventGloss";

type Track = "body" | "spirit" | "sound" | "community";

const LIONSGATE_GLOSS =
  "Lionsgate refers to the 8/8 alignment of Earth, the Sun, and the star Sirius. In some spiritual traditions it's held as an annual portal of heightened energy.";
const AYNI_GLOSS =
  "An Andean ceremony of reciprocity. A small bundle of seeds, flowers, and offerings is built and given back to the mountain spirits.";
const CE5_GLOSS =
  "CE5 (Close Encounter of the Fifth Kind): a consciousness-based contact protocol. Stargazing and intentioned meditation under the night sky.";
const KAI_CHI_DO_GLOSS =
  "A movement practice that combines qigong with dance, developed by Master Lotus Sky.";

const trackMeta: Record<Track, { icon: ReactNode; label: string; color: string }> = {
  body: { icon: <LeafIcon size={14} color="#7C9070" />, label: "Body", color: "#7C9070" },
  spirit: { icon: <MoonIcon size={14} color="#8B5FBF" />, label: "Spirit", color: "#8B5FBF" },
  sound: { icon: <SoundWaveIcon size={14} color="#4ecdc4" />, label: "Sound", color: "#4ecdc4" },
  community: { icon: <CommunityIcon size={14} color="#E8956A" />, label: "Community", color: "#E8956A" },
};

interface ScheduleEvent {
  time: string;
  event: string;
  detail?: string;
  track: Track;
  location?: string;
  gloss?: string;
}

interface ScheduleBlock {
  label: string;
  heading: ReactNode;
  theme: string;
  events: ScheduleEvent[];
}

const days: ScheduleBlock[] = [
  {
    label: "Friday · Aug 8",
    heading: <><MoonIcon size={20} color="var(--aurora-light)" /> Arrival + Grounding</>,
    theme: "Land, Arrival, Intention",
    events: [
      { time: "12:00 PM", event: "Gates Open", detail: "Welcome to the land. Check in, set up camp, settle in", track: "community" },
      { time: "3:00 PM", event: "Opening Ceremony & Land Acknowledgement", location: "Main Stage", track: "spirit" },
      { time: "4:00 PM", event: "Paddleboard Yoga", location: "Lake", track: "body" },
      { time: "4:00 PM", event: "Yin Yoga & Sound Savasana", detail: "with Mary", location: "Wellness Tent", track: "body" },
      { time: "5:00 PM", event: "Dance Alchemy", detail: "with Ashleigh", location: "Main Stage", track: "body" },
      { time: "5:00 PM", event: "The Silent Retreat Within", detail: "with Lynn", location: "Indoor Space", track: "spirit" },
      { time: "5:00 PM", event: "Myofascial Release Journey", detail: "with Jon", location: "Wellness Tent", track: "body" },
      { time: "7:00 PM", event: "Sunset Sound Healing at the Lake", location: "Main Stage / Lake", track: "sound" },
      { time: "8:30 PM", event: "Music Program Begins", location: "Main Stage", track: "sound" },
      { time: "10:00 PM", event: "CE5 Gathering: Beyond the Veil Pt. 1", detail: "Stargazing & contact meditation", location: "Stargazing Zone", track: "spirit", gloss: CE5_GLOSS },
    ],
  },
  {
    label: "Saturday · Aug 9",
    heading: <><FlameIcon size={20} color="var(--coral)" /> Activation + Transformation</>,
    theme: "Expansion, Ceremony, Expression",
    events: [
      { time: "8:00 AM", event: "Lionsgate Activation + Floating Sound Bath", location: "Lake / Aerial", track: "sound", gloss: LIONSGATE_GLOSS },
      { time: "9:00 AM", event: "Morning Yoga + Breathwork", location: "Main Stage", track: "body" },
      { time: "10:00 AM", event: "Workshop: Kai Chi Do", detail: "with Lotus", location: "Wellness Tent", track: "body", gloss: KAI_CHI_DO_GLOSS },
      { time: "11:00 AM", event: "AYNI Despacho Ceremony", location: "Main Stage", track: "spirit", gloss: AYNI_GLOSS },
      { time: "12:00 PM", event: "Integration + Marketplace", detail: "Vendor Village · Food + Tea Lounge · Community Connection", location: "Village", track: "community" },
      { time: "2:00 PM", event: "Paddleboard Yoga", location: "Lake", track: "body" },
      { time: "4:00 PM", event: "Tarot + Tea Lounge", location: "Integration Space", track: "spirit" },
      { time: "6:00 PM", event: "Cacao Ceremony", location: "Main Stage", track: "spirit" },
      { time: "8:00 PM", event: "Lionsgate Drumming Ceremony", detail: "with White Eagle Medicine Woman", location: "Main Stage", track: "spirit", gloss: LIONSGATE_GLOSS },
      { time: "9:30 PM", event: "Ecstatic Dance + Music Activation", location: "Main Stage", track: "sound" },
      { time: "11:30 PM", event: "CE5 Gathering: Beyond the Veil Pt. 2", location: "Stargazing Zone", track: "spirit", gloss: CE5_GLOSS },
    ],
  },
  {
    label: "Sunday · Aug 10",
    heading: <><LeafIcon size={20} color="var(--sage)" /> Integration + Community</>,
    theme: "Soft Landing, Heart Opening",
    events: [
      { time: "9:00 AM", event: "Handpan Sound Journey", location: "Main Stage", track: "sound" },
      { time: "10:00 AM", event: "Earth Awareness Practice", detail: "with Gail", location: "Outdoor Space", track: "body" },
      { time: "11:00 AM", event: "Message from the Bees Ecstatic Dance", location: "Main Stage", track: "sound" },
      { time: "1:00 PM", event: "Live Music: J Brave + Kuf Knotz", location: "Main Stage", track: "sound" },
      { time: "3:00 PM", event: "Spiritual Social Hour", location: "Integration Lounge", track: "community" },
      { time: "4:00 PM", event: "Paddleboard Yoga", location: "Lake", track: "body" },
      { time: "4:30 PM", event: "Closing Ceremony + Integration Circle", location: "Main Stage", track: "spirit" },
    ],
  },
];

const familyDay = [
  { time: "All Day", event: "Laugh Your Way to Wellness", detail: "with Alex", track: "body" as Track },
  { time: "All Day", event: "Yoga for Health", detail: "with Logan Forehand", track: "body" as Track },
  { time: "All Day", event: "Family Yoga", detail: "by Yoga Om", track: "body" as Track },
  { time: "All Day", event: "Vendor Village + Nonprofit Activations", track: "community" as Track },
];

const DAY_KEYS = ["friday", "saturday", "sunday"] as const;

function readInitialDay(): number {
  if (typeof window === "undefined") return 0;
  const day = new URLSearchParams(window.location.search).get("day");
  const idx = DAY_KEYS.indexOf(day as typeof DAY_KEYS[number]);
  return idx >= 0 ? idx : 0;
}

export default function Schedule() {
  const [active, setActiveState] = useState<number>(readInitialDay);
  const [trackFilter, setTrackFilter] = useState<Track | null>(null);

  const setActive = (i: number) => {
    setActiveState(i);
    if (typeof window === "undefined") return;
    const url = new URL(window.location.href);
    if (i === 0) url.searchParams.delete("day");
    else url.searchParams.set("day", DAY_KEYS[i]);
    window.history.replaceState({}, "", url.toString());
  };

  const currentDay = days[active];
  const filteredEvents = trackFilter
    ? currentDay.events.filter((e) => e.track === trackFilter)
    : currentDay.events;

  return (
    <section id="schedule" className="section schedule">
      <p className="section-label">The Journey</p>
      <h2 className="section-title">
        Friday · Saturday · Sunday
      </h2>

      {/* Track Filter Pills */}
      <div className="track-filters">
        <button
          className={`track-pill${trackFilter === null ? " active" : ""}`}
          onClick={() => setTrackFilter(null)}
        >
          All
        </button>
        {(Object.entries(trackMeta) as [Track, typeof trackMeta.body][]).map(([key, meta]) => (
          <button
            key={key}
            className={`track-pill${trackFilter === key ? " active" : ""}`}
            style={{ "--pill-color": meta.color } as React.CSSProperties}
            onClick={() => setTrackFilter(trackFilter === key ? null : key)}
          >
            {meta.icon} {meta.label}
          </button>
        ))}
      </div>

      {/* Day Tabs */}
      <div className="schedule-days">
        {days.map((d, i) => (
          <button
            key={i}
            className={`schedule-day-btn${active === i ? " active" : ""}`}
            onClick={() => setActive(i)}
          >
            {d.label}
          </button>
        ))}
      </div>

      {/* Day Theme */}
      <div className="schedule-theme">
        <span className="schedule-heading">
          {currentDay.heading}
        </span>
        <span className="schedule-theme-text">{currentDay.theme}</span>
      </div>

      {/* Timeline — re-keyed on day/filter change so cross-fade animation re-fires */}
      <div className="schedule-timeline" key={`${active}-${trackFilter ?? "all"}`}>
        {filteredEvents.map((e, i) => (
          <div className="schedule-item" key={i} style={{ "--dot-color": trackMeta[e.track].color } as React.CSSProperties}>
            <div className="schedule-time">
              {e.time}
              {e.location && <span className="schedule-location"> · {e.location}</span>}
            </div>
            <div className="schedule-event">
              <span className="schedule-track-icon">{trackMeta[e.track].icon}</span>
              {e.gloss ? <EventGloss term={e.event} gloss={e.gloss} /> : e.event}
            </div>
            {e.detail && <div className="schedule-detail">{e.detail}</div>}
          </div>
        ))}
        {filteredEvents.length === 0 && (
          <div className="schedule-empty">No {trackMeta[trackFilter!].label} events on this day</div>
        )}
      </div>

      {/* Sunday Family Day */}
      {active === 2 && (
        <div className="family-day">
          <h3 className="family-day-title" style={{ display: "flex", alignItems: "center", gap: "0.5rem", justifyContent: "center" }}>
            <LeafIcon size={22} color="var(--sage)" /> Sunday Family Day
          </h3>
          <p className="family-day-subtitle">Wellness for All Ages · All Proceeds to Nonprofits</p>
          <div className="family-day-grid">
            {familyDay.map((e, i) => (
              <div className="family-day-card" key={i}>
                <div className="family-day-time">{e.time}</div>
                <div className="family-day-name">
                  <span className="schedule-track-icon">{trackMeta[e.track].icon}</span>
                  {e.event}
                </div>
                {e.detail && <div className="family-day-detail">{e.detail}</div>}
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
