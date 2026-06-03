import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/app/api/admin/auth/route";

export const dynamic = "force-dynamic";

function parseCSV(text: string): { headers: string[]; rows: Record<string, string>[] } {
  const lines = text.replace(/\r/g, "").split("\n").filter(Boolean);
  if (lines.length === 0) return { headers: [], rows: [] };

  const parseRow = (line: string): string[] => {
    const cols: string[] = [];
    let cur = "", inQuote = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') {
        if (inQuote && line[i + 1] === '"') { cur += '"'; i++; }
        else inQuote = !inQuote;
      } else if (ch === "," && !inQuote) {
        cols.push(cur.trim()); cur = "";
      } else {
        cur += ch;
      }
    }
    cols.push(cur.trim());
    return cols;
  };

  const headers = parseRow(lines[0]);
  const rows = lines.slice(1).map((line) => {
    const vals = parseRow(line);
    const obj: Record<string, string> = {};
    headers.forEach((h, i) => { obj[h] = vals[i] ?? ""; });
    return obj;
  });

  return { headers, rows };
}

export async function GET(req: NextRequest) {
  if (!isAdminAuthenticated(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const sheetUrl = process.env.GUESTLIST_SHEET_URL;
  if (!sheetUrl) {
    return NextResponse.json({ error: "GUESTLIST_SHEET_URL not configured", needsSetup: true }, { status: 404 });
  }

  try {
    const res = await fetch(sheetUrl, {
      headers: { "Accept": "text/csv" },
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`Sheet returned ${res.status}`);

    const text = await res.text();
    const { headers, rows } = parseCSV(text);

    return NextResponse.json({ headers, rows, count: rows.length });
  } catch (e) {
    console.error("[guestlist] fetch error:", e);
    return NextResponse.json({ error: "Failed to fetch guest list from Google Sheet" }, { status: 500 });
  }
}
