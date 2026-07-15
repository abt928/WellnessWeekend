import Link from "next/link";
import PrintButton from "@/components/PrintButton";
import { scheduleDays } from "@/lib/schedule-data";
import { practitioners } from "@/lib/practitioners";

export const metadata = {
  title: "Full Schedule",
  description: "Printable 3-day schedule for Wellness Weekend, August 7-9, 2026 · Sutton, Alaska",
  robots: { index: false, follow: true },
};

const elementSymbol: Record<string, string> = {
  fire: "🔥", water: "💧", air: "🌬", earth: "🌿",
};

function hostNames(slugs: string[]): string {
  return slugs
    .map((s) => practitioners.find((p) => p.slug === s)?.name ?? s)
    .join(" · ");
}

export default function PrintSchedulePage() {
  return (
    <div className="print-page">
      {/* Screen-only controls */}
      <div className="print-controls no-print">
        <Link href="/#schedule" className="print-back-link">← Back to site</Link>
        <PrintButton />
        <Link href="/schedule/print/addons" className="print-back-link">
          View Add-Ons →
        </Link>
      </div>

      {/* Document header */}
      <header className="print-header">
        <p className="print-eyebrow">4th Annual Healing Arts Gathering · Lion&apos;s Gate</p>
        <h1 className="print-title">Wellness Weekend</h1>
        <p className="print-subtitle">August 7-9, 2026 · Warrior Lodge · Sutton, Alaska</p>
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
        <span className="print-legend-item">$ Fee applies</span>
      </div>

      {/* Days */}
      {scheduleDays.map((day) => (
        <section key={day.label} className="print-day">
          <div className="print-day-header">
            <h2 className="print-day-title">{day.label}</h2>
            <span className="print-day-theme">{day.headingText} · {day.theme}</span>
          </div>

          <table className="print-table">
            <thead>
              <tr>
                <th style={{ width: "80px" }}>Time</th>
                <th style={{ width: "180px" }}>Event</th>
                <th style={{ width: "120px" }}>Location</th>
                <th>Host(s)</th>
                <th style={{ width: "60px" }}>Notes</th>
              </tr>
            </thead>
            <tbody>
              {day.events.map((e, i) => (
                <tr key={i} className={`print-row print-row-${e.element}`}>
                  <td className="print-time">{e.time}</td>
                  <td className="print-event-name">
                    <span className="print-elem-sym">{elementSymbol[e.element]}</span>
                    {e.secondElement && (
                      <span className="print-elem-sym">{elementSymbol[e.secondElement]}</span>
                    )}
                    {e.event}
                    {e.detail && <div className="print-detail">{e.detail}</div>}
                  </td>
                  <td className="print-location">{e.location ?? "-"}</td>
                  <td className="print-hosts">
                    {e.hosts && e.hosts.length > 0 ? hostNames(e.hosts) : "-"}
                  </td>
                  <td className="print-notes">
                    {e.limited && <span className="print-badge-limited">⚑ Book</span>}
                    {e.fee && <span className="print-badge-fee">$75</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      ))}

      {/* Footer */}
      <footer className="print-footer">
        <p>Contrast Therapy runs all day Fri-Sun in 30-min slots · Sauna max 4 people · Must be booked in advance · Facilitated by Ashleigh Bicknell</p>
        <p style={{ marginTop: "0.25rem" }}>Camping is sold out, cabin beds still available · wellnessweekendak.com/#store</p>
      </footer>
    </div>
  );
}
