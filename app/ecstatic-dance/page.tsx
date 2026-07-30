import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "What is Ecstatic Dance? | Wellness Weekend 2026",
  description: "Ecstatic Dance is a free-form, sober movement ceremony — a pillar of Wellness Weekend. Three nights of conscious dance under the Alaskan sky.",
};

const DANCES = [
  {
    day: "Friday · Aug 7",
    time: "8:00 PM",
    name: "Opening Night",
    desc: "The weekend opens with ecstatic dance on the main stage — a full-body arrival ceremony to shake off the road and land in the body.",
    dj: "Flowscape",
  },
  {
    day: "Saturday · Aug 8",
    time: "8:00 PM",
    name: "Lion's Gate Dance",
    desc: "The most sacred night. After cacao ceremony at the fire, J Brave holds the dancefloor as the Lion's Gate portal opens — a full ceremony of sound and movement.",
    dj: "J Brave",
  },
  {
    day: "Saturday · Aug 8",
    time: "10:00 PM",
    name: "Late Night Journey",
    desc: "The floor stays alive. Flowscape picks up where J Brave leaves off — deeper, darker, longer. Dance until the midnight sun finds you.",
    dj: "Flowscape",
  },
  {
    day: "Sunday · Aug 9",
    time: "11:11 AM",
    name: "Message from the Bees",
    desc: "A special morning ecstatic dance held in the labyrinth garden with High Vibin' Mary — let the bees speak through your body and activate the garden portal.",
    dj: "High Vibin' Mary",
    special: true,
  },
  {
    day: "Sunday · Aug 9",
    time: "7:00 PM",
    name: "Closing Dance",
    desc: "The final dance of the weekend — 7 to 9 PM, closing the container, moving the medicine, sending every body home full.",
    dj: "Flowscape",
  },
];

