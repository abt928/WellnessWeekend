import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { instructorWaitlist } from "@/lib/schema";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      name,
      email,
      phone,
      modality,
      yearsTeaching,
      website,
      interestedIn2026,
      interestedIn2027,
      offering,
    } = body;

    if (!name || !email || !modality || !offering) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (!interestedIn2026 && !interestedIn2027) {
      return NextResponse.json(
        { error: "Pick at least one: 2026 openings, 2027 priority, or both." },
        { status: 400 }
      );
    }

    const yearsParsed =
      yearsTeaching === "" || yearsTeaching === null || yearsTeaching === undefined
        ? null
        : Number.parseInt(String(yearsTeaching), 10);

    const db = getDb();
    await db.insert(instructorWaitlist).values({
      name: String(name).trim(),
      email: String(email).trim().toLowerCase(),
      phone: phone ? String(phone).trim() : null,
      modality: String(modality).trim(),
      yearsTeaching: Number.isFinite(yearsParsed as number) ? (yearsParsed as number) : null,
      website: website ? String(website).trim() : null,
      interestedIn2026: Boolean(interestedIn2026),
      interestedIn2027: Boolean(interestedIn2027),
      offering: String(offering).trim(),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Instructor waitlist error:", error);
    return NextResponse.json({ error: "Failed to submit application" }, { status: 500 });
  }
}
