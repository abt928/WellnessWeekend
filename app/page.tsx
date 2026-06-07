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
import PartnerCard from "@/components/PartnerCard";
import { PlaneIcon, MapPinIcon, LeafIcon, MoonIcon } from "@/components/Icons";

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

      {/* ═══ TICKETS STORE ═══ */}
      <Store />

      {/* ═══ ABOUT / PREVIOUS YEARS ═══ */}
      <section className="about section">
        <div className="about-grid">
          <div className="about-headline">
            <Reveal>
              <p className="section-label">Our Story</p>
              <h2 className="about-title">
                Four years of gathering on this land.
              </h2>
              <p className="about-stats">
                Est. 2023<br />
                4th Annual<br />
                Sutton, Alaska<br />
                3 Days of Ceremony
              </p>
            </Reveal>
          </div>
          <div className="about-desc">
            <Reveal>
              <p>
                What began with a small circle of healers in the summer of 2023
                has become one of Alaska&apos;s most quietly powerful gatherings.
                Each year the community returns — different faces, deepening
                roots. Teachers who came as students. First-timers who drove
                through the night to make it. Families who camp together every
                August.
              </p>
              <p style={{ marginTop: "1.25rem" }}>
                Not a festival. A gathering. A living thread of ceremony,
                sound, and shared presence. The land holds the memory of every
                circle we&apos;ve sat in, every fire we&apos;ve lit, every
                healing that has happened here.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

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
              August 8th. 8:08 AM. The sun is already high — Alaska doesn&apos;t
              do dawn quietly in summer. Each year on this morning we step
              outside together, hold ceremony on the land, and meet the day
              with full presence. No building, no walls. Just mountain air,
              open sky, and the earth beneath bare feet. Led by White Eagle
              Medicine Woman.
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
              One path in. One path out. Walk it in silence — the land does the rest.
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

      {/* ═══ GALLERY ═══ */}
      <Gallery />

      {/* ═══ PLAN YOUR TRIP ═══ */}
      <section id="alaska" className="trip-section">

        {/* Photo banner */}
        <div className="trip-photo">
          <Image src="/images/alaska.png" alt="Matanuska Valley, Alaska" fill style={{ objectFit: "cover", objectPosition: "center 35%" }} priority={false} />
          <div className="trip-photo-overlay" />
          <div className="trip-photo-text">
            <Reveal>
              <p className="section-label" style={{ color: "rgba(255,255,255,0.75)", textAlign: "left" }}>Sutton, Alaska · Aug 7–9</p>
              <h2 className="trip-photo-heading">Plan Your Trip</h2>
            </Reveal>
          </div>
        </div>

        {/* Trip planning cards */}
        <div className="trip-cards">
          <Reveal>
            <div className="trip-card">
              <span className="trip-card-icon"><PlaneIcon size={20} color="var(--sage)" /></span>
              <h3 className="trip-card-title">Getting Here</h3>
              <p className="trip-card-body">Fly into Ted Stevens Anchorage International Airport (ANC), then follow the Glenn Highway northeast to Sutton in the Matanuska-Susitna Valley — one of Alaska&apos;s most breathtaking drives.</p>
            </div>
          </Reveal>
          <Reveal>
            <div className="trip-card">
              <span className="trip-card-icon"><MoonIcon size={20} color="var(--sage)" /></span>
              <h3 className="trip-card-title">August in Alaska</h3>
              <p className="trip-card-body">Days stretch to nearly 19 hours of light around August 8. Temperatures run 55–70°F with cool mornings and evenings. Layers are essential — Alaskan weather is generous and unpredictable.</p>
            </div>
          </Reveal>
          <Reveal>
            <div className="trip-card">
              <span className="trip-card-icon"><MapPinIcon size={20} color="var(--sage)" /></span>
              <h3 className="trip-card-title">Camping On-Site</h3>
              <p className="trip-card-body">On-site camping is included with your pass. Bring a cold-weather sleeping bag and a tent that can handle rain. Hotels and cabins in Palmer and Wasilla are 30–40 minutes away if you prefer a bed.</p>
            </div>
          </Reveal>
          <Reveal>
            <div className="trip-card">
              <span className="trip-card-icon"><LeafIcon size={20} color="var(--sage)" /></span>
              <h3 className="trip-card-title">What to Pack</h3>
              <p className="trip-card-body">Rain jacket, sturdy waterproof footwear, sun protection (the midnight sun is real), and something warm for ceremony under the stars. Leave space in your bag for what you&apos;ll carry home.</p>
            </div>
          </Reveal>
        </div>

        {/* Land acknowledgment */}
        <div className="land-ack">
          <p className="land-ack-text">
            We gather on the unceded ancestral homeland of the Dena&apos;ina Athabascan people,
            whose relationship with this valley, these rivers, and these mountains stretches
            back thousands of years and continues today. We are grateful to be guests on this land.
          </p>
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
              <PartnerCard key={p.name} {...p} />
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
