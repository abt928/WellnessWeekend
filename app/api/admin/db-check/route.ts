import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

export async function GET() {
  const url = process.env.DATABASE_URL;

  if (!url) {
    return NextResponse.json({
      status: "error",
      message: "DATABASE_URL environment variable is NOT set.",
      hint: "Go to Vercel → Settings → Environment Variables and add DATABASE_URL with your Neon connection string.",
    }, { status: 500 });
  }

  try {
    const sql = neon(url);

    // Test the connection
    const result = await sql`SELECT current_database(), current_timestamp`;

    // Check which tables exist
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `;

    return NextResponse.json({
      status: "ok",
      database: result[0]?.current_database,
      timestamp: result[0]?.current_timestamp,
      tables: tables.map((t: Record<string, string>) => t.table_name),
      dbUrlPrefix: url.substring(0, 30) + "...",
    });
  } catch (e) {
    return NextResponse.json({
      status: "error",
      message: "DATABASE_URL is set but connection failed.",
      error: String(e),
      dbUrlPrefix: url.substring(0, 30) + "...",
    }, { status: 500 });
  }
}
