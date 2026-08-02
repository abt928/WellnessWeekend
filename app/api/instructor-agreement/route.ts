import { NextRequest, NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

export const dynamic = "force-dynamic";

async function ensureTable(sql: ReturnType<typeof neon>) {
  await sql`
    CREATE TABLE IF NOT EXISTS instructor_agreements (
      id              SERIAL PRIMARY KEY,
      form_type       VARCHAR(50)  NOT NULL DEFAULT 'wellness-weekend',
      full_name       VARCHAR(255) NOT NULL,
      email           VARCHAR(255) NOT NULL,
      phone           VARCHAR(50),
      modality        VARCHAR(255) NOT NULL,
      session_title   VARCHAR(500),
      website         VARCHAR(500),
      bio             TEXT,
      heard_from      TEXT,
      brand_partner   VARCHAR(10),
      printed_name    VARCHAR(255) NOT NULL,
      sig_date        VARCHAR(50)  NOT NULL,
      signature_data  TEXT,
      created_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW()
    )
  `;
  await sql`ALTER TABLE instructor_agreements ADD COLUMN IF NOT EXISTS form_type      VARCHAR(50) NOT NULL DEFAULT 'wellness-weekend'`;
  await sql`ALTER TABLE instructor_agreements ADD COLUMN IF NOT EXISTS session_title  VARCHAR(500)`;
  await sql`ALTER TABLE instructor_agreements ADD COLUMN IF NOT EXISTS brand_partner  VARCHAR(10)`;
  await sql`ALTER TABLE instructor_agreements ADD COLUMN IF NOT EXISTS bio            TEXT`;
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
    formType, fullName, email, phone, modality, sessionTitle,
    website, bio, heardFrom, brandPartner,
    printedName, sigDate, signatureDataUrl,
  } = body as {
    formType: string; fullName: string; email: string; phone: string;
    modality: string; sessionTitle: string; website: string; bio: string;
    heardFrom: string; brandPartner: string;
    printedName: string; sigDate: string; signatureDataUrl: string;
  };

  if (!fullName?.trim() || !email?.trim() || !modality?.trim() || !printedName?.trim()) {
    return NextResponse.json({ error: "Name, email, modality, and printed name are required." }, { status: 400 });
  }

  const sql = neon(dbUrl);

  try {
    await ensureTable(sql);

    await sql`
      INSERT INTO instructor_agreements (
        form_type, full_name, email, phone, modality, session_title,
        website, bio, heard_from, brand_partner,
        printed_name, sig_date, signature_data
      ) VALUES (
        ${formType || "wellness-weekend"},
        ${fullName.trim()}, ${email.trim()},
        ${phone?.trim() || null}, ${modality.trim()},
        ${sessionTitle?.trim() || null}, ${website?.trim() || null},
        ${bio?.trim() || null}, ${heardFrom?.trim() || null},
        ${brandPartner || null},
        ${printedName.trim()}, ${sigDate}, ${signatureDataUrl || null}
      )
    `;

    return NextResponse.json({ ok: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[instructor-agreement] Error:", msg);
    return NextResponse.json({ error: `Submission failed: ${msg}` }, { status: 500 });
  }
}
