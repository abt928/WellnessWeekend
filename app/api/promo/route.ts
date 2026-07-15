import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

interface CartEntry {
  variationId: string;
  name: string;
  price: number;
  quantity: number;
}

export function isPromoActive(): boolean {
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

    if (!code || code.trim().toUpperCase() !== "MIDNIGHTSUN") {
      return NextResponse.json({ valid: false, message: "Invalid promo code." });
    }

    if (!isPromoActive()) {
      return NextResponse.json({ valid: false, message: "This promo has ended." });
    }

    // Only tickets qualify — anything with "Pass" or "Ticket" in the name
    const ticketItems = (cart ?? []).filter(c => /pass|ticket/i.test(c.name));
    const totalTickets = ticketItems.reduce((n, c) => n + c.quantity, 0);

    if (totalTickets < 2) {
      return NextResponse.json({
        valid: false,
        message: "Add 2 or more tickets to use this code.",
      });
    }

    // 50% off the cheapest ticket in the cart
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
  } catch {
    return NextResponse.json({ valid: false, message: "Something went wrong." });
  }
}
