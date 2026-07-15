"use client";
import { useEffect, useState } from "react";

// Alaska observes daylight time (AKDT, UTC-8) in August, so local midnight Aug 7 is 08:00Z.
const TARGET = new Date("2026-08-07T00:00:00-08:00").getTime();

export default function CountdownTimer() {
  const [diff, setDiff] = useState<{ days: number; hours: number } | null>(null);

  useEffect(() => {
    const tick = () => {
      const now = Date.now();
      const d = Math.max(0, TARGET - now);
      setDiff({
        days: Math.floor(d / 86400000),
        hours: Math.floor((d % 86400000) / 3600000),
      });
    };
    tick();
    // Mins/hours resolution is enough — no per-second ticking competing for attention.
    const id = setInterval(tick, 60000);
    return () => clearInterval(id);
  }, []);

  if (!diff) return <div className="countdown-line" aria-hidden="true" style={{ visibility: "hidden" }}>&nbsp;</div>;

  return (
    <div className="countdown-line" role="timer" aria-label={`${diff.days} days and ${diff.hours} hours until the event`}>
      <span className="countdown-line-num">{diff.days}</span>
      <span className="countdown-line-label">days</span>
      <span className="countdown-line-sep">·</span>
      <span className="countdown-line-num">{diff.hours}</span>
      <span className="countdown-line-label">hours away</span>
    </div>
  );
}
