import type { Metadata } from "next";
import { Playfair_Display, Inter, Cormorant_Garamond } from "next/font/google";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-display",
});

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-body",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600"],
  variable: "--font-accent",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://wellnessweekendak.com"),
  title: {
    default:
      "Wellness Weekend — 4th Annual Healing Arts Festival | Sutton, Alaska",
    template: "%s — Wellness Weekend",
  },
  description:
    "Join 200+ seekers for a transformational weekend of sound healing, earth medicine, and movement under Alaska's midnight sun. August 8–10, 2026 in Sutton, Alaska.",
  keywords: [
    "healing arts festival",
    "wellness retreat Alaska",
    "sound healing",
    "yoga retreat",
    "Sutton Alaska",
    "midnight sun",
    "transformational experience",
    "new age festival",
    "plant medicine ceremony",
    "breathwork retreat",
    "shamanic healing",
    "Lions Gate portal",
  ],
  alternates: {
    canonical: "https://wellnessweekendak.com",
  },
  icons: {
    apple: "/apple-touch-icon.jpeg",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: "Wellness Weekend — Healing Arts Festival Under the Midnight Sun",
    description:
      "A once-in-a-lifetime transformational gathering in the Alaskan wilderness. Sound healing, earth medicine, movement & bodywork. August 8–10, 2026.",
    type: "website",
    url: "https://wellnessweekendak.com",
    siteName: "Wellness Weekend",
    locale: "en_US",
    images: [
      {
        url: "/images/hero.png",
        width: 1200,
        height: 630,
        alt: "Wellness Weekend — Healing Arts Festival in Sutton, Alaska under the midnight sun",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Wellness Weekend — Healing Arts Festival Under the Midnight Sun",
    description:
      "Join 200+ seekers for sound healing, earth medicine, and movement under Alaska's midnight sun. August 8–10, 2026.",
    images: ["/images/hero.png"],
  },
  other: {
    "theme-color": "#2D3A2E",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${inter.variable} ${cormorant.variable}`}
    >
      <body style={{ fontFamily: "var(--font-body)" }}>
        {children}
        <Analytics />

        {/* Google Analytics (gtag.js) */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-1BNLVMK3HB"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-1BNLVMK3HB', {
              send_page_view: true
            });
          `}
        </Script>

        {/* TikTok Pixel */}
        <Script id="tiktok-pixel" strategy="afterInteractive">
          {`
            !function (w, d, t) {
              w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie","holdConsent","revokeConsent","grantConsent"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(
              var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var r="https://analytics.tiktok.com/i18n/pixel/events.js",o=n&&n.partner;ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=r,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};n=document.createElement("script")
              ;n.type="text/javascript",n.async=!0,n.src=r+"?sdkid="+e+"&lib="+t;e=document.getElementsByTagName("script")[0];e.parentNode.insertBefore(n,e)};
              ttq.load('D7RCRM3C77U0A0BNAG00');
              ttq.page();
            }(window, document, 'ttq');
          `}
        </Script>

        {/* Meta (Facebook) Pixel */}
        <Script id="meta-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            if('${process.env.NEXT_PUBLIC_META_PIXEL_ID || ""}') {
              // Build Advanced Matching params for better Event Match Quality
              var _wwAm = {};
              try {
                var _eid = localStorage.getItem('ww-eid');
                if (!_eid) {
                  _eid = 'ww_' + Date.now() + '_' + Math.random().toString(36).slice(2,11);
                  localStorage.setItem('ww-eid', _eid);
                }
                _wwAm.external_id = _eid;
              } catch(e) {}
              fbq('init', '${process.env.NEXT_PUBLIC_META_PIXEL_ID || ""}', _wwAm);
              fbq('track', 'PageView');
            }
          `}
        </Script>
        {process.env.NEXT_PUBLIC_META_PIXEL_ID && (
          <noscript>
            <img
              height="1"
              width="1"
              style={{ display: "none" }}
              src={`https://www.facebook.com/tr?id=${process.env.NEXT_PUBLIC_META_PIXEL_ID}&ev=PageView&noscript=1`}
              alt=""
            />
          </noscript>
        )}
      </body>
    </html>
  );
}
