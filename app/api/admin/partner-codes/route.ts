import { NextRequest, NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";
import { isAdminAuthenticated } from "@/app/api/admin/auth/route";

export const dynamic = "force-dynamic";

async function ensureTables(sql: ReturnType<typeof neon>) {
  await sql`
    CREATE TABLE IF NOT EXISTS partner_codes (
      id            SERIAL PRIMARY KEY,
      code          VARCHAR(50)  NOT NULL UNIQUE,
      partner_name  VARCHAR(255) NOT NULL,
      partner_email VARCHAR(255),
      benefit       TEXT         NOT NULL DEFAULT 'Partner complimentary access',
      max_uses      INT          NOT NULL DEFAULT 5,
      use_count     INT          NOT NULL DEFAULT 0,
      active        BOOLEAN      NOT NULL DEFAULT TRUE,
      created_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW()
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS partner_code_uses (
      id             SERIAL PRIMARY KEY,
      code_id        INT          NOT NULL,
      redeemer_name  VARCHAR(255) NOT NULL,
      redeemer_email VARCHAR(255) NOT NULL,
      used_at        TIMESTAMPTZ  NOT NULL DEFAULT NOW()
    )
  `;
}

export async function GET(req: NextRequest) {
  if (!isAdminAuthenticated(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) return NextResponse.json({ error: "DATABASE_URL not configured" }, { status: 500 });

  try {
    const sql = neon(dbUrl);
    await ensureTables(sql);
    const codes = await sql`
      SELECT id, code, partner_name, partner_email, benefit, max_uses, use_count, active, created_at
      FROM partner_codes ORDER BY id ASC
    `;
    const uses = await sql`
      SELECT code_id, redeemer_name, redeemer_email, used_at
      FROM partner_code_uses ORDER BY used_at DESC
    `;
    return NextResponse.json({ codes, uses });
  } catch (e) {
    console.error("[admin/partner-codes GET]", e);
    return NextResponse.json({ error: "Failed to fetch partner codes" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  if (!isAdminAuthenticated(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) return NextResponse.json({ error: "DATABASE_URL not configured" }, { status: 500 });

  try {
    const { code, partner_name, partner_email, benefit, max_uses } = await req.json();
    if (!code?.trim() || !partner_name?.trim()) {
      return NextResponse.json({ error: "code and partner_name are required" }, { status: 400 });
    }

    const sql = neon(dbUrl);
    await ensureTables(sql);
    const row = await sql`
      INSERT INTO partner_codes (code, partner_name, partner_email, benefit, max_uses)
      VALUES (
        ${code.trim().toUpperCase()},
        ${partner_name.trim()},
        ${partner_email?.trim() || null},
        ${benefit?.trim() || "Partner complimentary access"},
        ${Number(max_uses) || 5}
      )
      RETURNING id, code, partner_name
    `;
    return NextResponse.json({ ok: true, row: row[0] });
  } catch (e: any) {
    if (e?.message?.includes("unique")) {
      return NextResponse.json({ error: "Code already exists — choose a different one." }, { status: 409 });
    }
    console.error("[admin/partner-codes POST]", e);
    return NextResponse.json({ error: "Failed to create partner code" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  if (!isAdminAuthenticated(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) return NextResponse.json({ error: "DATABASE_URL not configured" }, { status: 500 });

  try {
    const { id, active } = await req.json();
    if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
    const sql = neon(dbUrl);
    await sql`UPDATE partner_codes SET active = ${Boolean(active)} WHERE id = ${Number(id)}`;
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[admin/partner-codes PATCH]", e);
    return NextResponse.json({ error: "Failed to update partner code" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  if (!isAdminAuthenticated(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) return NextResponse.json({ error: "DATABASE_URL not configured" }, { status: 500 });

  try {
    const { id } = await req.json();
    if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
    const sql = neon(dbUrl);
    await sql`DELETE FROM partner_code_uses WHERE code_id = ${Number(id)}`;
    await sql`DELETE FROM partner_codes WHERE id = ${Number(id)}`;
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[admin/partner-codes DELETE]", e);
    return NextResponse.json({ error: "Failed to delete partner code" }, { status: 500 });
  }
}
