import { randomUUID } from "crypto";
import { neon } from "@neondatabase/serverless";
import { NextRequest, NextResponse } from "next/server";
import { isPromoActive } from "@/app/api/promo/route";
import { getMemberIdFromRequest } from "@/app/api/members/auth/route";
import { getSquareClient, getLocationId, STORE_CATEGORIES } from "@/lib/square";

export const dynamic = "force-dynamic";

const CANONICAL_ORIGIN = "https://www.wellnessweekendak.com";
const MAX_DISTINCT_ITEMS = 25;
const MAX_ITEM_QUANTITY = 20;
const MAX_TOTAL_QUANTITY = 50;
const allowedCategoryIds = new Set<string>(Object.values(STORE_CATEGORIES));

interface CartItem {
  variationId: string;
  quantity: number;
  name?: string;
}

interface ValidatedCartItem extends CartItem {
  priceCents: number;
  isTicket: boolean;
}

class CheckoutRequestError extends Error {
  constructor(
    message: string,
    readonly status: number = 400,
  ) {
    super(message);
    this.name = "CheckoutRequestError";
  }
}

function safeOrigin(value: string | undefined): string | null {
  if (!value) return null;
  try {
    const url = new URL(value);
    if (
      (url.protocol !== "https:" && url.protocol !== "http:") ||
      url.username ||
      url.password
    ) {
      return null;
    }
    return url.origin;
  } catch {
    return null;
  }
}

/**
 * Hosted checkout may return only to this deployment or an explicitly
 * configured/canonical deployment. Client input can select among those origins,
 * but cannot turn checkout into an open redirect.
 */
function getReturnOrigin(req: NextRequest, returnUrl: unknown): string {
  const requestOrigin = safeOrigin(req.url);
  const configuredOrigin = safeOrigin(process.env.NEXT_PUBLIC_BASE_URL);
  const allowedOrigins = new Set(
    [requestOrigin, configuredOrigin, CANONICAL_ORIGIN].filter(
      (origin): origin is string => Boolean(origin),
    ),
  );

  if (returnUrl !== undefined) {
    if (typeof returnUrl !== "string") {
      throw new CheckoutRequestError("Invalid return URL");
    }
    const requestedOrigin = safeOrigin(returnUrl);
    if (!requestedOrigin || !allowedOrigins.has(requestedOrigin)) {
      throw new CheckoutRequestError("Invalid return URL");
    }
    return requestedOrigin;
  }

  return configuredOrigin || requestOrigin || CANONICAL_ORIGIN;
}

function normalizeCart(rawItems: unknown): CartItem[] {
  if (!Array.isArray(rawItems) || rawItems.length === 0) {
    throw new CheckoutRequestError("Cart is empty");
  }
  if (rawItems.length > MAX_DISTINCT_ITEMS) {
    throw new CheckoutRequestError("Cart has too many items");
  }

  const quantities = new Map<string, number>();
  let totalQuantity = 0;

  for (const rawItem of rawItems) {
    if (!rawItem || typeof rawItem !== "object") {
      throw new CheckoutRequestError("Invalid cart item");
    }

    const { variationId, quantity, name } = rawItem as Partial<CartItem>;
    if (
      typeof variationId !== "string" ||
      variationId.length === 0 ||
      variationId.length > 100 ||
      !Number.isInteger(quantity) ||
      (quantity as number) < 1 ||
      (quantity as number) > MAX_ITEM_QUANTITY
    ) {
      throw new CheckoutRequestError("Invalid cart item");
    }

    const combinedQuantity = (quantities.get(variationId) || 0) + (quantity as number);
    if (combinedQuantity > MAX_ITEM_QUANTITY) {
      throw new CheckoutRequestError("Item quantity is too large");
    }
    quantities.set(variationId, combinedQuantity);
    totalQuantity += quantity as number;

    if (totalQuantity > MAX_TOTAL_QUANTITY) {
      throw new CheckoutRequestError("Cart quantity is too large");
    }

    if (name !== undefined && typeof name !== "string") {
      throw new CheckoutRequestError("Invalid cart item");
    }
  }

  return Array.from(quantities, ([variationId, quantity]) => ({
    variationId,
    quantity,
  }));
}

function isPresentAtLocation(
  object: {
    isDeleted?: boolean;
    presentAtAllLocations?: boolean;
    presentAtLocationIds?: string[];
    absentAtLocationIds?: string[];
  },
  locationId: string,
): boolean {
  if (object.isDeleted || object.absentAtLocationIds?.includes(locationId)) {
    return false;
  }
  return (
    object.presentAtAllLocations !== false ||
    Boolean(object.presentAtLocationIds?.includes(locationId))
  );
}

