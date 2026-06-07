import { NextRequest, NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";
import { getMemberIdFromRequest } from "@/app/api/members/auth/route";

export const dynamic = "force-dynamic";

const REWARD_CONFIG: Record<string, { pointsCost: number; discountCents: number }> = {
  cash: { pointsCost: 100, discountCents: 1000 },
  "day-pass": { pointsCost: 500, discountCents: 0 },
  "weekend-pass": { pointsCost: 1000, discountCents: 0 },
};

/** GET — check for pending redemption for the authenticated member */
export async function GET(req: NextRequest) {
  const memberId = getMemberIdFromRequest(req);
  if (!memberId) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) throw new Error("DATABASE_URL not set");
  const sql = neon(dbUrl);

  // Get member code
  const memberRows = await sql`
    SELECT code FROM members WHERE id = ${memberId}
  `;
  if (memberRows.length === 0) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }
  const memberCode = memberRows[0].code as string;

  // Check for any pending redemption
  const pendingRows = await sql`
    SELECT id, reward_type, points_cost, discount_cents, status
    FROM member_redemptions
    WHERE member_code = ${memberCode} AND status = 'pending'
    ORDER BY created_at DESC
    LIMIT 1
  `;

  if (pendingRows.length === 0) {
    return NextResponse.json({ pending: false });
  }

  const r = pendingRows[0];
  return NextResponse.json({
    pending: true,
    id: r.id,
    rewardType: r.reward_type,
    pointsCost: r.points_cost,
    discountCents: r.discount_cents,
  });
}

/** POST — redeem points for a reward */
export async function POST(req: NextRequest) {
  const memberId = getMemberIdFromRequest(req);
  if (!memberId) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const { rewardType } = (await req.json()) as { rewardType?: string };

    if (!rewardType || !REWARD_CONFIG[rewardType]) {
      return NextResponse.json(
        { error: "Invalid reward type. Must be: cash, day-pass, or weekend-pass" },
        { status: 400 }
      );
    }

    const dbUrl = process.env.DATABASE_URL;
    if (!dbUrl) throw new Error("DATABASE_URL not set");
    const sql = neon(dbUrl);

    // Get member
    const memberRows = await sql`
      SELECT id, code, points_balance FROM members WHERE id = ${memberId}
    `;
    if (memberRows.length === 0) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
    const m = memberRows[0];
    const { pointsCost, discountCents } = REWARD_CONFIG[rewardType];

    // Check sufficient points
    if ((m.points_balance as number) < pointsCost) {
      return NextResponse.json(
        { error: `Not enough points. You need ${pointsCost} pts but have ${m.points_balance}.` },
        { status: 400 }
      );
    }

    // Check no existing pending redemption
    const pending = await sql`
      SELECT id FROM member_redemptions
      WHERE member_code = ${m.code} AND status = 'pending'
      LIMIT 1
    `;
    if (pending.length > 0) {
      return NextResponse.json(
        { error: "You already have a pending redemption. Use it at checkout first." },
        { status: 409 }
      );
    }

    // Deduct points
    await sql`
      UPDATE members
      SET points_balance = points_balance - ${pointsCost}
      WHERE id = ${memberId}
    `;

    // Insert redemption record
    const inserted = await sql`
      INSERT INTO member_redemptions (member_code, reward_type, points_cost, discount_cents, status)
      VALUES (${m.code as string}, ${rewardType}, ${pointsCost}, ${discountCents}, 'pending')
      RETURNING id, member_code, reward_type, points_cost, discount_cents, status, created_at
    `;

    const redemption = inserted[0];
    return NextResponse.json({
      ok: true,
      redemption: {
        id: redemption.id,
        memberCode: redemption.member_code,
        rewardType: redemption.reward_type,
        pointsCost: redemption.points_cost,
        discountCents: redemption.discount_cents,
        status: redemption.status,
        createdAt: redemption.created_at,
      },
    });
  } catch (error) {
    console.error("[members/redeem POST] error:", error);
    return NextResponse.json({ error: "Redemption failed. Please try again." }, { status: 500 });
  }
}
