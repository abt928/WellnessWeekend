import Link from "next/link";
import { PlaneIcon, MapPinIcon, LeafIcon, MoonIcon } from "@/components/Icons";

export const metadata = {
  title: "Plan Your Trip | Wellness Weekend 2026",
  description: "Everything you need to plan your trip to Wellness Weekend 2026 in Sutton, Alaska — getting here, camping, nearby lodging, and what to pack.",
};

const CAMPGROUNDS = [
  {
    name: "King Mountain State Recreation Site",
    distance: "~2 miles from venue",
    notes: "Right on the Glenn Highway near Sutton. Tent sites, outhouses, fire rings. Free with Alaska State Parks day-use fee.",
    type: "State Park",
  },
  {
    name: "Bonnie Lake State Recreation Site",
    distance: "~10 miles west",
    notes: "Quiet lakeside camping near Palmer. Tent and RV sites, vault toilets, boat launch.",
    type: "State Park",
  },
  {
    name: "Long Lake State Recreation Site",
    distance: "~15 miles west",
    notes: "Peaceful forest campground with lake access. Popular for fishing and kayaking.",
    type: "State Park",
  },
  {
    name: "Moose Creek State Recreation Site",
    distance: "~35 miles west (Wasilla)",
    notes: "Large campground with full hookups available. Good base if you prefer to drive in each day.",
    type: "State Park",
  },
  {
    name: "Matanuska Glacier State Recreation Area",
    distance: "~40 miles east",
    notes: "Stunning glacier views with tent camping. A bucket-list Alaskan experience on either end of the weekend.",
    type: "State Park",
  },
  {
    name: "Finger Lake State Recreation Site",
    distance: "~30 miles west (near Wasilla)",
    notes: "Forested tent sites alongside a quiet lake. Kayak launch, pit toilets.",
    type: "State Park",
  },
  {
    name: "Pioneer Peak Campground",
    distance: "~25 miles west (Palmer)",
    notes: "Private campground with full hookups, showers, and Wi-Fi. Good option for RVs.",
    type: "Private / RV",
  },
  {
    name: "Matanuska River Park",
    distance: "~20 miles west (Palmer)",
    notes: "Mat-Su Borough campground along the river. Tent and RV sites, restrooms. Budget-friendly.",
    type: "Borough Park",
  },
  {
    name: "Sheep Mountain Lodge",
    distance: "~50 miles east",
    notes: "Glamping cabins and tent sites with mountain views. Restaurant on-site. A splurge worth it for a special retreat.",
    type: "Lodge / Glamping",
  },
];

const TYPE_COLORS: Record<string, string> = {
  "State Park": "#3DB8AF",
  "Private / RV": "#C9983F",
  "Borough Park": "#5E8A6A",
  "Lodge / Glamping": "#9B7FD4",
};

