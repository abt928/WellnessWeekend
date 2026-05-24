import Image from "next/image";
import Navigation from "@/components/Navigation";
import CountdownTimer from "@/components/CountdownTimer";
import Reveal from "@/components/Reveal";
import Schedule from "@/components/Schedule";
import FAQ from "@/components/FAQ";
import GetInvolved from "@/components/GetInvolved";
import Store from "@/components/Store";
import Gallery from "@/components/Gallery";
import FloatingActions from "@/components/FloatingActions";
import ConversionNudges from "@/components/ConversionNudges";

/* ── static data ── */
const partners = [
  {
    name: "Alaska Fly Dog",
    role: "Massage · Adventures in Wellness",
    logo: "/logos/alaska-fly-dog.png",
    logoWidth: 260,
    logoHeight: 120,
  },
  {
    name: "The Sound Space",
    role: "Sound Healing Partner",
    logo: "/logos/sound-space.png",
    logoWidth: 120,
    logoHeight: 120,
  },
];

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
    performer: [{ "@type": "Person", name: "White Eagle Medicine Woman" }],
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
          <p className="hero-pricing-hint">Day passes from $44 · Full weekend from $222</p>
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

      {/* ═══ LION'S GATE PORTAL ═══ */}
      <section id="portal" className="portal-section" aria-label="Lion's Gate Portal">
        {/* Aurora bands */}
        <div className="portal-aurora" aria-hidden="true">
          <div className="aurora-band aurora-band-1" />
          <div className="aurora-band aurora-band-2" />
          <div className="aurora-band aurora-band-3" />
          <div className="aurora-band aurora-band-4" />
        </div>

        {/* Ghost fire horse */}
        <div className="portal-fire-horse" aria-hidden="true">🐎</div>

        <div className="portal-content">
          <Reveal>
            <p className="section-label portal-label">August 8 · 8:08 AM</p>
            <h2 className="portal-title">Lion&apos;s Gate Portal</h2>
            <p className="portal-desc">
              Each year our gathering coincides with the 8/8 Lion&apos;s Gate — when
              Sirius rises in perfect alignment with the sun and the pyramids of Giza,
              flooding Earth with a surge of high-frequency light. This cosmic doorway
              amplifies intention, accelerates healing, and opens channels of
              spiritual awakening. We mark the exact moment with a ceremony
              at sunrise, led by White Eagle Medicine Woman, under the Alaskan sky.
            </p>
            <a href="#store" className="portal-cta">Claim Your Place in the Circle</a>
          </Reveal>
        </div>
      </section>

      {/* ═══ LABYRINTH GARDEN ═══ */}
      <section id="labyrinth" className="labyrinth-section" aria-label="Labyrinth Garden">
        <div className="labyrinth-spiral-bg" aria-hidden="true">
          <div className="labyrinth-ring labyrinth-ring-1" />
          <div className="labyrinth-ring labyrinth-ring-2" />
          <div className="labyrinth-ring labyrinth-ring-3" />
          <div className="labyrinth-ring labyrinth-ring-4" />
          <div className="labyrinth-ring labyrinth-ring-5" />
          <div className="labyrinth-ring labyrinth-ring-6" />
          <div className="labyrinth-center-dot" />
        </div>

        <div className="labyrinth-content">
          <Reveal>
            <p className="section-label labyrinth-label">Sacred Ground</p>
            <h2 className="labyrinth-title">The Labyrinth Garden</h2>
            <p className="labyrinth-desc">
              Nestled at the edge of the boreal forest, our living labyrinth is
              woven from wildflowers, stones, and old-growth roots. Unlike a maze,
              the labyrinth has one path — a walking meditation that carries you
              inward to your center and back out transformed. Step in with a question.
              Walk with breath. Emerge with clarity.
            </p>
          </Reveal>
          <Reveal>
            <div className="labyrinth-offerings">
              {[
                { time: "Dawn", offering: "Silent Walking Meditation", desc: "Guided entry at sunrise with breathwork activation" },
                { time: "Midday", offering: "Integration Walks", desc: "Open access between ceremonies for personal reflection" },
                { time: "Dusk", offering: "Closing Circle", desc: "Gratitude ceremony and group spiral walk at sunset" },
              ].map((o) => (
                <div className="labyrinth-offering-card" key={o.time}>
                  <div className="labyrinth-offering-time">{o.time}</div>
                  <div className="labyrinth-offering-name">{o.offering}</div>
                  <div className="labyrinth-offering-desc">{o.desc}</div>
                </div>
              ))}
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
          {["Midnight Sun","Aurora Borealis","Glacier Rivers","Wildflower Meadows","Mountain Vistas","Boreal Forest","Wildlife","Pristine Air"].map((t) => (
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
          <h2 className="section-title">Partners.</h2>
          <p className="section-desc">
            Proud to collaborate with brands that share our vision for healing,
            adventure, and community in the Alaskan wilderness.
          </p>
        </Reveal>
        <Reveal>
          <div className="partner-grid">
            {partners.map((p) => (
              <div className="partner-card partner-card-logo" key={p.name}>
                <div className="partner-logo-img-wrap">
                  <Image
                    src={p.logo}
                    alt={p.name}
                    width={p.logoWidth}
                    height={p.logoHeight}
                    style={{ objectFit: "contain", width: "100%", height: "100%" }}
                  />
                </div>
                <div className="partner-role">{p.role}</div>
              </div>
            ))}
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
        <p className="footer-text">Sutton, Alaska · August 7–9, 2026</p>
        <div className="footer-socials">
          <a href="https://www.instagram.com/wellnessweekendak" target="_blank" rel="noopener noreferrer">Instagram</a>
          <a href="https://www.facebook.com/wellnessweekendak" target="_blank" rel="noopener noreferrer">Facebook</a>
          <a href="mailto:hello@wellnessweekendak.com">Contact</a>
        </div>
        <div className="footer-legal">
          <a href="/privacy">Privacy</a>
          <span className="footer-legal-sep">·</span>
          <a href="/terms">Terms</a>
          <span className="footer-legal-sep">·</span>
          <a href="/refunds">Refund Policy</a>
        </div>
        <div className="footer-bottom">
          © {new Date().getFullYear()} Wellness Weekend. All rights reserved.
        </div>
      </footer>
    </>
  );
}
