"use client";
import { useState, type ReactNode } from "react";
import { LeafIcon, FlameIcon, SoundWaveIcon, CommunityIcon, MoonIcon, CupIcon } from "@/components/Icons";
import EventGloss from "@/components/EventGloss";

type Venue = "main-stage" | "lake" | "tea-lounge" | "labyrinth" | "outdoor";

const LIONSGATE_GLOSS =
  "Lionsgate refers to the 8/8 alignment of Earth, the Sun, and the star Sirius. In some spiritual traditions it's held as an annual portal of heightened energy.";
const AYNI_GLOSS =
  "An Andean ceremony of reciprocity. A small bundle of seeds, flowers, and offerings is built and given back to the mountain spirits.";

const venueMeta: Record<Venue, { icon: ReactNode; label: string; color: string; isNew?: boolean }> = {
  "main-stage": { icon: <FlameIcon    size={14} color="#E8956A" />, label: "Main Stage",        color: "#E8956A" },
  "lake":       { icon: <SoundWaveIcon size={14} color="#3DB8AF" />, label: "Lakeside",          color: "#3DB8AF" },
  "tea-lounge": { icon: <CupIcon      size={14} color="#D4639F" />, label: "Tea Lounge",         color: "#D4639F", isNew: true },
  "labyrinth":  { icon: <MoonIcon     size={14} color="#8B5FBF" />, label: "Labyrinth Garden",   color: "#8B5FBF", isNew: true },
  "outdoor":    { icon: <LeafIcon     size={14} color="#7C9070" />, label: "Nature & Activities", color: "#7C9070" },
};

interface ScheduleEvent {
  time: string;
  event: string;
  detail?: string;
  venue: Venue;
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
    label: "Friday · Aug 7",
    heading: <><MoonIcon size={20} color="var(--aurora-light)" /> Arrival + Grounding</>,
    theme: "Land, Arrival, Intention",
    events: [
      { time: "9:00 AM",  event: "Gates Open",                                                     detail: "Vendor & staff setup",                               venue: "outdoor"    },
      { time: "12:00 PM", event: "Guest Check-In Begins",                                                                                                         venue: "outdoor"    },
      { time: "1:00 PM",  event: "Opening Ceremony",                                               detail: "Land Acknowledgement · Dance Alchemy with Ashleigh", location: "Main Stage",       venue: "main-stage" },
      { time: "2:00 PM",  event: "Paddleboard Yoga",                                                                                                              location: "Lakeside",         venue: "lake"       },
      { time: "2:00 PM",  event: "Sauna Open for Booking",                                                                                                        venue: "outdoor"    },
      { time: "2:00 PM",  event: "Arts & Craft Table Open",                                                                                                       venue: "outdoor"    },
      { time: "3:00 PM",  event: "Guided Meditation",                                              detail: "with Dixie",                                         location: "Labyrinth Garden",  venue: "labyrinth"  },
      { time: "4:00 PM",  event: "Tea Lounge Opens",                                                                                                              location: "Tea Lounge",        venue: "tea-lounge" },
      { time: "4:00 PM",  event: "Yin Yoga & Sound Savasana",                                      detail: "with Mary",                                          venue: "outdoor"    },
      { time: "5:00 PM",  event: "Myofascial Release Journey",                                     detail: "with Jon",                                           location: "Wellness Tent",     venue: "outdoor"    },
      { time: "6:00 PM",  event: "Keys to Kreation",                                                                                                              location: "Main Stage",        venue: "main-stage" },
      { time: "8:30 PM",  event: "Cacao Ceremony · Heart Activation · Ecstatic Dance",                                                                           location: "Main Stage",        venue: "main-stage" },
    ],
  },
  {
    label: "Saturday · Aug 8",
    heading: <><FlameIcon size={20} color="var(--coral)" /> Activation + Transformation</>,
    theme: "Expansion, Ceremony, Expression",
    events: [
      { time: "7:00 AM",       event: "Morning Music Set",                                                                                                        location: "Lakeside",          venue: "lake"       },
      { time: "8:00 AM",       event: "Lionsgate Activation + Floating Sound Bath",                                                                              location: "Lakeside / Aerial",  venue: "lake",      gloss: LIONSGATE_GLOSS },
      { time: "9:00 AM",       event: "Morning Yoga + Breathwork",                                                                                               location: "Main Stage",        venue: "main-stage" },
      { time: "10:00 AM",      event: "Quantum Light Activation",                                  detail: "with Shawn",                                         location: "Labyrinth Garden",  venue: "labyrinth"  },
      { time: "10:00 AM",      event: "Aerial Silk Class",                                                                                                        venue: "outdoor"    },
      { time: "11:00 AM",      event: "Ayni Despacho Ceremony",                                                                                                  location: "Main Stage",        venue: "main-stage", gloss: AYNI_GLOSS },
      { time: "11:00 AM",      event: "Feel Good Flow",                                            detail: "with Jenni",                                         venue: "outdoor"    },
      { time: "12:00 – 2:00 PM", event: "Community Connection",                                   detail: "Vendor Village · Food + Tea Lounge",                  location: "Village",           venue: "outdoor"    },
      { time: "2:00 PM",       event: "Paddleboard Yoga",                                                                                                         location: "Lakeside",          venue: "lake"       },
      { time: "4:00 PM",       event: "Tea Lounge",                                                                                                               location: "Tea Lounge",        venue: "tea-lounge" },
      { time: "7:00 PM",       event: "Cacao Ceremony",                                                                                                          location: "Main Stage",        venue: "main-stage" },
      { time: "8:00 PM",       event: "Lionsgate Drumming Ceremony",                               detail: "with White Eagle Medicine Woman",                    location: "Main Stage",        venue: "main-stage", gloss: LIONSGATE_GLOSS },
      { time: "9:30 PM",       event: "Ecstatic Dance + Music Activation",                                                                                       location: "Main Stage",        venue: "main-stage" },
    ],
  },
  {
    label: "Sunday · Aug 9",
    heading: <><LeafIcon size={20} color="#7C9070" /> Integration + Community</>,
    theme: "Soft Landing, Heart Opening",
    events: [
      { time: "9:00 AM",  event: "Sound Journey",                                                                                                                 location: "Labyrinth Garden",  venue: "labyrinth"  },
      { time: "10:00 AM", event: "Earth Awareness Practice",                                       detail: "with Gail",                                          location: "Outdoor Space",     venue: "outdoor"    },
      { time: "11:00 AM", event: "Message from the Bees Ecstatic Dance",                                                                                         location: "Main Stage",        venue: "main-stage" },
      { time: "1:00 PM",  event: "Live Music",                                                                                                                    location: "Main Stage",        venue: "main-stage" },
      { time: "3:00 PM",  event: "Live Music",                                                                                                                    location: "Main Stage",        venue: "main-stage" },
      { time: "4:00 PM",  event: "Paddleboard Yoga",                                                                                                              location: "Lakeside",          venue: "lake"       },
      { time: "5:00 PM",  event: "Closing Ceremony + Integration Circle",                                                                                        location: "Main Stage",        venue: "main-stage" },
      { time: "Evening",  event: "Evening of Music · Ecstatic Dance",                              detail: "Check-out by 10 PM",                                  location: "Main Stage",        venue: "main-stage" },
    ],
  },
];

