import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Join & Earn",
  description:
    "Create a free member account and earn points by referring friends to Wellness Weekend. Redeem points for discounts and passes.",
  robots: { index: true, follow: true },
  openGraph: {
    title: "Join & Earn · Wellness Weekend",
    description:
      "Create a free member account and earn points by referring friends to Wellness Weekend. Redeem points for discounts and passes.",
    url: "/join",
    type: "website",
    siteName: "Wellness Weekend",
    images: ["/images/hero.png"],
  },
};

export default function JoinLayout({ children }: { children: React.ReactNode }) {
  return children;
}
