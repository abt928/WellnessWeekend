import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ── Turbopack ────────────────────────────────────────────────────
  // Fix the root resolution warning (lockfile ambiguity)
  turbopack: {
    root: __dirname,
  },

  // ── Security ─────────────────────────────────────────────────────
  // Remove x-powered-by header (information leakage)
  poweredByHeader: false,

  // ── Performance: React Compiler ──────────────────────────────────
  // Auto-memoize components — eliminates manual useMemo/useCallback
  reactCompiler: true,

  // ── Image Optimization ───────────────────────────────────────────
  images: {
    // Serve modern formats (AVIF first, then WebP fallback)
    formats: ["image/avif", "image/webp"],
    // Tuned device sizes for common breakpoints
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    // Thumbnail sizes for gallery grid
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // Reduce quality slightly for faster loads (still visually lossless)
    minimumCacheTTL: 31536000, // 1 year cache
  },

  // ── Security Headers ─────────────────────────────────────────────
  async headers() {
    return [
      // Apple Pay domain verification
      {
        source:
          "/.well-known/apple-developer-merchantid-domain-association",
        headers: [
          {
            key: "Content-Type",
            value: "application/octet-stream",
          },
        ],
      },
      // Global security + performance headers
      {
        source: "/(.*)",
        headers: [
          // Prevent MIME-type sniffing
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          // Clickjacking protection
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          // XSS protection (legacy browsers)
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          // Referrer policy for tracking attribution
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          // Permissions policy — only what we actually use
          {
            key: "Permissions-Policy",
            value:
              "camera=(), microphone=(), geolocation=(), interest-cohort=()",
          },
          // Strict transport security (1 year)
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains",
          },
        ],
      },
      // Cache gallery/public images
      {
        source: "/images/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=2592000, stale-while-revalidate=86400",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
