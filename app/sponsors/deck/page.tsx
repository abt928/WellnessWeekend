"use client";
import { useEffect } from "react";
import Link from "next/link";

const C = {
  gold: "#C9983F",
  goldLight: "#e8c97a",
  orange: "#FF6B35",
  charcoal: "#1a1812",
  dark: "#0d0c0a",
  sage: "#5E8A6A",
  teal: "#3DB8AF",
  purple: "#8B5FBF",
  cream: "#F7F3EC",
  muted: "rgba(26,24,18,0.6)",
  border: "rgba(26,24,18,0.1)",
};

export default function SponsorDeckPage() {
  useEffect(() => {
    // Auto-open print dialog if ?print=true
    if (typeof window !== "undefined" && new URLSearchParams(window.location.search).get("print") === "true") {
      setTimeout(() => window.print(), 600);
    }
  }, []);

  return (
    <>
      {/* Print/Download bar — hidden when printing */}
      <div
        className="no-print"
        style={{
          position: "sticky",
          top: 0,
          zIndex: 100,
          background: C.charcoal,
          borderBottom: `2px solid ${C.gold}`,
          padding: "0.75rem 1.5rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "1rem",
          flexWrap: "wrap",
        }}
      >
        <Link
          href="/sponsors"
          style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.45)", textDecoration: "none" }}
        >
          ← Back to Sponsors Page
        </Link>
        <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
          <span style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.4)", letterSpacing: "0.06em" }}>
            SPONSOR DECK · 2027
          </span>
          <button
            onClick={() => window.print()}
            style={{
              padding: "0.55rem 1.4rem",
              borderRadius: "30px",
              background: `linear-gradient(135deg, ${C.gold}, ${C.orange})`,
              color: "#fff",
              fontWeight: 700,
              fontSize: "0.82rem",
              border: "none",
              cursor: "pointer",
              letterSpacing: "0.04em",
            }}
          >
            ⬇ Save as PDF
          </button>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Spectral:ital,wght@0,400;0,600;0,700;1,400&family=Manrope:wght@400;600;700;800&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Manrope', sans-serif; }

        .deck-page {
          width: 100%;
          max-width: 816px;
          margin: 0 auto;
          page-break-after: always;
          break-after: page;
        }
        .deck-page:last-child { page-break-after: avoid; break-after: avoid; }

        @media print {
          .no-print { display: none !important; }
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .deck-page {
            max-width: 100%;
            page-break-after: always;
            break-after: page;
            page-break-inside: avoid;
            break-inside: avoid;
          }
          @page { size: letter landscape; margin: 0; }
        }

        @media screen {
          body { background: #2a2820; padding: 2rem 1rem; }
          .deck-page {
            margin: 0 auto 2.5rem;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 20px 60px rgba(0,0,0,0.5);
          }
        }

        .display { font-family: 'Spectral', serif; }
      `}</style>

      {/* ═══════════════════════════════════
          SLIDE 1 — COVER
      ═══════════════════════════════════ */}
      <div
        className="deck-page"
        style={{
          minHeight: "100vh",
          background: `linear-gradient(145deg, #0d0c0a 0%, #1a1208 50%, #0d0c0a 100%)`,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          padding: "4rem 3rem",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background glow effects */}
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
          <div style={{ position: "absolute", top: "15%", left: "10%", width: "40%", height: "40%", background: "radial-gradient(circle, rgba(201,152,63,0.12) 0%, transparent 70%)" }} />
          <div style={{ position: "absolute", bottom: "10%", right: "5%", width: "35%", height: "35%", background: "radial-gradient(circle, rgba(94,138,106,0.09) 0%, transparent 70%)" }} />
        </div>

        <p style={{ fontSize: "0.65rem", letterSpacing: "0.22em", textTransform: "uppercase", color: C.gold, fontWeight: 700, marginBottom: "1.5rem", position: "relative" }}>
          Sponsorship Proposal · 2027
        </p>

        <h1
          className="display"
          style={{
            fontSize: "clamp(3rem, 7vw, 5.5rem)",
            fontWeight: 700,
            lineHeight: 1.05,
            color: "#fff",
            marginBottom: "1rem",
            position: "relative",
          }}
        >
          Wellness<br />
          <em style={{ color: C.gold }}>Weekend</em>
        </h1>

        <p style={{
          fontSize: "1rem",
          color: "rgba(255,255,255,0.4)",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          fontWeight: 600,
          marginBottom: "3rem",
          position: "relative",
        }}>
          5th Annual Healing Arts Festival
        </p>

        <div style={{
          display: "flex",
          gap: "2.5rem",
          justifyContent: "center",
          flexWrap: "wrap",
          marginBottom: "3.5rem",
          position: "relative",
        }}>
          {[
            { n: "500", l: "2027 Capacity" },
            { n: "3", l: "Days" },
            { n: "25+", l: "Healers & Artists" },
            { n: "5", l: "Years Running" },
          ].map(({ n, l }) => (
            <div key={l} style={{ textAlign: "center" }}>
              <div className="display" style={{ fontSize: "2.5rem", fontWeight: 800, color: C.gold, lineHeight: 1 }}>{n}</div>
              <div style={{ fontSize: "0.65rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", fontWeight: 600, marginTop: "0.3rem" }}>{l}</div>
            </div>
          ))}
        </div>

        <div style={{
          borderTop: "1px solid rgba(201,152,63,0.2)",
          paddingTop: "2rem",
          position: "relative",
          width: "100%",
          maxWidth: "480px",
        }}>
          <p style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.3)", lineHeight: 1.7 }}>
            Warrior Lodge · Sutton, Alaska · Dates TBA 2027<br />
            <span style={{ color: C.gold }}>support@thesoundspace.us</span> · wellnessweekendak.com
          </p>
        </div>
      </div>

      {/* ═══════════════════════════════════
          SLIDE 2 — ABOUT THE FESTIVAL
      ═══════════════════════════════════ */}
      <div
        className="deck-page"
        style={{
          minHeight: "100vh",
          background: C.cream,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "4rem 4rem",
        }}
      >
        <p style={{ fontSize: "0.6rem", letterSpacing: "0.18em", textTransform: "uppercase", color: C.gold, fontWeight: 700, marginBottom: "1rem" }}>
          About the Festival
        </p>
        <h2
          className="display"
          style={{ fontSize: "clamp(2.2rem, 5vw, 3.5rem)", color: C.charcoal, lineHeight: 1.15, marginBottom: "1.75rem", maxWidth: "580px" }}
        >
          A gathering under Alaska&apos;s midnight sun.
        </h2>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2.5rem" }}>
          <div>
            <p style={{ fontSize: "1rem", color: C.muted, lineHeight: 1.85, marginBottom: "1.5rem" }}>
              Wellness Weekend is Alaska&apos;s premier healing arts festival — a 3-day immersive
              experience held at Warrior Lodge in Sutton, in the stunning Matanuska Valley.
              Set against glaciers, rivers, and 20+ hours of summer daylight, it draws the most
              health-conscious, values-aligned community in the state.
            </p>
            <p style={{ fontSize: "1rem", color: C.muted, lineHeight: 1.85 }}>
              Now in its 5th year, 2027 is our most ambitious event yet — scaling to 500
              attendees and expanding our programming to 3 full days of ceremonies,
              workshops, live music, and transformational experiences.
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {[
              { icon: "🌿", title: "Sound Healing & Ceremonies", desc: "Sacred cacao ceremony, closing circle, guided sound journeys." },
              { icon: "🎶", title: "Live Music & Dance", desc: "Ecstatic dance, live musicians, and late-night fire sessions." },
              { icon: "💆", title: "Wellness Services", desc: "Massage, contrast therapy, aerial yoga, paddleboard." },
              { icon: "🏔", title: "Natural Setting", desc: "Warrior Lodge on the Matanuska River — a destination experience." },
            ].map(item => (
              <div key={item.title} style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
                <span style={{ fontSize: "1.3rem", flexShrink: 0, marginTop: "1px" }}>{item.icon}</span>
                <div>
                  <p style={{ fontSize: "0.85rem", fontWeight: 700, color: C.charcoal, marginBottom: "0.15rem" }}>{item.title}</p>
                  <p style={{ fontSize: "0.78rem", color: C.muted, lineHeight: 1.5 }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════
          SLIDE 3 — AUDIENCE
      ═══════════════════════════════════ */}
      <div
        className="deck-page"
        style={{
          minHeight: "100vh",
          background: "linear-gradient(145deg, #0f1a0f 0%, #0a1208 100%)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "4rem 4rem",
        }}
      >
        <p style={{ fontSize: "0.6rem", letterSpacing: "0.18em", textTransform: "uppercase", color: C.sage, fontWeight: 700, marginBottom: "1rem" }}>
          Our Audience
        </p>
        <h2
          className="display"
          style={{ fontSize: "clamp(2rem, 4.5vw, 3rem)", color: "#fff", lineHeight: 1.2, marginBottom: "2.5rem" }}
        >
          Health-conscious, values-aligned,<br />
          <em style={{ color: C.sage }}>ready to invest in their wellbeing.</em>
        </h2>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.5rem", marginBottom: "2.5rem" }}>
          {[
            { stat: "72%", label: "Women", sub: "Female-led community" },
            { stat: "25–45", label: "Core Age Range", sub: "Prime wellness demographic" },
            { stat: "Alaska-wide", label: "Reach", sub: "Anchorage, Mat-Su Valley & beyond" },
            { stat: "500", label: "2027 Capacity", sub: "Scaled from 150 in 2026" },
            { stat: "90%+", label: "Return Intent", sub: "Post-event survey 2026" },
            { stat: "$1,000+", label: "Avg. Spend", sub: "Flights, lodging, passes, services" },
          ].map(item => (
            <div
              key={item.label}
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(94,138,106,0.2)",
                borderRadius: "12px",
                padding: "1.25rem",
                textAlign: "center",
              }}
            >
              <div className="display" style={{ fontSize: "2rem", fontWeight: 800, color: C.sage, marginBottom: "0.25rem" }}>{item.stat}</div>
              <div style={{ fontSize: "0.8rem", fontWeight: 700, color: "#fff", marginBottom: "0.2rem" }}>{item.label}</div>
              <div style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.35)" }}>{item.sub}</div>
            </div>
          ))}
        </div>

        <p style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.45)", lineHeight: 1.75, maxWidth: "600px" }}>
          Our attendees are early adopters in wellness, holistic health, and conscious living.
          They actively seek brands that align with their values — making our audience one of
          the most receptive festival demographics in Alaska.
        </p>
      </div>

      {/* ═══════════════════════════════════
          SLIDE 4 — SPONSORSHIP TIERS
      ═══════════════════════════════════ */}
      <div
        className="deck-page"
        style={{
          minHeight: "100vh",
          background: C.cream,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "4rem 4rem",
        }}
      >
        <p style={{ fontSize: "0.6rem", letterSpacing: "0.18em", textTransform: "uppercase", color: C.gold, fontWeight: 700, marginBottom: "0.75rem" }}>
          Sponsorship Tiers · 2027
        </p>
        <h2
          className="display"
          style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)", color: C.charcoal, lineHeight: 1.2, marginBottom: "2rem" }}
        >
          Three tiers. Real impact.
        </h2>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.25rem" }}>
          {[
            {
              name: "Roots",
              price: "$500",
              color: C.gold,
              tagline: "Plant your brand in the community.",
              perks: [
                "3-day vendor booth",
                "2 weekend passes + campsite",
                "Name in program & signage",
                "Social media mention",
                "Logo on website",
                "10% affiliate promo code",
              ],
            },
            {
              name: "Rising",
              price: "$1,000",
              color: C.orange,
              tagline: "Grow alongside the festival.",
              featured: true,
              perks: [
                "Everything in Roots",
                "Premium vendor placement",
                "Bed in shared Warrior Lodge cabin",
                "Service as a festival add-on",
                "Logo on all printed materials",
                "Dedicated IG & FB feature post",
                "Callout in attendee email",
              ],
            },
            {
              name: "Luminary",
              price: "$2,500",
              color: C.purple,
              tagline: "Lead the gathering. Own the moment.",
              perks: [
                "Everything in Rising",
                "Private cabin (up to 12 guests)",
                "Paid digital ad placement",
                "Top-tier logo on all collateral",
                "Dedicated email to full attendee list",
                "On-site branded activation",
                "Co-branded Reel / video",
              ],
            },
          ].map(tier => (
            <div
              key={tier.name}
              style={{
                border: `1.5px solid ${tier.color}30`,
                borderRadius: "14px",
                padding: "1.5rem 1.25rem",
                background: tier.featured ? `${tier.color}08` : "transparent",
                position: "relative",
              }}
            >
              {tier.featured && (
                <div style={{
                  position: "absolute",
                  top: "-10px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  background: `linear-gradient(135deg, ${C.gold}, ${C.orange})`,
                  color: "#fff",
                  fontSize: "0.55rem",
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  padding: "0.2rem 0.65rem",
                  borderRadius: "20px",
                  whiteSpace: "nowrap",
                }}>Most Popular</div>
              )}
              <p style={{ fontSize: "0.6rem", letterSpacing: "0.12em", textTransform: "uppercase", color: tier.color, fontWeight: 700, marginBottom: "0.4rem" }}>{tier.name}</p>
              <div className="display" style={{ fontSize: "2.2rem", fontWeight: 800, color: C.charcoal, marginBottom: "0.2rem" }}>{tier.price}</div>
              <p style={{ fontSize: "0.78rem", color: C.muted, marginBottom: "1rem", lineHeight: 1.4 }}>{tier.tagline}</p>
              <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: "0.45rem" }}>
                {tier.perks.map(perk => (
                  <li key={perk} style={{ display: "flex", gap: "0.5rem", fontSize: "0.78rem", color: C.charcoal, lineHeight: 1.4, alignItems: "flex-start" }}>
                    <span style={{ color: tier.color, flexShrink: 0, fontWeight: 700 }}>✓</span>
                    {perk}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* ═══════════════════════════════════
          SLIDE 5 — WHY SPONSOR / REACH
      ═══════════════════════════════════ */}
      <div
        className="deck-page"
        style={{
          minHeight: "100vh",
          background: "linear-gradient(145deg, #100a1a 0%, #0a0810 100%)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "4rem 4rem",
        }}
      >
        <p style={{ fontSize: "0.6rem", letterSpacing: "0.18em", textTransform: "uppercase", color: C.purple, fontWeight: 700, marginBottom: "1rem" }}>
          Why Sponsor Wellness Weekend
        </p>
        <h2
          className="display"
          style={{ fontSize: "clamp(2rem, 4.5vw, 3rem)", color: "#fff", lineHeight: 1.2, marginBottom: "2.5rem" }}
        >
          Before, during, and after the festival — <em style={{ color: C.purple }}>your brand is there.</em>
        </h2>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", marginBottom: "2.5rem" }}>
          {[
            {
              phase: "Pre-Event",
              color: C.teal,
              items: ["Logo on event website", "Email announcements to full list", "Social media tagging in promotional posts", "Printed materials distributed pre-event"],
            },
            {
              phase: "On-Site",
              color: C.gold,
              items: ["Vendor booth (prime placement for Rising+)", "Branded activation space (Luminary)", "Logo on banners & printed program", "Verbal callouts from MC and practitioners"],
            },
            {
              phase: "Post-Event",
              color: C.orange,
              items: ["Co-branded recap Reel (Luminary)", "Post-event email to all attendees", "Year-round website listing", "Warm audience connection for future offers"],
            },
            {
              phase: "Community",
              color: C.purple,
              items: ["Affiliate code (10%) to your clients", "Introduction to our healer network", "Access to future Wellness Weekend events", "Relationship with The Sound Space ecosystem"],
            },
          ].map(section => (
            <div key={section.phase} style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${section.color}22`, borderRadius: "12px", padding: "1.25rem" }}>
              <p style={{ fontSize: "0.62rem", letterSpacing: "0.12em", textTransform: "uppercase", color: section.color, fontWeight: 700, marginBottom: "0.75rem" }}>{section.phase}</p>
              <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                {section.items.map(item => (
                  <li key={item} style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.6)", display: "flex", gap: "0.5rem", alignItems: "flex-start" }}>
                    <span style={{ color: section.color, flexShrink: 0 }}>→</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* ═══════════════════════════════════
          SLIDE 6 — CALL TO ACTION
      ═══════════════════════════════════ */}
      <div
        className="deck-page"
        style={{
          minHeight: "100vh",
          background: `linear-gradient(145deg, #0d0c0a 0%, #1f1408 70%, #0d0c0a 100%)`,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          padding: "4rem 3rem",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
          <div style={{ position: "absolute", top: "20%", left: "50%", transform: "translateX(-50%)", width: "60%", height: "60%", background: "radial-gradient(circle, rgba(201,152,63,0.1) 0%, transparent 70%)" }} />
        </div>

        <p style={{ fontSize: "0.6rem", letterSpacing: "0.22em", textTransform: "uppercase", color: C.gold, fontWeight: 700, marginBottom: "1.25rem", position: "relative" }}>
          Let&apos;s Build Together
        </p>
        <h2
          className="display"
          style={{
            fontSize: "clamp(2.2rem, 5vw, 4rem)",
            color: "#fff",
            lineHeight: 1.1,
            marginBottom: "1.5rem",
            maxWidth: "580px",
            position: "relative",
          }}
        >
          Your brand deserves to be <em style={{ color: C.gold }}>around the fire.</em>
        </h2>
        <p style={{
          fontSize: "1rem",
          color: "rgba(255,255,255,0.45)",
          lineHeight: 1.8,
          maxWidth: "480px",
          marginBottom: "3rem",
          position: "relative",
        }}>
          Applications are limited. We hand-select sponsors that align with our community&apos;s
          values. Submit your inquiry and we&apos;ll send a tailored proposal within a few days.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem", alignItems: "center", position: "relative" }}>
          <div
            style={{
              background: "rgba(201,152,63,0.1)",
              border: `1px solid ${C.gold}44`,
              borderRadius: "16px",
              padding: "1.5rem 2.5rem",
              textAlign: "center",
            }}
          >
            <p style={{ fontSize: "0.65rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)", marginBottom: "0.5rem" }}>Apply at</p>
            <p style={{ fontSize: "1.1rem", fontWeight: 700, color: C.gold }}>wellnessweekendak.com/sponsors</p>
            <div style={{ width: "100%", height: "1px", background: "rgba(201,152,63,0.2)", margin: "0.75rem 0" }} />
            <p style={{ fontSize: "0.65rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)", marginBottom: "0.5rem" }}>Contact</p>
            <p style={{ fontSize: "1rem", fontWeight: 600, color: "rgba(255,255,255,0.7)" }}>support@thesoundspace.us</p>
          </div>

          <p style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.2)", lineHeight: 1.6 }}>
            Warrior Lodge · Sutton, Alaska · 2027<br />
            Operated by The Sound Space
          </p>
        </div>
      </div>
    </>
  );
}
