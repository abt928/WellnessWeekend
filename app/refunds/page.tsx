import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Refund Policy — Wellness Weekend",
  description:
    "Our ticket refund, transfer, and event cancellation policy for Wellness Weekend.",
};

export default function RefundPolicy() {
  return (
    <>
      <nav className="legal-nav">
        <Link href="/" className="legal-nav-back">
          ← Back to Wellness Weekend
        </Link>
      </nav>

      <main className="legal-page">
        <div className="legal-container">
          <header className="legal-header">
            <p className="legal-label">Legal</p>
            <h1
              className="legal-title"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Refund policy.
            </h1>
            <p className="legal-effective">Effective Date: May 3, 2026</p>
          </header>

          <article className="legal-body">
            <section className="legal-section">
              <h2>Ticket Purchases &amp; Refund Policy</h2>
              <h3>Purchases</h3>
              <p>
                All ticket and merchandise purchases are processed through Square,
                our third-party payment processor. By making a purchase, you agree
                to Square&rsquo;s terms of service and payment processing policies.
              </p>

              <h3>Refunds</h3>
              <ul>
                <li>
                  <strong>Full refund:</strong> Requests made more than 60 days
                  before the event date.
                </li>
                <li>
                  <strong>50% refund:</strong> Requests made 30–60 days before the
                  event date.
                </li>
                <li>
                  <strong>No refund:</strong> Requests made less than 30 days
                  before the event date.
                </li>
                <li>
                  Tickets are transferable to another attendee at no additional
                  charge. Contact us to arrange a transfer.
                </li>
              </ul>

              <h3>Event Cancellation</h3>
              <p>
                In the unlikely event that Wellness Weekend is cancelled by the
                organizers (due to weather, force majeure, or other unforeseen
                circumstances), ticket holders will receive a full refund or the
                option to transfer their purchase to the following year&rsquo;s
                event.
              </p>
            </section>

            <section className="legal-section">
              <h2>Contact Us</h2>
              <p>
                If you have questions about this Refund Policy, please contact us:
              </p>
              <div className="legal-contact">
                <p>
                  <strong>Sound Healing Products LLC</strong>
                </p>
                <p>d/b/a Wellness Weekend</p>
                <p>Sutton, Alaska</p>
                <p>
                  Email:{" "}
                  <a href="mailto:support@thesoundspace.us">
                    support@thesoundspace.us
                  </a>
                </p>
                <p>
                  Phone:{" "}
                  <a href="tel:+19076004390">
                    +1 (907) 600-4390
                  </a>
                </p>
              </div>
            </section>
          </article>

          <footer className="legal-footer">
            <Link href="/terms">Terms of Service</Link>
            <Link href="/privacy">Privacy Policy</Link>
            <Link href="/">Return to Home</Link>
          </footer>
        </div>
      </main>
    </>
  );
}
