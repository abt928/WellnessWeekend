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
import {
  FlameIcon,
  LeafIcon,
  CommunityIcon,
} from "@/components/Icons";

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

const pillars = [
  {
    img: "/images/sound-healing.png",
    Icon: FlameIcon,
    title: "Transformation",
    desc: "The 8/8 Lion\u2019s Gate Activation Ceremony, sacred drumming circles led by White Eagle Medicine Woman, plant medicine work, and deep shamanic journeys that shatter boundaries and ignite rebirth.",
  },
  {
    img: "/images/earth-medicine.png",
    Icon: LeafIcon,
    title: "Integration",
    desc: "Sound healing, breathwork, yoga, bodywork, and earth medicine: practices that help you anchor and embody the shifts. Take the transformation home with you.",
  },
  {
    img: "/images/movement.png",
    Icon: CommunityIcon,
    title: "Community",
    desc: "Ecstatic dance, communal meals, campfire circles, and shared ceremony. A tribe of 200+ seekers holding space for each other under the midnight sun.",
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

      {/* ═══ ABOUT / VISION ═══ */}
      <section id="about" className="section about">
        <div className="about-grid">
          <Reveal>
            <div className="about-headline">
              <p className="section-label">Our Vision</p>
              <h2 className="section-title about-title">
                Where earth meets sky.
              </h2>
              <p className="about-stats">
                4th annual · 200+ seekers · 75+ practitioners · 3 days under the midnight sun.
              </p>
            </div>
          </Reveal>
          <Reveal>
            <p className="about-desc">
              Wellness Weekend is a transformational gathering where seekers, healers, and
              free spirits come together in Alaska&apos;s breathtaking wilderness for sacred
              plant medicine ceremonies, sound healing, and deep shamanic work. Our festival
              falls on the powerful 8/8 Lion&apos;s Gate Portal, a time of heightened cosmic
              energy and spiritual awakening. For three days, guided by ceremonial shamans
              under the midnight sun, we dissolve boundaries and remember who we truly are.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ═══ SCHEDULE ═══ */}
      <Schedule />

      {/* ═══ THREE PILLARS ═══ */}
      <section id="experience" className="section experience">
        <Reveal>
          <p className="section-label">The Experience</p>
          <h2 className="section-title">
            Three pillars.
          </h2>
          <p className="section-desc">
            Every offering at Wellness Weekend is woven through three guiding principles:
            the pillars that shape every ceremony, workshop, and moment of connection.
          </p>
        </Reveal>
        <Reveal>
          <div className="pillars">
            {pillars.map((p) => (
              <div className="pillar" key={p.title}>
                <div className="pillar-img">
                  <Image src={p.img} alt={p.title} fill style={{ objectFit: "cover" }} />
                </div>
                <div className="pillar-overlay" />
                <div className="pillar-content">
                  <div className="pillar-icon">
                    <p.Icon size={36} color="white" />
                  </div>
                  <h3 className="pillar-title">{p.title}</h3>
                  <p className="pillar-desc">{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </Reveal>
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
