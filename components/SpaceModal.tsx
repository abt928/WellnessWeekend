"use client";
import { useEffect, useRef } from "react";
import Image from "next/image";
import type { SacredSpace } from "@/lib/spaces";

export default function SpaceModal({ space, onClose }: { space: SacredSpace; onClose: () => void }) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      ref={overlayRef}
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
      style={{
        position: "fixed", inset: 0, zIndex: 9000,
        background: "rgba(5,5,15,0.75)",
        backdropFilter: "blur(6px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "1.5rem",
      }}
      role="dialog"
      aria-modal="true"
      aria-label={space.name}
    >
      <div style={{
        background: "linear-gradient(160deg, #12121f 0%, #1a1a2e 100%)",
        border: `1.5px solid ${space.elementColor}40`,
        borderRadius: 20,
        padding: "2rem 2.25rem",
        maxWidth: 480,
        width: "100%",
        position: "relative",
        boxShadow: `0 0 80px ${space.elementColor}20, 0 32px 64px rgba(0,0,0,0.6)`,
      }}>
        <button
          onClick={onClose}
          aria-label="Close"
          style={{
            position: "absolute", top: "1rem", right: "1rem",
            background: "rgba(255,255,255,0.08)", border: "none",
            color: "rgba(255,255,255,0.6)", fontSize: "0.9rem",
            width: 32, height: 32, borderRadius: "50%",
            cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >
          ✕
        </button>

        {/* Icon + element */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.25rem" }}>
          <span style={{ fontSize: "2rem" }}>{space.icon}</span>
          <span style={{
            fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase",
            color: space.elementColor, background: `${space.elementColor}18`,
            border: `1px solid ${space.elementColor}30`,
            padding: "0.2rem 0.65rem", borderRadius: 20,
          }}>
            {space.element}
          </span>
        </div>

        {space.photo && (
          <div style={{
            margin: "0 -2.25rem 1.5rem",
            position: "relative",
            height: 180,
            overflow: "hidden",
          }}>
            <Image
              src={space.photo}
              alt={space.name}
              fill
              style={{ objectFit: "cover", objectPosition: "center 40%" }}
            />
            <div style={{
              position: "absolute", inset: 0,
              background: `linear-gradient(to bottom, transparent 40%, #12121f 100%)`,
            }} />
          </div>
        )}

        <h2 style={{
          fontFamily: "var(--font-display, serif)",
          fontSize: "clamp(1.5rem, 4vw, 2rem)",
          color: "#fff",
          marginBottom: "0.4rem",
          lineHeight: 1.15,
        }}>
          {space.name}
        </h2>
        <p style={{
          fontSize: "0.85rem", fontStyle: "italic",
          color: space.elementColor, marginBottom: "1.25rem", lineHeight: 1.6,
        }}>
          {space.tagline}
        </p>
        <p style={{
          fontSize: "0.9rem", color: "rgba(255,255,255,0.68)",
          lineHeight: 1.8, marginBottom: "1.5rem",
        }}>
          {space.description}
        </p>

        {/* Offerings in this space */}
        <div style={{ borderTop: `1px solid ${space.elementColor}25`, paddingTop: "1.25rem" }}>
          <p style={{
            fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase",
            color: "rgba(255,255,255,0.35)", marginBottom: "0.6rem",
          }}>
            Held in this space
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
            {space.offerings.map((o) => (
              <span key={o} style={{
                fontSize: "0.75rem", color: "rgba(255,255,255,0.65)",
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 20, padding: "0.2rem 0.65rem",
              }}>
                {o}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
