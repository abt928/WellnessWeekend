import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { sponsors } from "@/lib/schema";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, company, website, interests, budgetRange, goals, source } = body;

    if (!name || !email || !company || !budgetRange || !goals) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const interestsList = Array.isArray(interests) ? interests : [];
    if (interestsList.length === 0) {
      return NextResponse.json({ error: "Select at least one activation interest" }, { status: 400 });
    }

    const db = getDb();
    await db.insert(sponsors).values({
      name: String(name).trim(),
      email: String(email).trim().toLowerCase(),
      phone: phone ? String(phone).trim() : null,
      company: String(company).trim(),
      website: website ? String(website).trim() : null,
      interests: interestsList.map(String).join(", "),
      budgetRange: String(budgetRange),
      goals: String(goals).trim(),
      source: source ? String(source).trim() : null,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Sponsor inquiry error:", error);
    return NextResponse.json({ error: "Failed to submit inquiry" }, { status: 500 });
  }
}
