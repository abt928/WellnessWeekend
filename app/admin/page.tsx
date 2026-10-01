"use client";
import { useState, useEffect, useCallback } from "react";
import type { AdminRole } from "@/app/api/admin/auth/route";

// ── Types ──────────────────────────────────────────────────────────────

type Section =
  | "overview"
  | "newsletter" | "leads" | "instructors" | "sponsors"
  | "lodging"
  | "budget" | "affiliates" | "partners"
  | "analytics"
  | "archive"
  | "giveaway";

interface BudgetItem {
  id: number; type: string; category: string; description: string;
  amount_cents: number; notes: string | null; created_at: string;
}
interface BudgetTotals {
  revenue_target_cents: number; expense_cents: number; income_cents: number;
}
interface BedRow {
  id: number; category: string; name: string; email: string | null;
  beds: number; notes: string | null; year: number; created_at: string;
}
interface AnalyticsData {
  newsletterByMonth: Array<{ month: string; count: number }>;
  bookingCounts: Array<{ type: string; count: number }>;
  revenueByMonth: Array<{ month: string; total_cents: number; order_count: number }>;
  leadsByMonth: Array<{ month: string; count: number }>;
  totals: {
    newsletter_total: number; leads_total: number; revenue_total_cents: number;
    instructors_total: number; sponsors_total: number;
    massage_count: number; aerial_count: number; paddleboard_count: number;
    volunteer_count: number; warriors_count: number;
  };
}

// ── Auth helpers ───────────────────────────────────────────────────────

function readSavedPassword(): { value: string; remembered: boolean } {
  if (typeof window === "undefined") return { value: "", remembered: false };
  try {
    const saved = window.localStorage.getItem("ww-admin-pw");
    return { value: saved ?? "", remembered: Boolean(saved) };
  } catch {
    return { value: "", remembered: false };
  }
}

// ── Formatting helpers ─────────────────────────────────────────────────

