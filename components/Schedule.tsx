"use client";
import { useState, type ReactNode } from "react";
import { LeafIcon, FlameIcon, WaterDropIcon, WindIcon, MoonIcon } from "@/components/Icons";
import EventGloss from "@/components/EventGloss";
import BioTrigger from "@/components/BioTrigger";

type Element = "fire" | "water" | "air" | "earth";

const LIONSGATE_GLOSS =
  "Our gathering falls on August 8th — the Lion's Gate Portal. A day of heightened energy and intentional outdoor ceremony. We step outside together at 8:08 AM to meet the day with full presence — mountain air, open sky, and the earth beneath bare feet. Led by White Eagle Medicine Woman.";
const AYNI_GLOSS =
  "An Andean ceremony of reciprocity. A small bundle of seeds, flowers, and offerings is built and given back to the mountain spirits.";
const CONTRAST_GLOSS =
  "Alternating cold water immersion and heat activates circulation, reduces inflammation, and powerfully grounds the nervous system. 30-minute facilitated sessions with limited spots — book ahead.";
const LABYRINTH_GLOSS =
  "One path in. One path out. The labyrinth garden is open throughout the weekend for silent walking, integration, and personal reflection between ceremonies.";

const elementMeta: Record<Element, { icon: ReactNode; label: string; color: string; desc: string }> = {
  fire:  { icon: <FlameIcon      size={14} color="#FF6B35" />, label: "Fire",  color: "#FF6B35", desc: "Main Stage · Ceremony" },
  water: { icon: <WaterDropIcon  size={14} color="#3DB8AF" />, label: "Water", color: "#3DB8AF", desc: "Lakeside · Immersion" },
  air:   { icon: <WindIcon       size={14} color="#9B7FD4" />, label: "Air",   color: "#9B7FD4", desc: "Aerial · Movement" },
  earth: { icon: <LeafIcon       size={14} color="#5E8A6A" />, label: "Earth", color: "#5E8A6A", desc: "Garden · Nature" },
};

