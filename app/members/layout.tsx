import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Member Portal",
  description: "Your Wellness Weekend member dashboard: points balance, referral link, and reward redemptions.",
  robots: { index: false, follow: false },
};

export default function MembersLayout({ children }: { children: React.ReactNode }) {
  return children;
}