function fmtDate(raw: unknown): string {
  const str = String(raw ?? "");
  if (!str || str === "null" || str === "undefined") return "—";
  const iso = str.includes("Z") || str.includes("+") ? str.replace(" ", "T") : str.replace(" ", "T") + "Z";
  const d = new Date(iso);
  return isNaN(d.getTime()) ? str : d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function usd(cents: number) {
  return `$${(cents / 100).toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

function daysUntil(target: Date): number {
  const now = new Date();
  return Math.max(0, Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
}

// ── Style atoms ────────────────────────────────────────────────────────

const cell: React.CSSProperties = {
  padding: "0.6rem 0.75rem", borderBottom: "1px solid var(--line-subtle)",
  fontSize: "0.82rem", color: "var(--ink)", verticalAlign: "middle",
};
const hcell: React.CSSProperties = {
  ...cell, color: "var(--ink-muted)", fontSize: "0.7rem",
  textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 600,
  background: "var(--surface-elevated)",
};

// ── StatCard ───────────────────────────────────────────────────────────

function StatCard({ label, value, sub, accent }: {
  label: string; value: string | number; sub?: string; accent?: string;
}) {
  return (
    <div style={{ background: "var(--surface-elevated)", border: "1px solid var(--line-medium)", borderRadius: "12px", padding: "1.25rem 1.5rem", minWidth: "140px", flex: "1 1 140px" }}>
      <div style={{ fontSize: "1.7rem", fontWeight: 700, color: accent ?? "var(--ink)", fontFamily: "var(--font-display)", lineHeight: 1.1 }}>{value}</div>
      <div style={{ fontSize: "0.7rem", color: "var(--ink-muted)", textTransform: "uppercase", letterSpacing: "0.07em", marginTop: "0.35rem" }}>{label}</div>
      {sub && <div style={{ fontSize: "0.75rem", color: "var(--ink-muted)", marginTop: "0.2rem" }}>{sub}</div>}
    </div>
  );
}

// ── DataTab ────────────────────────────────────────────────────────────

function DataTab({ tableKey, columns, statusField }: {
  tableKey: string; columns: string[]; statusField?: string;
}) {
  const [rows, setRows] = useState<Record<string, unknown>[]>([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deleting, setDeleting] = useState<number | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState<number | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const url = search
        ? `/api/admin/data?table=${tableKey}&search=${encodeURIComponent(search)}`
        : `/api/admin/data?table=${tableKey}`;
      const res = await fetch(url);
      if (res.ok) {
        const d = await res.json();
        setRows(d.rows ?? []);
        setCount(d.count ?? 0);
      }
    } finally {
      setLoading(false);
    }
  }, [tableKey, search]);

  useEffect(() => { load(); }, [load]);

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this record? This cannot be undone.")) return;
    setDeleting(id);
    try {
      await fetch("/api/admin/data", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ table: tableKey, id }),
      });
      load();
    } finally {
      setDeleting(null);
    }
  };

  const handleStatus = async (id: number, status: string) => {
    setUpdatingStatus(id);
    try {
      await fetch("/api/admin/data", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ table: tableKey, id, status }),
      });
      load();
    } finally {
      setUpdatingStatus(null);
    }
  };

  const statusOptions = ["pending", "staff", "denied", "follow_up_2027"];

  return (
    <div>
      <div className="admin-toolbar">
        <div className="admin-toolbar-left">
          <span className="admin-count">{count} record{count !== 1 ? "s" : ""}</span>
        </div>
        <div className="admin-toolbar-right">
          <input
            className="admin-search" type="text" placeholder="Search by email…"
            value={search} onChange={e => setSearch(e.target.value)}
            onKeyDown={e => e.key === "Enter" && load()}
          />
          <button className="admin-refresh-btn" onClick={load}>↻ Refresh</button>
        </div>
      </div>
      {loading ? (
        <div className="admin-loading">Loading…</div>
      ) : rows.length === 0 ? (
        <div className="admin-empty">No records found.</div>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                {columns.map(c => <th key={c} style={hcell}>{c.replace(/_/g, " ")}</th>)}
                <th style={hcell}>actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={String(row.id)}>
                  {columns.map(col => (
                    <td key={col} style={col === "message" ? { ...cell, maxWidth: "220px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" } : cell}>
                      {col === "created_at" ? fmtDate(row[col])
                        : col === "amount_cents" || col === "order_amount_cents" || col === "commission_cents"
                          ? (row[col] ? usd(Number(row[col])) : "—")
                        : col === "status" && statusField
                          ? (
                            <span style={{ fontSize: "0.72rem", padding: "0.15rem 0.5rem", borderRadius: "4px", fontWeight: 600, background: row[col] === "staff" ? "rgba(42,157,143,0.15)" : row[col] === "denied" ? "rgba(192,57,43,0.15)" : "rgba(139,95,191,0.15)", color: row[col] === "staff" ? "#2a9d8f" : row[col] === "denied" ? "#c0392b" : "#8B5FBF" }}>
                              {String(row[col] ?? "pending")}
                            </span>
                          )
                        : String(row[col] ?? "—")}
                    </td>
                  ))}
                  <td style={{ ...cell, whiteSpace: "nowrap" }}>
                    {statusField && (
                      <select
                        value={String(row[statusField] ?? "pending")}
                        disabled={updatingStatus === Number(row.id)}
                        onChange={e => handleStatus(Number(row.id), e.target.value)}
                        style={{ fontSize: "0.75rem", marginRight: "0.5rem", padding: "0.2rem 0.4rem", borderRadius: "4px", border: "1px solid var(--line-medium)", background: "var(--surface-page)", color: "var(--ink)" }}
                      >
                        {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    )}
                    <button
                      onClick={() => handleDelete(Number(row.id))}
                      disabled={deleting === Number(row.id)}
                      style={{ fontSize: "0.72rem", color: "#c0392b", background: "none", border: "1px solid rgba(192,57,43,0.3)", borderRadius: "4px", padding: "0.15rem 0.4rem", cursor: "pointer" }}
                    >
                      {deleting === Number(row.id) ? "…" : "Delete"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ── OverviewSection ────────────────────────────────────────────────────

function OverviewSection({ onNavigate }: { onNavigate: (s: Section) => void }) {
  const [stats, setStats] = useState<{ newsletter: number; leads: number; instructors: number; sponsors: number } | null>(null);
  const [beds, setBeds] = useState<{ totalAllocated: number; remaining: number; summary: Record<string, number>; totalBeds: number } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/data?table=newsletter"),
      fetch("/api/admin/data?table=leads"),
      fetch("/api/admin/data?table=instructor_waitlist"),
      fetch("/api/admin/data?table=sponsors"),
      fetch("/api/admin/beds"),
    ]).then(async ([nRes, lRes, iRes, sRes, bRes]) => {
      const [n, l, i, s, b] = await Promise.all([
        nRes.ok ? nRes.json() : null,
        lRes.ok ? lRes.json() : null,
        iRes.ok ? iRes.json() : null,
        sRes.ok ? sRes.json() : null,
        bRes.ok ? bRes.json() : null,
      ]);
      setStats({ newsletter: n?.count ?? 0, leads: l?.count ?? 0, instructors: i?.count ?? 0, sponsors: s?.count ?? 0 });
      if (b) setBeds(b);
      setLoading(false);
    });
  }, []);

  const eventDate = new Date("2027-08-07T00:00:00");
  const days = daysUntil(eventDate);
  const allocatedPct = beds ? Math.round((beds.totalAllocated / beds.totalBeds) * 100) : 0;
  const COLORS: Record<string, string> = { staff: "#8B5FBF", artist: "#3DB8AF", sponsor: "#C9983F", package: "#5E8A6A" };

  const sectionBox = (title: string, children: React.ReactNode) => (
    <section style={{ marginBottom: "2rem" }}>
      <h2 style={{ fontSize: "0.7rem", fontWeight: 700, color: "var(--ink-muted)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "1rem" }}>{title}</h2>
      {children}
    </section>
  );

  return (
    <div style={{ padding: "2rem" }}>
      {/* Hero countdown */}
      <div style={{ background: "linear-gradient(135deg, #0a0820 0%, #1a0d3a 100%)", borderRadius: "16px", padding: "2rem 2.5rem", marginBottom: "2.5rem", display: "flex", alignItems: "center", gap: "2rem", flexWrap: "wrap" }}>
        <div>
          <div style={{ fontSize: "4rem", fontWeight: 800, color: "#D4AF3C", fontFamily: "var(--font-display)", lineHeight: 1 }}>{days}</div>
          <div style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: "0.1em", marginTop: "0.25rem" }}>Days Until Wellness Weekend 2027</div>
        </div>
        <div style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.9rem" }}>
          <div style={{ fontFamily: "var(--font-display)", fontSize: "1.1rem", color: "#fff", marginBottom: "0.3rem" }}>August 7–9, 2027</div>
          Warrior Lodge · Sutton, Alaska<br />
          <span style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.8rem" }}>5th Annual Healing Arts Festival</span>
        </div>
        <div style={{ marginLeft: "auto", textAlign: "right" }}>
          <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "0.1em" }}>2027 Goal</div>
          <div style={{ color: "#fff", fontSize: "1.5rem", fontWeight: 700, fontFamily: "var(--font-display)" }}>250 campers</div>
          <div style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.75rem" }}>future target: 400</div>
        </div>
      </div>

      {sectionBox("2027 Pipeline", (
        loading ? <div className="admin-loading">Loading…</div> : (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
            <div onClick={() => onNavigate("newsletter")} style={{ cursor: "pointer" }}>
              <StatCard label="Newsletter Subscribers" value={stats?.newsletter ?? "—"} accent="#8B5FBF" sub="Click to manage →" />
            </div>
            <div onClick={() => onNavigate("leads")} style={{ cursor: "pointer" }}>
              <StatCard label="Leads & Inquiries" value={stats?.leads ?? "—"} accent="#3DB8AF" sub="Contact form submissions" />
            </div>
            <div onClick={() => onNavigate("instructors")} style={{ cursor: "pointer" }}>
              <StatCard label="Instructor Applicants" value={stats?.instructors ?? "—"} accent="#C9983F" sub="Review in Instructors →" />
            </div>
            <div onClick={() => onNavigate("sponsors")} style={{ cursor: "pointer" }}>
              <StatCard label="Sponsor Inquiries" value={stats?.sponsors ?? "—"} accent="#5E8A6A" sub="Click to manage →" />
            </div>
          </div>
        )
      ))}

      {sectionBox("Warrior Lodge — 100 Beds", (
        <div style={{ background: "var(--surface-elevated)", border: "1px solid var(--line-medium)", borderRadius: "12px", padding: "1.5rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
            <span style={{ fontWeight: 700 }}>{beds?.totalAllocated ?? 0} / {beds?.totalBeds ?? 100} beds allocated</span>
            <button onClick={() => onNavigate("lodging")} style={{ fontSize: "0.78rem", color: "#8B5FBF", background: "none", border: "1px solid rgba(139,95,191,0.3)", borderRadius: "6px", padding: "0.3rem 0.75rem", cursor: "pointer" }}>
              Manage Beds →
            </button>
          </div>
          <div style={{ height: "8px", background: "var(--line-subtle)", borderRadius: "4px", overflow: "hidden", marginBottom: "1rem" }}>
            <div style={{ height: "100%", width: `${allocatedPct}%`, background: allocatedPct >= 90 ? "#c0392b" : "#8B5FBF", borderRadius: "4px", transition: "width 0.3s" }} />
          </div>
          <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap" }}>
            {["staff", "artist", "sponsor", "package"].map(cat => (
              <div key={cat} style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                <div style={{ width: "10px", height: "10px", borderRadius: "2px", background: COLORS[cat] }} />
                <span style={{ fontSize: "0.8rem", color: "var(--ink-muted)", textTransform: "capitalize" }}>
                  {cat}: <strong style={{ color: "var(--ink)" }}>{beds?.summary?.[cat] ?? 0}</strong>
                </span>
              </div>
            ))}
            <span style={{ fontSize: "0.8rem", color: "var(--ink-muted)", marginLeft: "auto" }}>
              {beds?.remaining ?? 100} remaining
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── LodgingSection ─────────────────────────────────────────────────────

const BED_CATEGORIES = ["staff", "artist", "sponsor", "package"] as const;
const CAT_COLORS: Record<string, string> = { staff: "#8B5FBF", artist: "#3DB8AF", sponsor: "#C9983F", package: "#5E8A6A" };

function LodgingSection() {
  const [data, setData] = useState<{
    rows: BedRow[]; summary: Record<string, number>;
    totalBeds: number; totalAllocated: number; remaining: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ category: "staff", name: "", email: "", beds: "1", notes: "", year: "2027" });
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const [deleting, setDeleting] = useState<number | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/admin/beds");
    if (res.ok) setData(await res.json());
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    setSaving(true);
    try {
      const res = await fetch("/api/admin/beds", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, beds: Number(form.beds), year: Number(form.year) }),
      });
      const d = await res.json();
      if (!res.ok) { setFormError(d.error ?? "Error saving"); return; }
      setForm({ category: "staff", name: "", email: "", beds: "1", notes: "", year: "2027" });
      load();
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Remove this bed allocation?")) return;
    setDeleting(id);
    try {
      await fetch("/api/admin/beds", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      load();
    } finally {
      setDeleting(null);
    }
  };

  const allocatedPct = data ? Math.round((data.totalAllocated / data.totalBeds) * 100) : 0;
  const inp: React.CSSProperties = { padding: "0.5rem 0.75rem", border: "1px solid var(--line-medium)", borderRadius: "6px", fontSize: "0.85rem", background: "var(--surface-page)", color: "var(--ink)", width: "100%" };

  return (
    <div style={{ padding: "2rem" }}>
      <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.6rem", marginBottom: "0.25rem" }}>Warrior Lodge</h1>
      <p style={{ color: "var(--ink-muted)", fontSize: "0.85rem", marginBottom: "2rem" }}>
        100 beds total · Allocated to Staff, Artists, Sponsors, and Package holders · Warrior Lodge keeps full revenue from sold beds
      </p>

      {/* Capacity overview */}
      <div style={{ background: "var(--surface-elevated)", border: "1px solid var(--line-medium)", borderRadius: "12px", padding: "1.5rem", marginBottom: "2rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
          <span style={{ fontWeight: 700, fontSize: "1.05rem" }}>
            {data?.totalAllocated ?? 0} / {data?.totalBeds ?? 100} beds allocated
          </span>
          <span style={{ fontSize: "0.9rem", color: data?.remaining === 0 ? "#c0392b" : "var(--ink-muted)", fontWeight: data?.remaining === 0 ? 700 : 400 }}>
            {data?.remaining ?? 100} remaining
          </span>
        </div>
        <div style={{ height: "10px", background: "var(--line-subtle)", borderRadius: "5px", overflow: "hidden", marginBottom: "1.25rem" }}>
          <div style={{ height: "100%", width: `${allocatedPct}%`, background: allocatedPct >= 90 ? "#c0392b" : "#8B5FBF", borderRadius: "5px", transition: "width 0.3s" }} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: "0.75rem" }}>
          {BED_CATEGORIES.map(cat => (
            <div key={cat} style={{ background: `${CAT_COLORS[cat]}12`, border: `1px solid ${CAT_COLORS[cat]}30`, borderRadius: "8px", padding: "0.75rem 1rem" }}>
              <div style={{ fontSize: "1.4rem", fontWeight: 700, color: CAT_COLORS[cat] }}>{data?.summary?.[cat] ?? 0}</div>
              <div style={{ fontSize: "0.7rem", color: "var(--ink-muted)", textTransform: "capitalize", letterSpacing: "0.05em", marginTop: "0.2rem" }}>{cat}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Add form */}
      <div style={{ background: "var(--surface-elevated)", border: "1px solid var(--line-medium)", borderRadius: "12px", padding: "1.5rem", marginBottom: "2rem" }}>
        <h2 style={{ fontSize: "0.78rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--ink-muted)", marginBottom: "1rem" }}>Allocate Beds</h2>
        <form onSubmit={handleAdd} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(170px, 1fr))", gap: "0.75rem", alignItems: "end" }}>
          <div>
            <label style={{ fontSize: "0.72rem", color: "var(--ink-muted)", display: "block", marginBottom: "0.25rem" }}>Category</label>
            <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} style={inp}>
              {BED_CATEGORIES.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
            </select>
          </div>
          <div>
            <label style={{ fontSize: "0.72rem", color: "var(--ink-muted)", display: "block", marginBottom: "0.25rem" }}>Name *</label>
            <input type="text" required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Person or group" style={inp} />
          </div>
          <div>
            <label style={{ fontSize: "0.72rem", color: "var(--ink-muted)", display: "block", marginBottom: "0.25rem" }}>Email</label>
            <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="optional" style={inp} />
          </div>
          <div>
            <label style={{ fontSize: "0.72rem", color: "var(--ink-muted)", display: "block", marginBottom: "0.25rem" }}>Beds *</label>
            <input type="number" required min="1" max="30" value={form.beds} onChange={e => setForm(f => ({ ...f, beds: e.target.value }))} style={inp} />
          </div>
          <div>
            <label style={{ fontSize: "0.72rem", color: "var(--ink-muted)", display: "block", marginBottom: "0.25rem" }}>Year</label>
            <input type="number" value={form.year} onChange={e => setForm(f => ({ ...f, year: e.target.value }))} style={inp} />
          </div>
          <div>
            <label style={{ fontSize: "0.72rem", color: "var(--ink-muted)", display: "block", marginBottom: "0.25rem" }}>Notes</label>
            <input type="text" value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} placeholder="optional" style={inp} />
          </div>
          <div>
            <button type="submit" disabled={saving} style={{ width: "100%", padding: "0.6rem 1rem", background: "#8B5FBF", color: "#fff", border: "none", borderRadius: "6px", fontSize: "0.85rem", fontWeight: 600, cursor: saving ? "not-allowed" : "pointer", opacity: saving ? 0.6 : 1 }}>
              {saving ? "Saving…" : "Allocate Beds"}
            </button>
          </div>
        </form>
        {formError && <p style={{ color: "#c0392b", fontSize: "0.82rem", marginTop: "0.5rem", margin: "0.5rem 0 0" }}>{formError}</p>}
      </div>

      {/* Allocations table */}
      {loading ? (
        <div className="admin-loading">Loading…</div>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                {["Category", "Name", "Email", "Beds", "Year", "Notes", "Added", ""].map((h, i) => (
                  <th key={i} style={hcell}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(data?.rows ?? []).map(row => (
                <tr key={row.id}>
                  <td style={cell}>
                    <span style={{ fontSize: "0.72rem", padding: "0.15rem 0.5rem", borderRadius: "4px", fontWeight: 600, background: `${CAT_COLORS[row.category] ?? "#888"}20`, color: CAT_COLORS[row.category] ?? "#888", textTransform: "capitalize" }}>
                      {row.category}
                    </span>
                  </td>
                  <td style={{ ...cell, fontWeight: 600 }}>{row.name}</td>
                  <td style={cell}>{row.email || "—"}</td>
                  <td style={{ ...cell, fontWeight: 700, color: "#8B5FBF", fontSize: "1rem" }}>{row.beds}</td>
                  <td style={cell}>{row.year}</td>
                  <td style={{ ...cell, color: "var(--ink-muted)" }}>{row.notes || "—"}</td>
                  <td style={{ ...cell, color: "var(--ink-muted)" }}>{fmtDate(row.created_at)}</td>
                  <td style={cell}>
                    <button
                      onClick={() => handleDelete(row.id)}
                      disabled={deleting === row.id}
                      style={{ fontSize: "0.72rem", color: "#c0392b", background: "none", border: "1px solid rgba(192,57,43,0.3)", borderRadius: "4px", padding: "0.15rem 0.4rem", cursor: "pointer" }}
                    >
                      {deleting === row.id ? "…" : "Remove"}
                    </button>
                  </td>
                </tr>
              ))}
              {(data?.rows ?? []).length === 0 && (
                <tr>
                  <td colSpan={8} style={{ ...cell, textAlign: "center", color: "var(--ink-muted)", padding: "2.5rem" }}>
                    No bed allocations yet. Use the form above to allocate beds.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ── BudgetSection ──────────────────────────────────────────────────────

function BudgetSection() {
  const [data, setData] = useState<{ items: BudgetItem[]; totals: BudgetTotals } | null>(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ type: "income", category: "", description: "", amount: "", notes: "" });
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<number | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/admin/budget");
    if (res.ok) setData(await res.json());
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await fetch("/api/admin/budget", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: form.type, category: form.category, description: form.description,
          amountCents: Math.round(Number(form.amount) * 100), notes: form.notes,
        }),
      });
      setForm({ type: "income", category: "", description: "", amount: "", notes: "" });
      load();
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this budget item?")) return;
    setDeleting(id);
    try {
      await fetch("/api/admin/budget", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      load();
    } finally {
      setDeleting(null);
    }
  };

  const totals = data?.totals;
  const net = totals ? totals.income_cents - totals.expense_cents : 0;
  const inp: React.CSSProperties = { padding: "0.5rem 0.75rem", border: "1px solid var(--line-medium)", borderRadius: "6px", fontSize: "0.85rem", background: "var(--surface-page)", color: "var(--ink)", width: "100%" };

  return (
    <div style={{ padding: "2rem" }}>
      <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.6rem", marginBottom: "2rem" }}>Budget</h1>

      {totals && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", marginBottom: "2rem" }}>
          <StatCard label="Revenue Target" value={usd(totals.revenue_target_cents)} accent="#D4AF3C" />
          <StatCard label="Income" value={usd(totals.income_cents)} accent="#2a9d8f" />
          <StatCard label="Expenses" value={usd(totals.expense_cents)} accent="#c0392b" />
          <StatCard label="Net" value={usd(net)} accent={net >= 0 ? "#2a9d8f" : "#c0392b"} sub={net >= 0 ? "Positive" : "Deficit"} />
        </div>
      )}

      <div style={{ background: "var(--surface-elevated)", border: "1px solid var(--line-medium)", borderRadius: "12px", padding: "1.5rem", marginBottom: "2rem" }}>
        <h2 style={{ fontSize: "0.78rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--ink-muted)", marginBottom: "1rem" }}>Add Budget Item</h2>
        <form onSubmit={handleAdd} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(170px, 1fr))", gap: "0.75rem", alignItems: "end" }}>
          <div>
            <label style={{ fontSize: "0.72rem", color: "var(--ink-muted)", display: "block", marginBottom: "0.25rem" }}>Type</label>
            <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))} style={inp}>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
              <option value="revenue_target">Revenue Target</option>
            </select>
          </div>
          <div>
            <label style={{ fontSize: "0.72rem", color: "var(--ink-muted)", display: "block", marginBottom: "0.25rem" }}>Category</label>
            <input type="text" required value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} placeholder="e.g. Tickets, Venue" style={inp} />
          </div>
          <div>
            <label style={{ fontSize: "0.72rem", color: "var(--ink-muted)", display: "block", marginBottom: "0.25rem" }}>Description</label>
            <input type="text" required value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Description" style={inp} />
          </div>
          <div>
            <label style={{ fontSize: "0.72rem", color: "var(--ink-muted)", display: "block", marginBottom: "0.25rem" }}>Amount ($)</label>
            <input type="number" required step="0.01" min="0" value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))} placeholder="0.00" style={inp} />
          </div>
          <div>
            <label style={{ fontSize: "0.72rem", color: "var(--ink-muted)", display: "block", marginBottom: "0.25rem" }}>Notes</label>
            <input type="text" value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} placeholder="optional" style={inp} />
          </div>
          <div>
            <button type="submit" disabled={saving} style={{ width: "100%", padding: "0.6rem 1rem", background: "#2a9d8f", color: "#fff", border: "none", borderRadius: "6px", fontSize: "0.85rem", fontWeight: 600, cursor: saving ? "not-allowed" : "pointer", opacity: saving ? 0.6 : 1 }}>
              {saving ? "Saving…" : "Add Item"}
            </button>
          </div>
        </form>
      </div>

      {loading ? (
        <div className="admin-loading">Loading…</div>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>{["Type", "Category", "Description", "Amount", "Notes", "Date", ""].map(h => <th key={h} style={hcell}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {(data?.items ?? []).map(item => (
                <tr key={item.id}>
                  <td style={cell}>
                    <span style={{ fontSize: "0.72rem", padding: "0.15rem 0.5rem", borderRadius: "4px", fontWeight: 600, background: item.type === "income" ? "rgba(42,157,143,0.15)" : item.type === "expense" ? "rgba(192,57,43,0.15)" : "rgba(212,175,60,0.15)", color: item.type === "income" ? "#2a9d8f" : item.type === "expense" ? "#c0392b" : "#D4AF3C" }}>
                      {item.type}
                    </span>
                  </td>
                  <td style={cell}>{item.category}</td>
                  <td style={{ ...cell, maxWidth: "240px" }}>{item.description}</td>
                  <td style={{ ...cell, fontWeight: 600 }}>{usd(item.amount_cents)}</td>
                  <td style={{ ...cell, color: "var(--ink-muted)" }}>{item.notes || "—"}</td>
                  <td style={{ ...cell, color: "var(--ink-muted)" }}>{fmtDate(item.created_at)}</td>
                  <td style={cell}>
                    <button onClick={() => handleDelete(item.id)} disabled={deleting === item.id} style={{ fontSize: "0.72rem", color: "#c0392b", background: "none", border: "1px solid rgba(192,57,43,0.3)", borderRadius: "4px", padding: "0.15rem 0.4rem", cursor: "pointer" }}>
                      {deleting === item.id ? "…" : "Delete"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ── AffiliatesSection ──────────────────────────────────────────────────

function AffiliatesSection() {
  const [view, setView] = useState<"affiliates" | "referrals">("affiliates");
  return (
    <div style={{ padding: "2rem" }}>
      <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.6rem", marginBottom: "0.5rem" }}>Affiliates</h1>
      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem" }}>
        {(["affiliates", "referrals"] as const).map(v => (
          <button key={v} onClick={() => setView(v)} style={{ padding: "0.35rem 0.9rem", borderRadius: "6px", border: "1px solid var(--line-medium)", background: view === v ? "var(--ink)" : "transparent", color: view === v ? "var(--surface-elevated)" : "var(--ink-muted)", fontSize: "0.82rem", cursor: "pointer", fontWeight: view === v ? 600 : 400 }}>
            {v === "affiliates" ? "Affiliates" : "Referral Events"}
          </button>
        ))}
      </div>
      {view === "affiliates" ? (
        <DataTab tableKey="affiliates" columns={["id", "name", "email", "code", "company", "commission_pct", "status", "created_at"]} />
      ) : (
        <DataTab tableKey="referral_events" columns={["id", "affiliate_code", "event_type", "order_id", "order_amount_cents", "commission_cents", "created_at"]} />
      )}
    </div>
  );
}

// ── PartnersSection ────────────────────────────────────────────────────

function PartnersSection() {
  const [view, setView] = useState<"vendors" | "agreements" | "partner_codes">("vendors");
  const [agreementRows, setAgreementRows] = useState<Array<Record<string, unknown>>>([]);
  const [codeRows, setCodeRows] = useState<Array<Record<string, unknown>>>([]);
  const [subLoading, setSubLoading] = useState(false);

  useEffect(() => {
    if (view === "agreements") {
      setSubLoading(true);
      fetch("/api/admin/vendor-agreements").then(r => r.ok ? r.json() : null).then(d => {
        setAgreementRows(d?.rows ?? []);
        setSubLoading(false);
      });
    }
    if (view === "partner_codes") {
      setSubLoading(true);
      fetch("/api/admin/partner-codes").then(r => r.ok ? r.json() : null).then(d => {
        setCodeRows(d?.codes ?? d?.rows ?? []);
        setSubLoading(false);
      });
    }
  }, [view]);

  return (
    <div style={{ padding: "2rem" }}>
      <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.6rem", marginBottom: "0.5rem" }}>Partners & Vendors</h1>
      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem" }}>
        {(["vendors", "agreements", "partner_codes"] as const).map(v => (
          <button key={v} onClick={() => setView(v)} style={{ padding: "0.35rem 0.9rem", borderRadius: "6px", border: "1px solid var(--line-medium)", background: view === v ? "var(--ink)" : "transparent", color: view === v ? "var(--surface-elevated)" : "var(--ink-muted)", fontSize: "0.82rem", cursor: "pointer", fontWeight: view === v ? 600 : 400 }}>
            {v === "partner_codes" ? "Partner Codes" : v.charAt(0).toUpperCase() + v.slice(1)}
          </button>
        ))}
      </div>
      {view === "vendors" && <DataTab tableKey="vendors" columns={["id", "name", "email", "business", "category", "created_at"]} />}
      {view === "agreements" && (
        subLoading ? <div className="admin-loading">Loading…</div> : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead><tr>{["Name", "Email", "Business", "Status", "Created"].map(h => <th key={h} style={hcell}>{h}</th>)}</tr></thead>
              <tbody>
                {agreementRows.map((r, i) => (
                  <tr key={i}>
                    <td style={{ ...cell, fontWeight: 600 }}>{String(r.name ?? "—")}</td>
                    <td style={cell}>{String(r.email ?? "—")}</td>
                    <td style={cell}>{String(r.business ?? r.company ?? "—")}</td>
                    <td style={cell}>{String(r.payment_status ?? r.status ?? "—")}</td>
                    <td style={{ ...cell, color: "var(--ink-muted)" }}>{fmtDate(r.created_at)}</td>
                  </tr>
                ))}
                {agreementRows.length === 0 && <tr><td colSpan={5} style={{ ...cell, textAlign: "center", color: "var(--ink-muted)", padding: "2rem" }}>No agreements found.</td></tr>}
              </tbody>
            </table>
          </div>
        )
      )}
      {view === "partner_codes" && (
        subLoading ? <div className="admin-loading">Loading…</div> : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead><tr>{["Code", "Name", "Email", "Uses", "Discount", "Expires", "Created"].map(h => <th key={h} style={hcell}>{h}</th>)}</tr></thead>
              <tbody>
                {codeRows.map((c, i) => (
                  <tr key={i}>
                    <td style={{ ...cell, fontWeight: 700, fontFamily: "monospace" }}>{String(c.code ?? "")}</td>
                    <td style={cell}>{String(c.name ?? "—")}</td>
                    <td style={cell}>{String(c.email ?? "—")}</td>
                    <td style={cell}>{String(c.uses ?? "0")}</td>
                    <td style={cell}>{c.discount_pct ? `${c.discount_pct}%` : c.discount_cents ? usd(Number(c.discount_cents)) : "—"}</td>
                    <td style={{ ...cell, color: "var(--ink-muted)" }}>{c.expires_at ? fmtDate(c.expires_at) : "Never"}</td>
                    <td style={{ ...cell, color: "var(--ink-muted)" }}>{fmtDate(c.created_at)}</td>
                  </tr>
                ))}
                {codeRows.length === 0 && <tr><td colSpan={7} style={{ ...cell, textAlign: "center", color: "var(--ink-muted)", padding: "2rem" }}>No partner codes found.</td></tr>}
              </tbody>
            </table>
          </div>
        )
      )}
    </div>
  );
}

// ── Analytics Charts ───────────────────────────────────────────────────

function BarChartSVG({ data, color, height = 140 }: { data: Array<{ label: string; value: number }>; color: string; height?: number }) {
  const max = Math.max(...data.map(d => d.value), 1);
  const count = data.length || 1;
  const W = 100;
  const barW = (W / count) * 0.65;
  const gap = (W / count) * 0.35;

  return (
    <svg viewBox={`0 0 ${W} ${height + 22}`} style={{ width: "100%", height: `${height + 22}px` }} preserveAspectRatio="none">
      {data.map((d, i) => {
        const x = i * (W / count) + gap / 2;
        const bh = (d.value / max) * height;
        const y = height - bh;
        return (
          <g key={i}>
            <rect x={x} y={y} width={barW} height={Math.max(bh, 1)} fill={color} rx="1" opacity="0.85" />
            {bh > 14 && (
              <text x={x + barW / 2} y={y + bh / 2 + 4} textAnchor="middle" fontSize="3.5" fill="white" fontWeight="bold">{d.value}</text>
            )}
            {bh <= 14 && d.value > 0 && (
              <text x={x + barW / 2} y={y - 2} textAnchor="middle" fontSize="3" fill={color}>{d.value}</text>
            )}
            <text x={x + barW / 2} y={height + 9} textAnchor="middle" fontSize="2.8" fill="#9d9d9a">{d.label}</text>
          </g>
        );
      })}
    </svg>
  );
}

function LineChartSVG({ data, color }: { data: Array<{ label: string; value: number }>; color: string }) {
  if (data.length < 2) return null;
  const max = Math.max(...data.map(d => d.value), 1);
  const W = 100;
  const H = 70;
  const pts = data.map((d, i) => ({
    x: (i / (data.length - 1)) * W,
    y: H - (d.value / max) * H,
    ...d,
  }));
  const pathD = pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  const fillD = `${pathD} L ${W} ${H} L 0 ${H} Z`;
  const gradId = `lg-${color.replace("#", "")}`;
  const step = Math.max(1, Math.floor(pts.length / 7));

  return (
    <svg viewBox={`0 0 ${W} ${H + 10}`} style={{ width: "100%", height: "90px" }} preserveAspectRatio="none">
      <defs>
        <linearGradient id={gradId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0.02" />
        </linearGradient>
      </defs>
      <path d={fillD} fill={`url(#${gradId})`} />
      <path d={pathD} fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
      {pts.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="1.8" fill={color} />
      ))}
      {pts.filter((_, i) => i % step === 0 || i === pts.length - 1).map((p, i) => (
        <text key={i} x={p.x} y={H + 8} textAnchor="middle" fontSize="2.8" fill="#9d9d9a">{p.label}</text>
      ))}
    </svg>
  );
}

