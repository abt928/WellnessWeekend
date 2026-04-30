"use client";
import { useEffect, useState } from "react";

const TARGET = new Date("2026-08-08T00:00:00-09:00").getTime();

export default function CountdownTimer() {
  const [diff, setDiff] = useState({ days: 0, hours: 0, mins: 0, secs: 0 });

  useEffect(() => {
    const tick = () => {
      const now = Date.now();
      const d = Math.max(0, TARGET - now);
      setDiff({
        days: Math.floor(d / 86400000),
        hours: Math.floor((d % 86400000) / 3600000),
        mins: Math.floor((d % 3600000) / 60000),
        secs: Math.floor((d % 60000) / 1000),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="countdown">
      {[
        { n: diff.days, l: "Days" },
        { n: diff.hours, l: "Hours" },
        { n: diff.mins, l: "Minutes" },
        { n: diff.secs, l: "Seconds" },
      ].map((item) => (
        <div className="countdown-item" key={item.l}>
          <span className="countdown-number" style={{ fontFamily: "var(--font-display)" }}>
            {String(item.n).padStart(2, "0")}
          </span>
          <span className="countdown-label">{item.l}</span>
        </div>
      ))}
    </div>
  );
}
