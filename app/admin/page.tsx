"use client";

import { useState, useEffect, useCallback } from "react";

type TableName = "leads" | "newsletter" | "vendors" | "volunteers";

interface TabConfig {
  key: TableName;
  label: string;
  columns: string[];
}

const TABS: TabConfig[] = [
  { key: "leads", label: "Leads", columns: ["id", "name", "email", "phone", "message", "source", "created_at"] },
  { key: "newsletter", label: "Newsletter", columns: ["id", "email", "created_at"] },
  { key: "vendors", label: "Vendors", columns: ["id", "name", "email", "business", "category", "website", "description", "created_at"] },
  { key: "volunteers", label: "Volunteers", columns: ["id", "name", "email", "phone", "interest", "experience", "availability", "created_at"] },
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

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false);
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

  // Check if already authenticated on mount
  useEffect(() => {
    fetch("/api/admin/data?table=leads")
      .then((r) => {
        if (r.ok) setAuthenticated(true);
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
      setAuthenticated(true);
      // Save or clear password based on remember me
      if (rememberMe) {
        localStorage.setItem("ww-admin-pw", password);
      } else {
        localStorage.removeItem("ww-admin-pw");
      }
      setPassword("");
    } else {
      setLoginError("Invalid password");
    }
    setLoginLoading(false);
  };

  const handleLogout = async () => {
    await fetch("/api/admin/auth", { method: "DELETE" });
    setAuthenticated(false);
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

  // Fetch data when tab or search changes (canonical fetch-on-deps pattern; rule over-flags this)
  useEffect(() => {
    if (authenticated) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      fetchData(activeTab, search);
    }
  }, [authenticated, activeTab, search, fetchData]);

  const handleDbSetup = async () => {
    setDbSetupStatus("Setting up...");
    try {
      const res = await fetch("/api/admin/db-setup", { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        setDbSetupStatus(`✅ ${data.message}`);
      } else {
        setDbSetupStatus(`❌ ${data.error}`);
      }
    } catch {
      setDbSetupStatus("❌ Failed to connect");
    }
  };

  const exportCSV = () => {
    if (rows.length === 0) return;
    const tab = TABS.find((t) => t.key === activeTab);
    if (!tab) return;

    const header = tab.columns.join(",");
    const csvRows = rows.map((row) =>
      tab.columns
        .map((col) => {
          const val = String(row[col] ?? "").replace(/"/g, '""');
          return `"${val}"`;
        })
        .join(",")
    );
    const csv = [header, ...csvRows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${activeTab}_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // ── Login Screen ──
  if (!authenticated) {
    return (
      <div className="admin-login">
        <div className="admin-login-card">
          <div className="admin-login-logo" style={{ fontFamily: "var(--font-display)" }}>
            Wellness Weekend
          </div>
          <h1 className="admin-login-title">Admin Dashboard</h1>
          <form onSubmit={handleLogin} className="admin-login-form">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password"
              className="admin-input"
              autoFocus
            />
            <label className="admin-remember">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              Remember password
            </label>
            {loginError && <p className="admin-error">{loginError}</p>}
            <button type="submit" className="admin-login-btn" disabled={loginLoading}>
              {loginLoading ? "Signing in..." : "Sign In"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ── Dashboard ──
  const activeTabConfig = TABS.find((t) => t.key === activeTab)!;

  return (
    <div className="admin-dashboard">
      {/* Header */}
      <header className="admin-header">
        <div>
          <h1 className="admin-brand" style={{ fontFamily: "var(--font-display)" }}>
            Wellness Weekend
          </h1>
          <span className="admin-badge">Admin</span>
        </div>
        <div className="admin-header-actions">
          <button onClick={handleDbSetup} className="admin-setup-btn">
            Setup DB
          </button>
          <button onClick={handleLogout} className="admin-logout-btn">
            Sign Out
          </button>
        </div>
      </header>

      {dbSetupStatus && (
        <div className="admin-status-bar">{dbSetupStatus}</div>
      )}

      {/* Tabs */}
      <div className="admin-tabs">
        {TABS.map((tab) => (
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
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by email..."
            className="admin-search"
          />
        </div>
        <div className="admin-toolbar-right">
          <button onClick={() => fetchData(activeTab, search)} className="admin-refresh-btn">
            Refresh
          </button>
          <button onClick={exportCSV} className="admin-export-btn" disabled={rows.length === 0}>
            Export CSV
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="admin-table-wrap">
        {loading ? (
          <div className="admin-loading">Loading...</div>
        ) : rows.length === 0 ? (
          <div className="admin-empty">No records found</div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                {activeTabConfig.columns.map((col) => (
                  <th key={col}>{col.replace(/_/g, " ")}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={i}>
                  {activeTabConfig.columns.map((col) => (
                    <td key={col}>
                      {col === "created_at"
                        ? (() => {
                            const raw = String(row[col] ?? "");
                            if (!raw) return "—";
                            // Ensure timezone info: if no Z or +/- offset, append Z (UTC)
                            const isoStr = raw.includes("Z") || raw.includes("+") || /\d{2}:\d{2}$/.test(raw) === false
                              ? raw.replace(" ", "T") + (raw.includes("Z") || raw.includes("+") ? "" : "Z")
                              : raw.replace(" ", "T");
                            const d = new Date(isoStr);
                            return isNaN(d.getTime())
                              ? raw
                              : d.toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                });
                          })()
                        : String(row[col] ?? "—")}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
