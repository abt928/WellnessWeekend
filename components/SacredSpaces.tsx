"use client";
import { useState } from "react";
import { SPACES, type SacredSpace } from "@/lib/spaces";
import SpaceModal from "@/components/SpaceModal";

const SPACE_ORDER = ["Lakeside", "Bonfire", "Main Stage", "Labyrinth Garden", "Aerial Rig"];

export default function SacredSpaces() {
  const [selected, setSelected] = useState<SacredSpace | null>(null);

  return (
    <>
      <section id="sacred-spaces" style={{
        background: "linear-gradient(180deg, #0d0d1a 0%, #10101e 100%)",
        padding: "4rem 1.5rem",
        borderTop: "1px solid rgba(255,255,255,0.06)",
      }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <p style={{ fontSize: "0.7rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", fontWeight: 600, marginBottom: "0.6rem", textAlign: "center" }}>
            Warrior Lodge · Sutton, Alaska
          </p>
          <h2 style={{ fontFamily: "var(--font-display, serif)", fontSize: "clamp(1.8rem, 5vw, 3.2rem)", color: "#fff", textAlign: "center", marginBottom: "0.6rem" }}>
            The Sacred Spaces.
          </h2>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.95rem", lineHeight: 1.75, textAlign: "center", maxWidth: 520, margin: "0 auto 2.5rem" }}>
            Five distinct ceremonial environments — each with its own energy, its own medicine. Tap any space to feel into it.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "0.85rem" }}>
            {SPACE_ORDER.map((key) => {
              const space = SPACES[key];
              return (
                <button
                  key={key}
                  onClick={() => setSelected(space)}
                  style={{
                    background: `radial-gradient(ellipse at 30% 30%, ${space.elementColor}18 0%, rgba(255,255,255,0.03) 70%)`,
                    border: `1.5px solid ${space.elementColor}30`,
                    borderRadius: 16,
                    padding: "1.5rem 1.25rem",
                    cursor: "pointer",
                    textAlign: "left",
                    color: "#fff",
                    transition: "transform 0.18s ease, border-color 0.18s ease, box-shadow 0.18s ease",
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.5rem",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.transform = "translateY(-3px)";
                    (e.currentTarget as HTMLElement).style.borderColor = `${space.elementColor}70`;
                    (e.currentTarget as HTMLElement).style.boxShadow = `0 8px 28px ${space.elementColor}20`;
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.transform = "";
                    (e.currentTarget as HTMLElement).style.borderColor = `${space.elementColor}30`;
                    (e.currentTarget as HTMLElement).style.boxShadow = "";
                  }}
                >
                  <span style={{ fontSize: "1.75rem" }}>{space.icon}</span>
                  <strong style={{ fontSize: "0.95rem", display: "block", lineHeight: 1.25 }}>{space.name}</strong>
                  <span style={{ fontSize: "0.68rem", color: space.elementColor, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}>
                    {space.element}
                  </span>
                  <p style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.45)", lineHeight: 1.6, margin: 0 }}>
                    {space.tagline}
                  </p>
                  <span style={{ fontSize: "0.72rem", color: space.elementColor, marginTop: "auto", paddingTop: "0.25rem" }}>
                    Explore →
                  </span>
                </button>
              );
            })}
          </div>

          {/* Labyrinth callout */}
          <div style={{
            marginTop: "1.75rem",
            background: "rgba(94,138,106,0.1)",
            border: "1px solid rgba(94,138,106,0.3)",
            borderRadius: 12,
            padding: "1rem 1.25rem",
            display: "flex",
            gap: "0.75rem",
            alignItems: "flex-start",
          }}>
            <span style={{ fontSize: "1.2rem", flexShrink: 0 }}>🌀</span>
            <p style={{ fontSize: "0.84rem", color: "rgba(255,255,255,0.6)", lineHeight: 1.7, margin: 0 }}>
              <strong style={{ color: "#5E8A6A" }}>The Labyrinth Garden is open all weekend</strong> for silent walking, integration, and reflection between ceremonies.
              On Sunday at 11:11 AM, the{" "}
              <em>Message from the Bees</em> ecstatic dance activates the garden&apos;s portal — one of the most sacred moments of Wellness Weekend.
            </p>
          </div>
        </div>
      </section>

      {selected && <SpaceModal space={selected} onClose={() => setSelected(null)} />}
    </>
  );
}
