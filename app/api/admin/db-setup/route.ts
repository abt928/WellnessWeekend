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

    await sql`ALTER TABLE vendors ALTER COLUMN created_at TYPE TIMESTAMPTZ USING created_at AT TIME ZONE 'UTC'`;
    await sql`ALTER TABLE volunteers ALTER COLUMN created_at TYPE TIMESTAMPTZ USING created_at AT TIME ZONE 'UTC'`;
    await sql`ALTER TABLE newsletter ALTER COLUMN created_at TYPE TIMESTAMPTZ USING created_at AT TIME ZONE 'UTC'`;
    await sql`ALTER TABLE leads ALTER COLUMN created_at TYPE TIMESTAMPTZ USING created_at AT TIME ZONE 'UTC'`;

    await sql`
      CREATE TABLE IF NOT EXISTS sponsors (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(50),
        company VARCHAR(255) NOT NULL,
        website VARCHAR(500),
        interests TEXT NOT NULL,
        budget_range VARCHAR(50) NOT NULL,
        goals TEXT NOT NULL,
        source VARCHAR(255),
        created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS instructor_waitlist (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(50),
        modality VARCHAR(255) NOT NULL,
        years_teaching INTEGER,
        website VARCHAR(500),
        interested_in_2026 BOOLEAN DEFAULT FALSE NOT NULL,
        interested_in_2027 BOOLEAN DEFAULT FALSE NOT NULL,
        offering TEXT NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS affiliates (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        code VARCHAR(20) NOT NULL UNIQUE,
        company VARCHAR(255),
        website VARCHAR(500),
        description TEXT,
        commission_pct INTEGER NOT NULL DEFAULT 10,
        status VARCHAR(20) NOT NULL DEFAULT 'pending',
        password_hash TEXT NOT NULL,
        notes TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS referral_events (
        id SERIAL PRIMARY KEY,
        affiliate_code VARCHAR(20) NOT NULL,
        event_type VARCHAR(20) NOT NULL,
        order_id VARCHAR(100),
        order_amount_cents INTEGER,
        commission_cents INTEGER,
        email VARCHAR(255),
        created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        square_order_id VARCHAR(100) UNIQUE,
        square_payment_id VARCHAR(100) UNIQUE,
        amount_cents INTEGER NOT NULL,
        currency VARCHAR(10) NOT NULL DEFAULT 'USD',
        customer_email VARCHAR(255),
        referral_code VARCHAR(20),
        line_items TEXT,
        status VARCHAR(20) NOT NULL DEFAULT 'completed',
        created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS budget_items (
        id SERIAL PRIMARY KEY,
        type VARCHAR(20) NOT NULL,
        category VARCHAR(100) NOT NULL,
        description VARCHAR(500) NOT NULL,
        amount_cents INTEGER NOT NULL,
        notes TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
      )
    `;

    return NextResponse.json({
      success: true,
      tables: ["vendors", "volunteers", "newsletter", "leads", "sponsors", "instructor_waitlist", "affiliates", "referral_events", "orders", "budget_items"],
      message: "All tables verified / created.",
    });
  } catch (e) {
    console.error("DB setup error:", e);
    return NextResponse.json(
      { error: "Failed to set up database tables. Check DATABASE_URL." },
      { status: 500 }
    );
  }
}
