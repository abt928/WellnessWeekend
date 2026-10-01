import { NextRequest, NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";
import { isAdminAuthenticated } from "@/app/api/admin/auth/route";

export async function GET(req: NextRequest) {
  if (!isAdminAuthenticated(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ error: "No database configured" }, { status: 500 });
  }

  const sql = neon(process.env.DATABASE_URL);

  const [newsletterByMonth, bookingCounts, revenueByMonth, leadsByMonth, totals] = await Promise.all([
    sql`
      SELECT
        TO_CHAR(created_at AT TIME ZONE 'UTC', 'Mon YY') AS month,
        DATE_TRUNC('month', created_at) AS month_start,
        COUNT(*)::int AS count
      FROM newsletter
      WHERE created_at > NOW() - INTERVAL '18 months'
      GROUP BY month, month_start
      ORDER BY month_start
    `.catch(() => []),

    sql`
      SELECT 'Massage'   AS type, COUNT(*)::int AS count FROM massage_bookings
      UNION ALL
      SELECT 'Aerial',              COUNT(*)::int FROM aerial_bookings
      UNION ALL
      SELECT 'Paddleboard',         COUNT(*)::int FROM paddleboard_bookings
      UNION ALL
      SELECT 'Contrast',            COUNT(*)::int FROM contrast_bookings
      UNION ALL
      SELECT 'Volunteers',          COUNT(*)::int FROM volunteer_registrations
      UNION ALL
      SELECT 'Warriors',            COUNT(*)::int FROM warriors
      UNION ALL
      SELECT 'Staff',               COUNT(*)::int FROM staff_registrations
    `.catch(() => []),

    sql`
      SELECT
        TO_CHAR(created_at AT TIME ZONE 'UTC', 'Mon YY') AS month,
        DATE_TRUNC('month', created_at) AS month_start,
        SUM(amount_cents)::int AS total_cents,
        COUNT(*)::int AS order_count
      FROM orders
      WHERE status = 'completed'
      GROUP BY month, month_start
      ORDER BY month_start
    `.catch(() => []),

    sql`
      SELECT
        TO_CHAR(created_at AT TIME ZONE 'UTC', 'Mon YY') AS month,
        DATE_TRUNC('month', created_at) AS month_start,
        COUNT(*)::int AS count
      FROM leads
      WHERE created_at > NOW() - INTERVAL '12 months'
      GROUP BY month, month_start
      ORDER BY month_start
    `.catch(() => []),

    sql`
      SELECT
        (SELECT COUNT(*)::int FROM newsletter)             AS newsletter_total,
        (SELECT COUNT(*)::int FROM leads)                  AS leads_total,
        (SELECT COALESCE(SUM(amount_cents),0)::int
           FROM orders WHERE status = 'completed')         AS revenue_total_cents,
        (SELECT COUNT(*)::int FROM instructor_waitlist)    AS instructors_total,
        (SELECT COUNT(*)::int FROM sponsors)               AS sponsors_total,
        (SELECT COUNT(*)::int FROM massage_bookings)       AS massage_count,
        (SELECT COUNT(*)::int FROM aerial_bookings)        AS aerial_count,
        (SELECT COUNT(*)::int FROM paddleboard_bookings)   AS paddleboard_count,
        (SELECT COUNT(*)::int FROM volunteer_registrations) AS volunteer_count,
        (SELECT COUNT(*)::int FROM warriors)               AS warriors_count
    `.catch(() => [{}]),
  ]);

  return NextResponse.json({
    newsletterByMonth,
    bookingCounts,
    revenueByMonth,
    leadsByMonth,
    totals: (totals as Record<string, unknown>[])[0] ?? {},
  });
}
