"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

const BASE_URL = "https://wellnessweekendak.com";

export default function JoinPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [referralCode, setReferralCode] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [memberCode, setMemberCode] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    try {
      const ref = localStorage.getItem("ww-ref");
      if (ref) setReferralCode(ref);
    } catch {
      // ignore
    }
  }, []);

  const referralUrl = memberCode ? `${BASE_URL}?ref=${memberCode}` : "";

  const copyLink = async () => {
    if (!referralUrl) return;
    await navigator.clipboard.writeText(referralUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Please enter your name.");
      return;
    }
    if (!email.trim()) {
      setError("Please enter your email.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/members/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          password,
          referralCode: referralCode || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Signup failed. Please try again.");
        return;
      }

      setMemberCode(data.code);
      // Clear referral code from localStorage now that signup succeeded
      try {
        localStorage.removeItem("ww-ref");
      } catch {
        // ignore
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Success state
  if (memberCode) {
    return (
      <div className="member-login">
        <div className="member-login-card member-success-card">
          <div className="member-brand" style={{ fontFamily: "var(--font-display)" }}>
            Wellness Weekend
          </div>
          <div style={{ fontSize: "2.5rem", marginBottom: "0.75rem" }}>✨</div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.75rem", color: "var(--forest)", fontWeight: 400, marginBottom: "0.5rem" }}>
            Welcome to the community!
          </h1>
          <p style={{ color: "var(--sage)", marginBottom: "1.5rem", fontSize: "0.95rem" }}>
            Your account is set up. Share your link below to earn 50 points for every friend who signs up.
          </p>

          <div className="member-referral-box">
            <p style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--sage)", marginBottom: "0.5rem" }}>
              Your Referral Link
            </p>
            <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", flexWrap: "wrap" }}>
              <code style={{
                flex: "1 1 200px",
                background: "var(--cream)",
                border: "1px solid rgba(107,127,96,0.2)",
                borderRadius: "8px",
                padding: "0.6rem 0.875rem",
                fontSize: "0.85rem",
                color: "var(--aurora)",
                wordBreak: "break-all",
              }}>
                {referralUrl}
              </code>
              <button
                onClick={copyLink}
                className="member-copy-btn"
                style={{
                  background: copied ? "rgba(139,95,191,0.15)" : "transparent",
                  border: "1px solid rgba(139,95,191,0.3)",
                  borderRadius: "8px",
                  padding: "0.6rem 1rem",
                  color: copied ? "var(--aurora)" : "var(--forest)",
                  cursor: "pointer",
                  fontFamily: "inherit",
                  fontSize: "0.85rem",
                  whiteSpace: "nowrap",
                  transition: "all 0.2s",
                }}
              >
                {copied ? "✓ Copied" : "Copy"}
              </button>
            </div>
          </div>

          <div style={{ display: "flex", gap: "0.75rem", marginTop: "1.5rem", flexWrap: "wrap" }}>
            <Link
              href="/members"
              style={{
                flex: 1,
                display: "block",
                textAlign: "center",
                padding: "0.8rem 1.5rem",
                background: "linear-gradient(135deg, var(--aurora), var(--psyche-pink))",
                color: "white",
                textDecoration: "none",
                borderRadius: "30px",
                fontWeight: 600,
                fontSize: "0.875rem",
                letterSpacing: "0.04em",
              }}
            >
              Go to Member Portal
            </Link>
            <Link
              href="/#store"
              style={{
                flex: 1,
                display: "block",
                textAlign: "center",
                padding: "0.8rem 1.5rem",
                background: "transparent",
                color: "var(--aurora)",
                border: "1px solid rgba(139,95,191,0.3)",
                textDecoration: "none",
                borderRadius: "30px",
                fontWeight: 600,
                fontSize: "0.875rem",
                letterSpacing: "0.04em",
              }}
            >
              Shop Tickets
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Signup form
  return (
    <div className="member-login">
      <div className="member-login-card">
        <div className="member-brand" style={{ fontFamily: "var(--font-display)" }}>
          Wellness Weekend
        </div>
        <h1 className="member-login-title">Create Your Account</h1>
        <p style={{ fontSize: "0.9rem", color: "var(--sage)", marginBottom: "1.5rem", textAlign: "center" }}>
          Earn points. Redeem rewards. Refer friends.
        </p>

        {referralCode && (
          <div style={{
            background: "rgba(139,95,191,0.07)",
            border: "1px solid rgba(139,95,191,0.2)",
            borderRadius: "10px",
            padding: "0.75rem 1rem",
            marginBottom: "1.25rem",
            fontSize: "0.875rem",
            color: "var(--aurora)",
            textAlign: "center",
          }}>
            You were referred by a friend — your referrer will earn 50 points when you sign up!
          </div>
        )}

        <form onSubmit={handleSubmit} className="member-login-form">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Full name"
            className="member-input"
            autoFocus
            required
            autoComplete="name"
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email address"
            className="member-input"
            required
            autoComplete="email"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password (min. 6 characters)"
            className="member-input"
            required
            autoComplete="new-password"
          />
          <input
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder="Confirm password"
            className="member-input"
            required
            autoComplete="new-password"
          />

          {error && (
            <p style={{
              color: "#c0392b",
              fontSize: "0.875rem",
              padding: "0.5rem 0.75rem",
              background: "rgba(192,57,43,0.07)",
              borderRadius: "6px",
              border: "1px solid rgba(192,57,43,0.15)",
            }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            className="member-login-btn"
            disabled={loading}
          >
            {loading ? "Creating account…" : "Create Account"}
          </button>
        </form>

        <p style={{ marginTop: "1.25rem", textAlign: "center", fontSize: "0.875rem", color: "var(--sage)" }}>
          Already have an account?{" "}
          <Link href="/members" style={{ color: "var(--aurora)", textDecoration: "none", fontWeight: 500 }}>
            Sign in
          </Link>
        </p>
        <p style={{ marginTop: "0.5rem", textAlign: "center", fontSize: "0.875rem", color: "var(--sage)" }}>
          <Link href="/" style={{ color: "var(--forest)", textDecoration: "none" }}>
            ← Back to site
          </Link>
        </p>
      </div>
    </div>
  );
}