function AnalyticsSection() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/analytics")
      .then(r => r.ok ? r.json() : null)
      .then(d => { if (d) setData(d); setLoading(false); });
  }, []);

  if (loading) return <div style={{ padding: "2rem" }}><div className="admin-loading">Loading analytics…</div></div>;

  const totals = data?.totals;
  const bookings = (data?.bookingCounts ?? []).map(b => ({ label: b.type, value: Number(b.count) })).filter(b => b.value > 0);
  const newsletter = (data?.newsletterByMonth ?? []).map(m => ({ label: m.month.slice(0, 6), value: Number(m.count) }));
  const leads = (data?.leadsByMonth ?? []).map(m => ({ label: m.month.slice(0, 6), value: Number(m.count) }));
  const revenue = (data?.revenueByMonth ?? []).map(m => ({ label: m.month.slice(0, 6), value: Math.round(Number(m.total_cents) / 100) }));

  const chartCard = (title: string, children: React.ReactNode) => (
    <div style={{ background: "var(--surface-elevated)", border: "1px solid var(--line-medium)", borderRadius: "12px", padding: "1.5rem", marginBottom: "1.5rem" }}>
      <h3 style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--ink-muted)", marginBottom: "1rem" }}>{title}</h3>
      {children}
    </div>
  );

  return (
    <div style={{ padding: "2rem" }}>
      <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.6rem", marginBottom: "0.25rem" }}>Analytics</h1>
      <p style={{ color: "var(--ink-muted)", fontSize: "0.85rem", marginBottom: "2rem" }}>Historical data · 2026 bookings · Newsletter growth · Revenue</p>

      {totals && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", marginBottom: "2rem" }}>
          <StatCard label="Newsletter Total" value={totals.newsletter_total ?? 0} accent="#8B5FBF" />
          <StatCard label="All-time Leads" value={totals.leads_total ?? 0} accent="#3DB8AF" />
          <StatCard label="Total Revenue" value={usd(totals.revenue_total_cents ?? 0)} accent="#D4AF3C" />
          <StatCard label="2026 Massage" value={totals.massage_count ?? 0} accent="#8B5FBF" />
          <StatCard label="2026 Aerial" value={totals.aerial_count ?? 0} accent="#3DB8AF" />
          <StatCard label="2026 Volunteers" value={totals.volunteer_count ?? 0} accent="#5E8A6A" />
        </div>
      )}

      {newsletter.length > 0 && chartCard("Newsletter Signups — Last 18 Months", (
        <LineChartSVG data={newsletter} color="#8B5FBF" />
      ))}

      {leads.length > 0 && chartCard("Leads — Last 12 Months", (
        <LineChartSVG data={leads} color="#3DB8AF" />
      ))}

      {bookings.length > 0 && chartCard("2026 Participation by Category", (
        <BarChartSVG data={bookings} color="#C9983F" height={140} />
      ))}

      {revenue.length > 0 && chartCard("Revenue by Month", (
        <BarChartSVG data={revenue} color="#2a9d8f" height={110} />
      ))}

      {newsletter.length === 0 && bookings.length === 0 && revenue.length === 0 && (
        <div className="admin-empty">No analytics data available yet — this will populate as the database grows.</div>
      )}
    </div>
  );
}

