"use client";
import { useState } from "react";
import Link from "next/link";

const C = {
  bg: "#F7F3EC",
  card: "#FBF9F4",
  charcoal: "#333533",
  muted: "rgba(51,53,51,0.6)",
  faint: "rgba(51,53,51,0.38)",
  gold: "#C9983F",
  orange: "#FF6B35",
  border: "rgba(51,53,51,0.12)",
  error: "#B84A2B",
  errorBg: "rgba(184,74,43,0.07)",
};

const MODALITIES = [
  "Sound Healing", "Yoga", "Meditation", "Ecstatic Dance", "Breathwork",
  "Movement / Somatic", "Aerial Arts", "Paddleboard / SUP Yoga",
  "Massage / Bodywork", "Reiki / Energy Work", "Ceremony / Ritual",
  "Plant Medicine", "Music / Performance", "Other",
];

export default function InstructorsPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [modality, setModality] = useState("");
  const [customModality, setCustomModality] = useState("");
  const [yearsTeaching, setYearsTeaching] = useState("");
  const [website, setWebsite] = useState("");
  const [offering, setOffering] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const finalModality = modality === "Other" ? customModality : modality;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!finalModality.trim()) { setError("Please enter your modality."); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/instructor-waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim() || undefined,
          modality: finalModality.trim(),
          yearsTeaching: yearsTeaching ? parseInt(yearsTeaching, 10) : undefined,
          website: website.trim() || undefined,
          offering: offering.trim(),
          interestedIn2026: false,
          interestedIn2027: true,
        }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Something went wrong. Please try again."); return; }
      setSubmitted(true);
    } catch {
      setError("Unable to submit. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <nav style={{ background: C.bg, borderBottom: `1px solid ${C.border}`, padding: "0.9rem 1.5rem" }}>
        <Link href="/" style={{ fontSize: "0.85rem", color: C.muted, textDecoration: "none" }}>
          ← Back to Wellness Weekend
        </Link>
      </nav>

      <main style={{ minHeight: "100vh", background: C.bg, padding: "3rem 1.5rem 6rem" }}>
        <div style={{ maxWidth: "680px", margin: "0 auto" }}>

          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <p style={{ fontSize: "0.7rem", letterSpacing: "0.14em", textTransform: "uppercase", color: C.gold, marginBottom: "0.75rem", fontWeight: 600 }}>
              2027 · Sutton, Alaska
            </p>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 700, lineHeight: 1.15, color: C.charcoal, marginBottom: "1rem" }}>
              Teach at Wellness Weekend.
            </h1>
            <p style={{ fontSize: "1rem", lineHeight: 1.75, color: C.muted, maxWidth: "520px", margin: "0 auto" }}>
              We're building our 2027 lineup of instructors, facilitators, and performers.
              Apply below — we'll follow up with schedule details and compensation.
            </p>
          </div>

          {/* Stats */}
          <div style={{ display: "flex", gap: "2rem", justifyContent: "center", marginBottom: "3rem", flexWrap: "wrap" }}>
            {[["3", "Days"], ["500+", "2027 Capacity"], ["5th", "Annual"], ["25+", "Practitioners / yr"]].map(([n, l]) => (
              <div key={l} style={{ textAlign: "center" }}>
                <div style={{ fontFamily: "var(--font-display)", fontSize: "1.6rem", fontWeight: 800, background: `linear-gradient(135deg, ${C.gold}, ${C.orange})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{n}</div>
                <div style={{ fontSize: "0.72rem", color: C.faint, letterSpacing: "0.06em", textTransform: "uppercase" }}>{l}</div>
              </div>
            ))}
          </div>

          {/* Form */}
          {submitted ? (
            <div style={{ textAlign: "center", background: C.card, border: `1px solid rgba(201,152,63,0.35)`, borderRadius: "16px", padding: "3rem 2rem" }}>
              <p style={{ fontSize: "0.7rem", letterSpacing: "0.14em", textTransform: "uppercase", color: C.gold, marginBottom: "0.75rem", fontWeight: 600 }}>Application Received ✦</p>
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.8rem", fontWeight: 700, color: C.charcoal, marginBottom: "0.75rem" }}>
                Thank you, {name.split(" ")[0]}.
              </h2>
              <p style={{ fontSize: "1rem", color: C.muted, lineHeight: 1.75, maxWidth: "420px", margin: "0 auto 2rem" }}>
                We'll review your application and reach out at <strong style={{ color: C.charcoal }}>{email}</strong> with schedule and compensation details for 2027.
              </p>
              <Link href="/" style={{ display: "inline-block", padding: "0.75rem 2rem", background: `linear-gradient(135deg, ${C.gold}, ${C.orange})`, color: "#fff", fontWeight: 700, fontSize: "0.95rem", borderRadius: "30px", textDecoration: "none" }}>
                Back to Wellness Weekend →
              </Link>
            </div>
          ) : (
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: "20px", padding: "2.5rem 2rem" }}>
              <p style={{ fontSize: "0.7rem", letterSpacing: "0.14em", textTransform: "uppercase", color: C.gold, marginBottom: "0.5rem", fontWeight: 600 }}>Instructor Application</p>
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", fontWeight: 700, color: C.charcoal, marginBottom: "0.5rem" }}>Apply for 2027</h2>
              <p style={{ fontSize: "0.9rem", color: C.muted, marginBottom: "2rem" }}>Tell us about what you teach and we'll be in touch.</p>

              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                {/* Name + Email */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                  <Field label="Full Name">
                    <input type="text" required value={name} onChange={e => setName(e.target.value)} placeholder="Your name" style={inp} />
                  </Field>
                  <Field label="Email Address">
                    <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" style={inp} />
                  </Field>
                </div>

                {/* Phone + Website */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                  <Field label="Phone" hint="Optional">
                    <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="(907) 555-0100" style={inp} />
                  </Field>
                  <Field label="Website / Social" hint="Optional">
                    <input type="url" value={website} onChange={e => setWebsite(e.target.value)} placeholder="https://..." style={inp} />
                  </Field>
                </div>

                {/* Modality */}
                <Field label="Your Modality / Practice">
                  <select required value={modality} onChange={e => setModality(e.target.value)} style={{ ...inp, appearance: "none" as React.CSSProperties["appearance"] }}>
                    <option value="">Select a modality…</option>
                    {MODALITIES.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                </Field>
                {modality === "Other" && (
                  <Field label="Describe Your Modality">
                    <input type="text" required value={customModality} onChange={e => setCustomModality(e.target.value)} placeholder="e.g. Contact improvisation, Qi Gong…" style={inp} />
                  </Field>
                )}

                {/* Years + Offering */}
                <Field label="Years Teaching" hint="Optional">
                  <input type="number" min="0" max="50" value={yearsTeaching} onChange={e => setYearsTeaching(e.target.value)} placeholder="e.g. 5" style={{ ...inp, maxWidth: "120px" }} />
                </Field>

                <Field label="What would you offer at Wellness Weekend?">
                  <textarea required value={offering} onChange={e => setOffering(e.target.value)} rows={4} placeholder="Describe the class, session, or experience you'd facilitate — format, duration, number of participants…" style={{ ...inp, resize: "vertical", lineHeight: 1.6 }} />
                </Field>

                {error && (
                  <p style={{ fontSize: "0.9rem", color: C.error, background: C.errorBg, border: `1px solid rgba(184,74,43,0.2)`, borderRadius: "8px", padding: "0.75rem 1rem", margin: 0 }}>{error}</p>
                )}

                <button type="submit" disabled={loading} style={{ padding: "0.95rem 2rem", background: loading ? `rgba(201,152,63,0.5)` : `linear-gradient(135deg, ${C.gold}, ${C.orange})`, color: "#fff", fontWeight: 700, fontSize: "1rem", border: "none", borderRadius: "30px", cursor: loading ? "not-allowed" : "pointer", letterSpacing: "0.03em" }}>
                  {loading ? "Submitting…" : "Apply to Teach in 2027 →"}
                </button>

                <p style={{ fontSize: "0.8rem", color: C.faint, textAlign: "center" }}>
                  Questions? <a href="mailto:support@thesoundspace.us" style={{ color: C.gold }}>support@thesoundspace.us</a>
                </p>
              </form>
            </div>
          )}
        </div>
      </main>
    </>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
      <label style={{ fontSize: "0.72rem", letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(51,53,51,0.55)", fontWeight: 600 }}>
        {label}{hint && <span style={{ fontWeight: 400, textTransform: "none", letterSpacing: 0, marginLeft: "0.4rem", color: "rgba(51,53,51,0.4)" }}> — {hint}</span>}
      </label>
      {children}
    </div>
  );
}

const inp: React.CSSProperties = {
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
