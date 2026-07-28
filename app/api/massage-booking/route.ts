import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { massageBookings } from "@/lib/schema";

export async function POST(req: NextRequest) {
  try {
    const { name, email, phone, practitioner, slot, sessionType, notes } = await req.json();

    if (!name?.trim() || !email?.trim() || !practitioner?.trim() || !slot?.trim()) {
      return NextResponse.json(
        { error: "Name, email, practitioner, and session time are required." },
        { status: 400 }
      );
    }

    const db = getDb();
    await db.insert(massageBookings).values({
      name: name.trim(),
      email: email.trim(),
      phone: phone?.trim() || null,
      practitioner: practitioner.trim(),
      slot: slot.trim(),
      sessionType: sessionType?.trim() || null,
      notes: notes?.trim() || null,
    });

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("Massage booking error:", e);
    return NextResponse.json({ error: "Failed to save booking." }, { status: 500 });
  }
}
