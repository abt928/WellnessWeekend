import { NextRequest, NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";
import { isAdminAuthenticated } from "@/app/api/admin/auth/route";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  if (!isAdminAuthenticated(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) return NextResponse.json({ error: "DATABASE_URL not set" }, { status: 500 });
  const sql = neon(dbUrl);

  try {
    // Ensure tables exist
    await sql`
      CREATE TABLE IF NOT EXISTS members (
        id SERIAL PRIMARY KEY,
        name TEXT,
        email TEXT NOT NULL UNIQUE,
        points_balance INTEGER NOT NULL DEFAULT 0,
        referral_code TEXT UNIQUE,
        referred_by TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW()
      )
    `;
    await sql`
      CREATE TABLE IF NOT EXISTS member_redemptions (
        id SERIAL PRIMARY KEY,
        member_id INTEGER NOT NULL,
        points_used INTEGER NOT NULL,
        reward TEXT,
        redeemed_at TIMESTAMPTZ DEFAULT NOW()
      )
    `;
    await sql`
      CREATE TABLE IF NOT EXISTS member_purchase_events (
        id SERIAL PRIMARY KEY,
        member_id INTEGER NOT NULL,
        checkout_ts BIGINT NOT NULL,
        points_awarded INTEGER NOT NULL,
        earned_at TIMESTAMPTZ DEFAULT NOW(),
        UNIQUE (member_id, checkout_ts)
      )
    `;

    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

    const [totals] = await sql`
      SELECT
        COUNT(*)::int                                     AS total_members,
        COUNT(*) FILTER (WHERE created_at >= ${monthStart})::int AS new_this_month,
        COALESCE(SUM(points_balance), 0)::int            AS total_points,
        COUNT(*) FILTER (WHERE points_balance > 0)::int  AS members_with_points
      FROM members
    `;

    const [redemptionTotals] = await sql`
      SELECT
        COUNT(*)::int                  AS total_redemptions,
        COALESCE(SUM(points_used), 0)::int AS total_points_redeemed
      FROM member_redemptions
    `;

    const recentSignups = await sql`
      SELECT id, name, email, points_balance, referral_code, created_at
      FROM members
      ORDER BY created_at DESC
      LIMIT 20
    `;

    const topMembers = await sql`
      SELECT id, name, email, points_balance, created_at
      FROM members
      WHERE points_balance > 0
      ORDER BY points_balance DESC
      LIMIT 10
    `;

    const recentRedemptions = await sql`
      SELECT r.id, r.points_used, r.reward, r.redeemed_at,
             m.name AS member_name, m.email AS member_email
      FROM member_redemptions r
      LEFT JOIN members m ON m.id = r.member_id
      ORDER BY r.redeemed_at DESC
      LIMIT 20
    `;

    return NextResponse.json({
      totals: {
        total_members: totals.total_members ?? 0,
        new_this_month: totals.new_this_month ?? 0,
        total_points: totals.total_points ?? 0,
        members_with_points: totals.members_with_points ?? 0,
        total_redemptions: redemptionTotals.total_redemptions ?? 0,
        total_points_redeemed: redemptionTotals.total_points_redeemed ?? 0,
      },
      recentSignups,
      topMembers,
      recentRedemptions,
    });
  } catch (error) {
    console.error("[admin/members] error:", error);
    return NextResponse.json({ error: "Failed to load loyalty data" }, { status: 500 });
  }
}
