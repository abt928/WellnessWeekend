import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service — Wellness Weekend",
  description:
    "Read the terms and conditions governing your use of the Wellness Weekend website, ticket purchases, and event attendance.",
};

export default function TermsOfService() {
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
              Terms of <em>Service</em>
            </h1>
            <p className="legal-effective">Effective Date: May 3, 2026</p>
          </header>

          <article className="legal-body">
            <section className="legal-section">
              <h2>1. Acceptance of Terms</h2>
              <p>
                By accessing or using the Wellness Weekend website
                (wellnessweekendak.com) and related services, you agree to be
                bound by these Terms of Service (&ldquo;Terms&rdquo;). If you do
                not agree, do not use our services.
              </p>
            </section>

            <section className="legal-section">
              <h2>2. Description of Services</h2>
              <p>
                Wellness Weekend provides an online platform for information
                about our annual healing arts festival, including ticket and
                merchandise sales, mailing list registration, and
                vendor/volunteer/sponsor applications. The festival takes place in
                Sutton, Alaska.
              </p>
            </section>

            <section className="legal-section">
              <h2>3. Eligibility</h2>
              <p>
                You must be at least 18 years old to purchase tickets, merchandise,
                or use our services. Minors may attend the festival under the
                supervision of a parent or legal guardian who has accepted these
                Terms.
              </p>
            </section>

            <section className="legal-section">
              <h2>4. Ticket Purchases &amp; Refund Policy</h2>
              <h3>4.1 Purchases</h3>
              <p>
                All ticket and merchandise purchases are processed through Square,
                our third-party payment processor. By making a purchase, you agree
                to Square&rsquo;s terms of service and payment processing policies.
              </p>

              <h3>4.2 Refunds</h3>
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

              <h3>4.3 Event Cancellation</h3>
              <p>
                In the unlikely event that Wellness Weekend is cancelled by the
                organizers (due to weather, force majeure, or other unforeseen
                circumstances), ticket holders will receive a full refund or the
                option to transfer their purchase to the following year&rsquo;s
                event.
              </p>
            </section>

            <section className="legal-section">
              <h2>5. Event Conduct &amp; Safety</h2>
              <ul>
                <li>
                  All attendees must follow the instructions of festival staff and
                  safety personnel at all times.
                </li>
                <li>
                  Wellness Weekend reserves the right to refuse entry or remove any
                  person who engages in disruptive, dangerous, or illegal behavior
                  without refund.
                </li>
                <li>
                  Attendees participate in all festival activities, including but
                  not limited to sound healing, breathwork, movement, and wellness
                  workshops, at their own risk.
                </li>
                <li>
                  Attendees are responsible for their own health and should consult
                  a medical professional before participating in any physically or
                  emotionally intensive activities.
                </li>
              </ul>
            </section>

            <section className="legal-section">
              <h2>6. Assumption of Risk &amp; Liability Waiver</h2>
              <p>
                Wellness Weekend takes place in a natural outdoor environment in
                Alaska. By attending, you acknowledge and accept the inherent risks
                associated with outdoor events, including but not limited to:
              </p>
              <ul>
                <li>Exposure to weather, wildlife, and uneven terrain</li>
                <li>Physical exertion during activities</li>
                <li>Emotional or psychological responses to healing modalities</li>
                <li>Camping and outdoor living conditions</li>
              </ul>
              <p>
                To the fullest extent permitted by law, you release Wellness
                Weekend, its organizers, staff, volunteers, sponsors, and partners
                from any claims, damages, or liability arising from your
                attendance or participation in the festival.
              </p>
            </section>

            <section className="legal-section">
              <h2>7. Intellectual Property</h2>
              <p>
                All content on the Wellness Weekend website, including text,
                graphics, logos, images, audio, video, and software, is the
                property of Wellness Weekend or its licensors and is protected by
                copyright, trademark, and other intellectual property laws. You may
                not reproduce, distribute, modify, or create derivative works from
                our content without prior written consent.
              </p>
            </section>

            <section className="legal-section">
              <h2>8. Photography &amp; Media Release</h2>
              <p>
                By attending Wellness Weekend, you grant us permission to use your
                likeness in photographs, video, and other media captured during the
                event for promotional and marketing purposes, including on our
                website, social media, and advertising materials. If you do not
                wish to be photographed, please notify our staff on-site.
              </p>
            </section>

            <section className="legal-section">
              <h2>9. User Content &amp; Communications</h2>
              <p>
                By submitting content to us (e.g., application forms, newsletter
                sign-ups, contact messages), you grant us a non-exclusive,
                royalty-free license to use that information for the purpose for
                which it was provided. You represent that any content you submit is
                accurate and does not infringe on the rights of others.
              </p>
            </section>

            <section className="legal-section">
              <h2>10. Third-Party Services</h2>
              <p>
                Our website integrates with third-party services including Square
                (payments), TikTok and Meta (advertising pixels), and Vercel
                (hosting and analytics). Your use of these services is governed by
                their respective terms and privacy policies. We are not
                responsible for the actions or policies of third-party providers.
              </p>
            </section>

            <section className="legal-section">
              <h2>11. Disclaimer of Warranties</h2>
              <p>
                Our website and services are provided &ldquo;as is&rdquo; and
                &ldquo;as available&rdquo; without warranties of any kind, either
                express or implied. We do not guarantee that our website will be
                uninterrupted, error-free, or free from harmful components.
              </p>
            </section>

            <section className="legal-section">
              <h2>12. Limitation of Liability</h2>
              <p>
                To the maximum extent permitted by law, Wellness Weekend shall not
                be liable for any indirect, incidental, special, consequential, or
                punitive damages arising from your use of our website, attendance
                at our events, or these Terms. Our total liability shall not exceed
                the amount you paid for your ticket or merchandise.
              </p>
            </section>

            <section className="legal-section">
              <h2>13. Indemnification</h2>
              <p>
                You agree to indemnify and hold harmless Wellness Weekend, its
                organizers, employees, volunteers, and partners from any claims,
                losses, damages, or expenses (including attorney&rsquo;s fees)
                arising from your breach of these Terms, your use of our services,
                or your attendance at the event.
              </p>
            </section>

            <section className="legal-section">
              <h2>14. Governing Law</h2>
              <p>
                These Terms are governed by the laws of the State of Alaska. Any
                disputes arising from these Terms shall be resolved in the courts
                located in the Matanuska-Susitna Borough, Alaska.
              </p>
            </section>

            <section className="legal-section">
              <h2>15. Changes to These Terms</h2>
              <p>
                We reserve the right to modify these Terms at any time. Changes
                will be posted on this page with an updated effective date.
                Continued use of our services constitutes acceptance of the revised
                Terms.
              </p>
            </section>

            <section className="legal-section">
              <h2>16. Contact Us</h2>
              <p>
                If you have questions about these Terms, please contact us:
              </p>
              <div className="legal-contact">
                <p>
                  <strong>Wellness Weekend</strong>
                </p>
                <p>Sutton, Alaska</p>
                <p>
                  Email:{" "}
                  <a href="mailto:info@wellnessweekendak.com">
                    info@wellnessweekendak.com
                  </a>
                </p>
              </div>
            </section>
          </article>

          <footer className="legal-footer">
            <Link href="/privacy">Privacy Policy</Link>
            <Link href="/">Return to Home</Link>
          </footer>
        </div>
      </main>
    </>
  );
}
