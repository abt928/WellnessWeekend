import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Become a Vendor",
  description:
    "Bring your craft, healing modality, or nourishment to Wellness Weekend 2026 in Sutton, Alaska. Reserve a vendor space for the 4th annual healing arts gathering, August 7-9.",
  alternates: { canonical: "/vendors" },
  openGraph: {
    title: "Become a Vendor · Wellness Weekend 2026",
    description:
      "Reserve a vendor space at Wellness Weekend, a healing arts festival under the Alaskan midnight sun. August 7-9, 2026 in Sutton, Alaska.",
    url: "/vendors",
    type: "website",
    siteName: "Wellness Weekend",
    images: ["/images/hero.png"],
  },
};

export default function VendorsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
