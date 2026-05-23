"use client";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

interface AffiliateInfo {
  name: string;
  email: string;
  code: string;
  company: string | null;
  commissionPct: number;
  status: string;
}

interface Stats {
  clicks: number;
  leads: number;
  purchases: number;
  totalRevenueCents: number;
  totalCommissionCents: number;
}

interface Event {
  id: number;
  eventType: string;
  orderAmountCents: number | null;
  commissionCents: number | null;
  email: string | null;
  createdAt: string;
}

function centsToUSD(cents: number) {
  return `$${(cents / 100).toFixed(2)}`;
}

export default function AffiliatePage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [checking, setChecking] = useState(true);
  const [affiliate, setAffiliate] = useState<AffiliateInfo | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const referralUrl = affiliate
    ? `https://wellnessweekendak.com?ref=${affiliate.code}`
    : "";

  const fetchStats = useCallback(async () => {
    const res = await fetch("/api/affiliates/stats");
    if (res.ok) {
      const data = await res.json();
      setAffiliate(data.affiliate);
      setStats(data.stats);
      setEvents(data.recentEvents || []);
    } else if (res.status === 401) {
      setAuthenticated(false);
    }
  }, []);

  useEffect(() => {
    fetch("/api/affiliates/auth")
      .then(async (r) => {
        if (r.ok) {
          setAuthenticated(true);
          await fetchStats();
        }
      })
      .finally(() => setChecking(false));
  }, [fetchStats]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError("");
    const res = await fetch("/api/affiliates/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (res.ok) {
      setAuthenticated(true);
      await fetchStats();
    } else {
      const data = await res.json();
      setLoginError(data.error || "Login failed");
    }
    setLoginLoading(false);
  };

  const handleLogout = async () => {
    await fetch("/api/affiliates/auth", { method: "DELETE" });
    setAuthenticated(false);
    setAffiliate(null);
    setStats(null);
  };

  const copyLink = async () => {
    await navigator.clipboard.writeText(referralUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (checking) {
    return <div className="admin-login"><div className="admin-login-card"><p style={{ color: "var(--ink-muted)" }}>Loading…</p></div></div>;
  }

  if (!authenticated) {
    return (
      <div className="admin-login">
        <div className="admin-login-card">
          <div className="admin-login-logo" style={{ fontFamily: "var(--font-display)" }}>
            Wellness Weekend
          </div>
          <h1 className="admin-login-title">Partner Portal</h1>
          <form onSubmit={handleLogin} className="admin-login-form">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              className="admin-input"
              autoFocus
              required
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="admin-input"
              required
            />
            {loginError && <p className="admin-error">{loginError}</p>}
            <button type="submit" className="admin-login-btn" disabled={loginLoading}>
              {loginLoading ? "Signing in…" : "Sign In"}
            </button>
          </form>
          <p style={{ marginTop: "1.5rem", textAlign: "center", fontSize: "0.875rem", color: "var(--ink-muted)" }}>
            Not a partner yet?{" "}
            <Link href="/affiliates/apply" style={{ color: "var(--psyche-cyan)" }}>Apply here</Link>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <header className="admin-header">
        <div>
          <h1 className="admin-brand" style={{ fontFamily: "var(--font-display)" }}>
            {affiliate?.company || affiliate?.name || "Partner"}
          </h1>
          <span className="admin-badge" style={{
            background: affiliate?.status === "active" ? "rgba(61,184,175,0.15)" : "rgba(255,165,0,0.15)",
            color: affiliate?.status === "active" ? "#3DB8AF" : "#FFB347",
            borderColor: affiliate?.status === "active" ? "#3DB8AF" : "#FFB347",
          }}>
            {affiliate?.status === "active" ? "Active" : "Pending Approval"}
          </span>
        </div>
        <div className="admin-header-actions">
          <button onClick={handleLogout} className="admin-logout-btn">Sign Out</button>
        </div>
      </header>

      {affiliate?.status === "pending" && (
        <div className="admin-status-bar" style={{ background: "rgba(255,165,0,0.1)", color: "#FFB347", borderColor: "rgba(255,165,0,0.2)" }}>
          ⏳ Your application is under review. You&apos;ll be approved within 1–2 business days. Contact us at support@thesoundspace.us with questions.
        </div>
      )}

      {/* Referral Link */}
      <div style={{ padding: "1.5rem 2rem", borderBottom: "1px solid var(--line-subtle)" }}>
        <p style={{ fontSize: "0.75rem", color: "var(--ink-muted)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "0.5rem" }}>
          Your Referral Link · {affiliate?.commissionPct}% commission on ticket sales
        </p>
        <div style={{ display: "flex", gap: "0.75rem", alignItems: "center", flexWrap: "wrap" }}>
          <code style={{
            background: "rgba(255,255,255,0.05)", border: "1px solid var(--line-medium)",
            borderRadius: "8px", padding: "0.6rem 1rem", fontSize: "0.9rem",
            color: "var(--psyche-cyan)", flex: "1 1 300px", wordBreak: "break-all"
          }}>
            {referralUrl}
          </code>
          <button
            onClick={copyLink}
            style={{
              background: copied ? "rgba(61,184,175,0.2)" : "rgba(255,255,255,0.07)",
              border: "1px solid var(--line-medium)", borderRadius: "8px",
              padding: "0.6rem 1.25rem", color: copied ? "#3DB8AF" : "var(--ink)",
              cursor: "pointer", fontFamily: "inherit", fontSize: "0.875rem", whiteSpace: "nowrap"
            }}
          >
            {copied ? "✓ Copied" : "Copy Link"}
          </button>
        </div>
      </div>

      {/* Stats */}
      {stats && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "1px", background: "var(--line-subtle)", margin: "0", borderBottom: "1px solid var(--line-subtle)" }}>
          {[
            { label: "Clicks", value: stats.clicks },
            { label: "Signups", value: stats.leads },
            { label: "Purchases", value: stats.purchases },
            { label: "Revenue Generated", value: centsToUSD(stats.totalRevenueCents) },
            { label: "Your Earnings", value: centsToUSD(stats.totalCommissionCents), highlight: true },
          ].map((s) => (
            <div key={s.label} style={{ padding: "1.5rem", background: "var(--surface-page)", textAlign: "center" }}>
              <div style={{ fontSize: "1.75rem", fontWeight: "700", color: s.highlight ? "#3DB8AF" : "var(--ink)", fontFamily: "var(--font-display)" }}>
                {s.value}
              </div>
              <div style={{ fontSize: "0.75rem", color: "var(--ink-muted)", textTransform: "uppercase", letterSpacing: "0.07em", marginTop: "0.25rem" }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Recent events */}
      <div className="admin-table-wrap">
        {events.length === 0 ? (
          <div className="admin-empty">No activity yet. Share your referral link to get started!</div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Event</th>
                <th>Revenue</th>
                <th>Your Commission</th>
              </tr>
            </thead>
            <tbody>
              {events.map((ev) => (
                <tr key={ev.id}>
                  <td>{new Date(ev.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</td>
                  <td style={{ textTransform: "capitalize" }}>{ev.eventType}</td>
                  <td>{ev.orderAmountCents ? centsToUSD(ev.orderAmountCents) : "—"}</td>
                  <td style={{ color: ev.commissionCents ? "#3DB8AF" : undefined }}>
                    {ev.commissionCents ? centsToUSD(ev.commissionCents) : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
