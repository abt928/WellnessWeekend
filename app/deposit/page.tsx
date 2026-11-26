"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

const C = {
  bg: "#F7F3EC",
  card: "#FBF9F4",
  charcoal: "#333533",
  muted: "rgba(51,53,51,0.6)",
  faint: "rgba(51,53,51,0.38)",
  gold: "#C9983F",
  goldBorder: "rgba(201,152,63,0.35)",
  orange: "#FF6B35",
  border: "rgba(51,53,51,0.12)",
  violet: "#8B5FBF",
  teal: "#3DB8AF",
  error: "#B84A2B",
  errorBg: "rgba(184,74,43,0.07)",
};

const PACKAGES = [
  {
    key: "sanctuary",
    label: "Sanctuary Pass",
    emoji: "✦",
    color: C.violet,
    colorBg: "rgba(139,95,191,0.07)",
    colorBorder: "rgba(139,95,191,0.3)",
    description: "The full curated experience — priority access to ceremonies, workshops, and intimate sessions.",
    includes: [
      "Full 3-day weekend pass",
      "Priority access to all ceremonies & workshops",
      "Exclusive Sanctuary-tier sessions",
      "Warrior Lodge camping",
      "Morning movement & breathwork",
    ],
  },
  {
    key: "recovery",
    label: "Recovery Bundle",
    emoji: "🌿",
    color: C.teal,
    colorBg: "rgba(61,184,175,0.07)",
    colorBorder: "rgba(61,184,175,0.3)",
    description: "Add a sauna session and 60-minute therapeutic massage to any weekend pass.",
    includes: [
      "Lakeside sauna session",
      "60-min therapeutic massage",
      "Reserved 1-on-1 time slot",
      "Nervous system restoration",
      "Add to any weekend pass",
    ],
  },
];

