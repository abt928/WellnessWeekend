import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { leads } from "@/lib/schema";

export async function POST(req: Request) {
  try {
    const { name, email, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required." },
        { status: 400 }
      );
    }

    const db = getDb();
    await db.insert(leads).values({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      message: message.trim(),
      source: "message_form",
    });

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("Lead submission error:", e);
    return NextResponse.json(
      { error: "Failed to save your message. Please try again." },
      { status: 500 }
    );
  }
}
