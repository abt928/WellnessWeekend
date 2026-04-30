import { NextRequest, NextResponse } from "next/server";
import { getSquareClient, getLocationId } from "@/lib/square";
import { randomUUID } from "crypto";

export const dynamic = "force-dynamic";

interface CartItem {
  variationId: string;
  quantity: number;
  name: string;
}

export async function POST(req: NextRequest) {
  try {
    const { items, returnUrl } = (await req.json()) as {
      items: CartItem[];
      returnUrl?: string;
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

    const response = await client.checkout.paymentLinks.create({
      idempotencyKey: randomUUID(),
      order: {
        locationId,
        lineItems,
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

    return NextResponse.json({ checkoutUrl });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout" },
      { status: 500 }
    );
  }
}
