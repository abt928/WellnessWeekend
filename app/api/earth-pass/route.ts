import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { earthPassClaims } from "@/lib/schema";
import { sql } from "drizzle-orm";
import { neon } from "@neondatabase/serverless";

export const dynamic = "force-dynamic";

const TOTAL = 10;

// Ensure table exists
async function ensureTable() {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) return;
  const raw = neon(dbUrl);
  await raw`
    CREATE TABLE IF NOT EXISTS earth_pass_claims (
      id         SERIAL PRIMARY KEY,
      name       VARCHAR(255) NOT NULL,
      email      VARCHAR(255) NOT NULL,
      phone      VARCHAR(50),
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;
}

export async function GET() {
  try {
    await ensureTable();
    const db = getDb();
    const [{ claimed }] = await db
      .select({ claimed: sql<number>`coalesce(count(*), 0)` })
      .from(earthPassClaims);
    return NextResponse.json({ remaining: TOTAL - Number(claimed), total: TOTAL });
  } catch (error) {
    console.error("Earth pass GET error:", error);
    return NextResponse.json({ error: "Failed to fetch availability" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await ensureTable();
    const { name, email, phone } = await req.json();
    if (!name || !email) {
      return NextResponse.json({ error: "Name and email are required" }, { status: 400 });
    }

    const db = getDb();
    const [{ claimed }] = await db
      .select({ claimed: sql<number>`coalesce(count(*), 0)` })
      .from(earthPassClaims);

    const remaining = TOTAL - Number(claimed);
    if (remaining <= 0) {
      return NextResponse.json({ error: "All Earth Pass spots have been claimed" }, { status: 409 });
    }

    await db.insert(earthPassClaims).values({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone?.trim() || null,
    });

    return NextResponse.json({ success: true, remaining: remaining - 1 });
  } catch (error) {
    console.error("Earth pass POST error:", error);
    return NextResponse.json({ error: "Failed to claim pass" }, { status: 500 });
  }
}
