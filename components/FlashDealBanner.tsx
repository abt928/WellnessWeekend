"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

const TOTAL = 10;

export default function FlashDealBanner() {
  const [remaining, setRemaining] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/earth-pass")
      .then((r) => r.json())
      .then((d) => setRemaining(d.remaining ?? 0))
      .catch(() => {/* silent */});
  }, []);

  const isFull = remaining !== null && remaining <= 0;
  const claimed = remaining !== null ? TOTAL - remaining : null;

  return (
    <div style={{
      background: "linear-gradient(135deg, #1a3a1f 0%, #0f2a12 60%, #1a2e0a 100%)",
      borderBottom: "1px solid rgba(94,138,106,0.25)",
      padding: "1.1rem 1.5rem",
      textAlign: "center",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* subtle glow */}
      <div style={{
        position: "absolute", inset: 0,
        background: "radial-gradient(ellipse at 50% 0%, rgba(94,138,106,0.18) 0%, transparent 65%)",
        pointerEvents: "none",
      }} />

      <div style={{ position: "relative", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "center", gap: "0.75rem 1.5rem" }}>
        {/* Label */}
        <span style={{ fontSize: "0.65rem", letterSpacing: "0.16em", textTransform: "uppercase", color: "rgba(255,255,255,0.55)", fontWeight: 700, flexShrink: 0 }}>
          ⚡ Flash Deal
        </span>

        {/* Name + price */}
        <span style={{ color: "#fff", fontSize: "0.95rem", fontWeight: 700, letterSpacing: "0.01em" }}>
          Earth Pass{" "}
          <span style={{ color: "#8fcc9a", fontFamily: "var(--font-display)" }}>$299</span>
          <span style={{ color: "rgba(255,255,255,0.5)", fontWeight: 400, fontSize: "0.82rem" }}> · Full 3-Day Weekend</span>
        </span>

        {/* Spots counter */}
        {remaining !== null && (
          <span style={{
            fontSize: "0.75rem", fontWeight: 600,
            color: isFull ? "rgba(255,255,255,0.35)" : remaining <= 3 ? "#ff8a72" : "rgba(255,255,255,0.65)",
          }}>
            {isFull
              ? "Sold out"
              : claimed !== null
                ? `${remaining} of ${TOTAL} remaining`
                : ""}
          </span>
        )}

        {/* CTA */}
        {!isFull && (
          <Link href="/earth-pass" style={{
            display: "inline-block",
            background: "rgba(94,138,106,0.85)",
            color: "#fff",
            fontWeight: 700,
            fontSize: "0.8rem",
            padding: "0.45rem 1.1rem",
            borderRadius: 30,
            textDecoration: "none",
            letterSpacing: "0.03em",
            border: "1px solid rgba(94,138,106,0.5)",
            flexShrink: 0,
          }}>
            Claim Now →
          </Link>
        )}
      </div>
    </div>
  );
}