// ── ArchiveSection ─────────────────────────────────────────────────────

type ArchiveView = "massage" | "aerial" | "paddleboard" | "contrast" | "volunteers" | "warriors" | "staff" | "members";

const ARCHIVE_TABS: Array<{ key: ArchiveView; label: string; tableKey: string; columns: string[] }> = [
  { key: "massage",      label: "Massage",      tableKey: "massage_bookings",        columns: ["id","name","email","practitioner","slot","session_type","hands","created_at"] },
  { key: "aerial",       label: "Aerial Silk",  tableKey: "aerial_bookings",         columns: ["id","name","email","mode","slot","created_at"] },
  { key: "paddleboard",  label: "Paddleboard",  tableKey: "paddleboard_bookings",    columns: ["id","name","email","slot","created_at"] },
  { key: "contrast",     label: "Contrast",     tableKey: "contrast_bookings",       columns: ["id","name","email","phone","slots","created_at"] },
  { key: "volunteers",   label: "Volunteers",   tableKey: "volunteer_registrations", columns: ["id","name","email","shift_ids","reward_earned","created_at"] },
  { key: "warriors",     label: "Warriors",     tableKey: "warriors",                columns: ["id","name","email","phone","family_size","beds_needed","created_at"] },
  { key: "staff",        label: "Staff",        tableKey: "staff_registrations",     columns: ["id","name","email","role","ticket_code","created_at"] },
  { key: "members",      label: "Members",      tableKey: "members",                 columns: ["id","name","email","code","points_balance","created_at"] },
];

