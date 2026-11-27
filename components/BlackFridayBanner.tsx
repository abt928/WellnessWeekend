"use client";
import { useState, useEffect } from "react";

const SALE_START_UTC = new Date("2026-11-27T09:00:00Z"); // midnight AKST (UTC-9)
const SALE_END_UTC = new Date("2026-12-01T09:00:00Z");   // midnight AKST Monday Dec 1

function getTimeLeft(target: Date) {
  const diff = target.getTime() - Date.now();
  if (diff <= 0) return null;
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const mins = Math.floor((diff % 3600000) / 60000);
  const secs = Math.floor((diff % 60000) / 1000);
  return { days, hours, mins, secs };
}

export default function BlackFridayBanner() {
  const [now, setNow] = useState<Date | null>(null);
  const [timeLeft, setTimeLeft] = useState<ReturnType<typeof getTimeLeft>>(null);
  const [email, setEmail] = useState("");
  const [subStatus, setSubStatus] = useState<"idle" | "sending" | "done">("idle");

  useEffect(() => {
    const update = () => {
      const n = new Date();
      setNow(n);
      setTimeLeft(getTimeLeft(SALE_START_UTC));
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  if (!now) return null;

  const saleActive = now >= SALE_START_UTC && now < SALE_END_UTC;
  const saleEnded = now >= SALE_END_UTC;
  if (saleEnded) return null;

  async function handleSubscribe(e: React.FormEvent) {
    e.preventDefault();
    setSubStatus("sending");
    try {
      await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setSubStatus("done");
    } catch {
      setSubStatus("idle");
    }
  }

  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <div
      style={{
        background: "linear-gradient(135deg, #1a0a00 0%, #2d1200 40%, #1a0a00 100%)",
        borderBottom: "1px solid rgba(201,152,63,0.25)",
        padding: "0",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* Gold shimmer line at top */}
      <div style={{
        position: "absolute",
        top: 0, left: 0, right: 0, height: "2px",
        background: "linear-gradient(90deg, transparent, #C9983F 30%, #FF6B35 50%, #C9983F 70%, transparent)",
      }} />

      <div style={{
        maxWidth: "900px",
        margin: "0 auto",
        padding: "1.5rem 1.5rem",
        display: "flex",
        flexWrap: "wrap",
        gap: "1.5rem",
        alignItems: "center",
        justifyContent: "space-between",
      }}>
        {/* Left: Label + headline */}
        <div style={{ flex: "1 1 220px", minWidth: 0 }}>
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.4rem",
            background: "rgba(201,152,63,0.15)",
            border: "1px solid rgba(201,152,63,0.35)",
            borderRadius: "20px",
            padding: "0.2rem 0.75rem",
            marginBottom: "0.6rem",
          }}>
            <span style={{ fontSize: "0.6rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "#C9983F", fontWeight: 700 }}>
              {saleActive ? "● Live Now" : "Black Friday"}
            </span>
          </div>
          <h2 style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(1.1rem, 3vw, 1.5rem)",
            color: "#fff",
            lineHeight: 1.2,
            marginBottom: "0.3rem",
            fontWeight: 700,
          }}>
            {saleActive
              ? "2027 Tickets Are Live."
              : "2027 Tickets Drop Black Friday."}
          </h2>
          <p style={{
            fontSize: "0.82rem",
            color: "rgba(255,255,255,0.45)",
            lineHeight: 1.5,
            margin: 0,
          }}>
            {saleActive
              ? "Exclusive Black Friday pricing on all 2027 passes. Ends Monday, December 1."
              : "Exclusive flat-rate pricing for 4 days only. Be ready at midnight Nov 27."}
          </p>
        </div>

        {/* Middle: Countdown or CTA */}
        {!saleActive ? (
          <div style={{
            display: "flex",
            gap: "0.75rem",
            alignItems: "center",
            justifyContent: "center",
            flex: "0 0 auto",
          }}>
            {timeLeft && [
              { val: timeLeft.days, label: "Days" },
              { val: timeLeft.hours, label: "Hrs" },
              { val: timeLeft.mins, label: "Min" },
              { val: timeLeft.secs, label: "Sec" },
            ].map(({ val, label }, i) => (
              <span key={label} style={{ display: "flex", alignItems: "center", gap: i < 3 ? "0.75rem" : 0 }}>
                <span style={{ textAlign: "center" }}>
                  <span style={{
                    display: "block",
                    fontFamily: "var(--font-display)",
                    fontSize: "clamp(1.5rem, 4vw, 2.2rem)",
                    fontWeight: 800,
                    color: "#C9983F",
                    lineHeight: 1,
                    minWidth: "2.2ch",
                  }}>
                    {pad(val)}
                  </span>
                  <span style={{ fontSize: "0.55rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", fontWeight: 600 }}>
                    {label}
                  </span>
                </span>
                {i < 3 && <span style={{ color: "rgba(201,152,63,0.4)", fontSize: "1.5rem", fontWeight: 300, alignSelf: "flex-start", marginTop: "2px" }}>:</span>}
              </span>
            ))}
          </div>
        ) : (
          <a
            href="#packages"
            style={{
              display: "inline-block",
              padding: "0.75rem 1.75rem",
              background: "linear-gradient(135deg, #C9983F, #FF6B35)",
              color: "#fff",
              fontWeight: 700,
              fontSize: "0.9rem",
              borderRadius: "30px",
              textDecoration: "none",
              letterSpacing: "0.03em",
              whiteSpace: "nowrap",
            }}
          >
            Shop Black Friday Passes →
          </a>
        )}

        {/* Right: Email capture (pre-sale only) */}
        {!saleActive && (
          <div style={{ flex: "1 1 240px", minWidth: 0 }}>
            {subStatus === "done" ? (
              <div style={{
                fontSize: "0.82rem",
                color: "#C9983F",
                fontWeight: 600,
                padding: "0.75rem 1.25rem",
                background: "rgba(201,152,63,0.1)",
                border: "1px solid rgba(201,152,63,0.25)",
                borderRadius: "30px",
                textAlign: "center",
              }}>
                ✦ You&apos;re on the list — see you midnight Nov 27.
              </div>
            ) : (
              <form onSubmit={handleSubscribe} style={{ display: "flex", gap: "0.4rem" }}>
                <input
                  type="email"
                  required
                  placeholder="Get early access email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  style={{
                    flex: 1,
                    padding: "0.7rem 1rem",
                    borderRadius: "30px",
                    border: "1px solid rgba(201,152,63,0.3)",
                    background: "rgba(255,255,255,0.06)",
                    color: "#fff",
                    fontSize: "0.82rem",
                    outline: "none",
                    minWidth: 0,
                  }}
                />
                <button
                  type="submit"
                  disabled={subStatus === "sending"}
                  style={{
                    padding: "0.7rem 1.1rem",
                    borderRadius: "30px",
                    border: "none",
                    background: "#C9983F",
                    color: "#fff",
                    fontWeight: 700,
                    fontSize: "0.78rem",
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                    letterSpacing: "0.03em",
                    flexShrink: 0,
                    opacity: subStatus === "sending" ? 0.6 : 1,
                  }}
                >
                  Remind Me
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
