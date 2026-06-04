"use client";
import { useState, type ReactNode } from "react";
import { LeafIcon, FlameIcon, SoundWaveIcon, MoonIcon, CupIcon } from "@/components/Icons";
import EventGloss from "@/components/EventGloss";
import BioTrigger from "@/components/BioTrigger";

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
  hosts?: string[];
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
      {
        time: "9:00 AM",
        event: "Gates Open",
        detail: "Vendor & staff setup",
        venue: "outdoor",
      },
      {
        time: "12:00 PM",
        event: "Guest Check-In",
        venue: "outdoor",
      },
      {
        time: "1:00 PM",
        event: "Opening Ceremony",
        detail: "Land Acknowledgement · Dance Alchemy with Ashleigh — the movement medicine your soul has been craving",
        venue: "main-stage", location: "Main Stage",
        hosts: ["ashleigh"],
      },
      {
        time: "2:00 PM",
        event: "Paddleboard Yoga",
        detail: "All levels, beginner flow — you might get wet!",
        venue: "lake", location: "Lakeside",
        limited: true,
      },
      {
        time: "2:00 PM",
        event: "Sauna · Arts & Crafts · Live Painter",
        detail: "Open all afternoon — drop in anytime",
        venue: "outdoor",
      },
      {
        time: "3:00 PM",
        event: "Guided Meditation",
        detail: "Guided bilateral movement for a relaxing grounding session",
        venue: "labyrinth", location: "Labyrinth Garden",
        hosts: ["dixie"],
      },
      {
        time: "3:00 PM",
        event: "Intro Aerial",
        detail: "Beginner flow · 6 people max",
        venue: "outdoor",
        limited: true,
        hosts: ["alice"],
      },
      {
        time: "4:00 PM",
        event: "Yin Yoga & Sound Savasana",
        detail: "Restorative poses with sound savasana",
        venue: "tea-lounge", location: "Tea Lounge",
        hosts: ["mary"],
      },
      {
        time: "5:00 PM",
        event: "Keys to Kreation",
        detail: "Unlock your infinite potential of creative expression · 2 hours",
        venue: "main-stage", location: "Main Stage",
        hosts: ["j-brave"],
      },
      {
        time: "8:30 PM",
        event: "Cacao Ceremony · Heart Activation",
        venue: "main-stage", location: "Main Stage",
        hosts: ["az"],
      },
      {
        time: "9:00 PM",
        event: "Ecstatic Dance",
        venue: "main-stage", location: "Main Stage",
        hosts: ["zwami", "flowscape"],
      },
    ],
  },
  {
    label: "Saturday · Aug 8",
    heading: <><FlameIcon size={20} color="var(--coral)" /> Activation + Transformation</>,
    theme: "Expansion, Ceremony, Expression",
    events: [
      {
        time: "7:00 AM",
        event: "Floating Sound Bath",
        detail: "Handpan music and ambient sound bath on the lake",
        venue: "lake", location: "Lakeside",
        hosts: ["peace-pixy"],
      },
      {
        time: "8:00 AM",
        event: "Lionsgate Activation + Floating Sound Bath",
        venue: "lake", location: "Lake / Aerial",
        gloss: LIONSGATE_GLOSS,
      },
      {
        time: "9:00 AM",
        event: "Yoga for Health",
        detail: "Yoga with sound, breath and asanas",
        venue: "main-stage", location: "Main Stage",
        hosts: ["logan-forehand"],
      },
      {
        time: "10:00 AM",
        event: "Quantum Light Activation",
        detail: "Activate your healing with phototherapy",
        venue: "labyrinth", location: "Labyrinth Garden",
        hosts: ["shawn"],
      },
      {
        time: "10:00 AM",
        event: "Intro Aerial",
        detail: "Floating in silks · 6 people max",
        venue: "outdoor",
        limited: true,
        hosts: ["alice"],
      },
      {
        time: "11:00 AM",
        event: "Ayni Despacho Ceremony",
        venue: "main-stage", location: "Lodge",
        gloss: AYNI_GLOSS,
      },
      {
        time: "11:00 AM",
        event: "Feel Good Flow",
        venue: "outdoor",
        hosts: ["jenni"],
      },
      {
        time: "12:00 PM",
        event: "Laugh Your Way to Wellness",
        venue: "outdoor",
        hosts: ["alex"],
      },
      {
        time: "1:00 PM",
        event: "Authentic Relating Practice",
        venue: "main-stage", location: "Main Stage",
        hosts: ["az"],
      },
      {
        time: "2:00 PM",
        event: "Paddleboard Yoga",
        venue: "lake", location: "Lakeside",
        limited: true,
        hosts: ["alice"],
      },
      {
        time: "2:00 PM",
        event: "Intro Aerial — Hooping",
        venue: "outdoor",
        limited: true,
        hosts: ["alice"],
      },
      {
        time: "3:00 PM",
        event: "Miracle of Mind",
        detail: "Beginner-friendly guided meditation and discussion",
        venue: "labyrinth", location: "Labyrinth Garden",
        hosts: ["logan-forehand"],
      },
      {
        time: "4:00 PM",
        event: "Roots for Recovery",
        detail: "Yin yoga, MFR props & Tibetan bowl sound bath",
        venue: "tea-lounge", location: "Tea Lounge",
        hosts: ["jon"],
      },
      {
        time: "7:00 PM",
        event: "Cacao Ceremony",
        venue: "main-stage", location: "Main Stage",
      },
      {
        time: "8:00 PM",
        event: "Lionsgate Drumming Ceremony",
        detail: "Bring your drum for a community drum circle with the sacred Grandmother Drum",
        venue: "main-stage", location: "Main Stage",
        gloss: LIONSGATE_GLOSS,
        hosts: ["white-eagle"],
      },
      {
        time: "9:30 PM",
        event: "Ecstatic Dance + Music Activation",
        venue: "main-stage", location: "Main Stage",
        hosts: ["j-brave", "zwami"],
      },
    ],
  },
  {
    label: "Sunday · Aug 9",
    heading: <><LeafIcon size={20} color="#7C9070" /> Integration + Community</>,
    theme: "Soft Landing, Heart Opening",
    events: [
      {
        time: "9:00 AM",
        event: "Sound Journey",
        detail: "Handpan music and ambient sound bath in the labyrinth garden",
        venue: "labyrinth", location: "Labyrinth Garden",
        hosts: ["peace-pixy"],
      },
      {
        time: "10:00 AM",
        event: "Earth Awareness Practice",
        venue: "outdoor", location: "Outdoor Space",
        hosts: ["gail"],
      },
      {
        time: "10:30 AM",
        event: "Intro Aerial for Kids",
        venue: "outdoor",
        limited: true,
        hosts: ["alice"],
      },
      {
        time: "11:11 AM",
        event: "Message from the Bees — Ecstatic Dance",
        venue: "labyrinth", location: "Labyrinth Garden",
      },
      {
        time: "1:00 PM",
        event: "Kuf Knotz + Christine Elise",
        detail: "Live music",
        venue: "main-stage", location: "Main Stage",
        hosts: ["kuf-knotz", "christine-elise"],
      },
      {
        time: "1:30 PM",
        event: "Yogassage",
        venue: "outdoor",
        hosts: ["sarah"],
      },
      {
        time: "3:15 PM",
        event: "J Brave",
        detail: "45 minutes",
        venue: "main-stage", location: "Main Stage",
        hosts: ["j-brave"],
      },
      {
        time: "4:00 PM",
        event: "Tarot + Tea Party",
        detail: "Tea Lounge welcomes divinators to share and activate this space",
        venue: "tea-lounge", location: "Tea Lounge",
      },
      {
        time: "5:00 PM",
        event: "Closing Ceremony",
        venue: "main-stage", location: "Main Stage",
      },
      {
        time: "7:00 PM",
        event: "Ecstatic Dance with Flowscape",
        detail: "Cacao bar open · Check out by 10 PM",
        venue: "main-stage", location: "Main Stage",
        hosts: ["flowscape"],
      },
    ],
  },
];

