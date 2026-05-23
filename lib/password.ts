import crypto from "crypto";

export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.createHmac("sha256", salt).update(password).digest("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const computed = crypto.createHmac("sha256", salt).update(password).digest("hex");
  return crypto.timingSafeEqual(Buffer.from(computed, "hex"), Buffer.from(hash, "hex"));
}

export function generateAffiliateCode(name: string): string {
  const base = name
    .split(/\s+/)[0]
    .toUpperCase()
    .replace(/[^A-Z]/g, "")
    .slice(0, 5);
  const suffix = crypto.randomBytes(2).toString("hex").toUpperCase();
  return `${base || "AFF"}${suffix}`;
}
