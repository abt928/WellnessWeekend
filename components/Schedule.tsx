"use client";
import { useState, type ReactNode } from "react";
import { LeafIcon, FlameIcon, WaterDropIcon, WindIcon, MoonIcon } from "@/components/Icons";
import EventGloss from "@/components/EventGloss";
import BioTrigger from "@/components/BioTrigger";
import { scheduleDays, type Element, type ScheduleEvent } from "@/lib/schedule-data";

const elementMeta: Record<Element, { icon: ReactNode; label: string; color: string; desc: string }> = {
  fire:  { icon: <FlameIcon      size={14} color="#FF6B35" />, label: "Fire",  color: "#FF6B35", desc: "Main Stage · Ceremony" },
  water: { icon: <WaterDropIcon  size={14} color="#3DB8AF" />, label: "Water", color: "#3DB8AF", desc: "Lakeside · Immersion" },
  air:   { icon: <WindIcon       size={14} color="#9B7FD4" />, label: "Air",   color: "#9B7FD4", desc: "Aerial · Movement" },
  earth: { icon: <LeafIcon       size={14} color="#5E8A6A" />, label: "Earth", color: "#5E8A6A", desc: "Garden · Nature" },
};

interface ScheduleBlock {
  label: string;
  heading: ReactNode;
  theme: string;
  events: ScheduleEvent[];
}

const headingIcons: Record<string, ReactNode> = {
  moon:  <MoonIcon  size={20} color="var(--aurora-light)" />,
  flame: <FlameIcon size={20} color="#FF6B35" />,
  leaf:  <LeafIcon  size={20} color="#5E8A6A" />,
};

const days: ScheduleBlock[] = scheduleDays.map((d) => ({
  label: d.label,
  heading: <>{headingIcons[d.headingIcon]} {d.headingText}</>,
  theme: d.theme,
  events: d.events,
}));

const FAMILY_DAY_ACTIVITIES = [
  "Intro Aerial Silks for Kids",
  "Crystal Scavenger Hunt",
  "Arts & Crafts · Needlefelting",
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
        The Flow
      </h2>
      <p className="section-desc">
        From fire ceremonies to lakeside immersion, aerial arts to earth medicine: filter by element to find your path through the weekend.
      </p>

      {/* Element Legend */}
      <div style={{ display: "flex", justifyContent: "center", gap: "1.5rem", marginBottom: "1.25rem", flexWrap: "wrap" }}>
        {(Object.entries(elementMeta) as [Element, typeof elementMeta["fire"]][]).map(([key, meta]) => (
          <span key={key} style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.7)", letterSpacing: "0.06em", display: "flex", alignItems: "center", gap: "0.3rem" }}>
            {meta.icon} {meta.desc}
          </span>
        ))}
      </div>

      {/* Element Filter Pills */}
      <div className="track-filters">
        <button
          className={`track-pill${elementFilter === null ? " active" : ""}`}
          onClick={() => setElementFilter(null)}
          aria-pressed={elementFilter === null}
        >
          All
        </button>
        {(Object.entries(elementMeta) as [Element, typeof elementMeta["fire"]][]).map(([key, meta]) => (
          <button
            key={key}
            className={`track-pill${elementFilter === key ? " active" : ""}`}
            style={{ "--pill-color": meta.color } as React.CSSProperties}
            onClick={() => setElementFilter(elementFilter === key ? null : key)}
            aria-pressed={elementFilter === key}
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
            aria-pressed={active === i}
          >
            {d.label}
          </button>
        ))}
      </div>

      {/* Print / PDF links */}
      <div style={{ display: "flex", justifyContent: "center", gap: "0.75rem", marginBottom: "1rem", flexWrap: "wrap" }}>
        <a href="/schedule/print" target="_blank" rel="noopener noreferrer" className="schedule-pdf-btn">
          🖨 Full Schedule PDF
        </a>
        <a href="/schedule/print/addons" target="_blank" rel="noopener noreferrer" className="schedule-pdf-btn">
          ✦ Add-Ons PDF
        </a>
      </div>

      {/* Day Theme */}
      <div className="schedule-theme">
        <span className="schedule-heading">{currentDay.heading}</span>
        <span className="schedule-theme-text">{currentDay.theme}</span>
      </div>

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
              {e.fee && (
                <span className="schedule-fee">{e.fee}</span>
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

      {/* Book Ahead Panel — bottom of schedule */}
      {(() => {
        const limited = currentDay.events.filter((e) => e.limited);
        if (limited.length === 0) return null;
        return (
          <div className="book-ahead-panel">
            <div className="book-ahead-header">
              <span className="book-ahead-badge">Reserve Your Spot</span>
              <span className="book-ahead-note">These sessions have limited capacity; book ahead to secure your place</span>
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

      {/* Sunday Family Day */}
      {active === 2 && (
        <div className="family-day">
          <h3 className="family-day-title" style={{ display: "flex", alignItems: "center", gap: "0.5rem", justifyContent: "center" }}>
            <LeafIcon size={22} color="#5E8A6A" /> Sunday Family Day
          </h3>
          <p className="family-day-subtitle">Wellness for All Ages · All Proceeds to Nonprofits</p>
          <p className="family-day-mission">
            The next generation of healers, leaders, and earth stewards is already here. Sunday Family Day
            is our commitment to making wellness education accessible to children and families: planting
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
            , with more to be announced as we get closer to August.
          </p>
          <p className="family-day-subtitle" style={{ marginTop: "1rem", opacity: 0.7 }}>
            All Family Day proceeds support youth wellness nonprofits in the Matanuska-Susitna Valley.
          </p>
        </div>
      )}
    </section>
  );
}
