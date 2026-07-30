import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { leads } from "@/lib/schema";

export async function POST(req: Request) {
  try {
    const { name, email, years, story } = await req.json();

    if (!name || !email || !story) {
      return NextResponse.json(
        { error: "Name, email, and story are required." },
        { status: 400 }
      );
    }

    const yearLabel = years?.length ? `[Years attended: ${years.join(", ")}] ` : "";
    const db = getDb();
    await db.insert(leads).values({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: null,
      message: `${yearLabel}${story.trim()}`,
      source: "story_submission",
    });

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("Story submission error:", e);
    return NextResponse.json(
      { error: "Failed to save your story. Please try again." },
      { status: 500 }
    );
  }
}
