"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { SHIFTS, calcReward, type Shift, type RewardResult } from "@/lib/volunteer-shifts";

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
  error: "#B84A2B",
  errorBg: "rgba(184,74,43,0.07)",
  green: "#2E7D32",
  greenBg: "rgba(46,125,50,0.07)",
};

const REWARD_META: Record<string, { emoji: string; color: string; bg: string }> = {
  lodging:          { emoji: "🏡", color: "#8B5FBF", bg: "rgba(139,95,191,0.07)" },
  weekend_pass:     { emoji: "🎟",  color: C.gold,    bg: "rgba(201,152,63,0.08)" },
  day_pass:         { emoji: "☀️",  color: C.orange,  bg: "rgba(255,107,53,0.07)" },
  lodging_discount: { emoji: "🛏",  color: C.green,   bg: C.greenBg },
  none:             { emoji: "✦",   color: C.faint,   bg: "rgba(51,53,51,0.04)" },
};

const PHASES = [
  { key: "setup",          label: "Thursday Setup",    date: "Thursday, Aug 6",  emoji: "🔨" },
  { key: "friday",         label: "Festival · Friday", date: "Friday, Aug 7",    emoji: "🌅" },
  { key: "saturday",       label: "Festival · Saturday", date: "Saturday, Aug 8", emoji: "🌿" },
  { key: "sunday",         label: "Festival · Sunday", date: "Sunday, Aug 9",    emoji: "☀️" },
  { key: "sunday_evening", label: "Sunday Teardown",   date: "Sunday evening",   emoji: "🌙" },
] as const;

function getPhaseKey(shift: Shift): string {
  if (shift.phase === "setup") return "setup";
  if (shift.phase === "sunday_evening") return "sunday_evening";
  return shift.day.toLowerCase();
}

const SHIFTS_BY_PHASE: Record<string, Shift[]> = {
  setup:          SHIFTS.filter((s) => s.phase === "setup"),
  friday:         SHIFTS.filter((s) => s.phase === "during" && s.day === "Friday"),
  saturday:       SHIFTS.filter((s) => s.phase === "during" && s.day === "Saturday"),
  sunday:         SHIFTS.filter((s) => s.phase === "during" && s.day === "Sunday"),
  sunday_evening: SHIFTS.filter((s) => s.phase === "sunday_evening"),
};

interface Availability {
  shift_id: string;
  capacity: number;
  claimed: number;
  remaining: number;
}

