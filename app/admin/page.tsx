"use client";

import { useState, useEffect, useCallback } from "react";
import type { AdminRole } from "@/app/api/admin/auth/route";

// ── Types ─────────────────────────────────────────────────────────────

type TableName =
  | "leads" | "newsletter" | "vendors" | "volunteers"
  | "sponsors" | "instructor_waitlist" | "affiliates" | "referral_events";

type ActiveTab =
  | "overview" | "loyalty" | "budget"
  | "affiliates" | "referral_events" | "newsletter" | "leads"
  | "addons" | "vendor_agreements"
  | "vendors" | "volunteers" | "instructor_waitlist" | "sponsors";

interface BudgetItem {
  id: number;
  type: string;
  category: string;
  description: string;
  amount_cents: number;
  notes: string | null;
  created_at: string;
}

interface BudgetTotals {
  revenue_target_cents: number;
  expense_cents: number;
  income_cents: number;
}

interface LoyaltyTotals {
  total_members: number;
  new_this_month: number;
  total_points: number;
  members_with_points: number;
  total_redemptions: number;
  total_points_redeemed: number;
}

interface MemberRow {
  id: number;
  name: string | null;
  email: string;
  points_balance: number;
  referral_code: string | null;
  created_at: string;
}

interface RedemptionRow {
  id: number;
  points_used: number;
  reward: string | null;
  redeemed_at: string;
  member_name: string | null;
  member_email: string;
}

// ── Helpers ──────────────────────────────────────────────────────────

function readSavedPassword(): { value: string; remembered: boolean } {
  if (typeof window === "undefined") return { value: "", remembered: false };
  try {
    const saved = window.localStorage.getItem("ww-admin-pw");
    return { value: saved ?? "", remembered: Boolean(saved) };
  } catch {
    return { value: "", remembered: false };
  }
}

