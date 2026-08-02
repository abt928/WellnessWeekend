"use client";
import { useRef, useState, useEffect, useCallback } from "react";
import Link from "next/link";

const C = {
  bg: "#F7F3EC",
  card: "#FBF9F4",
  charcoal: "#333533",
  muted: "rgba(51,53,51,0.6)",
  faint: "rgba(51,53,51,0.38)",
  forest: "#2E5D4B",
  teal: "#3DB8AF",
  gold: "#C9983F",
  border: "rgba(51,53,51,0.12)",
  error: "#B84A2B",
  errorBg: "rgba(184,74,43,0.07)",
  success: "#2E5D4B",
  successBg: "rgba(46,93,75,0.08)",
};

const TERMS = `WELLNESS WEEKEND 2026 — INSTRUCTOR AGREEMENT
Sound Healing Products LLC d/b/a Wellness Weekend
Warrior Lodge · Sutton, Alaska · August 7–9, 2026

By signing this agreement, you make a binding commitment as a confirmed facilitator at Wellness Weekend 2026.

──────────────────────────────────────────────

1. COMMITMENT TO YOUR SESSION
Your session is on the schedule. The community is counting on you. Once your session is confirmed and published, you are expected to show up and deliver it. This is not a casual arrangement — it is a commitment to the people who have planned their weekend around your offering.

Cancellation of your session is unacceptable. If you cannot attend for any reason, you must notify festival management in writing at support@thesoundspace.us as soon as possible. Cancellation without adequate notice and a legitimate reason is a violation of this agreement and may affect your eligibility for future Wellness Weekend events.

2. SCHEDULE CONFLICTS
Upon signing this agreement, you agree to immediately review the full festival schedule and notify festival management of any conflicts within 48 hours. Session times are accommodated on a best-effort basis before the schedule is finalized. No changes to the published schedule will be made within 30 days of the event.

3. ATTENDANCE & PUNCTUALITY
You agree to arrive at Warrior Lodge no later than one hour before your scheduled session. Late arrival without prior communication is not acceptable. If a genuine emergency prevents your attendance, contact festival management immediately at support@thesoundspace.us or (907) 600-4390 so that arrangements can be made for your participants.

4. FACILITATOR EXCHANGE
As a confirmed facilitator, you receive the following in exchange for your offering:

  • 1 full festival pass (3-day access, August 7–9, 2026)
  • 1 guest pass
  • One meal provided on the day of your session
  • Official Wellness Weekend 2026 T-shirt
  • Promotion across Wellness Weekend and Sound Space marketing channels
    (website, email, social media, and event materials)

5. VOLUNTEER EXCHANGE — NOT PAID EMPLOYMENT
Facilitator positions are offered as a volunteer exchange as described above. This agreement does not constitute an employment contract. Facilitators are independent participants, not employees, agents, or contractors of Sound Healing Products LLC.

If a specific compensation arrangement was proposed and approved by festival management prior to signing, those terms are documented separately. This agreement alone does not create a compensation obligation beyond the facilitator exchange above.

6. COMPENSATION REQUESTS
If you require a specific compensation arrangement beyond the facilitator exchange, submit your request in writing to support@thesoundspace.us before signing. Requests submitted after signing will not be considered for this event year. Our executive team reviews proposals and determines whether they can be incorporated into our programming and budget.

7. CONTENT & CONDUCT STANDARDS
You agree to deliver the session described in your application, as approved by festival management. Material deviations from your approved offering require prior written approval. Sessions that include content deemed harmful, unsafe, or inconsistent with Wellness Weekend's values may be stopped.

You are responsible for creating a safe, grounded, and inclusive container for all participants. Respect for boundaries, trauma-informed facilitation, and sensitivity to diverse backgrounds are expected at all times.

8. BRAND PARTNER OPPORTUNITY
Wellness Weekend offers facilitators the opportunity to be featured as a brand partner. Brand partners receive enhanced promotion including featured placement on the website, extended social media features, and co-branded marketing content. If you are interested in a brand partner arrangement, indicate your interest on this form and our team will follow up.

9. MEDIA & PROMOTION
By signing this agreement, you grant Sound Healing Products LLC a non-exclusive, royalty-free license to use photographs, video, and audio recordings of your session and likeness for promotional and marketing purposes, including social media, website, email marketing, and future event promotion. You will be credited by name.

10. ASSUMPTION OF RISK
The festival takes place outdoors in Alaska. You acknowledge that participation involves inherent risks including weather, terrain, and wildlife. You are responsible for your own safety and the safety of your session space and equipment.

11. INDEMNIFICATION
You agree to indemnify, defend, and hold harmless Sound Healing Products LLC, its organizers, volunteers, staff, partners, and the property owner (Warrior Lodge) from any and all claims, damages, losses, or expenses arising out of your participation, your session content, or any act or omission on your part or the part of your guests.

12. GOVERNING LAW
This agreement is governed by the laws of the State of Alaska. Any disputes shall be resolved in the courts of the Matanuska-Susitna Borough, Alaska.

──────────────────────────────────────────────

Questions? Contact us at support@thesoundspace.us or (907) 600-4390.`;