interface ScheduleEvent {
  time: string;
  event: string;
  detail?: string;
  element: Element;
  secondElement?: Element;
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
        time: "1:00 PM",
        event: "Opening Ceremony",
        detail: "Land Acknowledgement · Dance Alchemy with Ashleigh — the movement medicine your soul has been craving",
        element: "fire", location: "Main Stage",
        hosts: ["ashleigh"],
      },
      {
        time: "2:00 PM",
        event: "Paddleboard Yoga",
        detail: "All levels, beginner flow — you might get wet!",
        element: "water", location: "Lakeside",
        limited: true,
      },
      {
        time: "2:30 PM",
        event: "Nature Immersion Walk",
        detail: "A guided slow walk through the surrounding boreal landscape — identifying plants, listening to the land, and practicing forest bathing",
        element: "earth", location: "Trailhead",
      },
      {
        time: "3:00 PM",
        event: "Guided Meditation",
        detail: "Guided bilateral movement for a relaxing grounding session",
        element: "earth", location: "Labyrinth Garden",
        gloss: LABYRINTH_GLOSS,
        hosts: ["dixie"],
      },
      {
        time: "3:00 PM",
        event: "Intro Aerial",
        detail: "Beginner silks flow · 6 people max",
        element: "air",
        limited: true,
        hosts: ["alice"],
      },
      {
        time: "4:00 PM",
        event: "Yin Yoga & Sound Savasana",
        detail: "Restorative poses with sound savasana",
        element: "earth", location: "Tea Lounge",
        hosts: ["mary"],
      },
      {
        time: "3:00 PM",
        event: "Contrast Therapy",
        detail: "30 min · Cold plunge + heat cycling to activate circulation, reduce inflammation, and ground your nervous system",
        element: "water", secondElement: "fire",
        location: "Lakeside",
        gloss: CONTRAST_GLOSS,
        limited: true,
        hosts: ["ashleigh"],
      },
      {
        time: "5:00 PM",
        event: "Keys to Kreation",
        detail: "Unlock your infinite potential of creative expression · 2 hours",
        element: "fire", location: "Main Stage",
        hosts: ["j-brave"],
      },
      {
        time: "8:30 PM",
        event: "Cacao Ceremony · Heart Activation",
        element: "fire", location: "Main Stage",
        hosts: ["az"],
      },
      {
        time: "9:00 PM",
        event: "Ecstatic Dance",
        element: "fire", location: "Main Stage",
        hosts: ["flowscape"],
      },
    ],
  },
  {
    label: "Saturday · Aug 8",
    heading: <><FlameIcon size={20} color="#FF6B35" /> Activation + Transformation</>,
    theme: "Lion's Gate · Expansion · Ceremony",
    events: [
      {
        time: "7:00 AM",
        event: "Floating Sound Bath",
        detail: "Handpan music and ambient sound bath on the lake",
        element: "water", location: "Lakeside",
        hosts: ["peace-pixy"],
      },
      {
        time: "8:00 AM",
        event: "Lionsgate Activation + Floating Sound Bath",
        detail: "Float in an aerial silk hammock or on the lake on a paddleboard — ceremony at 8:08 AM",
        element: "water", secondElement: "air",
        location: "Lake · Aerial",
        gloss: LIONSGATE_GLOSS,
        hosts: ["avalon-starling"],
      },
      {
        time: "9:00 AM",
        event: "Yoga for Health",
        detail: "Yoga with sound, breath and asanas",
        element: "fire", location: "Main Stage",
        hosts: ["logan-forehand"],
      },
      {
        time: "9:30 AM",
        event: "Plant Medicine Walk",
        detail: "Learn Alaska's healing plants — yarrow, fireweed, spruce tips, and wild rose — with a guided foraging walk through the boreal forest",
        element: "earth", location: "Trailhead",
      },
      {
        time: "10:00 AM",
        event: "Quantum Light Activation",
        detail: "Activate your healing with phototherapy",
        element: "earth", location: "Labyrinth Garden",
        gloss: LABYRINTH_GLOSS,
        hosts: ["shawn"],
      },
      {
        time: "10:00 AM",
        event: "Intro Aerial",
        detail: "Floating in silks · 6 people max",
        element: "air",
        limited: true,
        hosts: ["alice"],
      },
      {
        time: "11:00 AM",
        event: "Ayni Despacho Ceremony",
        element: "fire", location: "Lodge",
        gloss: AYNI_GLOSS,
        limited: true,
      },
      {
        time: "11:00 AM",
        event: "Feel Good Flow",
        element: "air",
        hosts: ["jenni"],
      },
      {
        time: "12:30 PM",
        event: "Contrast Therapy",
        detail: "30 min · Cold plunge + heat cycling — ground and reset at the midpoint of your day",
        element: "water", secondElement: "fire",
        location: "Lakeside",
        gloss: CONTRAST_GLOSS,
        limited: true,
        hosts: ["ashleigh"],
      },
      {
        time: "1:00 PM",
        event: "Authentic Relating Practice",
        element: "fire", location: "Main Stage",
        hosts: ["az"],
      },
      {
        time: "2:00 PM",
        event: "Paddleboard Yoga",
        element: "water", location: "Lakeside",
        limited: true,
        hosts: ["alice"],
      },
      {
        time: "2:00 PM",
        event: "Intro Aerial",
        element: "air",
        limited: true,
        hosts: ["alice"],
      },
      {
        time: "3:00 PM",
        event: "Miracle of Mind",
        detail: "Beginner-friendly guided meditation and discussion",
        element: "earth", location: "Labyrinth Garden",
        hosts: ["logan-forehand"],
      },
      {
        time: "4:00 PM",
        event: "Roots for Recovery",
        detail: "Yin yoga with long holds, MFR props, ending in a Tibetan bowl and gong sound bath",
        element: "earth", location: "Tea Lounge",
        hosts: ["jon"],
      },
      {
        time: "5:30 PM",
        event: "Contrast Therapy",
        detail: "30 min · Final session of the day — prepare your body for an evening of ceremony",
        element: "water", secondElement: "fire",
        location: "Lakeside",
        gloss: CONTRAST_GLOSS,
        limited: true,
        hosts: ["ashleigh"],
      },
      {
        time: "7:00 PM",
        event: "Cacao Ceremony",
        element: "fire", location: "Main Stage",
      },
      {
        time: "8:00 PM",
        event: "Lionsgate Drumming Ceremony",
        detail: "Bring your drum for a community drum circle with the sacred Grandmother Drum",
        element: "fire", location: "Main Stage",
        gloss: LIONSGATE_GLOSS,
        hosts: ["white-eagle"],
      },
      {
        time: "9:30 PM",
        event: "Ecstatic Dance",
        element: "fire", location: "Main Stage",
        hosts: ["j-brave"],
      },
    ],
  },
  {
    label: "Sunday · Aug 9",
    heading: <><LeafIcon size={20} color="#5E8A6A" /> Integration + Community</>,
    theme: "Soft Landing · Heart Opening",
    events: [
      {
        time: "9:00 AM",
        event: "Sound Journey",
        detail: "Handpan music and ambient sound bath in the labyrinth garden",
        element: "earth", location: "Labyrinth Garden",
        gloss: LABYRINTH_GLOSS,
        hosts: ["peace-pixy"],
      },
      {
        time: "10:00 AM",
        event: "Earthing Practice with Gail",
        detail: "Barefoot connection to the land — grounding through breath, movement, and direct contact with the earth",
        element: "earth", location: "Outdoor Space",
        hosts: ["gail"],
      },
      {
        time: "10:30 AM",
        event: "Intro Aerial for Kids",
        element: "air",
        limited: true,
        hosts: ["alice"],
      },
      {
        time: "11:11 AM",
        event: "Message from the Bees — Ecstatic Dance",
        element: "earth", location: "Labyrinth Garden",
      },
      {
        time: "11:30 AM",
        event: "Contrast Therapy",
        detail: "30 min · Sunday morning reset — invigorate and integrate before the day unfolds",
        element: "water", secondElement: "fire",
        location: "Lakeside",
        gloss: CONTRAST_GLOSS,
        limited: true,
        hosts: ["ashleigh"],
      },
      {
        time: "12:00 PM",
        event: "Kids Adventure Walk",
        detail: "A guided nature walk for children through the boreal forest — spotting wildlife signs, touching plants, and exploring the Alaskan wilderness with curious eyes",
        element: "earth", location: "Trailhead",
      },
      {
        time: "1:00 PM",
        event: "Kuf Knotz + Christine Elise",
        detail: "Live music",
        element: "fire", location: "Main Stage",
        hosts: ["kuf-knotz", "christine-elise"],
      },
      {
        time: "1:30 PM",
        event: "Yogassage",
        element: "earth",
        hosts: ["sarah"],
      },
      {
        time: "3:15 PM",
        event: "J Brave",
        detail: "45 minutes",
        element: "fire", location: "Main Stage",
        hosts: ["j-brave"],
      },
      {
        time: "4:00 PM",
        event: "Tarot + Tea Party",
        detail: "Tea Lounge welcomes divinators to share and activate this space",
        element: "earth", location: "Tea Lounge",
      },
      {
        time: "5:00 PM",
        event: "Closing Ceremony",
        element: "fire", location: "Main Stage",
      },
    ],
  },
];

