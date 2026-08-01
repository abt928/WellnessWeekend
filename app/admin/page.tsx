"use client";

import { useState, useEffect, useCallback } from "react";
import type { AdminRole } from "@/app/api/admin/auth/route";
import { SHIFT_MAP, SHIFTS } from "@/lib/volunteer-shifts";

// ── Types ─────────────────────────────────────────────────────────────

type TableName =
  | "leads" | "newsletter" | "vendors" | "volunteers"
  | "sponsors" | "instructor_waitlist" | "affiliates" | "referral_events"
  | "volunteer_registrations" | "warriors" | "members" | "staff_registrations" | "staff_guests" | "contrast_bookings" | "massage_bookings" | "aerial_bookings" | "paddleboard_bookings";

type ActiveTab =
  | "overview" | "guest_list" | "budget"
  | "affiliates" | "referral_events" | "newsletter" | "leads"
  | "vendor_agreements"
  | "vendors" | "volunteers" | "volunteer_registrations" | "warriors" | "instructor_waitlist" | "sponsors"
  | "staff_registrations" | "staff_guests" | "contrast_bookings" | "massage_bookings" | "aerial_bookings" | "paddleboard_bookings"
  | "confirmations" | "giveaway" | "partner_codes" | "class_reservations";

interface TabConfig {
  key: TableName;
  label: string;
  columns: string[];
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

interface VolunteerSignupRow {
  name: string; email: string; shift_ids: string; reward_earned: string; created_at: string;
}

interface VolunteerOverview {
  count: number;
  recentSignups: VolunteerSignupRow[];
  byReward: { day_pass: number; weekend_pass: number; lodging: number; none: number };
}

function OverviewTab() {
  const [budget, setBudget] = useState<{ items: BudgetItem[]; totals: BudgetTotals } | null>(null);
  const [communityData, setCommunityData] = useState<{
    leads: number; newsletter: number; affiliates: number;
  } | null>(null);
  const [volunteerData, setVolunteerData] = useState<VolunteerOverview | null>(null);
  const [vendorCount, setVendorCount] = useState<number | null>(null);
  const [massageCount, setMassageCount] = useState<number | null>(null);
  const [contrastCount, setContrastCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const [budgetRes, leadsRes, newsletterRes, affiliatesRes, volunteerRes, vendorRes, guestRes] = await Promise.all([
          fetch("/api/admin/budget"),
          fetch("/api/admin/data?table=leads"),
          fetch("/api/admin/data?table=newsletter"),
          fetch("/api/admin/data?table=affiliates"),
          fetch("/api/admin/data?table=volunteer_registrations"),
          fetch("/api/admin/vendor-agreements"),
          fetch("/api/admin/guest-list"),
        ]);
        if (budgetRes.ok) setBudget(await budgetRes.json());
        const [leadsData, newsletterData, affiliatesData, volunteerRaw, vendorRaw, guestData] = await Promise.all([
          leadsRes.ok ? leadsRes.json() : null,
          newsletterRes.ok ? newsletterRes.json() : null,
          affiliatesRes.ok ? affiliatesRes.json() : null,
          volunteerRes.ok ? volunteerRes.json() : null,
          vendorRes.ok ? vendorRes.json() : null,
          guestRes.ok ? guestRes.json() : null,
        ]);
        if (guestData) {
          setMassageCount((guestData.massage ?? []).length);
          setContrastCount((guestData.contrast ?? []).length);
        }
        setCommunityData({
          leads: leadsData?.count ?? 0,
          newsletter: newsletterData?.count ?? 0,
          affiliates: affiliatesData?.count ?? 0,
        });
        if (volunteerRaw?.rows) {
          const rows = volunteerRaw.rows as Array<Record<string, unknown>>;
          const byReward = { day_pass: 0, weekend_pass: 0, lodging: 0, none: 0 };
          for (const r of rows) {
            const rw = String(r.reward_earned ?? "");
            if (rw === "day_pass") byReward.day_pass++;
            else if (rw === "weekend_pass") byReward.weekend_pass++;
            else if (rw === "lodging") byReward.lodging++;
            else byReward.none++;
          }
          setVolunteerData({
            count: volunteerRaw.count ?? 0,
            recentSignups: rows.slice(0, 5).map(r => ({
              name: String(r.name ?? ""), email: String(r.email ?? ""),
              shift_ids: String(r.shift_ids ?? ""),
              reward_earned: String(r.reward_earned ?? ""),
              created_at: String(r.created_at ?? ""),
            })),
            byReward,
          });
        }
        if (vendorRaw?.rows) {
          setVendorCount((vendorRaw.rows as Array<Record<string, unknown>>).filter(r => r.payment_status === "confirmed").length);
        }
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

  const rewardLabel = (r: string) =>
    r === "lodging" ? "Lodging" : r === "weekend_pass" ? "Weekend Pass" : r === "day_pass" ? "Day Pass" : r || "—";
  const rewardAccent = (r: string) =>
    r === "lodging" ? "#D4AF3C" : r === "weekend_pass" ? "#3DB8AF" : "#8B5FBF";

  const totalBookings = (massageCount ?? 0) + (contrastCount ?? 0);

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

      {/* Master headcount */}
      {section("Headcount", (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
          <StatCard label="Massage Bookings" value={massageCount ?? "—"} accent="#8B5FBF" sub="Session slots filled" />
          <StatCard label="Contrast Therapy Bookings" value={contrastCount ?? "—"} accent="#3DB8AF" sub="Sauna / cold plunge slots" />
          <StatCard label="Total Bookings" value={totalBookings || "—"} accent="#D4AF3C" sub="Across all add-on experiences" />
          <StatCard label="Volunteers" value={volunteerData?.count ?? "—"} accent="#2a9d8f" sub="Signed up for shifts" />
          <StatCard label="Confirmed Vendors" value={vendorCount ?? "—"} sub="Vendor agreements confirmed" />
        </div>
      ))}

      {/* Volunteer work schedule */}
      {section("Volunteer Work Schedule", (
        <div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", marginBottom: "1.25rem" }}>
            <StatCard label="Total Signed Up" value={volunteerData?.count ?? "—"} accent="#2a9d8f" />
            <StatCard label="Comped Lodging" value={volunteerData?.byReward.lodging ?? "—"} accent="#D4AF3C" />
            <StatCard label="Weekend Pass" value={volunteerData?.byReward.weekend_pass ?? "—"} accent="#3DB8AF" />
            <StatCard label="Day Pass" value={volunteerData?.byReward.day_pass ?? "—"} accent="#8B5FBF" />
          </div>
          {volunteerData && volunteerData.recentSignups.length > 0 ? (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", background: "var(--surface-elevated)", borderRadius: "10px", overflow: "hidden" }}>
                <thead>
                  <tr>{["Name", "Email", "Shifts", "Reward", "Signed Up"].map(h => <th key={h} style={hcell}>{h}</th>)}</tr>
                </thead>
                <tbody>
                  {volunteerData.recentSignups.map((r, i) => {
                    const shiftCount = r.shift_ids ? r.shift_ids.split(",").filter(Boolean).length : 0;
                    return (
                      <tr key={i}>
                        <td style={{ ...cell, fontWeight: 600 }}>{r.name || "—"}</td>
                        <td style={cell}>{r.email}</td>
                        <td style={{ ...cell, color: "var(--ink-muted)" }}>{shiftCount > 0 ? `${shiftCount} shift${shiftCount !== 1 ? "s" : ""}` : "—"}</td>
                        <td style={cell}>
                          {r.reward_earned ? (
                            <span style={{
                              fontSize: "0.72rem", padding: "0.15rem 0.5rem", borderRadius: "4px", fontWeight: 600,
                              background: `${rewardAccent(r.reward_earned)}22`,
                              color: rewardAccent(r.reward_earned),
                            }}>
                              {rewardLabel(r.reward_earned)}
                            </span>
                          ) : "—"}
                        </td>
                        <td style={{ ...cell, color: "var(--ink-muted)" }}>{fmtDate(r.created_at)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div style={{ color: "var(--ink-muted)", fontSize: "0.85rem", padding: "0.5rem 0" }}>
              No volunteers signed up yet — sign-ups will appear here.
            </div>
          )}
        </div>
      ))}

      {/* Community snapshot */}
      {section("Community", (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
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


    </div>
  );
}

// ── Guest List Tab ────────────────────────────────────────────────────

interface MassageBooking {
  id: number; name: string; email: string; phone: string | null;
  practitioner: string; slot: string; session_type: string | null;
  hands: string | null; notes: string | null; created_at: string;
}
interface ContrastBooking {
  id: number; name: string; email: string; phone: string | null;
  slots: string; notes: string | null; created_at: string;
}
interface OrderLineItem {
  name: string; quantity: number; priceCents: number;
}
interface TicketOrder {
  id: number; customer_name: string | null; customer_email: string | null;
  amount_cents: number; referral_code: string | null;
  line_items: OrderLineItem[] | string; created_at: string;
}

function GuestListTab() {
  const [massage, setMassage] = useState<MassageBooking[]>([]);
  const [contrast, setContrast] = useState<ContrastBooking[]>([]);
  const [orders, setOrders] = useState<TicketOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"tickets" | "massage" | "contrast" | "payouts">("tickets");
  const [rates, setRates] = useState<Record<string, string>>({});
  const [syncing, setSyncing] = useState(false);
  const [syncMsg, setSyncMsg] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/guest-list");
      if (res.ok) {
        const d = await res.json();
        setMassage(d.massage ?? []);
        setContrast(d.contrast ?? []);
        setOrders(d.orders ?? []);
      }
    } finally { setLoading(false); }
  }, []);

  const syncOrders = async () => {
    setSyncing(true); setSyncMsg(null);
    try {
      const res = await fetch("/api/admin/sync-orders", { method: "POST" });
      const d = await res.json();
      if (d.error) setSyncMsg("Error: " + d.error);
      else { setSyncMsg(`Synced ${d.synced} orders from Square`); load(); }
    } catch { setSyncMsg("Network error"); }
    setSyncing(false);
  };

  const parseLineItems = (raw: OrderLineItem[] | string): OrderLineItem[] => {
    if (Array.isArray(raw)) return raw;
    try { return JSON.parse(raw as string) ?? []; } catch { return []; }
  };

  useEffect(() => { load(); }, [load]);

  const subTab = (key: typeof view, label: string): React.CSSProperties => ({
    padding: "0.4rem 1rem", borderRadius: "8px", border: "none", cursor: "pointer",
    fontSize: "0.8rem", fontFamily: "inherit", fontWeight: view === key ? 600 : 400,
    background: view === key ? "rgba(139,95,191,0.15)" : "transparent",
    color: view === key ? "#8B5FBF" : "var(--ink-muted)",
  });

  // Group massage bookings by practitioner
  const byPractitioner: Record<string, MassageBooking[]> = {};
  for (const b of massage) {
    if (!byPractitioner[b.practitioner]) byPractitioner[b.practitioner] = [];
    byPractitioner[b.practitioner].push(b);
  }

  const exportOrdersCSV = () => {
    const cols = ["Name","Email","Amount","Items","Referral","Purchased At"];
    const csv = [cols.join(","), ...orders.map(o => {
      const items = parseLineItems(o.line_items).map(li => `${li.quantity}x ${li.name}`).join("; ");
      return [
        o.customer_name ?? "", o.customer_email ?? "",
        `$${(o.amount_cents / 100).toFixed(2)}`, items,
        o.referral_code ?? "", o.created_at,
      ].map(v => `"${String(v).replace(/"/g, '""')}"`).join(",");
    })].join("\n");
    const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    a.download = `ticket_buyers_${new Date().toISOString().slice(0, 10)}.csv`; a.click();
  };

  const exportMassageCSV = () => {
    const cols = ["Name","Email","Phone","Practitioner","Slot","Session Type","Hands","Notes","Booked At"];
    const csv = [cols.join(","), ...massage.map(b =>
      [b.name,b.email,b.phone??"",(b.practitioner),b.slot,b.session_type??"",b.hands??"",b.notes??"",b.created_at]
        .map(v=>`"${String(v).replace(/"/g,'""')}"`).join(","))].join("\n");
    const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([csv],{type:"text/csv"}));
    a.download = `massage_bookings_${new Date().toISOString().slice(0,10)}.csv`; a.click();
  };

  if (loading) return <div className="admin-loading">Loading guest list…</div>;

  const totalRevenue = orders.reduce((s, o) => s + o.amount_cents, 0);

  return (
    <div style={{ padding: "1.5rem 2rem" }}>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", marginBottom: "1.5rem" }}>
        <StatCard label="Ticket Buyers" value={orders.length} accent="#D4AF3C" sub={orders.length > 0 ? usd(totalRevenue) + " total" : undefined} />
        <StatCard label="Massage Bookings" value={massage.length} accent="#8B5FBF" />
        <StatCard label="Practitioners" value={Object.keys(byPractitioner).length} />
        <StatCard label="Contrast Therapy" value={contrast.length} accent="#3DB8AF" />
      </div>

      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.25rem", alignItems: "center", flexWrap: "wrap" }}>
        <button style={subTab("tickets", "Tickets")} onClick={() => setView("tickets")}>Ticket Buyers</button>
        <button style={subTab("massage", "Massage")} onClick={() => setView("massage")}>Massage Bookings</button>
        <button style={subTab("contrast", "Contrast")} onClick={() => setView("contrast")}>Contrast Therapy</button>
        <button style={subTab("payouts", "Payouts")} onClick={() => setView("payouts")}>Payout Calculator</button>
        <div style={{ marginLeft: "auto", display: "flex", gap: "0.5rem", alignItems: "center", flexWrap: "wrap" }}>
          {syncMsg && <span style={{ fontSize: "0.75rem", color: syncMsg.startsWith("Error") ? "#f87171" : "#3DB8AF" }}>{syncMsg}</span>}
          <button onClick={syncOrders} disabled={syncing} style={{ fontSize: "0.75rem", color: "var(--ink-muted)", background: "rgba(212,175,60,0.1)", border: "1px solid rgba(212,175,60,0.3)", borderRadius: "6px", padding: "0.3rem 0.7rem", cursor: "pointer", fontFamily: "inherit" }}>
            {syncing ? "Syncing…" : "Sync from Square"}
          </button>
          <button onClick={load} style={{ fontSize: "0.78rem", color: "var(--ink-muted)", background: "none", border: "none", cursor: "pointer" }}>Refresh</button>
          {view === "tickets" && <button onClick={exportOrdersCSV} className="admin-export-btn" disabled={!orders.length}>Export CSV</button>}
          {view === "massage" && <button onClick={exportMassageCSV} className="admin-export-btn" disabled={!massage.length}>Export CSV</button>}
        </div>
      </div>

      {view === "tickets" && (
        orders.length === 0 ? (
          <div>
            <div className="admin-empty">No ticket orders yet. Hit "Sync from Square" to pull your existing sales.</div>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", background: "var(--surface-elevated)", borderRadius: "10px", overflow: "hidden" }}>
              <thead><tr>
                {["#","Name","Email","Amount","What They Bought","Referral","Purchased"].map(h => <th key={h} style={hcell}>{h}</th>)}
              </tr></thead>
              <tbody>
                {orders.map((o, i) => {
                  const items = parseLineItems(o.line_items);
                  return (
                    <tr key={o.id}>
                      <td style={{ ...cell, color: "var(--ink-muted)", width: "2rem" }}>{i + 1}</td>
                      <td style={{ ...cell, fontWeight: 600 }}>{o.customer_name || <span style={{ color: "var(--ink-muted)", fontStyle: "italic" }}>Unknown</span>}</td>
                      <td style={{ ...cell, fontSize: "0.78rem" }}>{o.customer_email || "—"}</td>
                      <td style={{ ...cell, fontWeight: 600, color: "#D4AF3C" }}>{usd(o.amount_cents)}</td>
                      <td style={{ ...cell, fontSize: "0.78rem" }}>
                        {items.length > 0 ? (
                          <div style={{ display: "flex", flexDirection: "column", gap: "0.2rem" }}>
                            {items.map((li, j) => (
                              <div key={j} style={{ display: "flex", gap: "0.4rem", alignItems: "baseline" }}>
                                <span style={{ color: "var(--ink)", fontWeight: 500 }}>{li.quantity > 1 ? `${li.quantity}×` : ""} {li.name}</span>
                                <span style={{ color: "var(--ink-muted)", fontSize: "0.72rem" }}>{usd(li.priceCents)}</span>
                              </div>
                            ))}
                          </div>
                        ) : "—"}
                      </td>
                      <td style={{ ...cell, fontSize: "0.75rem", color: "var(--ink-muted)" }}>{o.referral_code || "—"}</td>
                      <td style={{ ...cell, fontSize: "0.75rem", color: "var(--ink-muted)" }}>{fmtDate(o.created_at)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )
      )}

      {view === "massage" && (
        massage.length === 0 ? <div className="admin-empty">No massage bookings yet</div> : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", background: "var(--surface-elevated)", borderRadius: "10px", overflow: "hidden" }}>
              <thead><tr>
                {["#","Name","Email","Phone","Practitioner","Slot","Session","Hands","Notes","Booked"].map(h=><th key={h} style={hcell}>{h}</th>)}
              </tr></thead>
              <tbody>
                {massage.map((b, i) => (
                  <tr key={b.id}>
                    <td style={{ ...cell, color: "var(--ink-muted)", width: "2rem" }}>{i + 1}</td>
                    <td style={{ ...cell, fontWeight: 600 }}>{b.name}</td>
                    <td style={{ ...cell, fontSize: "0.78rem" }}>{b.email}</td>
                    <td style={{ ...cell, fontSize: "0.78rem" }}>{b.phone || "—"}</td>
                    <td style={{ ...cell, color: "#8B5FBF", fontWeight: 600 }}>{b.practitioner}</td>
                    <td style={cell}>{b.slot}</td>
                    <td style={{ ...cell, color: "var(--ink-muted)" }}>{b.session_type || "—"}</td>
                    <td style={{ ...cell, color: "var(--ink-muted)" }}>{b.hands || "—"}</td>
                    <td style={{ ...cell, fontSize: "0.75rem", color: "var(--ink-muted)", maxWidth: "160px" }}>{b.notes || "—"}</td>
                    <td style={{ ...cell, fontSize: "0.75rem", color: "var(--ink-muted)" }}>{fmtDate(b.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      )}

      {view === "contrast" && (
        contrast.length === 0 ? <div className="admin-empty">No contrast therapy bookings yet</div> : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", background: "var(--surface-elevated)", borderRadius: "10px", overflow: "hidden" }}>
              <thead><tr>
                {["#","Name","Email","Phone","Slots Booked","Notes","Booked At"].map(h=><th key={h} style={hcell}>{h}</th>)}
              </tr></thead>
              <tbody>
                {contrast.map((b, i) => (
                  <tr key={b.id}>
                    <td style={{ ...cell, color: "var(--ink-muted)", width: "2rem" }}>{i + 1}</td>
                    <td style={{ ...cell, fontWeight: 600 }}>{b.name}</td>
                    <td style={{ ...cell, fontSize: "0.78rem" }}>{b.email}</td>
                    <td style={{ ...cell, fontSize: "0.78rem" }}>{b.phone || "—"}</td>
                    <td style={{ ...cell, color: "#3DB8AF" }}>{b.slots}</td>
                    <td style={{ ...cell, fontSize: "0.75rem", color: "var(--ink-muted)" }}>{b.notes || "—"}</td>
                    <td style={{ ...cell, fontSize: "0.75rem", color: "var(--ink-muted)" }}>{fmtDate(b.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      )}

      {view === "payouts" && (
        <div>
          <p style={{ fontSize: "0.85rem", color: "var(--ink-muted)", marginBottom: "1.25rem" }}>
            Enter the payout rate per session for each practitioner to calculate what you owe them.
          </p>
          {Object.keys(byPractitioner).length === 0 ? (
            <div className="admin-empty">No massage bookings yet — payouts will appear here once guests book sessions.</div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {Object.entries(byPractitioner).map(([practitioner, bookings]) => {
                const rateStr = rates[practitioner] ?? "";
                const rate = parseFloat(rateStr) || 0;
                const total = rate * bookings.length;
                return (
                  <div key={practitioner} style={{
                    background: "var(--surface-elevated)", border: "1px solid var(--line-medium)",
                    borderRadius: "12px", overflow: "hidden",
                  }}>
                    <div style={{
                      padding: "0.9rem 1.25rem", background: "rgba(139,95,191,0.06)",
                      borderBottom: "1px solid var(--line-subtle)",
                      display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap",
                    }}>
                      <span style={{ fontWeight: 700, fontSize: "1rem", color: "#8B5FBF", flex: 1 }}>{practitioner}</span>
                      <span style={{ fontSize: "0.82rem", color: "var(--ink-muted)" }}>
                        {bookings.length} booking{bookings.length !== 1 ? "s" : ""}
                      </span>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <span style={{ fontSize: "0.78rem", color: "var(--ink-muted)" }}>$/session:</span>
                        <input
                          type="number" min={0} step={5} placeholder="0"
                          value={rateStr}
                          onChange={e => setRates(r => ({ ...r, [practitioner]: e.target.value }))}
                          style={{
                            width: "80px", padding: "0.3rem 0.5rem", borderRadius: "6px",
                            border: "1px solid var(--line-medium)", background: "var(--surface-page)",
                            color: "var(--ink)", fontSize: "0.85rem", textAlign: "right",
                          }}
                        />
                      </div>
                      <div style={{
                        fontWeight: 700, fontSize: "1.1rem",
                        color: total > 0 ? "#2a9d8f" : "var(--ink-muted)",
                        minWidth: "90px", textAlign: "right",
                      }}>
                        {total > 0 ? `$${total.toFixed(2)}` : "—"}
                      </div>
                    </div>
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                      <thead><tr>
                        {["Guest","Slot","Session Type","Hands"].map(h=><th key={h} style={{ ...hcell, fontSize: "0.68rem" }}>{h}</th>)}
                      </tr></thead>
                      <tbody>
                        {bookings.map(b => (
                          <tr key={b.id}>
                            <td style={{ ...cell, fontWeight: 600, fontSize: "0.82rem" }}>{b.name}</td>
                            <td style={{ ...cell, fontSize: "0.82rem" }}>{b.slot}</td>
                            <td style={{ ...cell, color: "var(--ink-muted)", fontSize: "0.78rem" }}>{b.session_type || "—"}</td>
                            <td style={{ ...cell, color: "var(--ink-muted)", fontSize: "0.78rem" }}>{b.hands || "—"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                );
              })}

              {/* Grand total */}
              {Object.keys(rates).some(p => parseFloat(rates[p]) > 0) && (
                <div style={{
                  background: "rgba(42,157,143,0.08)", border: "1px solid rgba(42,157,143,0.3)",
                  borderRadius: "10px", padding: "1rem 1.25rem",
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                }}>
                  <span style={{ fontWeight: 600, fontSize: "0.9rem" }}>Total Practitioner Payouts</span>
                  <span style={{ fontWeight: 800, fontSize: "1.3rem", color: "#2a9d8f" }}>
                    ${Object.entries(byPractitioner).reduce((sum, [p, bks]) => {
                      const r = parseFloat(rates[p] ?? "0") || 0;
                      return sum + r * bks.length;
                    }, 0).toFixed(2)}
                  </span>
                </div>
              )}
            </div>
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
  const [activating, setActivating] = useState(false);
  const [activateMsg, setActivateMsg] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [newCode, setNewCode] = useState({ code: "", name: "", commissionPct: "10", company: "", notes: "" });
  const [creating, setCreating] = useState(false);
  const [createMsg, setCreateMsg] = useState<string | null>(null);

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

  useEffect(() => { fetchData(); }, [fetchData]);
  useEffect(() => { const t = setTimeout(() => fetchData(search), 300); return () => clearTimeout(t); }, [search, fetchData]);

  const saveEdits = async (id: number) => {
    setSaving(id);
    await fetch("/api/admin/affiliates", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, ...edits[id] }) });
    setSaving(null);
    fetchData(search);
  };

  const activateAll = async () => {
    setActivating(true); setActivateMsg(null);
    try {
      const res = await fetch("/api/admin/affiliates", { method: "PUT" });
      const d = await res.json();
      if (d.success) { setActivateMsg(`✓ Activated ${d.activated} code${d.activated !== 1 ? "s" : ""}`); fetchData(search); }
      else setActivateMsg("Error: " + d.error);
    } catch { setActivateMsg("Network error"); }
    setActivating(false);
  };

  const createCode = async (e: React.FormEvent) => {
    e.preventDefault(); setCreating(true); setCreateMsg(null);
    try {
      const res = await fetch("/api/admin/affiliates", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(newCode) });
      const d = await res.json();
      if (d.success) { setCreateMsg(`✓ Created ${d.code}`); setNewCode({ code: "", name: "", commissionPct: "10", company: "", notes: "" }); fetchData(search); }
      else setCreateMsg("Error: " + d.error);
    } catch { setCreateMsg("Network error"); }
    setCreating(false);
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
          <button onClick={activateAll} disabled={activating} style={{ background: "rgba(212,175,60,0.12)", border: "1px solid #D4AF3C", borderRadius: "6px", color: "#D4AF3C", padding: "0.3rem 0.85rem", cursor: "pointer", fontSize: "0.8rem", fontFamily: "inherit" }}>
            {activating ? "Activating…" : "Activate All Pending"}
          </button>
          {activateMsg && <span style={{ fontSize: "0.8rem", color: activateMsg.startsWith("✓") ? "#3DB8AF" : "#f87171" }}>{activateMsg}</span>}
          <button onClick={() => { setShowCreate(v => !v); setCreateMsg(null); }} style={{ background: "rgba(139,95,191,0.12)", border: "1px solid #8b5fbf", borderRadius: "6px", color: "#8b5fbf", padding: "0.3rem 0.85rem", cursor: "pointer", fontSize: "0.8rem", fontFamily: "inherit" }}>
            {showCreate ? "Cancel" : "+ Create Code"}
          </button>
          <button onClick={() => fetchData(search)} className="admin-refresh-btn">Refresh</button>
          <button onClick={exportCSV} className="admin-export-btn" disabled={!rows.length}>Export CSV</button>
        </div>
      </div>
      {showCreate && (
        <form onSubmit={createCode} style={{ padding: "1rem 1.5rem", borderBottom: "1px solid var(--line-subtle)", background: "rgba(139,95,191,0.04)", display: "flex", flexWrap: "wrap", gap: "0.75rem", alignItems: "flex-end" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
            <label style={{ fontSize: "0.7rem", color: "var(--ink-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Code *</label>
            <input required value={newCode.code} onChange={e => setNewCode(p => ({ ...p, code: e.target.value.toUpperCase() }))} placeholder="VALDEZ" style={{ width: "110px", background: "var(--surface-elevated)", border: "1px solid var(--line-medium)", borderRadius: "6px", color: "var(--ink)", padding: "0.3rem 0.5rem", fontSize: "0.85rem", fontFamily: "monospace", textTransform: "uppercase" }} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
            <label style={{ fontSize: "0.7rem", color: "var(--ink-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Name *</label>
            <input required value={newCode.name} onChange={e => setNewCode(p => ({ ...p, name: e.target.value }))} placeholder="Partner name" style={{ width: "150px", background: "var(--surface-elevated)", border: "1px solid var(--line-medium)", borderRadius: "6px", color: "var(--ink)", padding: "0.3rem 0.5rem", fontSize: "0.85rem" }} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
            <label style={{ fontSize: "0.7rem", color: "var(--ink-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Commission %</label>
            <input type="number" min={0} max={100} value={newCode.commissionPct} onChange={e => setNewCode(p => ({ ...p, commissionPct: e.target.value }))} style={{ width: "70px", background: "var(--surface-elevated)", border: "1px solid var(--line-medium)", borderRadius: "6px", color: "var(--ink)", padding: "0.3rem 0.5rem", fontSize: "0.85rem" }} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
            <label style={{ fontSize: "0.7rem", color: "var(--ink-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Company</label>
            <input value={newCode.company} onChange={e => setNewCode(p => ({ ...p, company: e.target.value }))} placeholder="Optional" style={{ width: "130px", background: "var(--surface-elevated)", border: "1px solid var(--line-medium)", borderRadius: "6px", color: "var(--ink)", padding: "0.3rem 0.5rem", fontSize: "0.85rem" }} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
            <label style={{ fontSize: "0.7rem", color: "var(--ink-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Notes</label>
            <input value={newCode.notes} onChange={e => setNewCode(p => ({ ...p, notes: e.target.value }))} placeholder="Optional" style={{ width: "130px", background: "var(--surface-elevated)", border: "1px solid var(--line-medium)", borderRadius: "6px", color: "var(--ink)", padding: "0.3rem 0.5rem", fontSize: "0.85rem" }} />
          </div>
          <button type="submit" disabled={creating} style={{ background: "rgba(139,95,191,0.2)", border: "1px solid #8b5fbf", borderRadius: "6px", color: "#8b5fbf", padding: "0.35rem 1rem", cursor: "pointer", fontSize: "0.85rem", fontFamily: "inherit", fontWeight: 600 }}>
            {creating ? "Creating…" : "Create & Activate"}
          </button>
          {createMsg && <span style={{ fontSize: "0.8rem", color: createMsg.startsWith("✓") ? "#3DB8AF" : "#f87171", alignSelf: "center" }}>{createMsg}</span>}
        </form>
      )}
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
  camping: boolean;
  lodging_paid: boolean;
  admin_notes: string | null;
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
  const [view, setView]             = useState<"agreements" | "camping">("agreements");
  const [campingNotes, setCampingNotes] = useState<Record<number, string>>({});

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

  const updateField = async (id: number, field: string, value: unknown) => {
    await fetch("/api/admin/vendor-agreements", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, [field]: value }),
    });
    setAgreements(prev => prev.map(a => a.id === id ? { ...a, [field]: value } : a));
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

  const subTabStyle = (key: typeof view): React.CSSProperties => ({
    padding: "0.4rem 1rem", borderRadius: "8px", border: "none", cursor: "pointer",
    fontSize: "0.8rem", fontFamily: "inherit", fontWeight: view === key ? 600 : 400,
    background: view === key ? "rgba(61,184,175,0.15)" : "transparent",
    color: view === key ? "#3DB8AF" : "var(--ink-muted)",
  });

  const exportCSV = () => {
    const cols = ["Vendor","Business","Contact","Email","Phone","Category","Space","Days","Electricity","Amount","Status","Camping","Lodging Paid","Admin Notes","Signed By","Signed On","Submitted"];
    const csv = [cols.join(","), ...agreements.map(a => [
      a.vendor_name, a.business_name ?? "", a.contact_name, a.email, a.phone,
      a.category, SPACE_LABELS[a.space_type] ?? a.space_type, a.selected_days ?? "All 3",
      a.electricity, a.price_cents === 0 ? "Free" : `$${(a.price_cents / 100).toFixed(0)}`,
      a.payment_status, a.camping ? "Yes" : "No", a.lodging_paid ? "Yes" : "No",
      a.admin_notes ?? "", a.printed_name, a.sig_date,
      new Date(a.created_at).toLocaleDateString(),
    ].map(v => `"${String(v).replace(/"/g, '""')}"`).join(","))].join("\n");
    const el = document.createElement("a");
    el.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    el.download = `vendor_agreements_${new Date().toISOString().slice(0, 10)}.csv`;
    el.click();
  };

  return (
    <div style={{ padding: "1.5rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem", flexWrap: "wrap", gap: "0.75rem" }}>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <button style={subTabStyle("agreements")} onClick={() => setView("agreements")}>Agreements</button>
          <button style={subTabStyle("camping")} onClick={() => setView("camping")}>Camping & Lodging</button>
        </div>
        <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
          <span style={{ fontSize: "0.8rem", color: "var(--ink-muted)" }}>
            {agreements.length} total · Confirmed: {agreements.filter(a => a.payment_status === "confirmed").length} · Pending: {agreements.filter(a => a.payment_status === "pending").length}
          </span>
          <button onClick={exportCSV} className="admin-export-btn" disabled={!agreements.length}>Export CSV</button>
        </div>
      </div>

      {view === "camping" && (
        <div>
          <p style={{ fontSize: "0.82rem", color: "var(--ink-muted)", marginBottom: "1.25rem" }}>
            Track which vendors are camping on-site and have paid for lodging. Changes save instantly.
          </p>
          {agreements.length === 0 ? (
            <div className="admin-empty">No vendor agreements yet.</div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {agreements.map(a => (
                <div key={a.id} style={{
                  background: "var(--surface-elevated)", border: "1px solid var(--line-medium)",
                  borderRadius: "10px", padding: "0.9rem 1.25rem",
                  display: "flex", flexWrap: "wrap", gap: "1rem", alignItems: "center",
                }}>
                  <div style={{ flex: "1 1 180px" }}>
                    <div style={{ fontWeight: 600, fontSize: "0.9rem" }}>{a.vendor_name}</div>
                    {a.business_name && a.business_name !== a.vendor_name && (
                      <div style={{ fontSize: "0.75rem", color: "var(--ink-muted)" }}>{a.business_name}</div>
                    )}
                    <div style={{ fontSize: "0.75rem", color: "var(--ink-muted)" }}>{a.contact_name} · {a.email}</div>
                  </div>
                  <label style={{ display: "flex", alignItems: "center", gap: "0.4rem", cursor: "pointer", fontSize: "0.82rem" }}>
                    <input
                      type="checkbox"
                      checked={!!a.camping}
                      onChange={e => updateField(a.id, "camping", e.target.checked)}
                      style={{ width: "16px", height: "16px", cursor: "pointer", accentColor: "#D4AF3C" }}
                    />
                    <span style={{ color: a.camping ? "#D4AF3C" : "var(--ink-muted)", fontWeight: a.camping ? 600 : 400 }}>Camping</span>
                  </label>
                  <label style={{ display: "flex", alignItems: "center", gap: "0.4rem", cursor: "pointer", fontSize: "0.82rem" }}>
                    <input
                      type="checkbox"
                      checked={!!a.lodging_paid}
                      onChange={e => updateField(a.id, "lodging_paid", e.target.checked)}
                      style={{ width: "16px", height: "16px", cursor: "pointer", accentColor: "#3DB8AF" }}
                    />
                    <span style={{ color: a.lodging_paid ? "#3DB8AF" : "var(--ink-muted)", fontWeight: a.lodging_paid ? 600 : 400 }}>Lodging Paid</span>
                  </label>
                  <div style={{ flex: "2 1 200px", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <input
                      type="text"
                      placeholder="Admin notes…"
                      value={campingNotes[a.id] !== undefined ? campingNotes[a.id] : (a.admin_notes ?? "")}
                      onChange={e => setCampingNotes(prev => ({ ...prev, [a.id]: e.target.value }))}
                      onBlur={e => {
                        const val = e.target.value;
                        if (val !== (a.admin_notes ?? "")) updateField(a.id, "admin_notes", val);
                      }}
                      style={{
                        flex: 1, padding: "0.35rem 0.6rem", borderRadius: "6px",
                        border: "1px solid var(--line-medium)", background: "var(--surface-page)",
                        color: "var(--ink)", fontSize: "0.8rem",
                      }}
                    />
                  </div>
                </div>
              ))}
              <div style={{ fontSize: "0.78rem", color: "var(--ink-muted)", marginTop: "0.25rem" }}>
                Camping: {agreements.filter(a => a.camping).length} vendor{agreements.filter(a => a.camping).length !== 1 ? "s" : ""} &nbsp;·&nbsp;
                Lodging paid: {agreements.filter(a => a.lodging_paid).length}
              </div>
            </div>
          )}
        </div>
      )}

      {view === "agreements" && (
        agreements.length === 0 ? (
          <p style={{ color: "var(--ink-muted)", fontSize: "0.9rem" }}>No vendor agreements submitted yet.</p>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", background: "var(--surface-elevated)", borderRadius: "10px", overflow: "hidden" }}>
              <thead>
                <tr>
                  {["Vendor", "Contact", "Email", "Space", "Days", "Elec", "Amount", "Status", "Camp", "Signed", "Submitted"].map(h => (
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
                    <td style={vcell}>
                      {a.camping ? <span style={{ color: "#D4AF3C", fontSize: "0.72rem", fontWeight: 600 }}>⛺ Yes</span> : <span style={{ color: "var(--ink-muted)", fontSize: "0.72rem" }}>—</span>}
                    </td>
                    <td style={{ ...vcell, fontSize: "0.75rem" }}>{a.printed_name}<br /><span style={{ color: "var(--ink-muted)" }}>{a.sig_date}</span></td>
                    <td style={{ ...vcell, fontSize: "0.75rem", color: "var(--ink-muted)" }}>{new Date(a.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      )}

      {view === "agreements" && selected && (
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

const INSTRUCTOR_STATUSES: { value: string; label: string; color: string }[] = [
  { value: "pending",         label: "Pending",         color: "var(--ink-muted)" },
  { value: "staff",           label: "Staff",           color: "#3a9d5c" },
  { value: "denied",          label: "Denied",          color: "#dc5050" },
  { value: "follow_up_2027",  label: "Follow up 2027",  color: "#c98a2c" },
];

function DataTab({ tableKey, columns, statusField }: { tableKey: TableName; columns: string[]; statusField?: string }) {
  const [rows, setRows] = useState<Record<string, unknown>[]>([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedRow, setSelectedRow] = useState<Record<string, unknown> | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);

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
    } catch { setRows([]); }
    setLoading(false);
  }, [tableKey]);

  useEffect(() => { fetchData(); }, [fetchData]);
  useEffect(() => {
    const t = setTimeout(() => fetchData(search), 300);
    return () => clearTimeout(t);
  }, [search, fetchData]);

  const deleteRow = async (id: number) => {
    setDeleting(true);
    await fetch("/api/admin/data", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ table: tableKey, id }),
    });
    setDeleting(false);
    setDeleteConfirm(null);
    setSelectedRow(null);
    fetchData(search);
  };

  const updateStatus = async (id: number, status: string) => {
    if (!statusField) return;
    await fetch("/api/admin/data", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ table: tableKey, id, status }),
    });
    setRows(prev => prev.map(r => (Number(r.id) === id ? { ...r, [statusField]: status } : r)));
    setSelectedRow(prev => (prev && Number(prev.id) === id ? { ...prev, [statusField]: status } : prev));
  };

  const exportCSV = () => {
    if (rows.length === 0) return;
    const csv = [columns.join(","), ...rows.map(row => columns.map(c => `"${String(row[c] ?? "").replace(/"/g, '""')}"`).join(","))].join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    a.download = `${tableKey}_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  };

  return (
    <>
      <div className="admin-toolbar">
        <div className="admin-toolbar-left">
          <span className="admin-count">{count} records</span>
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by email…" className="admin-search" />
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
              <tr>
                {columns.map(col => <th key={col}>{col.replace(/_/g, " ")}</th>)}
                <th style={{ width: "80px" }}>Delete</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => {
                const id = Number(row.id);
                const isSelected = selectedRow === row;
                return (
                  <tr key={i} onClick={() => { setSelectedRow(isSelected ? null : row); setDeleteConfirm(null); }}
                    style={{ cursor: "pointer", background: isSelected ? "rgba(139,95,191,0.07)" : undefined }}>
                    {columns.map(col => (
                      <td key={col} onClick={col === statusField ? e => e.stopPropagation() : undefined}>
                        {col === "created_at" ? fmtDate(row[col])
                          : col === statusField ? (
                            <select
                              value={String(row[col] ?? "pending")}
                              onChange={e => updateStatus(id, e.target.value)}
                              style={{
                                fontSize: "0.75rem", padding: "0.15rem 0.3rem", borderRadius: "4px",
                                border: `1px solid ${INSTRUCTOR_STATUSES.find(s => s.value === row[col])?.color ?? "var(--line-medium)"}`,
                                color: INSTRUCTOR_STATUSES.find(s => s.value === row[col])?.color,
                                background: "transparent",
                              }}
                            >
                              {INSTRUCTOR_STATUSES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                            </select>
                          ) : String(row[col] ?? "—")}
                      </td>
                    ))}
                    <td onClick={e => e.stopPropagation()} style={{ textAlign: "center" }}>
                      {deleteConfirm === id ? (
                        <span style={{ display: "flex", gap: "4px", justifyContent: "center" }}>
                          <button onClick={() => deleteRow(id)} disabled={deleting}
                            style={{ fontSize: "0.7rem", padding: "0.15rem 0.4rem", background: "#dc5050", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer" }}>
                            {deleting ? "…" : "Yes"}
                          </button>
                          <button onClick={() => setDeleteConfirm(null)}
                            style={{ fontSize: "0.7rem", padding: "0.15rem 0.4rem", background: "transparent", color: "var(--ink-muted)", border: "1px solid var(--line-medium)", borderRadius: "4px", cursor: "pointer" }}>
                            No
                          </button>
                        </span>
                      ) : (
                        <button onClick={() => setDeleteConfirm(id)}
                          style={{ fontSize: "0.75rem", color: "#dc5050", background: "none", border: "none", cursor: "pointer", padding: "0.1rem 0.3rem" }}
                          title="Delete">
                          ✕
                        </button>
                      )}
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
            {columns.filter(col => col !== "id" && col !== "created_at" && col !== statusField).map(col => {
              const display = String(selectedRow[col] ?? "—");
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
          {statusField && (
            <div style={{ padding: "0.75rem 1.25rem", borderTop: "1px solid var(--line-subtle)", display: "flex", gap: "0.5rem", alignItems: "center", flexWrap: "wrap" }}>
              <span style={{ fontSize: "0.8rem", color: "var(--ink-muted)" }}>Status:</span>
              {INSTRUCTOR_STATUSES.map(s => {
                const active = String(selectedRow[statusField] ?? "pending") === s.value;
                return (
                  <button key={s.value} onClick={() => updateStatus(Number(selectedRow.id), s.value)}
                    style={{
                      fontSize: "0.75rem", padding: "0.3rem 0.7rem", borderRadius: "999px", cursor: "pointer",
                      border: `1px solid ${s.color}`,
                      background: active ? s.color : "transparent",
                      color: active ? "#fff" : s.color,
                    }}>
                    {s.label}
                  </button>
                );
              })}
            </div>
          )}
          <div style={{ padding: "0.75rem 1.25rem", borderTop: "1px solid var(--line-subtle)" }}>
            {deleteConfirm === Number(selectedRow.id) ? (
              <span style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                <span style={{ fontSize: "0.8rem", color: "#dc5050" }}>Delete this record permanently?</span>
                <button onClick={() => deleteRow(Number(selectedRow.id))} disabled={deleting}
                  style={{ fontSize: "0.8rem", padding: "0.3rem 0.8rem", background: "#dc5050", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer" }}>
                  {deleting ? "…" : "Yes, delete"}
                </button>
                <button onClick={() => setDeleteConfirm(null)}
                  style={{ fontSize: "0.8rem", padding: "0.3rem 0.8rem", background: "transparent", border: "1px solid var(--line-medium)", borderRadius: "6px", cursor: "pointer", color: "var(--ink-muted)" }}>
                  Cancel
                </button>
              </span>
            ) : (
              <button onClick={() => setDeleteConfirm(Number(selectedRow.id))}
                style={{ fontSize: "0.8rem", color: "#dc5050", background: "none", border: "none", cursor: "pointer", padding: 0 }}>
                Delete record
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
}

// ── Aerial / Silk Bookings Tab ──────────────────────────────────────────
// Shows equipment capacity (silk hammocks) per slot at a glance, above the
// full booking list, so staff can see at a glance whether a class or a
// solo rental slot is fully equipped.

const AERIAL_CLASS_SLOTS = [
  { key: "fri-3pm",      label: "Fri 3:00 PM" },
  { key: "fri-6pm",      label: "Fri 6:00 PM" },
  { key: "sat-10am",     label: "Sat 10:00 AM" },
  { key: "sat-2pm",      label: "Sat 2:00 PM" },
  { key: "sun-1030am",   label: "Sun 10:30 AM" },
  { key: "sun-2pm-kids", label: "Sun 2:00 PM (Kids)" },
];
const AERIAL_SOLO_SLOTS = [
  { key: "fri-4pm",    label: "Fri 4:00 PM" },
  { key: "sat-7am",    label: "Sat 7:00 AM" },
  { key: "sat-8am",    label: "Sat 8:00 AM" },
  { key: "sat-4pm",    label: "Sat 4:00 PM" },
  { key: "sat-5pm",    label: "Sat 5:00 PM" },
  { key: "sun-8am",    label: "Sun 8:00 AM" },
  { key: "sun-10am",   label: "Sun 10:00 AM" },
  { key: "fri-8pm",    label: "Fri 8:00 PM (Dance)" },
  { key: "sat-8pm",    label: "Sat 8:00 PM (Dance)" },
  { key: "sat-10pm",   label: "Sat 10:00 PM (Dance)" },
  { key: "sun-1111am", label: "Sun 11:11 AM (Dance)" },
  { key: "sun-7pm",    label: "Sun 7:00 PM (Dance)" },
  { key: "sat-6pm",    label: "Sat 6:00 PM (Music)" },
  { key: "sun-12pm",   label: "Sun 12:00 PM (Music)" },
  { key: "sun-1pm",    label: "Sun 1:00 PM (Music)" },
  { key: "sun-315pm",  label: "Sun 3:15 PM (Music)" },
  { key: "sun-4pm",    label: "Sun 4:00 PM (Music)" },
];

function AerialBookingsTab() {
  const [rows, setRows] = useState<Record<string, unknown>[]>([]);

  const fetchCounts = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/data?table=aerial_bookings");
      if (res.ok) {
        const data = await res.json();
        setRows(data.rows || []);
      }
    } catch { setRows([]); }
  }, []);

  useEffect(() => { fetchCounts(); }, [fetchCounts]);

  const countFor = (mode: string, key: string) =>
    rows.filter(r => r.mode === mode && r.slot === key).length;

  const renderStrip = (title: string, slots: { key: string; label: string }[], mode: string, capacity: number) => (
    <div style={{ marginBottom: "0.9rem" }}>
      <div style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--ink-muted)", marginBottom: "0.5rem" }}>
        {title}
      </div>
      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
        {slots.map(s => {
          const booked = countFor(mode, s.key);
          const full = booked >= capacity;
          return (
            <span key={s.key} style={{
              fontSize: "0.75rem", padding: "0.35rem 0.7rem", borderRadius: "999px",
              border: `1px solid ${full ? "#dc5050" : "var(--line-medium)"}`,
              color: full ? "#dc5050" : "var(--ink-muted)",
              background: full ? "rgba(220,80,80,0.08)" : "transparent",
              fontWeight: full ? 700 : 400,
            }}>
              {s.label}: {booked}/{capacity}{full ? " · FULL" : ""}
            </span>
          );
        })}
      </div>
    </div>
  );

  return (
    <>
      <div style={{ padding: "1.25rem 1.5rem 0.25rem" }}>
        {renderStrip("Group Classes · 6 hammocks each", AERIAL_CLASS_SLOTS, "class", 6)}
        {renderStrip("Solo Hammock Rentals · 7 hammocks available", AERIAL_SOLO_SLOTS, "solo", 7)}
      </div>
      <DataTab tableKey="aerial_bookings" columns={["id", "name", "email", "phone", "mode", "slot", "notes", "created_at"]} />
    </>
  );
}

// ── Paddleboard Bookings Tab ────────────────────────────────────────────
// Boards are rented from Alaska Fly Dog — same equipment-capacity-at-a-glance
// pattern as the Aerial tab, sized to the 4 slots on the printed schedule.

const PADDLEBOARD_SLOTS = [
  { key: "fri-2pm",      label: "Fri 2:00 PM" },
  { key: "sat-1pm",      label: "Sat 1:00 PM" },
  { key: "sun-1pm-kids", label: "Sun 1:00 PM (Kids)" },
  { key: "sun-3pm",      label: "Sun 3:00 PM" },
];

function PaddleboardBookingsTab() {
  const [rows, setRows] = useState<Record<string, unknown>[]>([]);

  const fetchCounts = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/data?table=paddleboard_bookings");
      if (res.ok) {
        const data = await res.json();
        setRows(data.rows || []);
      }
    } catch { setRows([]); }
  }, []);

  useEffect(() => { fetchCounts(); }, [fetchCounts]);

  const capacity = 7;
  const countFor = (key: string) => rows.filter(r => r.slot === key).length;

  return (
    <>
      <div style={{ padding: "1.25rem 1.5rem 0.25rem" }}>
        <div style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--ink-muted)", marginBottom: "0.5rem" }}>
          Paddleboards · 7 available per session
        </div>
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
          {PADDLEBOARD_SLOTS.map(s => {
            const booked = countFor(s.key);
            const full = booked >= capacity;
            return (
              <span key={s.key} style={{
                fontSize: "0.75rem", padding: "0.35rem 0.7rem", borderRadius: "999px",
                border: `1px solid ${full ? "#dc5050" : "var(--line-medium)"}`,
                color: full ? "#dc5050" : "var(--ink-muted)",
                background: full ? "rgba(220,80,80,0.08)" : "transparent",
                fontWeight: full ? 700 : 400,
              }}>
                {s.label}: {booked}/{capacity}{full ? " · FULL" : ""}
              </span>
            );
          })}
        </div>
      </div>
      <DataTab tableKey="paddleboard_bookings" columns={["id", "name", "email", "phone", "slot", "notes", "created_at"]} />
    </>
  );
}

// ── Volunteer Registrations Tab ───────────────────────────────────────

function VolunteerRegistrationsTab() {
  const [rows, setRows] = useState<Record<string, unknown>[]>([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedRow, setSelectedRow] = useState<Record<string, unknown> | null>(null);
  const [view, setView] = useState<"by-person" | "by-shift">("by-person");

  const fetchData = useCallback(async (searchQuery?: string) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ table: "volunteer_registrations" });
      if (searchQuery) params.set("search", searchQuery);
      const res = await fetch(`/api/admin/data?${params}`);
      if (res.ok) {
        const data = await res.json();
        setRows(data.rows || []);
        setCount(data.count || 0);
      }
    } catch { setRows([]); }
    setLoading(false);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);
  useEffect(() => { const t = setTimeout(() => fetchData(search), 300); return () => clearTimeout(t); }, [search, fetchData]);

  const exportCSV = () => {
    if (!rows.length) return;
    const csv = ["Name,Email,Phone,Shifts,Total Hours,Reward,Signed Up",
      ...rows.map(r => {
        const shifts = resolveShifts(String(r.shift_ids ?? ""));
        const shiftStr = shifts.map(s => `${s.label} (${s.day})`).join(" | ");
        const totalHours = shifts.reduce((sum, s) => sum + s.hours, 0);
        return [r.name, r.email, r.phone ?? "", shiftStr, totalHours,
          rewardLabel(String(r.reward_earned ?? "")), r.created_at]
          .map(v => `"${String(v ?? "").replace(/"/g, '""')}"`).join(",");
      })].join("\n");
    const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    a.download = `volunteers_${new Date().toISOString().slice(0,10)}.csv`; a.click();
  };

  const resolveShifts = (shiftIdsStr: string) =>
    String(shiftIdsStr ?? "").split(",").filter(Boolean).map((id: string) => {
      const s = SHIFT_MAP[id.trim()];
      return s ? { id: id.trim(), label: s.role, day: s.day, date: s.date, hours: s.hours, phase: s.phase }
               : { id: id.trim(), label: id.trim(), day: "?", date: "", hours: 0, phase: "during" as const };
    });

  const rewardLabel = (r: string) =>
    r === "lodging" ? "Comped Lodging" : r === "weekend_pass" ? "Weekend Pass" : r === "day_pass" ? "Day Pass" : r || "—";
  const rewardAccent = (r: string) =>
    r === "lodging" ? "#D4AF3C" : r === "weekend_pass" ? "#3DB8AF" : "#8B5FBF";

  // Build shift-roster: map each shift to the volunteers signed up for it
  const shiftRoster = (() => {
    const byShift: Record<string, { shift: ReturnType<typeof resolveShifts>[0]; volunteers: Array<{ name: string; email: string; phone: string }> }> = {};
    for (const row of rows) {
      const shifts = resolveShifts(String(row.shift_ids ?? ""));
      for (const s of shifts) {
        if (!byShift[s.id]) byShift[s.id] = { shift: s, volunteers: [] };
        byShift[s.id].volunteers.push({ name: String(row.name ?? ""), email: String(row.email ?? ""), phone: String(row.phone ?? "") });
      }
    }
    // Sort by date then shift_id
    return Object.values(byShift).sort((a, b) => {
      const dateCmp = a.shift.date.localeCompare(b.shift.date);
      return dateCmp !== 0 ? dateCmp : a.shift.id.localeCompare(b.shift.id);
    });
  })();

  const subTabStyle = (active: boolean): React.CSSProperties => ({
    padding: "0.4rem 1rem", borderRadius: "8px", border: "none", cursor: "pointer",
    fontSize: "0.8rem", fontFamily: "inherit", fontWeight: active ? 600 : 400,
    background: active ? "rgba(42,157,143,0.15)" : "transparent",
    color: active ? "#2a9d8f" : "var(--ink-muted)",
  });

  const dayColor: Record<string, string> = {
    Thursday: "#7a52b0", Friday: "#2a9d8f", Saturday: "#C9983F", Sunday: "#3b82f6",
  };

  return (
    <>
      {/* Screen-only toolbar */}
      <div className="admin-toolbar no-print">
        <div className="admin-toolbar-left">
          <span className="admin-count">{count} volunteers</span>
          <button style={subTabStyle(view === "by-person")} onClick={() => setView("by-person")}>By Person</button>
          <button style={subTabStyle(view === "by-shift")}  onClick={() => setView("by-shift")}>By Shift</button>
          {view === "by-person" && (
            <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by email…" className="admin-search" />
          )}
        </div>
        <div className="admin-toolbar-right">
          <button onClick={() => fetchData(search)} className="admin-refresh-btn">Refresh</button>
          <button onClick={exportCSV} className="admin-export-btn" disabled={!rows.length}>Export CSV</button>
          <button onClick={() => window.print()} className="admin-refresh-btn" style={{ borderColor: "#7a52b0", color: "#7a52b0" }}>Print</button>
        </div>
      </div>

      {loading ? (
        <div className="admin-loading">Loading…</div>
      ) : rows.length === 0 ? (
        <div className="admin-empty">No volunteer registrations yet</div>
      ) : view === "by-person" ? (
        /* ── BY PERSON VIEW ── */
        <>
          <div className="print-header">
            <strong>Wellness Weekend 2026 · Volunteer Roster</strong>
            <span>{count} volunteers · Printed {new Date().toLocaleDateString()}</span>
          </div>
          <div className="admin-table-wrap">
            <table className="admin-table volunteer-print-table">
              <thead>
                <tr>
                  <th>#</th><th>Name</th><th>Phone</th><th>Email</th>
                  <th>Assigned Shifts</th><th>Total Hrs</th><th>Reward</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, i) => {
                  const shifts = resolveShifts(String(row.shift_ids ?? ""));
                  const totalHours = shifts.reduce((sum, s) => sum + s.hours, 0);
                  const reward = String(row.reward_earned ?? "");
                  const isSelected = selectedRow === row;
                  return (
                    <tr key={i} onClick={() => setSelectedRow(isSelected ? null : row)}
                      style={{ cursor: "pointer", background: isSelected ? "rgba(139,95,191,0.07)" : undefined }}>
                      <td style={{ color: "var(--ink-muted)", width: "2rem" }}>{i + 1}</td>
                      <td style={{ fontWeight: 600 }}>{String(row.name ?? "—")}</td>
                      <td>{String(row.phone ?? "—")}</td>
                      <td style={{ fontSize: "0.78rem" }}>{String(row.email ?? "—")}</td>
                      <td>
                        <div style={{ display: "flex", flexDirection: "column", gap: "1px" }}>
                          {shifts.map(s => (
                            <span key={s.id} style={{ fontSize: "0.78rem" }}>
                              <span style={{ color: dayColor[s.day] ?? "var(--ink-muted)", fontWeight: 600, marginRight: "4px" }}>{s.day}</span>
                              {s.label}
                              <span style={{ color: "var(--ink-muted)", marginLeft: "4px" }}>({s.hours}h)</span>
                            </span>
                          ))}
                        </div>
                      </td>
                      <td style={{ fontWeight: 700, textAlign: "center" }}>{totalHours}h</td>
                      <td>
                        {reward ? (
                          <span style={{
                            fontSize: "0.72rem", padding: "0.15rem 0.5rem", borderRadius: "4px", fontWeight: 600,
                            background: `${rewardAccent(reward)}22`, color: rewardAccent(reward),
                          }}>
                            {rewardLabel(reward)}
                          </span>
                        ) : "—"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {selectedRow && (() => {
            const shifts = resolveShifts(String(selectedRow.shift_ids ?? ""));
            const reward = String(selectedRow.reward_earned ?? "");
            const totalHours = shifts.reduce((sum, s) => sum + s.hours, 0);
            const regId = Number(selectedRow.id);
            return (
              <VolunteerDetailPanel
                key={regId}
                row={selectedRow}
                shifts={shifts}
                reward={reward}
                totalHours={totalHours}
                dayColor={dayColor}
                rewardLabel={rewardLabel}
                rewardAccent={rewardAccent}
                onClose={() => setSelectedRow(null)}
                onDeleted={() => { setSelectedRow(null); fetchData(search); }}
                onUpdated={() => fetchData(search)}
              />
            );
          })()}
        </>
      ) : (
        /* ── BY SHIFT VIEW ── */
        <div style={{ padding: "1.5rem 2rem" }}>
          <div className="print-header">
            <strong>Wellness Weekend 2026 · Volunteer Schedule by Shift</strong>
            <span>Printed {new Date().toLocaleDateString()}</span>
          </div>
          {shiftRoster.length === 0 ? (
            <div className="admin-empty">No shifts claimed yet</div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              {shiftRoster.map(({ shift, volunteers: vols }) => (
                <div key={shift.id} style={{
                  border: "1px solid var(--line-medium)", borderRadius: "10px",
                  overflow: "hidden", breakInside: "avoid",
                }}>
                  <div style={{
                    padding: "0.6rem 1rem", display: "flex", alignItems: "center", gap: "1rem",
                    background: `${dayColor[shift.day] ?? "#888"}18`,
                    borderBottom: `2px solid ${dayColor[shift.day] ?? "#888"}`,
                  }}>
                    <span style={{ fontWeight: 700, color: dayColor[shift.day] ?? "var(--ink)", fontSize: "0.85rem" }}>{shift.day}</span>
                    <span style={{ fontWeight: 700, fontSize: "0.95rem" }}>{shift.label}</span>
                    <span style={{ color: "var(--ink-muted)", fontSize: "0.8rem" }}>{shift.hours}h</span>
                    <span style={{ marginLeft: "auto", fontSize: "0.75rem", color: "var(--ink-muted)" }}>
                      {vols.length} / {SHIFT_MAP[shift.id]?.capacity ?? "?"} filled
                    </span>
                  </div>
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <tbody>
                      {vols.map((v, vi) => (
                        <tr key={vi} style={{ borderBottom: "1px solid var(--line-subtle)" }}>
                          <td style={{ padding: "0.45rem 1rem", width: "2rem", color: "var(--ink-muted)", fontSize: "0.78rem" }}>{vi + 1}</td>
                          <td style={{ padding: "0.45rem 0.5rem", fontWeight: 600, fontSize: "0.88rem" }}>{v.name}</td>
                          <td style={{ padding: "0.45rem 0.5rem", fontSize: "0.82rem" }}>{v.phone || "—"}</td>
                          <td style={{ padding: "0.45rem 1rem", fontSize: "0.78rem", color: "var(--ink-muted)" }}>{v.email}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}

// ── Volunteer Detail Panel ────────────────────────────────────────────

interface VolunteerDetailPanelProps {
  row: Record<string, unknown>;
  shifts: Array<{ id: string; label: string; day: string; date: string; hours: number; phase: string }>;
  reward: string;
  totalHours: number;
  dayColor: Record<string, string>;
  rewardLabel: (r: string) => string;
  rewardAccent: (r: string) => string;
  onClose: () => void;
  onDeleted: () => void;
  onUpdated: () => void;
}

function VolunteerDetailPanel({ row, shifts, reward, totalHours, dayColor, rewardLabel, rewardAccent, onClose, onDeleted, onUpdated }: VolunteerDetailPanelProps) {
  const [editing, setEditing] = useState(false);
  const [editShiftSet, setEditShiftSet] = useState<Set<string>>(() => new Set(shifts.map(s => s.id)));
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  const toggleShift = (id: string) => {
    setEditShiftSet(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const saveShifts = async () => {
    setSaving(true);
    await fetch("/api/admin/data", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ table: "volunteer_registrations", id: row.id, shiftIds: Array.from(editShiftSet) }),
    });
    setSaving(false);
    setEditing(false);
    onUpdated();
  };

  const deleteReg = async () => {
    setDeleting(true);
    await fetch("/api/admin/data", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ table: "volunteer_registrations", id: row.id }),
    });
    onDeleted();
  };

  const shiftGroups = [
    { label: "Thursday · Setup", color: "#7a52b0", shifts: SHIFTS.filter(s => s.day === "Thursday") },
    { label: "Friday · Aug 7", color: "#2a9d8f", shifts: SHIFTS.filter(s => s.day === "Friday") },
    { label: "Saturday · Aug 8", color: "#C9983F", shifts: SHIFTS.filter(s => s.day === "Saturday") },
    { label: "Sunday · During", color: "#3b82f6", shifts: SHIFTS.filter(s => s.day === "Sunday" && s.phase === "during") },
    { label: "Sunday Evening · Teardown", color: "#dc5050", shifts: SHIFTS.filter(s => s.phase === "sunday_evening") },
  ];

  const editHours = SHIFTS.filter(s => editShiftSet.has(s.shift_id)).reduce((sum, s) => sum + s.hours, 0);

  return (
    <div className="admin-detail-panel">
      <div className="admin-detail-header">
        <span className="admin-detail-title">{String(row.name ?? row.email ?? "Volunteer")}</span>
        <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
          <button
            onClick={() => { setEditing(e => !e); setEditShiftSet(new Set(shifts.map(s => s.id))); }}
            style={{ fontSize: "0.78rem", color: editing ? "var(--ink-muted)" : "var(--psyche-cyan)", background: "none", border: "none", cursor: "pointer", padding: 0 }}
          >
            {editing ? "Cancel edit" : "Edit shifts"}
          </button>
          <button className="admin-detail-close" onClick={onClose}>✕ Close</button>
        </div>
      </div>

      <div className="admin-detail-grid">
        {([["name", "Name"], ["email", "Email"], ["phone", "Phone"]] as [string, string][]).map(([key, label]) => {
          const v = String(row[key] ?? "—");
          if (v === "—") return null;
          return (
            <div key={key} className="admin-detail-field">
              <div className="admin-detail-label">{label}</div>
              <div className="admin-detail-value">{v}</div>
            </div>
          );
        })}
        <div className="admin-detail-field">
          <div className="admin-detail-label">Reward</div>
          <div className="admin-detail-value">
            {reward ? (
              <span style={{ fontSize: "0.78rem", padding: "0.15rem 0.5rem", borderRadius: "4px", fontWeight: 600,
                background: `${rewardAccent(reward)}22`, color: rewardAccent(reward) }}>
                {rewardLabel(reward)}
              </span>
            ) : "—"}
          </div>
        </div>
        <div className="admin-detail-field">
          <div className="admin-detail-label">Total Hours</div>
          <div className="admin-detail-value" style={{ fontWeight: 700 }}>{totalHours}h</div>
        </div>
      </div>

      <div style={{ padding: "1rem 1.25rem", borderTop: "1px solid var(--line-subtle)" }}>
        {!editing ? (
          <>
            <div style={{ fontSize: "0.72rem", color: "var(--ink-muted)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: "0.6rem" }}>Assigned Shifts</div>
            {shifts.length === 0 ? (
              <div style={{ color: "var(--ink-muted)", fontSize: "0.85rem" }}>No shifts assigned</div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                {shifts.map(s => (
                  <div key={s.id} style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.85rem" }}>
                    <span style={{ color: dayColor[s.day] ?? "var(--ink-muted)", fontWeight: 600, minWidth: "72px" }}>{s.day}</span>
                    <span>{s.label}</span>
                    <span style={{ color: "var(--ink-muted)", fontSize: "0.75rem" }}>({s.hours}h)</span>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          <>
            <div style={{ fontSize: "0.72rem", color: "var(--ink-muted)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: "0.75rem" }}>
              Edit Shifts — {editHours}h selected
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {shiftGroups.map(group => (
                <div key={group.label}>
                  <div style={{ fontSize: "0.72rem", fontWeight: 700, color: group.color, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "0.35rem" }}>
                    {group.label}
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
                    {group.shifts.map(s => (
                      <label key={s.shift_id} style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontSize: "0.85rem" }}>
                        <input type="checkbox" checked={editShiftSet.has(s.shift_id)} onChange={() => toggleShift(s.shift_id)}
                          style={{ accentColor: group.color, width: "15px", height: "15px" }} />
                        <span>{s.role}</span>
                        <span style={{ color: "var(--ink-muted)", fontSize: "0.75rem" }}>({s.hours}h · cap {s.capacity})</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: "1rem", display: "flex", gap: "0.5rem" }}>
              <button onClick={saveShifts} disabled={saving}
                style={{ fontSize: "0.82rem", padding: "0.4rem 1.1rem", background: "rgba(61,184,175,0.15)", border: "1px solid #3DB8AF", borderRadius: "7px", color: "#3DB8AF", cursor: "pointer", fontFamily: "inherit" }}>
                {saving ? "Saving…" : "Save shifts"}
              </button>
              <button onClick={() => { setEditing(false); setEditShiftSet(new Set(shifts.map(s => s.id))); }}
                style={{ fontSize: "0.82rem", padding: "0.4rem 0.9rem", background: "transparent", border: "1px solid var(--line-medium)", borderRadius: "7px", color: "var(--ink-muted)", cursor: "pointer", fontFamily: "inherit" }}>
                Cancel
              </button>
            </div>
          </>
        )}
      </div>

      <div style={{ padding: "0.75rem 1.25rem", borderTop: "1px solid var(--line-subtle)" }}>
        {deleteConfirm ? (
          <span style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
            <span style={{ fontSize: "0.8rem", color: "#dc5050" }}>Delete this registration permanently?</span>
            <button onClick={deleteReg} disabled={deleting}
              style={{ fontSize: "0.8rem", padding: "0.3rem 0.8rem", background: "#dc5050", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer" }}>
              {deleting ? "…" : "Yes, delete"}
            </button>
            <button onClick={() => setDeleteConfirm(false)}
              style={{ fontSize: "0.8rem", padding: "0.3rem 0.8rem", background: "transparent", border: "1px solid var(--line-medium)", borderRadius: "6px", cursor: "pointer", color: "var(--ink-muted)" }}>
              Cancel
            </button>
          </span>
        ) : (
          <button onClick={() => setDeleteConfirm(true)}
            style={{ fontSize: "0.8rem", color: "#dc5050", background: "none", border: "none", cursor: "pointer", padding: 0 }}>
            Delete registration
          </button>
        )}
      </div>
    </div>
  );
}

// ── Comms / Confirmations Tab ─────────────────────────────────────────

interface AdminTask {
  id: number;
  category: string;
  entity_email: string;
  entity_name: string | null;
  task_label: string;
  completed: boolean;
  completed_at: string | null;
  notes: string | null;
  created_at: string;
}

const COMM_CATEGORIES = [
  { key: "vendor" as const,     label: "Vendors",      table: "vendors",                  nameCol: "name",  emailCol: "email" },
  { key: "volunteer" as const,  label: "Volunteers",   table: "volunteer_registrations",   nameCol: "name",  emailCol: "email" },
  { key: "instructor" as const, label: "Instructors",  table: "instructor_waitlist",       nameCol: "name",  emailCol: "email" },
  { key: "guest" as const,      label: "Guests",       table: "members",                   nameCol: "name",  emailCol: "email" },
];

type CommCatKey = typeof COMM_CATEGORIES[number]["key"];

function CommsTab() {
  const [activeCat, setActiveCat] = useState<CommCatKey>("vendor");
  const [rows, setRows] = useState<Record<string, unknown>[]>([]);
  const [tasks, setTasks] = useState<AdminTask[]>([]);
  const [loading, setLoading] = useState(false);
  const [toggling, setToggling] = useState<string | null>(null);

  const cat = COMM_CATEGORIES.find(c => c.key === activeCat)!;

  const loadAll = useCallback(async () => {
    setLoading(true);
    try {
      const [rowsRes, tasksRes] = await Promise.all([
        fetch(`/api/admin/data?table=${cat.table}`),
        fetch("/api/admin/tasks"),
      ]);
      if (rowsRes.ok) { const d = await rowsRes.json(); setRows(d.rows || []); }
      if (tasksRes.ok) setTasks(await tasksRes.json());
    } finally {
      setLoading(false);
    }
  }, [cat.table]);

  useEffect(() => { loadAll(); }, [loadAll]);

  const toggle = async (email: string, name: string, currentlyDone: boolean) => {
    setToggling(email);
    await fetch("/api/admin/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        category: activeCat,
        entity_email: email,
        entity_name: name,
        task_label: "confirmation_email",
        completed: !currentlyDone,
      }),
    });
    setToggling(null);
    setTasks(prev => {
      const existing = prev.find(t => t.category === activeCat && t.entity_email === email && t.task_label === "confirmation_email");
      if (existing) {
        return prev.map(t => t === existing ? { ...t, completed: !currentlyDone, completed_at: !currentlyDone ? new Date().toISOString() : null } : t);
      }
      return [...prev, {
        id: Date.now(), category: activeCat, entity_email: email, entity_name: name,
        task_label: "confirmation_email", completed: !currentlyDone,
        completed_at: !currentlyDone ? new Date().toISOString() : null,
        notes: null, created_at: new Date().toISOString(),
      }];
    });
  };

  const getTask = (email: string) =>
    tasks.find(t => t.category === activeCat && t.entity_email === email && t.task_label === "confirmation_email");

  const sentCount = rows.filter(r => getTask(String(r[cat.emailCol] ?? ""))?.completed).length;

  const subTabStyle = (active: boolean): React.CSSProperties => ({
    padding: "0.4rem 1rem", borderRadius: "8px", border: "none", cursor: "pointer",
    fontSize: "0.8rem", fontFamily: "inherit", fontWeight: active ? 600 : 400,
    background: active ? "rgba(212,175,60,0.15)" : "transparent",
    color: active ? "#D4AF3C" : "var(--ink-muted)",
  });

  return (
    <div style={{ padding: "1.5rem 2rem" }}>
      <div style={{ marginBottom: "1.25rem" }}>
        <h2 style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--ink-muted)", textTransform: "uppercase", letterSpacing: "0.09em", margin: "0 0 0.5rem" }}>
          Confirmation Emails
        </h2>
        <p style={{ fontSize: "0.85rem", color: "var(--ink-muted)", margin: "0 0 1rem" }}>
          Check the box when a confirmation email is sent. This is saved to the database so you can track across sessions.
        </p>
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", alignItems: "center" }}>
          {COMM_CATEGORIES.map(c => (
            <button key={c.key} style={subTabStyle(activeCat === c.key)} onClick={() => setActiveCat(c.key)}>
              {c.label}
            </button>
          ))}
          <button onClick={loadAll} style={{ marginLeft: "auto", fontSize: "0.78rem", color: "var(--ink-muted)", background: "none", border: "none", cursor: "pointer" }}>
            Refresh
          </button>
        </div>
      </div>

      {loading ? (
        <div className="admin-loading">Loading…</div>
      ) : rows.length === 0 ? (
        <div className="admin-empty">No {cat.label.toLowerCase()} found</div>
      ) : (
        <>
          <div style={{ fontSize: "0.82rem", color: "var(--ink-muted)", marginBottom: "0.75rem", display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <span>{sentCount} / {rows.length} confirmation emails sent</span>
            {sentCount === rows.length && rows.length > 0 && (
              <span style={{ color: "#2a9d8f", fontWeight: 600 }}>✓ All done!</span>
            )}
            {sentCount < rows.length && (
              <span style={{ color: "#C9983F", fontWeight: 600 }}>{rows.length - sentCount} remaining</span>
            )}
          </div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", background: "var(--surface-elevated)", borderRadius: "10px", overflow: "hidden" }}>
              <thead>
                <tr>
                  <th style={hcell}>Name</th>
                  <th style={hcell}>Email</th>
                  <th style={{ ...hcell, textAlign: "center" }}>Confirmation Email Sent</th>
                  <th style={hcell}>Sent At</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, i) => {
                  const email = String(row[cat.emailCol] ?? "");
                  const name = String(row[cat.nameCol] ?? "");
                  const task = getTask(email);
                  const done = task?.completed ?? false;
                  const sentAt = task?.completed_at;
                  const isToggling = toggling === email;
                  return (
                    <tr key={i} style={{ background: done ? "rgba(42,157,143,0.04)" : undefined }}>
                      <td style={{ ...cell, fontWeight: 600 }}>{name || "—"}</td>
                      <td style={cell}>{email}</td>
                      <td style={{ ...cell, textAlign: "center" }}>
                        <label style={{ display: "inline-flex", alignItems: "center", gap: "6px", cursor: "pointer" }}>
                          <input
                            type="checkbox"
                            checked={done}
                            disabled={isToggling}
                            onChange={() => toggle(email, name, done)}
                            style={{ width: "16px", height: "16px", accentColor: "#2a9d8f", cursor: "pointer" }}
                          />
                          <span style={{ fontSize: "0.78rem", color: done ? "#2a9d8f" : "var(--ink-muted)", fontWeight: done ? 600 : 400 }}>
                            {isToggling ? "…" : done ? "Sent" : "Not sent"}
                          </span>
                        </label>
                      </td>
                      <td style={{ ...cell, color: "var(--ink-muted)", fontSize: "0.78rem" }}>
                        {sentAt ? fmtDate(sentAt) : "—"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

// ── Class Reservations Tab ────────────────────────────────────────────

const CLASS_LABELS: Record<string, string> = {
  "aerial-fri-3pm":   "Aerial Silk · Fri 3:00 PM",
  "aerial-fri-extra": "Aerial Silk · Fri 4:30 PM",
  "aerial-sat-10am":  "Aerial Silk · Sat 10:00 AM",
  "aerial-sat-extra": "Aerial Silk · Sat 3:30 PM",
  "aerial-sat-2pm":   "Aerial Silk · Sat 2:00 PM",
  "paddle-fri-2pm":   "Paddleboard Yoga · Fri 2:00 PM",
  "paddle-fri-extra": "Paddleboard Yoga · Fri 3:30 PM",
  "paddle-sat-2pm":   "Paddleboard Yoga · Sat 2:00 PM",
  "paddle-sat-extra": "Paddleboard Yoga · Sat 3:30 PM",
  "sauna-fri-3pm":    "Contrast Therapy · Fri 3:00 PM",
  "sauna-sat-1230pm": "Contrast Therapy · Sat 12:30 PM",
  "sauna-sat-530pm":  "Contrast Therapy · Sat 5:30 PM",
  "sauna-sun-1130am": "Contrast Therapy · Sun 11:30 AM",
};

interface ClassReservation {
  id: number;
  class_key: string;
  attendee_name: string;
  attendee_email: string;
  attendee_phone: string | null;
  booked_at: string;
  payment_verified: boolean;
}

function ClassReservationsTab() {
  const [rows, setRows] = useState<ClassReservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "aerial" | "paddle" | "sauna">("all");
  const [verifying, setVerifying] = useState<number | null>(null);

  async function load() {
    setLoading(true);
    const r = await fetch("/api/admin/class-reservations");
    if (r.ok) { const d = await r.json(); setRows(d.rows); }
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function toggleVerified(id: number, current: boolean) {
    setVerifying(id);
    await fetch("/api/admin/class-reservations", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, payment_verified: !current }),
    });
    setRows(prev => prev.map(r => r.id === id ? { ...r, payment_verified: !current } : r));
    setVerifying(null);
  }

  async function deleteRow(id: number) {
    if (!confirm("Remove this reservation?")) return;
    await fetch("/api/admin/class-reservations", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setRows(prev => prev.filter(r => r.id !== id));
  }

  function exportCSV() {
    const visible = filtered;
    const header = "Class,Name,Email,Booked At,Payment Verified";
    const csvRows = visible.map(r =>
      [CLASS_LABELS[r.class_key] ?? r.class_key, r.attendee_name, r.attendee_email,
       new Date(r.booked_at).toLocaleString(), r.payment_verified ? "Yes" : "No"]
        .map(v => `"${String(v).replace(/"/g, '""')}"`)
        .join(",")
    );
    const blob = new Blob([[header, ...csvRows].join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "class-reservations.csv"; a.click();
    URL.revokeObjectURL(url);
  }

  const filtered = rows.filter(r => {
    if (filter === "aerial") return r.class_key.startsWith("aerial");
    if (filter === "paddle") return r.class_key.startsWith("paddle");
    if (filter === "sauna")  return r.class_key.startsWith("sauna");
    return true;
  });

  const aerialCount  = rows.filter(r => r.class_key.startsWith("aerial")).length;
  const paddleCount  = rows.filter(r => r.class_key.startsWith("paddle")).length;
  const saunaCount   = rows.filter(r => r.class_key.startsWith("sauna")).length;
  const verifiedCount = filtered.filter(r => r.payment_verified).length;

  const filterBtn = (key: typeof filter, label: string, count: number) => (
    <button
      onClick={() => setFilter(key)}
      style={{
        padding: "0.4rem 1rem", borderRadius: "20px", border: "none", cursor: "pointer", fontSize: "0.82rem", fontWeight: 600,
        background: filter === key ? "#D4AF3C" : "rgba(255,255,255,0.08)",
        color: filter === key ? "#0a0a14" : "rgba(255,255,255,0.65)",
      }}
    >
      {label} ({count})
    </button>
  );

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem", flexWrap: "wrap", gap: "0.75rem" }}>
        <div>
          <h2 style={{ fontSize: "1.2rem", fontWeight: 700, margin: 0 }}>Class Reservations</h2>
          {!loading && (
            <p style={{ margin: "0.25rem 0 0", fontSize: "0.85rem", color: "rgba(255,255,255,0.5)" }}>
              {filtered.length} reservations · {verifiedCount} payment verified
            </p>
          )}
        </div>
        <button
          onClick={exportCSV}
          style={{ padding: "0.45rem 1rem", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.2)", background: "transparent", color: "rgba(255,255,255,0.7)", cursor: "pointer", fontSize: "0.82rem" }}
        >
          Export CSV
        </button>
      </div>

      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.25rem", flexWrap: "wrap" }}>
        {filterBtn("all",    "All",             rows.length)}
        {filterBtn("aerial", "Aerial Silk",      aerialCount)}
        {filterBtn("paddle", "Paddleboard Yoga", paddleCount)}
        {filterBtn("sauna",  "Contrast Therapy", saunaCount)}
      </div>

      {loading ? (
        <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.875rem" }}>Loading…</p>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: "3rem 1rem", color: "rgba(255,255,255,0.35)", border: "1px dashed rgba(255,255,255,0.1)", borderRadius: "12px" }}>
          <p style={{ margin: 0 }}>No reservations yet.</p>
        </div>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
                {["Paid ✓", "Name", "Email / Phone", "Class", "Booked", ""].map(h => (
                  <th key={h} style={{ padding: "0.5rem 0.75rem", textAlign: "left", color: "rgba(255,255,255,0.4)", fontWeight: 600, fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.05em", whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(r => (
                <tr key={r.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)", background: r.payment_verified ? "rgba(134,239,172,0.04)" : "transparent" }}>
                  <td style={{ padding: "0.75rem" }}>
                    <button
                      onClick={() => toggleVerified(r.id, r.payment_verified)}
                      disabled={verifying === r.id}
                      title={r.payment_verified ? "Mark as not paid" : "Mark as payment verified"}
                      style={{
                        width: 26, height: 26, borderRadius: 6, border: `2px solid ${r.payment_verified ? "#86efac" : "rgba(255,255,255,0.25)"}`,
                        background: r.payment_verified ? "#86efac" : "transparent",
                        cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                        color: "#0a0a14", fontWeight: 700, fontSize: "0.85rem", flexShrink: 0,
                        opacity: verifying === r.id ? 0.5 : 1,
                      }}
                    >
                      {r.payment_verified ? "✓" : ""}
                    </button>
                  </td>
                  <td style={{ padding: "0.75rem", color: "#fff", fontWeight: 600, whiteSpace: "nowrap" }}>{r.attendee_name}</td>
                  <td style={{ padding: "0.75rem" }}>
                    <a href={`mailto:${r.attendee_email}`} style={{ display: "block", color: "#D4AF3C", textDecoration: "none", fontSize: "0.85rem" }}>{r.attendee_email}</a>
                    {r.attendee_phone && <a href={`tel:${r.attendee_phone}`} style={{ display: "block", color: "rgba(255,255,255,0.5)", textDecoration: "none", fontSize: "0.8rem", marginTop: 2 }}>{r.attendee_phone}</a>}
                  </td>
                  <td style={{ padding: "0.75rem", color: "rgba(255,255,255,0.75)", whiteSpace: "nowrap" }}>
                    <span style={{
                      display: "inline-block", padding: "0.15rem 0.55rem", borderRadius: "20px", fontSize: "0.75rem", fontWeight: 600,
                      background: r.class_key.startsWith("aerial") ? "rgba(167,139,250,0.15)" : r.class_key.startsWith("paddle") ? "rgba(56,189,248,0.15)" : "rgba(251,146,60,0.15)",
                      color: r.class_key.startsWith("aerial") ? "#a78bfa" : r.class_key.startsWith("paddle") ? "#38bdf8" : "#fb923c",
                    }}>
                      {CLASS_LABELS[r.class_key] ?? r.class_key}
                    </span>
                  </td>
                  <td style={{ padding: "0.75rem", color: "rgba(255,255,255,0.4)", fontSize: "0.8rem", whiteSpace: "nowrap" }}>
                    {new Date(r.booked_at).toLocaleDateString()}
                  </td>
                  <td style={{ padding: "0.75rem" }}>
                    <button
                      onClick={() => deleteRow(r.id)}
                      style={{ padding: "0.2rem 0.55rem", borderRadius: "5px", border: "1px solid rgba(248,113,113,0.3)", background: "transparent", color: "#f87171", cursor: "pointer", fontSize: "0.72rem" }}
                    >
                      Remove
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

// ── Partner Codes Tab ─────────────────────────────────────────────────

interface PartnerCode {
  id: number;
  code: string;
  partner_name: string;
  partner_email: string | null;
  benefit: string;
  max_uses: number;
  use_count: number;
  active: boolean;
  created_at: string;
}

interface PartnerCodeUse {
  code_id: number;
  redeemer_name: string;
  redeemer_email: string;
  used_at: string;
}

function PartnerCodesTab() {
  const [codes, setCodes] = useState<PartnerCode[]>([]);
  const [uses, setUses] = useState<PartnerCodeUse[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<number | null>(null);

  // Create form
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newCode, setNewCode] = useState("");
  const [newBenefit, setNewBenefit] = useState("Complimentary Wellness Weekend 2026 access");
  const [newMaxUses, setNewMaxUses] = useState("5");
  const [creating, setCreating] = useState(false);
  const [createMsg, setCreateMsg] = useState("");
  const [showForm, setShowForm] = useState(false);

  function suggestCode(name: string) {
    return name.trim().toUpperCase().replace(/\s+/g, "-").replace(/[^A-Z0-9-]/g, "").slice(0, 20) + "-WW26";
  }

  async function load() {
    setLoading(true);
    const r = await fetch("/api/admin/partner-codes");
    if (r.ok) { const d = await r.json(); setCodes(d.codes); setUses(d.uses); }
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function createCode(e: React.FormEvent) {
    e.preventDefault();
    setCreating(true); setCreateMsg("");
    const r = await fetch("/api/admin/partner-codes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: newCode, partner_name: newName, partner_email: newEmail, benefit: newBenefit, max_uses: Number(newMaxUses) }),
    });
    const d = await r.json();
    if (r.ok) {
      setCreateMsg(`Created code "${d.row.code}" for ${d.row.partner_name}`);
      setNewName(""); setNewEmail(""); setNewCode(""); setNewMaxUses("5");
      setShowForm(false);
      await load();
    } else {
      setCreateMsg(d.error || "Failed to create");
    }
    setCreating(false);
  }

  async function toggleActive(id: number, active: boolean) {
    await fetch("/api/admin/partner-codes", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, active }) });
    await load();
  }

  async function deleteCode(id: number) {
    if (!confirm("Delete this partner code and all its use history?")) return;
    await fetch("/api/admin/partner-codes", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    await load();
  }

  const usesFor = (id: number) => uses.filter(u => u.code_id === id);

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem", flexWrap: "wrap", gap: "0.75rem" }}>
        <div>
          <h2 style={{ fontSize: "1.2rem", fontWeight: 700, margin: 0 }}>Partner Codes</h2>
          {codes.length > 0 && (
            <p style={{ margin: "0.25rem 0 0", fontSize: "0.85rem", color: "rgba(255,255,255,0.5)" }}>
              {codes.length} codes · {uses.length} total redemptions · Share link: <code style={{ color: "#86efac", fontSize: "0.8rem" }}>/partner</code>
            </p>
          )}
        </div>
        <button
          onClick={() => setShowForm(f => !f)}
          style={{ padding: "0.55rem 1.25rem", borderRadius: "8px", border: "none", cursor: "pointer", background: "#86efac", color: "#0a0a14", fontWeight: 700, fontSize: "0.85rem" }}
        >
          {showForm ? "Cancel" : "+ New Code"}
        </button>
      </div>

      {createMsg && (
        <p style={{ fontSize: "0.85rem", marginBottom: "1rem", color: createMsg.startsWith("Created") ? "#86efac" : "#f87171" }}>{createMsg}</p>
      )}

      {showForm && (
        <form onSubmit={createCode} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", padding: "1.25rem", marginBottom: "1.5rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          <p style={{ margin: 0, fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "rgba(255,255,255,0.4)", fontWeight: 600 }}>New Partner Code</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.65rem" }}>
            <input
              required placeholder="Partner name *" value={newName}
              onChange={e => { setNewName(e.target.value); if (!newCode) setNewCode(suggestCode(e.target.value)); }}
              style={smallInput}
            />
            <input
              placeholder="Partner email" value={newEmail}
              onChange={e => setNewEmail(e.target.value)}
              style={smallInput}
            />
            <input
              required placeholder="Code * (e.g. ALICE-WW26)" value={newCode}
              onChange={e => setNewCode(e.target.value.toUpperCase())}
              style={{ ...smallInput, fontFamily: "monospace", letterSpacing: "0.08em" }}
            />
            <input
              type="number" placeholder="Max uses" value={newMaxUses} min={1} max={100}
              onChange={e => setNewMaxUses(e.target.value)}
              style={smallInput}
            />
          </div>
          <input
            placeholder="Benefit description" value={newBenefit}
            onChange={e => setNewBenefit(e.target.value)}
            style={smallInput}
          />
          <button
            type="submit" disabled={creating}
            style={{ alignSelf: "flex-start", padding: "0.5rem 1.25rem", borderRadius: "8px", border: "none", cursor: "pointer", background: "#86efac", color: "#0a0a14", fontWeight: 700, fontSize: "0.85rem", opacity: creating ? 0.6 : 1 }}
          >
            {creating ? "Creating…" : "Create Code"}
          </button>
        </form>
      )}

      {loading ? (
        <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.875rem" }}>Loading…</p>
      ) : codes.length === 0 ? (
        <div style={{ textAlign: "center", padding: "3rem 1rem", color: "rgba(255,255,255,0.35)", border: "1px dashed rgba(255,255,255,0.1)", borderRadius: "12px" }}>
          <p style={{ margin: 0, fontSize: "0.95rem" }}>No partner codes yet. Click "+ New Code" to create one.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {codes.map(c => {
            const codeUses = usesFor(c.id);
            const pct = Math.round((c.use_count / c.max_uses) * 100);
            const isExpanded = expanded === c.id;
            return (
              <div key={c.id} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)", borderRadius: "12px", padding: "1rem 1.25rem" }}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap" }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.25rem" }}>
                      <code style={{ fontSize: "1rem", fontWeight: 700, color: "#86efac", letterSpacing: "0.1em" }}>{c.code}</code>
                      <span style={{ fontSize: "0.75rem", padding: "0.15rem 0.5rem", borderRadius: "20px", fontWeight: 600, background: c.active ? "rgba(134,239,172,0.12)" : "rgba(248,113,113,0.12)", color: c.active ? "#86efac" : "#f87171" }}>
                        {c.active ? "Active" : "Inactive"}
                      </span>
                    </div>
                    <p style={{ margin: 0, fontSize: "0.9rem", color: "#fff", fontWeight: 600 }}>{c.partner_name}</p>
                    {c.partner_email && <p style={{ margin: "0.1rem 0 0", fontSize: "0.8rem", color: "rgba(255,255,255,0.45)" }}>{c.partner_email}</p>}
                    <p style={{ margin: "0.4rem 0 0", fontSize: "0.8rem", color: "rgba(255,255,255,0.55)" }}>{c.benefit}</p>
                  </div>

                  <div style={{ textAlign: "right", minWidth: 90 }}>
                    <p style={{ margin: 0, fontWeight: 700, fontSize: "1rem", color: c.use_count >= c.max_uses ? "#f87171" : "#fff" }}>
                      {c.use_count} / {c.max_uses}
                    </p>
                    <div style={{ height: 4, borderRadius: 2, background: "rgba(255,255,255,0.1)", marginTop: "0.35rem" }}>
                      <div style={{ height: "100%", borderRadius: 2, width: `${pct}%`, background: pct >= 100 ? "#f87171" : "#86efac" }} />
                    </div>
                    <p style={{ margin: "0.2rem 0 0", fontSize: "0.7rem", color: "rgba(255,255,255,0.35)" }}>used</p>
                  </div>
                </div>

                <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.85rem", flexWrap: "wrap" }}>
                  {codeUses.length > 0 && (
                    <button
                      onClick={() => setExpanded(isExpanded ? null : c.id)}
                      style={{ padding: "0.3rem 0.7rem", borderRadius: "6px", border: "1px solid rgba(255,255,255,0.15)", background: "transparent", color: "rgba(255,255,255,0.6)", cursor: "pointer", fontSize: "0.75rem" }}
                    >
                      {isExpanded ? "Hide" : "Show"} {codeUses.length} redemption{codeUses.length !== 1 ? "s" : ""}
                    </button>
                  )}
                  <button
                    onClick={() => toggleActive(c.id, !c.active)}
                    style={{ padding: "0.3rem 0.7rem", borderRadius: "6px", border: "1px solid rgba(255,255,255,0.15)", background: "transparent", color: "rgba(255,255,255,0.6)", cursor: "pointer", fontSize: "0.75rem" }}
                  >
                    {c.active ? "Deactivate" : "Reactivate"}
                  </button>
                  <button
                    onClick={() => deleteCode(c.id)}
                    style={{ padding: "0.3rem 0.7rem", borderRadius: "6px", border: "1px solid rgba(248,113,113,0.3)", background: "transparent", color: "#f87171", cursor: "pointer", fontSize: "0.75rem" }}
                  >
                    Delete
                  </button>
                </div>

                {isExpanded && codeUses.length > 0 && (
                  <div style={{ marginTop: "0.85rem", borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: "0.85rem" }}>
                    {codeUses.map((u, i) => (
                      <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", padding: "0.3rem 0", borderBottom: i < codeUses.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none" }}>
                        <span style={{ color: "#fff" }}>{u.redeemer_name}</span>
                        <span style={{ color: "rgba(255,255,255,0.45)" }}>{u.redeemer_email}</span>
                        <span style={{ color: "rgba(255,255,255,0.3)", whiteSpace: "nowrap" }}>{new Date(u.used_at).toLocaleDateString()}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

const smallInput: React.CSSProperties = {
  padding: "0.65rem 0.85rem", borderRadius: "8px",
  background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)",
  color: "#fff", fontSize: "0.875rem", outline: "none", width: "100%", boxSizing: "border-box",
};

// ── Giveaway Tab ──────────────────────────────────────────────────────

interface GiveawayPrize {
  id: number;
  code: string;
  prize_name: string;
  prize_description: string;
  claimed: boolean;
  claimed_by_name: string | null;
  claimed_by_email: string | null;
  claimed_by_phone: string | null;
  claimed_at: string | null;
  created_at: string;
}

function GiveawayTab() {
  const [prizes, setPrizes] = useState<GiveawayPrize[]>([]);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const [seedMsg, setSeedMsg] = useState("");
  const [copied, setCopied] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    const r = await fetch("/api/admin/giveaway");
    if (r.ok) { const d = await r.json(); setPrizes(d.rows); }
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function seedPrizes() {
    setSeeding(true); setSeedMsg("");
    const r = await fetch("/api/admin/giveaway", { method: "POST" });
    const d = await r.json();
    if (r.ok) { setSeedMsg(`Generated ${d.inserted.length} codes!`); await load(); }
    else setSeedMsg(d.error || "Failed to seed");
    setSeeding(false);
  }

  async function resetPrize(id: number) {
    await fetch("/api/admin/giveaway", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    await load();
  }

  function copyCode(code: string) {
    navigator.clipboard.writeText(code);
    setCopied(code);
    setTimeout(() => setCopied(null), 1500);
  }

  const claimed = prizes.filter(p => p.claimed).length;

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem", flexWrap: "wrap", gap: "0.75rem" }}>
        <div>
          <h2 style={{ fontSize: "1.2rem", fontWeight: 700, margin: 0 }}>Giveaway Prizes</h2>
          {prizes.length > 0 && (
            <p style={{ margin: "0.25rem 0 0", fontSize: "0.85rem", color: "rgba(255,255,255,0.5)" }}>
              {claimed} / {prizes.length} claimed
            </p>
          )}
        </div>
        <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
          {seedMsg && <span style={{ fontSize: "0.85rem", color: prizes.length > 0 ? "#f87171" : "#86efac" }}>{seedMsg}</span>}
          {prizes.length === 0 && (
            <button
              onClick={seedPrizes} disabled={seeding}
              style={{ padding: "0.55rem 1.25rem", borderRadius: "8px", border: "none", cursor: "pointer", background: "#D4AF3C", color: "#0a0a14", fontWeight: 700, fontSize: "0.85rem", opacity: seeding ? 0.6 : 1 }}
            >
              {seeding ? "Generating…" : "Generate Codes"}
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.875rem" }}>Loading…</p>
      ) : prizes.length === 0 ? (
        <div style={{ textAlign: "center", padding: "3rem 1rem", color: "rgba(255,255,255,0.35)", border: "1px dashed rgba(255,255,255,0.1)", borderRadius: "12px" }}>
          <p style={{ margin: 0, fontSize: "0.95rem" }}>No prizes yet. Click "Generate Codes" to create the 8 giveaway prizes.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {prizes.map(p => (
            <div key={p.id} style={{
              background: p.claimed ? "rgba(212,175,60,0.06)" : "rgba(255,255,255,0.03)",
              border: `1px solid ${p.claimed ? "rgba(212,175,60,0.2)" : "rgba(255,255,255,0.08)"}`,
              borderRadius: 12, padding: "1rem 1.25rem",
              display: "grid", gridTemplateColumns: "1fr auto", gap: "0.5rem 1.5rem", alignItems: "start",
            }}>
              {/* Left: prize + code */}
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.65rem", marginBottom: "0.25rem", flexWrap: "wrap" }}>
                  <span style={{ fontWeight: 700, color: "#fff", fontSize: "0.95rem" }}>{p.prize_name}</span>
                  <span style={{ padding: "0.15rem 0.55rem", borderRadius: 20, fontSize: "0.72rem", fontWeight: 600, background: p.claimed ? "rgba(248,113,113,0.15)" : "rgba(134,239,172,0.15)", color: p.claimed ? "#f87171" : "#86efac" }}>
                    {p.claimed ? "Claimed" : "Available"}
                  </span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: p.claimed ? "0.85rem" : 0 }}>
                  <code style={{ fontFamily: "monospace", fontSize: "0.85rem", color: "#D4AF3C", letterSpacing: "0.1em" }}>{p.code}</code>
                  <button onClick={() => copyCode(p.code)} style={{ padding: "0.15rem 0.45rem", borderRadius: 4, border: "1px solid rgba(255,255,255,0.15)", background: "transparent", color: copied === p.code ? "#86efac" : "rgba(255,255,255,0.45)", cursor: "pointer", fontSize: "0.68rem" }}>
                    {copied === p.code ? "Copied!" : "Copy"}
                  </button>
                </div>

                {/* Contact card — only when claimed */}
                {p.claimed && p.claimed_by_name && (
                  <div style={{ background: "rgba(0,0,0,0.25)", borderRadius: 8, padding: "0.75rem 1rem", display: "grid", gap: "0.35rem" }}>
                    <div style={{ display: "flex", alignItems: "baseline", gap: "0.5rem" }}>
                      <span style={{ fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "rgba(255,255,255,0.35)", fontWeight: 600, minWidth: 38 }}>Name</span>
                      <span style={{ color: "#fff", fontWeight: 700, fontSize: "0.95rem" }}>{p.claimed_by_name}</span>
                    </div>
                    {p.claimed_by_email && (
                      <div style={{ display: "flex", alignItems: "baseline", gap: "0.5rem" }}>
                        <span style={{ fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "rgba(255,255,255,0.35)", fontWeight: 600, minWidth: 38 }}>Email</span>
                        <a href={`mailto:${p.claimed_by_email}`} style={{ color: "#D4AF3C", fontSize: "0.88rem", textDecoration: "none", fontWeight: 500 }}>{p.claimed_by_email}</a>
                      </div>
                    )}
                    {p.claimed_by_phone && (
                      <div style={{ display: "flex", alignItems: "baseline", gap: "0.5rem" }}>
                        <span style={{ fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "rgba(255,255,255,0.35)", fontWeight: 600, minWidth: 38 }}>Phone</span>
                        <a href={`tel:${p.claimed_by_phone}`} style={{ color: "#D4AF3C", fontSize: "0.88rem", textDecoration: "none", fontWeight: 500 }}>{p.claimed_by_phone}</a>
                      </div>
                    )}
                    {!p.claimed_by_phone && (
                      <div style={{ display: "flex", alignItems: "baseline", gap: "0.5rem" }}>
                        <span style={{ fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "rgba(255,255,255,0.35)", fontWeight: 600, minWidth: 38 }}>Phone</span>
                        <span style={{ color: "rgba(255,255,255,0.25)", fontSize: "0.82rem", fontStyle: "italic" }}>not collected</span>
                      </div>
                    )}
                    <div style={{ display: "flex", alignItems: "baseline", gap: "0.5rem" }}>
                      <span style={{ fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "rgba(255,255,255,0.35)", fontWeight: 600, minWidth: 38 }}>Date</span>
                      <span style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.82rem" }}>{p.claimed_at ? new Date(p.claimed_at).toLocaleString() : "—"}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Right: reset button */}
              <div>
                {p.claimed && (
                  <button onClick={() => resetPrize(p.id)} style={{ padding: "0.25rem 0.65rem", borderRadius: 6, border: "1px solid rgba(248,113,113,0.3)", background: "transparent", color: "#f87171", cursor: "pointer", fontSize: "0.75rem", whiteSpace: "nowrap" }}>
                    Reset
                  </button>
                )}
              </div>
            </div>
          ))}
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
  const roleLabel = role === "owner" ? "Owner" : role === "alice" ? "Alice" : role === "chris" ? "Chris" : role === "ashleigh" ? "Ashleigh" : "Staff";

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
        {tab("guest_list", "Guest List")}
        {tab("budget", "Budget", true)}

        <span className="admin-tab-sep" />

        {tab("affiliates", "Affiliates")}
        {tab("referral_events", "Referrals")}
        {tab("newsletter", "Newsletter")}
        {tab("leads", "Leads")}

        <span className="admin-tab-sep" />

        {tab("vendor_agreements", "Agreements")}
        {tab("vendors", "Vendors")}
        {tab("volunteers", "Vol. Interest")}
        {tab("volunteer_registrations", "Vol. Signups")}
        {tab("warriors", "Warriors")}
        {tab("staff_registrations", "Staff")}
        {tab("staff_guests", "Staff Guests")}
        {tab("class_reservations", "Classes")}
        {tab("contrast_bookings", "Contrast Therapy")}
        {tab("massage_bookings", "Massage")}
        {tab("aerial_bookings", "Aerial / Silk")}
        {tab("paddleboard_bookings", "Paddleboard")}
        {tab("instructor_waitlist", "Instructors")}
        {tab("sponsors", "Sponsors")}
        {tab("giveaway", "Giveaway")}
        {tab("partner_codes", "Partners")}

        <span className="admin-tab-sep" />

        {tab("confirmations", "Confirmations")}
      </div>

      {/* Tab content */}
      {activeTab === "overview"            && <OverviewTab />}
      {activeTab === "guest_list"           && <GuestListTab />}
      {activeTab === "budget"              && canSeeFinancials && <BudgetTab />}
      {activeTab === "affiliates"          && <AffiliatesTab />}
      {activeTab === "referral_events"     && <DataTab tableKey="referral_events"    columns={["id","affiliate_code","event_type","order_id","order_amount_cents","commission_cents","created_at"]} />}
      {activeTab === "newsletter"          && <DataTab tableKey="newsletter"          columns={["id","email","created_at"]} />}
      {activeTab === "leads"               && <DataTab tableKey="leads"               columns={["id","name","email","phone","message","source","created_at"]} />}
      {activeTab === "vendor_agreements"   && <VendorAgreementsTab />}
      {activeTab === "vendors"             && <DataTab tableKey="vendors"             columns={["id","name","email","business","category","description","created_at"]} />}
      {activeTab === "volunteers"               && <DataTab tableKey="volunteers"               columns={["id","name","email","phone","interest","experience","availability","created_at"]} />}
      {activeTab === "volunteer_registrations"  && <VolunteerRegistrationsTab />}
      {activeTab === "warriors"                 && <DataTab tableKey="warriors"                 columns={["id","name","email","family_size","beds_needed","created_at"]} />}
      {activeTab === "staff_registrations"      && <DataTab tableKey="staff_registrations"      columns={["id","name","email","phone","role","emergency_contact_name","emergency_contact_phone","dietary_needs","ticket_code","created_at"]} />}
      {activeTab === "staff_guests"             && <DataTab tableKey="staff_guests"             columns={["id","staff_ticket_code","staff_name","guest_name","guest_email","ticket_code","created_at"]} />}
      {activeTab === "class_reservations"        && <ClassReservationsTab />}
      {activeTab === "contrast_bookings"        && <DataTab tableKey="contrast_bookings"        columns={["id","name","email","phone","slots","notes","created_at"]} />}
      {activeTab === "massage_bookings"         && <DataTab tableKey="massage_bookings"         columns={["id","name","email","phone","practitioner","slot","session_type","hands","notes","created_at"]} />}
      {activeTab === "aerial_bookings"          && <AerialBookingsTab />}
      {activeTab === "paddleboard_bookings"     && <PaddleboardBookingsTab />}
      {activeTab === "instructor_waitlist"      && <DataTab tableKey="instructor_waitlist"      columns={["id","name","email","phone","modality","years_teaching","interested_in_2026","interested_in_2027","offering","status","created_at"]} statusField="status" />}
      {activeTab === "sponsors"                 && <DataTab tableKey="sponsors"                 columns={["id","name","email","company","budget_range","interests","goals","created_at"]} />}
      {activeTab === "confirmations"            && <CommsTab />}
      {activeTab === "giveaway"                 && <GiveawayTab />}
      {activeTab === "partner_codes"            && <PartnerCodesTab />}
    </div>
  );
}
