import { NextRequest, NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";
import { isAdminAuthenticated } from "@/app/api/admin/auth/route";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  if (!isAdminAuthenticated(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) return NextResponse.json({ error: "DATABASE_URL not configured" }, { status: 500 });

  try {
    const sql = neon(dbUrl);

    const rows = await sql`
      SELECT email, created_at
      FROM newsletter
      ORDER BY created_at DESC
    `;

    const lines = [
      "Email,Signed Up",
      ...rows.map(r => `${r.email},${new Date(String(r.created_at)).toLocaleDateString("en-US")}`),
    ];

    return new NextResponse(lines.join("\n"), {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="wellness-weekend-newsletter-${new Date().toISOString().slice(0, 10)}.csv"`,
      },
    });
  } catch (e) {
    console.error("[export/newsletter GET]", e);
    return NextResponse.json({ error: "Failed to export" }, { status: 500 });
  }
}
