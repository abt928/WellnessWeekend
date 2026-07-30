import { NextRequest, NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";
import { isAdminAuthenticated } from "@/app/api/admin/auth/route";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  if (!isAdminAuthenticated(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) return NextResponse.json({ error: "DATABASE_URL not configured" }, { status: 500 });

  try {
    const sql = neon(dbUrl);

    const [massageRows, contrastRows, orderRows] = await Promise.all([
      sql`SELECT id, name, email, phone, practitioner, slot, session_type, hands, notes, created_at
          FROM massage_bookings ORDER BY created_at ASC`,
      sql`SELECT id, name, email, phone, slots, notes, created_at
          FROM contrast_bookings ORDER BY created_at ASC`,
      sql`SELECT id, customer_email, amount_cents, line_items, created_at
          FROM orders WHERE status = 'completed' ORDER BY created_at DESC LIMIT 500`,
    ]);

    return NextResponse.json({
      massage: massageRows,
      contrast: contrastRows,
      orders: orderRows,
    });
  } catch (e) {
    console.error("[admin/guest-list GET] Error:", e);
    return NextResponse.json({ error: "Failed to fetch guest list" }, { status: 500 });
  }
}
