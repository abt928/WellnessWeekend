import { NextRequest, NextResponse } from "next/server";
import { getSquareClient, getLocationId, STORE_CATEGORIES } from "@/lib/square";
import { isPromoActive } from "@/app/api/promo/route";
import { randomUUID } from "crypto";
import { neon } from "@neondatabase/serverless";

export const dynamic = "force-dynamic";

interface CartItem {
  variationId: string;
  quantity: number;
  name: string;
}

/**
 * Re-derive the promo discount server-side from Square-authoritative prices.
 * Never trusts a client-supplied discount amount. Returns the discount in
 * cents (0 when the code is invalid, expired, or the cart does not qualify).
 */
async function computePromoDiscountCents(
  code: string,
  items: CartItem[],
): Promise<number> {
  // Only the Midnight Sun code is recognized, and only within its active window.
  if (code.trim().toUpperCase() !== "MIDNIGHTSUN" || !isPromoActive()) return 0;

  const client = getSquareClient();
  const catalog = await client.catalog.list({ types: "ITEM" });

  const priceByVar = new Map<string, number>();
  const ticketVarIds = new Set<string>();
  for await (const obj of catalog) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const item = obj as any;
    const d = item.itemData;
    if (!d) continue;
    const isTicket = d.categories?.[0]?.id === STORE_CATEGORIES.tickets;
    for (const v of d.variations || []) {
      const amount = Number(v.itemVariationData?.priceMoney?.amount);
      if (!v.id || !(amount > 0)) continue;
      priceByVar.set(v.id, amount);
      if (isTicket) ticketVarIds.add(v.id);
    }
  }

  let subtotal = 0;
  let totalTickets = 0;
  let cheapestTicket = Infinity;
  for (const it of items) {
    const price = priceByVar.get(it.variationId);
    if (price == null) continue;
    subtotal += price * it.quantity;
    if (ticketVarIds.has(it.variationId)) {
      totalTickets += it.quantity;
      if (price < cheapestTicket) cheapestTicket = price;
    }
  }

  // 50% off the cheapest ticket, only when 2+ tickets are in the order.
  if (totalTickets < 2 || cheapestTicket === Infinity) return 0;
  return Math.min(Math.round(cheapestTicket * 0.5), subtotal);
}

export async function POST(req: NextRequest) {
  try {
    const { items, returnUrl, referralCode, redemptionId, promoCode } = (await req.json()) as {
      items: CartItem[];
      returnUrl?: string;
      referralCode?: string;
      redemptionId?: number;
      promoCode?: string;
    };

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    const client = getSquareClient();
    const locationId = getLocationId();

    const lineItems = items.map((item) => ({
      catalogObjectId: item.variationId,
      quantity: String(item.quantity),
    }));

    const baseUrl = returnUrl || process.env.NEXT_PUBLIC_BASE_URL || "https://www.wellnessweekendak.com";

    // Look up pending redemption for discount
    let discountCents = 0;
    let validRedemption = false;

    if (redemptionId) {
      const dbUrl = process.env.DATABASE_URL;
      if (dbUrl) {
        try {
          const sql = neon(dbUrl);
          const rows = await sql`
            SELECT id, discount_cents FROM member_redemptions
            WHERE id = ${redemptionId} AND status = 'pending'
          `;
          if (rows.length > 0) {
            discountCents = rows[0].discount_cents as number;
            validRedemption = true;
          }
        } catch (e) {
          console.error("[checkout] Failed to look up redemption:", e);
        }
      }
    }

    // Build discounts array for cash redemption
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const orderDiscounts: any[] = [];
    if (validRedemption && discountCents > 0) {
      orderDiscounts.push({
        name: "Points Reward",
        type: "FIXED_AMOUNT",
        amountMoney: { amount: BigInt(discountCents), currency: "USD" },
        scope: "ORDER",
      });
    }
    if (promoCode) {
      try {
        const promoCents = await computePromoDiscountCents(promoCode, items);
        if (promoCents > 0) {
          orderDiscounts.push({
            name: "Midnight Sun Sale — 2nd ticket 50% off",
            type: "FIXED_AMOUNT",
            amountMoney: { amount: BigInt(promoCents), currency: "USD" },
            scope: "ORDER",
          });
        }
      } catch (e) {
        // Fail closed: if we cannot verify the promo, apply no discount.
        console.error("[checkout] Promo validation failed:", e);
      }
    }

    const response = await client.checkout.paymentLinks.create({
      idempotencyKey: randomUUID(),
      order: {
        locationId,
        lineItems,
        ...(referralCode ? { referenceId: `ref:${referralCode}` } : {}),
        ...(orderDiscounts.length > 0 ? { discounts: orderDiscounts } : {}),
      },
      checkoutOptions: {
        redirectUrl: `${baseUrl}/thank-you`,
        askForShippingAddress: false,
      },
    });

    const checkoutUrl = response.paymentLink?.url;
    if (!checkoutUrl) {
      throw new Error("No checkout URL returned");
    }

    // Square order id backing this payment link. The client stashes it so the
    // thank-you page and the Square webhook can derive a byte-identical Purchase
    // event_id (`purchase_${orderId}`) and dedupe the two conversion fires.
    const orderId = response.paymentLink?.orderId;

    // Mark redemption as used now that checkout link was successfully created
    if (validRedemption && redemptionId) {
      const dbUrl = process.env.DATABASE_URL;
      if (dbUrl) {
        try {
          const sql = neon(dbUrl);
          await sql`
            UPDATE member_redemptions
            SET status = 'used', used_at = NOW()
            WHERE id = ${redemptionId} AND status = 'pending'
          `;
        } catch (e) {
          console.error("[checkout] Failed to mark redemption as used:", e);
        }
      }
    }

    return NextResponse.json({ checkoutUrl, orderId });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout" },
      { status: 500 }
    );
  }
}