const FAMILY_DAY_ACTIVITIES = [
  "Paddleboard for Kids (limited spots)",
  "Arts & Crafts · Needlefelting",
  "Crystal Scavenger Hunt",
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
            {e.hosts && e.hosts.length > 0 && (
              <div className="schedule-hosts">
                {e.hosts.map((slug) => (
                  <BioTrigger key={slug} slug={slug} />
                ))}
              </div>
            )}
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
          <p className="family-day-mission">
            The next generation of healers, leaders, and earth stewards is already here. Sunday Family Day
            is our commitment to making wellness education accessible to children and families — planting
            seeds of breath, body awareness, and connection to the natural world that will carry forward
            long after the festival ends.
          </p>
          <p className="family-day-mission" style={{ marginTop: "0.75rem" }}>
            Activities this year include{" "}
            {FAMILY_DAY_ACTIVITIES.map((a, i) => (
              <span key={i}>
                <strong>{a}</strong>
                {i < FAMILY_DAY_ACTIVITIES.length - 2 ? ", " : i === FAMILY_DAY_ACTIVITIES.length - 2 ? ", and " : ""}
              </span>
            ))}
            {" "}— with more to be announced as we get closer to August.
          </p>
          <p className="family-day-subtitle" style={{ marginTop: "1rem", opacity: 0.7 }}>
            All Family Day proceeds support youth wellness nonprofits in the Matanuska-Susitna Valley.
          </p>
        </div>
      )}
    </section>
  );
}
