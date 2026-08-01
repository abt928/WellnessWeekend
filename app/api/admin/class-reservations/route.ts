import { NextRequest, NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";
import { isAdminAuthenticated } from "@/app/api/admin/auth/route";
import { CLASSES } from "@/app/api/bookings/route";

export const dynamic = "force-dynamic";

async function migrate(sql: ReturnType<typeof neon>) {
  await sql`
    CREATE TABLE IF NOT EXISTS class_reservations (
      id             SERIAL PRIMARY KEY,
      class_key      TEXT NOT NULL,
      attendee_name  TEXT NOT NULL,
      attendee_email TEXT NOT NULL,
      booked_at      TIMESTAMPTZ DEFAULT NOW(),
      UNIQUE (class_key, attendee_email)
    )
  `;
  await sql`ALTER TABLE class_reservations ADD COLUMN IF NOT EXISTS payment_verified BOOLEAN NOT NULL DEFAULT FALSE`;
  await sql`ALTER TABLE class_reservations ADD COLUMN IF NOT EXISTS attendee_phone TEXT`;
}

export async function GET(req: NextRequest) {
  if (!isAdminAuthenticated(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) return NextResponse.json({ error: "DATABASE_URL not configured" }, { status: 500 });

  try {
    const sql = neon(dbUrl);
    await migrate(sql);
    const rows = await sql`
      SELECT id, class_key, attendee_name, attendee_email, attendee_phone, booked_at, payment_verified
      FROM class_reservations ORDER BY class_key, booked_at ASC
    `;
    return NextResponse.json({ rows });
  } catch (e) {
    console.error("[admin/class-reservations GET]", e);
    return NextResponse.json({ error: "Failed to fetch reservations" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  if (!isAdminAuthenticated(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) return NextResponse.json({ error: "DATABASE_URL not configured" }, { status: 500 });

  try {
    const { id, payment_verified } = await req.json();
    if (id == null) return NextResponse.json({ error: "id required" }, { status: 400 });
    const sql = neon(dbUrl);
    await sql`UPDATE class_reservations SET payment_verified = ${Boolean(payment_verified)} WHERE id = ${Number(id)}`;
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[admin/class-reservations PATCH]", e);
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  if (!isAdminAuthenticated(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) return NextResponse.json({ error: "DATABASE_URL not configured" }, { status: 500 });

  try {
    const { id } = await req.json();
    if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
    const sql = neon(dbUrl);
    await sql`DELETE FROM class_reservations WHERE id = ${Number(id)}`;
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[admin/class-reservations DELETE]", e);
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
