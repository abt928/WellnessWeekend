"use client";

import { useState, useEffect } from "react";

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
  "General Staff",
];

const GOLD = "#D4AF3C";
const CYAN = "#3DB8AF";

interface TicketData {
  name: string;
  email: string;
  role: string;
  ticketCode: string;
  createdAt: string;
}

interface GuestTicket {
  guestName: string;
  guestEmail: string | null;
  ticketCode: string;
  staffName: string;
  staffTicketCode: string;
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

// ── Guest registration panel ──────────────────────────────────────────

function GuestRegistrationPanel({ staffTicketCode, staffName }: { staffTicketCode: string; staffName: string }) {
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [guests, setGuests] = useState<GuestTicket[]>([]);
  const [newGuest, setNewGuest] = useState<GuestTicket | null>(null);
  const [loadingGuests, setLoadingGuests] = useState(false);

  const loadGuests = async () => {
    setLoadingGuests(true);
    try {
      const res = await fetch(`/api/staff/guests?staffTicketCode=${encodeURIComponent(staffTicketCode)}`);
      if (res.ok) {
        const data = await res.json();
        setGuests(
          (data.guests ?? []).map((g: Record<string, unknown>) => ({
            guestName: String(g.guest_name ?? g.guestName ?? ""),
            guestEmail: g.guest_email ? String(g.guest_email) : (g.guestEmail ? String(g.guestEmail) : null),
            ticketCode: String(g.ticket_code ?? g.ticketCode ?? ""),
            staffName: String(g.staff_name ?? g.staffName ?? staffName),
            staffTicketCode: staffTicketCode,
            createdAt: String(g.created_at ?? g.createdAt ?? ""),
          }))
        );
      }
    } finally {
      setLoadingGuests(false);
    }
  };

  useEffect(() => { loadGuests(); }, [staffTicketCode]);

  const handleAddGuest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName.trim()) return;
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/staff/guests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ staffTicketCode, guestName: guestName.trim(), guestEmail: guestEmail.trim() || undefined }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Could not register guest. Please try again.");
        return;
      }
      const ticket: GuestTicket = {
        guestName: data.ticket.guestName,
        guestEmail: data.ticket.guestEmail ?? null,
        ticketCode: data.ticket.ticketCode,
        staffName: data.ticket.staffName,
        staffTicketCode: data.ticket.staffTicketCode,
        createdAt: data.ticket.createdAt,
      };
      setNewGuest(ticket);
      setGuests(prev => [ticket, ...prev]);
      setGuestName("");
      setGuestEmail("");
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "480px",
        marginTop: "2rem",
      }}
    >
      {/* Guest ticket flash */}
      {newGuest && (
        <div
          style={{
            background: "linear-gradient(160deg, #0d0b2a 0%, #1a0d3a 60%, #0a1a2e 100%)",
            border: `2px solid ${CYAN}`,
            borderRadius: "16px",
            padding: "1.75rem 1.5rem",
            textAlign: "center",
            marginBottom: "1.5rem",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div style={{ position: "absolute", top: "-40px", right: "-40px", width: "140px", height: "140px", borderRadius: "50%", background: `radial-gradient(circle, ${CYAN}18 0%, transparent 70%)`, pointerEvents: "none" }} />
          <div style={{ fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.22em", color: CYAN, textTransform: "uppercase", marginBottom: "1rem", opacity: 0.9 }}>
            ✦ GUEST CREDENTIAL ✦
          </div>
          <div style={{ fontFamily: "var(--font-display, Georgia, serif)", fontSize: "1.4rem", fontWeight: 800, color: "#fff", marginBottom: "0.2rem" }}>
            WELLNESS WEEKEND
          </div>
          <div style={{ fontSize: "0.85rem", color: GOLD, fontWeight: 600, letterSpacing: "0.12em", marginBottom: "0.3rem" }}>2026</div>
          <div style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.45)", letterSpacing: "0.05em", marginBottom: "1.25rem" }}>
            August 7 – 9 · Warrior Lodge, Sutton AK
          </div>
          <div style={{ height: "1px", background: `linear-gradient(to right, transparent, ${CYAN}50, transparent)`, marginBottom: "1.25rem" }} />
          <div style={{ marginBottom: "1rem" }}>
            <span style={{ display: "inline-block", padding: "0.3rem 1.2rem", border: `2px solid ${CYAN}`, borderRadius: "100px", fontSize: "0.78rem", fontWeight: 800, color: CYAN, letterSpacing: "0.18em", textTransform: "uppercase", background: `${CYAN}10` }}>
              GUEST
            </span>
          </div>
          <div style={{ fontFamily: "var(--font-display, Georgia, serif)", fontSize: "1.5rem", fontWeight: 700, color: "#fff", marginBottom: "0.25rem" }}>
            {newGuest.guestName}
          </div>
          <div style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.45)", marginBottom: "1.25rem" }}>
            Registered by <span style={{ color: GOLD, fontWeight: 600 }}>{newGuest.staffName}</span>
          </div>
          <div style={{ height: "1px", background: `linear-gradient(to right, transparent, rgba(255,255,255,0.12), transparent)`, marginBottom: "1rem" }} />
          <div style={{ fontFamily: "monospace", fontSize: "1.15rem", fontWeight: 700, color: "#fff", letterSpacing: "0.1em", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", padding: "0.6rem 1rem", display: "inline-block" }}>
            {newGuest.ticketCode}
          </div>
          <div style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.3)", marginTop: "1rem" }}>
            Present this credential at check-in
          </div>
          <div style={{ marginTop: "1rem" }}>
            <button
              onClick={() => window.print()}
              style={{ padding: "0.5rem 1.5rem", background: `linear-gradient(135deg, ${CYAN}, #2a9d8f)`, border: "none", borderRadius: "100px", color: "#0a0820", fontWeight: 700, fontSize: "0.85rem", cursor: "pointer", fontFamily: "inherit" }}
            >
              Print
            </button>
            <button onClick={() => setNewGuest(null)} style={{ marginLeft: "0.75rem", background: "none", border: "none", color: "rgba(255,255,255,0.35)", fontSize: "0.8rem", cursor: "pointer", fontFamily: "inherit" }}>
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Add guest form */}
      <div
        style={{
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: "16px",
          padding: "1.5rem",
        }}
      >
        <div style={{ fontSize: "0.7rem", fontWeight: 700, color: CYAN, textTransform: "uppercase", letterSpacing: "0.15em", borderBottom: `1px solid ${CYAN}30`, paddingBottom: "0.4rem", marginBottom: "1.1rem" }}>
          Register a Guest
        </div>
        <p style={{ fontSize: "0.83rem", color: "rgba(255,255,255,0.45)", margin: "0 0 1rem" }}>
          Each guest gets a free admission ticket linked to your credential.
        </p>
        <form onSubmit={handleAddGuest} style={{ display: "flex", flexDirection: "column", gap: "0.9rem" }}>
          <div style={fieldStyle}>
            <label style={labelStyle}>Guest Name <span style={{ color: GOLD }}>*</span></label>
            <input
              type="text"
              className="staff-input"
              required
              value={guestName}
              onChange={e => setGuestName(e.target.value)}
              placeholder="Full name"
              style={inputStyle}
            />
          </div>
          <div style={fieldStyle}>
            <label style={labelStyle}>Guest Email <span style={{ color: "rgba(255,255,255,0.3)" }}>(optional)</span></label>
            <input
              type="email"
              className="staff-input"
              value={guestEmail}
              onChange={e => setGuestEmail(e.target.value)}
              placeholder="guest@email.com"
              style={inputStyle}
            />
          </div>
          {error && (
            <div style={{ background: "rgba(220,80,80,0.12)", border: "1px solid rgba(220,80,80,0.3)", borderRadius: "8px", padding: "0.65rem 0.85rem", color: "#ff7070", fontSize: "0.85rem" }}>
              {error}
            </div>
          )}
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: "0.75rem",
              background: loading ? `rgba(61,184,175,0.3)` : `linear-gradient(135deg, ${CYAN}, #2a9d8f)`,
              border: "none",
              borderRadius: "100px",
              color: loading ? "rgba(10,8,32,0.5)" : "#0a0820",
              fontWeight: 700,
              fontSize: "0.9rem",
              cursor: loading ? "not-allowed" : "pointer",
              fontFamily: "inherit",
              transition: "all 0.2s",
            }}
          >
            {loading ? "Registering…" : "Add Guest & Generate Pass"}
          </button>
        </form>
      </div>

      {/* Guest list */}
      {guests.length > 0 && (
        <div style={{ marginTop: "1.25rem" }}>
          <div style={{ fontSize: "0.7rem", fontWeight: 700, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: "0.75rem" }}>
            Your Guests ({guests.length})
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {guests.map((g, i) => (
              <div
                key={i}
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: "10px",
                  padding: "0.75rem 1rem",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                <div>
                  <div style={{ fontSize: "0.9rem", fontWeight: 600, color: "#fff" }}>{g.guestName}</div>
                  {g.guestEmail && <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.4)" }}>{g.guestEmail}</div>}
                </div>
                <div style={{ fontFamily: "monospace", fontSize: "0.8rem", color: CYAN, fontWeight: 700, letterSpacing: "0.08em", flexShrink: 0 }}>
                  {g.ticketCode}
                </div>
              </div>
            ))}
          </div>
          {loadingGuests && <div style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.3)", marginTop: "0.5rem" }}>Loading…</div>}
        </div>
      )}
    </div>
  );
}

