"use client";
import { useState } from "react";
import Link from "next/link";

const C = {
  bg: "#090912",
  card: "rgba(255,255,255,0.04)",
  border: "rgba(255,255,255,0.08)",
  white: "#fff",
  dim: "rgba(255,255,255,0.65)",
  faint: "rgba(255,255,255,0.3)",
  gold: "#C9983F",
  goldLight: "#E8B85A",
  goldBorder: "rgba(201,152,63,0.4)",
  sage: "#5E8A6A",
  violet: "#9B7FD4",
  teal: "#3DB8AF",
};

const UPGRADES = [
  { value: "earth-pass", label: "Earth Pass — $177" },
  { value: "cabin-bed", label: "Cabin Bed Deposit — $250" },
  { value: "recovery-bundle", label: "Recovery Bundle Deposit — $250" },
  { value: "vendor", label: "Vendor Space" },
  { value: "sponsor", label: "Sponsorship" },
  { value: "other", label: "Other / Not sure yet" },
];

const CURRENT_PASSES = [
  { value: "weekend-pass", label: "Weekend Pass" },
  { value: "earth-pass", label: "Earth Pass" },
  { value: "none", label: "No pass yet" },
];

type Path = "upgrade" | "vendor" | "sponsor" | null;

export default function UpgradePage() {
  const [path, setPath] = useState<Path>(null);
  const [form, setForm] = useState({ name: "", email: "", currentPass: "weekend-pass", desiredUpgrade: "earth-pass", notes: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/upgrade-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const d = await res.json();
      if (!res.ok) { setError(d.error || "Something went wrong"); return; }
      setSubmitted(true);
    } catch {
      setError("Failed to submit. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "0.75rem 1rem", background: "rgba(255,255,255,0.05)",
    border: `1px solid ${C.border}`, borderRadius: "10px", color: C.white,
    fontSize: "0.95rem", outline: "none", boxSizing: "border-box",
  };

  const labelStyle: React.CSSProperties = {
    display: "block", fontSize: "0.75rem", letterSpacing: "0.08em",
    textTransform: "uppercase", color: C.faint, fontWeight: 700, marginBottom: "0.4rem",
  };

  return (
    <div style={{ minHeight: "100vh", background: C.bg, color: C.white }}>
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0,
        background: "radial-gradient(ellipse at 30% 0%, rgba(201,152,63,0.12) 0%, transparent 50%)",
      }} />

      <nav style={{ position: "relative", zIndex: 1, borderBottom: `1px solid ${C.border}`, padding: "0.9rem 1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Link href="/" style={{ fontSize: "0.82rem", color: C.faint, textDecoration: "none" }}>← Wellness Weekend</Link>
      </nav>

      <main style={{ position: "relative", zIndex: 1, maxWidth: "680px", margin: "0 auto", padding: "4rem 1.5rem 7rem" }}>

        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <p style={{ fontSize: "0.62rem", letterSpacing: "0.2em", textTransform: "uppercase", color: C.gold, fontWeight: 700, marginBottom: "0.75rem" }}>
            2027 · Wellness Weekend
          </p>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2rem, 6vw, 3.5rem)", fontWeight: 700, lineHeight: 1.1, color: C.white, marginBottom: "0.75rem" }}>
            Upgrade or Partner
          </h1>
          <p style={{ fontSize: "0.95rem", color: C.dim, lineHeight: 1.75, maxWidth: "460px", margin: "0 auto" }}>
            Upgrade your pass, book a cabin bed, apply as a vendor, or become a sponsor.
          </p>
        </div>

        {/* Path picker */}
        {!path && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
            {[
              { key: "upgrade" as Path, emoji: "⬆", title: "Upgrade my pass", desc: "Move to Earth Pass or add cabin & packages", color: C.gold, border: C.goldBorder },
              { key: "vendor" as Path, emoji: "🏪", title: "Become a vendor", desc: "Apply for a vendor space at the event", color: C.teal, border: "rgba(61,184,175,0.35)" },
              { key: "sponsor" as Path, emoji: "✦", title: "Sponsor the event", desc: "Partner with us for visibility & impact", color: C.violet, border: "rgba(155,127,212,0.35)" },
            ].map(opt => (
              <button key={opt.key} onClick={() => setPath(opt.key)} style={{
                background: "rgba(255,255,255,0.03)", border: `1px solid ${opt.border}`,
                borderRadius: "16px", padding: "1.5rem", cursor: "pointer", textAlign: "left",
                color: C.white, transition: "background 0.15s",
              }}
                onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.06)")}
                onMouseLeave={e => (e.currentTarget.style.background = "rgba(255,255,255,0.03)")}
              >
                <div style={{ fontSize: "1.5rem", marginBottom: "0.6rem" }}>{opt.emoji}</div>
                <div style={{ fontWeight: 700, fontSize: "1rem", marginBottom: "0.3rem", color: opt.color }}>{opt.title}</div>
                <div style={{ fontSize: "0.82rem", color: C.faint, lineHeight: 1.5 }}>{opt.desc}</div>
              </button>
            ))}
          </div>
        )}

        {/* Upgrade form */}
        {path === "upgrade" && !submitted && (
          <div style={{ background: C.card, border: `1px solid ${C.goldBorder}`, borderRadius: "18px", padding: "2rem" }}>
            <button onClick={() => setPath(null)} style={{ background: "none", border: "none", color: C.faint, cursor: "pointer", fontSize: "0.82rem", marginBottom: "1.5rem", padding: 0 }}>← Back</button>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.4rem", color: C.white, marginBottom: "0.4rem" }}>Upgrade your pass</h2>
            <p style={{ fontSize: "0.85rem", color: C.faint, marginBottom: "1.75rem", lineHeight: 1.6 }}>
              Submit your request and we&apos;ll send you a payment link within 24 hours.
            </p>
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.1rem" }}>
              <div>
                <label style={labelStyle}>Your name</label>
                <input style={inputStyle} value={form.name} required onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Full name" />
              </div>
              <div>
                <label style={labelStyle}>Email on your existing order</label>
                <input style={inputStyle} type="email" value={form.email} required onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="you@example.com" />
              </div>
              <div>
                <label style={labelStyle}>Current pass</label>
                <select style={{ ...inputStyle, appearance: "none" }} value={form.currentPass} onChange={e => setForm(f => ({ ...f, currentPass: e.target.value }))}>
                  {CURRENT_PASSES.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>What would you like?</label>
                <select style={{ ...inputStyle, appearance: "none" }} value={form.desiredUpgrade} onChange={e => setForm(f => ({ ...f, desiredUpgrade: e.target.value }))}>
                  {UPGRADES.map(u => <option key={u.value} value={u.value}>{u.label}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Notes (optional)</label>
                <textarea style={{ ...inputStyle, minHeight: "80px", resize: "vertical" }} value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} placeholder="Anything else we should know?" />
              </div>
              {error && <p style={{ color: "#ff8a72", fontSize: "0.85rem" }}>{error}</p>}
              <button type="submit" disabled={submitting} style={{
                padding: "0.9rem 1.5rem", borderRadius: "30px",
                background: `linear-gradient(135deg, ${C.gold}, ${C.goldLight})`,
                color: "#fff", fontWeight: 700, fontSize: "0.95rem",
                border: "none", cursor: submitting ? "wait" : "pointer",
                opacity: submitting ? 0.7 : 1,
              }}>
                {submitting ? "Submitting…" : "Submit Request →"}
              </button>
            </form>
          </div>
        )}

        {path === "upgrade" && submitted && (
          <div style={{ textAlign: "center", background: C.card, border: `1px solid ${C.goldBorder}`, borderRadius: "18px", padding: "3rem 2rem" }}>
            <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>✓</div>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.6rem", color: C.goldLight, marginBottom: "0.75rem" }}>Request received</h2>
            <p style={{ color: C.dim, lineHeight: 1.75, maxWidth: "400px", margin: "0 auto 1.5rem" }}>
              We&apos;ll email you within 24 hours with a payment link to complete your upgrade.
            </p>
            <Link href="/" style={{ fontSize: "0.85rem", color: C.faint, textDecoration: "underline" }}>← Back to home</Link>
          </div>
        )}

        {path === "vendor" && (
          <div style={{ background: C.card, border: "1px solid rgba(61,184,175,0.3)", borderRadius: "18px", padding: "2rem", textAlign: "center" }}>
            <button onClick={() => setPath(null)} style={{ background: "none", border: "none", color: C.faint, cursor: "pointer", fontSize: "0.82rem", marginBottom: "1.5rem", padding: 0, display: "block" }}>← Back</button>
            <div style={{ fontSize: "2rem", marginBottom: "0.75rem" }}>🏪</div>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.4rem", color: C.teal, marginBottom: "0.75rem" }}>Vendor Waitlist</h2>
            <p style={{ color: C.dim, lineHeight: 1.75, maxWidth: "400px", margin: "0 auto 1.5rem", fontSize: "0.9rem" }}>
              Apply for a vendor space — markets, healing arts, food &amp; beverage, and more.
            </p>
            <Link href="/vendors" style={{
              display: "inline-block", padding: "0.8rem 2rem", borderRadius: "30px",
              background: `linear-gradient(135deg, ${C.teal}, rgba(61,184,175,0.7))`,
              color: "#fff", fontWeight: 700, fontSize: "0.9rem", textDecoration: "none",
            }}>
              Apply as a Vendor →
            </Link>
          </div>
        )}

        {path === "sponsor" && (
          <div style={{ background: C.card, border: "1px solid rgba(155,127,212,0.3)", borderRadius: "18px", padding: "2rem", textAlign: "center" }}>
            <button onClick={() => setPath(null)} style={{ background: "none", border: "none", color: C.faint, cursor: "pointer", fontSize: "0.82rem", marginBottom: "1.5rem", padding: 0, display: "block" }}>← Back</button>
            <div style={{ fontSize: "2rem", marginBottom: "0.75rem" }}>✦</div>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.4rem", color: C.violet, marginBottom: "0.75rem" }}>Sponsor Wellness Weekend</h2>
            <p style={{ color: C.dim, lineHeight: 1.75, maxWidth: "400px", margin: "0 auto 1.5rem", fontSize: "0.9rem" }}>
              Partner with us and connect with our wellness community.
            </p>
            <Link href="/sponsors" style={{
              display: "inline-block", padding: "0.8rem 2rem", borderRadius: "30px",
              background: `linear-gradient(135deg, ${C.violet}, rgba(155,127,212,0.7))`,
              color: "#fff", fontWeight: 700, fontSize: "0.9rem", textDecoration: "none",
            }}>
              Apply as a Sponsor →
            </Link>
          </div>
        )}

      </main>
    </div>
  );
}
