"use client";
import { useState } from "react";
import { scheduleDays } from "@/lib/schedule-data";
import { practitioners } from "@/lib/practitioners";

const ELEM_COLOR: Record<string, string> = {
  fire: "#FF6B35",
  water: "#3DB8AF",
  air: "#9B7FD4",
  earth: "#5E8A6A",
  sound: "#C9983F",
};

const TABS = [
  { key: "schedule",    label: "Schedule" },
  { key: "teachers",   label: "Teachers" },
  { key: "music",      label: "Music" },
  { key: "experiences",label: "Experiences" },
] as const;

type Tab = typeof TABS[number]["key"];

function hostName(slug: string) {
  return practitioners.find((p) => p.slug === slug)?.name ?? slug;
}

const EXPERIENCES = [
  {
    emoji: "🔥",
    name: "Lakeside Sauna",
    provider: "Solstice Saunas",
    desc: "Contrast therapy on the shores of the lake — heat, cold plunge, and open sky. No reservation needed.",
    details: ["$22 · 1-hour session", "$45 · All day", "$99 · Full weekend pass"],
  },
  {
    emoji: "🤲",
    name: "Therapeutic Massage",
    provider: "Alaska Massage Band · Alice & Nalani",
    desc: "Solo sessions and the signature 4 Hands experience — two therapists working in synchronized flow. Book at the welcome tent.",
    details: ["60-min solo sessions", "4 Hands experience available", "Book at welcome tent"],
  },
  {
    emoji: "🌬",
    name: "Aerial Silk",
    provider: "Beth · Alaska Fly Dog",
    desc: "Guided intro sessions and solo hammock rentals during any sound offering, ecstatic dance, or live music set. Beginners welcome — max 6 per class.",
    details: ["Intro classes · 6 per session", "Solo rental · $20 / 30 min", "Multiple sessions all weekend"],
  },
  {
    emoji: "🏄",
    name: "Paddleboard Yoga",
    provider: "Alice Sullivan",
    desc: "All-levels flow on the lake — you might get wet! Family day on Sunday includes a dedicated Kids Paddleboard session.",
    details: ["Fri · Sat · Sun sessions", "Kids session · Sun 1:00 PM", "Limited spots per session"],
  },
  {
    emoji: "🔮",
    name: "Palmistry · Free Readings",
    provider: "La Galleria De Keown",
    desc: "Complimentary palm readings on Sunday — discover what the lines of your hands reveal.",
    details: ["Sunday only", "Free · Walk-in"],
  },
];

