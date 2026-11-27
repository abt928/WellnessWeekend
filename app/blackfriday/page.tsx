"use client";
import { useState, useEffect } from "react";
import Link from "next/link";


const C = {
  bg: "#0a0500",
  card: "rgba(255,255,255,0.04)",
  border: "rgba(255,255,255,0.08)",
  white: "#fff",
  dim: "rgba(255,255,255,0.65)",
  faint: "rgba(255,255,255,0.3)",
  gold: "#C9983F",
  goldLight: "#E8B85A",
  goldBorder: "rgba(201,152,63,0.4)",
  orange: "#FF6B35",
  sage: "#5E8A6A",
  teal: "#3DB8AF",
  violet: "#9B7FD4",
  error: "#ff8a72",
};

const SALE_END_UTC = new Date("2026-11-30T09:00:00Z");

function useCountdown(target: Date) {
  const [diff, setDiff] = useState(() => Math.max(0, target.getTime() - Date.now()));
  useEffect(() => {
    const id = setInterval(() => setDiff(Math.max(0, target.getTime() - Date.now())), 1000);
    return () => clearInterval(id);
  }, [target]);
  const h = Math.floor(diff / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);
  return { h, m, s, expired: diff === 0 };
}

const DEALS = [
  {
    key: "weekend",
    emoji: "🏕",
    title: "Weekend Pass",
    price: "$77",
    originalNote: "Full 3-day access",
    spots: 25,
    color: C.sage,
    colorBg: "rgba(94,138,106,0.1)",
    colorBorder: "rgba(94,138,106,0.4)",
    href: "/weekend-pass",
    cta: "Claim Weekend Pass →",
    includes: ["All workshops, ceremonies & healing arts", "Grounds camping · Warrior Lodge", "Live music & ecstatic dance", "Morning movement & breathwork"],
  },
  {
    key: "earth",
    emoji: "🌍",
    title: "Earth Pass",
    price: "$177",
    originalNote: "Full 3-day access",
    spots: 10,
    color: C.gold,
    colorBg: "rgba(201,152,63,0.1)",
    colorBorder: "rgba(201,152,63,0.4)",
    href: "/earth-pass",
    cta: "Claim Earth Pass →",
    includes: ["Full 3-day access — 2027", "All ceremonies, healing arts & sound", "On-site camping · Warrior Lodge", "Morning movement & breathwork"],
  },
  {
    key: "sanctuary-deposit",
    emoji: "✦",
    title: "Sanctuary Pass",
    price: "$250",
    originalNote: "deposit · full price TBD",
    spots: 10,
    color: C.violet,
    colorBg: "rgba(155,127,212,0.1)",
    colorBorder: "rgba(155,127,212,0.35)",
    href: "/deposit?pkg=sanctuary",
    cta: "Hold Sanctuary Pass →",
    includes: ["Priority ceremony & workshop access", "Exclusive Sanctuary-tier sessions", "Warrior Lodge camping", "Deposit applied to full price"],
  },
  {
    key: "recovery-deposit",
    emoji: "🌿",
    title: "Recovery Bundle",
    price: "$250",
    originalNote: "deposit · full price TBD",
    spots: 10,
    color: C.teal,
    colorBg: "rgba(61,184,175,0.1)",
    colorBorder: "rgba(61,184,175,0.35)",
    href: "/deposit?pkg=recovery",
    cta: "Hold Recovery Bundle →",
    includes: ["Lakeside sauna session", "60-min therapeutic massage", "Nervous system restoration", "Reserved 1-on-1 time slot"],
  },
];

