"use client";

import { useState, useEffect, useCallback } from "react";
import type { AdminRole } from "@/app/api/admin/auth/route";

type TableName =
  | "leads" | "newsletter" | "vendors" | "volunteers"
  | "sponsors" | "instructor_waitlist" | "affiliates" | "referral_events";

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
  { key: "volunteers",          label: "Volunteers",   columns: ["id","name","email","phone","interest","availability","created_at"] },
  { key: "instructor_waitlist", label: "Instructors",  columns: ["id","name","email","phone","modality","years_teaching","interested_in_2026","interested_in_2027","offering","created_at"] },
  { key: "affiliates",          label: "Affiliates",   columns: ["id","name","email","code","company","commission_pct","status","notes","created_at"] },
  { key: "referral_events",     label: "Referrals",    columns: ["id","affiliate_code","event_type","order_id","order_amount_cents","commission_cents","created_at"] },
];

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

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [role, setRole] = useState<AdminRole | null>(null);
  const [password, setPassword] = useState<string>(() => readSavedPassword().value);
  const [rememberMe, setRememberMe] = useState<boolean>(() => readSavedPassword().remembered);
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  const [activeTab, setActiveTab] = useState<TableName>("leads");
  const [rows, setRows] = useState<Record<string, unknown>[]>([]);
  const [count, setCount] = useState(0);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [dbSetupStatus, setDbSetupStatus] = useState<string | null>(null);

  // Affiliate inline editing
  const [affiliateEdits, setAffiliateEdits] = useState<Record<number, { status?: string; commissionPct?: string; notes?: string }>>({});
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

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => {
    if (authenticated) fetchData(activeTab, search);
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
    if (rows.length === 0) return;
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

  const activeTabConfig = ALL_TABS.find((t) => t.key === activeTab)!;
  const canSetupDb = role === "owner" || role === "chris";
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
        {ALL_TABS.map((tab) => (
          <button
            key={tab.key}
            className={`admin-tab${activeTab === tab.key ? " active" : ""}`}
            onClick={() => { setActiveTab(tab.key); setSearch(""); }}
          >
            {tab.label}
          </button>
        ))}
      </div>

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
          <button onClick={() => fetchData(activeTab, search)} className="admin-refresh-btn">Refresh</button>
          <button onClick={exportCSV} className="admin-export-btn" disabled={rows.length === 0}>Export CSV</button>
        </div>
      </div>

      {activeTab === "affiliates" && (
        <div style={{ padding: "0.75rem 1.5rem", background: "rgba(61,184,175,0.05)", borderBottom: "1px solid var(--line-subtle)", fontSize: "0.8rem", color: "var(--ink-muted)" }}>
          Edit Status, Commission %, or Notes inline then click <strong style={{ color: "var(--ink)" }}>Save</strong> to approve or adjust a partner.
        </div>
      )}

      {/* Table */}
      <div className="admin-table-wrap">
        {loading ? (
          <div className="admin-loading">Loading…</div>
        ) : rows.length === 0 ? (
          <div className="admin-empty">No records found</div>
        ) : (
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
                return (
                  <tr key={i}>
                    {activeTabConfig.columns.map((col) => {
                      const val = row[col];
                      if (activeTab === "affiliates" && col === "status") {
                        return (
                          <td key={col}>
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
                          <td key={col}>
                            <input
                              type="number" defaultValue={String(val ?? 10)} min={0} max={100}
                              onChange={(e) => setAffiliateEdits((a) => ({ ...a, [rowId]: { ...a[rowId], commissionPct: e.target.value } }))}
                              style={{ width: "55px", background: "var(--surface-elevated)", border: "1px solid var(--line-medium)", borderRadius: "6px", color: "var(--ink)", padding: "0.2rem 0.4rem", fontSize: "0.8rem" }}
                            />
                            <span style={{ marginLeft: "2px", fontSize: "0.75rem", color: "var(--ink-muted)" }}>%</span>
                          </td>
                        );
                      }
                      if (activeTab === "affiliates" && col === "notes") {
                        return (
                          <td key={col}>
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
                      <td>
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
        )}
      </div>
    </div>
  );
}
