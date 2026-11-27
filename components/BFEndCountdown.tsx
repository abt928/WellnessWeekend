"use client";
import { useState, useEffect } from "react";

const BF_END = new Date("2026-12-01T09:00:00Z");

function getLeft() {
  const diff = BF_END.getTime() - Date.now();
  if (diff <= 0) return null;
  const h = Math.floor(diff / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(h)}:${pad(m)}:${pad(s)}`;
}

export default function BFEndCountdown() {
  const [t, setT] = useState<string | null>(null);

  useEffect(() => {
    setT(getLeft());
    const id = setInterval(() => setT(getLeft()), 1000);
    return () => clearInterval(id);
  }, []);

  if (!t) return null;
  return (
    <span style={{ fontFamily: "monospace", fontWeight: 700, letterSpacing: "0.06em", color: "#C9983F" }}>
      {t}
    </span>
  );
}
