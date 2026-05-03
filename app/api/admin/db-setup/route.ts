import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/app/api/admin/auth/route";
import { neon } from "@neondatabase/serverless";

export async function POST(req: NextRequest) {
  if (!isAdminAuthenticated(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = process.env.DATABASE_URL;
  if (!url) {
    return NextResponse.json(
      { error: "DATABASE_URL not configured. Add it to Vercel environment variables." },
      { status: 500 }
    );
  }

  try {
    const sql = neon(url);

    // Create all tables if they don't exist (using TIMESTAMPTZ for proper timezone handling)
    await sql`
      CREATE TABLE IF NOT EXISTS vendors (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        business VARCHAR(255) NOT NULL,
        category VARCHAR(100) NOT NULL,
        website VARCHAR(500),
        description TEXT NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS volunteers (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(50),
        interest VARCHAR(100) NOT NULL,
        experience TEXT,
        availability VARCHAR(100) NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS newsletter (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) NOT NULL UNIQUE,
        created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS leads (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(50),
        message TEXT NOT NULL,
        source VARCHAR(100) DEFAULT 'message_form' NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
      )
    `;

    // Alter existing columns from TIMESTAMP to TIMESTAMPTZ if they exist
    await sql`ALTER TABLE vendors ALTER COLUMN created_at TYPE TIMESTAMPTZ USING created_at AT TIME ZONE 'UTC'`;
    await sql`ALTER TABLE volunteers ALTER COLUMN created_at TYPE TIMESTAMPTZ USING created_at AT TIME ZONE 'UTC'`;
    await sql`ALTER TABLE newsletter ALTER COLUMN created_at TYPE TIMESTAMPTZ USING created_at AT TIME ZONE 'UTC'`;
    await sql`ALTER TABLE leads ALTER COLUMN created_at TYPE TIMESTAMPTZ USING created_at AT TIME ZONE 'UTC'`;

    return NextResponse.json({
      success: true,
      tables: ["vendors", "volunteers", "newsletter", "leads"],
      message: "All tables verified / created. Timestamps upgraded to TIMESTAMPTZ.",
    });
  } catch (e) {
    console.error("DB setup error:", e);
    return NextResponse.json(
      { error: "Failed to set up database tables. Check DATABASE_URL." },
      { status: 500 }
    );
  }
}
