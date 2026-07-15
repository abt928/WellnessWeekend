import { NextRequest, NextResponse } from "next/server";
import { getMemberIdFromRequest } from "@/app/api/members/auth/route";

export const dynamic = "force-dynamic";

/**
 * Purchase points are awarded by the signed Square payment.updated webhook.
 * This compatibility endpoint intentionally ignores the browser's value and
 * timestamp: localStorage and request JSON are not proof of a completed sale.
 */
export async function POST(req: NextRequest) {
  const memberId = getMemberIdFromRequest(req);
  if (!memberId) {
    return NextResponse.json(
      { ok: false, error: "Not authenticated" },
      { status: 401 },
    );
  }

  return NextResponse.json(
    {
      ok: true,
      pointsAwarded: 0,
      pending: true,
      message: "Points are verified from the completed Square payment.",
    },
    { status: 202 },
  );
}
