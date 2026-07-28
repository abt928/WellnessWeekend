import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { contrastBookings } from "@/lib/schema";

export async function POST(req: NextRequest) {
  try {
    const { name, email, phone, slots, notes } = await req.json();

    if (!name?.trim() || !email?.trim() || !slots?.trim()) {
      return NextResponse.json(
        { error: "Name, email, and at least one session are required." },
        { status: 400 }
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
