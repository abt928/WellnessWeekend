import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { affiliates } from "@/lib/schema";
import { isAdminAuthenticated } from "@/app/api/admin/auth/route";
import { eq, sql } from "drizzle-orm";

/** PATCH /api/admin/affiliates — approve, reject, or update commission for an affiliate */
export async function PATCH(req: NextRequest) {
  if (!isAdminAuthenticated(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id, status, commissionPct, notes, code } = await req.json();
    if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

    const updates: Partial<typeof affiliates.$inferInsert> = {};
    if (status !== undefined) updates.status = status;
    if (commissionPct !== undefined) updates.commissionPct = Number(commissionPct);
    if (notes !== undefined) updates.notes = notes;
    if (code !== undefined) updates.code = String(code).toUpperCase().trim();

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: "Nothing to update" }, { status: 400 });
    }

    const db = getDb();
    await db.update(affiliates).set(updates).where(eq(affiliates.id, Number(id)));

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("Affiliate update error:", e);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

/** PUT /api/admin/affiliates — bulk-activate all pending affiliates */
export async function PUT(req: NextRequest) {
  if (!isAdminAuthenticated(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const db = getDb();
    const result = await db
      .update(affiliates)
      .set({ status: "active" })
      .where(eq(affiliates.status, "pending"))
      .returning({ id: affiliates.id, code: affiliates.code });

    return NextResponse.json({ success: true, activated: result.length, codes: result.map(r => r.code) });
  } catch (e) {
    console.error("Bulk activate error:", e);
    return NextResponse.json({ error: "Bulk activation failed" }, { status: 500 });
  }
}

/** POST /api/admin/affiliates — create a new affiliate code directly (admin-created) */
export async function POST(req: NextRequest) {
  if (!isAdminAuthenticated(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { code, name, commissionPct, email, company, notes } = await req.json();
    if (!code || !name) {
      return NextResponse.json({ error: "code and name are required" }, { status: 400 });
    }

    const upperCode = String(code).toUpperCase().trim();
    const resolvedEmail = email?.trim().toLowerCase() || `${upperCode.toLowerCase()}@admin.internal`;

    const db = getDb();

    // Check for duplicate code
    const [existing] = await db.select({ id: affiliates.id }).from(affiliates).where(sql`UPPER(code) = ${upperCode}`).limit(1);
    if (existing) {
      return NextResponse.json({ error: `Code ${upperCode} already exists` }, { status: 409 });
    }

    const [created] = await db.insert(affiliates).values({
      name: String(name).trim(),
      email: resolvedEmail,
      code: upperCode,
      commissionPct: Number(commissionPct ?? 10),
      status: "active",
      passwordHash: "",
      notes: notes?.trim() || null,
      company: company?.trim() || null,
    }).returning({ id: affiliates.id, code: affiliates.code });

    return NextResponse.json({ success: true, id: created.id, code: created.code });
  } catch (e) {
    console.error("Create affiliate error:", e);
    return NextResponse.json({ error: "Create failed" }, { status: 500 });
  }
}
