import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/app/api/admin/auth/route";
import { neon } from "@neondatabase/serverless";

export const dynamic = "force-dynamic";

const HEADERS = ["Name", "Email", "Ticket Type", "Add-ons", "Amount", "Date", "Referral Code", "Source"];

export async function GET(req: NextRequest) {
  if (!isAdminAuthenticated(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    return NextResponse.json({ error: "DATABASE_URL not configured" }, { status: 500 });
  }

  try {
    const sql = neon(dbUrl);

    // Ensure customer_name column exists (sync-orders also adds it; this is a safety net)
    await sql`ALTER TABLE orders ADD COLUMN IF NOT EXISTS customer_name VARCHAR(255)`;

    // Fetch completed Square orders
    const orders = await sql`
      SELECT
        id, customer_name, customer_email, line_items,
        amount_cents, referral_code, created_at
      FROM orders
      WHERE status = 'completed'
      ORDER BY created_at DESC
      LIMIT 500
    `;

    // Fetch vendor agreements as attendees (they will be on-site too)
    const vendors = await sql`
      SELECT
        id, vendor_name, contact_name, email,
        space_type, price_cents, payment_status, created_at
      FROM vendor_agreements
      ORDER BY created_at DESC
      LIMIT 200
    `;

    const SPACE_LABELS: Record<string, string> = {
      "1day-10x10": "1 Day 10×10",
      "3day-10x10": "3 Days 10×10",
      "3day-10x20": "3 Days 10×20",
      "sponsor":    "Sponsor",
    };

    const rows: Record<string, string>[] = [];

    // Ticket orders
    for (const o of orders) {
      let lineItems: { name: string; quantity: number; priceCents: number }[] = [];
      try {
        if (o.line_items) lineItems = JSON.parse(String(o.line_items));
      } catch { /* ignore */ }

      const ticketItems = lineItems.filter(li =>
        /pass|ticket|day|weekend|sanctuary|earth|admission/i.test(li.name)
      );
      const addonItems = lineItems.filter(li =>
        !/pass|ticket|day|weekend|sanctuary|earth|admission/i.test(li.name)
      );

      const ticketType = ticketItems.map(li =>
        li.quantity > 1 ? `${li.quantity}× ${li.name}` : li.name
      ).join(", ") || (lineItems[0]?.name ?? "Ticket");

      const addons = addonItems.map(li =>
        li.quantity > 1 ? `${li.quantity}× ${li.name}` : li.name
      ).join(", ");

      const name = String(o.customer_name ?? o.customer_email ?? "—");
      const email = String(o.customer_email ?? "");
      const amount = `$${(Number(o.amount_cents) / 100).toFixed(2)}`;
      const date = new Date(String(o.created_at)).toLocaleDateString("en-US", {
        month: "short", day: "numeric", year: "numeric",
      });

      rows.push({
        Name: name,
        Email: email,
        "Ticket Type": ticketType,
        "Add-ons": addons,
        Amount: amount,
        Date: date,
        "Referral Code": String(o.referral_code ?? ""),
        Source: "ticket",
      });
    }

    // Vendor agreements
    for (const v of vendors) {
      const spaceLabel = SPACE_LABELS[String(v.space_type)] ?? String(v.space_type);
      const amount = Number(v.price_cents) === 0 ? "Free" : `$${(Number(v.price_cents) / 100).toFixed(0)}`;
      const date = new Date(String(v.created_at)).toLocaleDateString("en-US", {
        month: "short", day: "numeric", year: "numeric",
      });
      const name = String(v.vendor_name || v.contact_name || "—");
      const status = String(v.payment_status ?? "pending");

      rows.push({
        Name: name,
        Email: String(v.email ?? ""),
        "Ticket Type": `Vendor — ${spaceLabel}`,
        "Add-ons": status === "confirmed" ? "Confirmed" : "Pending payment",
        Amount: amount,
        Date: date,
        "Referral Code": "",
        Source: "vendor",
      });
    }

    return NextResponse.json({ headers: HEADERS, rows, count: rows.length });
  } catch (e) {
    console.error("[guestlist] error:", e);
    return NextResponse.json({ error: "Failed to build guest list from orders" }, { status: 500 });
  }
}
