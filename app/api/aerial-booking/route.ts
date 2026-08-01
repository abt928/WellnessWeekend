import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { aerialBookings } from "@/lib/schema";

export const dynamic = "force-dynamic";

// "class" = guided small-group Intro Aerial sessions (6 max, matches the printed schedule)
// "solo"  = unguided silk hammock rental during Sound offerings (7 hammocks available)
const CAPACITY: Record<string, number> = { class: 6, solo: 7 };

const CLASS_SLOTS = [
  "fri-3pm", "fri-6pm", "sat-10am", "sat-2pm", "sun-1030am", "sun-2pm-kids",
];
const SOLO_SLOTS = [
  "fri-4pm", "sat-7am", "sat-8am", "sat-4pm", "sat-5pm", "sun-8am", "sun-10am",
];
const SLOTS_BY_MODE: Record<string, string[]> = { class: CLASS_SLOTS, solo: SOLO_SLOTS };

async function getCounts(): Promise<Record<string, Record<string, number>>> {
  const db = getDb();
  const rows = await db.select({ mode: aerialBookings.mode, slot: aerialBookings.slot }).from(aerialBookings);
  const counts: Record<string, Record<string, number>> = { class: {}, solo: {} };
  for (const mode of Object.keys(SLOTS_BY_MODE)) {
    for (const slot of SLOTS_BY_MODE[mode]) counts[mode][slot] = 0;
  }
  for (const row of rows) {
    if (!counts[row.mode]) continue;
    counts[row.mode][row.slot] = (counts[row.mode][row.slot] ?? 0) + 1;
  }
  return counts;
}

export async function GET() {
  try {
    const counts = await getCounts();
    const availability: Record<string, Record<string, { booked: number; capacity: number; full: boolean }>> = { class: {}, solo: {} };
    for (const mode of Object.keys(SLOTS_BY_MODE)) {
      for (const slot of SLOTS_BY_MODE[mode]) {
        const booked = counts[mode][slot] ?? 0;
        availability[mode][slot] = { booked, capacity: CAPACITY[mode], full: booked >= CAPACITY[mode] };
      }
    }
    return NextResponse.json({ availability, capacity: CAPACITY });
  } catch (e) {
    console.error("Aerial availability error:", e);
    return NextResponse.json({ error: "Failed to fetch availability." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { name, email, phone, mode, slot, notes } = await req.json();

    if (!name?.trim() || !email?.trim() || !mode || !slot) {
      return NextResponse.json(
        { error: "Name, email, experience, and a time slot are required." },
        { status: 400 }
      );
    }
    if (!SLOTS_BY_MODE[mode] || !SLOTS_BY_MODE[mode].includes(slot)) {
      return NextResponse.json({ error: "Invalid experience or time slot." }, { status: 400 });
    }

    const counts = await getCounts();
    if ((counts[mode][slot] ?? 0) >= CAPACITY[mode]) {
      return NextResponse.json(
        { error: "Sorry, that session just filled up. Please choose another slot." },
        { status: 409 }
      );
    }

    const db = getDb();
    await db.insert(aerialBookings).values({
      name: name.trim(),
      email: email.trim(),
      phone: phone?.trim() || null,
      mode,
      slot,
      notes: notes?.trim() || null,
    });

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("Aerial booking error:", e);
    return NextResponse.json({ error: "Failed to save booking." }, { status: 500 });
  }
}
