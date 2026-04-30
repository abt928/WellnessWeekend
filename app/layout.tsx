import type { Metadata } from "next";
import { Playfair_Display, Inter, Cormorant_Garamond } from "next/font/google";
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
  title: "Wellness Weekend — 4th Annual Healing Arts Festival | Sutton, Alaska",
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
  ],
  openGraph: {
    title: "Wellness Weekend — Healing Arts Festival Under the Midnight Sun",
    description:
      "A once-in-a-lifetime transformational gathering in the Alaskan wilderness. Sound healing, earth medicine, movement & bodywork. August 8–10, 2026.",
    type: "website",
    images: ["/images/hero.png"],
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
      <body style={{ fontFamily: "var(--font-body)" }}>{children}</body>
    </html>
  );
}
