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
import {
  FlameIcon,
  LeafIcon,
  CommunityIcon,
  SoundWaveIcon,
  PlaneIcon,
} from "@/components/Icons";

/* ── static data ── */
const partners = [
  { name: "Sound Space", role: "Sound Healing Partner", Icon: SoundWaveIcon },
  { name: "Alaska Fly Dog", role: "Adventure Partner", Icon: PlaneIcon },
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
    name: "Wellness Weekend — 4th Annual Healing Arts Festival",
    description:
      "A transformational weekend of sound healing, earth medicine, and movement under Alaska's midnight sun. Featuring the 8/8 Lion's Gate Activation Ceremony, sacred drumming circles, plant medicine work, breathwork, yoga, ecstatic dance, and more.",
    startDate: "2026-08-08",
    endDate: "2026-08-10",
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

      {/* ═══ HERO ═══ */}
      <section className="hero">
        <div className="hero-bg">
          <Image src="/images/hero.png" alt="Alaska wilderness under the aurora" fill priority style={{ objectFit: "cover" }} />
        </div>
        <div className="hero-overlay" />
        <div className="hero-content">
          <span className="hero-badge">4th Annual Gathering</span>
          <h1 className="hero-title" style={{ fontFamily: "var(--font-display)" }}>
            Wellness <em>Weekend</em>
          </h1>
          <p className="hero-subtitle" style={{ fontFamily: "var(--font-accent)" }}>
            A Healing Arts Gathering Under the Midnight Sun
          </p>
          <p className="hero-date">August 8 – 10, 2026 · Sutton, Alaska</p>
          <CountdownTimer />
          <a href="#store" className="hero-cta">
            Experience the Weekend
          </a>
        </div>
        <div className="scroll-indicator">
          <span>Discover</span>
          <div className="scroll-line" />
        </div>
      </section>

      {/* ═══ ABOUT / VISION ═══ */}
      <section id="about" className="section about">
        <Reveal>
          <p className="section-label">Our Vision</p>
          <h2 className="section-title" style={{ fontFamily: "var(--font-display)" }}>
            Where Earth <em>Meets Sky</em>
          </h2>
          <p className="section-desc" style={{ fontFamily: "var(--font-accent)" }}>
            Wellness Weekend is a transformational gathering where seekers, healers, and
            free spirits come together in Alaska&apos;s breathtaking wilderness for sacred
            plant medicine ceremonies, sound healing, and deep shamanic work. Our festival
            falls on the powerful 8/8 Lion&apos;s Gate Portal, a time of heightened cosmic
            energy and spiritual awakening. For three days, guided by ceremonial shamans
            under the midnight sun, we dissolve boundaries and remember who we truly are.
          </p>
        </Reveal>
        <Reveal>
          <div className="stats">
            {[
              { n: "4th", l: "Year" },
              { n: "200+", l: "Seekers" },
              { n: "75+", l: "Practitioners" },
              { n: "3", l: "Days" },
            ].map((s) => (
              <div className="stat" key={s.l}>
                <div className="stat-number" style={{ fontFamily: "var(--font-display)" }}>{s.n}</div>
                <div className="stat-label">{s.l}</div>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* ═══ SCHEDULE ═══ */}
      <Schedule />

      {/* ═══ THREE PILLARS ═══ */}
      <section id="experience" className="section experience">
        <Reveal>
          <p className="section-label">The Experience</p>
          <h2 className="section-title" style={{ fontFamily: "var(--font-display)" }}>
            Three Pillars of <em>Wellness Weekend</em>
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
                  <h3 className="pillar-title" style={{ fontFamily: "var(--font-display)" }}>{p.title}</h3>
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
            <p className="section-label">The Land</p>
            <h2 className="section-title" style={{ fontFamily: "var(--font-display)" }}>
              A Once in a Lifetime <em>Destination</em>
            </h2>
            <p className="alaska-text" style={{ fontFamily: "var(--font-accent)" }}>
              Nestled in the Matanuska Valley at the foot of the Chugach Mountains,
              our gathering grounds offer glacier-fed rivers, ancient boreal forests,
              and endless wildflower meadows. In August, Alaska&apos;s legendary midnight
              sun bathes the land in golden light nearly around the clock, creating a
              dreamlike atmosphere where time dissolves and healing deepens.
            </p>
            <div className="alaska-features">
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
          </Reveal>
        </div>
      </section>

      {/* ═══ FAQ ═══ */}
      <FAQ />

      {/* ═══ BRAND PARTNERS ═══ */}
      <section id="partners" className="section practitioners">
        <Reveal>
          <p className="section-label">Our Partners</p>
          <h2 className="section-title" style={{ fontFamily: "var(--font-display)" }}>
            Featured <em>Brand Partners</em>
          </h2>
          <p className="section-desc">
            Proud to collaborate with brands that share our vision for healing,
            adventure, and community in the Alaskan wilderness.
          </p>
        </Reveal>
        <Reveal>
          <div className="partner-grid">
            {partners.map((p) => (
              <div className="partner-card" key={p.name}>
                <div className="partner-icon-wrap">
                  <p.Icon size={32} color="var(--psyche-cyan)" />
                </div>
                <div className="partner-name" style={{ fontFamily: "var(--font-display)" }}>{p.name}</div>
                <div className="partner-role">{p.role}</div>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* ═══ GET INVOLVED ═══ */}
      <GetInvolved />

      {/* ═══ FOOTER ═══ */}
      <footer className="footer">
        <h2 className="footer-title" style={{ fontFamily: "var(--font-display)" }}>
          See You Under the <em>Midnight Sun</em>
        </h2>
        <p className="footer-text">
          Join our mailing list for early-bird pricing and festival updates.
        </p>
        <NewsletterForm />
        <div className="footer-socials">
          <a href="#">Instagram</a>
          <a href="#">Facebook</a>
          <a href="#">Contact Us</a>
        </div>
        <div className="footer-legal">
          <a href="/privacy">Privacy Policy</a>
          <span className="footer-legal-sep">·</span>
          <a href="/terms">Terms of Service</a>
        </div>
        <div className="footer-bottom">
          © 2026 Wellness Weekend · Sutton, Alaska · All rights reserved
        </div>
      </footer>
    </>
  );
}
