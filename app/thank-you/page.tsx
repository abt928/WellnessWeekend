import Link from "next/link";
import ThankYouTracker from "./ThankYouTracker";
import { SparklesIcon, CalendarIcon, MapPinIcon } from "@/components/Icons";

export const metadata = {
  title: "Thank You | Wellness Weekend 2026",
  description: "Your order has been confirmed. See you under the midnight sun!",
};

export default function ThankYou() {
  return (
    <main className="thankyou">
      <ThankYouTracker />
      <div className="thankyou-content">
        <div className="thankyou-icon"><SparklesIcon size={40} color="var(--gold)" /></div>
        <h1 className="thankyou-title" style={{ fontFamily: "var(--font-display)" }}>
          You&apos;re in.
        </h1>
        <p className="thankyou-text">
          Your order has been confirmed and you&apos;ll receive a confirmation
          email from Square shortly. We can&apos;t wait to welcome you to the
          land under the midnight sun.
        </p>
        <div className="thankyou-details">
          <div className="thankyou-detail">
            <span className="thankyou-detail-icon"><CalendarIcon size={20} color="var(--aurora)" /></span>
            <span>August 7–9, 2026</span>
          </div>
          <div className="thankyou-detail">
            <span className="thankyou-detail-icon"><MapPinIcon size={20} color="var(--aurora)" /></span>
            <span>Warrior Lodge, Sutton, Alaska</span>
          </div>
        </div>
        <Link href="/" className="hero-cta" style={{ marginTop: "2rem" }}>
          Back to Home
        </Link>
      </div>
    </main>
  );
}
