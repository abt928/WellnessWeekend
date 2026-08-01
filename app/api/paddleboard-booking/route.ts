import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { paddleboardBookings } from "@/lib/schema";

export const dynamic = "force-dynamic";

const CAPACITY = 7;

const ALL_SLOT_KEYS = ["fri-2pm", "sat-1pm", "sun-1pm-kids", "sun-3pm"];

async function getSlotCounts(): Promise<Record<string, number>> {
  const db = getDb();
  const rows = await db.select({ slot: paddleboardBookings.slot }).from(paddleboardBookings);
  const counts: Record<string, number> = {};
  for (const key of ALL_SLOT_KEYS) counts[key] = 0;
  for (const row of rows) counts[row.slot] = (counts[row.slot] ?? 0) + 1;
  return counts;
}

export async function GET() {
  try {
    const counts = await getSlotCounts();
    const availability: Record<string, { booked: number; capacity: number; full: boolean }> = {};
    for (const key of ALL_SLOT_KEYS) {
      const booked = counts[key] ?? 0;
      availability[key] = { booked, capacity: CAPACITY, full: booked >= CAPACITY };
    }
    return NextResponse.json({ availability, capacity: CAPACITY });
  } catch (e) {
    console.error("Paddleboard availability error:", e);
    return NextResponse.json({ error: "Failed to fetch availability." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { name, email, phone, slot, notes } = await req.json();

    if (!name?.trim() || !email?.trim() || !slot) {
      return NextResponse.json(
        { error: "Name, email, and a time slot are required." },
        { status: 400 }
      );
    }
    if (!ALL_SLOT_KEYS.includes(slot)) {
      return NextResponse.json({ error: "Invalid time slot." }, { status: 400 });
    }

    const counts = await getSlotCounts();
    if ((counts[slot] ?? 0) >= CAPACITY) {
      return NextResponse.json(
        { error: "Sorry, that session just filled up. Please choose another slot." },
        { status: 409 }
      );
    }

    const db = getDb();
    await db.insert(paddleboardBookings).values({
      name: name.trim(),
      email: email.trim(),
      phone: phone?.trim() || null,
      slot,
      notes: notes?.trim() || null,
    });

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("Paddleboard booking error:", e);
    return NextResponse.json({ error: "Failed to save booking." }, { status: 500 });
  }
}
