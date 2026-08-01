import { NextRequest, NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";
import { isAdminAuthenticated } from "@/app/api/admin/auth/route";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  if (!isAdminAuthenticated(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) return NextResponse.json({ error: "DATABASE_URL not configured" }, { status: 500 });

  try {
    const sql = neon(dbUrl);

    // Safe migrations for any missing columns
    await sql`ALTER TABLE warriors ADD COLUMN IF NOT EXISTS phone VARCHAR(50)`;
    await sql`ALTER TABLE giveaway_prizes ADD COLUMN IF NOT EXISTS claimed_by_phone VARCHAR(50)`;

    const [warriors, volunteers, staff, giveaway, guests] = await Promise.all([
      sql`SELECT id, name, email, phone, created_at,
               family_size, beds_needed
          FROM warriors ORDER BY created_at DESC`,

      sql`SELECT id, name, email, phone, created_at,
               shifts
          FROM volunteer_registrations ORDER BY created_at DESC`,

      sql`SELECT id, name, email, phone, created_at,
               role
          FROM staff_registrations ORDER BY created_at DESC`,

      sql`SELECT id, claimed_by_name AS name, claimed_by_email AS email, claimed_by_phone AS phone,
               claimed_at AS created_at, prize_name
          FROM giveaway_prizes
          WHERE claimed = TRUE ORDER BY claimed_at DESC`,

      sql`SELECT id, customer_name AS name, customer_email AS email,
               NULL AS phone, created_at,
               amount_cents, line_items
          FROM orders WHERE status = 'completed' ORDER BY created_at DESC LIMIT 500`,
    ]);

    return NextResponse.json({
      warriors: warriors.map(r => ({ ...r, category: "warrior" })),
      volunteers: volunteers.map(r => ({ ...r, category: "volunteer" })),
      staff: staff.map(r => ({ ...r, category: "staff" })),
      giveaway: giveaway.map(r => ({ ...r, category: "giveaway" })),
      guests: guests.map(r => ({ ...r, category: "guest" })),
    });
  } catch (e) {
    console.error("[admin/people GET]", e);
    return NextResponse.json({ error: "Failed to fetch people" }, { status: 500 });
  }
}
