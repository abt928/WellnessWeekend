import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { warriors } from "@/lib/schema";
import { sql } from "drizzle-orm";

export const dynamic = "force-dynamic";

const TOTAL_BEDS = 40;

export async function GET() {
  try {
    const db = getDb();
    const [{ bedsUsed }] = await db
      .select({ bedsUsed: sql<number>`coalesce(sum(beds_needed), 0)` })
      .from(warriors);
    return NextResponse.json({ bedsRemaining: TOTAL_BEDS - Number(bedsUsed), totalBeds: TOTAL_BEDS });
  } catch (error) {
    console.error("Warriors GET error:", error);
    return NextResponse.json({ error: "Failed to fetch availability" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { name, email, familySize, bedsNeeded } = await req.json();
    if (!name || !email || !familySize || !bedsNeeded) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }
    if (bedsNeeded < 1 || bedsNeeded > 10) {
      return NextResponse.json({ error: "Invalid beds needed" }, { status: 400 });
    }

    const db = getDb();
    const [{ bedsUsed }] = await db
      .select({ bedsUsed: sql<number>`coalesce(sum(beds_needed), 0)` })
      .from(warriors);

    const remaining = TOTAL_BEDS - Number(bedsUsed);
    if (bedsNeeded > remaining) {
      return NextResponse.json(
        { error: `Only ${remaining} bed${remaining === 1 ? "" : "s"} remaining` },
        { status: 409 }
      );
    }

    await db.insert(warriors).values({ name, email, familySize, bedsNeeded });
    const newRemaining = remaining - bedsNeeded;
    return NextResponse.json({ success: true, bedsRemaining: newRemaining });
  } catch (error) {
    console.error("Warriors POST error:", error);
    return NextResponse.json({ error: "Failed to submit application" }, { status: 500 });
  }
}
