import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/app/api/admin/auth/route";
import { neon } from "@neondatabase/serverless";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  if (!isAdminAuthenticated(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) return NextResponse.json({ error: "DATABASE_URL not set" }, { status: 500 });

  try {
    const sql = neon(dbUrl);
    const items = await sql`
      SELECT id, type, category, description, amount_cents, notes, created_at
      FROM budget_items
      ORDER BY type, category, created_at DESC
    `;

    const [totals] = await sql`
      SELECT
        COALESCE(SUM(CASE WHEN type = 'revenue_target' THEN amount_cents END), 0)::int AS revenue_target_cents,
        COALESCE(SUM(CASE WHEN type = 'expense'        THEN amount_cents END), 0)::int AS expense_cents,
        COALESCE(SUM(CASE WHEN type = 'income'         THEN amount_cents END), 0)::int AS income_cents
      FROM budget_items
    `;

    return NextResponse.json({ items, totals });
  } catch (e) {
    console.error("[/api/admin/budget] GET error:", e);
    return NextResponse.json({ error: "Failed to fetch budget" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  if (!isAdminAuthenticated(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) return NextResponse.json({ error: "DATABASE_URL not set" }, { status: 500 });

  try {
    const { type, category, description, amountCents, notes } = await req.json();
    if (!type || !category || !description || amountCents == null) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const sql = neon(dbUrl);
    await sql`
      INSERT INTO budget_items (type, category, description, amount_cents, notes)
      VALUES (${type}, ${category}, ${description}, ${amountCents}, ${notes ?? null})
    `;

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("[/api/admin/budget] POST error:", e);
    return NextResponse.json({ error: "Failed to save budget item" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  if (!isAdminAuthenticated(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) return NextResponse.json({ error: "DATABASE_URL not set" }, { status: 500 });

  try {
    const { id } = await req.json();
    const sql = neon(dbUrl);
    await sql`DELETE FROM budget_items WHERE id = ${id}`;
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("[/api/admin/budget] DELETE error:", e);
    return NextResponse.json({ error: "Failed to delete budget item" }, { status: 500 });
  }
}
