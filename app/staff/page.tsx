"use client";

import { useState } from "react";
import Link from "next/link";

const ROLES = [
  "Event Coordinator",
  "Artist & Performer Liaison",
  "Security",
  "Media & Photography",
  "Kitchen & Catering",
  "Vendor Support",
  "Transportation",
  "Check-In / Gate",
  "Healing Arts Liaison",
  "Sponsor",
  "General Staff",
];

const GOLD = "#D4AF3C";
const CYAN = "#3DB8AF";
const VIOLET = "#9B7FD4";

interface TicketData {
  name: string;
  email: string;
  role: string;
  ticketCode: string;
  createdAt: string;
}

interface FormState {
  name: string;
  email: string;
  phone: string;
  role: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  dietaryNeeds: string;
}

// ── Shared styles ──────────────────────────────────────────────────────

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "0.65rem 0.85rem",
  background: "rgba(255,255,255,0.05)",
  border: "1px solid rgba(255,255,255,0.15)",
  borderRadius: "8px",
  color: "#fff",
  fontSize: "0.95rem",
  fontFamily: "inherit",
  outline: "none",
  boxSizing: "border-box",
  transition: "border-color 0.2s",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: "0.78rem",
  fontWeight: 600,
  color: "rgba(255,255,255,0.55)",
  textTransform: "uppercase",
  letterSpacing: "0.07em",
  marginBottom: "0.4rem",
};

const fieldStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
};

// ── Main page ─────────────────────────────────────────────────────────

