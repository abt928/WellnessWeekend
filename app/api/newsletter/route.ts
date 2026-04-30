import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { newsletter } from "@/lib/schema";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const db = getDb();
    await db.insert(newsletter).values({ email }).onConflictDoNothing();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Newsletter signup error:", error);
    return NextResponse.json({ error: "Failed to subscribe" }, { status: 500 });
  }
}