export default function DepositPage() {
  const [selected, setSelected] = useState<"sanctuary" | "recovery">("sanctuary");
  const [remaining, setRemaining] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    Promise.all(
      PACKAGES.map(p =>
        fetch(`/api/deposit?type=${p.key}`).then(r => r.json()).then(d => ({ key: p.key, remaining: d.remaining ?? 0 }))
      )
    ).then(results => {
      const map: Record<string, number> = {};
      results.forEach(r => (map[r.key] = r.remaining));
      setRemaining(map);
    }).catch(() => {});
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/deposit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, packageType: selected }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong. Please try again.");
      } else {
        setRemaining(prev => ({ ...prev, [selected]: data.remaining }));
        setSubmitted(true);
      }
    } catch {
      setError("Unable to submit. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const activePkg = PACKAGES.find(p => p.key === selected)!;
  const activeRemaining = remaining[selected];
  const isFull = activeRemaining !== null && activeRemaining !== undefined && activeRemaining <= 0;

  return (
    <>
      <nav style={{ background: C.bg, borderBottom: `1px solid ${C.border}`, padding: "0.9rem 1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Link href="/" style={{ fontSize: "0.85rem", color: C.muted, textDecoration: "none" }}>
          ← Back to Wellness Weekend
        </Link>
        <span style={{ fontSize: "0.62rem", letterSpacing: "0.14em", textTransform: "uppercase", color: C.gold, fontWeight: 700 }}>
          Black Friday · $250 Deposit
        </span>
      </nav>

      <main style={{ minHeight: "100vh", background: C.bg, padding: "3rem 1.5rem 6rem" }}>
        <div style={{ maxWidth: "620px", margin: "0 auto" }}>

          <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
            <p style={{ fontSize: "0.68rem", letterSpacing: "0.14em", textTransform: "uppercase", color: C.gold, marginBottom: "0.6rem", fontWeight: 600 }}>
              Black Friday · Hold Your Package
            </p>
            <h1 style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2rem, 5vw, 3.2rem)",
              fontWeight: 700, lineHeight: 1.1, marginBottom: "0.75rem", color: C.charcoal,
            }}>
              Reserve with a $250 Deposit
            </h1>
            <p style={{ fontSize: "1rem", lineHeight: 1.75, color: C.muted, maxWidth: "480px", margin: "0 auto" }}>
              Lock in your package now. The $250 deposit holds your spot — full pricing announced with the 2027 dates.
            </p>
          </div>

          {/* Package selector */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "2rem" }}>
            {PACKAGES.map(pkg => {
              const rem = remaining[pkg.key];
              const full = rem !== undefined && rem <= 0;
              const isSelected = selected === pkg.key;
              return (
                <button
                  key={pkg.key}
                  type="button"
                  onClick={() => !full && setSelected(pkg.key as "sanctuary" | "recovery")}
                  disabled={full}
                  style={{
                    background: isSelected ? pkg.colorBg : C.card,
                    border: isSelected ? `2px solid ${pkg.color}` : `1px solid ${C.border}`,
                    borderRadius: "14px",
                    padding: "1.25rem",
                    textAlign: "left",
                    cursor: full ? "not-allowed" : "pointer",
                    opacity: full ? 0.5 : 1,
                    transition: "all 0.15s",
                    boxShadow: isSelected ? `0 0 0 3px ${pkg.color}18` : "none",
                  }}
                >
                  <div style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>{pkg.emoji}</div>
                  <p style={{ fontSize: "0.9rem", fontWeight: 700, color: isSelected ? pkg.color : C.charcoal, marginBottom: "0.2rem" }}>
                    {pkg.label}
                  </p>
                  <p style={{ fontSize: "0.78rem", color: C.muted, lineHeight: 1.4, marginBottom: "0.5rem" }}>
                    {pkg.description}
                  </p>
                  {rem !== undefined && (
                    <p style={{ fontSize: "0.68rem", color: full ? C.faint : pkg.color, fontWeight: 600 }}>
                      {full ? "Fully reserved" : `${rem} spots left`}
                    </p>
                  )}
                </button>
              );
            })}
          </div>

          {/* Selected package includes */}
          <div style={{ background: C.card, border: `1px solid ${activePkg.colorBorder}`, borderRadius: "12px", padding: "1.25rem 1.5rem", marginBottom: "1.5rem" }}>
            <p style={{ fontSize: "0.65rem", letterSpacing: "0.12em", textTransform: "uppercase", color: activePkg.color, fontWeight: 700, marginBottom: "0.75rem" }}>
              {activePkg.label} · What&apos;s Included
            </p>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {activePkg.includes.map(item => (
                <li key={item} style={{ fontSize: "0.88rem", color: C.charcoal, display: "flex", gap: "0.5rem", lineHeight: 1.4 }}>
                  <span style={{ color: activePkg.color, flexShrink: 0, fontWeight: 700 }}>✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Deposit note */}
          <div style={{ background: "rgba(201,152,63,0.07)", border: `1px solid ${C.goldBorder}`, borderRadius: "10px", padding: "0.9rem 1.1rem", marginBottom: "2rem" }}>
            <p style={{ fontSize: "0.82rem", color: C.charcoal, lineHeight: 1.65, margin: 0 }}>
              <strong style={{ color: C.gold }}>$250 deposit</strong> holds your {activePkg.label} selection. Full package pricing will be announced with the 2027 festival dates.{" "}
              <Link href="/refunds" style={{ color: C.gold }}>Refund eligible →</Link>
            </p>
          </div>

          {isFull && !submitted && (
            <div style={{ textAlign: "center", background: C.card, border: `1px solid ${C.border}`, borderRadius: "16px", padding: "2.5rem 2rem" }}>
              <p style={{ fontSize: "0.72rem", letterSpacing: "0.12em", textTransform: "uppercase", color: C.faint, marginBottom: "0.75rem", fontWeight: 600 }}>
                {activePkg.label} spots filled
              </p>
              <p style={{ fontSize: "1rem", color: C.muted, lineHeight: 1.75, marginBottom: "1.5rem" }}>
                All deposit spots for {activePkg.label} are reserved. Try the other package or join the main list.
              </p>
              <Link href="/" style={{
                display: "inline-block", padding: "0.75rem 2rem",
                background: `linear-gradient(135deg, ${C.gold}, ${C.orange})`,
                color: "#fff", fontWeight: 700, fontSize: "0.95rem",
                borderRadius: "30px", textDecoration: "none",
              }}>
                Back to Home →
              </Link>
            </div>
          )}

          {submitted && (
            <div style={{ textAlign: "center", background: C.card, border: `1px solid ${C.goldBorder}`, borderRadius: "16px", padding: "2.5rem 2rem" }}>
              <div style={{ fontSize: "2.5rem", marginBottom: "0.75rem" }}>{activePkg.emoji}</div>
              <p style={{ fontFamily: "var(--font-display)", fontSize: "1.6rem", fontWeight: 700, color: C.charcoal, marginBottom: "0.75rem", lineHeight: 1.2 }}>
                {activePkg.label} held. ✦
              </p>
              <p style={{ fontSize: "1rem", color: C.muted, lineHeight: 1.75, marginBottom: "1rem" }}>
                Thank you, {name.split(" ")[0]}. We&apos;ll send a $250 deposit payment link to{" "}
                <strong style={{ color: C.charcoal }}>{email}</strong> within minutes.
              </p>
              <p style={{ fontSize: "0.85rem", color: C.muted, lineHeight: 1.7, marginBottom: "1.75rem" }}>
                Your spot is held for 24 hours while payment processes.
              </p>
              <p style={{ fontSize: "0.8rem", color: C.faint }}>
                Questions? <a href="mailto:support@thesoundspace.us" style={{ color: C.gold }}>support@thesoundspace.us</a>
              </p>
            </div>
          )}

          {!isFull && !submitted && (
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <Field label="Full Name">
                  <input type="text" required value={name} onChange={e => setName(e.target.value)} placeholder="Your full name" style={inputStyle} />
                </Field>
                <Field label="Email Address">
                  <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" style={inputStyle} />
                </Field>
              </div>
              <Field label="Phone Number (optional)">
                <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="(907) 555-0100" style={inputStyle} />
              </Field>

              <div style={{ background: C.bg, border: `1.5px solid ${C.goldBorder}`, borderRadius: "10px", padding: "1rem 1.25rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <p style={{ fontSize: "0.72rem", color: C.faint, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "0.2rem" }}>Holding</p>
                  <p style={{ fontSize: "0.95rem", fontWeight: 700, color: C.charcoal }}>{activePkg.label}</p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <p style={{ fontSize: "0.72rem", color: C.faint, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "0.2rem" }}>Deposit</p>
                  <p style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", fontWeight: 800, color: C.gold }}>$250</p>
                </div>
              </div>

              {error && (
                <p style={{ fontSize: "0.9rem", color: C.error, background: C.errorBg, border: `1px solid rgba(184,74,43,0.2)`, borderRadius: "8px", padding: "0.75rem 1rem", margin: 0 }}>
                  {error}
                </p>
              )}

              <button type="submit" disabled={loading} style={{
                marginTop: "0.25rem", padding: "0.95rem 2rem",
                background: loading ? `rgba(201,152,63,0.5)` : `linear-gradient(135deg, ${C.gold}, ${C.orange})`,
                color: "#fff", fontWeight: 700, fontSize: "1rem",
                border: "none", borderRadius: "30px",
                cursor: loading ? "not-allowed" : "pointer",
                letterSpacing: "0.03em", transition: "opacity 0.2s",
              }}>
                {loading ? "Submitting…" : `Hold My ${activePkg.label} — $250 Deposit →`}
              </button>

              <p style={{ fontSize: "0.78rem", color: C.faint, textAlign: "center", lineHeight: 1.6 }}>
                Payment link sent within minutes. Spot held 24 hrs.{" "}
                <Link href="/refunds" style={{ color: C.faint, textDecoration: "underline" }}>Refund eligible.</Link>
              </p>
            </form>
          )}

        </div>
      </main>
    </>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
      <label style={{ fontSize: "0.72rem", letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(51,53,51,0.55)", fontWeight: 600 }}>
        {label}
      </label>
      {children}
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%", padding: "0.75rem 1rem",
  background: "#fff", border: "1px solid rgba(51,53,51,0.18)",
  borderRadius: "8px", color: "#333533", fontSize: "1rem",
  outline: "none", boxSizing: "border-box",
};
