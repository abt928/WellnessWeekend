import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/**
 * IndexNow API route — pings Bing/Yandex/search engines whenever
 * content is added, updated, or deleted.
 *
 * Usage:
 *   POST /api/indexnow
 *   Body: { "urls": ["https://wellnessweekendak.com/privacy"] }
 *
 *   Or call with no body to submit all public pages.
 *
 * Can be triggered:
 *   - Manually via curl
 *   - Via Vercel deploy hook (see vercel.json or a post-deploy script)
 *   - Programmatically after content changes
 */

const INDEXNOW_KEY = "f113f45f39be6d6e3231e4723480d78b";
const HOST = "wellnessweekendak.com";

// All public pages on the site
const ALL_PAGES = [
  `https://${HOST}`,
  `https://${HOST}/privacy`,
  `https://${HOST}/terms`,
];

// IndexNow-compatible search engine endpoints
const SEARCH_ENGINES = [
  "https://api.indexnow.org/indexnow",        // shared endpoint (Bing, Yandex, others)
];

async function submitToEngine(engineUrl: string, urls: string[]) {
  try {
    const res = await fetch(engineUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({
        host: HOST,
        key: INDEXNOW_KEY,
        keyLocation: `https://${HOST}/${INDEXNOW_KEY}.txt`,
        urlList: urls,
      }),
    });

    return {
      engine: engineUrl,
      status: res.status,
      ok: res.ok,
      response: res.ok ? "OK" : await res.text().catch(() => ""),
    };
  } catch (e) {
    return {
      engine: engineUrl,
      status: 0,
      ok: false,
      response: String(e),
    };
  }
}

export async function POST(req: Request) {
  try {
    let urls: string[] = ALL_PAGES;

    // Accept optional body with specific URLs
    try {
      const body = await req.json();
      if (body.urls && Array.isArray(body.urls) && body.urls.length > 0) {
        urls = body.urls;
      }
    } catch {
      // No body or invalid JSON — use all pages
    }

    // Submit to all IndexNow endpoints concurrently
    const results = await Promise.all(
      SEARCH_ENGINES.map((engine) => submitToEngine(engine, urls))
    );

    const allOk = results.every((r) => r.ok);

    console.log(
      `[IndexNow] Submitted ${urls.length} URLs:`,
      JSON.stringify(results)
    );

    return NextResponse.json(
      {
        success: allOk,
        submitted: urls,
        results,
      },
      { status: allOk ? 200 : 207 }
    );
  } catch (error) {
    console.error("[IndexNow] Error:", error);
    return NextResponse.json(
      { error: "IndexNow submission failed" },
      { status: 500 }
    );
  }
}

// Also support GET for easy testing / browser trigger
export async function GET() {
  const results = await Promise.all(
    SEARCH_ENGINES.map((engine) => submitToEngine(engine, ALL_PAGES))
  );

  console.log(
    `[IndexNow] GET: Submitted ${ALL_PAGES.length} URLs:`,
    JSON.stringify(results)
  );

  return NextResponse.json({
    success: results.every((r) => r.ok),
    submitted: ALL_PAGES,
    results,
  });
}
