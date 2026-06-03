"use client";
import { useState, type ReactNode } from "react";
import { LeafIcon, FlameIcon, SoundWaveIcon, MoonIcon, CupIcon } from "@/components/Icons";
import EventGloss from "@/components/EventGloss";

type Venue = "main-stage" | "lake" | "tea-lounge" | "labyrinth" | "outdoor";

const LIONSGATE_GLOSS =
  "Our gathering falls on August 8th — a day held in many traditions as a moment of heightened energy and intentional outdoor ceremony under the Alaskan sky.";
const AYNI_GLOSS =
  "An Andean ceremony of reciprocity. A small bundle of seeds, flowers, and offerings is built and given back to the mountain spirits.";

const venueMeta: Record<Venue, { icon: ReactNode; label: string; color: string }> = {
  "main-stage": { icon: <FlameIcon    size={14} color="#E8956A" />, label: "Main Stage",         color: "#E8956A" },
  "lake":       { icon: <SoundWaveIcon size={14} color="#3DB8AF" />, label: "Lakeside",           color: "#3DB8AF" },
  "tea-lounge": { icon: <CupIcon      size={14} color="#D4639F" />, label: "Tea Lounge",          color: "#D4639F" },
  "labyrinth":  { icon: <MoonIcon     size={14} color="#8B5FBF" />, label: "Labyrinth Garden",    color: "#8B5FBF" },
  "outdoor":    { icon: <LeafIcon     size={14} color="#7C9070" />, label: "Nature & Activities", color: "#7C9070" },
};

interface ScheduleEvent {
  time: string;
  event: string;
  detail?: string;
  venue: Venue;
  location?: string;
  gloss?: string;
  limited?: boolean;
}

interface ScheduleBlock {
  label: string;
  heading: ReactNode;
  theme: string;
  events: ScheduleEvent[];
}

