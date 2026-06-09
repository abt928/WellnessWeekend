"use client";

import { useState, useEffect, useCallback } from "react";
import type { AdminRole } from "@/app/api/admin/auth/route";

type TableName =
  | "leads" | "newsletter" | "vendors" | "volunteers"
  | "sponsors" | "instructor_waitlist" | "affiliates" | "referral_events";

type ActiveTab = TableName | "dashboard" | "guestlist" | "addons" | "vendor_agreements";

interface TabConfig {
  key: TableName;
  label: string;
  columns: string[];
}

const ALL_TABS: TabConfig[] = [
  { key: "leads",               label: "Leads",        columns: ["id","name","email","phone","message","source","created_at"] },
  { key: "newsletter",          label: "Newsletter",   columns: ["id","email","created_at"] },
  { key: "sponsors",            label: "Sponsors",     columns: ["id","name","email","company","budget_range","interests","goals","created_at"] },
  { key: "vendors",             label: "Vendors",      columns: ["id","name","email","business","category","description","created_at"] },
  { key: "volunteers",          label: "Volunteers",   columns: ["id","name","email","phone","interest","experience","availability","created_at"] },
  { key: "instructor_waitlist", label: "Instructors",  columns: ["id","name","email","phone","modality","years_teaching","interested_in_2026","interested_in_2027","offering","created_at"] },
  { key: "affiliates",          label: "Affiliates",   columns: ["id","name","email","code","company","commission_pct","status","notes","created_at"] },
  { key: "referral_events",     label: "Referrals",    columns: ["id","affiliate_code","event_type","order_id","order_amount_cents","commission_cents","created_at"] },
];

// ── Sales / Dashboard types ──────────────────────────────────────────

interface SalesKPI {
  totalOrders: number;
  totalRevenueCents: number;
  avgOrderCents: number;
  affiliateOrders: number;
  affiliateRevenueCents: number;
  totalCommissionCents: number;
}

interface LeaderboardRow {
  referral_code: string;
  affiliate_name: string | null;
  affiliate_company: string | null;
  order_count: number;
  revenue_cents: number;
  commission_cents: number;
}

interface RecentOrder {
  id: number;
  square_payment_id: string | null;
  amount_cents: number;
  currency: string;
  customer_email: string | null;
  referral_code: string | null;
  line_items: string | null;
  status: string;
  created_at: string;
  source?: string;
  description?: string | null;
}

interface DailyRevenue {
  day: string;
  orders: number;
  revenue_cents: number;
}

interface SalesData {
  kpi: SalesKPI;
  leaderboard: LeaderboardRow[];
  recentOrders: RecentOrder[];
  dailyRevenue: DailyRevenue[];
}

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

// ── KPI Card ─────────────────────────────────────────────────────────

function KPICard({ label, value, sub, highlight }: { label: string; value: string; sub?: string; highlight?: boolean }) {
  return (
    <div style={{
      background: "var(--surface-elevated)", border: "1px solid var(--line-medium)",
      borderRadius: "12px", padding: "1.25rem 1.5rem", minWidth: "160px",
    }}>
      <div style={{ fontSize: "1.6rem", fontWeight: 700, color: highlight ? "#2a9d8f" : "var(--ink)", fontFamily: "var(--font-display)" }}>
        {value}
      </div>
      <div style={{ fontSize: "0.72rem", color: "var(--ink-muted)", textTransform: "uppercase", letterSpacing: "0.07em", marginTop: "0.3rem" }}>
        {label}
      </div>
      {sub && <div style={{ fontSize: "0.75rem", color: "var(--ink-muted)", marginTop: "0.2rem" }}>{sub}</div>}
    </div>
  );
}

// ── Revenue Chart ─────────────────────────────────────────────────────

