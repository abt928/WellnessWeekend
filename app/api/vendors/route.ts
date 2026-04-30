import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { vendors } from "@/lib/schema";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, business, category, website, description } = body;

    if (!name || !email || !business || !category || !description) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const db = getDb();
    await db.insert(vendors).values({
      name,
      email,
      business,
      category,
      website: website || null,
      description,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Vendor application error:", error);
    return NextResponse.json({ error: "Failed to submit application" }, { status: 500 });
  }
}
