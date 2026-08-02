import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { neon } from "@neondatabase/serverless";
import { leads, newsletter, vendors, volunteers, sponsors, instructorWaitlist, affiliates, referralEvents, volunteerRegistrations, volunteerShiftClaims, warriors, members, staffRegistrations, staffGuests, contrastBookings, massageBookings, aerialBookings, paddleboardBookings } from "@/lib/schema";
import { isAdminAuthenticated } from "@/app/api/admin/auth/route";
import { desc, eq, sql } from "drizzle-orm";
import { SHIFT_MAP, calcReward } from "@/lib/volunteer-shifts";

const TABLES = {
  leads,
  newsletter,
  vendors,
  volunteers,
  sponsors,
  instructor_waitlist: instructorWaitlist,
  affiliates,
  referral_events: referralEvents,
  volunteer_registrations: volunteerRegistrations,
  warriors,
  members,
  staff_registrations: staffRegistrations,
  staff_guests: staffGuests,
  contrast_bookings: contrastBookings,
  massage_bookings: massageBookings,
  aerial_bookings: aerialBookings,
  paddleboard_bookings: paddleboardBookings,
} as const;

type TableName = keyof typeof TABLES;

export async function GET(req: NextRequest) {
  if (!isAdminAuthenticated(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const table = req.nextUrl.searchParams.get("table") as TableName | null;
  const search = req.nextUrl.searchParams.get("search")?.trim().toLowerCase();

  if (!table || !(table in TABLES)) {
    return NextResponse.json(
      { error: `Invalid table. Use: ${Object.keys(TABLES).join(", ")}` },
      { status: 400 }
    );
  }

  // Self-heal: ensure tables exist before querying
  if (process.env.DATABASE_URL) {
    const rawSql = neon(process.env.DATABASE_URL);
    if (table === "warriors") {
      await rawSql`ALTER TABLE warriors ADD COLUMN IF NOT EXISTS phone VARCHAR(50)`.catch(() => {});
    }
    if (table === "contrast_bookings") {
      await rawSql`
        CREATE TABLE IF NOT EXISTS contrast_bookings (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255) NOT NULL,
          phone VARCHAR(50),
          slots TEXT NOT NULL,
          notes TEXT,
          created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
        )
      `.catch(() => {});
    }
    if (table === "aerial_bookings") {
      await rawSql`
        CREATE TABLE IF NOT EXISTS aerial_bookings (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255) NOT NULL,
          phone VARCHAR(50),
          mode VARCHAR(20) NOT NULL,
          slot VARCHAR(50) NOT NULL,
          notes TEXT,
          created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
        )
      `.catch(() => {});
    }
    if (table === "paddleboard_bookings") {
      await rawSql`
        CREATE TABLE IF NOT EXISTS paddleboard_bookings (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255) NOT NULL,
          phone VARCHAR(50),
          slot VARCHAR(50) NOT NULL,
          notes TEXT,
          created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
        )
      `.catch(() => {});
    }
  }

  try {
    const db = getDb();
    const schema = TABLES[table];

    let rows;
    if (search && "email" in schema) {
      rows = await db
        .select()
        .from(schema)
        .where(sql`LOWER(email) LIKE ${`%${search}%`}`)
        .orderBy(desc(schema.createdAt))
        .limit(500);
    } else {
      rows = await db
        .select()
        .from(schema)
        .orderBy(desc(schema.createdAt))
        .limit(500);
    }

    // Drizzle returns camelCase JS keys; normalise to snake_case so every admin tab
    // can address columns by their database names (shift_ids, reward_earned, etc.)
    const toSnake = (s: string) => s.replace(/[A-Z]/g, c => `_${c.toLowerCase()}`);
    let normalised = (rows as Record<string, unknown>[]).map(row =>
      Object.fromEntries(Object.entries(row).map(([k, v]) => [toSnake(k), v]))
    );

    // Strip password hashes
    if (table === "affiliates" || table === "members") {
      normalised = normalised.map(({ password_hash: _ph, ...rest }) => rest);
    }

    return NextResponse.json({ rows: normalised, count: normalised.length });
  } catch (e) {
    console.error("Admin data fetch error:", e);
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
  }
}

// DELETE /api/admin/data — delete a record by table + id
export async function DELETE(req: NextRequest) {
  if (!isAdminAuthenticated(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { table, id } = await req.json();
  if (!table || !(table in TABLES) || !id) {
    return NextResponse.json({ error: "Missing table or id" }, { status: 400 });
  }

  try {
    const db = getDb();
    const schema = TABLES[table as TableName];

    // Cascade: remove shift claims before deleting the registration
    if (table === "volunteer_registrations") {
      await db.delete(volunteerShiftClaims).where(eq(volunteerShiftClaims.registrationId, Number(id)));
    }

    await db.delete(schema).where(eq(schema.id, Number(id)));
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("Admin delete error:", e);
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}

const INSTRUCTOR_STATUSES = ["pending", "staff", "denied", "follow_up_2027"] as const;

// PATCH /api/admin/data — update volunteer shift assignments, or instructor applicant status
export async function PATCH(req: NextRequest) {
  if (!isAdminAuthenticated(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { table, id, shiftIds, status } = await req.json();

  if (table === "instructor_waitlist") {
    if (!id || !INSTRUCTOR_STATUSES.includes(status)) {
      return NextResponse.json(
        { error: `Missing id or invalid status. Use: ${INSTRUCTOR_STATUSES.join(", ")}` },
        { status: 400 }
      );
    }
    const db = getDb();
    await db.update(instructorWaitlist).set({ status }).where(eq(instructorWaitlist.id, Number(id)));
    return NextResponse.json({ ok: true });
  }

  if (table !== "volunteer_registrations" || !id || !Array.isArray(shiftIds)) {
    return NextResponse.json(
      { error: "Only volunteer_registrations supports PATCH with shiftIds[], or instructor_waitlist with status" },
      { status: 400 }
    );
  }

  try {
    const db = getDb();

    // Fetch current email
    const [reg] = await db.select({ email: volunteerRegistrations.email })
      .from(volunteerRegistrations).where(eq(volunteerRegistrations.id, Number(id)));
    if (!reg) return NextResponse.json({ error: "Registration not found" }, { status: 404 });

    const selectedShifts = (shiftIds as string[]).map(sid => SHIFT_MAP[sid]).filter(Boolean);
    const reward = calcReward(selectedShifts);

    await db.update(volunteerRegistrations)
      .set({ shiftIds: (shiftIds as string[]).join(","), rewardEarned: reward.key !== "none" ? reward.key : null })
      .where(eq(volunteerRegistrations.id, Number(id)));

    await db.delete(volunteerShiftClaims).where(eq(volunteerShiftClaims.registrationId, Number(id)));

    if ((shiftIds as string[]).length > 0) {
      await db.insert(volunteerShiftClaims).values(
        (shiftIds as string[]).map(sid => ({ registrationId: Number(id), shiftId: sid, email: reg.email }))
      );
    }

    return NextResponse.json({ ok: true, reward });
  } catch (e) {
    console.error("Admin patch error:", e);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}
