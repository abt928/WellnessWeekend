import type { Metadata } from "next";
import { Spectral, Manrope } from "next/font/google";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import ClarityTracker from "@/components/ClarityTracker";
import RefCapture from "@/components/RefCapture";
import RouteTracker from "@/components/RouteTracker";
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
  metadataBase: new URL("https://www.wellnessweekendak.com"),
  title: {
    default:
      "Wellness Weekend · 4th Annual Healing Arts Festival · Sutton, Alaska",
    template: "%s · Wellness Weekend",
  },
  description:
    "Join an intimate circle of up to 200 seekers for a weekend of sound healing, earth medicine, and movement under Alaska's midnight sun. August 7-9, 2026 in Sutton, Alaska.",
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
    // Relative self-canonical: Next resolves "./" against metadataBase per route
    canonical: "./",
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
      "A once-in-a-lifetime transformational gathering in the Alaskan wilderness. Sound healing, earth medicine, movement & bodywork. August 7-9, 2026.",
    type: "website",
    url: "https://www.wellnessweekendak.com",
    siteName: "Wellness Weekend",
    locale: "en_US",
    images: [
      {
        url: "/images/hero.png",
        width: 1024,
        height: 1024,
        alt: "Wellness Weekend, a healing arts festival in Sutton, Alaska under the midnight sun",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Wellness Weekend · Healing Arts Festival Under the Midnight Sun",
    description:
      "Join an intimate circle of up to 200 seekers for sound healing, earth medicine, and movement under Alaska's midnight sun. August 7-9, 2026.",
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
        {/* Scroll-reveal sections are hidden by default in CSS; force them
            visible for no-JS visitors (React never hydrates noscript content). */}
        <noscript>
          <style>{`.reveal{opacity:1 !important;transform:none !important}`}</style>
        </noscript>
        {children}
        <RefCapture />
        <RouteTracker />
        <ClarityTracker />

        {/* Event JSON-LD lives on the homepage (app/page.tsx) as a single
            canonical entity; a duplicate site-wide block was removed here. */}

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
              // Identify with external_id for cross-event matching. external_id
              // is SHA-256 hashed to match the server relay (/api/tracking) so
              // the browser + server identities reconcile.
              try {
                var _ttEid = localStorage.getItem('ww-eid');
                if (!_ttEid) {
                  _ttEid = 'ww_' + Date.now() + '_' + Math.random().toString(36).slice(2,11);
                  localStorage.setItem('ww-eid', _ttEid);
                }
                var _ttEm = localStorage.getItem('ww-em');
                var _ttPh = localStorage.getItem('ww-ph');
                var _ttSend = function(_eid) {
                  var _ttIdentify = { external_id: _eid };
                  if (_ttEm) _ttIdentify.email = _ttEm;
                  if (_ttPh) _ttIdentify.phone_number = _ttPh;
                  ttq.identify(_ttIdentify);
                };
                if (window.crypto && window.crypto.subtle) {
                  window.crypto.subtle.digest('SHA-256', new TextEncoder().encode(_ttEid.trim().toLowerCase())).then(function(_buf){
                    _ttSend(Array.from(new Uint8Array(_buf)).map(function(b){return b.toString(16).padStart(2,'0')}).join(''));
                  }).catch(function(){ _ttSend(_ttEid); });
                } else {
                  _ttSend(_ttEid);
                }
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
              // Build Advanced Matching params for better Event Match Quality.
              // em/ph are sent plaintext (fbevents.js hashes them itself);
              // external_id is SHA-256 hashed to match the server relay
              // (/api/tracking) so browser + server identities reconcile.
              var _wwAm = {};
              var _wwInit = function() {
                fbq('init', '${process.env.NEXT_PUBLIC_META_PIXEL_ID || ""}', _wwAm);
                fbq('track', 'PageView');
              };
              try {
                var _wwEm = localStorage.getItem('ww-em');
                if (_wwEm) _wwAm.em = _wwEm;
                var _wwPh = localStorage.getItem('ww-ph');
                if (_wwPh) _wwAm.ph = _wwPh.replace('+', '');
                var _eid = localStorage.getItem('ww-eid');
                if (!_eid) {
                  _eid = 'ww_' + Date.now() + '_' + Math.random().toString(36).slice(2,11);
                  localStorage.setItem('ww-eid', _eid);
                }
                if (window.crypto && window.crypto.subtle) {
                  window.crypto.subtle.digest('SHA-256', new TextEncoder().encode(_eid.trim().toLowerCase())).then(function(_buf){
                    _wwAm.external_id = Array.from(new Uint8Array(_buf)).map(function(b){return b.toString(16).padStart(2,'0')}).join('');
                    _wwInit();
                  }).catch(function(){ _wwAm.external_id = _eid; _wwInit(); });
                } else {
                  _wwAm.external_id = _eid;
                  _wwInit();
                }
              } catch(e) { _wwInit(); }
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
