import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Agreement Received — Wellness Weekend Vendors",
  description: "Your vendor agreement has been received. Welcome to Wellness Weekend 2026.",
};

export default function VendorConfirmed() {
  return (
    <>
      <nav className="legal-nav">
        <Link href="/" className="legal-nav-back">← Back to Wellness Weekend</Link>
      </nav>
      <main className="vendor-page">
        <div className="vendor-container" style={{ textAlign: "center", padding: "4rem 2rem" }}>
          <div style={{ fontSize: "3rem", marginBottom: "1.5rem" }}>🌿</div>
          <p className="section-label">Vendor Agreement</p>
          <h1 className="vendor-title" style={{ marginBottom: "1rem" }}>You&apos;re in.</h1>
          <p style={{ maxWidth: "520px", margin: "0 auto 2rem", color: "var(--charcoal)", lineHeight: 1.7 }}>
            Your vendor agreement has been received and your space is confirmed. We&apos;ll
            be in touch at the email you provided with setup details and your space assignment
            as we get closer to August.
          </p>
          <div style={{ background: "var(--surface-elevated, #FEFCF8)", border: "1px solid rgba(107,127,96,0.25)", borderRadius: "12px", padding: "1.5rem 2rem", display: "inline-block", marginBottom: "2rem", textAlign: "left" }}>
            <p style={{ fontWeight: 600, marginBottom: "0.5rem", color: "var(--forest)" }}>
              Next steps
            </p>
            <ul style={{ listStyle: "none", lineHeight: 2, fontSize: "0.95rem" }}>
              <li>✓ Email your certificate of insurance to <a href="mailto:support@thesoundspace.us" style={{ color: "var(--sage)" }}>support@thesoundspace.us</a></li>
              <li>✓ Watch your inbox for space assignment details</li>
              <li>✓ Plan your setup for August 7 starting at 9:00 AM</li>
            </ul>
          </div>
          <div>
            <Link href="/" className="hero-cta" style={{ display: "inline-block" }}>
              Back to Home
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