export default function EcstaticDancePage() {
  return (
    <main style={{ background: "#0a0a14", color: "#fff", minHeight: "100vh" }}>

      {/* Hero */}
      <div style={{
        position: "relative",
        minHeight: "70vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "6rem 1.5rem 4rem",
        overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", inset: 0,
          background: "radial-gradient(ellipse at 30% 40%, rgba(139,95,191,0.35) 0%, transparent 55%), radial-gradient(ellipse at 70% 60%, rgba(212,99,159,0.3) 0%, transparent 55%), radial-gradient(ellipse at 50% 20%, rgba(229,156,50,0.2) 0%, transparent 50%), #0a0a14",
          zIndex: 0,
        }} />
        <div style={{ position: "relative", zIndex: 1 }}>
          <Link href="/" style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.78rem", letterSpacing: "0.1em", textTransform: "uppercase", textDecoration: "none" }}>
            ← Wellness Weekend
          </Link>
          <p style={{ fontSize: "0.72rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--gold, #C9983F)", marginTop: "2rem", marginBottom: "0.75rem", fontWeight: 600 }}>
            A Festival Pillar
          </p>
          <h1 style={{ fontFamily: "var(--font-display, serif)", fontSize: "clamp(2.8rem, 8vw, 5.5rem)", lineHeight: 1.05, marginBottom: "1.25rem" }}>
            What is<br /><em style={{ color: "var(--gold, #C9983F)" }}>Ecstatic Dance?</em>
          </h1>
          <p style={{ fontSize: "clamp(1rem, 2.5vw, 1.2rem)", color: "rgba(255,255,255,0.7)", lineHeight: 1.8, maxWidth: 560, margin: "0 auto 2rem" }}>
            Three nights. Five ceremonies. One dancefloor under the Alaskan sky.
          </p>
          <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/#store" style={{
              background: "var(--gold, #C9983F)", color: "#fff", fontWeight: 700,
              padding: "0.75rem 2rem", borderRadius: 30, textDecoration: "none", fontSize: "0.95rem",
            }}>
              Get Your Ticket →
            </Link>
            <Link href="/#schedule" style={{
              background: "transparent", color: "#fff", fontWeight: 700,
              padding: "0.75rem 2rem", borderRadius: 30, textDecoration: "none", fontSize: "0.95rem",
              border: "1.5px solid rgba(255,255,255,0.25)",
            }}>
              See the Schedule
            </Link>
          </div>
        </div>
      </div>

      {/* What it is */}
      <section style={{ maxWidth: 760, margin: "0 auto", padding: "4rem 1.5rem" }}>
        <p style={{ fontSize: "0.72rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--gold, #C9983F)", fontWeight: 600, marginBottom: "1rem" }}>
          The Practice
        </p>
        <h2 style={{ fontFamily: "var(--font-display, serif)", fontSize: "clamp(1.8rem, 4vw, 2.8rem)", marginBottom: "1.5rem", lineHeight: 1.2 }}>
          Your body already knows the way.
        </h2>
        <div style={{ display: "grid", gap: "1.25rem", fontSize: "1rem", lineHeight: 1.85, color: "rgba(255,255,255,0.72)" }}>
          <p>
            Ecstatic Dance is a free-form movement practice held in a sober, screen-free space. There is no choreography, no right way to move, and no one watching to see if you're doing it correctly. The only rule is to move in a way that is authentic to you — and to give that same freedom to everyone around you.
          </p>
          <p>
            The DJ is not just a music selector. They are a ceremony holder — shaping a sonic arc that moves the dancefloor through an intentional journey. An opening that warms the body. A peak that dissolves the mind. A landing that returns you to earth. Every set is a full ceremony, even if it doesn't feel like one from the outside.
          </p>
          <p>
            Some people cry on the dancefloor. Some people laugh. Some people move like they've never moved before. Some people stand still and let the music move through them. All of it is welcome. The dancefloor is a temple, and your body is the prayer.
          </p>
          <p>
            No alcohol is served during ecstatic dance. No phones on the floor. These aren't rules to limit you — they're an invitation to go deeper than a regular dance party ever allows. When the social performance drops away, something ancient and alive rises in its place.
          </p>
        </div>
      </section>

      {/* Divider image */}
      <div style={{ display: "flex", justifyContent: "center", padding: "0 1.5rem 4rem" }}>
        <div style={{ position: "relative", width: "min(420px, 90vw)", borderRadius: 20, overflow: "hidden", boxShadow: "0 24px 64px rgba(0,0,0,0.6)" }}>
          <Image
            src="/images/client-2026/message-from-the-bees.jpg"
            alt="Message from the Bees — Ecstatic Dance Party with High Vibin' Mary, August 9 at 11:11 AM"
            width={960}
            height={960}
            style={{ width: "100%", height: "auto", display: "block" }}
          />
        </div>
      </div>

      {/* The ceremonies */}
      <section style={{ background: "rgba(255,255,255,0.03)", borderTop: "1px solid rgba(255,255,255,0.07)", borderBottom: "1px solid rgba(255,255,255,0.07)", padding: "4rem 1.5rem" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <p style={{ fontSize: "0.72rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--gold, #C9983F)", fontWeight: 600, marginBottom: "0.75rem", textAlign: "center" }}>
            The Schedule
          </p>
          <h2 style={{ fontFamily: "var(--font-display, serif)", fontSize: "clamp(1.6rem, 4vw, 2.6rem)", textAlign: "center", marginBottom: "2.5rem" }}>
            Five Ceremonies. Three Nights.
          </h2>
          <div style={{ display: "grid", gap: "1rem" }}>
            {DANCES.map((d) => (
              <div key={`${d.day}-${d.time}`} style={{
                background: d.special ? "linear-gradient(135deg, rgba(139,95,191,0.18), rgba(61,184,175,0.12))" : "rgba(255,255,255,0.05)",
                border: d.special ? "1px solid rgba(139,95,191,0.4)" : "1px solid rgba(255,255,255,0.08)",
                borderRadius: 14,
                padding: "1.4rem 1.6rem",
                display: "grid",
                gridTemplateColumns: "auto 1fr",
                gap: "1.2rem",
                alignItems: "start",
              }}>
                <div style={{ textAlign: "center", minWidth: 64 }}>
                  <div style={{ fontSize: "0.68rem", letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", marginBottom: "0.2rem" }}>{d.day.split("·")[0]}</div>
                  <div style={{ fontFamily: "var(--font-display, serif)", fontSize: "1.3rem", color: d.special ? "#9B7FD4" : "var(--gold, #C9983F)", lineHeight: 1 }}>{d.time}</div>
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: "1rem", marginBottom: "0.2rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    {d.name}
                    {d.special && <span style={{ fontSize: "0.65rem", background: "#9B7FD4", color: "#fff", padding: "0.15rem 0.5rem", borderRadius: 20, fontWeight: 700, letterSpacing: "0.06em" }}>SPECIAL</span>}
                  </div>
                  <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.45)", marginBottom: "0.5rem", textTransform: "uppercase", letterSpacing: "0.08em" }}>DJ · {d.dj}</div>
                  <p style={{ fontSize: "0.88rem", color: "rgba(255,255,255,0.62)", lineHeight: 1.65, margin: 0 }}>{d.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What to expect */}
      <section style={{ maxWidth: 760, margin: "0 auto", padding: "4rem 1.5rem" }}>
        <h2 style={{ fontFamily: "var(--font-display, serif)", fontSize: "clamp(1.6rem, 4vw, 2.4rem)", marginBottom: "2rem" }}>
          What to Expect
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.25rem" }}>
          {[
            { icon: "🌀", title: "No Choreography", body: "There's nothing to learn. Move however your body wants to move. The floor holds all of it." },
            { icon: "🚫🍺", title: "Alcohol-Free", body: "The dancefloor is sober. This isn't a nightclub — it's a ceremony. Go as deep as you want." },
            { icon: "📵", title: "Screens Away", body: "Phones off, cameras down. What happens on the floor stays on the floor. Be here fully." },
            { icon: "🔥", title: "Held by a DJ", body: "Every set is a designed journey — an arc from opening to peak to integration. Trust the music." },
            { icon: "👣", title: "Wear Soft Shoes or Go Barefoot", body: "Feet need to feel the floor. Grippy socks or bare feet work best. Skip the hard soles." },
            { icon: "💧", title: "Hydrate and Rest", body: "There's no shame in stepping out for water or a breath of Alaskan air. The container holds you." },
          ].map((e) => (
            <div key={e.title} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, padding: "1.25rem 1.4rem" }}>
              <div style={{ fontSize: "1.6rem", marginBottom: "0.6rem" }}>{e.icon}</div>
              <h3 style={{ fontWeight: 700, fontSize: "0.95rem", marginBottom: "0.4rem" }}>{e.title}</h3>
              <p style={{ fontSize: "0.84rem", color: "rgba(255,255,255,0.58)", lineHeight: 1.65, margin: 0 }}>{e.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ textAlign: "center", padding: "4rem 1.5rem 6rem", borderTop: "1px solid rgba(255,255,255,0.07)" }}>
        <p style={{ fontSize: "0.72rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", marginBottom: "1rem" }}>
          Sutton, Alaska · August 7–9, 2026
        </p>
        <h2 style={{ fontFamily: "var(--font-display, serif)", fontSize: "clamp(2rem, 5vw, 3.5rem)", marginBottom: "0.75rem" }}>
          Come dance with us.
        </h2>
        <p style={{ color: "rgba(255,255,255,0.55)", lineHeight: 1.7, maxWidth: 440, margin: "0 auto 2rem", fontSize: "0.95rem" }}>
          Five ecstatic dance ceremonies over three days under the midnight sun. Your body will know what to do.
        </p>
        <Link href="/#store" style={{
          display: "inline-block",
          background: "var(--gold, #C9983F)", color: "#fff", fontWeight: 700,
          padding: "0.85rem 2.5rem", borderRadius: 30, textDecoration: "none",
          fontSize: "1rem", letterSpacing: "0.02em",
        }}>
          Secure Your Spot →
        </Link>
      </section>

    </main>
  );
}
