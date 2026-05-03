import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Community Guidelines — Wellness Weekend",
  description:
    "Peace, Love, Unity, Respect. Read the community guidelines for attending Wellness Weekend, Alaska's premier healing arts gathering.",
};

export default function CommunityGuidelines() {
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
            <p className="legal-label">Community</p>
            <h1
              className="legal-title"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Community <em>Guidelines</em>
            </h1>
            <p className="legal-effective">
              Peace · Love · Unity · Respect
            </p>
          </header>

          <article className="legal-body">
            <section className="legal-section">
              <h2>Our Values</h2>
              <p>
                Wellness Weekend is a sacred gathering rooted in{" "}
                <strong>Peace, Love, Unity, and Respect (PLUR)</strong>. Every
                attendee, vendor, instructor, volunteer, and staff member is a
                steward of this space. These guidelines exist to protect the
                energy, safety, and magic of our community.
              </p>
              <p>
                By attending Wellness Weekend, you agree to uphold these
                guidelines. Violations may result in removal from the event
                without refund at the discretion of event organizers.
              </p>
            </section>

            <section className="legal-section">
              <h2>1. Respect Every Being</h2>
              <ul>
                <li>
                  Treat all attendees, staff, and the land itself with kindness,
                  compassion, and dignity.
                </li>
                <li>
                  Honor each person&rsquo;s boundaries, identity, background,
                  and personal space — always ask before touching, photographing,
                  or recording.
                </li>
                <li>
                  <strong>Zero tolerance</strong> for harassment, discrimination,
                  bullying, intimidation, or hate speech of any kind.
                </li>
                <li>
                  Respect the privacy of healing experiences. What happens in
                  ceremony stays in ceremony.
                </li>
              </ul>
            </section>

            <section className="legal-section">
              <h2>2. Consent Culture</h2>
              <ul>
                <li>
                  <strong>Enthusiastic consent</strong> is required for all
                  physical contact, including hugs, healing touch, and dance.
                </li>
                <li>
                  &ldquo;No&rdquo; is a complete sentence. Respect it
                  immediately and without question.
                </li>
                <li>
                  If someone is unable to give consent (due to intoxication,
                  sleep, or any other reason), consent cannot be assumed.
                </li>
                <li>
                  Report any consent violations to event staff immediately.
                </li>
              </ul>
            </section>

            <section className="legal-section">
              <h2>3. Leave No Trace</h2>
              <ul>
                <li>
                  This gathering takes place on sacred Alaskan land. Leave every
                  space cleaner than you found it.
                </li>
                <li>
                  Pack out all trash, food waste, and personal belongings.
                </li>
                <li>
                  Use designated fire pits only. Fully extinguish all fires.
                </li>
                <li>
                  Respect wildlife — do not feed, approach, or disturb animals.
                </li>
                <li>
                  Stay on marked trails and designated areas to protect the
                  natural landscape.
                </li>
              </ul>
            </section>

            <section className="legal-section">
              <h2>4. Prohibited Items</h2>
              <p>
                The following items are <strong>strictly prohibited</strong> at
                Wellness Weekend:
              </p>
              <ul>
                <li>
                  <strong>Weapons</strong> — Firearms, knives (beyond basic
                  camping utility), pepper spray, or any item intended as a
                  weapon.
                </li>
                <li>
                  <strong>Illegal substances</strong> — Possession, use, or
                  distribution of illegal drugs or controlled substances.
                </li>
                <li>
                  <strong>Glass containers</strong> — For safety, use reusable
                  bottles and cans only.
                </li>
                <li>
                  <strong>Fireworks &amp; explosives</strong> — Including
                  sparklers and sky lanterns.
                </li>
                <li>
                  <strong>Drones</strong> — Unauthorized aerial devices are not
                  permitted.
                </li>
                <li>
                  <strong>Amplified sound systems</strong> — Personal speakers
                  and sound systems outside designated areas.
                </li>
                <li>
                  <strong>Pets</strong> — Service animals only, with proper
                  documentation.
                </li>
              </ul>
            </section>

            <section className="legal-section">
              <h2>5. Substance Policy</h2>
              <ul>
                <li>
                  Wellness Weekend is a <strong>mindful consumption</strong>{" "}
                  environment. We encourage participants to approach all
                  substances with intention and awareness.
                </li>
                <li>
                  Excessive intoxication that disrupts others or creates safety
                  concerns will result in removal.
                </li>
                <li>
                  Selling, distributing, or sharing substances of any kind is
                  strictly prohibited.
                </li>
                <li>
                  If you or someone you know needs help, find any staff member
                  immediately — we are here to support, not judge.
                </li>
              </ul>
            </section>

            <section className="legal-section">
              <h2>6. Sacred Space &amp; Ceremony</h2>
              <ul>
                <li>
                  Arrive to workshops and ceremonies on time. Late entry may be
                  restricted to protect the space.
                </li>
                <li>
                  Silence phones and devices during sessions and ceremonies.
                </li>
                <li>
                  Follow the guidance of facilitators and ceremony leaders at all
                  times.
                </li>
                <li>
                  If an experience becomes overwhelming, step out quietly and
                  seek support from a staff member or volunteer.
                </li>
              </ul>
            </section>

            <section className="legal-section">
              <h2>7. Sound &amp; Quiet Hours</h2>
              <ul>
                <li>
                  <strong>Quiet hours:</strong> 12:00 AM – 7:00 AM. Keep
                  conversations and activities at a low volume in camping areas.
                </li>
                <li>
                  Music and amplified sound are only permitted in designated
                  stages and activity areas.
                </li>
                <li>
                  Respect your neighbors&rsquo; need for rest and integration
                  time.
                </li>
              </ul>
            </section>

            <section className="legal-section">
              <h2>8. Safety &amp; Emergencies</h2>
              <ul>
                <li>
                  Know the location of the first aid station and emergency exits.
                </li>
                <li>
                  Report any safety concerns, injuries, or suspicious behavior to
                  staff immediately.
                </li>
                <li>
                  Follow all fire safety rules — Alaska&rsquo;s dry conditions
                  make fire prevention critical.
                </li>
                <li>
                  Bear safety: store all food and scented items in bear-proof
                  containers. Follow posted wildlife guidelines.
                </li>
                <li>
                  Stay hydrated, wear sunscreen, and dress in layers for
                  Alaska&rsquo;s changing weather.
                </li>
              </ul>
            </section>

            <section className="legal-section">
              <h2>9. Photography &amp; Media</h2>
              <ul>
                <li>
                  <strong>Always ask permission</strong> before photographing or
                  recording other attendees.
                </li>
                <li>
                  No photography or recording during ceremonies, healing
                  sessions, or workshops unless explicitly permitted by the
                  facilitator.
                </li>
                <li>
                  Professional/commercial photography and videography requires
                  prior authorization from event organizers.
                </li>
                <li>
                  By attending, you consent to being captured in official event
                  photography and media for promotional use (see our{" "}
                  <Link href="/terms">Terms of Service</Link>).
                </li>
              </ul>
            </section>

            <section className="legal-section">
              <h2>10. Vendor &amp; Instructor Conduct</h2>
              <ul>
                <li>
                  Vendors must only sell pre-approved items in designated areas.
                </li>
                <li>
                  Instructors and facilitators must hold space with integrity and
                  operate within their scope of practice.
                </li>
                <li>
                  No high-pressure sales, unsolicited marketing, or unauthorized
                  distribution of materials.
                </li>
              </ul>
            </section>

            <section className="legal-section">
              <h2>11. Accountability</h2>
              <p>
                We believe in <strong>restorative accountability</strong>.
                Depending on the severity of a violation:
              </p>
              <ul>
                <li>
                  <strong>First instance:</strong> A conversation with event
                  staff to understand and resolve the situation.
                </li>
                <li>
                  <strong>Repeated or serious violations:</strong> Removal from
                  the event without refund.
                </li>
                <li>
                  <strong>Criminal behavior:</strong> Reported to local
                  authorities.
                </li>
              </ul>
              <p>
                Our goal is always healing and growth — but the safety of the
                community comes first.
              </p>
            </section>

            <section className="legal-section">
              <h2>The Spirit of the Gathering</h2>
              <p>
                Wellness Weekend is more than an event — it&rsquo;s a living,
                breathing community. We come together to heal, grow, dance,
                learn, and hold space for each other under the midnight sun. Be
                the energy you want to experience. Lead with love. Leave with
                gratitude.
              </p>
              <p style={{ fontStyle: "italic", color: "var(--sage)" }}>
                &ldquo;We are all here to support each other&rsquo;s journey.
                When we lift others, we rise together.&rdquo;
              </p>
            </section>

            <section className="legal-section">
              <h2>Questions or Concerns?</h2>
              <p>
                If you have questions about these guidelines or need to report an
                incident, please contact us:
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
            <Link href="/privacy">Privacy Policy</Link>
            <Link href="/terms">Terms of Service</Link>
            <Link href="/">Return to Home</Link>
          </footer>
        </div>
      </main>
    </>
  );
}