const days: ScheduleBlock[] = [
  {
    label: "Friday · Aug 7",
    heading: <><MoonIcon size={20} color="var(--aurora-light)" /> Arrival + Grounding</>,
    theme: "Land, Arrival, Intention",
    events: [
      { time: "9:00 AM",  event: "Gates Open",                                       detail: "Vendor & staff setup",                                 venue: "outdoor"                                },
      { time: "12:00 PM", event: "Guest Check-In",                                                                                                   venue: "outdoor"                                },
      { time: "1:00 PM",  event: "Opening Ceremony",                                 detail: "Land Acknowledgement · Dance Alchemy with Ashleigh",   venue: "main-stage", location: "Main Stage"   },
      { time: "2:00 PM",  event: "Paddleboard Yoga",                                                                                                  venue: "lake",       location: "Lakeside",     limited: true },
      { time: "2:00 PM",  event: "Sauna · Arts & Crafts · Live Painter",             detail: "Open all afternoon — drop in anytime",                 venue: "outdoor"                                },
      { time: "3:00 PM",  event: "Guided Meditation",                                detail: "with Dixie",                                           venue: "labyrinth",  location: "Labyrinth Garden" },
      { time: "3:00 PM",  event: "Aerial Silk — Hooping",                                                                                            venue: "outdoor",                              limited: true },
      { time: "4:00 PM",  event: "Tea Lounge Opens",                                                                                                  venue: "tea-lounge", location: "Tea Lounge"   },
      { time: "4:00 PM",  event: "Yin Yoga & Sound Savasana",                        detail: "with Mary",                                            venue: "outdoor"                                },
      { time: "5:00 PM",  event: "Myofascial Release Journey",                       detail: "with Jon",                                             venue: "outdoor"                                },
      { time: "6:00 PM",  event: "Keys to Kreation",                                 detail: "with J Brave · 2 hours",                               venue: "main-stage", location: "Main Stage"   },
      { time: "8:30 PM",  event: "Cacao Ceremony · Heart Activation · Ecstatic Dance", detail: "AZ · Zwami · Flowscape",                            venue: "main-stage", location: "Main Stage"   },
    ],
  },
  {
    label: "Saturday · Aug 8",
    heading: <><FlameIcon size={20} color="var(--coral)" /> Activation + Transformation</>,
    theme: "Expansion, Ceremony, Expression",
    events: [
      { time: "7:00 AM",        event: "Peace Pixy",                                 detail: "Live music at the lake",                               venue: "lake",       location: "Lakeside"     },
      { time: "8:00 AM",        event: "Lionsgate Activation + Floating Sound Bath",                                                                  venue: "lake",       location: "Lake / Aerial", gloss: LIONSGATE_GLOSS },
      { time: "9:00 AM",        event: "Morning Yoga + Breathwork",                                                                                   venue: "main-stage", location: "Main Stage"   },
      { time: "10:00 AM",       event: "Quantum Light Activation",                   detail: "with Shawn",                                           venue: "labyrinth",  location: "Labyrinth Garden" },
      { time: "10:00 AM",       event: "Aerial Silk",                                detail: "with Alice",                                           venue: "outdoor",                              limited: true },
      { time: "11:00 AM",       event: "Ayni Despacho Ceremony",                                                                                     venue: "main-stage", location: "Lodge",        gloss: AYNI_GLOSS },
      { time: "11:00 AM",       event: "Feel Good Flow",                             detail: "with Jenni",                                           venue: "outdoor"                                },
      { time: "12:00–2:00 PM",  event: "Community Connection",                       detail: "Vendor Village · Food · Tea Lounge",                   venue: "outdoor",    location: "Village"      },
      { time: "2:00 & 3:00 PM", event: "Paddleboard Yoga",                           detail: "with Alice · Two session blocks",                      venue: "lake",       location: "Lakeside",     limited: true },
      { time: "2:00 & 3:00 PM", event: "Aerial Silk",                                detail: "with Alice & Hooping · Two session blocks",            venue: "outdoor",                              limited: true },
      { time: "4:00 PM",        event: "Tea Lounge",                                                                                                  venue: "tea-lounge", location: "Tea Lounge"   },
      { time: "7:00 PM",        event: "Cacao Ceremony",                                                                                              venue: "main-stage", location: "Main Stage"   },
      { time: "8:00 PM",        event: "Lionsgate Drumming Ceremony",                detail: "with White Eagle Medicine Woman",                       venue: "main-stage", location: "Main Stage",   gloss: LIONSGATE_GLOSS },
      { time: "9:30 PM",        event: "Ecstatic Dance + Music Activation",          detail: "J Brave · Zwami",                                       venue: "main-stage", location: "Main Stage"   },
    ],
  },
  {
    label: "Sunday · Aug 9",
    heading: <><LeafIcon size={20} color="#7C9070" /> Integration + Community</>,
    theme: "Soft Landing, Heart Opening",
    events: [
      { time: "9:00 AM",  event: "Sound Journey with Peace Pixy",                                                                                    venue: "labyrinth",  location: "Labyrinth Garden" },
      { time: "10:00 AM", event: "Earth Awareness Practice",                         detail: "with Gail",                                            venue: "outdoor",    location: "Outdoor Space"  },
      { time: "10:00 AM", event: "Paddleboard Yoga",                                 detail: "with Alice",                                           venue: "lake",       location: "Lakeside",     limited: true },
      { time: "11:11 AM", event: "Message from the Bees — Ecstatic Dance",                                                                           venue: "labyrinth",  location: "Labyrinth Garden" },
      { time: "1:00 PM",  event: "Kuf Knotz + Christine Elise",                      detail: "Live music",                                           venue: "main-stage", location: "Main Stage"   },
      { time: "3:15 PM",  event: "J Brave",                                          detail: "45 minutes",                                           venue: "main-stage", location: "Main Stage"   },
      { time: "4:00 PM",  event: "Tea Lounge",                                                                                                        venue: "tea-lounge", location: "Tea Lounge"   },
      { time: "5:00 PM",  event: "Closing Ceremony",                                                                                                  venue: "main-stage", location: "Main Stage"   },
      { time: "Evening",  event: "Cacao Bar + Ecstatic Dance",                       detail: "Flowscape · into the night",                           venue: "main-stage", location: "Main Stage"   },
    ],
  },
];

