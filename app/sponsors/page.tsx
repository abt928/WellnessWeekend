"use client";
import { useState, useRef } from "react";
import Link from "next/link";

const C = {
  bg: "#F7F3EC",
  card: "#FBF9F4",
  charcoal: "#333533",
  muted: "rgba(51,53,51,0.6)",
  faint: "rgba(51,53,51,0.38)",
  gold: "#C9983F",
  goldLight: "#e8c97a",
  goldBorder: "rgba(201,152,63,0.35)",
  orange: "#FF6B35",
  border: "rgba(51,53,51,0.12)",
  error: "#B84A2B",
  errorBg: "rgba(184,74,43,0.07)",
};

interface Tier {
  key: string;
  name: string;
  price: string;
  budgetRange: string;
  tagline: string;
  featured?: boolean;
  perks: string[];
  interests: string[];
  accent: string;
}

const TIERS: Tier[] = [
  {
    key: "roots",
    name: "Roots",
    price: "$500",
    budgetRange: "Roots — $500",
    tagline: "Plant your brand in the community.",
    perks: [
      "3-day vendor booth",
      "Campsite pass + 2 weekend passes",
      "Name in program & event signage",
      "Social media mention",
      "Logo on website",
      "10% affiliate promo code for your clients",
    ],
    interests: ["Vendor booth", "Logo placement", "Social mention", "Affiliate promo code"],
    accent: C.gold,
  },
  {
    key: "rising",
    name: "Rising",
    price: "$1,000",
    budgetRange: "Rising — $1,000",
    tagline: "Grow alongside the festival.",
    featured: true,
    perks: [
      "Everything in Roots",
      "Premium vendor placement",
      "Bed in shared cabin",
      "Service featured as a festival add-on",
      "Logo on all printed materials",
      "Dedicated IG & FB feature post",
      "Callout in attendee email",
      "10% affiliate promo code",
    ],
    interests: ["Vendor booth", "Premium placement", "Logo placement", "Printed materials", "Social feature post", "Email callout", "Affiliate promo code"],
    accent: C.orange,
  },
  {
    key: "luminary",
    name: "Luminary",
    price: "$2,500",
    budgetRange: "Luminary — $2,500",
    tagline: "Lead the gathering. Own the moment.",
    perks: [
      "Everything in Rising",
      "Private cabin — bring your whole team (up to 12)",
      "Paid digital ad placement",
      "Top-tier logo on all collateral",
      "Dedicated email to the full attendee list",
      "On-site branded activation",
      "Co-branded Reel / video",
      "10% affiliate promo code",
    ],
    interests: ["Private cabin", "Digital ad placement", "Top-tier logo", "Dedicated email blast", "On-site branded activation", "Co-branded video", "Affiliate promo code"],
    accent: "#8B5FBF",
  },
];

type TierKey = string;

