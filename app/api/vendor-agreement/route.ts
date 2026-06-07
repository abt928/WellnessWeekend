import { NextRequest, NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";
import { getSquareClient, getLocationId } from "@/lib/square";
import { randomUUID } from "crypto";

export const dynamic = "force-dynamic";

const SPACE_LABELS: Record<string, string> = {
  "1day-10x10": "Vendor Space — 1 Day 10×10 ft",
  "3day-10x10": "Vendor Space — 3 Days 10×10 ft",
  "3day-10x20": "Vendor Space — 3 Days 10×20 ft",
  "sponsor":    "Sponsor / Partner Space",
};

async function ensureTable(sql: ReturnType<typeof neon>) {
  await sql`
    CREATE TABLE IF NOT EXISTS vendor_agreements (
      id                SERIAL PRIMARY KEY,
      vendor_name       VARCHAR(255) NOT NULL,
      business_name     VARCHAR(255),
      contact_name      VARCHAR(255) NOT NULL,
      email             VARCHAR(255) NOT NULL,
      phone             VARCHAR(50)  NOT NULL,
      website           VARCHAR(500),
      category          VARCHAR(255) NOT NULL,
      description       TEXT         NOT NULL,
      space_type        VARCHAR(50)  NOT NULL,
      selected_days     TEXT,
      electricity       VARCHAR(10)  NOT NULL,
      printed_name      VARCHAR(255) NOT NULL,
      sig_date          VARCHAR(50)  NOT NULL,
      signature_data    TEXT,
      price_cents       INTEGER      NOT NULL DEFAULT 0,
      payment_status    VARCHAR(20)  NOT NULL DEFAULT 'pending',
      square_payment_id VARCHAR(100),
      created_at        TIMESTAMPTZ  NOT NULL DEFAULT NOW()
    )
  `;
}

export async function POST(req: NextRequest) {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    return NextResponse.json({ error: "Database not configured" }, { status: 500 });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const {
    vendorName, businessName, contactName, email, phone, website,
    category, description, spaceType, selectedDays, electricity,
    printedName, sigDate, signatureDataUrl, priceCents,
  } = body as {
    vendorName: string; businessName: string; contactName: string;
    email: string; phone: string; website: string;
    category: string; description: string; spaceType: string;
    selectedDays: string[]; electricity: string;
    printedName: string; sigDate: string; signatureDataUrl: string;
    priceCents: number;
  };

  if (!vendorName || !contactName || !email || !phone || !category || !description || !spaceType || !electricity || !printedName) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const sql = neon(dbUrl);

  try {
    await ensureTable(sql);

    const daysStr = Array.isArray(selectedDays) ? selectedDays.join(", ") : "";

    const rows = await sql`
      INSERT INTO vendor_agreements (
        vendor_name, business_name, contact_name, email, phone, website,
        category, description, space_type, selected_days, electricity,
        printed_name, sig_date, signature_data, price_cents
      ) VALUES (
        ${vendorName}, ${businessName || null}, ${contactName}, ${email}, ${phone}, ${website || null},
        ${category}, ${description}, ${spaceType}, ${daysStr || null}, ${electricity},
        ${printedName}, ${sigDate}, ${signatureDataUrl || null}, ${priceCents}
      )
      RETURNING id
    `;

    const agreementId = (rows[0]?.id ?? 0) as number;
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://wellnessweekendak.com";

    // Sponsor spaces — no payment needed
    if (priceCents === 0) {
      await sql`UPDATE vendor_agreements SET payment_status = 'confirmed' WHERE id = ${agreementId}`;
      return NextResponse.json({ redirectUrl: `${baseUrl}/vendors/confirmed` });
    }

    // Paid spaces — create Square checkout link with a custom ad-hoc line item
    const client = getSquareClient();
    const locationId = getLocationId();
    const spaceLabel = SPACE_LABELS[spaceType] ?? "Vendor Space";

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const squareClient = client as any;
    const response = await squareClient.checkout.paymentLinks.create({
      idempotencyKey: randomUUID(),
      order: {
        locationId,
        lineItems: [
          {
            name: spaceLabel,
            quantity: "1",
            basePriceMoney: {
              amount: BigInt(priceCents),
              currency: "USD",
            },
          },
        ],
        referenceId: `vendor:${agreementId}`,
      },
      checkoutOptions: {
        redirectUrl: `${baseUrl}/vendors/confirmed`,
        askForShippingAddress: false,
      },
    });

    const checkoutUrl = response.paymentLink?.url as string | undefined;
    if (!checkoutUrl) {
      throw new Error("Square did not return a checkout URL");
    }

    return NextResponse.json({ redirectUrl: checkoutUrl });
  } catch (err) {
    console.error("[vendor-agreement] Error:", err);
    return NextResponse.json({ error: "Failed to save agreement. Please try again." }, { status: 500 });
  }
}