export default function VolunteerPage() {
  const [availability, setAvailability] = useState<Record<string, Availability>>({});
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [submitted, setSubmitted] = useState(false);
  const [submittedReward, setSubmittedReward] = useState<RewardResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [waiver, setWaiver] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/volunteer-signup")
      .then((r) => r.json())
      .then((d) => {
        if (d.availability) {
          const map: Record<string, Availability> = {};
          for (const a of d.availability) map[a.shift_id] = a;
          setAvailability(map);
        }
      })
      .catch(() => {});
  }, []);

  function toggleShift(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  const selectedShifts = SHIFTS.filter((s) => selectedIds.has(s.shift_id));
  const reward = calcReward(selectedShifts);
  const rewardMeta = REWARD_META[reward.key];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!waiver) { setError("Please agree to the volunteer waiver to continue."); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/volunteer-signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone: phone || undefined,
          shiftIds: Array.from(selectedIds),
          agreedWaiver: waiver,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong. Please try again.");
      } else {
        setSubmittedReward(data.reward);
        setSubmitted(true);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } catch {
      setError("Unable to submit. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (submitted && submittedReward) {
    return <SuccessState name={name} email={email} reward={submittedReward} shifts={selectedShifts} />;
  }

  return (
    <>
      <nav style={{ background: C.bg, borderBottom: `1px solid ${C.border}`, padding: "0.9rem 1.5rem" }}>
        <Link href="/" style={{ fontSize: "0.85rem", color: C.muted, textDecoration: "none" }}>
          ← Back to Wellness Weekend
        </Link>
      </nav>

      <main style={{ minHeight: "100vh", background: C.bg, padding: "3rem 1.5rem 6rem" }}>
        <div style={{ maxWidth: "780px", margin: "0 auto" }}>

          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: "2.75rem" }}>
            <p style={{ fontSize: "0.7rem", letterSpacing: "0.14em", textTransform: "uppercase", color: C.gold, marginBottom: "0.75rem", fontWeight: 600 }}>
              August 7–9, 2026 · Sutton, Alaska
            </p>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2rem,5vw,3rem)", fontWeight: 700, lineHeight: 1.15, marginBottom: "1rem", color: C.charcoal }}>
              Volunteer at Wellness Weekend.
            </h1>
            <p style={{ fontSize: "1.05rem", lineHeight: 1.75, color: C.muted, maxWidth: "500px", margin: "0 auto" }}>
              Give a few hours, gain an experience. Pick your shifts below and earn a reward based on your total time.
            </p>
          </div>

          {/* Reward tiers */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(155px,1fr))", gap: "0.75rem", marginBottom: "2.75rem" }}>
            {[
              { key: "day_pass",     label: "Day Pass",       hours: "3+ hrs",  desc: "For the day you volunteer" },
              { key: "weekend_pass", label: "Weekend Pass",   hours: "8+ hrs",  desc: "Full 3-day pass" },
              { key: "lodging",      label: "Comped Lodging", hours: "12+ hrs", desc: "4+ hrs on 3 of 4 days · Thu–Sun" },
            ].map((tier) => {
              const meta = REWARD_META[tier.key];
              return (
                <div key={tier.key} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: "12px", padding: "1rem", textAlign: "center" }}>
                  <div style={{ fontSize: "1.4rem", marginBottom: "0.3rem" }}>{meta.emoji}</div>
                  <p style={{ fontSize: "0.78rem", fontWeight: 700, color: meta.color, marginBottom: "0.2rem" }}>{tier.label}</p>
                  <p style={{ fontSize: "0.75rem", color: C.charcoal, fontWeight: 600, marginBottom: "0.15rem" }}>{tier.hours}</p>
                  <p style={{ fontSize: "0.72rem", color: C.muted }}>{tier.desc}</p>
                </div>
              );
            })}
          </div>

          {/* Live reward tracker */}
          <div style={{
            background: rewardMeta.bg,
            border: `1.5px solid ${rewardMeta.color === C.faint ? C.border : `${rewardMeta.color}44`}`,
            borderRadius: "14px",
            padding: "1.25rem 1.5rem",
            marginBottom: "2rem",
            display: "flex",
            alignItems: "center",
            gap: "1rem",
            flexWrap: "wrap",
          }}>
            <span style={{ fontSize: "1.75rem", lineHeight: 1 }}>{rewardMeta.emoji}</span>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: "0.65rem", letterSpacing: "0.1em", textTransform: "uppercase", color: rewardMeta.color, fontWeight: 700, marginBottom: "0.15rem" }}>
                Your current reward
              </p>
              <p style={{ fontSize: "1rem", fontWeight: 700, color: C.charcoal }}>{reward.label}</p>
              <p style={{ fontSize: "0.82rem", color: C.muted }}>{reward.desc}</p>
            </div>
            {selectedIds.size > 0 && (
              <div style={{ textAlign: "right" }}>
                <p style={{ fontSize: "1.4rem", fontWeight: 800, color: C.charcoal, lineHeight: 1 }}>{selectedIds.size}</p>
                <p style={{ fontSize: "0.7rem", color: C.faint }}>shift{selectedIds.size !== 1 ? "s" : ""} selected</p>
              </div>
            )}
          </div>

          {/* Shift sections */}
          {PHASES.map((phase) => {
            const phaseShifts = SHIFTS_BY_PHASE[phase.key] ?? [];
            if (!phaseShifts.length) return null;
            return (
              <div key={phase.key} style={{ marginBottom: "2.25rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.9rem" }}>
                  <span style={{ fontSize: "1rem" }}>{phase.emoji}</span>
                  <div>
                    <p style={{ fontSize: "0.65rem", letterSpacing: "0.11em", textTransform: "uppercase", color: C.gold, fontWeight: 700 }}>
                      {phase.date}
                    </p>
                    <p style={{ fontSize: "1rem", fontWeight: 700, color: C.charcoal }}>{phase.label}</p>
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  {phaseShifts.map((shift) => {
                    const avail = availability[shift.shift_id];
                    const remaining = avail ? avail.remaining : shift.capacity;
                    const isFull = remaining <= 0;
                    const isSelected = selectedIds.has(shift.shift_id);
                    return (
                      <ShiftCard
                        key={shift.shift_id}
                        shift={shift}
                        remaining={remaining}
                        isFull={isFull}
                        isSelected={isSelected}
                        onToggle={() => !isFull && toggleShift(shift.shift_id)}
                      />
                    );
                  })}
                </div>
              </div>
            );
          })}

          {/* Divider */}
          <div style={{ borderTop: `1px solid ${C.border}`, margin: "2rem 0" }} />

          {/* Form */}
          <div ref={formRef}>
            <p style={{ fontSize: "0.7rem", letterSpacing: "0.12em", textTransform: "uppercase", color: C.gold, fontWeight: 600, marginBottom: "0.5rem" }}>
              Your Information
            </p>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", fontWeight: 700, color: C.charcoal, marginBottom: "0.4rem" }}>
              Confirm Your Signup
            </h2>
            <p style={{ fontSize: "0.9rem", color: C.muted, marginBottom: "1.75rem" }}>
              {selectedIds.size === 0
                ? "Select at least one shift above, then fill in your details."
                : `You've selected ${selectedIds.size} shift${selectedIds.size !== 1 ? "s" : ""}. Fill in your details to confirm.`}
            </p>

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <Field label="Full Name">
                  <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Your full name" style={inputStyle} />
                </Field>
                <Field label="Email Address">
                  <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" style={inputStyle} />
                </Field>
              </div>

              <Field label="Phone" hint="Optional — for day-of coordination">
                <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="(907) 555-0100" style={inputStyle} />
              </Field>

              {/* Selected shifts summary */}
              {selectedIds.size > 0 && (
                <div style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: "10px", padding: "1rem 1.25rem" }}>
                  <p style={{ fontSize: "0.7rem", letterSpacing: "0.08em", textTransform: "uppercase", color: C.faint, fontWeight: 600, marginBottom: "0.6rem" }}>
                    Selected Shifts
                  </p>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
                    {Array.from(selectedIds).map((id) => {
                      const s = SHIFTS.find((x) => x.shift_id === id)!;
                      return (
                        <div key={id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <span style={{ fontSize: "0.88rem", color: C.charcoal }}>{s.role}</span>
                          <span style={{ fontSize: "0.78rem", color: C.muted }}>{s.day}</span>
                        </div>
                      );
                    })}
                  </div>
                  <div style={{ marginTop: "0.75rem", paddingTop: "0.75rem", borderTop: `1px solid ${C.border}`, display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <span style={{ fontSize: "0.82rem", fontWeight: 700, color: rewardMeta.color }}>{rewardMeta.emoji} {reward.label}</span>
                  </div>
                </div>
              )}

              {/* Waiver */}
              <label style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start", cursor: "pointer" }}>
                <input
                  type="checkbox"
                  checked={waiver}
                  onChange={(e) => setWaiver(e.target.checked)}
                  style={{ marginTop: "3px", accentColor: C.gold, width: "16px", height: "16px", flexShrink: 0 }}
                />
                <span style={{ fontSize: "0.88rem", color: C.muted, lineHeight: 1.6 }}>
                  I acknowledge the volunteer waiver and agree to participate as a volunteer at Wellness Weekend 2026. I understand my reward is based on hours worked and is subject to final schedule confirmation.
                </span>
              </label>

              {error && (
                <p style={{ fontSize: "0.9rem", color: C.error, background: C.errorBg, border: `1px solid rgba(184,74,43,0.2)`, borderRadius: "8px", padding: "0.75rem 1rem", margin: 0 }}>
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading || selectedIds.size === 0}
                style={{
                  marginTop: "0.25rem",
                  padding: "0.9rem 2rem",
                  background: (loading || selectedIds.size === 0)
                    ? `rgba(201,152,63,0.4)`
                    : `linear-gradient(135deg, ${C.gold}, ${C.orange})`,
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: "1rem",
                  border: "none",
                  borderRadius: "30px",
                  cursor: (loading || selectedIds.size === 0) ? "not-allowed" : "pointer",
                  letterSpacing: "0.03em",
                  transition: "opacity 0.2s",
                }}
              >
                {loading ? "Submitting…" : selectedIds.size === 0 ? "Select a shift to continue" : "Confirm My Shifts →"}
              </button>

              <p style={{ fontSize: "0.8rem", color: C.faint, textAlign: "center" }}>
                You&apos;ll receive a confirmation email. Questions?{" "}
                <a href="mailto:support@thesoundspace.us" style={{ color: C.gold }}>support@thesoundspace.us</a>
              </p>
            </form>
          </div>

        </div>
      </main>
    </>
  );
}