function RevenueChart({ data }: { data: DailyRevenue[] }) {
  // Generate every calendar day in the last 30 days (local time)
  const days: string[] = [];
  const base = new Date();
  for (let i = 29; i >= 0; i--) {
    const d = new Date(base.getFullYear(), base.getMonth(), base.getDate() - i);
    days.push(d.toISOString().slice(0, 10));
  }

  const byDay = new Map(data.map((d) => [d.day, d]));
  const maxCents = Math.max(...data.map((d) => d.revenue_cents), 1);

  const W = 700, H = 160, PL = 56, PB = 28, PT = 12;
  const chartW = W - PL - 8;
  const chartH = H - PB - PT;
  const bw = chartW / days.length;
  const gap = 2;
  const gridColor = "rgba(0,0,0,0.07)";
  const mutedText = "rgba(0,0,0,0.38)";
  const labelEvery = Math.ceil(days.length / 6);

  return (
    <div style={{ background: "var(--surface-elevated)", border: "1px solid var(--line-medium)", borderRadius: "12px", padding: "1rem 1.25rem" }}>
      <h3 style={{ fontSize: "0.75rem", color: "var(--ink-muted)", textTransform: "uppercase", letterSpacing: "0.07em", margin: "0 0 0.75rem" }}>
        Daily Revenue · Last 30 Days
      </h3>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: "auto", display: "block" }} aria-label="Daily revenue chart">
        {/* Y-axis gridlines + labels */}
        {([0, 0.25, 0.5, 0.75, 1] as const).map((t) => {
          const y = PT + chartH * (1 - t);
          const dollars = Math.round((maxCents * t) / 100);
          const label = t === 0 ? "$0" : dollars >= 1000 ? `$${(dollars / 1000).toFixed(1)}k` : `$${dollars}`;
          return (
            <g key={t}>
              <line x1={PL} x2={W - 8} y1={y} y2={y} stroke={gridColor} strokeWidth="1" />
              <text x={PL - 6} y={y + 4} textAnchor="end" fontSize="9" fill={mutedText}>{label}</text>
            </g>
          );
        })}

        {/* Bars */}
        {days.map((day, i) => {
          const row = byDay.get(day);
          const cents = row?.revenue_cents ?? 0;
          const orders = row?.orders ?? 0;
          const barH = cents > 0 ? Math.max((cents / maxCents) * chartH, 3) : 0;
          const x = PL + i * bw + gap / 2;
          const w = bw - gap;
          const y = PT + chartH - barH;
          const showLabel = i % labelEvery === 0 || i === days.length - 1;
          const [yr, mo, dy] = day.split("-").map(Number);
          const dateLabel = new Date(yr, mo - 1, dy).toLocaleDateString("en-US", { month: "short", day: "numeric" });
          const tooltip = cents > 0
            ? `${dateLabel}: $${(cents / 100).toLocaleString("en-US", { minimumFractionDigits: 2 })} · ${orders} order${orders === 1 ? "" : "s"}`
            : `${dateLabel}: No orders`;

          return (
            <g key={day}>
              <rect
                x={x}
                y={cents > 0 ? y : PT + chartH - 1}
                width={Math.max(w, 1)}
                height={cents > 0 ? barH : 1}
                fill={cents > 0 ? "#2a9d8f" : "rgba(42,157,143,0.12)"}
                rx="2"
                opacity={cents > 0 ? 0.85 : 0.5}
              >
                <title>{tooltip}</title>
              </rect>
              {showLabel && (
                <text x={x + w / 2} y={H - 4} textAnchor="middle" fontSize="8.5" fill={mutedText}>
                  {dateLabel}
                </text>
              )}
            </g>
          );
        })}

        {/* Empty state */}
        {data.length === 0 && (
          <text x={W / 2} y={H / 2 - 4} textAnchor="middle" dominantBaseline="middle" fontSize="12" fill={mutedText}>
            No orders yet — chart will populate automatically
          </text>
        )}
      </svg>
    </div>
  );
}

// ── Dashboard Tab ─────────────────────────────────────────────────────

