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
    name: "The Goods Sustainable Grocery",
    role: "Wholesome Foods · Food Vendor",
    logo: "/logos/the-goods.jpg",
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
    image: ["https://wellnessweekendak.com/images/og-thumbnail.jpg"],
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
    performer: [],
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

      {/* ═══ BRAND BANNER ═══ */}
      <div style={{
        background: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "clamp(1rem, 4vw, 3rem)",
        padding: "2.5rem clamp(1rem, 5vw, 4rem)",
        flexWrap: "wrap",
      }}>
        <Image
          src="/images/brand-logo.png"
          alt="Alaska's Healing Arts Festival — Wellness Weekend logo with fire horse and Flower of Life"
          width={560}
          height={720}
          priority
          style={{ width: "clamp(200px, 38vw, 420px)", height: "auto" }}
        />
        <Image
          src="/images/lineup-2026-white.png"
          alt="2026 Music Lineup — J Brave, ÂKÅTÂLĖ, Kuf Knotz + Christine Elise, Flowscape, S7INGRAE & BRACKISH, peacepixy, Shawn Zuke, Jing Xi Kang, High Vibin Mary"
          width={560}
          height={780}
          priority
          style={{ width: "clamp(180px, 34vw, 380px)", height: "auto" }}
        />
      </div>

      {/* ═══ HERO ═══ */}
      <section className="hero">
        <div className="hero-overlay" />
        {/* Fire horse + Flower of Life — transparent PNG floats on the dark hero */}
        <Image
          src="/images/logo-fire-horse.png"
          alt=""
          aria-hidden="true"
          width={700}
          height={933}
          priority
          style={{
            position: "absolute",
            right: "-5%",
            bottom: "0",
            width: "clamp(280px, 55vw, 620px)",
            height: "auto",
            opacity: 0.22,
            pointerEvents: "none",
            zIndex: 1,
            mixBlendMode: "screen",
          }}
        />
        <div className="hero-content" style={{ position: "relative", zIndex: 2 }}>
          <span className="hero-badge">⚡ Final Days — August 7 is Almost Here</span>
          <h1 className="hero-title">
            Wellness <em>Weekend</em>
          </h1>
          <p className="hero-subtitle">
            A Healing Arts Gathering Under the Midnight Sun
          </p>
          <p className="hero-date">August 7 – 9, 2026 · Sutton, Alaska</p>
          <a href="#store" className="hero-cta">
            Last Call — Secure Your Spot →
          </a>
          <p style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.5)", letterSpacing: "0.08em", textTransform: "uppercase", marginTop: "0.75rem" }}>
            Final spots available · Don&apos;t miss it
          </p>
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

      {/* ═══ PHOTO STRIP ═══ */}
      <PhotoStrip />

      {/* ═══ SCHEDULE ═══ */}
      <Schedule />

      {/* ═══ TICKETS STORE ═══ */}
      <Store />

      {/* ═══ PACKAGES ═══ */}
      <Packages />

      {/* ═══ FEATURED LINEUP ═══ */}
      <section className="section lineup-section" style={{
        background:
          "radial-gradient(ellipse at 10% 20%, rgba(212,99,159,0.28) 0%, transparent 45%)," +
          "radial-gradient(ellipse at 90% 15%, rgba(79,54,130,0.32) 0%, transparent 45%)," +
          "radial-gradient(ellipse at 80% 80%, rgba(61,184,175,0.22) 0%, transparent 45%)," +
          "radial-gradient(ellipse at 20% 85%, rgba(229,156,50,0.25) 0%, transparent 45%)," +
          "radial-gradient(ellipse at 50% 50%, rgba(139,95,191,0.15) 0%, transparent 65%)," +
          "#0f0f1a",
        borderRadius: 0,
        padding: "4rem 1.5rem",
      }}>
        <Reveal>
          <p className="section-label" style={{ color: "rgba(255,255,255,0.5)" }}>Music Lineup · August 2026</p>
          <h2 className="section-title" style={{ color: "#fff" }}>The Music.</h2>
        </Reveal>
        <Reveal>
          <div style={{ display: "flex", justifyContent: "center", marginTop: "2rem" }}>
            <Image
              src="/images/lineup-2026.png"
              alt="2026 Music Lineup — J Brave, ÂKÅTÂLĖ, Kuf Knotz + Christine Elise, Flowscape, S7INGRAE & Brackish, peacepixy, Shawn Zuke, Jing Xi Kang, High Vibration Mary"
              width={860}
              height={1160}
              style={{
                width: "min(520px, 92vw)",
                height: "auto",
                borderRadius: 16,
                mixBlendMode: "screen",
              }}
            />
          </div>
        </Reveal>
        <Reveal>
          <div className="lineup-grid" style={{ marginTop: "3rem" }}>
            {[
              {
                src: "/images/client-2026/j-brave-feature-cropped.jpg",
                name: "J Brave",
                role: "Headliner",
                detail: "Keys of Kreation · Friday / Ecstatic Dance · Saturday / Live Set · Sunday",
              },
              {
                src: "/images/client-2026/akatale-feature.jpg",
                name: "ÂKÅTÂLĖ",
                role: "Visiting Artist · Hawaii",
                detail: "Draggon Stargates · Friday / The Expression of the Soul · Saturday",
              },
            ].map((item) => (
              <figure key={item.name} className="lineup-card">
                <div className="lineup-artwork">
                  <Image src={item.src} alt={item.name} fill style={{ objectFit: "cover" }} sizes="(max-width: 600px) 90vw, (max-width: 1100px) 45vw, 24rem" />
                </div>
                <figcaption className="lineup-caption">
                  <strong className="lineup-name">{item.name}</strong>
                  <span className="lineup-role">{item.role}</span>
                  <small className="lineup-detail">{item.detail}</small>
                </figcaption>
              </figure>
            ))}
          </div>
        </Reveal>
      </section>

      {/* ═══ BUILD YOUR WEEKEND ═══ */}
      <BuildYourWeekend />

      {/* ═══ FAMILY DAY ═══ */}
      <section className="family-day-section section">
        <Reveal>
          <p className="section-label">Sunday · August 9</p>
          <h2 className="section-title">Family Day.</h2>
          <p className="section-desc">
            Sunday is a soft landing — the most open, most alive day of the weekend.
            Morning practices for little ones, live music on the main stage all afternoon,
            and a closing ceremony that sends every family home full.
          </p>
        </Reveal>
        <Reveal>
          <div className="family-day-grid">
            <div className="family-day-feature">
              <div className="family-day-icon">🧘</div>
              <h3>Yoga & Meditation for All Ages</h3>
              <p>Upa Yoga at 9 AM welcomes ages 7+ into gentle movement and breathwork. Isha Kriya at 9:30 AM offers a guided meditation for ages 12+ — two Isha Foundation practices designed to ground young minds before the day opens up.</p>
            </div>
            <div className="family-day-feature">
              <div className="family-day-icon">🌊</div>
              <h3>Kids on the Water & in the Air</h3>
              <p>Kids Paddleboard at 1 PM and Intro Aerial Silks for Kids at 2 PM — two of the weekend&apos;s most loved spots for young adventurers. Limited spaces; family passes include both.</p>
            </div>
            <div className="family-day-feature">
              <div className="family-day-icon">🎶</div>
              <h3>Live Music All Afternoon</h3>
              <p>Shawn Zuke opens at noon, followed by Kuf Knotz + Christine Elise, J Brave, and ÂKÅTÂLĖ — a full afternoon of conscious live music on the main stage. No tickets required beyond your weekend pass.</p>
            </div>
          </div>
          <p className="family-day-note">The weekend closes at 5 PM with a Closing &amp; Integration Circle led by Avalon Starling — followed by Community Drumming at the bonfire where everyone is invited to play, move, and sound together one last time.</p>
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
      <section id="vendors" className="section vendor-section" style={{ paddingTop: "3rem", paddingBottom: "3rem" }}>
        <Reveal>
          <p className="section-label vendor-section-label">On-Site Vendors</p>
          <h2 className="section-title vendor-section-title" style={{ marginBottom: "0.75rem" }}>Vendors.</h2>
          <p className="section-desc vendor-section-desc" style={{ marginBottom: "0.5rem" }}>
            A curated village of wellness practitioners, makers, and mission-driven businesses. Day vendor spots are available at $75/day — <a href="mailto:support@thesoundspace.us" style={{ color: "var(--gold)" }}>contact us to inquire</a>.
          </p>
        </Reveal>
        <Reveal>
          <div className="vendor-list">
            {[
              { name: "Retro Roasters Coffee",          role: "Specialty Coffee" },
              { name: "Cacao Bar",                       role: "Ceremonial Cacao" },
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
              { name: "Northern Messages",               role: "Psychic Readings" },
              { name: "The Artery Girdwood",             role: "Tarot · Art" },
              { name: "Sacred Seeds Foundation",         role: "Community Foundation" },
            ].map((v) => (
              <div key={v.name} className="vendor-row">
                <span className="vendor-name">{v.name}</span>
                <span className="vendor-role">{v.role}</span>
              </div>
            ))}
          </div>
        </Reveal>
        <Reveal>
          <div className="vendor-perks">
            <div className="vendor-perk-card">
              <p className="vendor-perk-label">For Vendors</p>
              <p className="vendor-perk-title">Join us for the full experience.</p>
              <p className="vendor-perk-desc">
                As a vendor you&apos;re part of our community — not just our marketplace. Sign up for classes and ceremonies alongside your customers, and make the most of the weekend.
              </p>
              <div className="vendor-perk-actions">
                <a href="#schedule" className="vendor-perk-btn-primary">Browse the Schedule →</a>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ═══ FAQ ═══ */}
      <FAQ />

      {/* ═══ GET INVOLVED ═══ */}
      <GetInvolved />

      {/* ═══ DONATION ═══ */}
      <section style={{ background: "var(--cream)", padding: "3rem 1.5rem", textAlign: "center", borderTop: "1px solid rgba(51,53,51,0.1)" }}>
        <p style={{ fontSize: "0.7rem", letterSpacing: "0.13em", textTransform: "uppercase", color: "var(--gold)", fontWeight: 600, marginBottom: "0.6rem" }}>
          Support the Event
        </p>
        <p style={{ fontSize: "1rem", color: "rgba(51,53,51,0.65)", lineHeight: 1.7, marginBottom: "1.4rem", maxWidth: "420px", margin: "0 auto 1.4rem" }}>
          We appreciate any donations to support our event.
        </p>
        <a
          href="#"
          style={{
            display: "inline-block",
            padding: "0.75rem 2rem",
            background: "transparent",
            color: "var(--gold)",
            fontWeight: 700,
            fontSize: "0.95rem",
            border: "1.5px solid rgba(201,152,63,0.4)",
            borderRadius: "30px",
            textDecoration: "none",
            letterSpacing: "0.02em",
          }}
        >
          Make a Donation →
        </a>
      </section>

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
