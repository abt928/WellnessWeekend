import { NextRequest, NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

export const dynamic = "force-dynamic";

export const CLASSES: Record<string, {
  label: string;
  day: string;
  time: string;
  capacity: number;
  overflow?: string;
  hidden?: boolean;
}> = {
  // Sauna / Contrast Therapy
  "sauna-fri-3pm":    { label: "Contrast Therapy · Fri 3:00 PM",   day: "Friday",   time: "3:00 PM",  capacity: 8 },
  "sauna-sat-1230pm": { label: "Contrast Therapy · Sat 12:30 PM",  day: "Saturday", time: "12:30 PM", capacity: 8 },
  "sauna-sat-530pm":  { label: "Contrast Therapy · Sat 5:30 PM",   day: "Saturday", time: "5:30 PM",  capacity: 8 },
  "sauna-sun-1130am": { label: "Contrast Therapy · Sun 11:30 AM",  day: "Sunday",   time: "11:30 AM", capacity: 8 },
  // Aerial Silk
  "aerial-fri-3pm":   { label: "Aerial Silk · Fri 3:00 PM",  day: "Friday",   time: "3:00 PM",  capacity: 6, overflow: "aerial-fri-extra" },
  "aerial-fri-extra": { label: "Aerial Silk · Fri 4:30 PM",  day: "Friday",   time: "4:30 PM",  capacity: 6, hidden: true },
  "aerial-sat-10am":  { label: "Aerial Silk · Sat 10:00 AM", day: "Saturday", time: "10:00 AM", capacity: 6, overflow: "aerial-sat-extra" },
  "aerial-sat-extra": { label: "Aerial Silk · Sat 3:30 PM",  day: "Saturday", time: "3:30 PM",  capacity: 6, hidden: true },
  "aerial-sat-2pm":   { label: "Aerial Silk · Sat 2:00 PM",  day: "Saturday", time: "2:00 PM",  capacity: 6 },
  // Paddleboard Yoga
  "paddle-fri-2pm":   { label: "Paddleboard Yoga · Fri 2:00 PM", day: "Friday",   time: "2:00 PM",  capacity: 7, overflow: "paddle-fri-extra" },
  "paddle-fri-extra": { label: "Paddleboard Yoga · Fri 3:30 PM", day: "Friday",   time: "3:30 PM",  capacity: 7, hidden: true },
  "paddle-sat-2pm":   { label: "Paddleboard Yoga · Sat 2:00 PM", day: "Saturday", time: "2:00 PM",  capacity: 7, overflow: "paddle-sat-extra" },
  "paddle-sat-extra": { label: "Paddleboard Yoga · Sat 3:30 PM", day: "Saturday", time: "3:30 PM",  capacity: 7, hidden: true },
};

async function ensureTable(sql: ReturnType<typeof neon>) {
  await sql`
    CREATE TABLE IF NOT EXISTS class_reservations (
      id SERIAL PRIMARY KEY,
      class_key TEXT NOT NULL,
      attendee_name TEXT NOT NULL,
      attendee_email TEXT NOT NULL,
      booked_at TIMESTAMPTZ DEFAULT NOW(),
      UNIQUE (class_key, attendee_email)
    )
  `;
}

export async function GET() {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) return NextResponse.json({ error: "DATABASE_URL not set" }, { status: 500 });
  const sql = neon(dbUrl);
  await ensureTable(sql);

  const rows = await sql`SELECT class_key, COUNT(*)::int AS booked FROM class_reservations GROUP BY class_key`;
  const countMap: Record<string, number> = {};
  for (const r of rows) countMap[r.class_key] = r.booked;

  const availability: Record<string, {
    label: string; day: string; time: string;
    booked: number; capacity: number; full: boolean; overflow?: string; hidden?: boolean;
  }> = {};
  for (const [key, info] of Object.entries(CLASSES)) {
    const booked = countMap[key] ?? 0;
    availability[key] = { ...info, booked, full: booked >= info.capacity };
  }
  return NextResponse.json({ availability });
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const { classKey, name, email } = body;
  if (!classKey || !name || !email) {
    return NextResponse.json({ error: "classKey, name, and email are required" }, { status: 400 });
  }
  if (!(classKey in CLASSES)) {
    return NextResponse.json({ error: "Unknown class" }, { status: 400 });
  }

  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) return NextResponse.json({ error: "DATABASE_URL not set" }, { status: 500 });
  const sql = neon(dbUrl);
  await ensureTable(sql);

  const [countRow] = await sql`SELECT COUNT(*)::int AS booked FROM class_reservations WHERE class_key = ${classKey}`;
  if ((countRow.booked ?? 0) >= CLASSES[classKey].capacity) {
    return NextResponse.json({ error: "This slot is full", overflow: CLASSES[classKey].overflow }, { status: 409 });
  }

  try {
    await sql`INSERT INTO class_reservations (class_key, attendee_name, attendee_email) VALUES (${classKey}, ${name}, ${email})`;
  } catch (e: any) {
    if (e?.message?.includes("unique")) {
      return NextResponse.json({ error: "You already have a reservation for this slot" }, { status: 409 });
    }
    throw e;
  }

  return NextResponse.json({ success: true, label: CLASSES[classKey].label });
}
