import Link from "next/link";
import ThankYouTracker from "./ThankYouTracker";
import { SparklesIcon, CalendarIcon, MapPinIcon } from "@/components/Icons";

export const metadata = {
  title: "Thank You",
  description: "Your order has been confirmed. See you under the midnight sun!",
  robots: { index: false, follow: true },
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
            <span>August 7-9, 2026</span>
          </div>
          <div className="thankyou-detail">
            <span className="thankyou-detail-icon"><MapPinIcon size={20} color="var(--aurora)" /></span>
            <span>Warrior Lodge, Sutton, Alaska</span>
          </div>
        </div>

        <div
          className="thankyou-rewards"
          style={{
            marginTop: "2.5rem",
            paddingTop: "2.5rem",
            borderTop: "1px solid rgba(43,43,43,0.12)",
          }}
        >
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(1.5rem, 4vw, 2rem)",
              color: "var(--forest)",
              fontWeight: 300,
              marginBottom: "0.75rem",
            }}
          >
            Make it count for more.
          </h2>
          <p className="thankyou-text" style={{ marginBottom: "1.5rem" }}>
            Members earn 1 point for every $1 spent, plus 50 points each time a
            friend joins. Create a free account with the email you just used to
            start earning.
          </p>
          <Link href="/join" className="hero-cta">
            Create Free Account
          </Link>
          <p
            className="thankyou-detail"
            style={{
              display: "block",
              maxWidth: "28rem",
              margin: "1.75rem auto 0",
              textAlign: "center",
              lineHeight: 1.6,
            }}
          >
            Coming with friends? Cabin beds are limited this year, so the sooner
            your circle books, the better.
          </p>
          <Link
            href="/?tab=addons#store"
            className="hero-cta"
            style={{ marginTop: "1.5rem" }}
          >
            Add to Your Weekend
          </Link>
        </div>

        <Link href="/" className="hero-cta" style={{ marginTop: "2rem" }}>
          Back to Home
        </Link>
      </div>
    </main>
  );
}