const familyDay: { event: string; detail?: string; venue: Venue; limited?: boolean }[] = [
  { event: "Laugh Your Way to Wellness", detail: "with Alex",            venue: "outdoor"                },
  { event: "Yoga for Health",            detail: "with Logan Forehand",  venue: "outdoor"                },
  { event: "Yogassage",                  detail: "with Sarah",           venue: "outdoor"                },
  { event: "Aerial Silk — Kids Class",   detail: "Intro price",          venue: "outdoor", limited: true },
  { event: "Paddleboard for Kids",                                        venue: "lake",    limited: true },
  { event: "Arts & Crafts",             detail: "Needlefelting",         venue: "outdoor"                },
  { event: "Crystal Scavenger Hunt",                                      venue: "labyrinth"              },
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
  const [venueFilter, setVenueFilter] = useState<Venue | null>(null);

  const setActive = (i: number) => {
    setActiveState(i);
    setVenueFilter(null);
    if (typeof window === "undefined") return;
    const url = new URL(window.location.href);
    if (i === 0) url.searchParams.delete("day");
    else url.searchParams.set("day", DAY_KEYS[i]);
    window.history.replaceState({}, "", url.toString());
  };

  const currentDay = days[active];
  const filteredEvents = venueFilter
    ? currentDay.events.filter((e) => e.venue === venueFilter)
    : currentDay.events;

  return (
    <section id="schedule" className="section schedule">
      <p className="section-label">The Journey</p>
      <h2 className="section-title">
        Friday · Saturday · Sunday
      </h2>

      {/* Venue Filter Pills */}
      <div className="track-filters">
        <button
          className={`track-pill${venueFilter === null ? " active" : ""}`}
          onClick={() => setVenueFilter(null)}
        >
          All
        </button>
        {(Object.entries(venueMeta) as [Venue, typeof venueMeta["main-stage"]][]).map(([key, meta]) => (
          <button
            key={key}
            className={`track-pill${venueFilter === key ? " active" : ""}`}
            style={{ "--pill-color": meta.color } as React.CSSProperties}
            onClick={() => setVenueFilter(venueFilter === key ? null : key)}
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
        <span className="schedule-heading">{currentDay.heading}</span>
        <span className="schedule-theme-text">{currentDay.theme}</span>
      </div>

      {/* Timeline */}
      <div className="schedule-timeline" key={`${active}-${venueFilter ?? "all"}`}>
        {filteredEvents.map((e, i) => (
          <div
            className="schedule-item"
            key={i}
            style={{ "--dot-color": venueMeta[e.venue].color } as React.CSSProperties}
          >
            <div className="schedule-time">
              {e.time}
              {e.location && <span className="schedule-location"> · {e.location}</span>}
            </div>
            <div className="schedule-event">
              <span className="schedule-track-icon">{venueMeta[e.venue].icon}</span>
              {e.gloss ? <EventGloss term={e.event} gloss={e.gloss} /> : e.event}
              {e.limited && (
                <a href="#store" className="schedule-limited">Limited · Book ahead</a>
              )}
            </div>
            {e.detail && <div className="schedule-detail">{e.detail}</div>}
          </div>
        ))}
        {filteredEvents.length === 0 && (
          <div className="schedule-empty">
            No {venueMeta[venueFilter!].label} events on this day
          </div>
        )}
      </div>

      {/* Sunday Family Day */}
      {active === 2 && (
        <div className="family-day">
          <h3 className="family-day-title" style={{ display: "flex", alignItems: "center", gap: "0.5rem", justifyContent: "center" }}>
            <LeafIcon size={22} color="#7C9070" /> Sunday Family Day
          </h3>
          <p className="family-day-subtitle">Wellness for All Ages · All Proceeds to Nonprofits</p>
          <div className="family-day-grid">
            {familyDay.map((e, i) => (
              <div className="family-day-card" key={i}>
                <div className="family-day-name">
                  <span className="schedule-track-icon">{venueMeta[e.venue].icon}</span>
                  {e.event}
                  {e.limited && (
                    <a href="#store" className="schedule-limited">Limited · Book ahead</a>
                  )}
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
