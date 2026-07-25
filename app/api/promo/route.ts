import { NextRequest, NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

export const dynamic = "force-dynamic";

interface CartEntry {
  variationId: string;
  name: string;
  price: number;
  quantity: number;
}

function isMidnightSunActive(): boolean {
  const now = new Date();
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Anchorage",
    year: "numeric", month: "2-digit", day: "2-digit",
  }).formatToParts(now);
  const y = Number(parts.find(p => p.type === "year")?.value);
  const m = Number(parts.find(p => p.type === "month")?.value);
  const d = Number(parts.find(p => p.type === "day")?.value);
  // Active June 21 – July 7, 2026 (inclusive) Alaska time
  if (y !== 2026) return false;
  if (m === 6 && d >= 21) return true;
  if (m === 7 && d <= 7) return true;
  return false;
}

export async function POST(req: NextRequest) {
  try {
    const { code, cart } = (await req.json()) as { code: string; cart: CartEntry[] };

    if (!code || !code.trim()) {
      return NextResponse.json({ valid: false, message: "Enter a promo code." });
    }

    const upper = code.trim().toUpperCase();

    // ── MIDNIGHTSUN promotional code ────────────────────────────────────────
    if (upper === "MIDNIGHTSUN") {
      if (!isMidnightSunActive()) {
        return NextResponse.json({ valid: false, message: "This promo has ended." });
      }

      const ticketItems = (cart ?? []).filter(c => /pass|ticket/i.test(c.name));
      const totalTickets = ticketItems.reduce((n, c) => n + c.quantity, 0);

      if (totalTickets < 2) {
        return NextResponse.json({
          valid: false,
          message: "Add 2 or more tickets to use this code.",
        });
      }

      const cheapestCents = Math.min(...ticketItems.map(c => c.price));
      const discountCents = Math.round(cheapestCents * 0.5);

      return NextResponse.json({
        valid: true,
        code: "MIDNIGHTSUN",
        label: "Midnight Sun Sale — 2nd ticket 50% off",
        discountCents,
        discountDisplay: `$${(discountCents / 100).toFixed(2)}`,
        message: `You save $${(discountCents / 100).toFixed(2)} — happy summer!`,
      });
    }

    // ── Affiliate / partner codes ────────────────────────────────────────────
    const dbUrl = process.env.DATABASE_URL;
    if (dbUrl) {
      try {
        const sql = neon(dbUrl);
        const rows = await sql`
          SELECT code, commission_pct, name, company
          FROM affiliates
          WHERE UPPER(code) = ${upper}
            AND status = 'active'
          LIMIT 1
        `;

        if (rows.length > 0) {
          const aff = rows[0];
          const commissionPct = aff.commission_pct as number;
          const partnerName = (aff.company || aff.name) as string;

          // Apply discount to entire cart total
          const totalCents = (cart ?? []).reduce(
            (sum, c) => sum + c.price * c.quantity,
            0
          );
          const discountCents = Math.round(totalCents * commissionPct / 100);

          return NextResponse.json({
            valid: true,
            code: aff.code as string,
            label: `${commissionPct}% off — ${partnerName}`,
            discountCents,
            discountDisplay: `$${(discountCents / 100).toFixed(2)}`,
            message: `${commissionPct}% partner discount applied!`,
            isAffiliate: true,
          });
        }
      } catch (e) {
        console.error("[promo] Affiliate lookup error:", e);
      }
    }

    return NextResponse.json({ valid: false, message: "Invalid promo code." });
  } catch {
    return NextResponse.json({ valid: false, message: "Something went wrong." });
  }
}