export default function TravelPage() {
  return (
    <main style={{ minHeight: "100vh", background: "var(--cream, #f5f0ea)", color: "var(--charcoal, #333533)" }}>

      {/* Header */}
      <div style={{
        background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
        padding: "5rem 1.5rem 4rem",
        textAlign: "center",
      }}>
        <Link href="/" style={{ color: "rgba(255,255,255,0.55)", fontSize: "0.8rem", letterSpacing: "0.1em", textTransform: "uppercase", textDecoration: "none" }}>
          ← Back to Home
        </Link>
        <h1 style={{ fontFamily: "var(--font-display, serif)", fontSize: "clamp(2.2rem, 6vw, 4rem)", color: "#fff", marginTop: "1.5rem", marginBottom: "0.5rem" }}>
          Plan Your Trip
        </h1>
        <p style={{ color: "rgba(255,255,255,0.65)", fontSize: "1rem" }}>
          Sutton, Alaska · August 7–9, 2026
        </p>
      </div>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "3rem 1.5rem" }}>

        {/* Trip cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.25rem", marginBottom: "3.5rem" }}>
          {[
            {
              icon: <PlaneIcon size={22} color="var(--sage, #5E8A6A)" />,
              title: "Getting Here",
              body: "Fly into Ted Stevens Anchorage International Airport (ANC), then follow the Glenn Highway northeast to Sutton in the Matanuska-Susitna Valley — one of Alaska's most breathtaking drives. Sutton is about 75 miles from the airport, roughly 80–90 minutes depending on conditions.",
            },
            {
              icon: <MoonIcon size={22} color="var(--sage, #5E8A6A)" />,
              title: "August in Alaska",
              body: "Days stretch to nearly 19 hours of light around August 8 — the Lion's Gate Portal. Temperatures run 55–70°F with cool mornings and evenings. Layers are essential. Alaskan weather is generous and unpredictable; always be prepared for rain.",
            },
            {
              icon: <MapPinIcon size={22} color="var(--sage, #5E8A6A)" />,
              title: "On-Site Camping",
              body: "On-site camping at Warrior Lodge is included with your weekend pass. Bring a cold-weather sleeping bag rated below 40°F, a tent that can handle rain, and something warm for late-night fire ceremony. Unlimited midnight sun means you may not want to sleep anyway.",
            },
            {
              icon: <LeafIcon size={22} color="var(--sage, #5E8A6A)" />,
              title: "What to Pack",
              body: "Rain jacket, sturdy waterproof boots, sun protection (the midnight sun is real), layers for cold mornings, and comfortable clothes for movement and ceremony. Leave space in your bag — you will carry something home that you did not arrive with.",
            },
          ].map((c) => (
            <div key={c.title} style={{
              background: "#fff",
              borderRadius: 14,
              padding: "1.5rem",
              boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
              border: "1px solid rgba(0,0,0,0.06)",
            }}>
              <div style={{ marginBottom: "0.75rem" }}>{c.icon}</div>
              <h3 style={{ fontFamily: "var(--font-display, serif)", fontSize: "1.15rem", marginBottom: "0.5rem" }}>{c.title}</h3>
              <p style={{ fontSize: "0.9rem", lineHeight: 1.7, color: "rgba(51,53,51,0.75)" }}>{c.body}</p>
            </div>
          ))}
        </div>

        {/* Warrior Lodge */}
        <div style={{
          background: "linear-gradient(135deg, #1a1a2e, #0f3460)",
          borderRadius: 16,
          padding: "2rem 2.25rem",
          marginBottom: "3.5rem",
          color: "#fff",
        }}>
          <p style={{ fontSize: "0.7rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.55)", marginBottom: "0.4rem" }}>
            On-Site Accommodation
          </p>
          <h2 style={{ fontFamily: "var(--font-display, serif)", fontSize: "clamp(1.4rem, 4vw, 2rem)", marginBottom: "0.75rem" }}>
            Warrior Lodge
          </h2>
          <p style={{ color: "rgba(255,255,255,0.75)", lineHeight: 1.7, marginBottom: "1.25rem", fontSize: "0.95rem" }}>
            August in Alaska is wild — radiant summer days that stretch past midnight and cool, crisp nights perfect for gathering under the stars. The Warrior Lodge cabins were built for exactly this: a warm, dry sanctuary between ceremonies so you never have to leave the magic.
          </p>

          {/* Lodging status */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.65rem", marginBottom: "1.5rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", background: "rgba(184,74,43,0.18)", border: "1px solid rgba(184,74,43,0.4)", borderRadius: 10, padding: "0.75rem 1rem" }}>
              <span style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#ff8a72", background: "rgba(184,74,43,0.35)", borderRadius: "999px", padding: "0.2rem 0.6rem", whiteSpace: "nowrap" }}>
                Sold Out
              </span>
              <span style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.85)" }}>
                <strong>Private Cabins</strong> — all 10 cabins are reserved
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", background: "rgba(201,152,63,0.15)", border: "1px solid rgba(201,152,63,0.35)", borderRadius: 10, padding: "0.75rem 1rem" }}>
              <span style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#e8c06a", background: "rgba(201,152,63,0.3)", borderRadius: "999px", padding: "0.2rem 0.6rem", whiteSpace: "nowrap" }}>
                Very Limited
              </span>
              <span style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.85)" }}>
                <strong>Shared Cabins</strong> — fewer than 10 beds remaining
              </span>
            </div>
          </div>

          <a href="mailto:support@thesoundspace.us?subject=Shared%20Cabin%20Inquiry" style={{
            display: "inline-block",
            background: "rgba(255,255,255,0.12)",
            color: "#fff",
            fontWeight: 600,
            fontSize: "0.9rem",
            padding: "0.65rem 1.5rem",
            borderRadius: 30,
            textDecoration: "none",
            letterSpacing: "0.02em",
            border: "1px solid rgba(255,255,255,0.25)",
          }}>
            Inquire About Shared Cabins →
          </a>
        </div>

        {/* Campgrounds */}
        <h2 style={{ fontFamily: "var(--font-display, serif)", fontSize: "clamp(1.5rem, 4vw, 2.2rem)", marginBottom: "0.5rem" }}>
          Nearby Campgrounds
        </h2>
        <p style={{ color: "rgba(51,53,51,0.65)", fontSize: "0.9rem", lineHeight: 1.7, marginBottom: "1.75rem" }}>
          On-site camping is the closest option, but if you prefer your own space or are extending your trip, there are excellent public and private campgrounds within 50 miles of the venue.
        </p>
        <div style={{ display: "grid", gap: "1rem", marginBottom: "3.5rem" }}>
          {CAMPGROUNDS.map((c) => (
            <div key={c.name} style={{
              background: "#fff",
              borderRadius: 12,
              padding: "1.25rem 1.5rem",
              boxShadow: "0 1px 8px rgba(0,0,0,0.06)",
              border: "1px solid rgba(0,0,0,0.06)",
              display: "flex",
              gap: "1rem",
              alignItems: "flex-start",
            }}>
              <div style={{ flexShrink: 0, paddingTop: 2 }}>
                <span style={{
                  display: "inline-block",
                  background: TYPE_COLORS[c.type] ?? "#888",
                  color: "#fff",
                  fontSize: "0.65rem",
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  padding: "0.2rem 0.55rem",
                  borderRadius: 20,
                  whiteSpace: "nowrap",
                }}>
                  {c.type}
                </span>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", flexWrap: "wrap", alignItems: "baseline", gap: "0.5rem", marginBottom: "0.25rem" }}>
                  <strong style={{ fontSize: "0.95rem" }}>{c.name}</strong>
                  <span style={{ fontSize: "0.8rem", color: "rgba(51,53,51,0.5)" }}>{c.distance}</span>
                </div>
                <p style={{ fontSize: "0.85rem", lineHeight: 1.6, color: "rgba(51,53,51,0.7)", margin: 0 }}>{c.notes}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Land acknowledgment */}
        <div style={{
          borderTop: "1px solid rgba(51,53,51,0.12)",
          paddingTop: "2rem",
          textAlign: "center",
        }}>
          <p style={{ fontSize: "0.85rem", color: "rgba(51,53,51,0.55)", lineHeight: 1.8, maxWidth: 600, margin: "0 auto 2rem" }}>
            We gather on the unceded ancestral homeland of the Dena'ina Athabascan people, whose relationship with this valley, these rivers, and these mountains stretches back thousands of years and continues today. We are grateful to be guests on this land.
          </p>
          <Link href="/" style={{
            display: "inline-block",
            color: "var(--gold, #C9983F)",
            fontWeight: 700,
            fontSize: "0.9rem",
            border: "1.5px solid rgba(201,152,63,0.4)",
            borderRadius: 30,
            padding: "0.65rem 1.5rem",
            textDecoration: "none",
          }}>
            ← Back to Home
          </Link>
        </div>

      </div>
    </main>
  );
}
