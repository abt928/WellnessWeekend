import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

export const dynamic = "force-dynamic";

const TOTAL = 25;

export async function GET() {
  try {
    const dbUrl = process.env.DATABASE_URL;
    if (!dbUrl) return NextResponse.json({ remaining: TOTAL, total: TOTAL });
    const raw = neon(dbUrl);
    const [{ count }] = await raw`
      SELECT COUNT(*)::int AS count FROM orders
      WHERE status = 'completed'
        AND amount_cents = 7700
        AND line_items::text ILIKE '%Weekend Pass%'
    `;
    const sold = Number(count);
    return NextResponse.json({ remaining: Math.max(0, TOTAL - sold), total: TOTAL });
  } catch {
    return NextResponse.json({ remaining: TOTAL, total: TOTAL });
  }
}
