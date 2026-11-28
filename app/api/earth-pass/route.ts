import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

export const dynamic = "force-dynamic";

const TOTAL = 10;
const CONFIRMED_SOLD = 2; // Erica Longley + Jonathon Dean — Black Friday purchases

export async function GET() {
  try {
    const dbUrl = process.env.DATABASE_URL;
    if (!dbUrl) return NextResponse.json({ remaining: TOTAL - CONFIRMED_SOLD, total: TOTAL });
    const raw = neon(dbUrl);
    const [{ count }] = await raw`
      SELECT COUNT(*)::int AS count FROM orders
      WHERE status = 'completed'
        AND amount_cents = 17700
    `;
    const sold = Math.max(CONFIRMED_SOLD, Number(count));
    return NextResponse.json({ remaining: Math.max(0, TOTAL - sold), total: TOTAL });
  } catch {
    return NextResponse.json({ remaining: TOTAL - CONFIRMED_SOLD, total: TOTAL });
  }
}
