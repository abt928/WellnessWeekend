import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import crypto from "crypto";

const COOKIE_NAME = "admin-session";
const SESSION_TTL_MS = 60 * 60 * 24 * 1000; // 24h

export type AdminRole = "owner" | "alice" | "chris";

const ROLE_PASSWORDS: Array<{ env: string; role: AdminRole }> = [
  { env: "ADMIN_PASSWORD", role: "owner" },
  { env: "ALICE_PASSWORD", role: "alice" },
  { env: "CHRIS_PASSWORD", role: "chris" },
];

const VALID_ROLES = new Set<AdminRole>(["owner", "alice", "chris"]);

function getAdminSessionSecret(): string {
  return (
    process.env.ADMIN_SESSION_SECRET ||
    process.env.NEXTAUTH_SECRET ||
    "ww-admin-secret"
  );
}

/**
 * Parse and verify a signed admin session cookie.
 * Cookie format: `${role}:${expiry}:${hmac}` where
 * hmac = HMAC-SHA256(secret, `${role}:${expiry}`).
 * Returns the role, or null if invalid/expired/tampered.
 */
function parseAdminSession(cookieValue: string | undefined): AdminRole | null {
  if (!cookieValue) return null;
  try {
    const parts = cookieValue.split(":");
    if (parts.length !== 3) return null;
    const [role, expiryStr, hmac] = parts;
    if (!VALID_ROLES.has(role as AdminRole)) return null;
    const expiry = parseInt(expiryStr, 10);
    if (isNaN(expiry) || Date.now() > expiry) return null;

    const secret = getAdminSessionSecret();
    const expected = crypto
      .createHmac("sha256", secret)
      .update(`${role}:${expiry}`)
      .digest("hex");

    // Timing-safe comparison
    if (hmac.length !== expected.length) return null;
    const hmacBuf = Buffer.from(hmac, "hex");
    const expectedBuf = Buffer.from(expected, "hex");
    if (hmacBuf.length !== expectedBuf.length) return null;
    if (!crypto.timingSafeEqual(hmacBuf, expectedBuf)) return null;

    return role as AdminRole;
  } catch {
    return null;
  }
}

function buildAdminSession(role: AdminRole): string {
  const secret = getAdminSessionSecret();
  const expiry = Date.now() + SESSION_TTL_MS;
  const hmac = crypto
    .createHmac("sha256", secret)
    .update(`${role}:${expiry}`)
    .digest("hex");
  return `${role}:${expiry}:${hmac}`;
}

/** Returns the role of the authenticated admin, or null if not authenticated */
export function getAdminRole(req: NextRequest): AdminRole | null {
  return parseAdminSession(req.cookies.get(COOKIE_NAME)?.value);
}

export function isAdminAuthenticated(req: NextRequest): boolean {
  return getAdminRole(req) !== null;
}

export async function isAdminFromCookies(): Promise<boolean> {
  const jar = await cookies();
  return parseAdminSession(jar.get(COOKIE_NAME)?.value) !== null;
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

    let role: AdminRole | null = null;

    for (const entry of ROLE_PASSWORDS) {
      const pw = process.env[entry.env];
      if (pw && password === pw) {
        role = entry.role;
        break;
      }
    }

    if (!role) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }

    const res = NextResponse.json({ success: true, role });
    res.cookies.set(COOKIE_NAME, buildAdminSession(role), {
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