const inputStyle: React.CSSProperties = {
  width: "100%", padding: "0.875rem 1rem", background: "#fff",
  border: "1.5px solid rgba(51,53,51,0.18)", borderRadius: 10,
  fontSize: "0.95rem", color: C.charcoal, outline: "none",
  boxSizing: "border-box", fontFamily: "inherit",
};

const labelStyle: React.CSSProperties = {
  display: "block", fontSize: "0.78rem", fontWeight: 700,
  color: C.charcoal, letterSpacing: "0.07em", textTransform: "uppercase",
  marginBottom: "0.4rem",
};

const sectionHead: React.CSSProperties = {
  fontFamily: "var(--font-display)",
  fontSize: "1.15rem",
  color: C.charcoal,
  marginBottom: "0.35rem",
  paddingTop: "0.5rem",
};

function CheckRow({ checked, onChange, children }: {
  checked: boolean;
  onChange: (v: boolean) => void;
  children: React.ReactNode;
}) {
  return (
    <label style={{
      display: "flex", alignItems: "flex-start", gap: "0.85rem",
      padding: "1rem 1.1rem", background: checked ? "rgba(46,93,75,0.06)" : C.card,
      border: `1.5px solid ${checked ? C.forest : C.border}`,
      borderRadius: 10, cursor: "pointer", transition: "all 0.15s",
    }}>
      <input
        type="checkbox"
        checked={checked}
        onChange={e => onChange(e.target.checked)}
        style={{ marginTop: 3, accentColor: C.forest, width: 17, height: 17, flexShrink: 0, cursor: "pointer" }}
      />
      <span style={{ fontSize: "0.9rem", color: C.charcoal, lineHeight: 1.6 }}>{children}</span>
    </label>
  );
}

