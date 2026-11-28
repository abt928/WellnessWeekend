import { NextRequest, NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, currentPass, desiredUpgrade, notes } = body;

    if (!name || !email || !desiredUpgrade) {
      return NextResponse.json({ error: "Name, email, and desired upgrade are required." }, { status: 400 });
    }

    const dbUrl = process.env.DATABASE_URL;
    if (!dbUrl) return NextResponse.json({ error: "Database not configured" }, { status: 500 });

    const sql = neon(dbUrl);

    await sql`
      CREATE TABLE IF NOT EXISTS upgrade_requests (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        current_pass TEXT,
        desired_upgrade TEXT NOT NULL,
        notes TEXT,
        status TEXT NOT NULL DEFAULT 'pending',
        year INTEGER NOT NULL DEFAULT 2027,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `.catch(() => {});

    await sql`
      INSERT INTO upgrade_requests (name, email, current_pass, desired_upgrade, notes, year)
      VALUES (
        ${String(name).trim()},
        ${String(email).trim().toLowerCase()},
        ${currentPass ? String(currentPass).trim() : null},
        ${String(desiredUpgrade).trim()},
        ${notes ? String(notes).trim() : null},
        2027
      )
    `;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[upgrade-request POST] error:", error);
    return NextResponse.json({ error: "Failed to submit. Please try again." }, { status: 500 });
  }
}
