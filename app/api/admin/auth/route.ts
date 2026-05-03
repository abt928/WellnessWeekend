import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const ADMIN_PASSWORD = "wellness26$";
const SESSION_TOKEN = "ww-admin-ok"; // simple static token
const COOKIE_NAME = "admin-session";

export async function POST(req: NextRequest) {
  try {
    const { password } = await req.json();

    if (password !== ADMIN_PASSWORD) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }

    const res = NextResponse.json({ success: true });
    res.cookies.set(COOKIE_NAME, SESSION_TOKEN, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24, // 24 hours
    });
    return res;
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
}

export async function DELETE() {
  const res = NextResponse.json({ success: true });
  res.cookies.delete(COOKIE_NAME);
  return res;
}

/** Helper to validate admin session — used by other admin routes */
export function isAdminAuthenticated(req: NextRequest): boolean {
  const cookie = req.cookies.get(COOKIE_NAME);
  return cookie?.value === SESSION_TOKEN;
}

/** Standalone helper for route handlers that receive cookies() */
export async function isAdminFromCookies(): Promise<boolean> {
  const jar = await cookies();
  const cookie = jar.get(COOKIE_NAME);
  return cookie?.value === SESSION_TOKEN;
}
