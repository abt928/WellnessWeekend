import { NextRequest, NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";
import { hashPassword, generateAffiliateCode } from "@/lib/password";
import crypto from "crypto";

export const dynamic = "force-dynamic";

function getMemberSessionSecret(): string {
  const secret =
    process.env.MEMBER_SESSION_SECRET || process.env.NEXTAUTH_SECRET;
  if (!secret) {
    throw new Error("MEMBER_SESSION_SECRET is not configured");
  }
  return secret;
}

function buildSessionCookie(memberId: number): string {
  const secret = getMemberSessionSecret();
  const expiry = Date.now() + 30 * 24 * 60 * 60 * 1000; // 30 days
  const payload = `${memberId}:${expiry}`;
  const hmac = crypto
    .createHmac("sha256", secret)
    .update(payload)
    .digest("hex");
  return `${memberId}:${expiry}:${hmac}`;
}

export async function POST(req: NextRequest) {
  try {
    // Fail before any database mutation when sessions cannot be signed.
    getMemberSessionSecret();

    const { name, email, password, referralCode } = (await req.json()) as {
      name?: string;
      email?: string;
      password?: string;
      referralCode?: string;
    };

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email, and password are required" },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    const dbUrl = process.env.DATABASE_URL;
    if (!dbUrl) throw new Error("DATABASE_URL not set");
    const sql = neon(dbUrl);

    // Ensure members table exists
    await sql`
      CREATE TABLE IF NOT EXISTS members (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        code VARCHAR(20) NOT NULL UNIQUE,
        password_hash TEXT NOT NULL,
        points_balance INTEGER NOT NULL DEFAULT 0,
        created_at TIMESTAMPTZ DEFAULT NOW()
      )
    `;
    await sql`
      CREATE TABLE IF NOT EXISTS member_referrals (
        id SERIAL PRIMARY KEY,
        referrer_code VARCHAR(20) NOT NULL,
        referee_email VARCHAR(255) NOT NULL,
        points_earned INTEGER NOT NULL DEFAULT 50,
        created_at TIMESTAMPTZ DEFAULT NOW()
      )
    `;
    await sql`
      CREATE TABLE IF NOT EXISTS member_redemptions (
        id SERIAL PRIMARY KEY,
        member_code VARCHAR(20) NOT NULL,
        reward_type VARCHAR(20) NOT NULL,
        points_cost INTEGER NOT NULL,
        discount_cents INTEGER NOT NULL DEFAULT 0,
        status VARCHAR(20) NOT NULL DEFAULT 'pending',
        created_at TIMESTAMPTZ DEFAULT NOW(),
        used_at TIMESTAMPTZ
      )
    `;

    // Check email uniqueness
    const existing = await sql`
      SELECT id FROM members WHERE email = ${normalizedEmail}
    `;
    if (existing.length > 0) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 409 }
      );
    }

    const passwordHash = hashPassword(password);
    const code = generateAffiliateCode(name);

    // Insert member
    const inserted = await sql`
      INSERT INTO members (name, email, code, password_hash, points_balance)
      VALUES (${name.trim()}, ${normalizedEmail}, ${code}, ${passwordHash}, 0)
      RETURNING id, code
    `;

    const member = inserted[0];

    // Handle referral: check if referralCode belongs to an existing member
    if (referralCode && referralCode.trim()) {
      const referrer = await sql`
        SELECT id, code FROM members WHERE code = ${referralCode.trim().toUpperCase()}
      `;
      if (referrer.length > 0) {
        // Insert referral record
        await sql`
          INSERT INTO member_referrals (referrer_code, referee_email, points_earned)
          VALUES (${referralCode.trim().toUpperCase()}, ${normalizedEmail}, 50)
        `;
        // Credit 50 points to referrer
        await sql`
          UPDATE members SET points_balance = points_balance + 50
          WHERE code = ${referralCode.trim().toUpperCase()}
        `;
      }
    }

    // Set session cookie
    const cookieValue = buildSessionCookie(member.id);
    const res = NextResponse.json({ ok: true, code: member.code });
    res.cookies.set("member-session", cookieValue, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });
    return res;
  } catch (error) {
    console.error("[members/signup] error:", error);
    return NextResponse.json(
      { error: "Signup failed. Please try again." },
      { status: 500 }
    );
  }
}
