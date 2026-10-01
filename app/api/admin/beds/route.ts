import { NextRequest, NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";
import { getDb } from "@/lib/db";
import { bedAllocations } from "@/lib/schema";
import { isAdminAuthenticated } from "@/app/api/admin/auth/route";
import { desc, eq } from "drizzle-orm";

const TOTAL_BEDS = 100;
const VALID_CATEGORIES = ["staff", "artist", "sponsor", "package"] as const;

async function ensureTable() {
  if (!process.env.DATABASE_URL) return;
  const rawSql = neon(process.env.DATABASE_URL);
  await rawSql`
    CREATE TABLE IF NOT EXISTS bed_allocations (
      id         SERIAL PRIMARY KEY,
      category   VARCHAR(20)  NOT NULL,
      name       VARCHAR(255) NOT NULL,
      email      VARCHAR(255),
      beds       INTEGER      NOT NULL DEFAULT 1,
      notes      TEXT,
      year       INTEGER      NOT NULL DEFAULT 2027,
      created_at TIMESTAMPTZ  DEFAULT NOW() NOT NULL
    )
  `.catch(() => {});
}

export async function GET(req: NextRequest) {
  if (!isAdminAuthenticated(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await ensureTable();

  const db = getDb();
  const rows = await db.select().from(bedAllocations).orderBy(desc(bedAllocations.createdAt));

  const toSnake = (s: string) => s.replace(/[A-Z]/g, c => `_${c.toLowerCase()}`);
  const normalised = rows.map(row =>
    Object.fromEntries(Object.entries(row).map(([k, v]) => [toSnake(k), v]))
  );

  const summary: Record<string, number> = {};
  let totalAllocated = 0;
  for (const row of rows) {
    summary[row.category] = (summary[row.category] ?? 0) + row.beds;
    totalAllocated += row.beds;
  }

  return NextResponse.json({
    rows: normalised,
    summary,
    totalBeds: TOTAL_BEDS,
    totalAllocated,
    remaining: TOTAL_BEDS - totalAllocated,
  });
}

export async function POST(req: NextRequest) {
  if (!isAdminAuthenticated(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await ensureTable();

  const body = await req.json();
  const { category, name, email, beds, notes, year } = body;

  if (!category || !name || !beds) {
    return NextResponse.json({ error: "category, name, and beds are required" }, { status: 400 });
  }
  if (!VALID_CATEGORIES.includes(category)) {
    return NextResponse.json({ error: `category must be one of: ${VALID_CATEGORIES.join(", ")}` }, { status: 400 });
  }

  const db = getDb();
  const existing = await db.select({ beds: bedAllocations.beds }).from(bedAllocations);
  const usedBeds = existing.reduce((sum, r) => sum + r.beds, 0);
  const bedsNum = Math.max(1, Number(beds));

  if (usedBeds + bedsNum > TOTAL_BEDS) {
    return NextResponse.json(
      { error: `Only ${TOTAL_BEDS - usedBeds} bed${TOTAL_BEDS - usedBeds !== 1 ? "s" : ""} remaining` },
      { status: 400 }
    );
  }

  const [created] = await db.insert(bedAllocations).values({
    category,
    name,
    email: email || null,
    beds: bedsNum,
    notes: notes || null,
    year: year ? Number(year) : 2027,
  }).returning();

  return NextResponse.json({ ok: true, row: created });
}

export async function DELETE(req: NextRequest) {
  if (!isAdminAuthenticated(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

  const db = getDb();
  await db.delete(bedAllocations).where(eq(bedAllocations.id, Number(id)));
  return NextResponse.json({ ok: true });
}