function ArchiveSection() {
  const [view, setView] = useState<ArchiveView>("massage");
  const cfg = ARCHIVE_TABS.find(t => t.key === view)!;

  return (
    <div style={{ padding: "2rem" }}>
      <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.6rem", marginBottom: "0.25rem" }}>Archive — 2026</h1>
      <p style={{ color: "var(--ink-muted)", fontSize: "0.85rem", marginBottom: "1.5rem" }}>Historical records from Wellness Weekend 2026 · Read-only reference</p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", marginBottom: "1.5rem" }}>
        {ARCHIVE_TABS.map(t => (
          <button key={t.key} onClick={() => setView(t.key)} style={{ padding: "0.3rem 0.8rem", borderRadius: "6px", border: "1px solid var(--line-medium)", background: view === t.key ? "var(--ink)" : "transparent", color: view === t.key ? "var(--surface-elevated)" : "var(--ink-muted)", fontSize: "0.8rem", cursor: "pointer", fontWeight: view === t.key ? 600 : 400 }}>
            {t.label}
          </button>
        ))}
      </div>
      <DataTab key={view} tableKey={cfg.tableKey} columns={cfg.columns} />
    </div>
  );
}

// ── GiveawaySection ────────────────────────────────────────────────────

function GiveawaySection() {
  const [entries, setEntries] = useState<Array<Record<string, unknown>>>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [picking, setPicking] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/giveaway").then(r => r.ok ? r.json() : null).then(d => {
      if (d) {
        setEntries(Array.isArray(d.entries) ? d.entries : []);
        setTotal(d.total ?? (Array.isArray(d.entries) ? d.entries.length : 0));
      }
      setLoading(false);
    });
  }, []);

  const pickWinner = async () => {
    setPicking(true);
    const res = await fetch("/api/admin/giveaway", { method: "POST" });
    if (res.ok) {
      const d = await res.json();
      setWinner(d.winner?.email ?? d.winner ?? "No entries");
    }
    setPicking(false);
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.6rem", marginBottom: "0.5rem" }}>Giveaway</h1>
      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginBottom: "2rem" }}>
        <StatCard label="Total Entries" value={total} accent="#8B5FBF" />
      </div>
      <button onClick={pickWinner} disabled={picking || loading} style={{ padding: "0.75rem 1.5rem", background: "#8B5FBF", color: "#fff", border: "none", borderRadius: "8px", fontSize: "0.9rem", fontWeight: 600, cursor: "pointer", marginBottom: "1.5rem", opacity: picking ? 0.6 : 1 }}>
        {picking ? "Picking…" : "🎲 Pick a Winner"}
      </button>
      {winner && (
        <div style={{ background: "rgba(212,168,83,0.12)", border: "1px solid rgba(212,168,83,0.4)", borderRadius: "10px", padding: "1.25rem 1.5rem", marginBottom: "1.5rem" }}>
          <div style={{ fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "#D4AF3C", marginBottom: "0.25rem" }}>Winner Selected</div>
          <div style={{ fontSize: "1.1rem", fontWeight: 700 }}>{winner}</div>
        </div>
      )}
      {loading ? <div className="admin-loading">Loading…</div> : entries.length > 0 && (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>{["Email", "Name", "Entered"].map(h => <th key={h} style={hcell}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {entries.slice(0, 100).map((e, i) => (
                <tr key={i}>
                  <td style={cell}>{String(e.email ?? "—")}</td>
                  <td style={cell}>{String(e.name ?? "—")}</td>
                  <td style={{ ...cell, color: "var(--ink-muted)" }}>{fmtDate(e.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ── Sidebar ────────────────────────────────────────────────────────────

const NAV_ITEMS: Array<{ section: Section; label: string; group?: string }> = [
  { section: "overview",     label: "Overview" },
  { section: "newsletter",   label: "Newsletter",        group: "2027 Pipeline" },
  { section: "leads",        label: "Leads & Inquiries", group: "2027 Pipeline" },
  { section: "instructors",  label: "Instructors",       group: "2027 Pipeline" },
  { section: "sponsors",     label: "Sponsors",          group: "2027 Pipeline" },
  { section: "lodging",      label: "Warrior Lodge",     group: "Operations" },
  { section: "budget",       label: "Budget",            group: "Operations" },
  { section: "affiliates",   label: "Affiliates",        group: "Operations" },
  { section: "partners",     label: "Partners & Vendors",group: "Operations" },
  { section: "analytics",    label: "Charts & Data",     group: "Analytics" },
  { section: "archive",      label: "Archive 2026",      group: "Archives" },
  { section: "giveaway",     label: "Giveaway",          group: "Settings" },
];

function Sidebar({ active, onSelect, role }: { active: Section; onSelect: (s: Section) => void; role: AdminRole }) {
  let lastGroup: string | undefined = undefined;

  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar-brand">
        <div className="admin-sidebar-logo">WW</div>
        <div>
          <div className="admin-sidebar-title">Wellness Weekend</div>
          <div className="admin-sidebar-role">{role} · 2027</div>
        </div>
      </div>
      <nav style={{ flex: 1, overflowY: "auto", paddingBottom: "2rem" }}>
        {NAV_ITEMS.map(item => {
          const showGroup = item.group !== lastGroup;
          if (showGroup) lastGroup = item.group;
          return (
            <div key={item.section}>
              {showGroup && item.group && (
                <div className="admin-sidebar-group">{item.group}</div>
              )}
              <button
                className={`admin-sidebar-item${active === item.section ? " active" : ""}`}
                onClick={() => onSelect(item.section)}
              >
                {item.label}
              </button>
            </div>
          );
        })}
      </nav>
    </aside>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────

export default function AdminPage() {
  const [authed, setAuthed]     = useState(false);
  const [role, setRole]         = useState<AdminRole>("owner");
  const [checking, setChecking] = useState(true);
  const [section, setSection]   = useState<Section>("overview");
  const [pw, setPw]             = useState(() => readSavedPassword().value);
  const [remember, setRemember] = useState(() => readSavedPassword().remembered);
  const [loginError, setLoginError] = useState("");
  const [loggingIn, setLoggingIn]   = useState(false);

  useEffect(() => {
    fetch("/api/admin/auth").then(async r => {
      if (r.ok) {
        const d = await r.json();
        setRole(d.role ?? "owner");
        setAuthed(true);
      }
      setChecking(false);
    });
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setLoggingIn(true);
    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: pw }),
      });
      if (res.ok) {
        const d = await res.json();
        setRole(d.role ?? "owner");
        if (remember) localStorage.setItem("ww-admin-pw", pw);
        else localStorage.removeItem("ww-admin-pw");
        setAuthed(true);
      } else {
        setLoginError("Invalid password");
      }
    } finally {
      setLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/admin/auth", { method: "DELETE" });
    localStorage.removeItem("ww-admin-pw");
    setAuthed(false);
    setPw("");
  };

  const canSeeFinancials = role === "owner";

  if (checking) {
    return (
      <div className="admin-layout" style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh" }}>
        <div style={{ color: "var(--ink-muted)" }}>Loading…</div>
      </div>
    );
  }

  if (!authed) {
    return (
      <div className="admin-layout admin-login">
        <div className="admin-login-card">
          <div className="admin-login-logo">WW</div>
          <h1 className="admin-login-title">Admin Access</h1>
          <form className="admin-login-form" onSubmit={handleLogin}>
            <input
              type="password" className="admin-input" value={pw}
              onChange={e => setPw(e.target.value)} placeholder="Enter password" autoFocus
            />
            <label className="admin-remember">
              <input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)} />
              Remember password
            </label>
            {loginError && <p className="admin-error">{loginError}</p>}
            <button type="submit" className="admin-login-btn" disabled={loggingIn}>
              {loggingIn ? "Signing in…" : "Sign In"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-layout admin-shell">
      <Sidebar active={section} onSelect={setSection} role={role} />
      <main className="admin-main">
        <div className="admin-main-header">
          <div style={{ fontSize: "0.78rem", color: "var(--ink-muted)" }}>
            Wellness Weekend Admin · 2027
          </div>
          <button className="admin-logout-btn" onClick={handleLogout}>Logout</button>
        </div>
        <div className="admin-main-content">
          {section === "overview"    && <OverviewSection onNavigate={setSection} />}
          {section === "newsletter"  && (
            <div style={{ padding: "2rem" }}>
              <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.6rem", marginBottom: "2rem" }}>Newsletter</h1>
              <DataTab tableKey="newsletter" columns={["id", "email", "created_at"]} />
            </div>
          )}
          {section === "leads"       && (
            <div style={{ padding: "2rem" }}>
              <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.6rem", marginBottom: "2rem" }}>Leads & Inquiries</h1>
              <DataTab tableKey="leads" columns={["id", "name", "email", "phone", "message", "source", "created_at"]} />
            </div>
          )}
          {section === "instructors" && (
            <div style={{ padding: "2rem" }}>
              <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.6rem", marginBottom: "0.25rem" }}>Instructor Applicants</h1>
              <p style={{ color: "var(--ink-muted)", fontSize: "0.85rem", marginBottom: "2rem" }}>Use the status dropdown to approve, deny, or flag for 2027</p>
              <DataTab tableKey="instructor_waitlist" columns={["id", "name", "email", "modality", "offering", "interested_in_2027", "status", "created_at"]} statusField="status" />
            </div>
          )}
          {section === "sponsors"    && (
            <div style={{ padding: "2rem" }}>
              <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.6rem", marginBottom: "2rem" }}>Sponsors</h1>
              <DataTab tableKey="sponsors" columns={["id", "name", "email", "company", "budget_range", "goals", "created_at"]} />
            </div>
          )}
          {section === "lodging"     && <LodgingSection />}
          {section === "budget"      && canSeeFinancials && <BudgetSection />}
          {section === "budget"      && !canSeeFinancials && (
            <div style={{ padding: "2rem" }}>
              <p style={{ color: "var(--ink-muted)" }}>Budget access is restricted to the owner role.</p>
            </div>
          )}
          {section === "affiliates"  && <AffiliatesSection />}
          {section === "partners"    && <PartnersSection />}
          {section === "analytics"   && <AnalyticsSection />}
          {section === "archive"     && <ArchiveSection />}
          {section === "giveaway"    && <GiveawaySection />}
        </div>
      </main>
    </div>
  );
}