export default function StaffRegistrationPage() {
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    phone: "",
    role: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
    dietaryNeeds: "",
  });
  const [checkCommit, setCheckCommit]   = useState(false);
  const [checkConduct, setCheckConduct] = useState(false);
  const [checkMedia,   setCheckMedia]   = useState(false);
  const [ticket, setTicket]   = useState<TicketData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkCommit || !checkConduct || !checkMedia) {
      setError("Please confirm all three agreement items before registering.");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/staff/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok && res.status !== 409) {
        setError(data.error ?? "Registration failed. Please try again.");
        return;
      }
      if (data.ticket) setTicket(data.ticket);
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  if (ticket) {
    return (
      <>
        <style>{`
          @media print {
            body * { visibility: hidden; }
            #staff-ticket, #staff-ticket * { visibility: visible; }
            #staff-ticket { position: fixed; top: 0; left: 0; width: 100vw; }
            .no-print { display: none !important; }
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(16px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}</style>

        <div
          style={{
            minHeight: "100vh",
            background: "linear-gradient(135deg, #0a0820 0%, #1a0d3a 100%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "2rem 1rem 4rem",
          }}
        >
          {/* Staff credential */}
          <div
            id="staff-ticket"
            style={{
              width: "100%",
              maxWidth: "480px",
              background: "linear-gradient(160deg, #0d0b2a 0%, #1a0d3a 60%, #0a1a2e 100%)",
              border: `2px solid ${GOLD}`,
              borderRadius: "20px",
              padding: "2.5rem 2rem",
              textAlign: "center",
              boxShadow: `0 0 60px rgba(212,175,60,0.18), 0 0 120px rgba(61,184,175,0.08)`,
              animation: "fadeIn 0.5s ease",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div style={{ position: "absolute", top: "-60px", right: "-60px", width: "200px", height: "200px", borderRadius: "50%", background: `radial-gradient(circle, ${GOLD}18 0%, transparent 70%)`, pointerEvents: "none" }} />
            <div style={{ position: "absolute", bottom: "-40px", left: "-40px", width: "160px", height: "160px", borderRadius: "50%", background: `radial-gradient(circle, ${CYAN}12 0%, transparent 70%)`, pointerEvents: "none" }} />

            <div style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.25em", color: GOLD, textTransform: "uppercase", marginBottom: "1.5rem", opacity: 0.9 }}>
              ✦ STAFF CREDENTIAL ✦
            </div>
            <div style={{ fontFamily: "var(--font-display, Georgia, serif)", fontSize: "clamp(1.6rem, 6vw, 2.2rem)", fontWeight: 800, color: "#fff", letterSpacing: "0.04em", lineHeight: 1.1, marginBottom: "0.3rem" }}>
              WELLNESS WEEKEND
            </div>
            <div style={{ fontFamily: "var(--font-display, Georgia, serif)", fontSize: "1.1rem", color: GOLD, fontWeight: 600, letterSpacing: "0.15em", marginBottom: "0.5rem" }}>
              2026
            </div>
            <div style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.5)", letterSpacing: "0.06em", marginBottom: "2rem" }}>
              August 7 – 9 · Warrior Lodge, Sutton AK
            </div>
            <div style={{ height: "1px", background: `linear-gradient(to right, transparent, ${GOLD}60, transparent)`, marginBottom: "2rem" }} />
            <div style={{ marginBottom: "1.5rem" }}>
              <span style={{ display: "inline-block", padding: "0.35rem 1.4rem", border: `2px solid ${GOLD}`, borderRadius: "100px", fontSize: "0.85rem", fontWeight: 800, color: GOLD, letterSpacing: "0.2em", textTransform: "uppercase", background: `${GOLD}10` }}>
                STAFF
              </span>
            </div>
            <div style={{ fontFamily: "var(--font-display, Georgia, serif)", fontSize: "clamp(1.3rem, 5vw, 1.8rem)", fontWeight: 700, color: "#fff", marginBottom: "0.5rem", letterSpacing: "0.02em" }}>
              {ticket.name}
            </div>
            <div style={{ fontSize: "0.92rem", color: CYAN, fontWeight: 600, letterSpacing: "0.05em", marginBottom: "2rem" }}>
              {ticket.role}
            </div>
            <div style={{ height: "1px", background: `linear-gradient(to right, transparent, rgba(255,255,255,0.15), transparent)`, marginBottom: "1.5rem" }} />
            <div style={{ fontFamily: "monospace", fontSize: "1.4rem", fontWeight: 700, color: "#fff", letterSpacing: "0.12em", marginBottom: "0.5rem", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "10px", padding: "0.7rem 1rem", display: "inline-block" }}>
              {ticket.ticketCode}
            </div>
            <div style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.35)", letterSpacing: "0.05em", marginTop: "1.5rem" }}>
              Present this credential at check-in
            </div>
          </div>

          {/* Action buttons */}
          <div
            className="no-print"
            style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.85rem", marginTop: "2rem", width: "100%", maxWidth: "480px" }}
          >
            <button
              onClick={() => window.print()}
              style={{ width: "100%", padding: "0.75rem 2.5rem", background: `linear-gradient(135deg, ${GOLD}, #b8922e)`, border: "none", borderRadius: "100px", color: "#0a0820", fontWeight: 700, fontSize: "0.95rem", cursor: "pointer", letterSpacing: "0.04em", fontFamily: "inherit" }}
            >
              Print Credential
            </button>

            {/* Divider */}
            <div style={{ width: "100%", marginTop: "1.5rem" }}>
              <div style={{ height: "1px", background: "linear-gradient(to right, transparent, rgba(255,255,255,0.12), transparent)", marginBottom: "1.5rem" }} />
              <p style={{ textAlign: "center", fontSize: "0.78rem", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.14em", marginBottom: "1rem" }}>
                ✦ More Ways to Get Involved ✦
              </p>
            </div>

            {/* Sponsor CTA */}
            <Link
              href="/sponsors"
              style={{
                display: "block", width: "100%", padding: "1rem 1.5rem",
                background: "rgba(212,175,60,0.08)", border: `1.5px solid ${GOLD}50`,
                borderRadius: "14px", textDecoration: "none", textAlign: "center",
              }}
            >
              <div style={{ fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.14em", color: GOLD, textTransform: "uppercase", marginBottom: "0.3rem" }}>
                Sponsor Inquiry
              </div>
              <div style={{ fontSize: "0.88rem", color: "rgba(255,255,255,0.65)", lineHeight: 1.4 }}>
                Align your brand with Wellness Weekend 2026 →
              </div>
            </Link>

            {/* Brand Partner CTA */}
            <Link
              href="/affiliates/apply"
              style={{
                display: "block", width: "100%", padding: "1rem 1.5rem",
                background: `rgba(155,127,212,0.08)`, border: `1.5px solid ${VIOLET}50`,
                borderRadius: "14px", textDecoration: "none", textAlign: "center",
              }}
            >
              <div style={{ fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.14em", color: VIOLET, textTransform: "uppercase", marginBottom: "0.3rem" }}>
                Brand Partner
              </div>
              <div style={{ fontSize: "0.88rem", color: "rgba(255,255,255,0.65)", lineHeight: 1.4 }}>
                Apply as an affiliate partner and earn commission →
              </div>
            </Link>

            <button
              onClick={() => { setTicket(null); setForm({ name: "", email: "", phone: "", role: "", emergencyContactName: "", emergencyContactPhone: "", dietaryNeeds: "" }); setCheckCommit(false); setCheckConduct(false); setCheckMedia(false); }}
              style={{ background: "none", border: "none", color: "rgba(255,255,255,0.3)", fontSize: "0.82rem", cursor: "pointer", textDecoration: "underline", fontFamily: "inherit", marginTop: "0.5rem" }}
            >
              Register another person
            </button>
          </div>
        </div>
      </>
    );
  }

  const allAgreed = checkCommit && checkConduct && checkMedia;
  const canSubmit = allAgreed && !loading;

  return (
    <>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .staff-input:focus { border-color: ${CYAN} !important; }
        .staff-select:focus { border-color: ${CYAN} !important; }
        .staff-textarea:focus { border-color: ${CYAN} !important; }
        .staff-check-row {
          display: flex; align-items: flex-start; gap: 0.85rem;
          padding: 0.85rem 1rem;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 10px; cursor: pointer;
          transition: all 0.15s;
        }
        .staff-check-row.checked {
          background: rgba(61,184,175,0.07);
          border-color: rgba(61,184,175,0.35);
        }
        .staff-submit:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 6px 24px rgba(212,175,60,0.35);
        }
        .staff-submit:active:not(:disabled) { transform: translateY(0); }
      `}</style>

      <div
        style={{
          minHeight: "100vh",
          background: "linear-gradient(160deg, #0a0820 0%, #12093a 50%, #0a1825 100%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "3rem 1rem 5rem",
        }}
      >
        <div style={{ width: "100%", maxWidth: "560px", animation: "fadeUp 0.5s ease" }}>

          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
            <div style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.25em", color: GOLD, textTransform: "uppercase", marginBottom: "0.75rem", opacity: 0.85 }}>
              ✦ WELLNESS WEEKEND 2026 ✦
            </div>
            <h1 style={{ fontFamily: "var(--font-display, Georgia, serif)", fontSize: "clamp(1.8rem, 6vw, 2.5rem)", fontWeight: 800, color: "#fff", margin: "0 0 0.5rem", letterSpacing: "0.02em" }}>
              Staff Registration
            </h1>
            <p style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.45)", margin: 0 }}>
              August 7 – 9 · Warrior Lodge, Sutton AK
            </p>
          </div>

          {/* Registration form */}
          <form
            onSubmit={handleSubmit}
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "20px", padding: "2rem", display: "flex", flexDirection: "column", gap: "1.25rem" }}
          >
            {/* Personal info */}
            <div style={{ fontSize: "0.7rem", fontWeight: 700, color: CYAN, textTransform: "uppercase", letterSpacing: "0.15em", borderBottom: `1px solid ${CYAN}30`, paddingBottom: "0.4rem" }}>
              Personal Information
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div style={fieldStyle}>
                <label style={labelStyle} htmlFor="name">Full Name <span style={{ color: GOLD }}>*</span></label>
                <input id="name" name="name" type="text" className="staff-input" required value={form.name} onChange={handleChange} placeholder="Your full name" style={inputStyle} />
              </div>
              <div style={fieldStyle}>
                <label style={labelStyle} htmlFor="email">Email <span style={{ color: GOLD }}>*</span></label>
                <input id="email" name="email" type="email" className="staff-input" required value={form.email} onChange={handleChange} placeholder="your@email.com" style={inputStyle} />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div style={fieldStyle}>
                <label style={labelStyle} htmlFor="phone">Phone</label>
                <input id="phone" name="phone" type="tel" className="staff-input" value={form.phone} onChange={handleChange} placeholder="(907) 555-0100" style={inputStyle} />
              </div>
              <div style={fieldStyle}>
                <label style={labelStyle} htmlFor="role">Role <span style={{ color: GOLD }}>*</span></label>
                <select
                  id="role" name="role" className="staff-select" required value={form.role} onChange={handleChange}
                  style={{ ...inputStyle, cursor: "pointer", appearance: "none", backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath fill='rgba(255,255,255,0.4)' d='M6 8L0 0h12z'/%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 0.85rem center", paddingRight: "2.5rem" }}
                >
                  <option value="" disabled>Select a role…</option>
                  {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
            </div>

            {/* Emergency contact */}
            <div style={{ fontSize: "0.7rem", fontWeight: 700, color: CYAN, textTransform: "uppercase", letterSpacing: "0.15em", borderBottom: `1px solid ${CYAN}30`, paddingBottom: "0.4rem", marginTop: "0.25rem" }}>
              Emergency Contact
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div style={fieldStyle}>
                <label style={labelStyle} htmlFor="emergencyContactName">Contact Name</label>
                <input id="emergencyContactName" name="emergencyContactName" type="text" className="staff-input" value={form.emergencyContactName} onChange={handleChange} placeholder="Full name" style={inputStyle} />
              </div>
              <div style={fieldStyle}>
                <label style={labelStyle} htmlFor="emergencyContactPhone">Contact Phone</label>
                <input id="emergencyContactPhone" name="emergencyContactPhone" type="tel" className="staff-input" value={form.emergencyContactPhone} onChange={handleChange} placeholder="(907) 555-0100" style={inputStyle} />
              </div>
            </div>

            {/* Additional */}
            <div style={{ fontSize: "0.7rem", fontWeight: 700, color: CYAN, textTransform: "uppercase", letterSpacing: "0.15em", borderBottom: `1px solid ${CYAN}30`, paddingBottom: "0.4rem", marginTop: "0.25rem" }}>
              Additional Information
            </div>

            <div style={fieldStyle}>
              <label style={labelStyle} htmlFor="dietaryNeeds">Dietary Needs / Restrictions</label>
              <textarea id="dietaryNeeds" name="dietaryNeeds" className="staff-textarea" value={form.dietaryNeeds} onChange={handleChange} placeholder="Allergies, dietary restrictions, or preferences…" rows={3} style={{ ...inputStyle, resize: "vertical", minHeight: "80px" }} />
            </div>

            {/* Agreement */}
            <div style={{ fontSize: "0.7rem", fontWeight: 700, color: GOLD, textTransform: "uppercase", letterSpacing: "0.15em", borderBottom: `1px solid ${GOLD}30`, paddingBottom: "0.4rem", marginTop: "0.25rem" }}>
              Staff Agreement
            </div>
            <p style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.45)", margin: "0 0 0.25rem", lineHeight: 1.55 }}>
              By registering, you commit to the following. Please confirm each item:
            </p>

            <label className={`staff-check-row${checkCommit ? " checked" : ""}`}>
              <input
                type="checkbox"
                checked={checkCommit}
                onChange={e => setCheckCommit(e.target.checked)}
                style={{ marginTop: 2, accentColor: CYAN, width: 17, height: 17, flexShrink: 0 }}
              />
              <span style={{ fontSize: "0.88rem", color: "rgba(255,255,255,0.8)", lineHeight: 1.55 }}>
                I commit to showing up for my assigned role and dates. <strong style={{ color: CYAN }}>Cancellation without notice is not acceptable.</strong> If something changes, I will contact <a href="mailto:support@thesoundspace.us" style={{ color: GOLD }}>support@thesoundspace.us</a> immediately.
              </span>
            </label>

            <label className={`staff-check-row${checkConduct ? " checked" : ""}`}>
              <input
                type="checkbox"
                checked={checkConduct}
                onChange={e => setCheckConduct(e.target.checked)}
                style={{ marginTop: 2, accentColor: CYAN, width: 17, height: 17, flexShrink: 0 }}
              />
              <span style={{ fontSize: "0.88rem", color: "rgba(255,255,255,0.8)", lineHeight: 1.55 }}>
                I agree to uphold Wellness Weekend&apos;s standards of conduct — treating all guests, participants, and fellow staff with respect, safety, and professionalism.
              </span>
            </label>

            <label className={`staff-check-row${checkMedia ? " checked" : ""}`}>
              <input
                type="checkbox"
                checked={checkMedia}
                onChange={e => setCheckMedia(e.target.checked)}
                style={{ marginTop: 2, accentColor: CYAN, width: 17, height: 17, flexShrink: 0 }}
              />
              <span style={{ fontSize: "0.88rem", color: "rgba(255,255,255,0.8)", lineHeight: 1.55 }}>
                I grant Wellness Weekend permission to use photos and videos captured during the event for promotional purposes.
              </span>
            </label>

            {error && (
              <div style={{ background: "rgba(220,80,80,0.12)", border: "1px solid rgba(220,80,80,0.3)", borderRadius: "8px", padding: "0.75rem 1rem", color: "#ff7070", fontSize: "0.88rem" }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={!canSubmit}
              className="staff-submit"
              style={{
                width: "100%",
                padding: "0.9rem",
                background: canSubmit ? `linear-gradient(135deg, ${GOLD}, #b8922e)` : "rgba(212,175,60,0.25)",
                border: "none",
                borderRadius: "100px",
                color: canSubmit ? "#0a0820" : "rgba(255,255,255,0.3)",
                fontWeight: 700,
                fontSize: "1rem",
                cursor: canSubmit ? "pointer" : "not-allowed",
                letterSpacing: "0.04em",
                fontFamily: "inherit",
                transition: "all 0.2s",
                marginTop: "0.25rem",
              }}
            >
              {loading ? "Registering…" : "Sign Agreement & Get My Pass"}
            </button>

            <p style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.3)", textAlign: "center", margin: 0 }}>
              Fields marked <span style={{ color: GOLD }}>*</span> are required.
              If you have already registered, your existing credential will be returned.
            </p>
          </form>

          <div style={{ textAlign: "center", marginTop: "2rem" }}>
            <p style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.3)" }}>
              Questions?{" "}
              <a href="mailto:support@thesoundspace.us" style={{ color: CYAN, textDecoration: "none" }}>
                support@thesoundspace.us
              </a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
