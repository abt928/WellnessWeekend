import { NextRequest, NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";
import { isAdminAuthenticated } from "@/app/api/admin/auth/route";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  if (!isAdminAuthenticated(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    return NextResponse.json({ error: "DATABASE_URL not configured" }, { status: 500 });
  }

  try {
    const sql = neon(dbUrl);
    const rows = await sql`
      SELECT
        id,
        vendor_name,
        business_name,
        contact_name,
        email,
        phone,
        category,
        space_type,
        selected_days,
        electricity,
        price_cents,
        payment_status,
        printed_name,
        sig_date,
        created_at
      FROM vendor_agreements
      ORDER BY created_at DESC
      LIMIT 500
    `;
    return NextResponse.json({ rows, count: rows.length });
  } catch (e) {
    console.error("[admin/vendor-agreements GET] Error:", e);
    return NextResponse.json({ error: "Failed to fetch vendor agreements" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  if (!isAdminAuthenticated(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    return NextResponse.json({ error: "DATABASE_URL not configured" }, { status: 500 });
  }

  try {
    const { id, payment_status } = await req.json();
    if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
    if (!payment_status) return NextResponse.json({ error: "payment_status required" }, { status: 400 });

    const sql = neon(dbUrl);
    await sql`
      UPDATE vendor_agreements
      SET payment_status = ${payment_status}
      WHERE id = ${Number(id)}
    `;
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("[admin/vendor-agreements PATCH] Error:", e);
    return NextResponse.json({ error: "Failed to update vendor agreement" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  if (!isAdminAuthenticated(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    return NextResponse.json({ error: "DATABASE_URL not configured" }, { status: 500 });
  }

  try {
    const { id } = await req.json();
    if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

    const sql = neon(dbUrl);
    await sql`DELETE FROM vendor_agreements WHERE id = ${Number(id)}`;
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("[admin/vendor-agreements DELETE] Error:", e);
    return NextResponse.json({ error: "Failed to delete vendor agreement" }, { status: 500 });
  }
}
