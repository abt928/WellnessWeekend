import { NextRequest, NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code")?.toUpperCase().trim();
  if (!code) return NextResponse.json({ error: "Code required" }, { status: 400 });

  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) return NextResponse.json({ error: "Database not configured" }, { status: 500 });

  try {
    const sql = neon(dbUrl);
    const rows = await sql`
      SELECT id, partner_name, benefit, max_uses, use_count, active
      FROM partner_codes WHERE code = ${code}
    `;
    if (rows.length === 0) {
      return NextResponse.json({ error: "Code not found — double-check and try again." }, { status: 404 });
    }
    const p = rows[0];
    if (!p.active) {
      return NextResponse.json({ error: "This code is no longer active." }, { status: 410 });
    }
    return NextResponse.json({
      valid: true,
      partner_name: p.partner_name,
      benefit: p.benefit,
      uses_remaining: p.max_uses - p.use_count,
      max_uses: p.max_uses,
      full: p.use_count >= p.max_uses,
    });
  } catch (e) {
    console.error("[partner-codes GET]", e);
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
    const rows = await sql`
      SELECT id, benefit, max_uses, use_count, active
      FROM partner_codes WHERE code = ${code.toUpperCase().trim()}
    `;
    if (rows.length === 0) return NextResponse.json({ error: "Invalid code." }, { status: 404 });
    if (!rows[0].active) return NextResponse.json({ error: "This code is no longer active." }, { status: 410 });
    if (rows[0].use_count >= rows[0].max_uses) {
      return NextResponse.json({ error: "This code has reached its maximum uses." }, { status: 409 });
    }

    // Check for duplicate email on same code
    const dupes = await sql`
      SELECT 1 FROM partner_code_uses WHERE code_id = ${rows[0].id} AND redeemer_email = ${email.trim().toLowerCase()}
    `;
    if (dupes.length > 0) {
      return NextResponse.json({ error: "This email has already used this code." }, { status: 409 });
    }

    await sql`
      INSERT INTO partner_code_uses (code_id, redeemer_name, redeemer_email)
      VALUES (${rows[0].id}, ${name.trim()}, ${email.trim().toLowerCase()})
    `;
    await sql`
      UPDATE partner_codes SET use_count = use_count + 1 WHERE id = ${rows[0].id}
    `;

    return NextResponse.json({ ok: true, benefit: rows[0].benefit });
  } catch (e) {
    console.error("[partner-codes POST]", e);
    return NextResponse.json({ error: "Failed to redeem code" }, { status: 500 });
  }
}
