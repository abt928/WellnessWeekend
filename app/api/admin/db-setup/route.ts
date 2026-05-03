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
      { error: "DATABASE_URL not configured" },
      { status: 500 }
    );
  }

  try {
    const sql = neon(url);

    // Create all tables if they don't exist
    await sql`
      CREATE TABLE IF NOT EXISTS vendors (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        business VARCHAR(255) NOT NULL,
        category VARCHAR(100) NOT NULL,
        website VARCHAR(500),
        description TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL
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
        created_at TIMESTAMP DEFAULT NOW() NOT NULL
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS newsletter (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) NOT NULL UNIQUE,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS leads (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        source VARCHAR(100) DEFAULT 'message_form' NOT NULL,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL
      )
    `;

    return NextResponse.json({
      success: true,
      tables: ["vendors", "volunteers", "newsletter", "leads"],
      message: "All tables verified / created successfully.",
    });
  } catch (e) {
    console.error("DB setup error:", e);
    return NextResponse.json(
      { error: "Failed to set up database tables" },
      { status: 500 }
    );
  }
}