function ShiftCard({
  shift,
  remaining,
  isFull,
  isSelected,
  onToggle,
}: {
  shift: Shift;
  remaining: number;
  isFull: boolean;
  isSelected: boolean;
  onToggle: () => void;
}) {
  const C_local = {
    bg: "#F7F3EC",
    card: "#FBF9F4",
    charcoal: "#333533",
    muted: "rgba(51,53,51,0.6)",
    faint: "rgba(51,53,51,0.38)",
    gold: "#C9983F",
    goldBorder: "rgba(201,152,63,0.35)",
    orange: "#FF6B35",
    border: "rgba(51,53,51,0.12)",
  };

  return (
    <button
      onClick={onToggle}
      disabled={isFull}
      style={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        gap: "0.9rem",
        padding: "0.9rem 1rem",
        background: isSelected
          ? "rgba(201,152,63,0.07)"
          : isFull
          ? "rgba(51,53,51,0.03)"
          : C_local.card,
        border: isSelected
          ? `1.5px solid ${C_local.gold}`
          : `1px solid ${C_local.border}`,
        borderRadius: "10px",
        cursor: isFull ? "not-allowed" : "pointer",
        textAlign: "left",
        transition: "all 0.15s",
        opacity: isFull ? 0.55 : 1,
      }}
    >
      {/* Checkbox indicator */}
      <div style={{
        width: "18px",
        height: "18px",
        borderRadius: "4px",
        border: isSelected ? `2px solid ${C_local.gold}` : `1.5px solid ${C_local.faint}`,
        background: isSelected ? C_local.gold : "transparent",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        transition: "all 0.15s",
      }}>
        {isSelected && <span style={{ color: "#fff", fontSize: "11px", lineHeight: 1 }}>✓</span>}
      </div>

      {/* Shift info */}
      <div style={{ flex: 1 }}>
        <p style={{ fontSize: "0.92rem", fontWeight: isSelected ? 700 : 500, color: C_local.charcoal, marginBottom: "0.1rem" }}>
          {shift.role}
        </p>
        <p style={{ fontSize: "0.75rem", color: C_local.muted }}>
          {shift.start_time ? `${shift.start_time}–${shift.end_time}` : "Time TBD"}
          {" · "}{shift.hours} hrs
        </p>
      </div>

      {/* Capacity badge */}
      <div style={{ textAlign: "right", flexShrink: 0 }}>
        <span style={{
          display: "inline-block",
          padding: "0.2rem 0.6rem",
          borderRadius: "20px",
          fontSize: "0.72rem",
          fontWeight: 600,
          background: isFull
            ? "rgba(51,53,51,0.08)"
            : remaining <= 1
            ? "rgba(255,107,53,0.1)"
            : "rgba(201,152,63,0.1)",
          color: isFull
            ? C_local.faint
            : remaining <= 1
            ? C_local.orange
            : C_local.gold,
        }}>
          {isFull ? "Full" : `${remaining} spot${remaining !== 1 ? "s" : ""}`}
        </span>
      </div>
    </button>
  );
}