/** Validate every variation against the current Square catalog and location. */
async function validateCatalogItems(
  items: CartItem[],
  locationId: string,
): Promise<ValidatedCartItem[]> {
  const client = getSquareClient();
  const response = await client.catalog.batchGet({
    objectIds: items.map((item) => item.variationId),
    includeRelatedObjects: true,
    includeDeletedObjects: false,
  });

  const allObjects = [
    ...(response.objects || []),
    ...(response.relatedObjects || []),
  ];
  const parentItems = new Map(
    allObjects
      .filter((object) => object.type === "ITEM")
      .map((object) => [object.id, object] as const),
  );
  const variations = new Map(
    (response.objects || [])
      .filter((object) => object.type === "ITEM_VARIATION")
      .map((object) => [object.id, object] as const),
  );

  return items.map((item) => {
    const variation = variations.get(item.variationId);
    if (
      !variation ||
      variation.type !== "ITEM_VARIATION" ||
      !isPresentAtLocation(variation, locationId) ||
      variation.itemVariationData?.sellable === false
    ) {
      throw new CheckoutRequestError("Cart contains an unavailable item");
    }

    const parentId = variation.itemVariationData?.itemId;
    const parent = parentId ? parentItems.get(parentId) : undefined;
    if (
      !parent ||
      parent.type !== "ITEM" ||
      !isPresentAtLocation(parent, locationId)
    ) {
      throw new CheckoutRequestError("Cart contains an unavailable item");
    }

    const categoryIds = new Set(
      (parent.itemData?.categories || [])
        .map((category) => category.id)
        .filter((categoryId): categoryId is string => Boolean(categoryId)),
    );
    if (![...categoryIds].some((categoryId) => allowedCategoryIds.has(categoryId))) {
      throw new CheckoutRequestError("Cart contains an unavailable item");
    }

    const amount = Number(variation.itemVariationData?.priceMoney?.amount);
    if (!Number.isSafeInteger(amount) || amount <= 0) {
      throw new CheckoutRequestError("Cart contains an invalid item price");
    }

    return {
      ...item,
      priceCents: amount,
      isTicket: categoryIds.has(STORE_CATEGORIES.tickets),
    };
  });
}

/**
 * Re-derive the promo discount from Square-authoritative catalog prices.
 * Never trusts a client-supplied price or discount amount.
 */
function computePromoDiscountCents(
  code: string,
  items: ValidatedCartItem[],
): number {
  if (code.trim().toUpperCase() !== "MIDNIGHTSUN" || !isPromoActive()) return 0;

  let subtotal = 0;
  let totalTickets = 0;
  let cheapestTicket = Infinity;
  for (const item of items) {
    subtotal += item.priceCents * item.quantity;
    if (item.isTicket) {
      totalTickets += item.quantity;
      cheapestTicket = Math.min(cheapestTicket, item.priceCents);
    }
  }

  if (totalTickets < 2 || cheapestTicket === Infinity) return 0;
  return Math.min(Math.round(cheapestTicket * 0.5), subtotal);
}

function normalizeReferralCode(referralCode: unknown): string | undefined {
  if (referralCode === undefined || referralCode === null || referralCode === "") {
    return undefined;
  }
  if (typeof referralCode !== "string") {
    throw new CheckoutRequestError("Invalid referral code");
  }
  const normalized = referralCode.trim().toUpperCase();
  if (!/^[A-Z0-9_-]{1,20}$/.test(normalized)) {
    throw new CheckoutRequestError("Invalid referral code");
  }
  return normalized;
}

async function reserveRedemption(
  dbUrl: string,
  redemptionId: number,
  memberId: number,
): Promise<number> {
  const sql = neon(dbUrl);
  const rows = await sql`
    UPDATE member_redemptions AS redemption
    SET status = 'reserved', used_at = NOW()
    FROM members AS member
    WHERE redemption.id = ${redemptionId}
      AND redemption.member_code = member.code
      AND member.id = ${memberId}
      AND redemption.status = 'pending'
    RETURNING redemption.discount_cents
  `;
  if (rows.length === 0) {
    throw new CheckoutRequestError(
      "Redemption is unavailable or does not belong to this member",
      409,
    );
  }
  return Number(rows[0].discount_cents) || 0;
}

