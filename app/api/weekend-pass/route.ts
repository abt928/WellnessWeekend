import { NextRequest, NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

export const dynamic = "force-dynamic";

const TOTAL = 25;

async function ensureTable() {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) return;
  const raw = neon(dbUrl);
  await raw`
    CREATE TABLE IF NOT EXISTS weekend_pass_claims (
      id         SERIAL PRIMARY KEY,
      name       VARCHAR(255) NOT NULL,
      email      VARCHAR(255) NOT NULL,
      phone      VARCHAR(50),
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `.catch(() => {});
}

async function getCount() {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) return 0;
  const raw = neon(dbUrl);
  const [{ count }] = await raw`SELECT COUNT(*)::int AS count FROM weekend_pass_claims`;
  return Number(count);
}

export async function GET() {
  try {
    await ensureTable();
    const claimed = await getCount();
    return NextResponse.json({ remaining: TOTAL - claimed, total: TOTAL });
  } catch {
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

    const claimed = await getCount();
    if (claimed >= TOTAL) {
      return NextResponse.json({ error: "All Weekend Pass spots have been claimed" }, { status: 409 });
    }

    const dbUrl = process.env.DATABASE_URL;
    if (!dbUrl) throw new Error("No DATABASE_URL");
    const raw = neon(dbUrl);
    await raw`
      INSERT INTO weekend_pass_claims (name, email, phone)
      VALUES (${name.trim()}, ${email.trim().toLowerCase()}, ${phone?.trim() || null})
    `;

    return NextResponse.json({ success: true, remaining: TOTAL - claimed - 1 });
  } catch {
    return NextResponse.json({ error: "Failed to claim pass" }, { status: 500 });
  }
}
