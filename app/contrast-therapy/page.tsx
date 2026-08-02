import Link from "next/link";

const C = {
  bg: "#F7F3EC",
  card: "#FBF9F4",
  charcoal: "#333533",
  muted: "rgba(51,53,51,0.6)",
  faint: "rgba(51,53,51,0.38)",
  teal: "#2E7A6D",
  gold: "#C9983F",
  border: "rgba(51,53,51,0.12)",
};

const TIERS = [
  {
    label: "1 Hour",
    price: "$22",
    desc: "Drop in for a single session at the lake.",
  },
  {
    label: "All Day",
    price: "$45",
    desc: "Unlimited access for one full day — Friday, Saturday, or Sunday.",
    highlight: true,
  },
  {
    label: "Full Weekend",
    price: "$99",
    desc: "Unlimited sauna access across all three days. The best value.",
  },
];

export default function SaunaPage() {
  return (
    <main style={{ minHeight: "100vh", background: C.bg, padding: "0 0 5rem" }}>

      {/* Header */}
      <div style={{ background: C.charcoal, color: "#fff", padding: "3.5rem 1.5rem 3rem", textAlign: "center" }}>
        <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.8rem", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "0.75rem" }}>
          Add-On Experience · Lakeside · By Solstice Saunas
        </p>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2rem,5vw,3rem)", fontWeight: 600, marginBottom: "0.5rem" }}>
          Lakeside Sauna
        </h1>
        <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "1rem", maxWidth: 520, margin: "0 auto" }}>
          Traditional heat on the water's edge · Pay at the gate · No booking needed
        </p>
      </div>

      <div style={{ maxWidth: 640, margin: "0 auto", padding: "2.5rem 1.25rem 0" }}>

        {/* About */}
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: "2rem", marginBottom: "2.5rem" }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.25rem", color: C.charcoal, marginBottom: "0.75rem" }}>
            About the experience
          </h2>
          <p style={{ color: C.muted, lineHeight: 1.75, margin: 0 }}>
            Solstice Saunas brings their lakeside sauna to Warrior Lodge for the full weekend.
            Step in, heat up, and cool off in the lake — as many times as you like.
            Traditional dry heat, stunning Alaskan views, and the kind of reset that only comes
            from fire and cold water.
          </p>
        </div>

        {/* Pricing */}
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.1rem", color: C.charcoal, marginBottom: "1.1rem" }}>
          Pricing
        </h2>
        <div style={{ display: "grid", gap: "1rem", marginBottom: "2.5rem" }}>
          {TIERS.map(t => (
            <div
              key={t.label}
              style={{
                background: t.highlight ? C.charcoal : C.card,
                border: `2px solid ${t.highlight ? C.charcoal : C.border}`,
                borderRadius: 14,
                padding: "1.5rem 1.75rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "1rem",
              }}
            >
              <div>
                <div style={{ fontWeight: 700, fontSize: "1.05rem", color: t.highlight ? "#fff" : C.charcoal, marginBottom: "0.25rem" }}>
                  {t.label}
                </div>
                <div style={{ fontSize: "0.875rem", color: t.highlight ? "rgba(255,255,255,0.65)" : C.muted, lineHeight: 1.5 }}>
                  {t.desc}
                </div>
              </div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: "1.75rem", fontWeight: 700, color: t.highlight ? C.gold : C.teal, whiteSpace: "nowrap" }}>
                {t.price}
              </div>
            </div>
          ))}
        </div>

        {/* How it works */}
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: "1.75rem", marginBottom: "2rem" }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1rem", color: C.charcoal, marginBottom: "0.75rem" }}>
            How it works
          </h2>
          <ul style={{ margin: 0, paddingLeft: "1.25rem", color: C.muted, lineHeight: 2, fontSize: "0.92rem" }}>
            <li>Find the Solstice Saunas tent lakeside when you arrive</li>
            <li>Choose your access tier and pay at the gate (cash or card)</li>
            <li>No reservation needed — just show up</li>
            <li>Bring a towel and swimwear</li>
          </ul>
        </div>

        <div style={{ textAlign: "center", marginTop: "2.5rem" }}>
          <Link href="/" style={{ color: C.teal, fontSize: "0.875rem", textDecoration: "none" }}>
            ← Back to the festival
          </Link>
        </div>
      </div>
    </main>
  );
}
