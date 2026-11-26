import { NextRequest, NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

export const dynamic = "force-dynamic";

const TOTAL_PER_TYPE = 10;
const VALID_TYPES = ["sanctuary", "recovery"] as const;

async function ensureTable() {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) return;
  const raw = neon(dbUrl);
  await raw`
    CREATE TABLE IF NOT EXISTS package_deposits (
      id           SERIAL PRIMARY KEY,
      package_type VARCHAR(20) NOT NULL,
      name         VARCHAR(255) NOT NULL,
      email        VARCHAR(255) NOT NULL,
      phone        VARCHAR(50),
      created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `.catch(() => {});
}

async function getCount(packageType: string) {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) return 0;
  const raw = neon(dbUrl);
  const [{ count }] = await raw`
    SELECT COUNT(*)::int AS count FROM package_deposits WHERE package_type = ${packageType}
  `;
  return Number(count);
}

export async function GET(req: NextRequest) {
  try {
    await ensureTable();
    const type = req.nextUrl.searchParams.get("type") || "sanctuary";
    const claimed = await getCount(type);
    return NextResponse.json({ remaining: TOTAL_PER_TYPE - claimed, total: TOTAL_PER_TYPE, type });
  } catch {
    return NextResponse.json({ error: "Failed to fetch availability" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await ensureTable();
    const { name, email, phone, packageType } = await req.json();
    if (!name || !email || !packageType) {
      return NextResponse.json({ error: "name, email, and packageType are required" }, { status: 400 });
    }
    if (!VALID_TYPES.includes(packageType)) {
      return NextResponse.json({ error: "packageType must be sanctuary or recovery" }, { status: 400 });
    }

    const claimed = await getCount(packageType);
    if (claimed >= TOTAL_PER_TYPE) {
      return NextResponse.json({ error: `All ${packageType} deposit spots are taken` }, { status: 409 });
    }

    const dbUrl = process.env.DATABASE_URL;
    if (!dbUrl) throw new Error("No DATABASE_URL");
    const raw = neon(dbUrl);
    await raw`
      INSERT INTO package_deposits (package_type, name, email, phone)
      VALUES (${packageType}, ${name.trim()}, ${email.trim().toLowerCase()}, ${phone?.trim() || null})
    `;

    return NextResponse.json({ success: true, remaining: TOTAL_PER_TYPE - claimed - 1 });
  } catch {
    return NextResponse.json({ error: "Failed to hold package" }, { status: 500 });
  }
}