const familyDay: { time: string; event: string; detail?: string; venue: Venue }[] = [
  { time: "All Day", event: "Laugh Your Way to Wellness", detail: "with Alex",          venue: "outdoor"   },
  { time: "All Day", event: "Yoga for Health",            detail: "with Logan Forehand", venue: "outdoor"   },
  { time: "All Day", event: "Yogassage",                  detail: "with Sarah",          venue: "outdoor"   },
  { time: "All Day", event: "Arts & Crafts Workshops",    detail: "Needlefelting",       venue: "outdoor"   },
  { time: "All Day", event: "Crystal Scavenger Hunt",                                    venue: "labyrinth" },
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
            {meta.isNew && <span className="venue-new-badge">NEW</span>}
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

      {/* Timeline */}
      <div className="schedule-timeline" key={`${active}-${venueFilter ?? "all"}`}>
        {filteredEvents.map((e, i) => (
          <div className="schedule-item" key={i} style={{ "--dot-color": venueMeta[e.venue].color } as React.CSSProperties}>
            <div className="schedule-time">
              {e.time}
              {e.location && <span className="schedule-location"> · {e.location}</span>}
            </div>
            <div className="schedule-event">
              <span className="schedule-track-icon">{venueMeta[e.venue].icon}</span>
              {e.gloss ? <EventGloss term={e.event} gloss={e.gloss} /> : e.event}
            </div>
            {e.detail && <div className="schedule-detail">{e.detail}</div>}
          </div>
        ))}
        {filteredEvents.length === 0 && (
          <div className="schedule-empty">No {venueMeta[venueFilter!].label} events on this day</div>
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
                <div className="family-day-time">{e.time}</div>
                <div className="family-day-name">
                  <span className="schedule-track-icon">{venueMeta[e.venue].icon}</span>
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
