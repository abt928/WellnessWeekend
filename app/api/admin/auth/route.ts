import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const COOKIE_NAME = "admin-session";

const ROLE_PASSWORDS: Array<{ env: string; token: string; role: AdminRole }> = [
  { env: "ADMIN_PASSWORD",   token: "ww-role-owner",   role: "owner" },
  { env: "ALICE_PASSWORD",   token: "ww-role-alice",   role: "alice" },
  { env: "CHRIS_PASSWORD",   token: "ww-role-chris",   role: "chris" },
  { env: "ASHLEIGH_PASSWORD", token: "ww-role-ashleigh", role: "ashleigh" },
];

export type AdminRole = "owner" | "alice" | "chris" | "ashleigh";

const TOKEN_TO_ROLE: Record<string, AdminRole> = {
  "ww-role-owner":   "owner",
  "ww-role-alice":   "alice",
  "ww-role-chris":   "chris",
  "ww-role-ashleigh": "ashleigh",
};

/** Returns the role of the authenticated admin, or null if not authenticated */
export function getAdminRole(req: NextRequest): AdminRole | null {
  const cookie = req.cookies.get(COOKIE_NAME);
  return TOKEN_TO_ROLE[cookie?.value ?? ""] ?? null;
}

export function isAdminAuthenticated(req: NextRequest): boolean {
  return getAdminRole(req) !== null;
}

export async function isAdminFromCookies(): Promise<boolean> {
  const jar = await cookies();
  const cookie = jar.get(COOKIE_NAME);
  return TOKEN_TO_ROLE[cookie?.value ?? ""] !== undefined;
}

/** GET — return current role (used by admin page on mount) */
export async function GET(req: NextRequest) {
  const role = getAdminRole(req);
  if (!role) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json({ role });
}

export async function POST(req: NextRequest) {
  try {
    const { password } = await req.json();

    let sessionToken: string | null = null;
    let role: AdminRole | null = null;

    for (const entry of ROLE_PASSWORDS) {
      const pw = process.env[entry.env];
      if (pw && password === pw) {
        sessionToken = entry.token;
        role = entry.role;
        break;
      }
    }

    if (!sessionToken || !role) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }

    const res = NextResponse.json({ success: true, role });
    res.cookies.set(COOKIE_NAME, sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24,
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