function DealCard({ deal, remaining }: { deal: typeof DEALS[number]; remaining: number | undefined }) {
  const claimed = remaining !== undefined ? deal.spots - remaining : null;
  const isFull = remaining !== undefined && remaining <= 0;
  const isLow = remaining !== undefined && remaining > 0 && remaining <= 3;

  return (
    <div style={{
      background: deal.colorBg, border: `1px solid ${deal.colorBorder}`,
      borderRadius: "18px", padding: "1.75rem",
      display: "flex", flexDirection: "column",
      opacity: isFull ? 0.5 : 1,
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.9rem" }}>
        <div style={{ fontSize: "1.75rem" }}>{deal.emoji}</div>
        {isFull && (
          <span style={{ fontSize: "0.6rem", letterSpacing: "0.1em", textTransform: "uppercase", color: C.faint, border: `1px solid ${C.border}`, borderRadius: 20, padding: "0.2rem 0.6rem", fontWeight: 700 }}>
            Sold Out
          </span>
        )}
        {isLow && (
          <span style={{ fontSize: "0.6rem", letterSpacing: "0.1em", textTransform: "uppercase", color: C.orange, border: `1px solid rgba(255,107,53,0.35)`, borderRadius: 20, padding: "0.2rem 0.6rem", fontWeight: 700 }}>
            🔥 {remaining} left
          </span>
        )}
      </div>

      <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.25rem", color: C.white, marginBottom: "0.2rem", lineHeight: 1.2 }}>
        {deal.title}
      </h3>
      <div style={{ display: "flex", alignItems: "baseline", gap: "0.4rem", marginBottom: "1rem" }}>
        <span style={{ fontFamily: "var(--font-display)", fontSize: "2rem", fontWeight: 800, color: deal.color }}>
          {deal.price}
        </span>
        <span style={{ fontSize: "0.78rem", color: C.faint }}>{deal.originalNote}</span>
      </div>

      <ul style={{ listStyle: "none", padding: 0, margin: "0 0 1.25rem", display: "flex", flexDirection: "column", gap: "0.45rem", flex: 1 }}>
        {deal.includes.map(item => (
          <li key={item} style={{ fontSize: "0.82rem", color: C.dim, display: "flex", gap: "0.5rem", lineHeight: 1.4 }}>
            <span style={{ color: deal.color, flexShrink: 0 }}>✓</span>
            {item}
          </li>
        ))}
      </ul>

      {claimed !== null && (
        <div style={{ marginBottom: "1rem" }}>
          <div style={{ height: "3px", background: "rgba(255,255,255,0.08)", borderRadius: "2px", overflow: "hidden" }}>
            <div style={{
              height: "100%",
              width: `${Math.min((claimed / deal.spots) * 100, 100)}%`,
              background: isFull ? "rgba(255,255,255,0.15)" : `linear-gradient(90deg, ${deal.color}, ${C.goldLight})`,
              borderRadius: "2px",
            }} />
          </div>
          <p style={{ fontSize: "0.68rem", color: C.faint, marginTop: "0.35rem" }}>
            {claimed} of {deal.spots} claimed
          </p>
        </div>
      )}

      {isFull ? (
        <div style={{ textAlign: "center", padding: "0.75rem", borderRadius: "30px", border: `1px solid ${C.border}`, fontSize: "0.85rem", color: C.faint, fontWeight: 600 }}>
          Sold Out
        </div>
      ) : (
        <Link href={deal.href} style={{
          display: "block", textAlign: "center",
          padding: "0.8rem 1.25rem", borderRadius: "30px",
          background: `linear-gradient(135deg, ${deal.color}, ${C.gold})`,
          color: "#fff", fontSize: "0.9rem", fontWeight: 700,
          textDecoration: "none", letterSpacing: "0.03em",
        }}>
          {deal.cta}
        </Link>
      )}
    </div>
  );
}

function CountdownUnit({ value, label }: { value: number; label: string }) {
  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2rem, 6vw, 3.5rem)", fontWeight: 800, color: C.goldLight, lineHeight: 1 }}>
        {String(value).padStart(2, "0")}
      </div>
      <div style={{ fontSize: "0.58rem", letterSpacing: "0.14em", textTransform: "uppercase", color: C.faint, marginTop: "0.3rem" }}>{label}</div>
    </div>
  );
}