export default function InstructorAgreementPage() {
  const [fullName,      setFullName]      = useState("");
  const [email,         setEmail]         = useState("");
  const [phone,         setPhone]         = useState("");
  const [modality,      setModality]      = useState("");
  const [sessionTitle,  setSessionTitle]  = useState("");
  const [website,       setWebsite]       = useState("");
  const [bio,           setBio]           = useState("");
  const [heardFrom,     setHeardFrom]     = useState("");
  const [brandPartner,  setBrandPartner]  = useState<"yes" | "no" | "">("");

  const [termsRead,        setTermsRead]        = useState(false);
  const [checkVolunteer,   setCheckVolunteer]   = useState(false);
  const [checkCommit,      setCheckCommit]      = useState(false);
  const [checkSchedule,    setCheckSchedule]    = useState(false);
  const [checkMedia,       setCheckMedia]       = useState(false);

  const [printedName,  setPrintedName]  = useState("");
  const [hasSignature, setHasSignature] = useState(false);
  const [submitting,   setSubmitting]   = useState(false);
  const [submitted,    setSubmitted]    = useState(false);
  const [error,        setError]        = useState("");

  const canvasRef    = useRef<HTMLCanvasElement>(null);
  const isDrawing    = useRef(false);
  const termsBoxRef  = useRef<HTMLDivElement>(null);

  const [sigDate] = useState(() =>
    new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
  );

  // ── Signature canvas ──────────────────────────────────────────────────────
  const getPos = (e: MouseEvent | TouchEvent, canvas: HTMLCanvasElement) => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    if ("touches" in e) {
      const t = e.touches[0];
      return { x: (t.clientX - rect.left) * scaleX, y: (t.clientY - rect.top) * scaleY };
    }
    return { x: (e.clientX - rect.left) * scaleX, y: (e.clientY - rect.top) * scaleY };
  };

  const startDraw = useCallback((e: MouseEvent | TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    e.preventDefault();
    isDrawing.current = true;
    const ctx = canvas.getContext("2d")!;
    const { x, y } = getPos(e, canvas);
    ctx.beginPath();
    ctx.moveTo(x, y);
  }, []);

  const draw = useCallback((e: MouseEvent | TouchEvent) => {
    if (!isDrawing.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    e.preventDefault();
    const ctx = canvas.getContext("2d")!;
    ctx.strokeStyle = "#1a2a1a";
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    const { x, y } = getPos(e, canvas);
    ctx.lineTo(x, y);
    ctx.stroke();
    setHasSignature(true);
  }, []);

  const endDraw = useCallback(() => { isDrawing.current = false; }, []);

  const clearSig = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.getContext("2d")!.clearRect(0, 0, canvas.width, canvas.height);
    setHasSignature(false);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.addEventListener("mousedown",  startDraw);
    canvas.addEventListener("mousemove",  draw);
    canvas.addEventListener("mouseup",    endDraw);
    canvas.addEventListener("mouseleave", endDraw);
    canvas.addEventListener("touchstart", startDraw, { passive: false });
    canvas.addEventListener("touchmove",  draw,      { passive: false });
    canvas.addEventListener("touchend",   endDraw);
    return () => {
      canvas.removeEventListener("mousedown",  startDraw);
      canvas.removeEventListener("mousemove",  draw);
      canvas.removeEventListener("mouseup",    endDraw);
      canvas.removeEventListener("mouseleave", endDraw);
      canvas.removeEventListener("touchstart", startDraw);
      canvas.removeEventListener("touchmove",  draw);
      canvas.removeEventListener("touchend",   endDraw);
    };
  }, [startDraw, draw, endDraw]);

  const onTermsScroll = () => {
    const el = termsBoxRef.current;
    if (!el) return;
    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 10) setTermsRead(true);
  };

  const allChecked = checkVolunteer && checkCommit && checkSchedule && checkMedia;
  const canSubmit = termsRead && allChecked && hasSignature && printedName.trim() && !submitting;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!fullName.trim())     { setError("Full name is required."); return; }
    if (!email.trim())        { setError("Email address is required."); return; }
    if (!modality.trim())     { setError("Please enter your modality or offering."); return; }
    if (!termsRead)           { setError("Please scroll through and read the full agreement above."); return; }
    if (!allChecked)          { setError("Please confirm all four agreement items before signing."); return; }
    if (!hasSignature)        { setError("Please sign the agreement."); return; }
    if (!printedName.trim())  { setError("Please enter your printed name."); return; }

    const canvas = canvasRef.current;
    const signatureDataUrl = canvas ? canvas.toDataURL("image/png") : "";

    setSubmitting(true);
    try {
      const res = await fetch("/api/instructor-agreement", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          formType: "wellness-weekend-2026",
          fullName: fullName.trim(),
          email: email.trim(),
          phone: phone.trim(),
          modality: modality.trim(),
          sessionTitle: sessionTitle.trim(),
          website: website.trim(),
          bio: bio.trim(),
          heardFrom: heardFrom.trim(),
          brandPartner,
          printedName: printedName.trim(),
          sigDate,
          signatureDataUrl,
        }),
      });
      if (!res.ok) {
        const d = await res.json();
        setError(d.error || "Submission failed. Please try again.");
        setSubmitting(false);
        return;
      }
      setSubmitted(true);
    } catch {
      setError("Connection error. Please try again.");
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <main style={{ minHeight: "100vh", background: C.bg, display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
        <div style={{ maxWidth: 520, width: "100%", textAlign: "center" }}>
          <div style={{ fontSize: 52, marginBottom: "1rem" }}>🌿</div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.6rem,4vw,2.2rem)", color: C.charcoal, marginBottom: "0.75rem" }}>
            Agreement Received
          </h1>
          <p style={{ color: C.muted, lineHeight: 1.7, marginBottom: "0.75rem" }}>
            Thank you, {fullName.split(" ")[0]}. Your signed instructor agreement for Wellness Weekend 2026 has been received.
          </p>
          <p style={{ color: C.muted, lineHeight: 1.7, marginBottom: "2rem" }}>
            A confirmation will be sent to <strong>{email}</strong>. Please review the festival schedule and reach out to{" "}
            <a href="mailto:support@thesoundspace.us" style={{ color: C.teal }}>support@thesoundspace.us</a>{" "}
            if you have any conflicts.
          </p>
          <p style={{ color: C.forest, fontWeight: 700, fontSize: "0.95rem", marginBottom: "2rem", letterSpacing: "0.04em" }}>
            Commitment is the standard. See you August 7–9 at Warrior Lodge.
          </p>
          <Link href="/" style={{ color: C.teal, fontWeight: 600, textDecoration: "none" }}>
            ← Back to the festival
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main style={{ minHeight: "100vh", background: C.bg, padding: "0 0 5rem" }}>

      {/* Header */}
      <div style={{ background: C.charcoal, color: "#fff", padding: "3.5rem 1.5rem 3rem", textAlign: "center" }}>
        <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.78rem", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: "0.75rem" }}>
          Facilitator Agreement · Wellness Weekend 2026
        </p>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.9rem,5vw,2.8rem)", fontWeight: 600, marginBottom: "0.6rem" }}>
          Instructor Agreement
        </h1>
        <p style={{ color: "rgba(255,255,255,0.65)", fontSize: "1rem", maxWidth: 560, margin: "0 auto", lineHeight: 1.6 }}>
          Warrior Lodge · Sutton, Alaska · August 7–9, 2026
        </p>
        <div style={{ marginTop: "1.5rem", display: "inline-block", background: "rgba(255,255,255,0.08)", borderRadius: 8, padding: "0.55rem 1.1rem" }}>
          <p style={{ color: "rgba(255,255,255,0.8)", fontSize: "0.85rem", margin: 0, fontStyle: "italic" }}>
            Cancellations are unacceptable. Commitment is the standard.
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 700, margin: "0 auto", padding: "2.5rem 1.25rem 0" }}>
        <form onSubmit={handleSubmit}>

          {/* ── Section 1: Your Info ── */}
          <h2 style={sectionHead}>Your Information</h2>
          <p style={{ color: C.muted, fontSize: "0.84rem", marginBottom: "1.25rem" }}>
            This agreement is for confirmed instructors only. If you haven&apos;t been confirmed, contact{" "}
            <a href="mailto:support@thesoundspace.us" style={{ color: C.teal }}>support@thesoundspace.us</a>.
          </p>

          <div style={{ display: "grid", gap: "0.85rem", marginBottom: "2rem" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.85rem" }}>
              <div>
                <label style={labelStyle}>Full Name *</label>
                <input required style={inputStyle} placeholder="Your full legal name" value={fullName} onChange={e => setFullName(e.target.value)} />
              </div>
              <div>
                <label style={labelStyle}>Email *</label>
                <input required type="email" style={inputStyle} placeholder="you@email.com" value={email} onChange={e => setEmail(e.target.value)} />
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.85rem" }}>
              <div>
                <label style={labelStyle}>Phone</label>
                <input type="tel" style={inputStyle} placeholder="(907) 555-0100" value={phone} onChange={e => setPhone(e.target.value)} />
              </div>
              <div>
                <label style={labelStyle}>Modality / Offering *</label>
                <input required style={inputStyle} placeholder="Sound healing, yoga, breathwork…" value={modality} onChange={e => setModality(e.target.value)} />
              </div>
            </div>
            <div>
              <label style={labelStyle}>Session Title</label>
              <input style={inputStyle} placeholder="e.g. Isha Kriya Meditation, Intro Aerial Silks" value={sessionTitle} onChange={e => setSessionTitle(e.target.value)} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.85rem" }}>
              <div>
                <label style={labelStyle}>Website / Social</label>
                <input style={inputStyle} placeholder="https://" value={website} onChange={e => setWebsite(e.target.value)} />
              </div>
              <div>
                <label style={labelStyle}>How did you hear about Wellness Weekend?</label>
                <input style={inputStyle} placeholder="Friend, social media, etc." value={heardFrom} onChange={e => setHeardFrom(e.target.value)} />
              </div>
            </div>
            <div>
              <label style={labelStyle}>Short Bio (for promotion)</label>
              <textarea rows={3} style={{ ...inputStyle, resize: "vertical" }} placeholder="2–3 sentences we can use on the website and in social media promotion." value={bio} onChange={e => setBio(e.target.value)} />
            </div>
          </div>

          {/* ── Section 2: Compensation & Participation ── */}
          <h2 style={sectionHead}>Compensation & Participation</h2>
          <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "1.4rem 1.5rem", marginBottom: "1rem" }}>
            <p style={{ fontWeight: 700, color: C.charcoal, fontSize: "0.95rem", marginBottom: "0.5rem" }}>Facilitator Exchange</p>
            <p style={{ color: C.muted, fontSize: "0.87rem", marginBottom: "0.85rem", lineHeight: 1.6 }}>
              Wellness Weekend instructors participate as <strong style={{ color: C.charcoal }}>volunteer facilitators</strong> and receive the following in exchange for their offering:
            </p>
            <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "grid", gap: "0.4rem" }}>
              {[
                ["1 full festival pass", "3-day access, August 7–9, 2026"],
                ["1 guest pass", "Bring someone to share the weekend"],
                ["One meal provided", "On the day of your session"],
                ["Official WW 2026 T-shirt", "Included for all confirmed facilitators"],
                ["Promotion across all channels", "Wellness Weekend website, email, and social media"],
              ].map(([bold, rest]) => (
                <li key={bold} style={{ display: "flex", gap: "0.5rem", fontSize: "0.87rem", color: C.muted, alignItems: "baseline" }}>
                  <span style={{ color: C.forest, fontWeight: 700, flexShrink: 0 }}>•</span>
                  <span><strong style={{ color: C.charcoal }}>{bold}</strong> — {rest}</span>
                </li>
              ))}
            </ul>
          </div>

          <div style={{ marginBottom: "2rem" }}>
            <CheckRow checked={checkVolunteer} onChange={setCheckVolunteer}>
              I understand that facilitator positions are offered as a <strong>volunteer exchange</strong> and not paid employment. The benefits listed above are my compensation for this event year.
            </CheckRow>
          </div>

          {/* Compensation Requests */}
          <div style={{ background: "#f9f7f2", border: `1px solid ${C.border}`, borderRadius: 10, padding: "1.1rem 1.3rem", marginBottom: "1.5rem" }}>
            <p style={{ fontWeight: 700, color: C.charcoal, fontSize: "0.88rem", marginBottom: "0.4rem" }}>Compensation Requests</p>
            <p style={{ color: C.muted, fontSize: "0.83rem", lineHeight: 1.65, margin: 0 }}>
              If you require a specific compensation arrangement, submit your request in writing before signing this agreement.
              Requests submitted after signing will not be considered.{" "}
              <a href="mailto:support@thesoundspace.us" style={{ color: C.teal }}>support@thesoundspace.us</a>
            </p>
          </div>

          {/* Brand Partner */}
          <div style={{ marginBottom: "2rem" }}>
            <h2 style={{ ...sectionHead, fontSize: "1rem", marginBottom: "0.6rem" }}>Brand Partner Opportunity</h2>
            <p style={{ color: C.muted, fontSize: "0.84rem", lineHeight: 1.65, marginBottom: "0.85rem" }}>
              Facilitators may be featured as brand partners with enhanced promotion — featured website placement, extended social features, and co-branded content. Interested?
            </p>
            <div style={{ display: "flex", gap: "0.65rem" }}>
              {(["yes", "no"] as const).map(v => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setBrandPartner(v)}
                  style={{
                    padding: "0.6rem 1.4rem",
                    border: `1.5px solid ${brandPartner === v ? C.forest : C.border}`,
                    borderRadius: 8, background: brandPartner === v ? "rgba(46,93,75,0.07)" : C.card,
                    color: brandPartner === v ? C.forest : C.muted,
                    fontWeight: 700, fontSize: "0.88rem", cursor: "pointer",
                    transition: "all 0.15s",
                  }}
                >
                  {v === "yes" ? "Yes, I'm interested" : "No thanks"}
                </button>
              ))}
            </div>
          </div>

          {/* ── Section 3: Agreement Terms ── */}
          <h2 style={sectionHead}>Instructor Agreement Terms</h2>
          <p style={{ color: C.muted, fontSize: "0.84rem", marginBottom: "0.75rem" }}>
            Please read the full agreement before checking the boxes below. Scroll to the bottom to unlock.
          </p>

          <div
            ref={termsBoxRef}
            onScroll={onTermsScroll}
            style={{
              height: 280, overflowY: "auto", background: "#fff",
              border: `1.5px solid ${termsRead ? C.forest : C.border}`,
              borderRadius: 10, padding: "1.1rem 1.3rem",
              fontSize: "0.8rem", color: C.charcoal, lineHeight: 1.75,
              whiteSpace: "pre-wrap", fontFamily: "monospace",
              marginBottom: "0.6rem",
            }}
          >
            {TERMS}
          </div>
          {!termsRead && (
            <p style={{ color: C.gold, fontSize: "0.78rem", marginBottom: "1.25rem" }}>
              Scroll to the bottom to confirm you have read the full agreement.
            </p>
          )}
          {termsRead && (
            <p style={{ color: C.forest, fontSize: "0.78rem", fontWeight: 600, marginBottom: "1.25rem" }}>
              Agreement read ✓
            </p>
          )}

          <div style={{ display: "grid", gap: "0.65rem", marginBottom: "2rem", opacity: termsRead ? 1 : 0.45, pointerEvents: termsRead ? "auto" : "none" }}>
            <CheckRow checked={checkCommit} onChange={setCheckCommit}>
              I commit to showing up and delivering my session as scheduled. I understand that <strong>cancellation of my session is unacceptable</strong> and a violation of this agreement. If an emergency arises, I will notify festival management immediately in writing.
            </CheckRow>
            <CheckRow checked={checkSchedule} onChange={setCheckSchedule}>
              I agree to review the full festival schedule upon signing and notify festival management of any conflicts within 48 hours. I understand that no schedule changes will be made within 30 days of the event.
            </CheckRow>
            <CheckRow checked={checkMedia} onChange={setCheckMedia}>
              I grant Sound Healing Products LLC permission to use photographs, video, and recordings of my session and likeness for promotional and marketing purposes.
            </CheckRow>
          </div>

          {/* ── Section 4: Signature ── */}
          <h2 style={sectionHead}>Signature</h2>
          <p style={{ color: C.muted, fontSize: "0.84rem", marginBottom: "0.75rem" }}>
            Sign below using your mouse or finger. This constitutes your legally binding agreement.
          </p>

          <div style={{
            border: `1.5px solid ${hasSignature ? C.forest : C.border}`,
            borderRadius: 10, background: "#fff", overflow: "hidden",
            marginBottom: "0.5rem", position: "relative",
          }}>
            {!hasSignature && (
              <p style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", color: C.faint, fontSize: "0.88rem", pointerEvents: "none", margin: 0, whiteSpace: "nowrap" }}>
                Draw your signature here
              </p>
            )}
            <canvas ref={canvasRef} width={1200} height={220} style={{ width: "100%", height: 130, display: "block", touchAction: "none", cursor: "crosshair" }} />
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "1.5rem" }}>
            <button type="button" onClick={clearSig} style={{ background: "none", border: "none", color: C.muted, fontSize: "0.8rem", cursor: "pointer", textDecoration: "underline" }}>
              Clear signature
            </button>
          </div>

          <div style={{ marginBottom: "0.85rem" }}>
            <label style={labelStyle}>Printed Name *</label>
            <input
              required
              style={inputStyle}
              placeholder="Type your full name exactly as shown above"
              value={printedName}
              onChange={e => setPrintedName(e.target.value)}
            />
          </div>

          <div style={{ marginBottom: "2rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span style={{ fontSize: "0.82rem", color: C.muted }}>Date:</span>
            <span style={{ fontSize: "0.88rem", fontWeight: 600, color: C.charcoal }}>{sigDate}</span>
          </div>

          {error && (
            <div style={{ color: C.error, background: C.errorBg, border: `1px solid ${C.error}30`, borderRadius: 8, padding: "0.75rem 1rem", fontSize: "0.875rem", marginBottom: "1rem" }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={!canSubmit}
            style={{
              width: "100%", padding: "1.05rem",
              background: canSubmit ? C.forest : C.charcoal,
              color: "#fff", border: "none", borderRadius: 12,
              fontSize: "1rem", fontWeight: 700, letterSpacing: "0.03em",
              cursor: canSubmit ? "pointer" : "not-allowed",
              opacity: canSubmit ? 1 : 0.45,
              transition: "all 0.2s",
            }}
          >
            {submitting ? "Submitting Agreement…" : "Sign & Submit Instructor Agreement"}
          </button>

          <p style={{ color: C.faint, fontSize: "0.78rem", textAlign: "center", marginTop: "0.85rem", lineHeight: 1.5 }}>
            By submitting, you agree to all terms above. This is a binding commitment.
            Contact <a href="mailto:support@thesoundspace.us" style={{ color: C.teal }}>support@thesoundspace.us</a> with questions.
          </p>
        </form>

        <div style={{ textAlign: "center", marginTop: "2.5rem" }}>
          <Link href="/" style={{ color: C.teal, fontSize: "0.875rem", textDecoration: "none" }}>
            ← Back to the festival
          </Link>
        </div>
      </div>
    </main>
  );
}
