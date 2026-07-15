import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Affiliate Program",
  description:
    "Earn commission by sharing Wellness Weekend with your community. Apply to the affiliate program for the 4th annual healing arts festival in Sutton, Alaska.",
  alternates: { canonical: "/affiliates/apply" },
  // Public application page: override the noindex set by the parent portal layout.
  robots: { index: true, follow: true },
  openGraph: {
    title: "Affiliate Program · Wellness Weekend 2026",
    description:
      "Partner with Wellness Weekend and earn commission by referring seekers to a healing arts festival under the Alaskan midnight sun.",
    url: "/affiliates/apply",
    type: "website",
    siteName: "Wellness Weekend",
    images: ["/images/hero.png"],
  },
};

export default function AffiliateApplyLayout({ children }: { children: React.ReactNode }) {
  return children;
}
