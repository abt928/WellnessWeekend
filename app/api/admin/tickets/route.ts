import { NextRequest, NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";
import { isAdminAuthenticated } from "@/app/api/admin/auth/route";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  if (!isAdminAuthenticated(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) return NextResponse.json({ error: "DATABASE_URL not configured" }, { status: 500 });

  try {
    const sql = neon(dbUrl);

    const [weekendPasses, earthPasses, deposits] = await Promise.all([
      sql`
        SELECT id, square_payment_id, square_order_id, customer_email, amount_cents, created_at
        FROM orders
        WHERE status = 'completed'
          AND amount_cents = 7700
          AND line_items::text ILIKE '%Weekend Pass%'
        ORDER BY created_at DESC
      `,
      sql`
        SELECT id, square_payment_id, square_order_id, customer_email, amount_cents, created_at
        FROM orders
        WHERE status = 'completed'
          AND amount_cents = 17700
          AND line_items::text ILIKE '%Earth Pass%'
        ORDER BY created_at DESC
      `,
      sql`
        SELECT id, package_type, name, email, phone, created_at
        FROM package_deposits
        ORDER BY created_at DESC
      `.catch(() => [] as Record<string, unknown>[]),
    ]);

    return NextResponse.json({
      weekendPasses,
      earthPasses,
      deposits,
      summary: {
        weekendPassCount: weekendPasses.length,
        weekendPassRevenue: weekendPasses.length * 77,
        earthPassCount: earthPasses.length,
        earthPassRevenue: earthPasses.length * 177,
        depositCount: deposits.length,
        depositRevenue: deposits.reduce((sum, d) => {
          const amt = d.package_type === "suite" ? 500 : 250;
          return (sum as number) + amt;
        }, 0),
      },
    });
  } catch (e) {
    console.error("[admin/tickets GET] Error:", e);
    return NextResponse.json({ error: "Failed to fetch ticket data" }, { status: 500 });
  }
}
