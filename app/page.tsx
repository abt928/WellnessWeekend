import Image from "next/image";
import Navigation from "@/components/Navigation";
import CountdownTimer from "@/components/CountdownTimer";
import Reveal from "@/components/Reveal";
import Schedule from "@/components/Schedule";
import FAQ from "@/components/FAQ";
import GetInvolved from "@/components/GetInvolved";
import NewsletterForm from "@/components/NewsletterForm";
import Store from "@/components/Store";
import Gallery from "@/components/Gallery";
import FloatingActions from "@/components/FloatingActions";
import ConversionNudges from "@/components/ConversionNudges";
import SoundSpaceLogo from "@/components/SoundSpaceLogo";
import AlaskaFlyDogLogo from "@/components/AlaskaFlyDogLogo";

export default function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: "Wellness Weekend · 4th Annual Healing Arts Festival",
    description:
      "A transformational weekend of sound healing, earth medicine, and movement under Alaska's midnight sun. Featuring the 8/8 Lion's Gate Activation Ceremony, sacred drumming circles, plant medicine work, breathwork, yoga, ecstatic dance, and more.",
    startDate: "2026-08-07",
    endDate: "2026-08-09",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    location: {
      "@type": "Place",
      name: "Warrior Lodge",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Sutton",
        addressRegion: "AK",
        addressCountry: "US",
      },
    },
    image: ["https://wellnessweekendak.com/images/hero.png"],
    organizer: {
      "@type": "Organization",
      name: "Wellness Weekend",
      url: "https://wellnessweekendak.com",
    },
    offers: {
      "@type": "AggregateOffer",
      url: "https://wellnessweekendak.com/#store",
      availability: "https://schema.org/InStock",
      priceCurrency: "USD",
    },
    performer: [
      {
        "@type": "Person",
        name: "White Eagle Medicine Woman",
      },
    ],
    typicalAgeRange: "18+",
    maximumAttendeeCapacity: 200,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navigation />
      <FloatingActions />
      <ConversionNudges />

      <a className="skip-link" href="#main">Skip to main content</a>
      <main id="main">

      {/* ═══ HERO ═══ */}
      <section className="hero">
        <div className="hero-bg">
          <Image src="/images/hero.png" alt="Alaska wilderness under the aurora" fill priority style={{ objectFit: "cover" }} />
        </div>
        <div className="hero-overlay" />
        <div className="hero-content">
          <span className="hero-badge">4th Annual Gathering</span>
          <h1 className="hero-title">
            Wellness <em>Weekend</em>
          </h1>
          <p className="hero-subtitle">
            A Healing Arts Gathering Under the Midnight Sun
          </p>
          <p className="hero-date">August 7 – 9, 2026 · Sutton, Alaska</p>
          <a href="#store" className="hero-cta">
            Get Your Tickets
          </a>
          <CountdownTimer />
        </div>
        <div className="scroll-indicator">
          <span>Discover</span>
          <div className="scroll-constellation" aria-hidden="true">
            <span className="constellation-dot" />
            <span className="constellation-dot" />
            <span className="constellation-dot" />
          </div>
        </div>
      </section>

      {/* ═══ SCHEDULE ═══ */}
      <Schedule />

      {/* ═══ 8/8 LION'S GATE PORTAL ═══ */}
      <section id="portal" className="section lionsgate portal-animated">
        {/* Aurora ribbons + fire horse — purely decorative background */}
        <div className="portal-aurora-bg" aria-hidden="true">
          <div className="aurora-band aurora-band-1" />
          <div className="aurora-band aurora-band-2" />
          <div className="aurora-band aurora-band-3" />
          <div className="aurora-band aurora-band-4" />
          <div className="portal-fire-horse">🐎</div>
        </div>

        <div className="portal-fg">
          <Reveal>
            <p className="section-label">August 8, 2026</p>
            <h2 className="section-title">The 8/8 Lion&apos;s Gate Portal.</h2>
            <p className="lionsgate-portal-date">8 · 8</p>
          </Reveal>
          <Reveal>
            <div className="lionsgate-text lionsgate-text-solo">
              <p>
                Every year on August 8th, Earth aligns with the Sun and Sirius — the
                brightest star in our sky, revered by ancient Egyptians as the Spiritual Sun.
                The Pyramids of Giza were oriented to Sirius&apos;s heliacal rising; its annual
                reappearance after 70 days of absence marked the flooding of the Nile and the
                Egyptian New Year. Across cultures and across millennia, this alignment has
                been understood as a gateway — a thinning of the veil between earthly life
                and higher consciousness.
              </p>
              <p>
                In numerology, 8 carries the energy of infinite flow, abundance, and the
                eternal cycle. Two 8s in alignment multiply that force. On 8/8, intentions
                held in the heart crystallize with unusual clarity, the body opens to receive
                light codes from higher realms, and collective ceremony amplifies exponentially.
              </p>
              <p>
                Wellness Weekend 2026 rises directly on this portal. Our Saturday arc is built
                around the opening: a dawn Lionsgate Activation + Floating Sound Bath, the sacred
                Ayni Despacho Ceremony, and the Lionsgate Drumming Ceremony at nightfall led by
                White Eagle Medicine Woman — a full day of ceremony, movement, and music held
                inside the field of the 8/8 gateway.
              </p>
            </div>
          </Reveal>
          <Reveal>
            <div className="lionsgate-pillars">
              <div className="lionsgate-pillar">
                <div className="lionsgate-pillar-icon">✦</div>
                <h3>Sirius Rising</h3>
                <p>The brightest star in the night sky, aligned with the Sun each 8/8. Ancient civilizations built their temples to its return — a star long held as the portal to accelerated spiritual evolution.</p>
              </div>
              <div className="lionsgate-pillar">
                <div className="lionsgate-pillar-icon">∞</div>
                <h3>The Infinite 8</h3>
                <p>In numerology, 8 is the number of abundance, power, and the eternal cycle. Doubled on 8/8, this energy amplifies — a day when what you call in, answers.</p>
              </div>
              <div className="lionsgate-pillar">
                <div className="lionsgate-pillar-icon">🔥</div>
                <h3>Sacred Activation</h3>
                <p>Our entire Saturday is a ceremony arc built on the portal: dawn sound bath, Ayni ceremony, cacao, and the Lionsgate Drumming Ceremony at nightfall under the Alaskan sky.</p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══ TICKETS STORE ═══ */}
      <Store />

      {/* ═══ GALLERY ═══ */}
      <Gallery />

      {/* ═══ ALASKA / THE LAND ═══ */}
      <section id="alaska" className="alaska">
        <div className="alaska-bg">
          <Image src="/images/alaska.png" alt="Vast Alaskan wilderness" fill style={{ objectFit: "cover" }} />
        </div>
        <div className="alaska-overlay" />
        <div className="alaska-content">
          <Reveal>
            <p className="section-label alaska-label">The Land</p>
            <h2 className="section-title alaska-title">
              A once-in-a-lifetime destination.
            </h2>
            <p className="alaska-text">
              Nestled in the Matanuska Valley at the foot of the Chugach Mountains,
              our gathering grounds offer glacier-fed rivers, ancient boreal forests,
              and endless wildflower meadows. In August, Alaska&apos;s legendary midnight
              sun bathes the land in golden light nearly around the clock, creating a
              dreamlike atmosphere where time dissolves and healing deepens.
            </p>
          </Reveal>
        </div>
        <div className="alaska-tags-band">
          {[
            "Midnight Sun",
            "Aurora Borealis",
            "Glacier Rivers",
            "Wildflower Meadows",
            "Mountain Vistas",
            "Boreal Forest",
            "Wildlife",
            "Pristine Air",
          ].map((t) => (
            <span className="alaska-tag" key={t}>{t}</span>
          ))}
        </div>
      </section>

      {/* ═══ FAQ ═══ */}
      <FAQ />

      {/* ═══ BRAND PARTNERS ═══ */}
      <section id="partners" className="section practitioners">
        <Reveal>
          <p className="section-label">Our Partners</p>
          <h2 className="section-title">
            Partners.
          </h2>
          <p className="section-desc">
            Proud to collaborate with brands that share our vision for healing,
            adventure, and community in the Alaskan wilderness.
          </p>
        </Reveal>
        <Reveal>
          <div className="partner-grid">
            <div className="partner-card partner-card-logo">
              <SoundSpaceLogo className="partner-logo-svg" />
              <div className="partner-role">Sound Healing Partner</div>
            </div>
            <div className="partner-card partner-card-logo">
              <AlaskaFlyDogLogo className="partner-logo-svg" />
            </div>
          </div>
        </Reveal>
      </section>

      {/* ═══ GET INVOLVED ═══ */}
      <GetInvolved />

      </main>

      {/* ═══ FOOTER ═══ */}
      <footer className="footer">
        <h2 className="footer-title">
          See you under the <em>midnight sun</em>.
        </h2>
        <p className="footer-text">
          Join our mailing list for early-bird pricing and festival updates.
        </p>
        <NewsletterForm />
        <div className="footer-socials">
          <a href="https://www.instagram.com/wellnessweekend.ak" target="_blank" rel="noopener noreferrer">Instagram</a>
          <a href="https://www.facebook.com/wellnessweekend.ak/" target="_blank" rel="noopener noreferrer">Facebook</a>
          <a href="https://www.tiktok.com/@the.soundspace" target="_blank" rel="noopener noreferrer">TikTok</a>
          <a href="mailto:support@thesoundspace.us">Contact Us</a>
        </div>
        <div className="footer-legal">
          <a href="/privacy">Privacy Policy</a>
          <span className="footer-legal-sep">·</span>
          <a href="/terms">Terms of Service</a>
          <span className="footer-legal-sep">·</span>
          <a href="/guidelines">Community Guidelines</a>
        </div>
        <div className="footer-bottom">
          © {new Date().getFullYear()} Wellness Weekend ·{" "}
          <a href="https://www.thesoundspace.us/" target="_blank" rel="noopener noreferrer" style={{ color: "inherit", textDecoration: "underline", textUnderlineOffset: "3px" }}>
            Sound Healing Products LLC
          </a>{" "}
          · Sutton, Alaska
        </div>
      </footer>
    </>
  );
}
