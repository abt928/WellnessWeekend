import { NextRequest, NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";
import { getMemberIdFromRequest } from "@/app/api/members/auth/route";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const memberId = getMemberIdFromRequest(req);
  if (!memberId) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) throw new Error("DATABASE_URL not set");
  const sql = neon(dbUrl);

  // Fetch member
  const memberRows = await sql`
    SELECT id, name, email, code, points_balance, created_at
    FROM members WHERE id = ${memberId}
  `;
  if (memberRows.length === 0) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }
  const m = memberRows[0];

  // Fetch recent referrals (last 20)
  const referralRows = await sql`
    SELECT id, referrer_code, referee_email, points_earned, created_at
    FROM member_referrals
    WHERE referrer_code = ${m.code}
    ORDER BY created_at DESC
    LIMIT 20
  `;

  // Fetch recent redemptions (last 10)
  const redemptionRows = await sql`
    SELECT id, member_code, reward_type, points_cost, discount_cents, status, created_at, used_at
    FROM member_redemptions
    WHERE member_code = ${m.code}
    ORDER BY created_at DESC
    LIMIT 10
  `;

  return NextResponse.json({
    member: {
      name: m.name,
      email: m.email,
      code: m.code,
      pointsBalance: m.points_balance,
    },
    referrals: referralRows.map((r) => ({
      id: r.id,
      refereeEmail: r.referee_email,
      pointsEarned: r.points_earned,
      createdAt: r.created_at,
    })),
    redemptions: redemptionRows.map((r) => ({
      id: r.id,
      rewardType: r.reward_type,
      pointsCost: r.points_cost,
      discountCents: r.discount_cents,
      status: r.status,
      createdAt: r.created_at,
      usedAt: r.used_at,
    })),
  });
}