export default function BlackFridayPage() {
  const [remaining, setRemaining] = useState<Record<string, number>>({});
  const { h, m, s, expired } = useCountdown(SALE_END_UTC);

  useEffect(() => {
    const keys = ["weekend-pass", "earth-pass", "deposit?type=sanctuary", "deposit?type=recovery"];
    const labels = ["weekend", "earth", "sanctuary-deposit", "recovery-deposit"];
    Promise.all(
      keys.map((k, i) =>
        fetch(`/api/${k}`).then(r => r.json()).then(d => ({ key: labels[i], remaining: d.remaining ?? 0 }))
      )
    ).then(results => {
      const map: Record<string, number> = {};
      results.forEach(r => (map[r.key] = r.remaining));
      setRemaining(map);
    }).catch(() => {});
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: C.bg, color: C.white }}>
      {/* Background glows */}
      <div style={{
        position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0,
        background:
          "radial-gradient(ellipse at 20% 0%, rgba(201,152,63,0.18) 0%, transparent 50%)," +
          "radial-gradient(ellipse at 80% 100%, rgba(255,107,53,0.1) 0%, transparent 50%)",
      }} />

      <nav style={{ position: "relative", zIndex: 1, borderBottom: `1px solid ${C.border}`, padding: "0.9rem 1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Link href="/" style={{ fontSize: "0.82rem", color: C.faint, textDecoration: "none" }}>← Wellness Weekend</Link>
        <span style={{ fontSize: "0.6rem", letterSpacing: "0.14em", textTransform: "uppercase", color: C.gold, fontWeight: 700, background: "rgba(201,152,63,0.1)", border: `1px solid ${C.goldBorder}`, padding: "0.2rem 0.6rem", borderRadius: "20px" }}>
          Private · Black Friday
        </span>
      </nav>

      <main style={{ position: "relative", zIndex: 1, maxWidth: "960px", margin: "0 auto", padding: "4rem 1.5rem 7rem" }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>🖤</div>
          <p style={{ fontSize: "0.62rem", letterSpacing: "0.2em", textTransform: "uppercase", color: C.gold, fontWeight: 700, marginBottom: "0.75rem" }}>
            Black Friday 2027 · Wellness Weekend
          </p>
          <h1 style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(2.5rem, 7vw, 5rem)",
            fontWeight: 700, lineHeight: 1.05, marginBottom: "0.75rem",
            background: `linear-gradient(135deg, ${C.white} 20%, ${C.goldLight} 100%)`,
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          }}>
            You're in.
          </h1>
          <p style={{ fontSize: "1.05rem", color: C.dim, lineHeight: 1.75, maxWidth: "520px", margin: "0 auto 2rem" }}>
            Private Black Friday access — special pricing on 2027 passes before dates are even announced.
            All purchases are <strong style={{ color: C.white }}>refund eligible</strong> until the schedule drops.
          </p>

          {/* Countdown to sale end */}
          {!expired && (
            <div style={{ display: "inline-flex", flexDirection: "column", alignItems: "center", background: "rgba(201,152,63,0.07)", border: `1px solid ${C.goldBorder}`, borderRadius: "16px", padding: "1.25rem 2rem", marginBottom: "0.5rem" }}>
              <p style={{ fontSize: "0.6rem", letterSpacing: "0.16em", textTransform: "uppercase", color: C.faint, fontWeight: 700, marginBottom: "0.75rem" }}>
                Sale ends in
              </p>
              <div style={{ display: "flex", gap: "1.5rem", alignItems: "center" }}>
                <CountdownUnit value={h} label="Hours" />
                <span style={{ fontSize: "1.5rem", color: C.gold, marginBottom: "0.5rem" }}>:</span>
                <CountdownUnit value={m} label="Min" />
                <span style={{ fontSize: "1.5rem", color: C.gold, marginBottom: "0.5rem" }}>:</span>
                <CountdownUnit value={s} label="Sec" />
              </div>
            </div>
          )}
        </div>

        {/* Deal cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1.25rem", marginBottom: "3rem" }}>
          {DEALS.map(deal => (
            <DealCard key={deal.key} deal={deal} remaining={remaining[deal.key]} />
          ))}
        </div>

        {/* Fine print */}
        <div style={{ textAlign: "center", borderTop: `1px solid ${C.border}`, paddingTop: "2rem" }}>
          <p style={{ fontSize: "0.82rem", color: C.faint, lineHeight: 1.75, maxWidth: "560px", margin: "0 auto 1rem" }}>
            All Black Friday 2027 purchases are refund eligible — 2027 festival dates &amp; schedule are not yet announced.
            Spots are held for 24 hours after claiming; payment links sent within minutes.
          </p>
          <Link href="/refunds" style={{ fontSize: "0.78rem", color: C.faint, textDecoration: "underline" }}>
            View refund policy →
          </Link>
        </div>

      </main>
    </div>
  );
}
