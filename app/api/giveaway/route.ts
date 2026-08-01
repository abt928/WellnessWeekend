import { NextRequest, NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

export const dynamic = "force-dynamic";

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
      claimed_at        TIMESTAMPTZ,
      created_at        TIMESTAMPTZ  NOT NULL DEFAULT NOW()
    )
  `;
}

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code")?.toUpperCase().replace(/\s/g, "");
  if (!code) return NextResponse.json({ error: "Code required" }, { status: 400 });

  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) return NextResponse.json({ error: "Database not configured" }, { status: 500 });

  try {
    const sql = neon(dbUrl);
    await ensureTable(sql);
    const rows = await sql`
      SELECT id, prize_name, prize_description, claimed, claimed_by_name
      FROM giveaway_prizes WHERE code = ${code}
    `;
    if (rows.length === 0) {
      return NextResponse.json({ error: "Code not found — double-check and try again." }, { status: 404 });
    }
    const p = rows[0];
    return NextResponse.json({
      valid: true,
      prize_name: p.prize_name,
      prize_description: p.prize_description,
      claimed: p.claimed,
      claimed_by: p.claimed ? p.claimed_by_name : null,
    });
  } catch (e) {
    console.error("[giveaway GET]", e);
    return NextResponse.json({ error: "Failed to look up code" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) return NextResponse.json({ error: "Database not configured" }, { status: 500 });

  try {
    const { code, name, email } = await req.json();
    if (!code || !name?.trim() || !email?.trim()) {
      return NextResponse.json({ error: "Code, name, and email are required." }, { status: 400 });
    }

    const sql = neon(dbUrl);
    await ensureTable(sql);

    const rows = await sql`
      SELECT id, prize_name, claimed FROM giveaway_prizes WHERE code = ${code.toUpperCase().replace(/\s/g, "")}
    `;
    if (rows.length === 0) return NextResponse.json({ error: "Invalid code." }, { status: 404 });
    if (rows[0].claimed) return NextResponse.json({ error: "This prize has already been claimed." }, { status: 409 });

    const updated = await sql`
      UPDATE giveaway_prizes
      SET claimed = TRUE, claimed_by_name = ${name.trim()}, claimed_by_email = ${email.trim()}, claimed_at = NOW()
      WHERE id = ${rows[0].id} AND claimed = FALSE
      RETURNING prize_name
    `;
    if (updated.length === 0) {
      return NextResponse.json({ error: "This prize was just claimed by someone else." }, { status: 409 });
    }

    return NextResponse.json({ ok: true, prize_name: updated[0].prize_name });
  } catch (e) {
    console.error("[giveaway POST]", e);
    return NextResponse.json({ error: "Failed to claim prize" }, { status: 500 });
  }
}
