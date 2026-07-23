import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { leads, newsletter, vendors, volunteers, sponsors, instructorWaitlist, affiliates, referralEvents, volunteerRegistrations, volunteerShiftClaims, warriors, members } from "@/lib/schema";
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

// PATCH /api/admin/data — update volunteer shift assignments
export async function PATCH(req: NextRequest) {
  if (!isAdminAuthenticated(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { table, id, shiftIds } = await req.json();
  if (table !== "volunteer_registrations" || !id || !Array.isArray(shiftIds)) {
    return NextResponse.json({ error: "Only volunteer_registrations supports PATCH with shiftIds[]" }, { status: 400 });
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