// ── Standalone guest lookup (for already-registered staff) ─────────────

function GuestLookupPanel() {
  const [code, setCode] = useState("");
  const [confirmed, setConfirmed] = useState(false);

  if (confirmed) {
    return <GuestRegistrationPanel staffTicketCode={code.trim().toUpperCase()} staffName="" />;
  }

  return (
    <div
      style={{
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: "16px",
        padding: "1.5rem",
        width: "100%",
        maxWidth: "480px",
        marginTop: "2rem",
      }}
    >
      <div style={{ fontSize: "0.7rem", fontWeight: 700, color: GOLD, textTransform: "uppercase", letterSpacing: "0.15em", borderBottom: `1px solid ${GOLD}30`, paddingBottom: "0.4rem", marginBottom: "1rem" }}>
        Already Registered? Register a Guest
      </div>
      <p style={{ fontSize: "0.83rem", color: "rgba(255,255,255,0.45)", margin: "0 0 1rem" }}>
        Enter your STAFF ticket code to add guests to your credential.
      </p>
      <form onSubmit={e => { e.preventDefault(); if (code.trim()) setConfirmed(true); }} style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
        <div style={fieldStyle}>
          <label style={labelStyle}>Your Staff Ticket Code <span style={{ color: GOLD }}>*</span></label>
          <input
            type="text"
            className="staff-input"
            required
            value={code}
            onChange={e => setCode(e.target.value.toUpperCase())}
            placeholder="STAFF-XXXXXX"
            style={{ ...inputStyle, fontFamily: "monospace", letterSpacing: "0.08em" }}
          />
        </div>
        <button
          type="submit"
          style={{
            padding: "0.75rem",
            background: `linear-gradient(135deg, ${GOLD}, #b8922e)`,
            border: "none",
            borderRadius: "100px",
            color: "#0a0820",
            fontWeight: 700,
            fontSize: "0.9rem",
            cursor: "pointer",
            fontFamily: "inherit",
          }}
        >
          Continue to Guest Registration
        </button>
      </form>
    </div>
  );
}

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
  const [ticket, setTicket] = useState<TicketData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
          .staff-input:focus { border-color: ${CYAN} !important; }
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
          {/* Staff ticket */}
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
            style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.85rem", marginTop: "2rem" }}
          >
            <button
              onClick={() => window.print()}
              style={{ padding: "0.75rem 2.5rem", background: `linear-gradient(135deg, ${GOLD}, #b8922e)`, border: "none", borderRadius: "100px", color: "#0a0820", fontWeight: 700, fontSize: "0.95rem", cursor: "pointer", letterSpacing: "0.04em", fontFamily: "inherit" }}
            >
              Print Credential
            </button>
            <button
              onClick={() => { setTicket(null); setForm({ name: "", email: "", phone: "", role: "", emergencyContactName: "", emergencyContactPhone: "", dietaryNeeds: "" }); }}
              style={{ background: "none", border: "none", color: "rgba(255,255,255,0.45)", fontSize: "0.85rem", cursor: "pointer", textDecoration: "underline", fontFamily: "inherit" }}
            >
              Register another person
            </button>
          </div>

          {/* Guest registration panel — visible after getting your ticket */}
          <div className="no-print" style={{ width: "100%", maxWidth: "480px" }}>
            <div style={{ marginTop: "3rem", marginBottom: "1rem", textAlign: "center" }}>
              <div style={{ height: "1px", background: `linear-gradient(to right, transparent, rgba(255,255,255,0.12), transparent)`, marginBottom: "1.5rem" }} />
              <div style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.2em", color: "rgba(255,255,255,0.4)", textTransform: "uppercase" }}>
                ✦ BRING YOUR PEOPLE ✦
              </div>
              <h2 style={{ fontFamily: "var(--font-display, Georgia, serif)", fontSize: "1.5rem", fontWeight: 700, color: "#fff", margin: "0.5rem 0 0.25rem" }}>
                Register Your Guests
              </h2>
              <p style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.4)", margin: 0 }}>
                Staff may bring guests — each gets a free pass linked to your credential.
              </p>
            </div>
            <GuestRegistrationPanel staffTicketCode={ticket.ticketCode} staffName={ticket.name} />
          </div>
        </div>
      </>
    );
  }

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

            <div style={{ fontSize: "0.7rem", fontWeight: 700, color: CYAN, textTransform: "uppercase", letterSpacing: "0.15em", borderBottom: `1px solid ${CYAN}30`, paddingBottom: "0.4rem", marginTop: "0.25rem" }}>
              Additional Information
            </div>

            <div style={fieldStyle}>
              <label style={labelStyle} htmlFor="dietaryNeeds">Dietary Needs / Restrictions</label>
              <textarea id="dietaryNeeds" name="dietaryNeeds" className="staff-textarea" value={form.dietaryNeeds} onChange={handleChange} placeholder="Allergies, dietary restrictions, or preferences…" rows={3} style={{ ...inputStyle, resize: "vertical", minHeight: "80px" }} />
            </div>

            {error && (
              <div style={{ background: "rgba(220,80,80,0.12)", border: "1px solid rgba(220,80,80,0.3)", borderRadius: "8px", padding: "0.75rem 1rem", color: "#ff7070", fontSize: "0.88rem" }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="staff-submit"
              style={{
                width: "100%",
                padding: "0.9rem",
                background: loading ? "rgba(212,175,60,0.4)" : `linear-gradient(135deg, ${GOLD}, #b8922e)`,
                border: "none",
                borderRadius: "100px",
                color: loading ? "rgba(10,8,32,0.6)" : "#0a0820",
                fontWeight: 700,
                fontSize: "1rem",
                cursor: loading ? "not-allowed" : "pointer",
                letterSpacing: "0.04em",
                fontFamily: "inherit",
                transition: "all 0.2s",
                marginTop: "0.25rem",
              }}
            >
              {loading ? "Registering…" : "Register & Get My Pass"}
            </button>

            <p style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.3)", textAlign: "center", margin: 0 }}>
              Fields marked <span style={{ color: GOLD }}>*</span> are required.
              If you have already registered, your existing credential will be returned.
            </p>
          </form>

          {/* Already registered — guest lookup */}
          <GuestLookupPanel />
        </div>
      </div>
    </>
  );
}
