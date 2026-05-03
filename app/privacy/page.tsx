import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy — Wellness Weekend",
  description:
    "Learn how Wellness Weekend collects, uses, and protects your personal information, including our use of tracking technologies and third-party services.",
};

export default function PrivacyPolicy() {
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
              Privacy <em>Policy</em>
            </h1>
            <p className="legal-effective">Effective Date: May 3, 2026</p>
          </header>

          <article className="legal-body">
            <section className="legal-section">
              <h2>1. Introduction</h2>
              <p>
                Wellness Weekend (&ldquo;we,&rdquo; &ldquo;us,&rdquo; or
                &ldquo;our&rdquo;) operates the website{" "}
                <strong>wellnessweekendak.com</strong> and related services. This
                Privacy Policy explains how we collect, use, disclose, and
                safeguard your information when you visit our website, purchase
                tickets or merchandise, sign up for our mailing list, or interact
                with our digital properties.
              </p>
              <p>
                By accessing or using our services, you agree to this Privacy
                Policy. If you do not agree, please discontinue use of our
                services.
              </p>
            </section>

            <section className="legal-section">
              <h2>2. Information We Collect</h2>

              <h3>2.1 Information You Provide</h3>
              <ul>
                <li>
                  <strong>Contact Information:</strong> Name, email address, phone
                  number when you sign up for newsletters, submit inquiries, or
                  apply as a vendor/volunteer/sponsor.
                </li>
                <li>
                  <strong>Purchase Information:</strong> Billing details, shipping
                  address, and payment information processed through our
                  third-party payment processor (Square).
                </li>
                <li>
                  <strong>Application Data:</strong> Information submitted through
                  vendor, volunteer, and sponsor application forms.
                </li>
              </ul>

              <h3>2.2 Information Collected Automatically</h3>
              <ul>
                <li>
                  <strong>Device &amp; Browser Data:</strong> IP address, browser
                  type, operating system, device identifiers, and screen
                  resolution.
                </li>
                <li>
                  <strong>Usage Data:</strong> Pages visited, time spent on pages,
                  referral URLs, click patterns, and scroll depth.
                </li>
                <li>
                  <strong>Location Data:</strong> Approximate geographic location
                  derived from your IP address.
                </li>
              </ul>
            </section>

            <section className="legal-section">
              <h2>3. Tracking Technologies &amp; Pixels</h2>
              <p>
                We use tracking pixels, cookies, and similar technologies to
                measure advertising effectiveness, understand user behavior, and
                optimize our marketing efforts. These technologies may collect
                information about your online activities over time and across
                different websites.
              </p>

              <h3>3.1 TikTok Pixel</h3>
              <p>
                We use the TikTok Pixel (provided by ByteDance Ltd.) to track
                conversions from TikTok ads, optimize ad targeting, build
                audiences for future advertising, and retarget users who have
                taken specific actions on our website. Data collected may include
                page views, button clicks, form submissions, and purchase events.
                For more information, see{" "}
                <a
                  href="https://www.tiktok.com/legal/privacy-policy"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  TikTok&rsquo;s Privacy Policy
                </a>
                .
              </p>

              <h3>3.2 Meta (Facebook) Pixel</h3>
              <p>
                We use the Meta Pixel (provided by Meta Platforms, Inc.) to
                measure ad performance, create custom audiences, deliver
                retargeted advertising, and track conversions across Meta
                platforms (Facebook, Instagram). Data collected may include page
                views, content interactions, purchase events, and lead form
                submissions. For more information, see{" "}
                <a
                  href="https://www.facebook.com/privacy/policy"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Meta&rsquo;s Privacy Policy
                </a>
                .
              </p>

              <h3>3.3 Vercel Analytics</h3>
              <p>
                We use Vercel Analytics to collect anonymous, aggregated usage
                data to understand site performance and visitor behavior. This
                service does not use cookies and does not collect personally
                identifiable information.
              </p>

              <h3>3.4 Cookies</h3>
              <p>
                Cookies are small data files placed on your device. We and our
                third-party partners use cookies for:
              </p>
              <ul>
                <li>
                  <strong>Essential Cookies:</strong> Necessary for site
                  functionality (e.g., shopping cart, form submissions).
                </li>
                <li>
                  <strong>Analytics Cookies:</strong> Help us understand how
                  visitors interact with our site.
                </li>
                <li>
                  <strong>Advertising Cookies:</strong> Used by TikTok and Meta to
                  deliver relevant ads and measure campaign performance.
                </li>
              </ul>
              <p>
                You can control cookie preferences through your browser settings.
                Disabling cookies may affect site functionality.
              </p>
            </section>

            <section className="legal-section">
              <h2>4. How We Use Your Information</h2>
              <ul>
                <li>Process transactions and fulfill orders</li>
                <li>Send festival updates, newsletters, and promotional communications</li>
                <li>Respond to inquiries and support requests</li>
                <li>Improve our website, services, and user experience</li>
                <li>Measure and optimize advertising campaigns</li>
                <li>Create retargeting audiences on advertising platforms</li>
                <li>Analyze site traffic and usage patterns</li>
                <li>Prevent fraud and ensure security</li>
                <li>Comply with legal obligations</li>
              </ul>
            </section>

            <section className="legal-section">
              <h2>5. How We Share Your Information</h2>
              <p>
                We do not sell your personal information. We may share information
                with:
              </p>
              <ul>
                <li>
                  <strong>Payment Processors:</strong> Square processes payments
                  on our behalf. Your payment information is handled according to
                  their privacy and security policies.
                </li>
                <li>
                  <strong>Advertising Partners:</strong> TikTok and Meta receive
                  event data through their respective pixels to measure ad
                  performance and deliver targeted advertising.
                </li>
                <li>
                  <strong>Analytics Providers:</strong> Vercel receives anonymized
                  performance data.
                </li>
                <li>
                  <strong>Email/CRM Services:</strong> We use third-party services
                  to manage our mailing list and communications.
                </li>
                <li>
                  <strong>Legal Requirements:</strong> We may disclose information
                  if required by law, court order, or governmental request.
                </li>
              </ul>
            </section>

            <section className="legal-section">
              <h2>6. Data Retention</h2>
              <p>
                We retain personal information for as long as necessary to fulfill
                the purposes described in this policy, comply with legal
                obligations, resolve disputes, and enforce our agreements.
                Marketing data is retained until you unsubscribe or request
                deletion.
              </p>
            </section>

            <section className="legal-section">
              <h2>7. Your Rights &amp; Choices</h2>
              <ul>
                <li>
                  <strong>Opt-Out of Marketing:</strong> Unsubscribe from emails
                  using the link in any communication.
                </li>
                <li>
                  <strong>Cookie Controls:</strong> Adjust your browser settings
                  to block or delete cookies.
                </li>
                <li>
                  <strong>Ad Tracking Opt-Out:</strong> Use platform-specific
                  settings (TikTok, Facebook/Instagram) to manage ad preferences.
                </li>
                <li>
                  <strong>Access &amp; Deletion:</strong> Contact us to request
                  access to, correction of, or deletion of your personal data.
                </li>
              </ul>
              <p>
                California residents may have additional rights under the CCPA.
                Please contact us for more information.
              </p>
            </section>

            <section className="legal-section">
              <h2>8. Data Security</h2>
              <p>
                We implement reasonable administrative, technical, and physical
                safeguards to protect your personal information. However, no
                method of transmission over the Internet is 100% secure. We
                cannot guarantee absolute security.
              </p>
            </section>

            <section className="legal-section">
              <h2>9. Third-Party Links</h2>
              <p>
                Our website may contain links to third-party websites, services,
                or social media platforms. We are not responsible for the privacy
                practices of these third parties. We encourage you to review their
                privacy policies.
              </p>
            </section>

            <section className="legal-section">
              <h2>10. Children&rsquo;s Privacy</h2>
              <p>
                Our services are not directed to children under 13. We do not
                knowingly collect personal information from children under 13. If
                we discover such data has been collected, we will delete it
                promptly.
              </p>
            </section>

            <section className="legal-section">
              <h2>11. Changes to This Policy</h2>
              <p>
                We may update this Privacy Policy from time to time. Changes will
                be posted on this page with an updated effective date. Continued
                use of our services after changes constitutes acceptance of the
                revised policy.
              </p>
            </section>

            <section className="legal-section">
              <h2>12. Contact Us</h2>
              <p>
                If you have questions about this Privacy Policy or your personal
                data, please contact us:
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
            <Link href="/terms">Terms of Service</Link>
            <Link href="/">Return to Home</Link>
          </footer>
        </div>
      </main>
    </>
  );
}
