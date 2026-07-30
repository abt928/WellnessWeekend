import Link from "next/link";
import ThankYouTracker from "./ThankYouTracker";
import { SparklesIcon, CalendarIcon, MapPinIcon } from "@/components/Icons";

export const metadata = {
  title: "Thank You | Wellness Weekend 2026",
  description: "Your order has been confirmed. See you under the midnight sun!",
};

/* ── product-specific post-purchase routing ──
   Square redirect URL should include ?product=<key> for add-on purchases.
   E.g. set the contrast therapy checkout redirect to /thank-you?product=contrast
*/
const PRODUCT_ROUTING: Record<string, { title: string; icon: string; cta: string; href: string; color: string; note: string }> = {
  contrast: {
    title: "Contrast Therapy",
    icon: "🔥",
    cta: "Book Your Session →",
    href: "/contrast-therapy",
    color: "#C9983F",
    note: "Your next step is to pick your 30-minute sauna + cold plunge slot.",
  },
  massage: {
    title: "Massage",
    icon: "🌿",
    cta: "Book Your Session →",
    href: "/massage",
    color: "#5E8A6A",
    note: "Your next step is to choose your practitioner and session time.",
  },
  aerial: {
    title: "Aerial Silk",
    icon: "🎋",
    cta: "Reserve Your Slot →",
    href: "/book?type=aerial&confirmed=1",
    color: "#9B7FD4",
    note: "Your next step is to pick your aerial silk session time.",
  },
  paddle: {
    title: "Paddleboard Yoga",
    icon: "🏄",
    cta: "Reserve Your Slot →",
    href: "/book?type=paddle&confirmed=1",
    color: "#3DB8AF",
    note: "Your next step is to pick your paddleboard yoga session time.",
  },
};

const ADDONS = [
  {
    icon: "🌿",
    title: "Massage",
    desc: "Flow Massage · Alaska Massage Band — 30 or 60 min therapeutic sessions all weekend.",
    cta: "Book Your Session",
    href: "/massage",
    accent: "#5E8A6A",
  },
  {
    icon: "🔥",
    title: "Contrast Therapy",
    desc: "Hot sauna + cold plunge — 30-minute facilitated sessions at Lakeside. Limited slots.",
    cta: "Book Your Session",
    href: "/contrast-therapy",
    accent: "#C9983F",
  },
  {
    icon: "🎋",
    title: "Aerial Silk",
    desc: "Beginner silks flow with instructor Beth — groups of 6. Reserve your spot ahead.",
    cta: "Reserve a Spot",
    href: "/book?type=aerial",
    accent: "#9B7FD4",
  },
  {
    icon: "🏄",
    title: "Paddleboard Yoga",
    desc: "All-levels flow on the lake. You might get wet — that's part of the magic. 7 per session.",
    cta: "Reserve a Spot",
    href: "/book?type=paddle",
    accent: "#3DB8AF",
  },
];

export default function ThankYou({
  searchParams,
}: {
  searchParams: { product?: string };
}) {
  const product = searchParams.product;
  const routing = product ? PRODUCT_ROUTING[product] : null;

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

        {/* Add-on specific next-step prompt */}
        {routing ? (
          <div style={{ marginTop: "2.5rem", width: "100%", maxWidth: 480 }}>
            <div style={{
              background: `${routing.color}18`,
              border: `1.5px solid ${routing.color}40`,
              borderRadius: 16,
              padding: "1.75rem",
              textAlign: "center",
            }}>
              <div style={{ fontSize: "2.5rem", marginBottom: "0.75rem" }}>{routing.icon}</div>
              <p style={{ fontSize: "0.72rem", letterSpacing: "0.12em", textTransform: "uppercase", color: routing.color, fontWeight: 700, marginBottom: "0.4rem" }}>
                One More Step
              </p>
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.4rem", marginBottom: "0.5rem" }}>
                Book Your {routing.title}
              </h2>
              <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.88rem", lineHeight: 1.65, marginBottom: "1.5rem" }}>
                {routing.note}
              </p>
              <Link href={routing.href} style={{
                display: "inline-block",
                background: routing.color,
                color: "#fff",
                fontWeight: 700,
                fontSize: "1rem",
                padding: "0.85rem 2rem",
                borderRadius: 30,
                textDecoration: "none",
                letterSpacing: "0.02em",
              }}>
                {routing.cta}
              </Link>
            </div>

            <p style={{ textAlign: "center", marginTop: "1.5rem", fontSize: "0.8rem", color: "rgba(255,255,255,0.35)" }}>
              Want to add more experiences?
            </p>
            <div style={{ display: "grid", gap: "0.6rem", marginTop: "0.75rem" }}>
              {ADDONS.filter((a) => a.href !== routing.href.split("?")[0] && !routing.href.startsWith(a.href)).map((a) => (
                <Link
                  key={a.title}
                  href={a.href}
                  style={{
                    display: "flex", alignItems: "center", gap: "0.85rem",
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: 10, padding: "0.75rem 1rem",
                    textDecoration: "none", color: "inherit",
                  }}
                >
                  <span style={{ fontSize: "1.3rem", flexShrink: 0 }}>{a.icon}</span>
                  <span style={{ flex: 1, fontSize: "0.85rem", fontWeight: 600 }}>{a.title}</span>
                  <span style={{ flexShrink: 0, fontSize: "0.75rem", fontWeight: 700, color: a.accent }}>
                    {a.cta} →
                  </span>
                </Link>
              ))}
            </div>
          </div>
        ) : (
          /* General add-on booking prompt (no product param) */
          <div style={{ marginTop: "2.5rem", width: "100%", maxWidth: 560, textAlign: "left" }}>
            <p style={{ fontSize: "0.75rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--gold)", fontWeight: 700, marginBottom: "0.5rem" }}>
              One more step
            </p>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.3rem, 3.5vw, 1.8rem)", marginBottom: "0.5rem" }}>
              Book Your Add-Ons
            </h2>
            <p style={{ color: "rgba(255,255,255,0.65)", fontSize: "0.9rem", lineHeight: 1.6, marginBottom: "1.5rem" }}>
              Massage, contrast therapy, aerial silk, and paddleboard yoga all have limited availability — secure your spots now while they&apos;re open.
            </p>
            <div style={{ display: "grid", gap: "0.75rem" }}>
              {ADDONS.map((a) => (
                <Link
                  key={a.title}
                  href={a.href}
                  style={{
                    display: "flex", alignItems: "center", gap: "1rem",
                    background: "rgba(255,255,255,0.05)",
                    border: "1.5px solid rgba(255,255,255,0.1)",
                    borderRadius: 12, padding: "0.9rem 1.1rem",
                    textDecoration: "none", color: "inherit",
                    transition: "border-color 0.15s ease, background 0.15s ease",
                  }}
                >
                  <span style={{ fontSize: "1.6rem", flexShrink: 0 }}>{a.icon}</span>
                  <span style={{ flex: 1 }}>
                    <span style={{ display: "block", fontWeight: 700, fontSize: "0.95rem", color: "#fff", marginBottom: "0.15rem" }}>{a.title}</span>
                    <span style={{ display: "block", fontSize: "0.8rem", color: "rgba(255,255,255,0.55)", lineHeight: 1.4 }}>{a.desc}</span>
                  </span>
                  <span style={{ flexShrink: 0, fontSize: "0.8rem", fontWeight: 700, color: a.accent, whiteSpace: "nowrap" }}>
                    {a.cta} →
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}

        <Link href="/" className="hero-cta" style={{ marginTop: "2.5rem" }}>
          Back to Home
        </Link>
      </div>
    </main>
  );
}