export default function SponsorsPage() {
  const [selectedTier, setSelectedTier] = useState<TierKey>("rising");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [website, setWebsite] = useState("");
  const [goals, setGoals] = useState("");
  const [source, setSource] = useState("");

  const formRef = useRef<HTMLDivElement>(null);

  function chooseTier(key: TierKey) {
    setSelectedTier(key);
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const tier = TIERS.find((t) => t.key === selectedTier)!;
    try {
      const res = await fetch("/api/sponsors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone: phone || undefined,
          company,
          website: website || undefined,
          interests: tier.interests,
          budgetRange: tier.budgetRange,
          goals,
          source: source || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong. Please try again.");
      } else {
        setSubmitted(true);
      }
    } catch {
      setError("Unable to submit. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const activeTier = TIERS.find((t) => t.key === selectedTier)!;

  return (
    <>
      <nav
        style={{
          background: C.bg,
          borderBottom: `1px solid ${C.border}`,
          padding: "0.9rem 1.5rem",
        }}
      >
        <Link
          href="/"
          style={{ fontSize: "0.85rem", color: C.muted, textDecoration: "none" }}
        >
          ← Back to Wellness Weekend
        </Link>
      </nav>

      <main style={{ minHeight: "100vh", background: C.bg, padding: "3rem 1.5rem 6rem" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>

          {/* ── Header ── */}
          <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
            <p
              style={{
                fontSize: "0.7rem",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: C.gold,
                marginBottom: "0.75rem",
                fontWeight: 600,
              }}
            >
              August 7–9, 2026 · Sutton, Alaska
            </p>
            <h1
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(2rem, 5vw, 3.25rem)",
                fontWeight: 700,
                lineHeight: 1.15,
                marginBottom: "1rem",
                color: C.charcoal,
              }}
            >
              Sponsor Wellness Weekend.
            </h1>
            <p
              style={{
                fontSize: "1.05rem",
                lineHeight: 1.75,
                color: C.muted,
                maxWidth: "540px",
                margin: "0 auto 1.75rem",
              }}
            >
              Connect your brand with hundreds of health-conscious Alaskans at our
              4th annual healing arts gathering. Three tiers. Real impact.
            </p>
            <div
              style={{
                display: "inline-flex",
                gap: "1.5rem",
                flexWrap: "wrap",
                justifyContent: "center",
              }}
            >
              {[
                ["300+", "Attendees"],
                ["3", "Days"],
                ["40+", "Practitioners"],
              ].map(([num, label]) => (
                <div key={label} style={{ textAlign: "center" }}>
                  <div
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "1.75rem",
                      fontWeight: 800,
                      background: `linear-gradient(135deg, ${C.gold}, ${C.orange})`,
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    {num}
                  </div>
                  <div style={{ fontSize: "0.75rem", color: C.faint, letterSpacing: "0.06em", textTransform: "uppercase" }}>
                    {label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Tier Cards ── */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: "1.25rem",
              marginBottom: "3.5rem",
            }}
          >
            {TIERS.map((tier) => (
              <TierCard
                key={tier.key}
                tier={tier}
                selected={selectedTier === tier.key}
                onSelect={() => chooseTier(tier.key)}
              />
            ))}
          </div>

          {/* ── What to Expect ── */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "1rem",
              marginBottom: "3.5rem",
            }}
          >
            {[
              {
                icon: "🎶",
                title: "Live Music & Dance",
                desc: "Headliners, ecstatic dance, and sound journeys across three days.",
              },
              {
                icon: "🌿",
                title: "Wellness Community",
                desc: "Health-conscious, values-aligned attendees from across Alaska.",
              },
              {
                icon: "🏔",
                title: "Matanuska Valley",
                desc: "Stunning venue in Sutton — a destination event under the midnight sun.",
              },
              {
                icon: "📲",
                title: "Real Reach",
                desc: "Digital, print, and in-person touchpoints before, during, and after.",
              },
            ].map((item) => (
              <div
                key={item.title}
                style={{
                  background: C.card,
                  border: `1px solid ${C.border}`,
                  borderRadius: "12px",
                  padding: "1.25rem",
                }}
              >
                <div style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>{item.icon}</div>
                <p style={{ fontSize: "0.85rem", fontWeight: 700, color: C.charcoal, marginBottom: "0.35rem" }}>
                  {item.title}
                </p>
                <p style={{ fontSize: "0.82rem", color: C.muted, lineHeight: 1.6 }}>{item.desc}</p>
              </div>
            ))}
          </div>

          {/* ── Application Form ── */}
          <div ref={formRef} style={{ scrollMarginTop: "2rem" }}>
            {submitted ? (
              <div
                style={{
                  textAlign: "center",
                  background: C.card,
                  border: `1px solid ${C.goldBorder}`,
                  borderRadius: "16px",
                  padding: "3rem 2rem",
                }}
              >
                <p
                  style={{
                    fontSize: "0.7rem",
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    color: C.gold,
                    marginBottom: "0.75rem",
                    fontWeight: 600,
                  }}
                >
                  Application Received ✦
                </p>
                <h2
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "1.8rem",
                    fontWeight: 700,
                    color: C.charcoal,
                    marginBottom: "0.75rem",
                  }}
                >
                  Thank you, {name.split(" ")[0]}.
                </h2>
                <p style={{ fontSize: "1rem", color: C.muted, lineHeight: 1.75, maxWidth: "460px", margin: "0 auto 2rem" }}>
                  We&apos;ll review your{" "}
                  <strong style={{ color: C.charcoal }}>{activeTier.name}</strong> sponsorship
                  inquiry and reach out at{" "}
                  <strong style={{ color: C.charcoal }}>{email}</strong> with a tailored
                  proposal within a few days.
                </p>
                <Link
                  href="/"
                  style={{
                    display: "inline-block",
                    padding: "0.75rem 2rem",
                    background: `linear-gradient(135deg, ${C.gold}, ${C.orange})`,
                    color: "#fff",
                    fontWeight: 700,
                    fontSize: "0.95rem",
                    borderRadius: "30px",
                    textDecoration: "none",
                  }}
                >
                  Back to Wellness Weekend →
                </Link>
                <p style={{ fontSize: "0.8rem", color: C.faint, marginTop: "1.5rem" }}>
                  Questions?{" "}
                  <a href="mailto:support@thesoundspace.us" style={{ color: C.gold }}>
                    support@thesoundspace.us
                  </a>
                </p>
              </div>
            ) : (
              <div
                style={{
                  background: C.card,
                  border: `1px solid ${C.border}`,
                  borderRadius: "20px",
                  padding: "2.5rem 2rem",
                }}
              >
                <div style={{ marginBottom: "2rem" }}>
                  <p
                    style={{
                      fontSize: "0.7rem",
                      letterSpacing: "0.14em",
                      textTransform: "uppercase",
                      color: C.gold,
                      marginBottom: "0.5rem",
                      fontWeight: 600,
                    }}
                  >
                    Sponsorship Application
                  </p>
                  <h2
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "1.6rem",
                      fontWeight: 700,
                      color: C.charcoal,
                      marginBottom: "0.5rem",
                    }}
                  >
                    Apply to Sponsor
                  </h2>
                  <p style={{ fontSize: "0.9rem", color: C.muted }}>
                    Tell us about your brand and we&apos;ll send a tailored proposal.
                  </p>
                </div>

                {/* Tier switcher inside form */}
                <div style={{ marginBottom: "2rem" }}>
                  <label
                    style={{
                      fontSize: "0.72rem",
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      color: "rgba(51,53,51,0.55)",
                      fontWeight: 600,
                      display: "block",
                      marginBottom: "0.6rem",
                    }}
                  >
                    Selected Tier
                  </label>
                  <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap" }}>
                    {TIERS.map((tier) => (
                      <button
                        key={tier.key}
                        type="button"
                        onClick={() => setSelectedTier(tier.key)}
                        style={{
                          padding: "0.5rem 1.1rem",
                          borderRadius: "30px",
                          border: selectedTier === tier.key
                            ? `2px solid ${tier.accent}`
                            : `1.5px solid ${C.border}`,
                          background: selectedTier === tier.key
                            ? `rgba(${hexToRgb(tier.accent)}, 0.08)`
                            : "transparent",
                          color: selectedTier === tier.key ? tier.accent : C.muted,
                          fontWeight: selectedTier === tier.key ? 700 : 500,
                          fontSize: "0.85rem",
                          cursor: "pointer",
                          transition: "all 0.15s",
                        }}
                      >
                        {tier.name} · {tier.price}
                      </button>
                    ))}
                  </div>
                </div>

                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                    <Field label="Your Name">
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Full name"
                        style={inputStyle}
                      />
                    </Field>
                    <Field label="Email Address">
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your@email.com"
                        style={inputStyle}
                      />
                    </Field>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                    <Field label="Phone" hint="Optional">
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="(907) 555-0100"
                        style={inputStyle}
                      />
                    </Field>
                    <Field label="Company / Business Name">
                      <input
                        type="text"
                        required
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        placeholder="Your business"
                        style={inputStyle}
                      />
                    </Field>
                  </div>

                  <Field label="Website" hint="Optional">
                    <input
                      type="url"
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                      placeholder="https://yourbusiness.com"
                      style={inputStyle}
                    />
                  </Field>

                  <Field label="What are your goals for this sponsorship?">
                    <textarea
                      required
                      value={goals}
                      onChange={(e) => setGoals(e.target.value)}
                      placeholder="Tell us what you're hoping to achieve — brand awareness, client leads, community connection, product launches…"
                      rows={4}
                      style={{ ...inputStyle, resize: "vertical", lineHeight: 1.6 }}
                    />
                  </Field>

                  <Field label="How did you hear about us?" hint="Optional">
                    <input
                      type="text"
                      value={source}
                      onChange={(e) => setSource(e.target.value)}
                      placeholder="Instagram, referral, returning sponsor…"
                      style={inputStyle}
                    />
                  </Field>

                  {/* Selected tier summary */}
                  <div
                    style={{
                      background: C.bg,
                      border: `1.5px solid ${C.goldBorder}`,
                      borderRadius: "10px",
                      padding: "1rem 1.25rem",
                      display: "flex",
                      alignItems: "center",
                      gap: "1rem",
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: "0.72rem", color: C.faint, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "0.2rem" }}>
                        Applying for
                      </p>
                      <p style={{ fontSize: "0.95rem", fontWeight: 700, color: C.charcoal }}>
                        {activeTier.name} Sponsorship · {activeTier.price}
                      </p>
                      <p style={{ fontSize: "0.82rem", color: C.muted, marginTop: "0.15rem" }}>
                        {activeTier.tagline}
                      </p>
                    </div>
                  </div>

                  {error && (
                    <p
                      style={{
                        fontSize: "0.9rem",
                        color: C.error,
                        background: C.errorBg,
                        border: `1px solid rgba(184,74,43,0.2)`,
                        borderRadius: "8px",
                        padding: "0.75rem 1rem",
                        margin: 0,
                      }}
                    >
                      {error}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    style={{
                      marginTop: "0.25rem",
                      padding: "0.95rem 2rem",
                      background: loading
                        ? `rgba(201,152,63,0.5)`
                        : `linear-gradient(135deg, ${C.gold}, ${C.orange})`,
                      color: "#fff",
                      fontWeight: 700,
                      fontSize: "1rem",
                      border: "none",
                      borderRadius: "30px",
                      cursor: loading ? "not-allowed" : "pointer",
                      letterSpacing: "0.03em",
                      transition: "opacity 0.2s",
                    }}
                  >
                    {loading ? "Submitting…" : `Apply for ${activeTier.name} Sponsorship →`}
                  </button>

                  <p style={{ fontSize: "0.8rem", color: C.faint, textAlign: "center" }}>
                    We&apos;ll review and reply within a few days. Questions?{" "}
                    <a href="mailto:support@thesoundspace.us" style={{ color: C.gold }}>
                      support@thesoundspace.us
                    </a>
                  </p>
                </form>
              </div>
            )}
          </div>

        </div>
      </main>
    </>
  );
}

function TierCard({
  tier,
  selected,
  onSelect,
}: {
  tier: Tier;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <div
      style={{
        background: C.card,
        border: selected
          ? `2px solid ${tier.accent}`
          : tier.featured
          ? `1.5px solid ${C.goldBorder}`
          : `1px solid ${C.border}`,
        borderRadius: "16px",
        padding: "1.75rem 1.5rem",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        transition: "box-shadow 0.2s, border-color 0.2s",
        boxShadow: selected
          ? `0 0 0 4px rgba(${hexToRgb(tier.accent)}, 0.10)`
          : tier.featured
          ? "0 4px 20px rgba(201,152,63,0.12)"
          : "none",
      }}
    >
      {tier.featured && !selected && (
        <div
          style={{
            position: "absolute",
            top: "-11px",
            left: "50%",
            transform: "translateX(-50%)",
            background: `linear-gradient(135deg, ${C.gold}, ${C.orange})`,
            color: "#fff",
            fontSize: "0.62rem",
            fontWeight: 700,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            padding: "0.25rem 0.75rem",
            borderRadius: "20px",
            whiteSpace: "nowrap",
          }}
        >
          Most Popular
        </div>
      )}

      <p
        style={{
          fontSize: "0.65rem",
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: tier.accent,
          fontWeight: 700,
          marginBottom: "0.5rem",
        }}
      >
        {tier.name}
      </p>
      <div style={{ display: "flex", alignItems: "baseline", gap: "0.3rem", marginBottom: "0.4rem" }}>
        <span
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "2.25rem",
            fontWeight: 800,
            color: C.charcoal,
          }}
        >
          {tier.price}
        </span>
      </div>
      <p style={{ fontSize: "0.85rem", color: C.muted, marginBottom: "1.25rem", lineHeight: 1.5 }}>
        {tier.tagline}
      </p>

      <ul
        style={{
          listStyle: "none",
          padding: 0,
          margin: "0 0 1.75rem",
          display: "flex",
          flexDirection: "column",
          gap: "0.55rem",
          flex: 1,
        }}
      >
        {tier.perks.map((perk) => (
          <li key={perk} style={{ display: "flex", gap: "0.6rem", alignItems: "flex-start" }}>
            <span style={{ color: tier.accent, fontWeight: 700, fontSize: "0.9rem", lineHeight: 1.4, flexShrink: 0 }}>
              ✓
            </span>
            <span style={{ fontSize: "0.88rem", color: C.charcoal, lineHeight: 1.5 }}>{perk}</span>
          </li>
        ))}
      </ul>

      <button
        onClick={onSelect}
        style={{
          width: "100%",
          padding: "0.75rem 1rem",
          background: selected
            ? `linear-gradient(135deg, ${tier.accent}, ${tier.key === "luminary" ? C.gold : C.orange})`
            : "transparent",
          color: selected ? "#fff" : tier.accent,
          border: `1.5px solid ${selected ? "transparent" : tier.accent}`,
          borderRadius: "30px",
          fontWeight: 700,
          fontSize: "0.9rem",
          cursor: "pointer",
          letterSpacing: "0.02em",
          transition: "all 0.15s",
        }}
      >
        {selected ? "Selected ✓" : "Apply for This Tier →"}
      </button>
    </div>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
      <label
        style={{
          fontSize: "0.72rem",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: "rgba(51,53,51,0.55)",
          fontWeight: 600,
        }}
      >
        {label}
      </label>
      {children}
      {hint && (
        <span style={{ fontSize: "0.72rem", color: "rgba(51,53,51,0.4)" }}>{hint}</span>
      )}
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "0.75rem 1rem",
  background: "#fff",
  border: "1px solid rgba(51,53,51,0.18)",
  borderRadius: "8px",
  color: "#333533",
  fontSize: "1rem",
  outline: "none",
  boxSizing: "border-box",
};

function hexToRgb(hex: string): string {
  const clean = hex.replace("#", "");
  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);
  return `${r}, ${g}, ${b}`;
}
