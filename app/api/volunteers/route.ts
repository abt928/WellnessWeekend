import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { volunteers } from "@/lib/schema";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, interest, experience, availability } = body;

    if (!name || !email || !interest || !availability) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const db = getDb();
    await db.insert(volunteers).values({
      name,
      email,
      phone: phone || null,
      interest,
      experience: experience || null,
      availability,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Volunteer application error:", error);
    return NextResponse.json({ error: "Failed to submit application" }, { status: 500 });
  }
}
