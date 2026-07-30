import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { contrastBookings } from "@/lib/schema";

const CAPACITY = 5;

const ALL_SLOT_KEYS = ["fri-3pm", "sat-930am", "sat-530pm", "sun-9am", "sun-1130am"];

async function getSlotCounts(): Promise<Record<string, number>> {
  const db = getDb();
  const rows = await db.select({ slots: contrastBookings.slots }).from(contrastBookings);
  const counts: Record<string, number> = {};
  for (const key of ALL_SLOT_KEYS) counts[key] = 0;
  for (const row of rows) {
    const keys = row.slots.split(",").map(s => s.trim()).filter(Boolean);
    for (const key of keys) {
      counts[key] = (counts[key] ?? 0) + 1;
    }
  }
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
    console.error("Contrast availability error:", e);
    return NextResponse.json({ error: "Failed to fetch availability." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { name, email, phone, slots, notes } = await req.json();

    if (!name?.trim() || !email?.trim() || !slots?.trim()) {
      return NextResponse.json(
        { error: "Name, email, and at least one session are required." },
        { status: 400 }
      );
    }

    const requestedKeys = slots.split(",").map((s: string) => s.trim()).filter(Boolean);

    // Check capacity for each requested slot
    const counts = await getSlotCounts();
    const fullSlots = requestedKeys.filter((key: string) => (counts[key] ?? 0) >= CAPACITY);
    if (fullSlots.length > 0) {
      return NextResponse.json(
        { error: `Sorry, the following session(s) are now full: ${fullSlots.join(", ")}. Please choose another slot.` },
        { status: 409 }
      );
    }

    const db = getDb();
    await db.insert(contrastBookings).values({
      name: name.trim(),
      email: email.trim(),
      phone: phone?.trim() || null,
      slots: slots.trim(),
      notes: notes?.trim() || null,
    });

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("Contrast booking error:", e);
    return NextResponse.json({ error: "Failed to save booking." }, { status: 500 });
  }
}
