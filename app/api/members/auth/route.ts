import { NextRequest, NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";
import { verifyPassword, hashPassword, generateAffiliateCode } from "@/lib/password";
import crypto from "crypto";

export const dynamic = "force-dynamic";

const COOKIE_NAME = "member-session";

function getMemberSessionSecret(): string {
  return (
    process.env.MEMBER_SESSION_SECRET ||
    process.env.NEXTAUTH_SECRET ||
    "ww-member-secret"
  );
}

/**
 * Parse and verify the member session cookie.
 * Cookie format: `${memberId}:${expiry}:${hmac}`
 * Returns the memberId number, or null if invalid/expired.
 */
export function parseMemberSession(cookieValue: string): number | null {
  try {
    const parts = cookieValue.split(":");
    if (parts.length !== 3) return null;
    const [memberIdStr, expiryStr, hmac] = parts;
    const memberId = parseInt(memberIdStr, 10);
    const expiry = parseInt(expiryStr, 10);
    if (isNaN(memberId) || isNaN(expiry)) return null;
    if (Date.now() > expiry) return null;

    const secret = getMemberSessionSecret();
    const payload = `${memberId}:${expiry}`;
    const expected = crypto
      .createHmac("sha256", secret)
      .update(payload)
      .digest("hex");

    // Timing-safe comparison
    if (hmac.length !== expected.length) return null;
    const hmacBuf = Buffer.from(hmac, "hex");
    const expectedBuf = Buffer.from(expected, "hex");
    if (hmacBuf.length !== expectedBuf.length) return null;
    if (!crypto.timingSafeEqual(hmacBuf, expectedBuf)) return null;

    return memberId;
  } catch {
    return null;
  }
}

/**
 * Extract and verify member session from request cookies.
 * Returns memberId or null.
 */
export function getMemberIdFromRequest(req: NextRequest): number | null {
  const cookieValue = req.cookies.get(COOKIE_NAME)?.value;
  if (!cookieValue) return null;
  return parseMemberSession(cookieValue);
}

function buildSessionCookie(memberId: number): string {
  const secret = getMemberSessionSecret();
  const expiry = Date.now() + 30 * 24 * 60 * 60 * 1000;
  const payload = `${memberId}:${expiry}`;
  const hmac = crypto
    .createHmac("sha256", secret)
    .update(payload)
    .digest("hex");
  return `${memberId}:${expiry}:${hmac}`;
}

/** GET — check session and return member info */
export async function GET(req: NextRequest) {
  const memberId = getMemberIdFromRequest(req);
  if (!memberId) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) throw new Error("DATABASE_URL not set");
  const sql = neon(dbUrl);

  const rows = await sql`
    SELECT id, name, email, code, points_balance, created_at
    FROM members WHERE id = ${memberId}
  `;
  if (rows.length === 0) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }
  const m = rows[0];
  return NextResponse.json({
    ok: true,
    member: {
      id: m.id,
      name: m.name,
      email: m.email,
      code: m.code,
      pointsBalance: m.points_balance,
    },
  });
}

/** POST — login with email + password */
export async function POST(req: NextRequest) {
  try {
    const { email, password } = (await req.json()) as {
      email?: string;
      password?: string;
    };

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password required" },
        { status: 400 }
      );
    }

    const dbUrl = process.env.DATABASE_URL;
    if (!dbUrl) throw new Error("DATABASE_URL not set");
    const sql = neon(dbUrl);

    const rows = await sql`
      SELECT id, name, email, code, password_hash, points_balance
      FROM members WHERE email = ${email.trim().toLowerCase()}
    `;

    if (rows.length === 0) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    const m = rows[0];
    if (!verifyPassword(password, m.password_hash)) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    const cookieValue = buildSessionCookie(m.id);
    const res = NextResponse.json({
      ok: true,
      member: {
        id: m.id,
        name: m.name,
        email: m.email,
        code: m.code,
        pointsBalance: m.points_balance,
      },
    });
    res.cookies.set(COOKIE_NAME, cookieValue, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });
    return res;
  } catch (error) {
    console.error("[members/auth POST] error:", error);
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}

/** DELETE — logout */
export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.delete(COOKIE_NAME);
  return res;
}