const FAMILY_DAY_ACTIVITIES = [
  "Lake Obstacle Course",
  "Intro Aerial Silks for Kids",
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
  const [elementFilter, setElementFilter] = useState<Element | null>(null);

  const setActive = (i: number) => {
    setActiveState(i);
    setElementFilter(null);
    if (typeof window === "undefined") return;
    const url = new URL(window.location.href);
    if (i === 0) url.searchParams.delete("day");
    else url.searchParams.set("day", DAY_KEYS[i]);
    window.history.replaceState({}, "", url.toString());
  };

  const currentDay = days[active];
  const filteredEvents = elementFilter
    ? currentDay.events.filter((e) => e.element === elementFilter || e.secondElement === elementFilter)
    : currentDay.events;

  return (
    <section id="schedule" className="section schedule">
      <p className="section-label">Three Days · Four Elements</p>
      <h2 className="section-title">
        The Journey
      </h2>
      <p className="section-desc">
        From fire ceremonies to lakeside immersion, aerial arts to earth medicine — filter by element to find your path through the weekend.
      </p>

      {/* Element Legend */}
      <div style={{ display: "flex", justifyContent: "center", gap: "1.5rem", marginBottom: "1.25rem", flexWrap: "wrap" }}>
        {(Object.entries(elementMeta) as [Element, typeof elementMeta["fire"]][]).map(([key, meta]) => (
          <span key={key} style={{ fontSize: "0.75rem", color: "var(--charcoal)", letterSpacing: "0.06em", display: "flex", alignItems: "center", gap: "0.3rem" }}>
            {meta.icon} {meta.desc}
          </span>
        ))}
      </div>

      {/* Element Filter Pills */}
      <div className="track-filters">
        <button
          className={`track-pill${elementFilter === null ? " active" : ""}`}
          onClick={() => setElementFilter(null)}
        >
          All
        </button>
        {(Object.entries(elementMeta) as [Element, typeof elementMeta["fire"]][]).map(([key, meta]) => (
          <button
            key={key}
            className={`track-pill${elementFilter === key ? " active" : ""}`}
            style={{ "--pill-color": meta.color } as React.CSSProperties}
            onClick={() => setElementFilter(elementFilter === key ? null : key)}
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

      {/* Book Ahead Panel */}
      {(() => {
        const limited = currentDay.events.filter((e) => e.limited);
        if (limited.length === 0) return null;
        return (
          <div className="book-ahead-panel">
            <div className="book-ahead-header">
              <span className="book-ahead-badge">Reserve Your Spot</span>
              <span className="book-ahead-note">These sessions have limited capacity — book ahead to secure your place</span>
            </div>
            <div className="book-ahead-list">
              {limited.map((e, i) => (
                <a key={i} href="#store" className="book-ahead-item">
                  <span className="book-ahead-time">{e.time}</span>
                  <span className="book-ahead-name">{e.event}</span>
                  <span className="book-ahead-cta">Reserve →</span>
                </a>
              ))}
            </div>
          </div>
        );
      })()}

      {/* Timeline */}
      <div className="schedule-timeline" key={`${active}-${elementFilter ?? "all"}`}>
        {filteredEvents.map((e, i) => (
          <div
            className="schedule-item"
            key={i}
            style={{ "--dot-color": elementMeta[e.element].color } as React.CSSProperties}
          >
            <div className="schedule-time">
              {e.time}
              {e.location && <span className="schedule-location"> · {e.location}</span>}
            </div>
            <div className="schedule-event">
              <span className="schedule-track-icon">{elementMeta[e.element].icon}</span>
              {e.secondElement && (
                <span className="schedule-track-icon" style={{ marginLeft: "-2px" }}>
                  {elementMeta[e.secondElement].icon}
                </span>
              )}
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
            No {elementMeta[elementFilter!].label} events on this day
          </div>
        )}
      </div>

      {/* Sunday Family Day */}
      {active === 2 && (
        <div className="family-day">
          <h3 className="family-day-title" style={{ display: "flex", alignItems: "center", gap: "0.5rem", justifyContent: "center" }}>
            <LeafIcon size={22} color="#5E8A6A" /> Sunday Family Day
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
