import { NextRequest, NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";
import { isAdminAuthenticated } from "@/app/api/admin/auth/route";

export const dynamic = "force-dynamic";

const PRIZES = [
  { prize_name: "Weekend Pass",          prize_description: "Full 3-day access to Wellness Weekend 2026 — Aug 7–9 at Warrior Lodge, Sutton, AK." },
  { prize_name: "Weekend Pass",          prize_description: "Full 3-day access to Wellness Weekend 2026 — Aug 7–9 at Warrior Lodge, Sutton, AK." },
  { prize_name: "Ecstatic Dance Pass",   prize_description: "Access to the Saturday night Ecstatic Dance experience at Wellness Weekend 2026." },
  { prize_name: "Earth Pass",            prize_description: "Earth tier festival pass — Wellness Weekend 2026, Aug 7–9 at Warrior Lodge, Sutton, AK." },
  { prize_name: "Sanctuary Pass",        prize_description: "Sanctuary tier festival pass — Wellness Weekend 2026, Aug 7–9 at Warrior Lodge, Sutton, AK." },
  { prize_name: "Salt Cave Session",     prize_description: "A restorative halotherapy session in a private salt cave. Details will be sent after claiming." },
  { prize_name: "Sound Healing Session", prize_description: "A private sound healing session with crystal bowls. Details will be sent after claiming." },
  { prize_name: "LifeWave X39 10-Pack",  prize_description: "10 LifeWave X39 phototherapy patches for stem cell activation and natural energy support." },
];

function generateCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  return "GW-" + Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}

async function ensureTable(sql: ReturnType<typeof neon>) {
  await sql`
    CREATE TABLE IF NOT EXISTS giveaway_prizes (
      id                SERIAL PRIMARY KEY,
      code              VARCHAR(20)  NOT NULL UNIQUE,
      prize_name        VARCHAR(255) NOT NULL,
      prize_description TEXT         NOT NULL,
      claimed           BOOLEAN      NOT NULL DEFAULT FALSE,
      claimed_by_name   VARCHAR(255),
      claimed_by_email  VARCHAR(255),
      claimed_by_phone  VARCHAR(50),
      claimed_at        TIMESTAMPTZ,
      created_at        TIMESTAMPTZ  NOT NULL DEFAULT NOW()
    )
  `;
  await sql`ALTER TABLE giveaway_prizes ADD COLUMN IF NOT EXISTS claimed_by_phone VARCHAR(50)`;
}

export async function GET(req: NextRequest) {
  if (!isAdminAuthenticated(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) return NextResponse.json({ error: "DATABASE_URL not configured" }, { status: 500 });

  try {
    const sql = neon(dbUrl);
    await ensureTable(sql);
    const rows = await sql`
      SELECT id, code, prize_name, prize_description, claimed, claimed_by_name, claimed_by_email, claimed_by_phone, claimed_at, created_at
      FROM giveaway_prizes ORDER BY id ASC
    `;
    return NextResponse.json({ rows, count: rows.length });
  } catch (e) {
    console.error("[admin/giveaway GET]", e);
    return NextResponse.json({ error: "Failed to fetch prizes" }, { status: 500 });
  }
}

// Seed prizes (only inserts if table is empty)
export async function POST(req: NextRequest) {
  if (!isAdminAuthenticated(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) return NextResponse.json({ error: "DATABASE_URL not configured" }, { status: 500 });

  try {
    const sql = neon(dbUrl);
    await ensureTable(sql);

    const existing = await sql`SELECT COUNT(*)::int AS n FROM giveaway_prizes`;
    if ((existing[0]?.n ?? 0) > 0) {
      return NextResponse.json({ error: "Prizes already seeded. Reset individual prizes via PATCH if needed." }, { status: 409 });
    }

    const inserted = [];
    for (const prize of PRIZES) {
      let code = generateCode();
      // Ensure uniqueness (extremely unlikely collision but safe)
      let attempts = 0;
      while (attempts < 10) {
        const check = await sql`SELECT 1 FROM giveaway_prizes WHERE code = ${code}`;
        if (check.length === 0) break;
        code = generateCode();
        attempts++;
      }
      const row = await sql`
        INSERT INTO giveaway_prizes (code, prize_name, prize_description)
        VALUES (${code}, ${prize.prize_name}, ${prize.prize_description})
        RETURNING id, code, prize_name
      `;
      inserted.push(row[0]);
    }

    return NextResponse.json({ ok: true, inserted });
  } catch (e) {
    console.error("[admin/giveaway POST]", e);
    return NextResponse.json({ error: "Failed to seed prizes" }, { status: 500 });
  }
}

// Reset a claimed prize (unclaim it)
export async function PATCH(req: NextRequest) {
  if (!isAdminAuthenticated(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) return NextResponse.json({ error: "DATABASE_URL not configured" }, { status: 500 });

  try {
    const { id } = await req.json();
    if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
    const sql = neon(dbUrl);
    await sql`
      UPDATE giveaway_prizes
      SET claimed = FALSE, claimed_by_name = NULL, claimed_by_email = NULL, claimed_at = NULL
      WHERE id = ${Number(id)}
    `;
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[admin/giveaway PATCH]", e);
    return NextResponse.json({ error: "Failed to reset prize" }, { status: 500 });
  }
}
