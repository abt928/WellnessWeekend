import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { affiliates, referralEvents } from "@/lib/schema";
import { getAffiliateCode } from "@/app/api/affiliates/auth/route";
import { eq, desc } from "drizzle-orm";

export async function GET(req: NextRequest) {
  const code = getAffiliateCode(req);
  if (!code) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const db = getDb();

  const [affiliate] = await db
    .select({
      name: affiliates.name,
      email: affiliates.email,
      code: affiliates.code,
      company: affiliates.company,
      commissionPct: affiliates.commissionPct,
      status: affiliates.status,
    })
    .from(affiliates)
    .where(eq(affiliates.code, code));

  if (!affiliate) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const events = await db
    .select()
    .from(referralEvents)
    .where(eq(referralEvents.affiliateCode, code))
    .orderBy(desc(referralEvents.createdAt))
    .limit(200);

  const clicks = events.filter((e) => e.eventType === "click").length;
  const leads = events.filter((e) => e.eventType === "lead").length;
  const purchases = events.filter((e) => e.eventType === "purchase");
  const totalRevenueCents = purchases.reduce((s, e) => s + (e.orderAmountCents ?? 0), 0);
  const totalCommissionCents = purchases.reduce((s, e) => s + (e.commissionCents ?? 0), 0);

  return NextResponse.json({
    affiliate,
    stats: {
      clicks,
      leads,
      purchases: purchases.length,
      totalRevenueCents,
      totalCommissionCents,
    },
    recentEvents: events.slice(0, 50),
  });
}
