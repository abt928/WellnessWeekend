import Image from "next/image";
import Navigation from "@/components/Navigation";
import CountdownTimer from "@/components/CountdownTimer";
import Reveal from "@/components/Reveal";
import Schedule from "@/components/Schedule";
import FAQ from "@/components/FAQ";
import GetInvolved from "@/components/GetInvolved";
import Store from "@/components/Store";
import Packages from "@/components/Packages";
import PhotoStrip from "@/components/PhotoStrip";
import FloatingActions from "@/components/FloatingActions";
import ConversionNudges from "@/components/ConversionNudges";
import PartnerCard from "@/components/PartnerCard";
import BuildYourWeekend from "@/components/BuildYourWeekend";
import ContrastTherapy from "@/components/ContrastTherapy";
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
  {
    name: "Flow Massage",
    role: "Licensed Massage Therapy",
    logo: "/logos/flow-massage.png",
    logoWidth: 200,
    logoHeight: 100,
  },
  {
    name: "The Alaska Massage Band",
    role: "Therapeutic Massage · Bodywork",
    logo: "/logos/alaska-massage-band.png",
    logoWidth: 200,
    logoHeight: 100,
  },
  {
    name: "Alaska Meal Prep",
    role: "Nourishment · Clean Eating",
    logo: "/logos/alaska-meal-prep.png",
    logoWidth: 200,
    logoHeight: 100,
  },
  {
    name: "Whirling Rainbow Foundation",
    role: "Community Nonprofit",
    logo: "/logos/whirling-rainbow.png",
    logoWidth: 200,
    logoHeight: 100,
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
        <div className="hero-overlay" />
        <span className="hero-fire-horse-ghost" aria-hidden="true">🐎</span>
        <div className="hero-content">
          <span className="hero-badge">4th Annual Gathering · Lion's Gate</span>
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

      {/* ═══ MIDNIGHT SUN SALE ═══ */}
      <div className="midnightsun-banner" role="complementary" aria-label="Midnight Sun Sale">
        <div className="midnightsun-inner">
          <span className="midnightsun-sun" aria-hidden="true">☀</span>
          <span className="midnightsun-title">Midnight Sun Sale</span>
          <span className="midnightsun-desc">
            Use code <span className="midnightsun-code">MIDNIGHTSUN</span> for 50% off your 2nd ticket
            <span className="midnightsun-ends"> · Active through July 7</span>
          </span>
          <a href="#store" className="midnightsun-cta">Claim Now →</a>
        </div>
      </div>

      {/* ═══ SCHEDULE ═══ */}
      <Schedule />

      {/* ═══ PHOTO STRIP ═══ */}
      <PhotoStrip />

      {/* ═══ TICKETS STORE ═══ */}
      <Store />

      {/* ═══ BUILD YOUR WEEKEND ═══ */}
      <BuildYourWeekend />

      {/* ═══ CONTRAST THERAPY ═══ */}
      <ContrastTherapy />

      {/* ═══ PACKAGES ═══ */}
      <Packages />

      {/* ═══ FAMILY DAY ═══ */}
      <section className="family-day-section section">
        <Reveal>
          <p className="section-label">Sunday · August 9</p>
          <h2 className="section-title">Family Day.</h2>
          <p className="section-desc">
            Wellness for all ages — Sunday is dedicated to families, children, and the next generation of earth stewards.
          </p>
        </Reveal>
        <Reveal>
          <div className="family-day-grid">
            <div className="family-day-feature">
              <div className="family-day-icon">🪁</div>
              <h3>Intro Aerial Silks for Kids</h3>
              <p>Children discover the joy of movement in the air with a beginner-friendly aerial silks session. Limited spots — reserve ahead.</p>
            </div>
            <div className="family-day-feature">
              <div className="family-day-icon">🪨</div>
              <h3>Crystal Scavenger Hunt</h3>
              <p>A guided crystal hunt through the grounds — kids learn about the stones of the earth and keep what they find.</p>
            </div>
            <div className="family-day-feature">
              <div className="family-day-icon">🌿</div>
              <h3>Arts, Crafts & Nature Play</h3>
              <p>Needlefelting, nature art, and free play in the labyrinth garden. All materials provided.</p>
            </div>
          </div>
          <p className="family-day-note">All Family Day proceeds support youth wellness nonprofits in the Matanuska-Susitna Valley.</p>
        </Reveal>
      </section>

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

        {/* Warrior Lodge pitch */}
        <Reveal>
          <div className="warrior-lodge">
            <div className="warrior-lodge-text">
              <p className="section-label" style={{ textAlign: "left" }}>Warrior Lodge · On-Site Accommodation</p>
              <h3 className="warrior-lodge-title">Stay warm. Stay dry. Dance all night.</h3>
              <p className="warrior-lodge-desc">
                August in Alaska is wild — radiant summer days that stretch past midnight and cool, crisp nights perfect for gathering under the stars. The Warrior Lodge and on-site cabins were built for exactly this: a warm, dry sanctuary between ceremonies so you never have to leave the magic.
              </p>
              <p className="warrior-lodge-desc" style={{ marginTop: "0.75rem" }}>
                Wake up steps from the lake. Walk to morning yoga. Come back to a real bed after the fire dies. On-site lodging is limited and fills every year — fewer than 10 camping passes remain.
              </p>
              <a href="#store" className="warrior-lodge-cta">Reserve Lodging →</a>
            </div>
          </div>
        </Reveal>

        {/* Land acknowledgment */}
        <div className="land-ack">
          <p className="land-ack-text">
            We gather on the unceded ancestral homeland of the Dena&apos;ina Athabascan people,
            whose relationship with this valley, these rivers, and these mountains stretches
            back thousands of years and continues today. We are grateful to be guests on this land.
          </p>
        </div>

      </section>

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
          <div className="partner-row">
            {partners.map((p) => (
              <PartnerCard key={p.name} {...p} />
            ))}
          </div>
        </Reveal>
      </section>

      {/* ═══ VENDORS ═══ */}
      <section id="vendors" className="section" style={{ paddingTop: "3rem", paddingBottom: "3rem" }}>
        <Reveal>
          <p className="section-label">On-Site Vendors</p>
          <h2 className="section-title" style={{ marginBottom: "0.75rem" }}>Vendors.</h2>
          <p className="section-desc" style={{ marginBottom: "0.5rem" }}>
            Vendor Village is full for 2026. Day vendor spots are available at $100/day — contact us to inquire.
          </p>
        </Reveal>
        <Reveal>
          <div className="vendor-list">
            {[
              { name: "Retro Roasters Coffee",          role: "Specialty Coffee" },
              { name: "Cacao Bar",                       role: "Ceremonial Cacao" },
              { name: "Whirling Rainbow Foundation",     role: "Community Nonprofit" },
              { name: "Flow Massage",                    role: "Chair Massage" },
              { name: "Echo and Sage",                   role: "Stained Glass Art" },
              { name: "Ecuadorian Products",             role: "Artisan Goods" },
              { name: "Tundra Wellness",                 role: "Massage · Craniosacral · Wellness Products" },
              { name: "AK Child & Family",               role: "Family Resources" },
              { name: "Aurora Acupuncture",              role: "Acupuncture" },
              { name: "Fireweed and Flames",             role: "Reiki Candles · Reiki & Tarot" },
              { name: "Starfish Wellness & Massage",     role: "Massage Therapy" },
              { name: "Lifewave",                        role: "Wellness Products" },
              { name: "Arbonne",                         role: "Clean Beauty & Wellness" },
              { name: "Northern Messages",               role: "Artisan Goods" },
            ].map((v) => (
              <div key={v.name} className="vendor-row">
                <span className="vendor-name">{v.name}</span>
                <span className="vendor-role">{v.role}</span>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* ═══ FAQ ═══ */}
      <FAQ />

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
          <a href="mailto:support@thesoundspace.us">Contact</a>
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
