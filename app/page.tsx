import Navigation from "@/components/Navigation";
import BlackFridayBanner from "@/components/BlackFridayBanner";
import BFEndCountdown from "@/components/BFEndCountdown";
import { MapPinIcon } from "@/components/Icons";

export const metadata = {
  title: "Wellness Weekend 2027 · Sutton, Alaska",
  description: "5th Annual Wellness Weekend — sound healing, ecstatic dance, ceremony & earth medicine at Warrior Lodge in Sutton, Alaska.",
};

const PILLARS = [
  {
    name: "Sound Healing",
    desc: "Crystal bowls, gongs & sound baths on the lake",
    img: "/images/client-2026/floating-sound-bath.jpg",
    href: "/floating",
  },
  {
    name: "Ecstatic Dance",
    desc: "Free movement guided by live DJs & musicians",
    img: "/images/gallery/2025-08-09_Festival_Wellness_Woman-Dancing-Colorful-Dress.jpg",
    href: "/ecstatic-dance",
  },
  {
    name: "Healing Arts",
    desc: "Massage, ceremony & plant medicine practitioners",
    img: "/images/client-2026/white-eagle-medicine-woman-feature.webp",
    href: "/practitioners",
  },
  {
    name: "The Land",
    desc: "Paddleboard yoga, wild swimming & mountain views",
    img: "/images/client-2026/lakeside-paddleboard-practice.webp",
    href: "/paddleboard",
  },
  {
    name: "Ceremony",
    desc: "Fire circles, drumming & sacred community ritual",
    img: "/images/gallery/2026_Avalon-Starling-Drum-Ceremony.jpg",
    href: "/archive",
  },
  {
    name: "Community",
    desc: "The people who gather with open hearts",
    img: "/images/gallery/2025-08-09_Festival_Wellness_Group-Circle-Arms-Raised.jpg",
    href: "/instructors",
  },
];

const PARTNERS: { name: string; logo: string | null; href: string }[] = [
  { name: "The Sound Space", logo: "/logos/sound-space.png", href: "https://thesoundspace.us" },
  { name: "Alaska Fly Dog", logo: "/logos/alaska-fly-dog.png", href: "https://alaskaflydog.com" },
  { name: "Alaska's Healing Hearts", logo: null, href: "https://alaskashealinghearts.com" },
];

