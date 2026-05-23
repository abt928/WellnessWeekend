import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { affiliates } from "@/lib/schema";
import { hashPassword, generateAffiliateCode } from "@/lib/password";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, company, website, description, password } = body;

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Name, email, and password are required" }, { status: 400 });
    }
    if (password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();
    const db = getDb();

    const code = generateAffiliateCode(name);
    const passwordHash = hashPassword(password);

    await db.insert(affiliates).values({
      name: name.trim(),
      email: cleanEmail,
      code,
      company: company?.trim() || null,
      website: website?.trim() || null,
      description: description?.trim() || null,
      passwordHash,
      status: "pending",
      commissionPct: 10,
    });

    return NextResponse.json({ success: true, message: "Application submitted. We'll review and be in touch." });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "";
    if (msg.includes("unique") || msg.includes("duplicate")) {
      return NextResponse.json({ error: "An application with this email already exists" }, { status: 409 });
    }
    console.error("Affiliate apply error:", e);
    return NextResponse.json({ error: "Failed to submit application" }, { status: 500 });
  }
}