export default function ArchiveContent2026({ color }: { color: string }) {
  const [tab, setTab] = useState<Tab>("schedule");

  const teachers = practitioners.filter((p) => !p.isMusician);
  const musicians = practitioners.filter((p) => p.isMusician);

  return (
    <div style={{ marginTop: "1.5rem" }}>

      {/* ── Tab bar ── */}
      <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap", marginBottom: "1.5rem" }}>
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            style={{
              fontSize: "0.7rem",
              fontWeight: 700,
              letterSpacing: "0.07em",
              textTransform: "uppercase",
              color: tab === t.key ? color : "rgba(255,255,255,0.3)",
              background: tab === t.key ? `${color}18` : "transparent",
              border: `1px solid ${tab === t.key ? `${color}50` : "rgba(255,255,255,0.1)"}`,
              borderRadius: 20,
              padding: "0.3rem 0.85rem",
              cursor: "pointer",
              transition: "all 0.15s",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ── SCHEDULE ── */}
      {tab === "schedule" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem" }}>
          {scheduleDays.map((day) => (
            <div key={day.label}>
              {/* Day header */}
              <div style={{ marginBottom: "0.75rem" }}>
                <span style={{
                  fontFamily: "var(--font-display, serif)",
                  fontSize: "1.05rem",
                  color: color,
                  fontWeight: 600,
                }}>
                  {day.label}
                </span>
                <span style={{
                  display: "block",
                  fontSize: "0.65rem",
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.28)",
                  marginTop: "0.1rem",
                }}>
                  {day.headingText} · {day.theme}
                </span>
              </div>

              {/* Events */}
              <div style={{ display: "flex", flexDirection: "column" }}>
                {day.events.map((e, i) => (
                  <div
                    key={i}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "76px 1fr",
                      gap: "0.75rem",
                      padding: "0.55rem 0",
                      borderBottom: "1px solid rgba(255,255,255,0.05)",
                      alignItems: "start",
                    }}
                  >
                    <span style={{
                      fontSize: "0.7rem",
                      color: ELEM_COLOR[e.element],
                      fontWeight: 700,
                      paddingTop: "0.15rem",
                      flexShrink: 0,
                    }}>
                      {e.time}
                    </span>
                    <div>
                      <div style={{
                        fontSize: "0.85rem",
                        color: "rgba(255,255,255,0.82)",
                        fontWeight: 600,
                        lineHeight: 1.3,
                      }}>
                        {e.event}
                      </div>
                      <div style={{
                        fontSize: "0.72rem",
                        color: "rgba(255,255,255,0.32)",
                        marginTop: "0.15rem",
                        display: "flex",
                        gap: "0.3rem",
                        flexWrap: "wrap",
                      }}>
                        {e.location && <span>{e.location}</span>}
                        {e.hosts && e.hosts.length > 0 && (
                          <span>
                            {e.location ? "· " : ""}
                            {e.hosts.map(hostName).join(", ")}
                          </span>
                        )}
                        {e.limited && (
                          <span style={{ color: ELEM_COLOR.fire }}>· Limited</span>
                        )}
                        {e.fee && (
                          <span>· {e.fee}</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── TEACHERS ── */}
      {tab === "teachers" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {teachers.map((p) => (
            <div
              key={p.slug}
              style={{
                padding: "1rem 1.25rem",
                borderRadius: 12,
                background: "rgba(255,255,255,0.025)",
                border: "1px solid rgba(255,255,255,0.07)",
              }}
            >
              <div style={{ fontWeight: 700, fontSize: "0.9rem", color: "#fff", marginBottom: "0.1rem" }}>
                {p.name}
              </div>
              <div style={{
                fontSize: "0.68rem",
                fontWeight: 700,
                letterSpacing: "0.07em",
                textTransform: "uppercase",
                color: color,
                marginBottom: "0.35rem",
              }}>
                {p.offering}
              </div>
              {p.bio && (
                <div style={{
                  fontSize: "0.8rem",
                  color: "rgba(255,255,255,0.48)",
                  lineHeight: 1.7,
                }}>
                  {p.bio}
                </div>
              )}
              {p.website && (
                <a
                  href={p.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "inline-block",
                    marginTop: "0.5rem",
                    fontSize: "0.72rem",
                    color: color,
                    textDecoration: "none",
                    letterSpacing: "0.04em",
                  }}
                >
                  Website →
                </a>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ── MUSIC ── */}
      {tab === "music" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {musicians.map((p) => (
            <div
              key={p.slug}
              style={{
                padding: "1rem 1.25rem",
                borderRadius: 12,
                background: "rgba(255,255,255,0.025)",
                border: "1px solid rgba(255,255,255,0.07)",
              }}
            >
              <div style={{ fontWeight: 700, fontSize: "0.9rem", color: "#fff", marginBottom: "0.1rem" }}>
                {p.name}
              </div>
              <div style={{
                fontSize: "0.68rem",
                fontWeight: 700,
                letterSpacing: "0.07em",
                textTransform: "uppercase",
                color: color,
                marginBottom: "0.35rem",
              }}>
                {p.role}
              </div>
              {p.bio && (
                <div style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.48)", lineHeight: 1.7 }}>
                  {p.bio}
                </div>
              )}
              {p.website && (
                <a
                  href={p.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "inline-block",
                    marginTop: "0.5rem",
                    fontSize: "0.72rem",
                    color: color,
                    textDecoration: "none",
                    letterSpacing: "0.04em",
                  }}
                >
                  Website →
                </a>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ── EXPERIENCES ── */}
      {tab === "experiences" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {EXPERIENCES.map((exp) => (
            <div
              key={exp.name}
              style={{
                padding: "1rem 1.25rem",
                borderRadius: 12,
                background: "rgba(255,255,255,0.025)",
                border: "1px solid rgba(255,255,255,0.07)",
                display: "grid",
                gridTemplateColumns: "2rem 1fr",
                gap: "0.75rem",
                alignItems: "start",
              }}
            >
              <span style={{ fontSize: "1.35rem", lineHeight: 1.2 }}>{exp.emoji}</span>
              <div>
                <div style={{ fontWeight: 700, fontSize: "0.9rem", color: "#fff", marginBottom: "0.1rem" }}>
                  {exp.name}
                </div>
                <div style={{
                  fontSize: "0.68rem",
                  fontWeight: 700,
                  letterSpacing: "0.07em",
                  textTransform: "uppercase",
                  color: color,
                  marginBottom: "0.35rem",
                }}>
                  {exp.provider}
                </div>
                <div style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.48)", lineHeight: 1.65, marginBottom: "0.55rem" }}>
                  {exp.desc}
                </div>
                <div style={{ display: "flex", gap: "0.35rem", flexWrap: "wrap" }}>
                  {exp.details.map((d) => (
                    <span
                      key={d}
                      style={{
                        fontSize: "0.68rem",
                        color: "rgba(255,255,255,0.32)",
                        background: "rgba(255,255,255,0.05)",
                        border: "1px solid rgba(255,255,255,0.08)",
                        borderRadius: 20,
                        padding: "0.15rem 0.55rem",
                      }}
                    >
                      {d}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