async function releaseRedemption(
  dbUrl: string,
  redemptionId: number,
  memberId: number,
): Promise<void> {
  const sql = neon(dbUrl);
  await sql`
    UPDATE member_redemptions AS redemption
    SET status = 'pending', used_at = NULL
    FROM members AS member
    WHERE redemption.id = ${redemptionId}
      AND redemption.member_code = member.code
      AND member.id = ${memberId}
      AND redemption.status = 'reserved'
  `;
}

export async function POST(req: NextRequest) {
  let reservation:
    | { dbUrl: string; redemptionId: number; memberId: number }
    | null = null;

  try {
    const body = (await req.json()) as Record<string, unknown>;
    const items = normalizeCart(body?.items);
    const returnOrigin = getReturnOrigin(req, body?.returnUrl);
    const referralCode = normalizeReferralCode(body?.referralCode);
    const memberId = getMemberIdFromRequest(req);

    const client = getSquareClient();
    const locationId = getLocationId();
    const validatedItems = await validateCatalogItems(items, locationId);

    let discountCents = 0;
    let redemptionId: number | undefined;
    if (body?.redemptionId !== undefined) {
      if (
        !Number.isInteger(body.redemptionId) ||
        (body.redemptionId as number) <= 0
      ) {
        throw new CheckoutRequestError("Invalid redemption");
      }
      if (!memberId) {
        throw new CheckoutRequestError("Sign in to use this redemption", 401);
      }
      const dbUrl = process.env.DATABASE_URL;
      if (!dbUrl) {
        throw new Error("DATABASE_URL is not set");
      }

      redemptionId = body.redemptionId as number;
      discountCents = await reserveRedemption(dbUrl, redemptionId, memberId);
      reservation = { dbUrl, redemptionId, memberId };
    }

    const lineItems = validatedItems.map((item) => ({
      catalogObjectId: item.variationId,
      quantity: String(item.quantity),
    }));

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const orderDiscounts: any[] = [];
    if (redemptionId && discountCents > 0) {
      orderDiscounts.push({
        name: "Points Reward",
        type: "FIXED_AMOUNT",
        amountMoney: { amount: BigInt(discountCents), currency: "USD" },
        scope: "ORDER",
      });
    }

    if (body?.promoCode !== undefined) {
      if (typeof body.promoCode !== "string") {
        throw new CheckoutRequestError("Invalid promo code");
      }
      const promoCents = computePromoDiscountCents(body.promoCode, validatedItems);
      if (promoCents > 0) {
        orderDiscounts.push({
          name: "Midnight Sun Sale — 2nd ticket 50% off",
          type: "FIXED_AMOUNT",
          amountMoney: { amount: BigInt(promoCents), currency: "USD" },
          scope: "ORDER",
        });
      }
    }

    const metadata: Record<string, string> = {};
    if (memberId) metadata.member_id = String(memberId);
    if (redemptionId) metadata.member_redemption_id = String(redemptionId);

    const response = await client.checkout.paymentLinks.create({
      idempotencyKey: randomUUID(),
      order: {
        locationId,
        lineItems,
        ...(referralCode ? { referenceId: `ref:${referralCode}` } : {}),
        ...(Object.keys(metadata).length > 0 ? { metadata } : {}),
        ...(orderDiscounts.length > 0 ? { discounts: orderDiscounts } : {}),
      },
      checkoutOptions: {
        redirectUrl: new URL("/thank-you", returnOrigin).toString(),
        askForShippingAddress: false,
      },
    });

    const checkoutUrl = response.paymentLink?.url;
    if (!checkoutUrl) {
      throw new Error("No checkout URL returned");
    }

    // The reservation remains reserved until the signed COMPLETED payment
    // webhook changes it to used. If link creation failed, the catch block
    // below returns it to pending so the member can retry.
    reservation = null;

    // Keep this order id contract: thank-you and the webhook both derive
    // `purchase_<orderId>` so Meta/TikTok purchase events dedupe.
    return NextResponse.json({
      checkoutUrl,
      orderId: response.paymentLink?.orderId,
    });
  } catch (error) {
    if (reservation) {
      try {
        await releaseRedemption(
          reservation.dbUrl,
          reservation.redemptionId,
          reservation.memberId,
        );
      } catch (releaseError) {
        console.error("[checkout] Failed to release redemption:", releaseError);
      }
    }

    if (error instanceof CheckoutRequestError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout" },
      { status: 500 },
    );
  }
}
