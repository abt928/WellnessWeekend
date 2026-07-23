import { NextRequest, NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";
import { isAdminAuthenticated } from "@/app/api/admin/auth/route";

export const dynamic = "force-dynamic";

async function getDb() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL not configured");
  const sql = neon(url);
  await sql`
    CREATE TABLE IF NOT EXISTS admin_tasks (
      id            SERIAL PRIMARY KEY,
      category      VARCHAR(50)  NOT NULL,
      entity_email  VARCHAR(255) NOT NULL,
      entity_name   VARCHAR(255),
      task_label    VARCHAR(100) NOT NULL DEFAULT 'confirmation_email',
      completed     BOOLEAN      NOT NULL DEFAULT FALSE,
      completed_at  TIMESTAMPTZ,
      notes         TEXT,
      created_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
      UNIQUE(category, entity_email, task_label)
    )
  `;
  return sql;
}

export async function GET(req: NextRequest) {
  if (!isAdminAuthenticated(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const sql = await getDb();
    const rows = await sql`SELECT * FROM admin_tasks ORDER BY category, entity_name`;
    return NextResponse.json(rows);
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  if (!isAdminAuthenticated(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { category, entity_email, entity_name, task_label, completed, notes } = await req.json();
  if (!category || !entity_email || !task_label) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }
  try {
    const sql = await getDb();
    const label = task_label ?? "confirmation_email";
    const completedAt = completed ? new Date().toISOString() : null;
    await sql`
      INSERT INTO admin_tasks (category, entity_email, entity_name, task_label, completed, completed_at, notes)
      VALUES (${category}, ${entity_email}, ${entity_name ?? null}, ${label}, ${!!completed}, ${completedAt}, ${notes ?? null})
      ON CONFLICT (category, entity_email, task_label)
      DO UPDATE SET completed = EXCLUDED.completed, completed_at = EXCLUDED.completed_at,
                    entity_name = EXCLUDED.entity_name, notes = EXCLUDED.notes
    `;
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
