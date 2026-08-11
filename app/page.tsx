import Navigation from "@/components/Navigation";
import NewsletterSignup2027 from "@/components/NewsletterSignup2027";
import { MapPinIcon } from "@/components/Icons";

export const metadata = {
  title: "Wellness Weekend 2027 · Sutton, Alaska",
  description: "The 5th Annual Wellness Weekend is coming. Returning to Warrior Lodge in Sutton, Alaska. Dates to be announced — join the list to hear first.",
};

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
      <Navigation />

      <main>

        {/* ═══ HERO ═══ */}
        <div style={{
          minHeight: "100vh",
          background:
            "radial-gradient(ellipse at 20% 30%, rgba(155,127,212,0.2) 0%, transparent 55%)," +
            "radial-gradient(ellipse at 80% 70%, rgba(201,152,63,0.15) 0%, transparent 50%)," +
            "radial-gradient(ellipse at 50% 10%, rgba(61,184,175,0.1) 0%, transparent 45%)," +
            "#090912",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "6rem 1.5rem 5rem",
          position: "relative",
          overflow: "hidden",
        }}>
          {/* Subtle fire glow at bottom */}
          <div style={{
            position: "absolute", bottom: 0, left: "50%", transform: "translateX(-50%)",
            width: "60%", height: "200px",
            background: "radial-gradient(ellipse at 50% 100%, rgba(201,152,63,0.12) 0%, transparent 70%)",
            pointerEvents: "none",
          }} />

          <p style={{
            fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase",
            color: "rgba(201,152,63,0.8)", fontWeight: 700, marginBottom: "1.5rem",
          }}>
            5th Annual · Wellness Weekend
          </p>

          <h1 style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(3rem, 10vw, 7rem)",
            fontWeight: 700, lineHeight: 1.0,
            color: "#fff",
            marginBottom: "1rem",
            letterSpacing: "-0.01em",
          }}>
            We&apos;ll see you<br />
            <em style={{ color: "var(--gold, #C9983F)" }}>around the fire.</em>
          </h1>

          <p style={{
            fontSize: "clamp(1rem, 2.5vw, 1.25rem)",
            color: "rgba(255,255,255,0.55)",
            lineHeight: 1.75,
            maxWidth: "520px",
            margin: "0 auto 3rem",
          }}>
            Wellness Weekend 2026 was absolutely special. We are returning to Warrior Lodge in Sutton, Alaska for 2027.
            Dates to be announced.
          </p>

          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "3.5rem", color: "rgba(255,255,255,0.35)", fontSize: "0.85rem" }}>
            <MapPinIcon size={14} color="rgba(255,255,255,0.35)" />
            Warrior Lodge · Sutton, Alaska · 2027
          </div>

          {/* Email capture */}
          <div style={{ width: "100%", maxWidth: "420px" }}>
            <p style={{ fontSize: "0.75rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", marginBottom: "0.75rem", fontWeight: 600 }}>
              Be the first to know when dates drop
            </p>
            <NewsletterSignup2027 />
          </div>

          <a href="/archive" style={{
            marginTop: "2.5rem",
            fontSize: "0.8rem",
            color: "rgba(255,255,255,0.3)",
            textDecoration: "none",
            letterSpacing: "0.06em",
            borderBottom: "1px solid rgba(255,255,255,0.1)",
            paddingBottom: "1px",
          }}>
            Look back at 2026 →
          </a>
        </div>

        {/* ═══ GRATITUDE ═══ */}
        <section style={{
          background: "var(--cream, #f5f0ea)",
          padding: "5rem 1.5rem",
          textAlign: "center",
        }}>
          <div style={{ maxWidth: "680px", margin: "0 auto" }}>
            <p style={{ fontSize: "0.65rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--sage, #5E8A6A)", fontWeight: 700, marginBottom: "1.25rem" }}>
              August 7–9, 2026 · Sutton, Alaska
            </p>
            <h2 style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2rem, 5vw, 3.2rem)",
              color: "var(--charcoal, #333533)",
              lineHeight: 1.2,
              marginBottom: "1.5rem",
            }}>
              This year was absolutely special and transformational.
            </h2>
            <p style={{ fontSize: "1.05rem", color: "rgba(51,53,51,0.65)", lineHeight: 1.85, marginBottom: "1.25rem" }}>
              We gathered at Warrior Lodge under the midnight sun for ceremonies, sound healing, music, movement, and medicine. The fire burned. The water held us. The community showed up for one another in ways that we will carry forward always.
            </p>
            <p style={{ fontSize: "1.05rem", color: "rgba(51,53,51,0.65)", lineHeight: 1.85 }}>
              Over 1,000 photographs came back from guests in the days that followed — each one a reminder of what is possible when people gather with open hearts and clear intention.
            </p>
          </div>
        </section>

        {/* ═══ TESTIMONIAL ═══ */}
        <section style={{
          background: "linear-gradient(135deg, #1a1a2e 0%, #0f2a1a 50%, #0a0a14 100%)",
          padding: "5rem 1.5rem",
          textAlign: "center",
        }}>
          <div style={{ maxWidth: "640px", margin: "0 auto" }}>
            <div style={{ fontSize: "2rem", marginBottom: "1.5rem", opacity: 0.5 }}>✦</div>
            <blockquote style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(1.3rem, 3.5vw, 1.9rem)",
              color: "#fff",
              lineHeight: 1.5,
              fontStyle: "italic",
              fontWeight: 400,
              margin: "0 0 2rem",
            }}>
              &ldquo;I came not knowing what to expect and left with a completely different relationship to myself. The ceremonies, the music, the people — something shifted that I can&apos;t fully put into words. I am already planning my return.&rdquo;
            </blockquote>
            <p style={{ fontSize: "0.78rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)", fontWeight: 600 }}>
              Guest · Wellness Weekend 2026
            </p>
          </div>
        </section>

        {/* ═══ 2027 TEASER ═══ */}
        <section style={{
          background: "var(--cream, #f5f0ea)",
          padding: "5rem 1.5rem",
          textAlign: "center",
          borderTop: "1px solid rgba(51,53,51,0.08)",
        }}>
          <div style={{ maxWidth: "560px", margin: "0 auto" }}>
            <p style={{ fontSize: "0.65rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--gold, #C9983F)", fontWeight: 700, marginBottom: "1rem" }}>
              Coming 2027
            </p>
            <h2 style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2rem, 5vw, 3rem)",
              color: "var(--charcoal, #333533)",
              lineHeight: 1.2,
              marginBottom: "1rem",
            }}>
              Returning to Warrior Lodge.
            </h2>
            <p style={{ fontSize: "1rem", color: "rgba(51,53,51,0.6)", lineHeight: 1.8, marginBottom: "2.5rem" }}>
              We are going back to the land in Sutton, Alaska — the mountains, the river, the fire.
              Dates will be announced soon. Join the list below and you will hear first.
            </p>
            <NewsletterSignup2027 />
          </div>
        </section>

        {/* ═══ ARCHIVE LINK ═══ */}
        <section style={{
          background: "#fff",
          padding: "3.5rem 1.5rem",
          textAlign: "center",
          borderTop: "1px solid rgba(51,53,51,0.07)",
        }}>
          <p style={{ fontSize: "0.85rem", color: "rgba(51,53,51,0.5)", marginBottom: "1.25rem" }}>
            Relive the journey — schedules, stories, and memories from every year.
          </p>
          <a href="/archive" style={{
            display: "inline-block",
            padding: "0.75rem 2rem",
            background: "var(--charcoal, #333533)",
            color: "#fff",
            fontWeight: 700,
            fontSize: "0.9rem",
            borderRadius: "30px",
            textDecoration: "none",
            letterSpacing: "0.02em",
          }}>
            View the Archive →
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
