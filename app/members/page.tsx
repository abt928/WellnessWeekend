"use client";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

const BASE_URL = "https://www.wellnessweekendak.com";

interface MemberInfo {
  name: string;
  email: string;
  code: string;
  pointsBalance: number;
}

interface Referral {
  id: number;
  refereeEmail: string;
  pointsEarned: number;
  createdAt: string;
}

interface Redemption {
  id: number;
  rewardType: string;
  pointsCost: number;
  discountCents: number;
  status: string;
  createdAt: string;
  usedAt: string | null;
}

interface PendingRedemption {
  id: number;
  rewardType: string;
  discountCents: number;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function rewardLabel(type: string) {
  if (type === "cash") return "$10 Off";
  if (type === "day-pass") return "Day Pass";
  if (type === "weekend-pass") return "Weekend Pass";
  return type;
}

function statusBadgeStyle(status: string): React.CSSProperties {
  if (status === "used") return { color: "var(--sage)", background: "rgba(107,127,96,0.1)" };
  if (status === "cancelled") return { color: "#c0392b", background: "rgba(192,57,43,0.08)" };
  return { color: "var(--aurora)", background: "rgba(139,95,191,0.1)" }; // pending
}

export default function MembersPage() {
  const [checking, setChecking] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [member, setMember] = useState<MemberInfo | null>(null);
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [redemptions, setRedemptions] = useState<Redemption[]>([]);
  const [pendingRedemption, setPendingRedemption] = useState<PendingRedemption | null>(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  const [copied, setCopied] = useState(false);
  const [redeemLoading, setRedeemLoading] = useState<string | null>(null);
  const [redeemError, setRedeemError] = useState("");
  const [redeemSuccess, setRedeemSuccess] = useState("");

  const referralUrl = member ? `${BASE_URL}?ref=${member.code}` : "";

  const fetchPendingRedemption = useCallback(async () => {
    try {
      const res = await fetch("/api/members/redeem");
      if (res.ok) {
        const data = await res.json();
        setPendingRedemption(data.pending ? { id: data.id, rewardType: data.rewardType, discountCents: data.discountCents } : null);
      }
    } catch {
      // ignore
    }
  }, []);

  const fetchStats = useCallback(async () => {
    const res = await fetch("/api/members/stats");
    if (res.ok) {
      const data = await res.json();
      setMember(data.member);
      setReferrals(data.referrals || []);
      setRedemptions(data.redemptions || []);
    } else if (res.status === 401) {
      setAuthenticated(false);
    }
  }, []);

  useEffect(() => {
    fetch("/api/members/auth")
      .then(async (r) => {
        if (r.ok) {
          const data = await r.json();
          if (data.ok) {
            setAuthenticated(true);
            await fetchStats();
            await fetchPendingRedemption();
          }
        }
      })
      .finally(() => setChecking(false));
  }, [fetchStats, fetchPendingRedemption]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError("");
    try {
      const res = await fetch("/api/members/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (res.ok) {
        setAuthenticated(true);
        await fetchStats();
        await fetchPendingRedemption();
      } else {
        const data = await res.json();
        setLoginError(data.error || "Login failed");
      }
    } catch {
      setLoginError("Something went wrong. Please try again.");
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/members/auth", { method: "DELETE" });
    setAuthenticated(false);
    setMember(null);
    setReferrals([]);
    setRedemptions([]);
    setPendingRedemption(null);
  };

  const copyLink = async () => {
    await navigator.clipboard.writeText(referralUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRedeem = async (rewardType: string) => {
    setRedeemLoading(rewardType);
    setRedeemError("");
    setRedeemSuccess("");
    try {
      const res = await fetch("/api/members/redeem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rewardType }),
      });
      const data = await res.json();
      if (!res.ok) {
        setRedeemError(data.error || "Redemption failed");
      } else {
        const labels: Record<string, string> = {
          cash: "$10 discount",
          "day-pass": "Day Pass",
          "weekend-pass": "Weekend Pass",
        };
        setRedeemSuccess(`${labels[rewardType] || rewardType} redeemed! ${rewardType === "cash" ? "Head to checkout and the discount will apply automatically." : "Our team will be in touch to fulfill your pass."}`);
        await fetchStats();
        await fetchPendingRedemption();
      }
    } catch {
      setRedeemError("Something went wrong. Please try again.");
    } finally {
      setRedeemLoading(null);
    }
  };

  // Loading state
  if (checking) {
    return (
      <div className="member-login">
        <div className="member-login-card">
          <p style={{ color: "var(--sage)", textAlign: "center" }}>Loading…</p>
        </div>
      </div>
    );
  }

  // Login form
  if (!authenticated) {
    return (
      <div className="member-login">
        <div className="member-login-card">
          <div className="member-brand" style={{ fontFamily: "var(--font-display)" }}>
            Wellness Weekend
          </div>
          <h1 className="member-login-title">Member Portal</h1>
          <form onSubmit={handleLogin} className="member-login-form">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              className="member-input"
              autoFocus
              required
              autoComplete="email"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="member-input"
              required
              autoComplete="current-password"
            />
            {loginError && (
              <p style={{
                color: "#c0392b",
                fontSize: "0.875rem",
                padding: "0.5rem 0.75rem",
                background: "rgba(192,57,43,0.07)",
                borderRadius: "6px",
                border: "1px solid rgba(192,57,43,0.15)",
              }}>
                {loginError}
              </p>
            )}
            <button type="submit" className="member-login-btn" disabled={loginLoading}>
              {loginLoading ? "Signing in…" : "Sign In"}
            </button>
          </form>
          <p style={{ marginTop: "1.25rem", textAlign: "center", fontSize: "0.875rem", color: "var(--sage)" }}>
            Not a member yet?{" "}
            <Link href="/join" style={{ color: "var(--aurora)", textDecoration: "none", fontWeight: 500 }}>
              Create a free account
            </Link>
          </p>
          <p style={{ marginTop: "0.5rem", textAlign: "center", fontSize: "0.875rem" }}>
            <Link href="/" style={{ color: "var(--sage)", textDecoration: "none" }}>
              ← Back to site
            </Link>
          </p>
        </div>
      </div>
    );
  }

  // Dashboard
  const balance = member?.pointsBalance ?? 0;

  const REWARDS = [
    {
      type: "cash",
      cost: 100,
      label: "$10 Off",
      description: "Applied automatically at checkout",
      discountCents: 1000,
    },
    {
      type: "day-pass",
      cost: 500,
      label: "Day Pass",
      description: "Admin-fulfilled · we'll be in touch",
      discountCents: 0,
    },
    {
      type: "weekend-pass",
      cost: 1000,
      label: "Weekend Pass",
      description: "Admin-fulfilled · we'll be in touch",
      discountCents: 0,
    },
  ];

  return (
    <div className="member-dashboard">
      {/* Header */}
      <header className="member-header">
        <div>
          <div className="member-brand" style={{ fontFamily: "var(--font-display)", fontSize: "1rem" }}>
            Wellness Weekend
          </div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.4rem", color: "var(--forest)", fontWeight: 400, margin: 0 }}>
            {member?.name}
          </h1>
        </div>
        <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
          <Link href="/#store" style={{
            padding: "0.5rem 1.1rem",
            background: "linear-gradient(135deg, var(--aurora), var(--psyche-pink))",
            color: "white",
            borderRadius: "20px",
            textDecoration: "none",
            fontSize: "0.8rem",
            fontWeight: 600,
            letterSpacing: "0.04em",
          }}>
            Shop Tickets
          </Link>
          <button onClick={handleLogout} className="member-logout-btn">
            Sign Out
          </button>
        </div>
      </header>

      <div className="member-dashboard-body">
        {/* Points Hero */}
        <div className="member-points-hero">
          <div className="member-points-number">{balance.toLocaleString()}</div>
          <div className="member-points-label">points</div>
          {balance >= 100 && (
            <p style={{ fontSize: "0.85rem", color: "var(--aurora)", marginTop: "0.5rem" }}>
              You have enough points to redeem a reward!
            </p>
          )}
          {balance < 100 && balance > 0 && (
            <p style={{ fontSize: "0.85rem", color: "var(--sage)", marginTop: "0.5rem" }}>
              {100 - balance} more points until your first reward
            </p>
          )}
          {balance === 0 && (
            <p style={{ fontSize: "0.85rem", color: "var(--sage)", marginTop: "0.5rem" }}>
              Refer a friend to earn your first 50 points
            </p>
          )}
        </div>

        {/* Pending redemption notice */}
        {pendingRedemption && (
          <div className="member-pending-notice">
            <span style={{ fontSize: "1.1rem" }}>🎁</span>
            <div>
              <strong>{rewardLabel(pendingRedemption.rewardType)}</strong> redemption pending
              {pendingRedemption.discountCents > 0
                ? ": the discount will apply automatically when you proceed to checkout."
                : ": our team will be in touch to fulfill your pass."}
            </div>
            {pendingRedemption.discountCents > 0 && (
              <Link href="/#store" style={{
                marginLeft: "auto",
                padding: "0.45rem 1rem",
                background: "var(--aurora)",
                color: "white",
                borderRadius: "20px",
                textDecoration: "none",
                fontSize: "0.8rem",
                fontWeight: 600,
                whiteSpace: "nowrap",
              }}>
                Go to Checkout
              </Link>
            )}
          </div>
        )}

        {/* Referral section */}
        <div className="member-section">
          <h2 className="member-section-title">Refer Friends, Earn Points</h2>
          <p style={{ color: "var(--charcoal)", fontSize: "0.9rem", marginBottom: "1rem" }}>
            Share your link. You earn <strong>50 points</strong> every time a friend creates an account.
          </p>
          <div className="member-referral-box">
            <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", flexWrap: "wrap" }}>
              <code style={{
                flex: "1 1 250px",
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
              <button onClick={copyLink} className="member-copy-btn" style={{
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
              }}>
                {copied ? "✓ Copied" : "Copy Link"}
              </button>
            </div>
            <p style={{ fontSize: "0.78rem", color: "var(--sage)", marginTop: "0.6rem" }}>
              Share text: &ldquo;Join me at Wellness Weekend! Use my link to sign up: {referralUrl}&rdquo;
            </p>
          </div>
        </div>

        {/* Rewards section */}
        <div className="member-section">
          <h2 className="member-section-title">Rewards</h2>

          {redeemError && (
            <div style={{
              background: "rgba(192,57,43,0.07)",
              border: "1px solid rgba(192,57,43,0.15)",
              borderRadius: "8px",
              padding: "0.75rem 1rem",
              color: "#c0392b",
              fontSize: "0.875rem",
              marginBottom: "1rem",
            }}>
              {redeemError}
            </div>
          )}
          {redeemSuccess && (
            <div style={{
              background: "rgba(139,95,191,0.08)",
              border: "1px solid rgba(139,95,191,0.2)",
              borderRadius: "8px",
              padding: "0.75rem 1rem",
              color: "var(--aurora)",
              fontSize: "0.875rem",
              marginBottom: "1rem",
            }}>
              {redeemSuccess}
            </div>
          )}

          <div className="member-rewards-grid">
            {REWARDS.map((reward) => {
              const canAfford = balance >= reward.cost;
              const hasPending = !!pendingRedemption;
              const isLoading = redeemLoading === reward.type;
              const disabled = !canAfford || hasPending || isLoading;

              return (
                <div key={reward.type} className={`member-reward-card${disabled ? " member-reward-disabled" : ""}`}>
                  <div className="member-reward-cost">{reward.cost} pts</div>
                  <div className="member-reward-label">{reward.label}</div>
                  <div className="member-reward-desc">{reward.description}</div>
                  <button
                    className="member-reward-btn"
                    onClick={() => handleRedeem(reward.type)}
                    disabled={disabled}
                  >
                    {isLoading
                      ? "Redeeming…"
                      : !canAfford
                      ? `Need ${reward.cost - balance} more pts`
                      : hasPending
                      ? "Redemption pending"
                      : reward.type === "cash"
                      ? "Apply at Checkout"
                      : "Redeem"}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Referral history */}
        <div className="member-section">
          <h2 className="member-section-title">Referral History</h2>
          {referrals.length === 0 ? (
            <p style={{ color: "var(--charcoal)", fontSize: "0.9rem", fontStyle: "italic" }}>
              No referrals yet. Share your link to get started!
            </p>
          ) : (
            <div className="member-table-wrap">
              <table className="member-history-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Referred Email</th>
                    <th>Points Earned</th>
                  </tr>
                </thead>
                <tbody>
                  {referrals.map((r) => (
                    <tr key={r.id}>
                      <td>{formatDate(r.createdAt)}</td>
                      <td style={{ color: "var(--sage)" }}>
                        {r.refereeEmail.replace(/(?<=.{2}).(?=[^@]*@)/, "•").replace(/(?<=@.).+(?=\.)/, "•••")}
                      </td>
                      <td style={{ color: "var(--aurora)", fontWeight: 600 }}>
                        +{r.pointsEarned} pts
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Redemption history */}
        <div className="member-section">
          <h2 className="member-section-title">Redemption History</h2>
          {redemptions.length === 0 ? (
            <p style={{ color: "var(--charcoal)", fontSize: "0.9rem", fontStyle: "italic" }}>
              No redemptions yet.
            </p>
          ) : (
            <div className="member-table-wrap">
              <table className="member-history-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Reward</th>
                    <th>Points</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {redemptions.map((r) => (
                    <tr key={r.id}>
                      <td>{formatDate(r.createdAt)}</td>
                      <td>{rewardLabel(r.rewardType)}</td>
                      <td style={{ color: "var(--forest)" }}>−{r.pointsCost} pts</td>
                      <td>
                        <span style={{
                          ...statusBadgeStyle(r.status),
                          padding: "0.2rem 0.6rem",
                          borderRadius: "12px",
                          fontSize: "0.78rem",
                          fontWeight: 500,
                          textTransform: "capitalize",
                        }}>
                          {r.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
