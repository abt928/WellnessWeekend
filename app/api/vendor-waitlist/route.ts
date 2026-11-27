import { NextRequest, NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, businessName, category, website, spaceInterest, notes } = body;

    if (!name || !email || !category) {
      return NextResponse.json({ error: "Name, email, and category are required." }, { status: 400 });
    }

    const dbUrl = process.env.DATABASE_URL;
    if (!dbUrl) return NextResponse.json({ error: "Database not configured" }, { status: 500 });

    const sql = neon(dbUrl);

    await sql`
      CREATE TABLE IF NOT EXISTS vendor_waitlist (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT,
        business_name TEXT,
        category TEXT NOT NULL,
        website TEXT,
        space_interest TEXT,
        notes TEXT,
        year INTEGER NOT NULL DEFAULT 2027,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `.catch(() => {});

    await sql`
      INSERT INTO vendor_waitlist (name, email, phone, business_name, category, website, space_interest, notes, year)
      VALUES (
        ${String(name).trim()},
        ${String(email).trim().toLowerCase()},
        ${phone ? String(phone).trim() : null},
        ${businessName ? String(businessName).trim() : null},
        ${String(category).trim()},
        ${website ? String(website).trim() : null},
        ${spaceInterest ? String(spaceInterest).trim() : null},
        ${notes ? String(notes).trim() : null},
        2027
      )
    `;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[vendor-waitlist POST] error:", error);
    return NextResponse.json({ error: "Failed to submit. Please try again." }, { status: 500 });
  }
}
