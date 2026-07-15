import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { leads, newsletter, vendors, volunteers, sponsors, instructorWaitlist, affiliates, referralEvents } from "@/lib/schema";
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

    // Strip passwordHash from affiliates before sending
    if (table === "affiliates") {
      rows = (rows as Record<string, unknown>[]).map((row) => {
        const sanitized = { ...row };
        delete sanitized.passwordHash;
        return sanitized;
      });
    }

    return NextResponse.json({ rows, count: rows.length });
  } catch (e) {
    console.error("Admin data fetch error:", e);
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
  }
}
