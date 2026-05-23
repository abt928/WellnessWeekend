import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/app/api/admin/auth/route";
import { neon } from "@neondatabase/serverless";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  if (!isAdminAuthenticated(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    return NextResponse.json({ error: "DATABASE_URL not set" }, { status: 500 });
  }

  try {
    const sql = neon(dbUrl);

    // KPI totals
    const [kpi] = await sql`
      SELECT
        COUNT(*)::int                        AS total_orders,
        COALESCE(SUM(amount_cents), 0)::int  AS total_revenue_cents,
        COALESCE(AVG(amount_cents), 0)::int  AS avg_order_cents,
        COUNT(CASE WHEN referral_code IS NOT NULL THEN 1 END)::int AS affiliate_orders
      FROM orders
      WHERE status = 'completed'
    `;

    // Affiliate revenue (orders that came via a referral code)
    const [affRev] = await sql`
      SELECT COALESCE(SUM(amount_cents), 0)::int AS affiliate_revenue_cents
      FROM orders
      WHERE status = 'completed' AND referral_code IS NOT NULL
    `;

    // Total commissions owed
    const [commissions] = await sql`
      SELECT COALESCE(SUM(commission_cents), 0)::int AS total_commission_cents
      FROM referral_events
      WHERE event_type = 'purchase'
    `;

    // Affiliate leaderboard (top 10)
    const leaderboard = await sql`
      SELECT
        o.referral_code,
        a.name            AS affiliate_name,
        a.company         AS affiliate_company,
        COUNT(*)::int     AS order_count,
        SUM(o.amount_cents)::int AS revenue_cents,
        COALESCE(SUM(re.commission_cents), 0)::int AS commission_cents
      FROM orders o
      LEFT JOIN affiliates a ON a.code = o.referral_code
      LEFT JOIN referral_events re ON re.order_id = o.square_order_id AND re.event_type = 'purchase'
      WHERE o.status = 'completed' AND o.referral_code IS NOT NULL
      GROUP BY o.referral_code, a.name, a.company
      ORDER BY revenue_cents DESC
      LIMIT 10
    `;

    // Recent 50 orders
    const recentOrders = await sql`
      SELECT
        id, square_payment_id, square_order_id, amount_cents, currency,
        customer_email, referral_code, line_items, status, created_at
      FROM orders
      ORDER BY created_at DESC
      LIMIT 50
    `;

    // Daily revenue for the last 30 days
    const dailyRevenue = await sql`
      SELECT
        DATE(created_at AT TIME ZONE 'America/Anchorage')::text AS day,
        COUNT(*)::int AS orders,
        SUM(amount_cents)::int AS revenue_cents
      FROM orders
      WHERE status = 'completed'
        AND created_at >= NOW() - INTERVAL '30 days'
      GROUP BY day
      ORDER BY day ASC
    `;

    return NextResponse.json({
      kpi: {
        totalOrders: kpi.total_orders,
        totalRevenueCents: kpi.total_revenue_cents,
        avgOrderCents: kpi.avg_order_cents,
        affiliateOrders: kpi.affiliate_orders,
        affiliateRevenueCents: affRev.affiliate_revenue_cents,
        totalCommissionCents: commissions.total_commission_cents,
      },
      leaderboard,
      recentOrders,
      dailyRevenue,
    });
  } catch (e) {
    console.error("[/api/admin/sales] error:", e);
    return NextResponse.json({ error: "Failed to fetch sales data" }, { status: 500 });
  }
}
