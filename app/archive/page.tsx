import Link from "next/link";
import Image from "next/image";
import Gallery from "@/components/Gallery";
import ShareStoryForm from "./ShareStoryForm";
import ScheduleViewer2023 from "./ScheduleViewer2023";

export const metadata = {
  title: "Archive | Wellness Weekend",
  description: "Our story through the years — past schedules, music, and memories from every Wellness Weekend gathering since 2023.",
};

const YEARS = [
  {
    year: 2025,
    subtitle: "3rd Annual",
    theme: "Sound · Fire · Community",
    color: "#9B7FD4",
    story: "The third year brought more voices, more ceremony, and deeper roots. A community that was finding its shape in 2024 now knew itself. The land remembered everyone who returned.",
    hasSchedule: false,
  },
  {
    year: 2024,
    subtitle: "2nd Annual",
    theme: "Earth · Water · Ceremony",
    color: "#3DB8AF",
    story: "Year two was where the container deepened. Teachers came back. First-timers became regulars. The labyrinth walked more feet. The fire burned longer.",
    hasSchedule: false,
  },
  {
    year: 2023,
    subtitle: "1st Annual",
    theme: "Where It All Began",
    color: "#C9983F",
    story: "A small circle of healers gathered on the land in Sutton for the first time. Nobody knew what it would become. The fire was lit. The water was still. Something began.",
    hasSchedule: true,
  },
];

