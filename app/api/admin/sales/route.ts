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

    // KPI – Square orders (synced)
    const kpiOrders = await sql`
      SELECT
        COUNT(*)::int                        AS total_orders,
        COALESCE(SUM(amount_cents), 0)::int  AS total_revenue_cents,
        COALESCE(AVG(amount_cents), 0)::int  AS avg_order_cents,
        COUNT(CASE WHEN referral_code IS NOT NULL THEN 1 END)::int AS affiliate_orders,
        COALESCE(SUM(CASE WHEN referral_code IS NOT NULL THEN amount_cents END), 0)::int AS affiliate_revenue_cents
      FROM orders
      WHERE status = 'completed'
    `;

    // KPI – Vendor agreements (paid; price_cents > 0)
    const kpiVendors = await sql`
      SELECT
        COUNT(*)::int                          AS vendor_count,
        COALESCE(SUM(price_cents), 0)::int     AS vendor_revenue_cents
      FROM vendor_agreements
      WHERE price_cents > 0
    `;

    // Total commissions owed
    const commRow = await sql`
      SELECT COALESCE(SUM(commission_cents), 0)::int AS total_commission_cents
      FROM referral_events
      WHERE event_type = 'purchase'
    `;

    const o = kpiOrders[0] ?? {};
    const v = kpiVendors[0] ?? {};
    const totalOrders = (Number(o.total_orders) || 0) + (Number(v.vendor_count) || 0);
    const totalRevenueCents = (Number(o.total_revenue_cents) || 0) + (Number(v.vendor_revenue_cents) || 0);
    const avgOrderCents = totalOrders > 0 ? Math.round(totalRevenueCents / totalOrders) : 0;

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

    // Recent Square orders (with line items for add-on visibility)
    const recentSquare = await sql`
      SELECT
        id,
        square_payment_id,
        square_order_id,
        amount_cents,
        currency,
        customer_email,
        referral_code,
        line_items,
        status,
        created_at,
        'order' AS source,
        NULL::text AS description
      FROM orders
      ORDER BY created_at DESC
      LIMIT 30
    `;

    // Recent vendor agreement payments
    const recentVendors = await sql`
      SELECT
        id,
        NULL::text AS square_payment_id,
        NULL::text AS square_order_id,
        price_cents AS amount_cents,
        'USD' AS currency,
        email AS customer_email,
        NULL::text AS referral_code,
        NULL::text AS line_items,
        payment_status AS status,
        created_at,
        'vendor' AS source,
        (vendor_name || ' — ' || space_type) AS description
      FROM vendor_agreements
      WHERE price_cents > 0
      ORDER BY created_at DESC
      LIMIT 30
    `;

    // Merge and sort by created_at, keep newest 50
    const allRecent = [...recentSquare, ...recentVendors]
      .sort((a, b) => new Date(String(b.created_at)).getTime() - new Date(String(a.created_at)).getTime())
      .slice(0, 50);

    // Daily revenue for the last 30 days – combine both sources
    const dailyOrders = await sql`
      SELECT
        DATE(created_at AT TIME ZONE 'America/Anchorage')::text AS day,
        COUNT(*)::int AS orders,
        SUM(amount_cents)::int AS revenue_cents
      FROM orders
      WHERE status = 'completed'
        AND created_at >= NOW() - INTERVAL '30 days'
      GROUP BY day
    `;

    const dailyVendors = await sql`
      SELECT
        DATE(created_at AT TIME ZONE 'America/Anchorage')::text AS day,
        COUNT(*)::int AS orders,
        SUM(price_cents)::int AS revenue_cents
      FROM vendor_agreements
      WHERE price_cents > 0
        AND created_at >= NOW() - INTERVAL '30 days'
      GROUP BY day
    `;

    // Merge daily maps
    const dayMap = new Map<string, { orders: number; revenue_cents: number }>();
    for (const r of [...dailyOrders, ...dailyVendors]) {
      const day = String(r.day);
      const existing = dayMap.get(day) ?? { orders: 0, revenue_cents: 0 };
      dayMap.set(day, {
        orders: existing.orders + (Number(r.orders) || 0),
        revenue_cents: existing.revenue_cents + (Number(r.revenue_cents) || 0),
      });
    }
    const dailyRevenue = Array.from(dayMap.entries())
      .map(([day, d]) => ({ day, orders: d.orders, revenue_cents: d.revenue_cents }))
      .sort((a, b) => a.day.localeCompare(b.day));

    return NextResponse.json({
      kpi: {
        totalOrders,
        totalRevenueCents,
        avgOrderCents,
        affiliateOrders: Number(o.affiliate_orders) || 0,
        affiliateRevenueCents: Number(o.affiliate_revenue_cents) || 0,
        totalCommissionCents: Number(commRow[0]?.total_commission_cents) || 0,
        vendorCount: Number(v.vendor_count) || 0,
        vendorRevenueCents: Number(v.vendor_revenue_cents) || 0,
      },
      leaderboard,
      recentOrders: allRecent,
      dailyRevenue,
    });
  } catch (e) {
    console.error("[/api/admin/sales] error:", e);
    return NextResponse.json({ error: "Failed to fetch sales data" }, { status: 500 });
  }
}
