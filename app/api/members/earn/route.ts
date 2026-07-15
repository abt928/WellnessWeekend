import { NextRequest, NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";
import { getMemberIdFromRequest } from "@/app/api/members/auth/route";

export const dynamic = "force-dynamic";

// 1 point per dollar spent
const POINTS_PER_DOLLAR = 1;
// Abuse brakes: `value` arrives from the client (no server-side Square order
// verification yet), so clamp what a single checkout can mint and how often.
// The durable fix is awarding points from the Square webhook instead.
const MAX_POINTS_PER_CHECKOUT = 1500;
const MAX_EARN_EVENTS_PER_DAY = 2;
const CHECKOUT_FRESHNESS_MS = 2 * 60 * 60 * 1000; // matches ThankYouTracker window

export async function POST(req: NextRequest) {
  const memberId = getMemberIdFromRequest(req);
  if (!memberId) {
    return NextResponse.json({ ok: false, error: "Not authenticated" }, { status: 401 });
  }

  try {
    const { value, checkoutTimestamp } = (await req.json()) as {
      value?: number;
      checkoutTimestamp?: number;
    };

    if (!value || value <= 0 || !checkoutTimestamp) {
      return NextResponse.json({ ok: false, error: "Invalid payload" }, { status: 400 });
    }

    const now = Date.now();
    if (
      checkoutTimestamp > now + 5 * 60 * 1000 ||
      checkoutTimestamp < now - CHECKOUT_FRESHNESS_MS
    ) {
      return NextResponse.json({ ok: false, error: "Checkout expired" }, { status: 400 });
    }

    const pointsToAward = Math.min(
      Math.floor(value * POINTS_PER_DOLLAR),
      MAX_POINTS_PER_CHECKOUT
    );
    if (pointsToAward <= 0) {
      return NextResponse.json({ ok: true, pointsAwarded: 0 });
    }

    const dbUrl = process.env.DATABASE_URL;
    if (!dbUrl) throw new Error("DATABASE_URL not set");
    const sql = neon(dbUrl);

    // Ensure purchase_events table exists for dedup
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

    // Dedup: reject if we've already processed this checkout for this member
    const existing = await sql`
      SELECT id FROM member_purchase_events
      WHERE member_id = ${memberId} AND checkout_ts = ${checkoutTimestamp}
    `;
    if (existing.length > 0) {
      return NextResponse.json({ ok: true, pointsAwarded: 0, duplicate: true });
    }

    // Daily cap: a real shopper rarely completes more than a couple of
    // checkouts in a day; this bounds replay with fabricated timestamps.
    const recent = await sql`
      SELECT COUNT(*)::int AS n FROM member_purchase_events
      WHERE member_id = ${memberId} AND earned_at > NOW() - INTERVAL '24 hours'
    `;
    if ((recent[0]?.n ?? 0) >= MAX_EARN_EVENTS_PER_DAY) {
      return NextResponse.json({ ok: true, pointsAwarded: 0, capped: true });
    }

    // Record the event
    await sql`
      INSERT INTO member_purchase_events (member_id, checkout_ts, points_awarded)
      VALUES (${memberId}, ${checkoutTimestamp}, ${pointsToAward})
    `;

    // Credit points
    const updated = await sql`
      UPDATE members
      SET points_balance = points_balance + ${pointsToAward}
      WHERE id = ${memberId}
      RETURNING points_balance
    `;

    return NextResponse.json({
      ok: true,
      pointsAwarded: pointsToAward,
      newBalance: updated[0]?.points_balance ?? null,
    });
  } catch (error) {
    console.error("[members/earn] error:", error);
    return NextResponse.json({ ok: false, error: "Failed to award points" }, { status: 500 });
  }
}
