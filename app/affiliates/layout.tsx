import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Partner Portal",
  description: "Affiliate partner portal",
  robots: { index: false, follow: false },
};

export default function AffiliatesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
