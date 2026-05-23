import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { affiliates } from "@/lib/schema";
import { isAdminAuthenticated } from "@/app/api/admin/auth/route";
import { eq } from "drizzle-orm";

/** PATCH /api/admin/affiliates — approve, reject, or update commission for an affiliate */
export async function PATCH(req: NextRequest) {
  if (!isAdminAuthenticated(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id, status, commissionPct, notes } = await req.json();
    if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

    const updates: Partial<typeof affiliates.$inferInsert> = {};
    if (status !== undefined) updates.status = status;
    if (commissionPct !== undefined) updates.commissionPct = Number(commissionPct);
    if (notes !== undefined) updates.notes = notes;

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
