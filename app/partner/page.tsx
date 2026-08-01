"use client";

import { useState } from "react";
import Link from "next/link";

type Stage = "enter" | "preview" | "full" | "form" | "success" | "error";

interface CodeInfo {
  partner_name: string;
  benefit: string;
  uses_remaining: number;
  max_uses: number;
  full: boolean;
}

export default function PartnerPage() {
  const [stage, setStage] = useState<Stage>("enter");
  const [code, setCode] = useState("");
  const [info, setInfo] = useState<CodeInfo | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  async function checkCode(e: React.FormEvent) {
    e.preventDefault();
    if (!code.trim()) return;
    setLoading(true);
    setErrorMsg("");
    try {
      const res = await fetch(`/api/partner-codes?code=${encodeURIComponent(code.trim())}`);
      const d = await res.json();
      if (!res.ok) { setErrorMsg(d.error || "Invalid code."); setStage("error"); setLoading(false); return; }
      setInfo(d);
      setStage(d.full ? "full" : "preview");
    } catch {
      setErrorMsg("Connection error — please try again.");
      setStage("error");
    }
    setLoading(false);
  }

  async function redeem(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    try {
      const res = await fetch("/api/partner-codes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: code.trim(), name: name.trim(), email: email.trim() }),
      });
      const d = await res.json();
      if (!res.ok) { setErrorMsg(d.error || "Something went wrong."); setLoading(false); return; }
      setStage("success");
    } catch {
      setErrorMsg("Connection error — please try again.");
    }
    setLoading(false);
  }

  return (
    <main style={{
      minHeight: "100vh",
      background: "radial-gradient(ellipse at 50% 0%, rgba(134,239,172,0.08) 0%, #0a0a14 55%)",
      display: "flex", flexDirection: "column", alignItems: "center",
      justifyContent: "center", padding: "2rem 1.25rem",
    }}>
      <div style={{ maxWidth: 480, width: "100%" }}>

        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <Link href="/" style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.35)", textDecoration: "none", letterSpacing: "0.08em", textTransform: "uppercase" }}>
            ← Wellness Weekend
          </Link>
        </div>

        {/* ── ENTER CODE ── */}
        {(stage === "enter" || stage === "error") && (
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "3.5rem", marginBottom: "1rem" }}>🤝</div>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.8rem,5vw,2.5rem)", color: "#fff", marginBottom: "0.5rem", fontWeight: 700 }}>
              Partner Access
            </h1>
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.95rem", lineHeight: 1.6, marginBottom: "2rem" }}>
              Have a partner code? Enter it below to claim your access to Wellness Weekend 2026.
            </p>
            <form onSubmit={checkCode} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <input
                type="text"
                placeholder="Enter your partner code"
                value={code}
                onChange={e => setCode(e.target.value.toUpperCase())}
                autoFocus
                style={{
                  padding: "1rem 1.25rem", borderRadius: "12px", fontSize: "1.1rem",
                  textAlign: "center", letterSpacing: "0.12em", fontWeight: 600,
                  background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.15)",
                  color: "#fff", outline: "none",
                }}
              />
              {stage === "error" && (
                <p style={{ color: "#f87171", fontSize: "0.875rem", background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.2)", borderRadius: "8px", padding: "0.65rem 1rem", margin: 0 }}>
                  {errorMsg}
                </p>
              )}
              <button
                type="submit"
                disabled={loading || !code.trim()}
                style={{
                  padding: "1rem", borderRadius: "30px", border: "none", cursor: loading ? "not-allowed" : "pointer",
                  background: "linear-gradient(135deg, #86efac, #4ade80)",
                  color: "#0a0a14", fontWeight: 800, fontSize: "1rem", letterSpacing: "0.02em",
                  opacity: loading || !code.trim() ? 0.6 : 1,
                }}
              >
                {loading ? "Checking…" : "Unlock Access →"}
              </button>
            </form>
          </div>
        )}

        {/* ── CODE FULL ── */}
        {stage === "full" && info && (
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🔒</div>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.6rem", color: "#fff", marginBottom: "0.5rem" }}>
              Code Fully Used
            </h2>
            <p style={{ color: "rgba(255,255,255,0.5)", lineHeight: 1.6, marginBottom: "1.5rem" }}>
              All {info.max_uses} spots for this partner code have been claimed.
            </p>
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.85rem" }}>
              Questions? Email{" "}
              <a href="mailto:support@thesoundspace.us" style={{ color: "#86efac" }}>support@thesoundspace.us</a>.
            </p>
          </div>
        )}

        {/* ── PREVIEW ── */}
        {stage === "preview" && info && (
          <div>
            <div style={{ textAlign: "center", marginBottom: "2rem" }}>
              <div style={{ fontSize: "4rem", marginBottom: "0.75rem" }}>🌿</div>
              <p style={{ fontSize: "0.72rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "#86efac", fontWeight: 600, marginBottom: "0.5rem" }}>
                {info.partner_name} invites you
              </p>
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.6rem,5vw,2.2rem)", color: "#fff", marginBottom: "0.75rem", fontWeight: 700 }}>
                {info.benefit}
              </h2>
              <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.85rem" }}>
                {info.uses_remaining} of {info.max_uses} spots remaining
              </p>
            </div>

            <div style={{
              background: "rgba(134,239,172,0.05)", border: "1px solid rgba(134,239,172,0.2)",
              borderRadius: "16px", padding: "1.75rem",
            }}>
              <p style={{ fontSize: "0.75rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", marginBottom: "1.25rem", fontWeight: 600 }}>
                Claim your access
              </p>
              <form onSubmit={redeem} style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
                <input
                  required type="text" placeholder="Your full name"
                  value={name} onChange={e => setName(e.target.value)}
                  style={inputStyle}
                />
                <input
                  required type="email" placeholder="Email address"
                  value={email} onChange={e => setEmail(e.target.value)}
                  style={inputStyle}
                />
                {errorMsg && (
                  <p style={{ color: "#f87171", fontSize: "0.85rem", background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.2)", borderRadius: "8px", padding: "0.65rem 1rem", margin: 0 }}>
                    {errorMsg}
                  </p>
                )}
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    marginTop: "0.25rem", padding: "0.95rem", borderRadius: "30px", border: "none",
                    cursor: loading ? "not-allowed" : "pointer",
                    background: "linear-gradient(135deg, #86efac, #4ade80)",
                    color: "#0a0a14", fontWeight: 800, fontSize: "1rem",
                    opacity: loading ? 0.6 : 1,
                  }}
                >
                  {loading ? "Claiming…" : "Claim My Access →"}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* ── SUCCESS ── */}
        {stage === "success" && info && (
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>🎉</div>
            <p style={{ fontSize: "0.72rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "#86efac", fontWeight: 600, marginBottom: "0.5rem" }}>
              Access confirmed!
            </p>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.6rem,5vw,2.2rem)", color: "#fff", marginBottom: "0.75rem", fontWeight: 700 }}>
              You&apos;re in.
            </h2>
            <p style={{ color: "rgba(255,255,255,0.5)", lineHeight: 1.7, marginBottom: "2rem", maxWidth: 360, margin: "0 auto 2rem" }}>
              A confirmation will be sent to <strong style={{ color: "#fff" }}>{email}</strong>.
              If you have questions, reach out at{" "}
              <a href="mailto:support@thesoundspace.us" style={{ color: "#86efac" }}>support@thesoundspace.us</a>.
            </p>
            <Link
              href="/"
              style={{
                display: "inline-block", padding: "0.85rem 2rem", borderRadius: "30px",
                background: "linear-gradient(135deg, #86efac, #4ade80)",
                color: "#0a0a14", fontWeight: 700, textDecoration: "none", fontSize: "0.95rem",
              }}
            >
              Back to Wellness Weekend →
            </Link>
          </div>
        )}

      </div>
    </main>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%", padding: "0.85rem 1rem", borderRadius: "10px",
  background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)",
  color: "#fff", fontSize: "0.95rem", outline: "none", boxSizing: "border-box",
};
