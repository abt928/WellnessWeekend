import { NextRequest, NextResponse } from "next/server";
import { getSquareClient, getLocationId } from "@/lib/square";
import { randomUUID } from "crypto";
import { neon } from "@neondatabase/serverless";

export const dynamic = "force-dynamic";

interface CartItem {
  variationId: string;
  quantity: number;
  name: string;
}

export async function POST(req: NextRequest) {
  try {
    const { items, returnUrl, referralCode, redemptionId } = (await req.json()) as {
      items: CartItem[];
      returnUrl?: string;
      referralCode?: string;
      redemptionId?: number;
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

    const baseUrl = returnUrl || process.env.NEXT_PUBLIC_BASE_URL || "https://wellnessweekend.com";

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

    return NextResponse.json({ checkoutUrl });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout" },
      { status: 500 }
    );
  }
}
