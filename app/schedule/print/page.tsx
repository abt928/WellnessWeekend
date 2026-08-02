import Link from "next/link";
import PrintButton from "@/components/PrintButton";
import { scheduleDays, type ScheduleEvent } from "@/lib/schedule-data";
import { practitioners } from "@/lib/practitioners";

export const metadata = {
  title: "Class Schedule · Wellness Weekend 2026",
  description: "Printable class schedule for Wellness Weekend — August 7–9, 2026 · Sutton, Alaska",
};

// Exclude logistics, sauna (in add-ons sheet), and passive music performances
const EXCLUDE_EVENTS = new Set([
  "Gates Open · Check-in",
  "Lakeside Sauna Opens",
  "Lakeside Sauna",
  "S7INGRAE & Brackish",
  "Shawn Zuke",
  "Kuf Knotz + Christine Elise",
  "J Brave",
  "ÂKÅTÂLĖ",
]);

function isClass(e: ScheduleEvent): boolean {
  return !EXCLUDE_EVENTS.has(e.event);
}

function groupByTime(events: ScheduleEvent[]) {
  const groups = new Map<string, ScheduleEvent[]>();
  for (const e of events) {
    if (!groups.has(e.time)) groups.set(e.time, []);
    groups.get(e.time)!.push(e);
  }
  return Array.from(groups.entries()).map(([time, evs]) => ({ time, events: evs }));
}

function hostNames(slugs: string[]): string {
  return slugs
    .map((s) => practitioners.find((p) => p.slug === s)?.name ?? s)
    .join(", ");
}

const elementColor: Record<string, string> = {
  fire: "#FF6B35", water: "#3DB8AF", air: "#9B7FD4", earth: "#5E8A6A", sound: "#D4AF3C",
};
const elementSymbol: Record<string, string> = {
  fire: "🔥", water: "💧", air: "🌬", earth: "🌿", sound: "✨",
};

export default function PrintSchedulePage() {
  return (
    <div className="print-page">
      {/* Screen-only controls */}
      <div className="print-controls no-print">
        <Link href="/#schedule" className="print-back-link">← Back to site</Link>
        <PrintButton />
        <Link href="/schedule/print/addons" className="print-back-link">
          Add-Ons &amp; Sauna →
        </Link>
      </div>

      {/* Document header */}
      <header className="print-header">
        <p className="print-eyebrow">4th Annual Healing Arts Gathering · Lion&apos;s Gate</p>
        <h1 className="print-title">Wellness Weekend</h1>
        <p className="print-subtitle">August 7–9, 2026 · Warrior Lodge · Sutton, Alaska</p>
        <p className="print-subtitle" style={{ fontSize: "0.8rem", opacity: 0.6, marginTop: "0.25rem" }}>
          wellnessweekendak.com · support@thesoundspace.us
        </p>
      </header>

      {/* Legend */}
      <div className="print-legend">
        {Object.entries(elementSymbol).map(([el, sym]) => (
          <span key={el} className="print-legend-item">
            {sym} {el.charAt(0).toUpperCase() + el.slice(1)}
          </span>
        ))}
        <span className="print-legend-item">⚑ Book ahead</span>
      </div>

      {/* Days */}
      {scheduleDays.map((day) => {
        const classes = day.events.filter(isClass);
        const timeGroups = groupByTime(classes);
        return (
          <section key={day.label} className="print-day">
            <div className="print-day-header">
              <h2 className="print-day-title">{day.label}</h2>
              <span className="print-day-theme">{day.headingText} · {day.theme}</span>
            </div>

            {timeGroups.map(({ time, events: evs }) => (
              <div key={time} className="print-time-block">
                <div className="print-tb-time">{time}</div>
                <div
                  className="print-tb-events"
                  style={{ gridTemplateColumns: `repeat(${evs.length}, 1fr)` }}
                >
                  {evs.map((e, i) => (
                    <div
                      key={i}
                      className="print-tb-event"
                      style={{ borderLeftColor: elementColor[e.element] }}
                    >
                      <div className="print-tb-name">
                        <span className="print-elem-sym">{elementSymbol[e.element]}</span>
                        {e.event}
                      </div>
                      <div className="print-tb-meta">
                        {e.location && <span>{e.location}</span>}
                        {e.hosts && e.hosts.length > 0 && (
                          <span>{e.location ? " · " : ""}{hostNames(e.hosts)}</span>
                        )}
                      </div>
                      {e.limited && (
                        <span className="print-badge-limited">⚑ Book ahead</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </section>
        );
      })}

      {/* Footer */}
      <footer className="print-footer">
        <p>Sauna by Solstice Saunas — see Add-Ons &amp; Sauna sheet for pricing · Cabin beds still available · wellnessweekendak.com/#store</p>
        <p style={{ marginTop: "0.25rem" }}>support@thesoundspace.us</p>
      </footer>
    </div>
  );
}