function fmtDate(raw: unknown): string {
  const str = String(raw ?? "");
  if (!str) return "—";
  const iso = str.includes("Z") || str.includes("+") ? str.replace(" ", "T") : str.replace(" ", "T") + "Z";
  const d = new Date(iso);
  return isNaN(d.getTime())
    ? str
    : d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

function usd(cents: number) {
  return `$${(cents / 100).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function daysUntil(target: Date): number {
  const now = new Date();
  const ms = target.getTime() - now.getTime();
  return Math.max(0, Math.ceil(ms / (1000 * 60 * 60 * 24)));
}

// ── Shared Style Atoms ────────────────────────────────────────────────

const cell: React.CSSProperties = {
  padding: "0.6rem 0.75rem", borderBottom: "1px solid var(--line-subtle)",
  fontSize: "0.82rem", color: "var(--ink)", verticalAlign: "middle",
};
const hcell: React.CSSProperties = {
  ...cell, color: "var(--ink-muted)", fontSize: "0.7rem",
  textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 600,
  background: "var(--surface-elevated)",
};

// ── Stat Card ─────────────────────────────────────────────────────────

function StatCard({ label, value, sub, accent }: { label: string; value: string | number; sub?: string; accent?: string }) {
  return (
    <div style={{
      background: "var(--surface-elevated)", border: "1px solid var(--line-medium)",
      borderRadius: "12px", padding: "1.25rem 1.5rem", minWidth: "150px", flex: "1 1 150px",
    }}>
      <div style={{ fontSize: "1.7rem", fontWeight: 700, color: accent ?? "var(--ink)", fontFamily: "var(--font-display)", lineHeight: 1.1 }}>
        {value}
      </div>
      <div style={{ fontSize: "0.7rem", color: "var(--ink-muted)", textTransform: "uppercase", letterSpacing: "0.07em", marginTop: "0.35rem" }}>
        {label}
      </div>
      {sub && <div style={{ fontSize: "0.75rem", color: "var(--ink-muted)", marginTop: "0.2rem" }}>{sub}</div>}
    </div>
  );
}

// ── Overview Tab ──────────────────────────────────────────────────────

function OverviewTab() {
  const [budget, setBudget] = useState<{ items: BudgetItem[]; totals: BudgetTotals } | null>(null);
  const [loyalty, setLoyalty] = useState<{ totals: LoyaltyTotals } | null>(null);
  const [communityData, setCommunityData] = useState<{
    leads: number; newsletter: number; affiliates: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const [budgetRes, loyaltyRes, leadsRes, newsletterRes, affiliatesRes] = await Promise.all([
          fetch("/api/admin/budget"),
          fetch("/api/admin/members"),
          fetch("/api/admin/data?table=leads"),
          fetch("/api/admin/data?table=newsletter"),
          fetch("/api/admin/data?table=affiliates"),
        ]);
        if (budgetRes.ok) setBudget(await budgetRes.json());
        if (loyaltyRes.ok) {
          const d = await loyaltyRes.json();
          setLoyalty({ totals: d.totals });
        }
        const [leadsData, newsletterData, affiliatesData] = await Promise.all([
          leadsRes.ok ? leadsRes.json() : null,
          newsletterRes.ok ? newsletterRes.json() : null,
          affiliatesRes.ok ? affiliatesRes.json() : null,
        ]);
        setCommunityData({
          leads: leadsData?.count ?? 0,
          newsletter: newsletterData?.count ?? 0,
          affiliates: affiliatesData?.count ?? 0,
        });
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const eventDate = new Date("2026-08-07T00:00:00");
  const days = daysUntil(eventDate);
  const netRevenue = budget ? budget.totals.income_cents - budget.totals.expense_cents : null;
  const revenueTarget = budget?.totals.revenue_target_cents ?? 0;
  const goalPct = revenueTarget > 0 && budget ? Math.round((budget.totals.income_cents / revenueTarget) * 100) : null;

  const section = (title: string, children: React.ReactNode) => (
    <section style={{ marginBottom: "2rem" }}>
      <h2 style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--ink-muted)", textTransform: "uppercase", letterSpacing: "0.09em", margin: "0 0 1rem" }}>
        {title}
      </h2>
      {children}
    </section>
  );

  if (loading) return <div className="admin-loading">Loading…</div>;

  return (
    <div style={{ padding: "1.75rem 2rem" }}>

      {/* Countdown hero */}
      <div style={{
        background: "linear-gradient(135deg, #0a0820 0%, #1a0d3a 100%)",
        borderRadius: "16px", padding: "2rem 2.5rem", marginBottom: "2rem",
        display: "flex", alignItems: "center", gap: "2rem", flexWrap: "wrap",
      }}>
        <div>
          <div style={{ fontSize: "4rem", fontWeight: 800, color: "#D4AF3C", fontFamily: "var(--font-display)", lineHeight: 1 }}>
            {days}
          </div>
          <div style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: "0.1em", marginTop: "0.25rem" }}>
            Days Until Wellness Weekend
          </div>
        </div>
        <div style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.9rem" }}>
          <div style={{ fontFamily: "var(--font-display)", fontSize: "1.1rem", color: "#fff", marginBottom: "0.25rem" }}>
            August 7–9, 2026
          </div>
          Warrior Lodge · Sutton, Alaska<br />
          <span style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.8rem" }}>4th Annual Healing Arts Festival</span>
        </div>
      </div>

      {/* Community snapshot */}
      {section("Community", (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
          <StatCard label="Circle Members" value={loyalty?.totals.total_members ?? "—"} accent="#8B5FBF" />
          <StatCard label="New This Month" value={loyalty?.totals.new_this_month ?? "—"} />
          <StatCard label="Newsletter Subscribers" value={communityData?.newsletter ?? "—"} accent="#2a9d8f" />
          <StatCard label="Leads" value={communityData?.leads ?? "—"} />
          <StatCard label="Affiliate Partners" value={communityData?.affiliates ?? "—"} />
        </div>
      ))}

      {/* Budget snapshot */}
      {section("Budget Snapshot", (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
          <StatCard label="Revenue Target" value={budget ? usd(revenueTarget) : "—"} />
          <StatCard label="Actual Income" value={budget ? usd(budget.totals.income_cents) : "—"} accent="#2a9d8f" />
          <StatCard label="Expenses" value={budget ? usd(budget.totals.expense_cents) : "—"} />
          <StatCard
            label="Net"
            value={netRevenue !== null ? usd(netRevenue) : "—"}
            accent={netRevenue !== null ? (netRevenue >= 0 ? "#2a9d8f" : "#dc5050") : undefined}
          />
          {goalPct !== null && (
            <StatCard label="Goal Progress" value={`${goalPct}%`} accent={goalPct >= 100 ? "#D4AF3C" : undefined} />
          )}
        </div>
      ))}

      {/* Loyalty snapshot */}
      {section("Loyalty Snapshot", (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
          <StatCard label="Points Distributed" value={(loyalty?.totals.total_points ?? 0).toLocaleString()} accent="#D4AF3C" />
          <StatCard label="Members with Points" value={loyalty?.totals.members_with_points ?? "—"} />
          <StatCard label="Total Redemptions" value={loyalty?.totals.total_redemptions ?? "—"} />
          <StatCard label="Points Redeemed" value={(loyalty?.totals.total_points_redeemed ?? 0).toLocaleString()} />
        </div>
      ))}

    </div>
  );
}

// ── Loyalty Tab ───────────────────────────────────────────────────────

function LoyaltyTab() {
  const [data, setData] = useState<{
    totals: LoyaltyTotals;
    recentSignups: MemberRow[];
    topMembers: MemberRow[];
    recentRedemptions: RedemptionRow[];
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<"signups" | "top" | "redemptions">("signups");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/members");
      if (res.ok) setData(await res.json());
      else setError("Failed to load loyalty data");
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }, []);

  // This client-only tab synchronizes its initial state with the admin API.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { load(); }, [load]);

  if (loading) return <div className="admin-loading">Loading loyalty data…</div>;
  if (error) return <div className="admin-empty" style={{ color: "#dc5050" }}>{error}</div>;
  if (!data) return null;

  const { totals, recentSignups, topMembers, recentRedemptions } = data;

  const subTabStyle = (active: boolean): React.CSSProperties => ({
    padding: "0.4rem 1rem", borderRadius: "8px", border: "none", cursor: "pointer",
    fontSize: "0.8rem", fontFamily: "inherit", fontWeight: active ? 600 : 400,
    background: active ? "rgba(139,95,191,0.15)" : "transparent",
    color: active ? "#8B5FBF" : "var(--ink-muted)",
  });

  return (
    <div style={{ padding: "1.5rem 2rem" }}>

      {/* Stats row */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", marginBottom: "2rem" }}>
        <StatCard label="Total Members" value={totals.total_members} accent="#8B5FBF" />
        <StatCard label="New This Month" value={totals.new_this_month} />
        <StatCard label="Points Distributed" value={totals.total_points.toLocaleString()} accent="#D4AF3C" sub="1 pt per $1 spent" />
        <StatCard label="Members with Points" value={totals.members_with_points} />
        <StatCard label="Redemptions" value={totals.total_redemptions} />
        <StatCard label="Points Redeemed" value={totals.total_points_redeemed.toLocaleString()} />
      </div>

      {/* Rewards tiers callout */}
      <div style={{
        background: "linear-gradient(135deg, rgba(212,175,60,0.08) 0%, rgba(139,95,191,0.08) 100%)",
        border: "1px solid rgba(212,175,60,0.25)", borderRadius: "12px",
        padding: "1rem 1.5rem", marginBottom: "2rem",
        display: "flex", flexWrap: "wrap", gap: "1.5rem", alignItems: "center",
      }}>
        <span style={{ fontSize: "0.75rem", color: "var(--ink-muted)", textTransform: "uppercase", letterSpacing: "0.08em" }}>Reward Tiers</span>
        {[
          { pts: "100 pts", reward: "$10 off add-ons or merch" },
          { pts: "500 pts", reward: "Free day pass" },
          { pts: "1,000 pts", reward: "Free weekend pass" },
        ].map(({ pts, reward }) => (
          <div key={pts} style={{ display: "flex", gap: "0.4rem", alignItems: "baseline" }}>
            <span style={{ fontWeight: 700, color: "#D4AF3C", fontSize: "0.85rem" }}>{pts}</span>
            <span style={{ fontSize: "0.8rem", color: "var(--ink-muted)" }}>→ {reward}</span>
          </div>
        ))}
        <div style={{ marginLeft: "auto", fontSize: "0.75rem", color: "var(--ink-muted)" }}>
          +50 bonus pts per referral
        </div>
      </div>

      {/* Sub-view switcher */}
      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
        <button style={subTabStyle(view === "signups")} onClick={() => setView("signups")}>Recent Sign-ups</button>
        <button style={subTabStyle(view === "top")} onClick={() => setView("top")}>Top Members</button>
        <button style={subTabStyle(view === "redemptions")} onClick={() => setView("redemptions")}>Redemptions</button>
        <button onClick={load} style={{ marginLeft: "auto", fontSize: "0.78rem", color: "var(--ink-muted)", background: "none", border: "none", cursor: "pointer" }}>Refresh</button>
      </div>

      {/* Tables */}
      {view === "signups" && (
        <div style={{ overflowX: "auto" }}>
          {recentSignups.length === 0 ? (
            <div className="admin-empty">No members yet — sign-ups will appear here</div>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse", background: "var(--surface-elevated)", borderRadius: "10px", overflow: "hidden" }}>
              <thead>
                <tr>
                  {["Name", "Email", "Points", "Referral Code", "Joined"].map(h => <th key={h} style={hcell}>{h}</th>)}
                </tr>
              </thead>
              <tbody>
                {recentSignups.map(m => (
                  <tr key={m.id}>
                    <td style={cell}>{m.name || "—"}</td>
                    <td style={cell}>{m.email}</td>
                    <td style={{ ...cell, fontWeight: 600, color: m.points_balance > 0 ? "#D4AF3C" : "var(--ink-muted)" }}>
                      {m.points_balance.toLocaleString()}
                    </td>
                    <td style={{ ...cell, fontFamily: "monospace", fontSize: "0.78rem", color: "var(--psyche-cyan)" }}>
                      {m.referral_code || "—"}
                    </td>
                    <td style={{ ...cell, color: "var(--ink-muted)" }}>{fmtDate(m.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {view === "top" && (
        <div style={{ overflowX: "auto" }}>
          {topMembers.length === 0 ? (
            <div className="admin-empty">No members have earned points yet</div>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse", background: "var(--surface-elevated)", borderRadius: "10px", overflow: "hidden" }}>
              <thead>
                <tr>
                  {["#", "Name", "Email", "Points", "Joined"].map(h => <th key={h} style={hcell}>{h}</th>)}
                </tr>
              </thead>
              <tbody>
                {topMembers.map((m, i) => (
                  <tr key={m.id}>
                    <td style={{ ...cell, color: "#D4AF3C", fontWeight: 700 }}>{i + 1}</td>
                    <td style={{ ...cell, fontWeight: 600 }}>{m.name || "—"}</td>
                    <td style={cell}>{m.email}</td>
                    <td style={{ ...cell, fontWeight: 700, color: "#D4AF3C" }}>{m.points_balance.toLocaleString()}</td>
                    <td style={{ ...cell, color: "var(--ink-muted)" }}>{fmtDate(m.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {view === "redemptions" && (
        <div style={{ overflowX: "auto" }}>
          {recentRedemptions.length === 0 ? (
            <div className="admin-empty">No redemptions yet</div>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse", background: "var(--surface-elevated)", borderRadius: "10px", overflow: "hidden" }}>
              <thead>
                <tr>
                  {["Member", "Email", "Points Used", "Reward", "Date"].map(h => <th key={h} style={hcell}>{h}</th>)}
                </tr>
              </thead>
              <tbody>
                {recentRedemptions.map(r => (
                  <tr key={r.id}>
                    <td style={cell}>{r.member_name || "—"}</td>
                    <td style={cell}>{r.member_email}</td>
                    <td style={{ ...cell, fontWeight: 600, color: "#dc5050" }}>-{r.points_used.toLocaleString()}</td>
                    <td style={cell}>{r.reward || "—"}</td>
                    <td style={{ ...cell, color: "var(--ink-muted)" }}>{fmtDate(r.redeemed_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}

// ── Budget Tab ────────────────────────────────────────────────────────

function BudgetTab() {
  const [budget, setBudget] = useState<{ items: BudgetItem[]; totals: BudgetTotals } | null>(null);
  const [budgetLoading, setBudgetLoading] = useState(true);
  const [addingBudget, setAddingBudget] = useState(false);
  const [budgetForm, setBudgetForm] = useState({ type: "expense", category: "", description: "", amount: "", notes: "" });
  const [budgetSaving, setBudgetSaving] = useState(false);

  const fetchBudget = useCallback(async () => {
    setBudgetLoading(true);
    try {
      const res = await fetch("/api/admin/budget");
      if (res.ok) setBudget(await res.json());
    } finally {
      setBudgetLoading(false);
    }
  }, []);

  // This client-only tab synchronizes its initial state with the admin API.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { fetchBudget(); }, [fetchBudget]);

  const saveBudgetItem = async () => {
    setBudgetSaving(true);
    const amountCents = Math.round(parseFloat(budgetForm.amount) * 100);
    await fetch("/api/admin/budget", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...budgetForm, amountCents }),
    });
    setBudgetSaving(false);
    setAddingBudget(false);
    setBudgetForm({ type: "expense", category: "", description: "", amount: "", notes: "" });
    fetchBudget();
  };

  const deleteBudgetItem = async (id: number) => {
    await fetch("/api/admin/budget", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    fetchBudget();
  };

  const netRevenue = budget ? (budget.totals.income_cents - budget.totals.expense_cents) : null;
  const revenueTarget = budget?.totals.revenue_target_cents ?? 0;

  return (
    <div style={{ padding: "1.5rem 2rem", display: "flex", flexDirection: "column", gap: "2rem" }}>
      {/* Summary cards */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
        <StatCard label="Revenue Target" value={budget ? usd(revenueTarget) : "—"} />
        <StatCard label="Actual Income" value={budget ? usd(budget.totals.income_cents) : "—"} accent="#2a9d8f" />
        <StatCard label="Expenses" value={budget ? usd(budget.totals.expense_cents) : "—"} />
        <StatCard
          label="Net (Income – Expenses)"
          value={netRevenue !== null ? usd(netRevenue) : "—"}
          accent={netRevenue !== null ? (netRevenue >= 0 ? "#2a9d8f" : "#dc5050") : undefined}
        />
        {revenueTarget > 0 && budget && (
          <StatCard
            label="Goal Progress"
            value={`${Math.round((budget.totals.income_cents / revenueTarget) * 100)}%`}
          />
        )}
      </div>

      {/* Add item */}
      <div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
          <h2 style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--ink-muted)", textTransform: "uppercase", letterSpacing: "0.08em", margin: 0 }}>
            Budget & Expenses
          </h2>
          <button
            onClick={() => setAddingBudget((v) => !v)}
            style={{ fontSize: "0.78rem", color: "var(--psyche-cyan)", background: "none", border: "none", cursor: "pointer", padding: 0 }}
          >
            {addingBudget ? "Cancel" : "+ Add Item"}
          </button>
        </div>

        {addingBudget && (
          <div style={{ background: "var(--surface-elevated)", border: "1px solid var(--line-medium)", borderRadius: "10px", padding: "1.25rem", marginBottom: "1.25rem", display: "flex", flexWrap: "wrap", gap: "0.75rem", alignItems: "flex-end" }}>
            <select
              value={budgetForm.type}
              onChange={(e) => setBudgetForm((f) => ({ ...f, type: e.target.value }))}
              style={{ background: "var(--surface-page)", border: "1px solid var(--line-medium)", borderRadius: "6px", color: "var(--ink)", padding: "0.4rem 0.6rem", fontSize: "0.82rem" }}
            >
              <option value="expense">Expense</option>
              <option value="income">Income</option>
              <option value="revenue_target">Revenue Target</option>
            </select>
            <input
              placeholder="Category (e.g. Marketing)"
              value={budgetForm.category}
              onChange={(e) => setBudgetForm((f) => ({ ...f, category: e.target.value }))}
              style={{ flex: "1 1 140px", background: "var(--surface-page)", border: "1px solid var(--line-medium)", borderRadius: "6px", color: "var(--ink)", padding: "0.4rem 0.6rem", fontSize: "0.82rem" }}
            />
            <input
              placeholder="Description"
              value={budgetForm.description}
              onChange={(e) => setBudgetForm((f) => ({ ...f, description: e.target.value }))}
              style={{ flex: "2 1 200px", background: "var(--surface-page)", border: "1px solid var(--line-medium)", borderRadius: "6px", color: "var(--ink)", padding: "0.4rem 0.6rem", fontSize: "0.82rem" }}
            />
            <input
              type="number" placeholder="Amount ($)" step="0.01" min="0"
              value={budgetForm.amount}
              onChange={(e) => setBudgetForm((f) => ({ ...f, amount: e.target.value }))}
              style={{ width: "110px", background: "var(--surface-page)", border: "1px solid var(--line-medium)", borderRadius: "6px", color: "var(--ink)", padding: "0.4rem 0.6rem", fontSize: "0.82rem" }}
            />
            <input
              placeholder="Notes (optional)"
              value={budgetForm.notes}
              onChange={(e) => setBudgetForm((f) => ({ ...f, notes: e.target.value }))}
              style={{ flex: "1 1 140px", background: "var(--surface-page)", border: "1px solid var(--line-medium)", borderRadius: "6px", color: "var(--ink)", padding: "0.4rem 0.6rem", fontSize: "0.82rem" }}
            />
            <button
              onClick={saveBudgetItem}
              disabled={budgetSaving || !budgetForm.category || !budgetForm.description || !budgetForm.amount}
              style={{ background: "rgba(61,184,175,0.15)", border: "1px solid #3DB8AF", borderRadius: "6px", color: "#3DB8AF", padding: "0.4rem 1rem", cursor: "pointer", fontSize: "0.82rem", fontFamily: "inherit", whiteSpace: "nowrap" }}
            >
              {budgetSaving ? "Saving…" : "Save"}
            </button>
          </div>
        )}

        {budgetLoading ? (
          <div style={{ color: "var(--ink-muted)", fontSize: "0.85rem" }}>Loading…</div>
        ) : budget && budget.items.length === 0 ? (
          <p style={{ color: "var(--ink-muted)", fontSize: "0.85rem" }}>No budget items yet. Add your first item above.</p>
        ) : budget ? (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", background: "var(--surface-elevated)", borderRadius: "10px", overflow: "hidden" }}>
              <thead>
                <tr>
                  {["Type", "Category", "Description", "Amount", "Notes", ""].map((h, i) => (
                    <th key={i} style={hcell}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {budget.items.map((item) => (
                  <tr key={item.id}>
                    <td style={cell}>
                      <span style={{
                        fontSize: "0.7rem", padding: "0.15rem 0.5rem", borderRadius: "4px", fontWeight: 600,
                        background: item.type === "income" ? "rgba(61,184,175,0.12)" : item.type === "expense" ? "rgba(220,80,80,0.12)" : "rgba(255,165,0,0.12)",
                        color: item.type === "income" ? "#3DB8AF" : item.type === "expense" ? "#dc5050" : "#FFB347",
                      }}>
                        {item.type === "revenue_target" ? "Target" : item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                      </span>
                    </td>
                    <td style={cell}>{item.category}</td>
                    <td style={cell}>{item.description}</td>
                    <td style={{ ...cell, fontWeight: 600 }}>{usd(item.amount_cents)}</td>
                    <td style={{ ...cell, color: "var(--ink-muted)" }}>{item.notes || "—"}</td>
                    <td style={cell}>
                      <button
                        onClick={() => deleteBudgetItem(item.id)}
                        style={{ background: "none", border: "none", color: "var(--ink-muted)", cursor: "pointer", fontSize: "0.8rem", padding: "0.1rem 0.3rem" }}
                        title="Delete"
                      >
                        ✕
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}
      </div>
    </div>
  );
}

// ── Marketing Tab ─────────────────────────────────────────────────────

function AffiliatesTab() {
  const COLS = ["id","name","email","code","company","commission_pct","status","notes","created_at"];
  const [rows, setRows] = useState<Record<string, unknown>[]>([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [edits, setEdits] = useState<Record<number, { status?: string; commissionPct?: string; notes?: string; code?: string }>>({});
  const [saving, setSaving] = useState<number | null>(null);
  const [selectedRow, setSelectedRow] = useState<Record<string, unknown> | null>(null);

  const fetchData = useCallback(async (searchQuery?: string) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ table: "affiliates" });
      if (searchQuery) params.set("search", searchQuery);
      const res = await fetch(`/api/admin/data?${params}`);
      if (res.ok) { const d = await res.json(); setRows(d.rows || []); setCount(d.count || 0); }
    } catch { setRows([]); }
    setLoading(false);
  }, []);

  // This client-only tab synchronizes its initial state with the admin API.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { fetchData(); }, [fetchData]);
  useEffect(() => { const t = setTimeout(() => fetchData(search), 300); return () => clearTimeout(t); }, [search, fetchData]);

  const saveEdits = async (id: number) => {
    setSaving(id);
    await fetch("/api/admin/affiliates", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, ...edits[id] }) });
    setSaving(null);
    fetchData(search);
  };

  const exportCSV = () => {
    if (!rows.length) return;
    const csv = [COLS.join(","), ...rows.map(r => COLS.map(c => `"${String(r[c] ?? "").replace(/"/g, '""')}"`).join(","))].join("\n");
    const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    a.download = `affiliates_${new Date().toISOString().slice(0, 10)}.csv`; a.click();
  };

  return (
    <>
      <div style={{ padding: "0.65rem 1.5rem", background: "rgba(61,184,175,0.05)", borderBottom: "1px solid var(--line-subtle)", fontSize: "0.8rem", color: "var(--ink-muted)" }}>
        Edit Code, Status, Commission %, or Notes inline then click <strong style={{ color: "var(--ink)" }}>Save</strong> to approve or adjust a partner.
      </div>
      <div className="admin-toolbar">
        <div className="admin-toolbar-left">
          <span className="admin-count">{count} records</span>
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by email…" className="admin-search" />
        </div>
        <div className="admin-toolbar-right">
          <button onClick={() => fetchData(search)} className="admin-refresh-btn">Refresh</button>
          <button onClick={exportCSV} className="admin-export-btn" disabled={!rows.length}>Export CSV</button>
        </div>
      </div>
      <div className="admin-table-wrap">
        {loading ? <div className="admin-loading">Loading…</div> : rows.length === 0 ? <div className="admin-empty">No affiliates yet</div> : (
          <table className="admin-table">
            <thead><tr>{COLS.map(c => <th key={c}>{c.replace(/_/g, " ")}</th>)}<th>Save</th></tr></thead>
            <tbody>
              {rows.map((row, i) => {
                const id = Number(row.id);
                const sel = selectedRow === row;
                return (
                  <tr key={i} onClick={() => setSelectedRow(sel ? null : row)} style={{ cursor: "pointer", background: sel ? "rgba(139,95,191,0.07)" : undefined }}>
                    {COLS.map(col => {
                      const val = row[col];
                      if (col === "status") return (
                        <td key={col} onClick={e => e.stopPropagation()}>
                          <select defaultValue={String(val ?? "pending")} onChange={e => setEdits(a => ({ ...a, [id]: { ...a[id], status: e.target.value } }))} style={{ background: "var(--surface-elevated)", border: "1px solid var(--line-medium)", borderRadius: "6px", color: "var(--ink)", padding: "0.2rem 0.4rem", fontSize: "0.8rem" }}>
                            <option value="pending">pending</option><option value="active">active</option><option value="inactive">inactive</option>
                          </select>
                        </td>
                      );
                      if (col === "commission_pct") return (
                        <td key={col} onClick={e => e.stopPropagation()}>
                          <input type="number" defaultValue={String(val ?? 10)} min={0} max={100} onChange={e => setEdits(a => ({ ...a, [id]: { ...a[id], commissionPct: e.target.value } }))} style={{ width: "55px", background: "var(--surface-elevated)", border: "1px solid var(--line-medium)", borderRadius: "6px", color: "var(--ink)", padding: "0.2rem 0.4rem", fontSize: "0.8rem" }} />
                          <span style={{ marginLeft: "2px", fontSize: "0.75rem", color: "var(--ink-muted)" }}>%</span>
                        </td>
                      );
                      if (col === "code") return (
                        <td key={col} onClick={e => e.stopPropagation()}>
                          <input type="text" defaultValue={String(val ?? "")} placeholder="CODE" onChange={e => setEdits(a => ({ ...a, [id]: { ...a[id], code: e.target.value.toUpperCase() } }))} style={{ width: "100px", background: "var(--surface-elevated)", border: "1px solid var(--line-medium)", borderRadius: "6px", color: "var(--ink)", padding: "0.2rem 0.4rem", fontSize: "0.8rem", textTransform: "uppercase", fontFamily: "monospace" }} />
                        </td>
                      );
                      if (col === "notes") return (
                        <td key={col} onClick={e => e.stopPropagation()}>
                          <input type="text" defaultValue={String(val ?? "")} placeholder="Notes" onChange={e => setEdits(a => ({ ...a, [id]: { ...a[id], notes: e.target.value } }))} style={{ width: "120px", background: "var(--surface-elevated)", border: "1px solid var(--line-medium)", borderRadius: "6px", color: "var(--ink)", padding: "0.2rem 0.4rem", fontSize: "0.8rem" }} />
                        </td>
                      );
                      return <td key={col}>{col === "created_at" ? fmtDate(val) : String(val ?? "—")}</td>;
                    })}
                    <td onClick={e => e.stopPropagation()}>
                      <button onClick={() => saveEdits(id)} disabled={saving === id} style={{ background: "rgba(61,184,175,0.15)", border: "1px solid #3DB8AF", borderRadius: "6px", color: "#3DB8AF", padding: "0.2rem 0.7rem", cursor: "pointer", fontSize: "0.8rem", fontFamily: "inherit" }}>
                        {saving === id ? "…" : "Save"}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
      {selectedRow && (
        <div className="admin-detail-panel">
          <div className="admin-detail-header">
            <span className="admin-detail-title">{String(selectedRow.name ?? selectedRow.email ?? `Record #${selectedRow.id}`)}</span>
            <button className="admin-detail-close" onClick={() => setSelectedRow(null)}>✕ Close</button>
          </div>
          <div className="admin-detail-grid">
            {COLS.filter(c => c !== "id" && c !== "created_at").map(col => {
              const display = String(selectedRow[col] ?? "—");
              if (display === "—") return null;
              return <div key={col} className="admin-detail-field"><div className="admin-detail-label">{col.replace(/_/g, " ")}</div><div className="admin-detail-value">{display}</div></div>;
            })}
            <div className="admin-detail-field"><div className="admin-detail-label">submitted</div><div className="admin-detail-value">{fmtDate(selectedRow.created_at)}</div></div>
          </div>
        </div>
      )}
    </>
  );
}

// ── Add-Ons Tab ───────────────────────────────────────────────────────

function AddonsTab() {
  const [headers, setHeaders] = useState<string[]>([]);
  const [rows, setRows] = useState<Record<string, string>[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [needsSetup, setNeedsSetup] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/admin/addons")
      .then(async (r) => {
        const d = await r.json();
        if (d.needsSetup) setNeedsSetup(true);
        else if (d.error) setError(d.error);
        else { setHeaders(d.headers || []); setRows(d.rows || []); }
      })
      .catch(() => setError("Failed to load add-ons sheet"))
      .finally(() => setLoading(false));
  }, []);

  const filtered = search
    ? rows.filter(row => Object.values(row).some(v => v.toLowerCase().includes(search.toLowerCase())))
    : rows;

  const exportCSV = () => {
    if (rows.length === 0) return;
    const csv = [headers.join(","), ...rows.map(row => headers.map(h => `"${(row[h] ?? "").replace(/"/g, '""')}"`).join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `add-ons-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  };

  if (loading) return <div className="admin-loading">Loading add-ons…</div>;

  if (needsSetup) return (
    <div style={{ padding: "3rem 2rem", maxWidth: "560px" }}>
      <p style={{ fontWeight: 600, fontSize: "1rem", marginBottom: "1rem", color: "var(--ink)" }}>
        Add-Ons Sheet Not Connected
      </p>
      <p style={{ color: "var(--ink-muted)", fontSize: "0.875rem", marginBottom: "1.5rem", lineHeight: 1.7 }}>
        Add your Google Sheet&apos;s published CSV URL as <code style={{ background: "rgba(0,0,0,0.06)", padding: "0.1em 0.4em", borderRadius: "4px" }}>ADDONS_SHEET_URL</code> in Vercel environment variables.
      </p>
    </div>
  );

  if (error) return <div className="admin-empty" style={{ color: "#c0392b" }}>{error}</div>;

  return (
    <>
      <div className="admin-toolbar">
        <div className="admin-toolbar-left">
          <span className="admin-count">{filtered.length} of {rows.length} rows</span>
          <input
            type="text" value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search…" className="admin-search"
          />
        </div>
        <div className="admin-toolbar-right">
          <button onClick={exportCSV} className="admin-export-btn" disabled={rows.length === 0}>Export CSV</button>
        </div>
      </div>
      <div className="admin-table-wrap">
        {filtered.length === 0 ? (
          <div className="admin-empty">No rows match your search</div>
        ) : (
          <table className="admin-table sheet-table">
            <thead>
              <tr>{headers.map((h, i) => <th key={i}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {filtered.map((row, i) => (
                <tr key={i}>
                  {headers.map((h, j) => (
                    <td key={j} title={row[h] || ""}><span className="cell-truncate">{row[h] || "—"}</span></td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}

// ── Vendor Agreements Tab ─────────────────────────────────────────────

interface VendorAgreement {
  id: number;
  vendor_name: string;
  business_name: string | null;
  contact_name: string;
  email: string;
  phone: string;
  category: string;
  space_type: string;
  selected_days: string | null;
  electricity: string;
  price_cents: number;
  payment_status: string;
  printed_name: string;
  sig_date: string;
  created_at: string;
}

const SPACE_LABELS: Record<string, string> = {
  "1day-10x10":  "1 Day 10×10",
  "3day-10x10":  "3 Days 10×10",
  "3day-10x20":  "3 Days 10×20",
  "sponsor":     "Sponsor",
};

function VendorAgreementsTab() {
  const [agreements, setAgreements] = useState<VendorAgreement[]>([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState<string | null>(null);
  const [selected, setSelected]     = useState<VendorAgreement | null>(null);
  const [saving, setSaving]         = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    fetch("/api/admin/vendor-agreements")
      .then(async (r) => {
        const d = await r.json();
        if (d.error) setError(d.error);
        else setAgreements(d.rows ?? []);
      })
      .catch(() => setError("Failed to load vendor agreements"))
      .finally(() => setLoading(false));
  }, []);

  // This client-only tab synchronizes its initial state with the admin API.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { load(); }, [load]);

  const updateStatus = async (id: number, payment_status: string) => {
    setSaving(true);
    await fetch("/api/admin/vendor-agreements", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, payment_status }),
    });
    setSaving(false);
    load();
    setSelected(prev => prev?.id === id ? { ...prev, payment_status } : prev);
  };

  const deleteAgreement = async (id: number) => {
    setSaving(true);
    await fetch("/api/admin/vendor-agreements", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setSaving(false);
    setDeleteConfirm(null);
    setSelected(null);
    load();
  };

  const statusStyle = (s: string): React.CSSProperties => ({
    fontSize: "0.7rem", padding: "0.2rem 0.55rem", borderRadius: "10px", fontWeight: 700,
    background: s === "confirmed" ? "rgba(61,184,175,0.15)" : s === "pending" ? "rgba(201,152,63,0.15)" : "rgba(200,200,200,0.15)",
    color: s === "confirmed" ? "#3DB8AF" : s === "pending" ? "#C9983F" : "#888",
  });

  const vcell: React.CSSProperties  = { padding: "0.55rem 0.75rem", fontSize: "0.82rem", borderBottom: "1px solid rgba(0,0,0,0.05)", verticalAlign: "top" };
  const vhcell: React.CSSProperties = { padding: "0.5rem 0.75rem", fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--ink-muted)", background: "rgba(0,0,0,0.03)", textAlign: "left" };

  if (loading) return <div style={{ padding: "2rem", color: "var(--ink-muted)" }}>Loading…</div>;
  if (error)   return <div style={{ padding: "2rem", color: "#dc5050" }}>{error}</div>;

  return (
    <div style={{ padding: "1.5rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
        <span style={{ fontSize: "0.85rem", color: "var(--ink-muted)" }}>{agreements.length} agreement{agreements.length !== 1 ? "s" : ""}</span>
        <span style={{ fontSize: "0.8rem", color: "var(--ink-muted)" }}>
          Confirmed: {agreements.filter(a => a.payment_status === "confirmed").length} &nbsp;·&nbsp;
          Pending: {agreements.filter(a => a.payment_status === "pending").length}
        </span>
      </div>

      {agreements.length === 0 ? (
        <p style={{ color: "var(--ink-muted)", fontSize: "0.9rem" }}>No vendor agreements submitted yet.</p>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", background: "var(--surface-elevated)", borderRadius: "10px", overflow: "hidden" }}>
            <thead>
              <tr>
                {["Vendor", "Contact", "Email", "Space", "Days", "Elec", "Amount", "Status", "Signed", "Submitted"].map(h => (
                  <th key={h} style={vhcell}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {agreements.map(a => (
                <tr
                  key={a.id}
                  onClick={() => setSelected(selected?.id === a.id ? null : a)}
                  style={{ cursor: "pointer", background: selected?.id === a.id ? "rgba(61,184,175,0.06)" : "transparent" }}
                >
                  <td style={vcell}>
                    <div style={{ fontWeight: 600 }}>{a.vendor_name}</div>
                    {a.business_name && a.business_name !== a.vendor_name && (
                      <div style={{ fontSize: "0.75rem", color: "var(--ink-muted)" }}>{a.business_name}</div>
                    )}
                  </td>
                  <td style={vcell}>{a.contact_name}</td>
                  <td style={vcell}>{a.email}</td>
                  <td style={vcell}>{SPACE_LABELS[a.space_type] ?? a.space_type}</td>
                  <td style={{ ...vcell, fontSize: "0.75rem", color: "var(--ink-muted)" }}>{a.selected_days || "All 3"}</td>
                  <td style={vcell}>{a.electricity === "yes" ? "Yes" : "No"}</td>
                  <td style={{ ...vcell, fontWeight: 600 }}>{a.price_cents === 0 ? "Free" : `$${(a.price_cents / 100).toFixed(0)}`}</td>
                  <td style={vcell}><span style={statusStyle(a.payment_status)}>{a.payment_status}</span></td>
                  <td style={{ ...vcell, fontSize: "0.75rem" }}>{a.printed_name}<br /><span style={{ color: "var(--ink-muted)" }}>{a.sig_date}</span></td>
                  <td style={{ ...vcell, fontSize: "0.75rem", color: "var(--ink-muted)" }}>{new Date(a.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selected && (
        <div className="admin-detail-panel" style={{ marginTop: "1.5rem" }}>
          <div className="admin-detail-header">
            <span className="admin-detail-title">{selected.vendor_name}</span>
            <button className="admin-detail-close" onClick={() => { setSelected(null); setDeleteConfirm(null); }}>✕</button>
          </div>
          <div className="admin-detail-grid">
            {[
              ["Contact",     selected.contact_name],
              ["Email",       selected.email],
              ["Phone",       selected.phone],
              ["Category",    selected.category],
              ["Space",       SPACE_LABELS[selected.space_type] ?? selected.space_type],
              ["Days",        selected.selected_days || "All 3 days"],
              ["Electricity", selected.electricity === "yes" ? "Yes" : "No"],
              ["Amount",      selected.price_cents === 0 ? "Complimentary" : `$${(selected.price_cents / 100).toFixed(0)}`],
              ["Signed by",   selected.printed_name],
              ["Signed on",   selected.sig_date],
              ["Submitted",   new Date(selected.created_at).toLocaleString()],
            ].map(([label, value]) => (
              <div key={label} className="admin-detail-field">
                <div className="admin-detail-label">{label}</div>
                <div className="admin-detail-value">{value}</div>
              </div>
            ))}
          </div>
          <div style={{ padding: "1rem 1.25rem", borderTop: "1px solid var(--line-subtle)", display: "flex", flexWrap: "wrap", gap: "0.75rem", alignItems: "center" }}>
            <span style={{ fontSize: "0.78rem", color: "var(--ink-muted)", marginRight: "0.25rem" }}>Status:</span>
            {["pending", "confirmed", "cancelled"].map(s => (
              <button
                key={s}
                disabled={saving || selected.payment_status === s}
                onClick={() => updateStatus(selected.id, s)}
                style={{
                  fontSize: "0.78rem", padding: "0.3rem 0.9rem", borderRadius: "8px", fontFamily: "inherit",
                  cursor: saving || selected.payment_status === s ? "default" : "pointer",
                  fontWeight: selected.payment_status === s ? 700 : 400,
                  border: selected.payment_status === s ? "2px solid" : "1px solid rgba(0,0,0,0.15)",
                  background: selected.payment_status === s
                    ? (s === "confirmed" ? "rgba(61,184,175,0.15)" : s === "pending" ? "rgba(201,152,63,0.15)" : "rgba(200,200,200,0.15)")
                    : "transparent",
                  color: selected.payment_status === s
                    ? (s === "confirmed" ? "#3DB8AF" : s === "pending" ? "#C9983F" : "#888")
                    : "var(--ink-muted)",
                  borderColor: selected.payment_status === s
                    ? (s === "confirmed" ? "#3DB8AF" : s === "pending" ? "#C9983F" : "#bbb")
                    : "rgba(0,0,0,0.15)",
                  opacity: saving ? 0.6 : 1,
                }}
              >
                {saving && selected.payment_status !== s ? "…" : s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
            <div style={{ marginLeft: "auto" }}>
              {deleteConfirm === selected.id ? (
                <span style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                  <span style={{ fontSize: "0.78rem", color: "#dc5050" }}>Delete this record?</span>
                  <button
                    onClick={() => deleteAgreement(selected.id)}
                    disabled={saving}
                    style={{ fontSize: "0.78rem", padding: "0.3rem 0.8rem", borderRadius: "6px", background: "#dc5050", color: "#fff", border: "none", cursor: "pointer", fontFamily: "inherit" }}
                  >
                    {saving ? "…" : "Yes, delete"}
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(null)}
                    style={{ fontSize: "0.78rem", padding: "0.3rem 0.8rem", borderRadius: "6px", background: "transparent", color: "var(--ink-muted)", border: "1px solid var(--line-medium)", cursor: "pointer", fontFamily: "inherit" }}
                  >
                    Cancel
                  </button>
                </span>
              ) : (
                <button
                  onClick={() => setDeleteConfirm(selected.id)}
                  style={{ fontSize: "0.78rem", color: "#dc5050", background: "none", border: "none", cursor: "pointer", padding: 0, fontFamily: "inherit" }}
                >
                  Delete record
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Generic Data Table ────────────────────────────────────────────────

function DataTab({ tableKey, columns }: { tableKey: TableName; columns: string[] }) {
  const [rows, setRows] = useState<Record<string, unknown>[]>([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedRow, setSelectedRow] = useState<Record<string, unknown> | null>(null);

  const fetchData = useCallback(async (searchQuery?: string) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ table: tableKey });
      if (searchQuery) params.set("search", searchQuery);
      const res = await fetch(`/api/admin/data?${params}`);
      if (res.ok) {
        const data = await res.json();
        setRows(data.rows || []);
        setCount(data.count || 0);
      }
    } catch {
      setRows([]);
    }
    setLoading(false);
  }, [tableKey]);

  // This client-only tab synchronizes its initial state with the admin API.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { fetchData(); }, [fetchData]);

  useEffect(() => {
    const t = setTimeout(() => fetchData(search), 300);
    return () => clearTimeout(t);
  }, [search, fetchData]);

  const exportCSV = () => {
    if (rows.length === 0) return;
    const csv = [columns.join(","), ...rows.map(row => columns.map(c => `"${String(row[c] ?? "").replace(/"/g, '""')}"`).join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${tableKey}_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  };

  return (
    <>
      <div className="admin-toolbar">
        <div className="admin-toolbar-left">
          <span className="admin-count">{count} records</span>
          <input
            type="text" value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by email…" className="admin-search"
          />
        </div>
        <div className="admin-toolbar-right">
          <button onClick={() => fetchData(search)} className="admin-refresh-btn">Refresh</button>
          <button onClick={exportCSV} className="admin-export-btn" disabled={rows.length === 0}>Export CSV</button>
        </div>
      </div>

      <div className="admin-table-wrap">
        {loading ? (
          <div className="admin-loading">Loading…</div>
        ) : rows.length === 0 ? (
          <div className="admin-empty">No records found</div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>{columns.map(col => <th key={col}>{col.replace(/_/g, " ")}</th>)}</tr>
            </thead>
            <tbody>
              {rows.map((row, i) => {
                const isSelected = selectedRow === row;
                return (
                  <tr
                    key={i}
                    onClick={() => setSelectedRow(isSelected ? null : row)}
                    style={{ cursor: "pointer", background: isSelected ? "rgba(139,95,191,0.07)" : undefined }}
                  >
                    {columns.map(col => (
                      <td key={col}>{col === "created_at" ? fmtDate(row[col]) : String(row[col] ?? "—")}</td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {selectedRow && (
        <div className="admin-detail-panel">
          <div className="admin-detail-header">
            <span className="admin-detail-title">
              {String(selectedRow.name ?? selectedRow.email ?? `Record #${selectedRow.id}`)}
            </span>
            <button className="admin-detail-close" onClick={() => setSelectedRow(null)}>✕ Close</button>
          </div>
          <div className="admin-detail-grid">
            {columns.filter(col => col !== "id" && col !== "created_at").map(col => {
              const val = selectedRow[col];
              const display = String(val ?? "—");
              if (!display || display === "—") return null;
              return (
                <div key={col} className="admin-detail-field">
                  <div className="admin-detail-label">{col.replace(/_/g, " ")}</div>
                  <div className="admin-detail-value">{display}</div>
                </div>
              );
            })}
            <div className="admin-detail-field">
              <div className="admin-detail-label">submitted</div>
              <div className="admin-detail-value">{fmtDate(selectedRow.created_at)}</div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ── Main Admin Page ───────────────────────────────────────────────────

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [role, setRole] = useState<AdminRole | null>(null);
  const [password, setPassword] = useState<string>(() => readSavedPassword().value);
  const [rememberMe, setRememberMe] = useState<boolean>(() => readSavedPassword().remembered);
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<ActiveTab>("overview");
  const [dbSetupStatus, setDbSetupStatus] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/auth")
      .then(async (r) => {
        if (r.ok) {
          const data = await r.json();
          setRole(data.role);
          setAuthenticated(true);
        }
      })
      .catch(() => {});
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError("");
    const res = await fetch("/api/admin/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (res.ok) {
      const data = await res.json();
      setRole(data.role);
      setAuthenticated(true);
      if (rememberMe) localStorage.setItem("ww-admin-pw", password);
      else localStorage.removeItem("ww-admin-pw");
      setPassword("");
    } else {
      setLoginError("Invalid password");
    }
    setLoginLoading(false);
  };

  const handleLogout = async () => {
    await fetch("/api/admin/auth", { method: "DELETE" });
    setAuthenticated(false);
    setRole(null);
  };

  const handleDbSetup = async () => {
    setDbSetupStatus("Setting up…");
    try {
      const res = await fetch("/api/admin/db-setup", { method: "POST" });
      const data = await res.json();
      setDbSetupStatus(res.ok ? `✅ ${data.message}` : `❌ ${data.error}`);
    } catch {
      setDbSetupStatus("❌ Failed to connect");
    }
  };

  // ── Login Screen ──
  if (!authenticated) {
    return (
      <div className="admin-login">
        <div className="admin-login-card">
          <div className="admin-login-logo" style={{ fontFamily: "var(--font-display)" }}>Wellness Weekend</div>
          <h1 className="admin-login-title">Admin Dashboard</h1>
          <form onSubmit={handleLogin} className="admin-login-form">
            <input
              type="password" value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Enter password" className="admin-input" autoFocus
            />
            <label className="admin-remember">
              <input type="checkbox" checked={rememberMe} onChange={e => setRememberMe(e.target.checked)} />
              Remember password
            </label>
            {loginError && <p className="admin-error">{loginError}</p>}
            <button type="submit" className="admin-login-btn" disabled={loginLoading}>
              {loginLoading ? "Signing in…" : "Sign In"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  const canSetupDb = role === "owner" || role === "chris";
  const canSeeFinancials = role === "owner" || role === "alice";
  const roleLabel = role === "owner" ? "Owner" : role === "alice" ? "Alice" : role === "chris" ? "Chris" : "Staff";

  const tab = (key: ActiveTab, label: string, restricted?: boolean) => {
    if (restricted && !canSeeFinancials) return null;
    return (
      <button
        key={key}
        className={`admin-tab${activeTab === key ? " active" : ""}`}
        onClick={() => setActiveTab(key)}
      >
        {label}
      </button>
    );
  };

  return (
    <div className="admin-dashboard">
      <header className="admin-header">
        <div>
          <h1 className="admin-brand" style={{ fontFamily: "var(--font-display)" }}>Wellness Weekend</h1>
          <span className="admin-badge">{roleLabel}</span>
        </div>
        <div className="admin-header-actions">
          {canSetupDb && (
            <button onClick={handleDbSetup} className="admin-setup-btn">Setup DB</button>
          )}
          <button onClick={handleLogout} className="admin-logout-btn">Sign Out</button>
        </div>
      </header>

      {dbSetupStatus && <div className="admin-status-bar">{dbSetupStatus}</div>}

      {/* Tabs */}
      <div className="admin-tabs">
        {tab("overview", "Overview")}
        {tab("loyalty", "Loyalty")}
        {tab("budget", "Budget", true)}

        <span className="admin-tab-sep" />

        {tab("affiliates", "Affiliates")}
        {tab("referral_events", "Referrals")}
        {tab("newsletter", "Newsletter")}
        {tab("leads", "Leads")}

        <span className="admin-tab-sep" />

        {tab("addons", "Add-Ons")}
        {tab("vendor_agreements", "Agreements")}
        {tab("vendors", "Vendors")}
        {tab("volunteers", "Volunteers")}
        {tab("instructor_waitlist", "Instructors")}
        {tab("sponsors", "Sponsors")}
      </div>

      {/* Tab content */}
      {activeTab === "overview"            && <OverviewTab />}
      {activeTab === "loyalty"             && <LoyaltyTab />}
      {activeTab === "budget"              && canSeeFinancials && <BudgetTab />}
      {activeTab === "affiliates"          && <AffiliatesTab />}
      {activeTab === "referral_events"     && <DataTab tableKey="referral_events"    columns={["id","affiliate_code","event_type","order_id","order_amount_cents","commission_cents","created_at"]} />}
      {activeTab === "newsletter"          && <DataTab tableKey="newsletter"          columns={["id","email","created_at"]} />}
      {activeTab === "leads"               && <DataTab tableKey="leads"               columns={["id","name","email","phone","message","source","created_at"]} />}
      {activeTab === "addons"              && <AddonsTab />}
      {activeTab === "vendor_agreements"   && <VendorAgreementsTab />}
      {activeTab === "vendors"             && <DataTab tableKey="vendors"             columns={["id","name","email","business","category","description","created_at"]} />}
      {activeTab === "volunteers"          && <DataTab tableKey="volunteers"          columns={["id","name","email","phone","interest","experience","availability","created_at"]} />}
      {activeTab === "instructor_waitlist" && <DataTab tableKey="instructor_waitlist" columns={["id","name","email","phone","modality","years_teaching","interested_in_2026","interested_in_2027","offering","created_at"]} />}
      {activeTab === "sponsors"            && <DataTab tableKey="sponsors"            columns={["id","name","email","company","budget_range","interests","goals","created_at"]} />}
    </div>
  );
}
