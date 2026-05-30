import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Join & Earn · Wellness Weekend",
  description:
    "Create a free member account and earn points by referring friends to Wellness Weekend. Redeem points for discounts and passes.",
  robots: { index: true, follow: true },
};

export default function JoinLayout({ children }: { children: React.ReactNode }) {
  return children;
}