function DashboardTab() {
  const [sales, setSales] = useState<SalesData | null>(null);
  const [budget, setBudget] = useState<{ items: BudgetItem[]; totals: BudgetTotals } | null>(null);
  const [salesLoading, setSalesLoading] = useState(true);
  const [budgetLoading, setBudgetLoading] = useState(true);
  const [addingBudget, setAddingBudget] = useState(false);
  const [budgetForm, setBudgetForm] = useState({ type: "expense", category: "", description: "", amount: "", notes: "" });
  const [budgetSaving, setBudgetSaving] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<string | null>(null);

  const fetchSales = useCallback(async () => {
    setSalesLoading(true);
    try {
      const res = await fetch("/api/admin/sales");
      if (res.ok) setSales(await res.json());
    } finally {
      setSalesLoading(false);
    }
  }, []);

  const syncOrders = async () => {
    setSyncing(true);
    setSyncStatus(null);
    try {
      const res = await fetch("/api/admin/sync-orders", { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        setSyncStatus(`Synced ${data.synced} new order${data.synced !== 1 ? "s" : ""} (${data.skipped} already up to date)`);
        fetchSales();
      } else {
        setSyncStatus(`Error: ${data.error}`);
      }
    } catch {
      setSyncStatus("Sync failed — check console");
    } finally {
      setSyncing(false);
    }
  };

  const fetchBudget = useCallback(async () => {
    setBudgetLoading(true);
    try {
      const res = await fetch("/api/admin/budget");
      if (res.ok) setBudget(await res.json());
    } finally {
      setBudgetLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSales();
    fetchBudget();
  }, [fetchSales, fetchBudget]);

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

  const cell = {
    padding: "0.6rem 0.75rem", borderBottom: "1px solid var(--line-subtle)",
    fontSize: "0.82rem", color: "var(--ink)", verticalAlign: "middle" as const,
  };
  const hcell = {
    ...cell, color: "var(--ink-muted)", fontSize: "0.7rem",
    textTransform: "uppercase" as const, letterSpacing: "0.06em", fontWeight: 600, background: "var(--surface-elevated)",
  };

  const netRevenue = budget ? (budget.totals.income_cents - budget.totals.expense_cents) : null;
  const revenueTarget = budget?.totals.revenue_target_cents ?? 0;

  return (
    <div style={{ padding: "1.5rem 2rem", display: "flex", flexDirection: "column", gap: "2rem" }}>

      {/* Sales KPIs */}
      <section>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
          <h2 style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--ink-muted)", textTransform: "uppercase", letterSpacing: "0.08em", margin: 0 }}>
            Live Sales Ledger
          </h2>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            {syncStatus && <span style={{ fontSize: "0.75rem", color: syncing ? "var(--ink-muted)" : syncStatus.startsWith("Error") ? "#c0392b" : "#2a9d8f" }}>{syncStatus}</span>}
            <button onClick={syncOrders} disabled={syncing} style={{ fontSize: "0.78rem", color: "#2a9d8f", background: "none", border: "1px solid rgba(42,157,143,0.3)", borderRadius: "6px", cursor: syncing ? "default" : "pointer", padding: "0.25rem 0.75rem", opacity: syncing ? 0.6 : 1 }}>
              {syncing ? "Syncing…" : "Sync from Square"}
            </button>
            <button onClick={fetchSales} style={{ fontSize: "0.78rem", color: "var(--ink-muted)", background: "none", border: "none", cursor: "pointer", padding: 0 }}>
              Refresh
            </button>
          </div>
        </div>
        {salesLoading ? (
          <div style={{ color: "var(--ink-muted)", fontSize: "0.85rem" }}>Loading…</div>
        ) : sales ? (
          <>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", marginBottom: "1.5rem" }}>
              <KPICard label="Ticket Revenue" value={usd(sales.kpi.totalRevenueCents)} highlight />
              <KPICard label="Tickets Sold" value={String(sales.kpi.totalOrders)} />
              <KPICard label="Avg Order" value={usd(sales.kpi.avgOrderCents)} />
              <KPICard label="Affiliate Orders" value={String(sales.kpi.affiliateOrders)} sub={`${usd(sales.kpi.affiliateRevenueCents)} revenue`} />
              <KPICard label="Commissions Owed" value={usd(sales.kpi.totalCommissionCents)} />
            </div>

            <RevenueChart data={sales.dailyRevenue} />

            {/* Affiliate leaderboard */}
            {sales.leaderboard.length > 0 && (
              <div style={{ marginBottom: "1.5rem" }}>
                <h3 style={{ fontSize: "0.75rem", color: "var(--ink-muted)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: "0.75rem" }}>
                  Partner Leaderboard
                </h3>
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", background: "var(--surface-elevated)", borderRadius: "10px", overflow: "hidden" }}>
                    <thead>
                      <tr>
                        {["Partner", "Code", "Orders", "Revenue", "Commission"].map(h => (
                          <th key={h} style={hcell}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {sales.leaderboard.map((row) => (
                        <tr key={row.referral_code}>
                          <td style={cell}>{row.affiliate_name || row.affiliate_company || "—"}</td>
                          <td style={{ ...cell, fontFamily: "monospace", color: "var(--psyche-cyan)" }}>{row.referral_code}</td>
                          <td style={cell}>{row.order_count}</td>
                          <td style={cell}>{usd(row.revenue_cents)}</td>
                          <td style={{ ...cell, color: "#3DB8AF" }}>{usd(row.commission_cents)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Recent orders */}
            <div>
              <h3 style={{ fontSize: "0.75rem", color: "var(--ink-muted)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: "0.75rem" }}>
                Recent Ticket Orders
              </h3>
              {sales.recentOrders.length === 0 ? (
                <p style={{ color: "var(--ink-muted)", fontSize: "0.85rem" }}>
                  No orders synced yet — click <strong>Sync from Square</strong> above to pull your ticket sales.
                </p>
              ) : (
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", background: "var(--surface-elevated)", borderRadius: "10px", overflow: "hidden" }}>
                    <thead>
                      <tr>
                        {["Date", "Name", "Email", "Items / Add-ons", "Amount", "Referral"].map(h => (
                          <th key={h} style={hcell}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {sales.recentOrders.map((o, i) => {
                        let lineItems: { name: string; quantity: number; priceCents: number }[] = [];
                        try { if (o.line_items) lineItems = JSON.parse(o.line_items); } catch { /* ignore */ }
                        return (
                          <tr key={`order-${o.id}-${i}`}>
                            <td style={cell}>{fmtDate(o.created_at)}</td>
                            <td style={{ ...cell, fontWeight: 600 }}>{(o as any).customer_name || "—"}</td>
                            <td style={cell}>{o.customer_email || "—"}</td>
                            <td style={cell}>
                              {lineItems.length > 0 ? (
                                <div style={{ display: "flex", flexDirection: "column", gap: "0.15rem" }}>
                                  {lineItems.map((li, j) => (
                                    <div key={j} style={{ fontSize: "0.78rem" }}>
                                      {li.quantity > 1 && <span style={{ color: "var(--ink-muted)", marginRight: "0.3rem" }}>{li.quantity}×</span>}
                                      {li.name}
                                      {li.priceCents > 0 && <span style={{ color: "var(--ink-muted)", marginLeft: "0.3rem" }}>{usd(li.priceCents)}</span>}
                                    </div>
                                  ))}
                                </div>
                              ) : "—"}
                            </td>
                            <td style={{ ...cell, fontWeight: 600 }}>{usd(o.amount_cents)}</td>
                            <td style={{ ...cell, fontFamily: "monospace", fontSize: "0.78rem", color: o.referral_code ? "var(--psyche-cyan)" : "var(--ink-muted)" }}>
                              {o.referral_code || "—"}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        ) : (
          <p style={{ color: "var(--ink-muted)", fontSize: "0.85rem" }}>Failed to load sales data. Run Setup DB first.</p>
        )}
      </section>

      {/* Budget & Expenses */}
      <section>
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

        {/* Budget summary cards */}
        {budget && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", marginBottom: "1.25rem" }}>
            <KPICard label="Revenue Target" value={usd(revenueTarget)} />
            <KPICard label="Actual Income" value={usd(budget.totals.income_cents)} highlight />
            <KPICard label="Expenses" value={usd(budget.totals.expense_cents)} />
            <KPICard
              label="Net (Income – Expenses)"
              value={netRevenue !== null ? usd(netRevenue) : "—"}
              highlight={netRevenue !== null && netRevenue >= 0}
            />
            {revenueTarget > 0 && (
              <KPICard
                label="Goal Progress"
                value={`${Math.round((budget.totals.income_cents / revenueTarget) * 100)}%`}
              />
            )}
          </div>
        )}

        {/* Add budget item form */}
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

        {/* Budget table */}
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
      </section>
    </div>
  );
}

// ── Guest List Tab ────────────────────────────────────────────────────

function GuestListTab() {
  const [headers, setHeaders] = useState<string[]>([]);
  const [rows, setRows] = useState<Record<string, string>[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [needsSetup, setNeedsSetup] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedGuest, setSelectedGuest] = useState<Record<string, string> | null>(null);

  useEffect(() => {
    fetch("/api/admin/guestlist")
      .then(async (r) => {
        const d = await r.json();
        if (d.needsSetup) setNeedsSetup(true);
        else if (d.error) setError(d.error);
        else { setHeaders(d.headers || []); setRows(d.rows || []); }
      })
      .catch(() => setError("Failed to load guest list"))
      .finally(() => setLoading(false));
  }, []);

  const nameCol = headers.find(h => /^(full.?name|name|first.?name|attendee|buyer|customer)/i.test(h)) ?? headers[0];
  const emailCol = headers.find(h => /email/i.test(h));
  const phoneCol = headers.find(h => /phone|mobile/i.test(h));

  const getPassType = (row: Record<string, string>): string | null => {
    const passCol = headers.find(h => /pass.?type|ticket.?type|product.?name|item.?name|ticket|product/i.test(h));
    if (passCol && row[passCol]) return row[passCol];
    for (const h of headers) {
      const v = row[h];
      if (v && /(day pass|earth pass|sanctuary pass|weekend pass)/i.test(v)) return v;
    }
    return null;
  };

  const getAddons = (row: Record<string, string>): { label: string; value: string }[] => {
    const addonCols = headers.filter(h =>
      /add.?on|aerial|paddleboard|massage|sauna|workshop|upgrade/i.test(h)
    );
    return addonCols
      .filter(h => {
        const v = row[h];
        return v && v !== "—" && v !== "0" && !/^(no|false|n\/a|none)$/i.test(v);
      })
      .map(h => ({ label: h, value: row[h] }));
  };

  const isReturning = (row: Record<string, string>): boolean => {
    const col = headers.find(h => /return|previous|past|prior|repeat/i.test(h));
    if (!col) return false;
    const v = row[col]?.toLowerCase().trim();
    return v === "yes" || v === "true" || v === "1" || v === "returning" || v === "y";
  };

  const filtered = search
    ? rows.filter((row) => Object.values(row).some((v) => v.toLowerCase().includes(search.toLowerCase())))
    : rows;

  const exportCSV = () => {
    if (rows.length === 0) return;
    const csv = [
      headers.join(","),
      ...rows.map((row) => headers.map((h) => `"${(row[h] ?? "").replace(/"/g, '""')}"`).join(",")),
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `guest-list-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  };

  const passColor = (pass: string) => {
    if (/sanctuary/i.test(pass)) return { bg: "rgba(139,95,191,0.12)", color: "#8B5FBF" };
    if (/earth/i.test(pass))     return { bg: "rgba(124,144,112,0.15)", color: "#5a7050" };
    if (/day/i.test(pass))       return { bg: "rgba(61,184,175,0.12)", color: "#2a9d8f" };
    return { bg: "rgba(0,0,0,0.06)", color: "#555" };
  };

  if (loading) return <div className="admin-loading">Loading guest list…</div>;

  if (needsSetup) return (
    <div style={{ padding: "3rem 2rem", maxWidth: "560px" }}>
      <p style={{ fontWeight: 600, fontSize: "1rem", marginBottom: "1rem", color: "var(--ink)" }}>
        Guest List Not Connected
      </p>
      <p style={{ color: "var(--ink-muted)", fontSize: "0.875rem", marginBottom: "1.5rem", lineHeight: 1.7 }}>
        Connect your Square orders export sheet by publishing it as CSV and adding the URL as a Vercel environment variable.
      </p>
      <ol style={{ color: "var(--ink-muted)", fontSize: "0.85rem", lineHeight: 2.2, paddingLeft: "1.25rem" }}>
        <li>Open your Google Sheet → <strong>File → Share → Publish to web</strong></li>
        <li>Set format to <strong>Comma-separated values (.csv)</strong> → click <strong>Publish</strong></li>
        <li>Copy the URL it gives you</li>
        <li>In Vercel: <strong>Settings → Environment Variables</strong> → add <code style={{ background: "rgba(0,0,0,0.06)", padding: "0.1em 0.4em", borderRadius: "4px" }}>GUESTLIST_SHEET_URL</code> → paste the URL → Redeploy</li>
      </ol>
    </div>
  );

  if (error) return <div className="admin-empty" style={{ color: "#c0392b" }}>{error}</div>;

  return (
    <>
      <div className="admin-toolbar">
        <div className="admin-toolbar-left">
          <span className="admin-count">{filtered.length} of {rows.length} guests</span>
          <input
            type="text" value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, email, pass type…" className="admin-search"
          />
        </div>
        <div className="admin-toolbar-right">
          <button onClick={exportCSV} className="admin-export-btn" disabled={rows.length === 0}>Export CSV</button>
        </div>
      </div>

      <div className="admin-table-wrap">
        {filtered.length === 0 ? (
          <div className="admin-empty">No guests match your search</div>
        ) : (
          <table className="admin-table sheet-table">
            <thead>
              <tr>{headers.map((h, i) => <th key={i}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {filtered.map((row, i) => {
                const returning = isReturning(row);
                const pass = getPassType(row);
                const isSelected = selectedGuest === row;
                return (
                  <tr
                    key={i}
                    onClick={() => setSelectedGuest(isSelected ? null : row)}
                    style={{ cursor: "pointer", background: isSelected ? "rgba(139,95,191,0.07)" : undefined }}
                  >
                    {headers.map((h, j) => {
                      const isNameCol = h === nameCol;
                      const isPassCol = pass !== null && (
                        headers.find(hh => /pass.?type|ticket.?type|product|item.?name|ticket/i.test(hh)) === h
                      );
                      return (
                        <td key={j} title={row[h] || ""}>
                          <span className="cell-truncate" style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
                            {isNameCol && returning && (
                              <span title="Returning attendee" style={{ color: "#c9983f", fontSize: "0.85rem", flexShrink: 0 }}>★</span>
                            )}
                            {isPassCol && pass ? (
                              <span style={{ fontSize: "0.72rem", fontWeight: 600, padding: "0.15rem 0.5rem", borderRadius: "20px", whiteSpace: "nowrap", ...passColor(pass) }}>
                                {pass}
                              </span>
                            ) : (
                              row[h] || "—"
                            )}
                          </span>
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {selectedGuest && (
        <div className="admin-detail-panel" style={{ margin: "0 1.5rem 1.5rem" }}>
          <div className="admin-detail-header">
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
              <span className="admin-detail-title">
                {isReturning(selectedGuest) && <span title="Returning attendee" style={{ color: "#c9983f", marginRight: "0.4rem" }}>★</span>}
                {selectedGuest[nameCol] || "Guest"}
              </span>
              {getPassType(selectedGuest) && (() => {
                const pass = getPassType(selectedGuest)!;
                const c = passColor(pass);
                return <span style={{ fontSize: "0.75rem", fontWeight: 700, padding: "0.2rem 0.75rem", borderRadius: "20px", ...c }}>{pass}</span>;
              })()}
              {isReturning(selectedGuest) && (
                <span style={{ fontSize: "0.72rem", fontWeight: 600, padding: "0.2rem 0.6rem", borderRadius: "20px", background: "rgba(201,152,63,0.12)", color: "#c9983f" }}>
                  ★ Returning Attendee
                </span>
              )}
            </div>
            <button className="admin-detail-close" onClick={() => setSelectedGuest(null)}>✕ Close</button>
          </div>
          <div style={{ padding: "1rem 1.25rem", borderBottom: "1px solid #eeece8", display: "flex", flexWrap: "wrap", gap: "1.5rem" }}>
            {emailCol && selectedGuest[emailCol] && (
              <div>
                <div className="admin-detail-label">Email</div>
                <a href={`mailto:${selectedGuest[emailCol]}`} style={{ fontSize: "0.875rem", color: "#3DB8AF" }}>{selectedGuest[emailCol]}</a>
              </div>
            )}
            {phoneCol && selectedGuest[phoneCol] && (
              <div>
                <div className="admin-detail-label">Phone</div>
                <div style={{ fontSize: "0.875rem" }}>{selectedGuest[phoneCol]}</div>
              </div>
            )}
          </div>
          {getAddons(selectedGuest).length > 0 && (
            <div style={{ padding: "0.9rem 1.25rem", borderBottom: "1px solid #eeece8" }}>
              <div className="admin-detail-label" style={{ marginBottom: "0.5rem" }}>Add-ons Booked</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                {getAddons(selectedGuest).map(({ label, value }) => (
                  <span key={label} style={{ fontSize: "0.78rem", padding: "0.2rem 0.65rem", borderRadius: "20px", background: "rgba(232,149,106,0.12)", color: "#c0622a", fontWeight: 600 }}>
                    {label}{value !== "yes" && value !== "1" && value !== "true" ? `: ${value}` : ""}
                  </span>
                ))}
              </div>
            </div>
          )}
          <div className="admin-detail-grid">
            {headers
              .filter(h => h !== nameCol && h !== emailCol && h !== phoneCol)
              .filter(h => selectedGuest[h] && selectedGuest[h] !== "—")
              .map(h => (
                <div key={h} className="admin-detail-field">
                  <div className="admin-detail-label">{h}</div>
                  <div className="admin-detail-value">{selectedGuest[h]}</div>
                </div>
              ))}
          </div>
        </div>
      )}
    </>
  );
}

// ── Add-Ons Sheet Tab ─────────────────────────────────────────────────

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
    ? rows.filter((row) => Object.values(row).some((v) => v.toLowerCase().includes(search.toLowerCase())))
    : rows;

  const exportCSV = () => {
    if (rows.length === 0) return;
    const csv = [
      headers.join(","),
      ...rows.map((row) => headers.map((h) => `"${(row[h] ?? "").replace(/"/g, '""')}"`).join(",")),
    ].join("\n");
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
                    <td key={j} title={row[h] || ""}>
                      <span className="cell-truncate">{row[h] || "—"}</span>
                    </td>
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
    setSelected((prev) => prev?.id === id ? { ...prev, payment_status } : prev);
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

  const cell: React.CSSProperties  = { padding: "0.55rem 0.75rem", fontSize: "0.82rem", borderBottom: "1px solid rgba(0,0,0,0.05)", verticalAlign: "top" };
  const hcell: React.CSSProperties = { padding: "0.5rem 0.75rem", fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--ink-muted)", background: "rgba(0,0,0,0.03)", textAlign: "left" };

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
                  <th key={h} style={hcell}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {agreements.map((a) => (
                <tr
                  key={a.id}
                  onClick={() => setSelected(selected?.id === a.id ? null : a)}
                  style={{ cursor: "pointer", background: selected?.id === a.id ? "rgba(61,184,175,0.06)" : "transparent" }}
                >
                  <td style={cell}>
                    <div style={{ fontWeight: 600 }}>{a.vendor_name}</div>
                    {a.business_name && a.business_name !== a.vendor_name && (
                      <div style={{ fontSize: "0.75rem", color: "var(--ink-muted)" }}>{a.business_name}</div>
                    )}
                  </td>
                  <td style={cell}>{a.contact_name}</td>
                  <td style={cell}>{a.email}</td>
                  <td style={cell}>{SPACE_LABELS[a.space_type] ?? a.space_type}</td>
                  <td style={{ ...cell, fontSize: "0.75rem", color: "var(--ink-muted)" }}>{a.selected_days || "All 3"}</td>
                  <td style={cell}>{a.electricity === "yes" ? "Yes" : "No"}</td>
                  <td style={{ ...cell, fontWeight: 600 }}>{a.price_cents === 0 ? "Free" : `$${(a.price_cents / 100).toFixed(0)}`}</td>
                  <td style={cell}><span style={statusStyle(a.payment_status)}>{a.payment_status}</span></td>
                  <td style={{ ...cell, fontSize: "0.75rem" }}>{a.printed_name}<br /><span style={{ color: "var(--ink-muted)" }}>{a.sig_date}</span></td>
                  <td style={{ ...cell, fontSize: "0.75rem", color: "var(--ink-muted)" }}>{new Date(a.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Detail panel */}
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

          {/* Status + delete actions */}
          <div style={{ padding: "1rem 1.25rem", borderTop: "1px solid var(--line-subtle)", display: "flex", flexWrap: "wrap", gap: "0.75rem", alignItems: "center" }}>
            <span style={{ fontSize: "0.78rem", color: "var(--ink-muted)", marginRight: "0.25rem" }}>Status:</span>
            {["pending", "confirmed", "cancelled"].map((s) => (
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

// ── Main Admin Page ───────────────────────────────────────────────────

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [role, setRole] = useState<AdminRole | null>(null);
  const [password, setPassword] = useState<string>(() => readSavedPassword().value);
  const [rememberMe, setRememberMe] = useState<boolean>(() => readSavedPassword().remembered);
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  const [activeTab, setActiveTab] = useState<ActiveTab>("dashboard");
  const [rows, setRows] = useState<Record<string, unknown>[]>([]);
  const [count, setCount] = useState(0);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [dbSetupStatus, setDbSetupStatus] = useState<string | null>(null);
  const [selectedRow, setSelectedRow] = useState<Record<string, unknown> | null>(null);

  // Affiliate inline editing
  const [affiliateEdits, setAffiliateEdits] = useState<Record<number, { status?: string; commissionPct?: string; notes?: string; code?: string }>>({});
  const [affiliateSaving, setAffiliateSaving] = useState<number | null>(null);

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
    setRows([]);
  };

  const fetchData = useCallback(async (table: TableName, searchQuery?: string) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ table });
      if (searchQuery) params.set("search", searchQuery);
      const res = await fetch(`/api/admin/data?${params}`);
      if (res.ok) {
        const data = await res.json();
        setRows(data.rows || []);
        setCount(data.count || 0);
      } else if (res.status === 401) {
        setAuthenticated(false);
      }
    } catch {
      setRows([]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (authenticated && activeTab !== "dashboard" && activeTab !== "guestlist" && activeTab !== "addons" && activeTab !== "vendor_agreements") {
      fetchData(activeTab as TableName, search);
    }
  }, [authenticated, activeTab, search, fetchData]);

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

  const exportCSV = () => {
    if (rows.length === 0 || activeTab === "dashboard" || activeTab === "guestlist" || activeTab === "addons") return;
    const tab = ALL_TABS.find((t) => t.key === activeTab)!;
    const header = tab.columns.join(",");
    const csvRows = rows.map((row) =>
      tab.columns.map((col) => `"${String(row[col] ?? "").replace(/"/g, '""')}"`).join(",")
    );
    const blob = new Blob([[header, ...csvRows].join("\n")], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${activeTab}_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  };

  const saveAffiliateEdits = async (id: number) => {
    setAffiliateSaving(id);
    const updates = affiliateEdits[id] ?? {};
    await fetch("/api/admin/affiliates", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, ...updates }),
    });
    setAffiliateSaving(null);
    fetchData("affiliates", search);
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
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password" className="admin-input" autoFocus
            />
            <label className="admin-remember">
              <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />
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

  const activeTabConfig = ALL_TABS.find((t) => t.key === activeTab);
  const canSetupDb = role === "owner" || role === "chris";
  const canSeeDashboard = role === "owner" || role === "alice";
  const roleLabel = role === "owner" ? "Owner" : role === "alice" ? "Alice" : role === "chris" ? "Chris" : "Staff";

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
        {canSeeDashboard && (
          <button
            className={`admin-tab${activeTab === "dashboard" ? " active" : ""}`}
            onClick={() => { setActiveTab("dashboard"); setSearch(""); setSelectedRow(null); }}
          >
            Dashboard
          </button>
        )}
        {ALL_TABS.map((tab) => (
          <button
            key={tab.key}
            className={`admin-tab${activeTab === tab.key ? " active" : ""}`}
            onClick={() => { setActiveTab(tab.key); setSearch(""); setSelectedRow(null); }}
          >
            {tab.label}
          </button>
        ))}
        <button
          className={`admin-tab${activeTab === "guestlist" ? " active" : ""}`}
          onClick={() => { setActiveTab("guestlist"); setSearch(""); setSelectedRow(null); }}
        >
          Guest List
        </button>
        <button
          className={`admin-tab${activeTab === "addons" ? " active" : ""}`}
          onClick={() => { setActiveTab("addons"); setSearch(""); setSelectedRow(null); }}
        >
          Add-Ons
        </button>
        <button
          className={`admin-tab${activeTab === "vendor_agreements" ? " active" : ""}`}
          onClick={() => { setActiveTab("vendor_agreements"); setSearch(""); setSelectedRow(null); }}
        >
          Agreements
        </button>
      </div>

      {/* Dashboard view */}
      {activeTab === "dashboard" && canSeeDashboard && <DashboardTab />}

      {/* Guest List view */}
      {activeTab === "guestlist" && <GuestListTab />}

      {/* Add-Ons view */}
      {activeTab === "addons" && <AddonsTab />}

      {/* Vendor Agreements view */}
      {activeTab === "vendor_agreements" && <VendorAgreementsTab />}

      {/* Data table view */}
      {activeTab !== "dashboard" && activeTab !== "guestlist" && activeTab !== "addons" && activeTab !== "vendor_agreements" && (
        <>
          {/* Toolbar */}
          <div className="admin-toolbar">
            <div className="admin-toolbar-left">
              <span className="admin-count">{count} records</span>
              <input
                type="text" value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by email…" className="admin-search"
              />
            </div>
            <div className="admin-toolbar-right">
              <button onClick={() => fetchData(activeTab as TableName, search)} className="admin-refresh-btn">Refresh</button>
              <button onClick={exportCSV} className="admin-export-btn" disabled={rows.length === 0}>Export CSV</button>
            </div>
          </div>

          {activeTab === "affiliates" && (
            <div style={{ padding: "0.75rem 1.5rem", background: "rgba(61,184,175,0.05)", borderBottom: "1px solid var(--line-subtle)", fontSize: "0.8rem", color: "var(--ink-muted)" }}>
              Edit Code, Status, Commission %, or Notes inline then click <strong style={{ color: "var(--ink)" }}>Save</strong> to approve or adjust a partner.
            </div>
          )}

          {/* Table */}
          <div className="admin-table-wrap">
            {loading ? (
              <div className="admin-loading">Loading…</div>
            ) : rows.length === 0 ? (
              <div className="admin-empty">No records found</div>
            ) : activeTabConfig ? (
              <table className="admin-table">
                <thead>
                  <tr>
                    {activeTabConfig.columns.map((col) => <th key={col}>{col.replace(/_/g, " ")}</th>)}
                    {activeTab === "affiliates" && <th>Save</th>}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, i) => {
                    const rowId = Number(row.id);
                    const isSelected = selectedRow === row;
                    return (
                      <tr
                        key={i}
                        onClick={() => setSelectedRow(isSelected ? null : row)}
                        style={{ cursor: "pointer", background: isSelected ? "rgba(139,95,191,0.07)" : undefined }}
                      >
                        {activeTabConfig.columns.map((col) => {
                          const val = row[col];
                          if (activeTab === "affiliates" && col === "status") {
                            return (
                              <td key={col} onClick={(e) => e.stopPropagation()}>
                                <select
                                  defaultValue={String(val ?? "pending")}
                                  onChange={(e) => setAffiliateEdits((a) => ({ ...a, [rowId]: { ...a[rowId], status: e.target.value } }))}
                                  style={{ background: "var(--surface-elevated)", border: "1px solid var(--line-medium)", borderRadius: "6px", color: "var(--ink)", padding: "0.2rem 0.4rem", fontSize: "0.8rem" }}
                                >
                                  <option value="pending">pending</option>
                                  <option value="active">active</option>
                                  <option value="inactive">inactive</option>
                                </select>
                              </td>
                            );
                          }
                          if (activeTab === "affiliates" && col === "commission_pct") {
                            return (
                              <td key={col} onClick={(e) => e.stopPropagation()}>
                                <input
                                  type="number" defaultValue={String(val ?? 10)} min={0} max={100}
                                  onChange={(e) => setAffiliateEdits((a) => ({ ...a, [rowId]: { ...a[rowId], commissionPct: e.target.value } }))}
                                  style={{ width: "55px", background: "var(--surface-elevated)", border: "1px solid var(--line-medium)", borderRadius: "6px", color: "var(--ink)", padding: "0.2rem 0.4rem", fontSize: "0.8rem" }}
                                />
                                <span style={{ marginLeft: "2px", fontSize: "0.75rem", color: "var(--ink-muted)" }}>%</span>
                              </td>
                            );
                          }
                          if (activeTab === "affiliates" && col === "code") {
                            return (
                              <td key={col} onClick={(e) => e.stopPropagation()}>
                                <input
                                  type="text" defaultValue={String(val ?? "")} placeholder="AFFILIATE CODE"
                                  onChange={(e) => setAffiliateEdits((a) => ({ ...a, [rowId]: { ...a[rowId], code: e.target.value.toUpperCase() } }))}
                                  style={{ width: "110px", background: "var(--surface-elevated)", border: "1px solid var(--line-medium)", borderRadius: "6px", color: "var(--ink)", padding: "0.2rem 0.4rem", fontSize: "0.8rem", textTransform: "uppercase", fontFamily: "monospace" }}
                                />
                              </td>
                            );
                          }
                          if (activeTab === "affiliates" && col === "notes") {
                            return (
                              <td key={col} onClick={(e) => e.stopPropagation()}>
                                <input
                                  type="text" defaultValue={String(val ?? "")} placeholder="Internal notes"
                                  onChange={(e) => setAffiliateEdits((a) => ({ ...a, [rowId]: { ...a[rowId], notes: e.target.value } }))}
                                  style={{ width: "130px", background: "var(--surface-elevated)", border: "1px solid var(--line-medium)", borderRadius: "6px", color: "var(--ink)", padding: "0.2rem 0.4rem", fontSize: "0.8rem" }}
                                />
                              </td>
                            );
                          }
                          return (
                            <td key={col}>{col === "created_at" ? fmtDate(val) : String(val ?? "—")}</td>
                          );
                        })}
                        {activeTab === "affiliates" && (
                          <td onClick={(e) => e.stopPropagation()}>
                            <button
                              onClick={() => saveAffiliateEdits(rowId)}
                              disabled={affiliateSaving === rowId}
                              style={{ background: "rgba(61,184,175,0.15)", border: "1px solid #3DB8AF", borderRadius: "6px", color: "#3DB8AF", padding: "0.2rem 0.7rem", cursor: "pointer", fontSize: "0.8rem", fontFamily: "inherit" }}
                            >
                              {affiliateSaving === rowId ? "…" : "Save"}
                            </button>
                          </td>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : null}
          </div>

          {/* Row detail panel */}
          {selectedRow && activeTabConfig && (
            <div className="admin-detail-panel">
              <div className="admin-detail-header">
                <span className="admin-detail-title">
                  {String(selectedRow.name ?? selectedRow.email ?? `Record #${selectedRow.id}`)}
                </span>
                <button className="admin-detail-close" onClick={() => setSelectedRow(null)}>✕ Close</button>
              </div>
              <div className="admin-detail-grid">
                {activeTabConfig.columns.filter(col => col !== "id" && col !== "created_at").map((col) => {
                  const val = selectedRow[col];
                  const display = col === "created_at" ? fmtDate(val) : String(val ?? "—");
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
      )}
    </div>
  );
}
