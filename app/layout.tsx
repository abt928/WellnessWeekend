import type { Metadata } from "next";
import { Spectral, Manrope } from "next/font/google";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import ClarityTracker from "@/components/ClarityTracker";
import "./globals.css";

const spectral = Spectral({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-display",
});

const manrope = Manrope({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://wellnessweekendak.com"),
  title: {
    default:
      "Wellness Weekend · 4th Annual Healing Arts Festival · Sutton, Alaska",
    template: "%s · Wellness Weekend",
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
    title: "Wellness Weekend · Healing Arts Festival Under the Midnight Sun",
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
        alt: "Wellness Weekend, a healing arts festival in Sutton, Alaska under the midnight sun",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Wellness Weekend · Healing Arts Festival Under the Midnight Sun",
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
      className={`${spectral.variable} ${manrope.variable}`}
    >
      <body>
        {children}
        <ClarityTracker />

        {/* Schema.org JSON-LD for Meta Pixel Automatic Microdata (Event & Ticketing) */}
        <Script
          id="schema-event"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Festival",
              name: "Wellness Weekend 2026",
              description: "A once-in-a-lifetime transformational gathering in the Alaskan wilderness. Sound healing, earth medicine, movement & bodywork.",
              startDate: "2026-08-08T12:00:00-08:00",
              endDate: "2026-08-10T15:00:00-08:00",
              eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
              eventStatus: "https://schema.org/EventScheduled",
              location: {
                "@type": "Place",
                name: "The Land",
                address: {
                  "@type": "PostalAddress",
                  addressLocality: "Sutton",
                  addressRegion: "AK",
                  addressCountry: "US",
                },
              },
              image: [
                "https://wellnessweekendak.com/images/hero.png"
              ],
              offers: {
                "@type": "Offer",
                name: "General Admission Tier 1",
                price: "444.00",
                priceCurrency: "USD",
                availability: "https://schema.org/InStock",
                validFrom: "2026-01-01T00:00:00-08:00",
                url: "https://wellnessweekendak.com/#tickets",
              },
              organizer: {
                "@type": "Organization",
                name: "Wellness Weekend",
                url: "https://wellnessweekendak.com",
              },
            }),
          }}
        />

        <Analytics />
        <SpeedInsights />

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
              // Identify with external_id for cross-event matching
              try {
                var _ttEid = localStorage.getItem('ww-eid');
                if (!_ttEid) {
                  _ttEid = 'ww_' + Date.now() + '_' + Math.random().toString(36).slice(2,11);
                  localStorage.setItem('ww-eid', _ttEid);
                }
                var _ttIdentify = { external_id: _ttEid };
                var _ttEm = localStorage.getItem('ww-em');
                if (_ttEm) _ttIdentify.email = _ttEm;
                var _ttPh = localStorage.getItem('ww-ph');
                if (_ttPh) _ttIdentify.phone_number = _ttPh;
                ttq.identify(_ttIdentify);
              } catch(e) {}
              // Persist ttclid from URL as first-party cookie
              try {
                var _ttclid = new URLSearchParams(window.location.search).get('ttclid');
                if (_ttclid) {
                  document.cookie = 'ttclid=' + encodeURIComponent(_ttclid) + ';max-age=7776000;path=/;SameSite=Lax';
                }
              } catch(e) {}
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
            {/* eslint-disable-next-line @next/next/no-img-element -- noscript fallback for Meta Pixel; next/image cannot run without JS */}
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
