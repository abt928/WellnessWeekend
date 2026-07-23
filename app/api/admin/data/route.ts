import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { leads, newsletter, vendors, volunteers, sponsors, instructorWaitlist, affiliates, referralEvents, volunteerRegistrations, warriors } from "@/lib/schema";
import { isAdminAuthenticated } from "@/app/api/admin/auth/route";
import { desc, sql } from "drizzle-orm";

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

    // Strip passwordHash from affiliates before sending
    if (table === "affiliates") {
      normalised = normalised.map(({ password_hash: _ph, ...rest }) => rest);
    }

    return NextResponse.json({ rows: normalised, count: normalised.length });
  } catch (e) {
    console.error("Admin data fetch error:", e);
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
  }
}