export default function ArchivePage() {
  return (
    <main style={{ background: "#0a0a14", color: "#fff", minHeight: "100vh" }}>

      {/* Header */}
      <div style={{
        background: "radial-gradient(ellipse at 50% 0%, rgba(139,95,191,0.3) 0%, transparent 60%), #0a0a14",
        padding: "5rem 1.5rem 3.5rem",
        textAlign: "center",
        borderBottom: "1px solid rgba(255,255,255,0.07)",
      }}>
        <Link href="/" style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.78rem", letterSpacing: "0.1em", textTransform: "uppercase", textDecoration: "none" }}>
          ← Wellness Weekend
        </Link>
        <p style={{ fontSize: "0.7rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--gold, #C9983F)", fontWeight: 600, marginTop: "2rem", marginBottom: "0.75rem" }}>
          Est. 2023 · Sutton, Alaska
        </p>
        <h1 style={{ fontFamily: "var(--font-display, serif)", fontSize: "clamp(2.4rem, 7vw, 5rem)", lineHeight: 1.05, marginBottom: "1rem" }}>
          The Archive
        </h1>
      </div>

      {/* Our Story Through the Years */}
      <section style={{ maxWidth: 820, margin: "0 auto", padding: "4rem 1.5rem 0" }}>
        <p style={{ fontSize: "0.7rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", fontWeight: 600, marginBottom: "1rem" }}>
          Our Story
        </p>
        <h2 style={{ fontFamily: "var(--font-display, serif)", fontSize: "clamp(1.8rem, 5vw, 3.2rem)", marginBottom: "1.5rem", lineHeight: 1.15 }}>
          Our story<br />through the years.
        </h2>
        <div style={{ display: "grid", gap: "1.1rem", fontSize: "1rem", lineHeight: 1.85, color: "rgba(255,255,255,0.68)", maxWidth: 680 }}>
          <p>
            What began with a small circle of healers in the summer of 2023 has become one of Alaska&apos;s most quietly powerful gatherings. Not a festival. A gathering. A living thread of ceremony, sound, and shared presence.
          </p>
          <p>
            Each year the community returns — different faces, deepening roots. Teachers who came as students. First-timers who drove through the night to make it. Families who camp together every August and leave changed in ways they&apos;re still discovering.
          </p>
          <p>
            The land holds the memory of every circle we&apos;ve sat in, every fire we&apos;ve lit, every healing that has happened here. These pages are for the moments we want to carry forward — and for those who were there and want to share what it meant to them.
          </p>
        </div>
      </section>

      {/* Year cards */}
      <section style={{ maxWidth: 820, margin: "0 auto", padding: "3.5rem 1.5rem", display: "grid", gap: "1.25rem" }}>
        {YEARS.map((y) => (
          <div key={y.year} style={{
            border: `1px solid ${y.color}30`,
            borderRadius: 18,
            overflow: "hidden",
            background: `radial-gradient(ellipse at 10% 50%, ${y.color}12 0%, transparent 55%), rgba(255,255,255,0.03)`,
            display: "grid",
            gridTemplateColumns: "auto 1fr",
            gap: 0,
          }}>
            {/* Year accent */}
            <div style={{
              width: 6,
              background: `linear-gradient(180deg, ${y.color} 0%, ${y.color}40 100%)`,
            }} />

            <div style={{ padding: "1.75rem 2rem" }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: "0.75rem", marginBottom: "0.4rem", flexWrap: "wrap" }}>
                <span style={{ fontFamily: "var(--font-display, serif)", fontSize: "clamp(1.8rem, 5vw, 2.8rem)", lineHeight: 1, color: y.color }}>
                  {y.year}
                </span>
                <span style={{
                  fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase",
                  color: y.color, background: `${y.color}15`,
                  border: `1px solid ${y.color}30`, padding: "0.2rem 0.6rem", borderRadius: 20,
                }}>
                  {y.subtitle}
                </span>
              </div>
              <p style={{ fontSize: "0.75rem", color: y.color, letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 600, marginBottom: "0.6rem" }}>
                {y.theme}
              </p>
              <p style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.6)", lineHeight: 1.7, margin: 0 }}>
                {y.story}
              </p>

              {y.hasSchedule ? (
                <div style={{ marginTop: "1.25rem" }}>
                  <ScheduleViewer2023 color={y.color} />
                </div>
              ) : (
                <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginTop: "1.1rem" }}>
                  {["Schedule", "Music", "Gallery", "Highlights"].map((item) => (
                    <span key={item} style={{
                      fontSize: "0.72rem", color: "rgba(255,255,255,0.28)",
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.07)",
                      borderRadius: 20, padding: "0.2rem 0.6rem",
                    }}>
                      {item} · coming soon
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </section>

      {/* Gallery */}
      <section style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "1rem" }}>
        <div style={{ maxWidth: 820, margin: "0 auto", padding: "2rem 1.5rem 0.5rem" }}>
          <p style={{ fontSize: "0.7rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", fontWeight: 600, marginBottom: "0.5rem" }}>
            Moments in Time
          </p>
          <h2 style={{ fontFamily: "var(--font-display, serif)", fontSize: "clamp(1.6rem, 4vw, 2.8rem)", marginBottom: "0.5rem" }}>
            The Memories.
          </h2>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.9rem", lineHeight: 1.7, maxWidth: 540, marginBottom: "1rem" }}>
            Real moments from 2023, 2024, and 2025 — the joy, connection, and healing that unfolds every August under the midnight sun. Click any photo to open it.
          </p>
        </div>
        <Gallery />
      </section>

      {/* Share Your Story */}
      <section id="share" style={{
        background: "radial-gradient(ellipse at 50% 0%, rgba(201,152,63,0.12) 0%, transparent 60%), rgba(255,255,255,0.02)",
        borderTop: "1px solid rgba(255,255,255,0.07)",
        padding: "5rem 1.5rem",
      }}>
        <div style={{ maxWidth: 600, margin: "0 auto" }}>
          <p style={{ fontSize: "0.7rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--gold, #C9983F)", fontWeight: 600, marginBottom: "0.75rem", textAlign: "center" }}>
            Community
          </p>
          <h2 style={{ fontFamily: "var(--font-display, serif)", fontSize: "clamp(1.8rem, 5vw, 3rem)", textAlign: "center", marginBottom: "0.75rem", lineHeight: 1.1 }}>
            Share Your Story
          </h2>
          <p style={{ color: "rgba(255,255,255,0.55)", fontSize: "0.95rem", lineHeight: 1.8, textAlign: "center", marginBottom: "2.5rem" }}>
            If you&apos;ve joined us before, we would love to hear what it meant to you. Photos and videos welcome — send them to{" "}
            <a href="mailto:support@thesoundspace.us" style={{ color: "var(--gold, #C9983F)", textDecoration: "none" }}>
              support@thesoundspace.us
            </a>{" "}
            with your name and year attended.
          </p>
          <ShareStoryForm />
        </div>
      </section>

      {/* Back / 2026 CTA */}
      <div style={{ textAlign: "center", padding: "3rem 1.5rem 5rem", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.82rem", marginBottom: "1.25rem" }}>
          The next chapter is being written now.
        </p>
        <Link href="/#store" style={{
          display: "inline-block",
          background: "var(--gold, #C9983F)", color: "#fff",
          fontWeight: 700, fontSize: "0.95rem",
          padding: "0.75rem 2rem", borderRadius: 30, textDecoration: "none",
        }}>
          Join Us in 2026 →
        </Link>
      </div>

    </main>
  );
}
