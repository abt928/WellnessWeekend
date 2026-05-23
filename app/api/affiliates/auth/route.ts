import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { affiliates } from "@/lib/schema";
import { verifyPassword } from "@/lib/password";
import { eq } from "drizzle-orm";

const COOKIE_NAME = "affiliate-session";

export function getAffiliateCode(req: NextRequest): string | null {
  return req.cookies.get(COOKIE_NAME)?.value ?? null;
}

/** GET — check session and return affiliate info */
export async function GET(req: NextRequest) {
  const code = getAffiliateCode(req);
  if (!code) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const db = getDb();
  const [affiliate] = await db
    .select({
      id: affiliates.id,
      name: affiliates.name,
      email: affiliates.email,
      code: affiliates.code,
      company: affiliates.company,
      website: affiliates.website,
      commissionPct: affiliates.commissionPct,
      status: affiliates.status,
    })
    .from(affiliates)
    .where(eq(affiliates.code, code));

  if (!affiliate) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  return NextResponse.json({ affiliate });
}

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password required" }, { status: 400 });
    }

    const db = getDb();
    const [affiliate] = await db
      .select()
      .from(affiliates)
      .where(eq(affiliates.email, email.trim().toLowerCase()));

    if (!affiliate || !verifyPassword(password, affiliate.passwordHash)) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    if (affiliate.status === "inactive") {
      return NextResponse.json({ error: "Your account has been deactivated. Contact us for help." }, { status: 403 });
    }

    const res = NextResponse.json({
      success: true,
      affiliate: {
        name: affiliate.name,
        email: affiliate.email,
        code: affiliate.code,
        company: affiliate.company,
        commissionPct: affiliate.commissionPct,
        status: affiliate.status,
      },
    });

    res.cookies.set(COOKIE_NAME, affiliate.code, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });
    return res;
  } catch {
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}

export async function DELETE() {
  const res = NextResponse.json({ success: true });
  res.cookies.delete(COOKIE_NAME);
  return res;
}
