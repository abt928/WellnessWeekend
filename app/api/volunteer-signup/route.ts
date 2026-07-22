import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { volunteerRegistrations, volunteerShiftClaims } from "@/lib/schema";
import { SHIFTS, SHIFT_MAP, calcReward } from "@/lib/volunteer-shifts";
import { count, inArray } from "drizzle-orm";

export const dynamic = "force-dynamic";

// GET /api/volunteer-signup — returns per-shift claim counts
export async function GET() {
  try {
    const db = getDb();

    const rows = await db
      .select({ shiftId: volunteerShiftClaims.shiftId, claimed: count() })
      .from(volunteerShiftClaims)
      .groupBy(volunteerShiftClaims.shiftId);

    const claimedByShift: Record<string, number> = {};
    for (const row of rows) {
      claimedByShift[row.shiftId] = Number(row.claimed);
    }

    const availability = SHIFTS.map((s) => ({
      shift_id: s.shift_id,
      capacity: s.capacity,
      claimed: claimedByShift[s.shift_id] ?? 0,
      remaining: s.capacity - (claimedByShift[s.shift_id] ?? 0),
    }));

    return NextResponse.json({ availability });
  } catch (error) {
    console.error("Volunteer availability error:", error);
    return NextResponse.json({ error: "Failed to load availability" }, { status: 500 });
  }
}

// POST /api/volunteer-signup — submit a volunteer signup
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, shiftIds, agreedWaiver } = body;

    if (!name || !email || !Array.isArray(shiftIds) || shiftIds.length === 0) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    if (!agreedWaiver) {
      return NextResponse.json({ error: "You must agree to the volunteer waiver" }, { status: 400 });
    }

    // Validate shift IDs
    const invalidIds = shiftIds.filter((id: string) => !SHIFT_MAP[id]);
    if (invalidIds.length > 0) {
      return NextResponse.json({ error: `Unknown shift IDs: ${invalidIds.join(", ")}` }, { status: 400 });
    }

    const db = getDb();

    // Check capacity for each requested shift using Drizzle ORM (avoids raw SQL array issues)
    const claimRows = await db
      .select({ shiftId: volunteerShiftClaims.shiftId, claimed: count() })
      .from(volunteerShiftClaims)
      .where(inArray(volunteerShiftClaims.shiftId, shiftIds))
      .groupBy(volunteerShiftClaims.shiftId);

    const claimedMap: Record<string, number> = {};
    for (const row of claimRows) {
      claimedMap[row.shiftId] = Number(row.claimed);
    }

    const fullShifts = shiftIds.filter((id: string) => {
      const shift = SHIFT_MAP[id];
      const claimed = claimedMap[id] ?? 0;
      return claimed >= shift.capacity;
    });

    if (fullShifts.length > 0) {
      const names = fullShifts.map((id: string) => `${SHIFT_MAP[id].role} (${SHIFT_MAP[id].day})`).join(", ");
      return NextResponse.json({ error: `These shifts are now full: ${names}. Please choose different shifts.` }, { status: 409 });
    }

    // Calculate reward
    const selectedShifts = shiftIds.map((id: string) => SHIFT_MAP[id]);
    const reward = calcReward(selectedShifts);

    // Insert registration
    const [reg] = await db
      .insert(volunteerRegistrations)
      .values({
        name: String(name).trim(),
        email: String(email).trim().toLowerCase(),
        phone: phone ? String(phone).trim() : null,
        shiftIds: shiftIds.join(","),
        rewardEarned: reward.key !== "none" ? reward.key : null,
        agreedWaiver: true,
      })
      .returning({ id: volunteerRegistrations.id });

    // Insert one claim row per shift
    await db.insert(volunteerShiftClaims).values(
      shiftIds.map((id: string) => ({
        registrationId: reg.id,
        shiftId: id,
        email: String(email).trim().toLowerCase(),
      }))
    );

    return NextResponse.json({ success: true, reward });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error("Volunteer signup error:", msg);
    return NextResponse.json({ error: `Signup failed: ${msg}` }, { status: 500 });
  }
}