function SuccessState({ name, email, reward, shifts }: { name: string; email: string; reward: RewardResult; shifts: Shift[] }) {
  const meta = REWARD_META[reward.key] ?? REWARD_META.none;
  const border = "rgba(51,53,51,0.12)";
  const gold = "#C9983F";
  const charcoal = "#333533";
  const muted = "rgba(51,53,51,0.6)";
  const faint = "rgba(51,53,51,0.38)";
  const orange = "#FF6B35";

  return (
    <>
      <nav style={{ background: "#F7F3EC", borderBottom: `1px solid ${border}`, padding: "0.9rem 1.5rem" }}>
        <Link href="/" style={{ fontSize: "0.85rem", color: muted, textDecoration: "none" }}>← Back to Wellness Weekend</Link>
      </nav>
      <main style={{ minHeight: "100vh", background: "#F7F3EC", padding: "4rem 1.5rem 6rem" }}>
        <div style={{ maxWidth: "560px", margin: "0 auto", textAlign: "center" }}>
          <div style={{ background: "#FBF9F4", border: `1px solid rgba(201,152,63,0.35)`, borderRadius: "20px", padding: "3rem 2rem" }}>
            <div style={{ fontSize: "2.5rem", marginBottom: "0.75rem" }}>{meta.emoji}</div>
            <p style={{ fontSize: "0.7rem", letterSpacing: "0.13em", textTransform: "uppercase", color: gold, marginBottom: "0.5rem", fontWeight: 600 }}>
              You&apos;re registered ✦
            </p>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.8rem", fontWeight: 700, color: charcoal, marginBottom: "0.75rem" }}>
              Thank you, {name.split(" ")[0]}.
            </h1>
            <p style={{ fontSize: "1rem", color: muted, lineHeight: 1.75, marginBottom: "1.5rem" }}>
              Confirmation is on its way to <strong style={{ color: charcoal }}>{email}</strong>.
              We&apos;ll follow up with shift details as the schedule is finalized.
            </p>

            {/* Reward box */}
            <div style={{ background: meta.bg, border: `1.5px solid ${meta.color}44`, borderRadius: "12px", padding: "1.25rem", marginBottom: "1.75rem" }}>
              <p style={{ fontSize: "0.65rem", letterSpacing: "0.1em", textTransform: "uppercase", color: meta.color, fontWeight: 700, marginBottom: "0.3rem" }}>
                Your Reward
              </p>
              <p style={{ fontSize: "1.15rem", fontWeight: 700, color: charcoal, marginBottom: "0.2rem" }}>{reward.label}</p>
              <p style={{ fontSize: "0.85rem", color: muted }}>{reward.desc}</p>
            </div>

            {/* Shifts summary */}
            <div style={{ textAlign: "left", marginBottom: "1.75rem" }}>
              <p style={{ fontSize: "0.7rem", letterSpacing: "0.08em", textTransform: "uppercase", color: faint, fontWeight: 600, marginBottom: "0.6rem" }}>
                Your Shifts
              </p>
              {shifts.map((s) => (
                <div key={s.shift_id} style={{ display: "flex", justifyContent: "space-between", padding: "0.35rem 0", borderBottom: `1px solid ${border}` }}>
                  <span style={{ fontSize: "0.88rem", color: charcoal }}>{s.role}</span>
                  <span style={{ fontSize: "0.8rem", color: muted }}>{s.day}</span>
                </div>
              ))}
            </div>

            <a
              href="/#schedule"
              style={{
                display: "inline-block",
                padding: "0.75rem 2rem",
                background: `linear-gradient(135deg, ${gold}, ${orange})`,
                color: "#fff",
                fontWeight: 700,
                fontSize: "0.95rem",
                borderRadius: "30px",
                textDecoration: "none",
                marginBottom: "1rem",
              }}
            >
              Browse the Schedule →
            </a>
            <p style={{ fontSize: "0.8rem", color: faint }}>
              Questions? <a href="mailto:support@thesoundspace.us" style={{ color: gold }}>support@thesoundspace.us</a>
            </p>
          </div>
        </div>
      </main>
    </>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
      <label style={{ fontSize: "0.72rem", letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(51,53,51,0.55)", fontWeight: 600 }}>
        {label}
      </label>
      {children}
      {hint && <span style={{ fontSize: "0.72rem", color: "rgba(51,53,51,0.4)" }}>{hint}</span>}
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "0.75rem 1rem",
  background: "#fff",
  border: "1px solid rgba(51,53,51,0.18)",
  borderRadius: "8px",
  color: "#333533",
  fontSize: "1rem",
  outline: "none",
  boxSizing: "border-box",
};