export default function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: "Wellness Weekend · 5th Annual Healing Arts Festival",
    description: "A transformational weekend of sound healing, earth medicine, and movement under Alaska's midnight sun. Returning to Warrior Lodge, Sutton, Alaska in 2027.",
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
    organizer: {
      "@type": "Organization",
      name: "Wellness Weekend",
      url: "https://wellnessweekendak.com",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BlackFridayBanner />
      <Navigation />

      <main>

        {/* ═══ COMPACT HEADER ═══ */}
        <div style={{
          background: "#090912",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          padding: "3rem 1.5rem 2.5rem",
          textAlign: "center",
        }}>
          <p style={{ fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(201,152,63,0.8)", fontWeight: 700, marginBottom: "0.75rem" }}>
            5th Annual · Wellness Weekend
          </p>
          <h1 style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(2rem, 6vw, 3.5rem)",
            fontWeight: 700, lineHeight: 1.1,
            color: "#fff",
            marginBottom: "0.75rem",
          }}>
            Sound healing, dance &amp; ceremony<br />
            <em style={{ color: "var(--gold, #C9983F)" }}>under Alaska&apos;s midnight sun.</em>
          </h1>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", color: "rgba(255,255,255,0.3)", fontSize: "0.82rem" }}>
            <MapPinIcon size={14} color="rgba(255,255,255,0.3)" />
            Warrior Lodge · Sutton, Alaska · 2027
          </div>
        </div>

        {/* ═══ PACKAGES ═══ */}
        <section id="packages" style={{
          background: "#090912",
          padding: "5rem 1.5rem",
          textAlign: "center",
          borderTop: "1px solid rgba(255,255,255,0.06)",
        }}>
          <div style={{ maxWidth: "860px", margin: "0 auto" }}>
            <p style={{ fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--gold, #C9983F)", fontWeight: 700, marginBottom: "1rem" }}>
              2027 Packages · Early Access
            </p>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2rem, 5vw, 3.2rem)", color: "#fff", lineHeight: 1.15, marginBottom: "0.75rem" }}>
              Choose your weekend.
            </h2>
            <p style={{ fontSize: "1rem", color: "rgba(255,255,255,0.4)", lineHeight: 1.75, maxWidth: "460px", margin: "0 auto 2.5rem" }}>
              Dates to be announced. Deposits applied to your total — refund eligible.
            </p>

            {/* Black Friday Live Block */}
            <div style={{
              background: "linear-gradient(135deg, rgba(26,10,0,0.9) 0%, rgba(45,18,0,0.9) 50%, rgba(26,10,0,0.9) 100%)",
              border: "1px solid rgba(201,152,63,0.4)",
              borderRadius: 18,
              padding: "1.75rem",
              marginBottom: "2.5rem",
              textAlign: "left",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "0.75rem", marginBottom: "1.25rem" }}>
                <div>
                  <p style={{ fontSize: "0.6rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(201,152,63,0.9)", fontWeight: 700, marginBottom: "0.35rem" }}>
                    🖤 Black Friday 2027 · Live Now
                  </p>
                  <p style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.7)", lineHeight: 1.5 }}>
                    Limited spots at special pricing.{" "}
                    <strong style={{ color: "rgba(255,255,255,0.9)" }}>Refund eligible</strong> — dates not yet announced.
                  </p>
                </div>
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <p style={{ fontSize: "0.58rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", fontWeight: 600, marginBottom: "0.2rem" }}>
                    Ends Dec 1 in
                  </p>
                  <p style={{ fontSize: "1.1rem", lineHeight: 1 }}>
                    <BFEndCountdown />
                  </p>
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "0.75rem" }}>
                <a href="/weekend-pass" style={{ display: "block", background: "rgba(94,138,106,0.12)", border: "1px solid rgba(94,138,106,0.4)", borderRadius: 12, padding: "1.1rem 1.25rem", textDecoration: "none" }}>
                  <p style={{ fontSize: "0.62rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(94,138,106,0.9)", fontWeight: 700, marginBottom: "0.3rem" }}>Weekend Pass</p>
                  <p style={{ fontFamily: "var(--font-display)", fontSize: "1.6rem", fontWeight: 800, color: "#fff", marginBottom: "0.2rem", lineHeight: 1 }}>$77</p>
                  <p style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.4)" }}>25 spots · 3-day pass →</p>
                </a>
                <a href="/earth-pass" style={{ display: "block", background: "rgba(201,152,63,0.1)", border: "1px solid rgba(201,152,63,0.4)", borderRadius: 12, padding: "1.1rem 1.25rem", textDecoration: "none" }}>
                  <p style={{ fontSize: "0.62rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(201,152,63,0.9)", fontWeight: 700, marginBottom: "0.3rem" }}>Earth Pass</p>
                  <p style={{ fontFamily: "var(--font-display)", fontSize: "1.6rem", fontWeight: 800, color: "#fff", marginBottom: "0.2rem", lineHeight: 1 }}>$177</p>
                  <p style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.4)" }}>10 spots · full access + camping →</p>
                </a>
                <a href="/deposit" style={{ display: "block", background: "rgba(155,127,212,0.08)", border: "1px solid rgba(155,127,212,0.3)", borderRadius: 12, padding: "1.1rem 1.25rem", textDecoration: "none" }}>
                  <p style={{ fontSize: "0.62rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(155,127,212,0.9)", fontWeight: 700, marginBottom: "0.3rem" }}>Hold a Package</p>
                  <p style={{ fontFamily: "var(--font-display)", fontSize: "1.6rem", fontWeight: 800, color: "#fff", marginBottom: "0.2rem", lineHeight: 1 }}>$250</p>
                  <p style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.4)" }}>Deposit · cabin, recovery or adventure →</p>
                </a>
              </div>
            </div>

            {/* Full Pass Options */}
            <p style={{ fontSize: "0.6rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", fontWeight: 700, marginBottom: "1.25rem" }}>
              All Weekend Passes
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(270px, 1fr))", gap: "1rem", marginBottom: "2.5rem", textAlign: "left" }}>

              {/* Earth Pass */}
              <div style={{ border: "1px solid rgba(94,138,106,0.35)", borderRadius: 18, padding: "1.75rem", background: "radial-gradient(ellipse at 10% 10%, rgba(94,138,106,0.09) 0%, transparent 60%), rgba(255,255,255,0.02)" }}>
                <div style={{ fontSize: "1.75rem", marginBottom: "0.75rem" }}>🏕</div>
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.35rem", color: "#fff", marginBottom: "0.3rem", lineHeight: 1.2 }}>
                  Earth Pass
                </h3>
                <p style={{ fontSize: "0.72rem", color: "var(--sage, #5E8A6A)", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "1.25rem" }}>
                  Full 3-Day Access · Grounds Camping
                </p>
                <ul style={{ listStyle: "none", padding: 0, margin: "0 0 1.75rem", display: "flex", flexDirection: "column", gap: "0.55rem" }}>
                  {[
                    "All workshops & ceremonies",
                    "Sound healing & meditation",
                    "Live music & ecstatic dance",
                    "On-site camping at Warrior Lodge",
                    "Community fire circle",
                  ].map(item => (
                    <li key={item} style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.6)", display: "flex", gap: "0.5rem" }}>
                      <span style={{ color: "var(--sage, #5E8A6A)", flexShrink: 0 }}>✓</span> {item}
                    </li>
                  ))}
                </ul>
                <a href="/earth-pass" style={{ display: "block", textAlign: "center", padding: "0.72rem 1.25rem", borderRadius: 30, background: "rgba(94,138,106,0.85)", color: "#fff", fontSize: "0.85rem", fontWeight: 700, textDecoration: "none", letterSpacing: "0.04em" }}>
                  Get Earth Pass $177 →
                </a>
              </div>

              {/* Sanctuary Pass */}
              <div style={{ border: "1px solid rgba(155,127,212,0.35)", borderRadius: 18, padding: "1.75rem", background: "radial-gradient(ellipse at 10% 10%, rgba(155,127,212,0.09) 0%, transparent 60%), rgba(255,255,255,0.02)" }}>
                <div style={{ fontSize: "1.75rem", marginBottom: "0.75rem" }}>🌙</div>
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.35rem", color: "#fff", marginBottom: "0.3rem", lineHeight: 1.2 }}>
                  Sanctuary Pass
                </h3>
                <p style={{ fontSize: "0.72rem", color: "rgba(155,127,212,0.85)", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "1.25rem" }}>
                  Cabin Bed · 2 Nights · Shared Cabin
                </p>
                <ul style={{ listStyle: "none", padding: 0, margin: "0 0 1.75rem", display: "flex", flexDirection: "column", gap: "0.55rem" }}>
                  {[
                    "Cabin bed, 2 nights — shared (5–6 adults)",
                    "Full 3-day weekend access",
                    "All workshops, ceremonies & healing arts",
                    "Morning movement & breathwork",
                    "Community fire circle",
                  ].map(item => (
                    <li key={item} style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.6)", display: "flex", gap: "0.5rem" }}>
                      <span style={{ color: "rgba(155,127,212,0.85)", flexShrink: 0 }}>✓</span> {item}
                    </li>
                  ))}
                </ul>
                <a href="/deposit?pkg=sanctuary" style={{ display: "block", textAlign: "center", padding: "0.72rem 1.25rem", borderRadius: 30, border: "1px solid rgba(155,127,212,0.5)", color: "rgba(155,127,212,0.9)", fontSize: "0.85rem", fontWeight: 700, textDecoration: "none", letterSpacing: "0.04em" }}>
                  Reserve with $250 Deposit →
                </a>
              </div>

              {/* Private Suite */}
              <div style={{ border: "1px solid rgba(212,131,63,0.4)", borderRadius: 18, padding: "1.75rem", background: "radial-gradient(ellipse at 10% 10%, rgba(212,131,63,0.1) 0%, transparent 60%), rgba(255,255,255,0.02)", position: "relative" }}>
                <div style={{ position: "absolute", top: "1.25rem", right: "1.25rem", fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(212,131,63,0.9)", background: "rgba(212,131,63,0.12)", border: "1px solid rgba(212,131,63,0.3)", borderRadius: 20, padding: "0.2rem 0.65rem" }}>
                  Family Rate
                </div>
                <div style={{ fontSize: "1.75rem", marginBottom: "0.75rem" }}>🏠</div>
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.35rem", color: "#fff", marginBottom: "0.3rem", lineHeight: 1.2 }}>
                  Private Suite
                </h3>
                <p style={{ fontSize: "0.72rem", color: "rgba(212,131,63,0.85)", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "1.25rem" }}>
                  6-Bed Cabin · Your Group Only · $500 Deposit
                </p>
                <ul style={{ listStyle: "none", padding: 0, margin: "0 0 1.75rem", display: "flex", flexDirection: "column", gap: "0.55rem" }}>
                  {[
                    "Private 6-bed cabin — your group only",
                    "Full weekend access for all guests",
                    "All workshops, ceremonies & healing arts",
                    "Priority check-in",
                    "Ideal for families & groups of 5–6",
                  ].map(item => (
                    <li key={item} style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.6)", display: "flex", gap: "0.5rem" }}>
                      <span style={{ color: "rgba(212,131,63,0.85)", flexShrink: 0 }}>✓</span> {item}
                    </li>
                  ))}
                </ul>
                <a href="/deposit?pkg=suite" style={{ display: "block", textAlign: "center", padding: "0.72rem 1.25rem", borderRadius: 30, background: "rgba(212,131,63,0.85)", color: "#fff", fontSize: "0.85rem", fontWeight: 700, textDecoration: "none", letterSpacing: "0.04em" }}>
                  Reserve with $500 Deposit →
                </a>
              </div>
            </div>

            {/* Add-On Bundles */}
            <p style={{ fontSize: "0.6rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", fontWeight: 700, marginBottom: "1.25rem" }}>
              Add-On Bundles · $250 Deposit · Pairs with Any Pass
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1rem", textAlign: "left" }}>

              {/* Recovery */}
              <div style={{ border: "1px solid rgba(61,184,175,0.3)", borderRadius: 18, padding: "1.75rem", background: "radial-gradient(ellipse at 10% 10%, rgba(61,184,175,0.07) 0%, transparent 60%), rgba(255,255,255,0.02)" }}>
                <div style={{ fontSize: "1.75rem", marginBottom: "0.75rem" }}>🌿</div>
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.25rem", color: "#fff", marginBottom: "0.3rem" }}>Recovery Bundle</h3>
                <p style={{ fontSize: "0.72rem", color: "rgba(61,184,175,0.85)", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "1.25rem" }}>
                  Massage · Sauna
                </p>
                <ul style={{ listStyle: "none", padding: 0, margin: "0 0 1.75rem", display: "flex", flexDirection: "column", gap: "0.55rem" }}>
                  {[
                    "60-min therapeutic massage",
                    "Lakeside sauna session",
                    "Nervous system restoration",
                    "Reserved 1-on-1 time slot",
                  ].map(item => (
                    <li key={item} style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.6)", display: "flex", gap: "0.5rem" }}>
                      <span style={{ color: "rgba(61,184,175,0.85)", flexShrink: 0 }}>✓</span> {item}
                    </li>
                  ))}
                </ul>
                <a href="/deposit?pkg=recovery" style={{ display: "block", textAlign: "center", padding: "0.72rem 1.25rem", borderRadius: 30, border: "1px solid rgba(61,184,175,0.4)", color: "rgba(61,184,175,0.9)", fontSize: "0.85rem", fontWeight: 700, textDecoration: "none", letterSpacing: "0.04em" }}>
                  Reserve with $250 Deposit →
                </a>
              </div>

              {/* Adventure */}
              <div style={{ border: "1px solid rgba(91,155,213,0.3)", borderRadius: 18, padding: "1.75rem", background: "radial-gradient(ellipse at 10% 10%, rgba(91,155,213,0.07) 0%, transparent 60%), rgba(255,255,255,0.02)" }}>
                <div style={{ fontSize: "1.75rem", marginBottom: "0.75rem" }}>🏄</div>
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.25rem", color: "#fff", marginBottom: "0.3rem" }}>Adventure Bundle</h3>
                <p style={{ fontSize: "0.72rem", color: "rgba(91,155,213,0.85)", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "1.25rem" }}>
                  Paddleboard · Sauna
                </p>
                <ul style={{ listStyle: "none", padding: 0, margin: "0 0 1.75rem", display: "flex", flexDirection: "column", gap: "0.55rem" }}>
                  {[
                    "Guided paddleboard yoga",
                    "Lakeside sauna session",
                    "Lake & mountain access",
                    "Small-group adventure sessions",
                  ].map(item => (
                    <li key={item} style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.6)", display: "flex", gap: "0.5rem" }}>
                      <span style={{ color: "rgba(91,155,213,0.85)", flexShrink: 0 }}>✓</span> {item}
                    </li>
                  ))}
                </ul>
                <a href="/deposit?pkg=adventure" style={{ display: "block", textAlign: "center", padding: "0.72rem 1.25rem", borderRadius: 30, border: "1px solid rgba(91,155,213,0.4)", color: "rgba(91,155,213,0.9)", fontSize: "0.85rem", fontWeight: 700, textDecoration: "none", letterSpacing: "0.04em" }}>
                  Reserve with $250 Deposit →
                </a>
              </div>

              {/* Portal */}
              <div style={{ border: "1px solid rgba(201,152,63,0.35)", borderRadius: 18, padding: "1.75rem", background: "radial-gradient(ellipse at 10% 10%, rgba(201,152,63,0.09) 0%, transparent 60%), rgba(255,255,255,0.02)" }}>
                <div style={{ fontSize: "1.75rem", marginBottom: "0.75rem" }}>✦</div>
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.25rem", color: "#fff", marginBottom: "0.3rem" }}>Portal Package</h3>
                <p style={{ fontSize: "0.72rem", color: "rgba(201,152,63,0.85)", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "1.25rem" }}>
                  Cacao · Merch · Full Package
                </p>
                <ul style={{ listStyle: "none", padding: 0, margin: "0 0 1.75rem", display: "flex", flexDirection: "column", gap: "0.55rem" }}>
                  {[
                    "Full 3-day weekend access",
                    "Cacao ceremony participation",
                    "Exclusive Wellness Weekend merch",
                    "All workshops & healing arts",
                  ].map(item => (
                    <li key={item} style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.6)", display: "flex", gap: "0.5rem" }}>
                      <span style={{ color: "rgba(201,152,63,0.85)", flexShrink: 0 }}>✓</span> {item}
                    </li>
                  ))}
                </ul>
                <a href="/deposit?pkg=portal" style={{ display: "block", textAlign: "center", padding: "0.72rem 1.25rem", borderRadius: 30, border: "1px solid rgba(201,152,63,0.5)", color: "rgba(201,152,63,0.9)", fontSize: "0.85rem", fontWeight: 700, textDecoration: "none", letterSpacing: "0.04em" }}>
                  Reserve with $250 Deposit →
                </a>
              </div>
            </div>

            <p style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.2)", marginTop: "2.5rem", lineHeight: 1.6 }}>
              Full 2027 pricing and dates announced soon. All deposits are applied to your total — refund eligible until dates are announced.{" "}
              <a href="/refunds" style={{ color: "rgba(255,255,255,0.3)", textDecoration: "underline" }}>See refund policy →</a>
            </p>
          </div>
        </section>

        {/* ═══ EXPERIENCE PILLARS ═══ */}
        <section style={{
          background: "var(--cream, #f5f0ea)",
          padding: "5rem 1.5rem",
          textAlign: "center",
        }}>
          <div style={{ maxWidth: "960px", margin: "0 auto" }}>
            <p style={{ fontSize: "0.65rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--sage, #5E8A6A)", fontWeight: 700, marginBottom: "1rem" }}>
              The Experience
            </p>
            <h2 style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2rem, 5vw, 3.2rem)",
              color: "var(--charcoal, #333533)",
              lineHeight: 1.15,
              marginBottom: "0.75rem",
            }}>
              What calls you here.
            </h2>
            <p style={{ fontSize: "1rem", color: "rgba(51,53,51,0.55)", lineHeight: 1.75, maxWidth: "460px", margin: "0 auto 3rem" }}>
              Every pillar of the festival is a doorway. Come through one and find yourself in all of them.
            </p>

            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: "1.25rem",
            }}>
              {PILLARS.map((pillar) => (
                <a
                  key={pillar.name}
                  href={pillar.href}
                  style={{
                    display: "block",
                    position: "relative",
                    borderRadius: 16,
                    overflow: "hidden",
                    aspectRatio: "4/3",
                    textDecoration: "none",
                    boxShadow: "0 4px 24px rgba(0,0,0,0.12)",
                  }}
                >
                  {/* Background photo */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={pillar.img}
                    alt={pillar.name}
                    style={{
                      position: "absolute", inset: 0,
                      width: "100%", height: "100%",
                      objectFit: "cover",
                      transition: "transform 0.4s ease",
                    }}
                  />
                  {/* Dark overlay */}
                  <div style={{
                    position: "absolute", inset: 0,
                    background: "linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.2) 55%, transparent 100%)",
                  }} />
                  {/* Text */}
                  <div style={{
                    position: "absolute", bottom: 0, left: 0, right: 0,
                    padding: "1.5rem 1.25rem 1.25rem",
                    textAlign: "left",
                  }}>
                    <h3 style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "1.3rem",
                      fontWeight: 700,
                      color: "#fff",
                      marginBottom: "0.3rem",
                      lineHeight: 1.2,
                    }}>
                      {pillar.name}
                    </h3>
                    <p style={{
                      fontSize: "0.8rem",
                      color: "rgba(255,255,255,0.75)",
                      lineHeight: 1.4,
                      margin: 0,
                    }}>
                      {pillar.desc}
                    </p>
                  </div>
                  {/* Arrow */}
                  <div style={{
                    position: "absolute", top: "1rem", right: "1rem",
                    width: 32, height: 32,
                    background: "rgba(255,255,255,0.15)",
                    backdropFilter: "blur(4px)",
                    borderRadius: "50%",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "0.75rem",
                    color: "#fff",
                  }}>
                    →
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ PARTNERS ═══ */}
        <section style={{
          background: "#0f0f1a",
          padding: "4rem 1.5rem",
          textAlign: "center",
          borderTop: "1px solid rgba(255,255,255,0.05)",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
        }}>
          <div style={{ maxWidth: "800px", margin: "0 auto" }}>
            <p style={{ fontSize: "0.62rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(255,255,255,0.28)", fontWeight: 600, marginBottom: "2.5rem" }}>
              Presented with our partners
            </p>
            <div style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "1rem",
              justifyContent: "center",
              alignItems: "stretch",
            }}>
              {PARTNERS.map((p) => (
                <a
                  key={p.name}
                  href={p.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.75rem",
                    padding: "1.25rem 1.75rem",
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 14,
                    textDecoration: "none",
                    minWidth: "180px",
                    transition: "border-color 0.2s, background 0.2s",
                  }}
                >
                  {p.logo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={p.logo}
                      alt={p.name}
                      style={{ height: "32px", maxWidth: "110px", objectFit: "contain", filter: "brightness(0) invert(1)", opacity: 0.7 }}
                    />
                  ) : (
                    <span style={{ fontSize: "0.82rem", letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(255,255,255,0.6)", fontWeight: 700, textAlign: "center" }}>
                      {p.name}
                    </span>
                  )}
                  <span style={{
                    fontSize: "0.72rem",
                    color: "rgba(201,152,63,0.8)",
                    fontWeight: 600,
                    letterSpacing: "0.06em",
                    border: "1px solid rgba(201,152,63,0.3)",
                    borderRadius: 20,
                    padding: "0.25rem 0.9rem",
                  }}>
                    Visit →
                  </span>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ ARCHIVE LINK ═══ */}
        <section style={{
          background: "#090912",
          padding: "3rem 1.5rem",
          textAlign: "center",
          borderTop: "1px solid rgba(255,255,255,0.05)",
        }}>
          <a href="/archive" style={{
            display: "inline-block",
            padding: "0.85rem 2.25rem",
            background: "rgba(255,255,255,0.07)",
            border: "1px solid rgba(255,255,255,0.15)",
            color: "rgba(255,255,255,0.8)",
            fontWeight: 700,
            fontSize: "0.9rem",
            borderRadius: "30px",
            textDecoration: "none",
            letterSpacing: "0.04em",
          }}>
            Explore the Archive →
          </a>
        </section>

      </main>

      {/* ═══ FOOTER ═══ */}
      <footer className="footer">
        <h2 className="footer-title">
          See you around the <em>fire</em>.
        </h2>
        <p className="footer-text">Warrior Lodge · Sutton, Alaska · 2027</p>
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
