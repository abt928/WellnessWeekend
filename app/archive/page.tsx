import Link from "next/link";

export const metadata = {
  title: "Archive | Wellness Weekend",
  description: "Past years of Wellness Weekend — schedules, music lineups, and memories from 2023, 2024, and 2025.",
};

const YEARS = [
  {
    year: 2025,
    subtitle: "3rd Annual",
    theme: "Sound · Fire · Community",
    highlights: ["Coming soon"],
    color: "#9B7FD4",
    status: "coming-soon",
  },
  {
    year: 2024,
    subtitle: "2nd Annual",
    theme: "Earth · Water · Ceremony",
    highlights: ["Coming soon"],
    color: "#3DB8AF",
    status: "coming-soon",
  },
  {
    year: 2023,
    subtitle: "1st Annual",
    theme: "Where It All Began",
    highlights: ["Coming soon"],
    color: "#C9983F",
    status: "coming-soon",
  },
];

export default function ArchivePage() {
  return (
    <main style={{ background: "#0a0a14", color: "#fff", minHeight: "100vh" }}>

      {/* Header */}
      <div style={{
        background: "radial-gradient(ellipse at 50% 0%, rgba(139,95,191,0.3) 0%, transparent 60%), #0a0a14",
        padding: "5rem 1.5rem 4rem",
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
        <p style={{ color: "rgba(255,255,255,0.55)", fontSize: "1rem", lineHeight: 1.8, maxWidth: 480, margin: "0 auto" }}>
          Four years of gathering on this land. Past schedules, music lineups, and memories from every year.
        </p>
      </div>

      {/* Year cards */}
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "4rem 1.5rem", display: "grid", gap: "2rem" }}>
        {YEARS.map((y) => (
          <div key={y.year} style={{
            border: `1px solid ${y.color}30`,
            borderRadius: 20,
            overflow: "hidden",
            background: `radial-gradient(ellipse at 10% 50%, ${y.color}15 0%, transparent 60%), rgba(255,255,255,0.03)`,
          }}>
            {/* Photo placeholder */}
            <div style={{
              height: 280,
              background: `linear-gradient(135deg, ${y.color}20 0%, rgba(10,10,20,0.8) 100%)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
              borderBottom: `1px solid ${y.color}20`,
            }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontFamily: "var(--font-display, serif)", fontSize: "clamp(4rem, 12vw, 8rem)", color: `${y.color}40`, lineHeight: 1, userSelect: "none" }}>
                  {y.year}
                </div>
                <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.8rem", letterSpacing: "0.12em", textTransform: "uppercase", marginTop: "0.5rem" }}>
                  Photos coming soon
                </p>
              </div>
              <div style={{
                position: "absolute", top: "1rem", right: "1rem",
                background: "rgba(0,0,0,0.5)", border: `1px solid ${y.color}50`,
                borderRadius: 20, padding: "0.25rem 0.75rem",
                fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase",
                color: y.color,
              }}>
                {y.subtitle}
              </div>
            </div>

            {/* Card body */}
            <div style={{ padding: "1.75rem 2rem 2rem" }}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap", marginBottom: "1.25rem" }}>
                <div>
                  <h2 style={{ fontFamily: "var(--font-display, serif)", fontSize: "clamp(1.6rem, 4vw, 2.4rem)", marginBottom: "0.25rem" }}>
                    Wellness Weekend {y.year}
                  </h2>
                  <p style={{ color: y.color, fontSize: "0.82rem", letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 600 }}>
                    {y.theme}
                  </p>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "0.75rem" }}>
                {[
                  { label: "Schedule", icon: "📅" },
                  { label: "Music Lineup", icon: "🎵" },
                  { label: "Photo Gallery", icon: "📷" },
                  { label: "Highlights", icon: "✦" },
                ].map((item) => (
                  <div key={item.label} style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.07)",
                    borderRadius: 10,
                    padding: "0.85rem 1rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.6rem",
                    color: "rgba(255,255,255,0.35)",
                    fontSize: "0.85rem",
                  }}>
                    <span>{item.icon}</span>
                    <span>{item.label}</span>
                    <span style={{ marginLeft: "auto", fontSize: "0.65rem", letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(255,255,255,0.2)" }}>
                      Soon
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 2026 promo */}
      <div style={{ textAlign: "center", padding: "2rem 1.5rem 5rem", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.82rem", marginBottom: "1.25rem" }}>
          You&apos;re reading the archive — the next chapter is still being written.
        </p>
        <Link href="/" style={{
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
