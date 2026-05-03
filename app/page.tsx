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

/* ── static data ── */
const practitioners = [
  { name: "Luna Ravenwood", role: "Sound Healer", icon: "🔮" },
  { name: "Cedar Whitehawk", role: "Ceremonial Shaman", icon: "🪶" },
  { name: "Sage Moonfire", role: "Breathwork Facilitator", icon: "🌬️" },
  { name: "Aurora Clearwater", role: "Plant Medicine Guide", icon: "🍄" },
  { name: "River Stoneheart", role: "Yoga Teacher", icon: "🧘" },
  { name: "Willow Earthsong", role: "Reiki Master", icon: "✨" },
  { name: "Ember Goldleaf", role: "Cacao Ceremonialist", icon: "🍫" },
  { name: "Sky Driftwood", role: "Ecstatic Dance DJ", icon: "🎵" },
];

const packages = [
  {
    icon: "🌱",
    name: "Seedling",
    price: "$222",
    per: "per person",
    features: [
      "Full weekend pass",
      "All workshops & ceremonies",
      "Communal camping area",
      "Access to communal kitchen",
      "Welcome gift bundle",
    ],
  },
  {
    icon: "🌸",
    name: "Wildflower",
    price: "$444",
    per: "per person",
    features: [
      "Everything in Seedling",
      "Furnished glamping tent",
      "All organic meals included",
      "Herbal welcome kit",
      "Guided nature walk",
      "Morning tea ceremony",
    ],
  },
  {
    icon: "🌌",
    name: "Aurora",
    price: "$777",
    per: "per person",
    featured: true,
    badge: "Most Popular",
    features: [
      "Everything in Wildflower",
      "Private heated yurt",
      "Two spa treatments",
      "Sacred plant medicine ceremony",
      "Midnight sun meditation",
      "Crystal grid keepsake",
      "Priority workshop seating",
    ],
  },
  {
    icon: "☀️",
    name: "Midnight Sun",
    price: "$1,111",
    per: "per person",
    features: [
      "Everything in Aurora",
      "Luxury private cabin",
      "Helicopter glacier tour",
      "Private shamanic ceremony",
      "Personal concierge",
      "All plant medicine ceremonies",
      "Exclusive farewell dinner",
      "Lifetime alumni access",
    ],
  },
];

const testimonials = [
  {
    quote:
      "The plant medicine ceremony under the midnight sun shattered every boundary I thought I had. I left Alaska a completely different person. This is not just a festival — it's a portal.",
    author: "Maya S.",
    loc: "Portland, OR",
  },
  {
    quote:
      "The ceremonial shamans hold space like nothing I've ever experienced. Combined with Alaska's raw energy and the midnight sun, it's genuinely otherworldly. Bring tissues.",
    author: "James R.",
    loc: "Denver, CO",
  },
  {
    quote:
      "Alaska's energy is unlike anything else. Combine that with this incredible community and you get pure magic. Already booked for next year.",
    author: "Aria L.",
    loc: "Sedona, AZ",
  },
];

export default function Home() {
  return (
    <>
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
          <a href="#packages" className="hero-cta">
            Reserve Your Journey
          </a>
        </div>
        <div className="scroll-indicator">
          <span>Discover</span>
          <div className="scroll-line" />
        </div>
      </section>

      {/* ═══ ABOUT ═══ */}
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
            falls on the powerful 8/8 Lion&apos;s Gate Portal — a time of heightened cosmic
            energy and spiritual awakening. For three days, guided by ceremonial shamans
            under the midnight sun, we dissolve boundaries and remember who we truly are.
          </p>
        </Reveal>
        <Reveal>
          <div className="stats">
            {[
              { n: "4th", l: "Year" },
              { n: "200+", l: "Seekers" },
              { n: "30+", l: "Practitioners" },
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

      {/* ═══ EXPERIENCE ═══ */}
      <section id="experience" className="section experience">
        <Reveal>
          <p className="section-label">The Experience</p>
          <h2 className="section-title" style={{ fontFamily: "var(--font-display)" }}>
            Three Pillars of <em>Healing</em>
          </h2>
          <p className="section-desc">
            Every offering at Wellness Weekend is designed to nourish body, mind, and
            spirit — rooted in ancient wisdom and held in sacred Alaskan earth.
          </p>
        </Reveal>
        <Reveal>
          <div className="pillars">
            {[
              {
                img: "/images/sound-healing.png",
                icon: "🔮",
                title: "Sound & Vibration",
                desc: "Crystal bowls, tuning forks, gong baths, vocal toning, and sacred instruments guide you into deep states of consciousness and vibrational healing.",
              },
              {
                img: "/images/earth-medicine.png",
                icon: "🍄",
                title: "Plant Medicine & Ceremony",
                desc: "Sacred plant medicine ceremonies led by experienced shamans. Cacao rituals, herbal elixirs, wildcrafting, and deep ceremonial work in the Alaskan wilderness.",
              },
              {
                img: "/images/movement.png",
                icon: "✨",
                title: "Movement & Bodywork",
                desc: "Ecstatic dance, sunrise yoga, breathwork journeys, reiki, Thai massage, and somatic release — move energy through the body.",
              },
            ].map((p) => (
              <div className="pillar" key={p.title}>
                <div className="pillar-img">
                  <Image src={p.img} alt={p.title} fill style={{ objectFit: "cover" }} />
                </div>
                <div className="pillar-overlay" />
                <div className="pillar-content">
                  <div className="pillar-icon">{p.icon}</div>
                  <h3 className="pillar-title" style={{ fontFamily: "var(--font-display)" }}>{p.title}</h3>
                  <p className="pillar-desc">{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* ═══ ALASKA ═══ */}
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
              sun bathes the land in golden light nearly around the clock — creating a
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

      {/* ═══ GALLERY ═══ */}
      <Gallery />

      {/* ═══ PRACTITIONERS ═══ */}
      <section id="practitioners" className="section practitioners">
        <Reveal>
          <p className="section-label">Our Guides</p>
          <h2 className="section-title" style={{ fontFamily: "var(--font-display)" }}>
            Meet the <em>Practitioners</em>
          </h2>
          <p className="section-desc">
            Handpicked healers, teachers, and guides from across North America — each bringing
            decades of practice and deep reverence for the healing arts.
          </p>
        </Reveal>
        <Reveal>
          <div className="practitioner-grid">
            {practitioners.map((p) => (
              <div className="practitioner-card" key={p.name}>
                <div className="practitioner-avatar">{p.icon}</div>
                <div className="practitioner-name" style={{ fontFamily: "var(--font-display)" }}>{p.name}</div>
                <div className="practitioner-role">{p.role}</div>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* ═══ GET INVOLVED ═══ */}
      <GetInvolved />

      {/* ═══ SCHEDULE ═══ */}
      <Schedule />

      {/* ═══ STORE ═══ */}
      <Store />

      {/* ═══ PACKAGES ═══ */}
      <section id="packages" className="section packages">
        <Reveal>
          <p className="section-label">Choose Your Path</p>
          <h2 className="section-title" style={{ fontFamily: "var(--font-display)" }}>
            Festival <em>Packages</em>
          </h2>
          <p className="section-desc">
            Every package includes the full Wellness Weekend experience. Choose the
            level of comfort and immersion that calls to you.
          </p>
        </Reveal>
        <Reveal>
          <div className="package-grid">
            {packages.map((p) => (
              <div className={`package-card${p.featured ? " featured" : ""}`} key={p.name}>
                {p.badge && <span className="package-badge">{p.badge}</span>}
                <div className="package-icon">{p.icon}</div>
                <div className="package-name" style={{ fontFamily: "var(--font-display)" }}>{p.name}</div>
                <div className="package-price" style={{ fontFamily: "var(--font-display)" }}>{p.price}</div>
                <div className="package-per">{p.per}</div>
                <ul className="package-features">
                  {p.features.map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>
                <button className="package-btn">Reserve Now</button>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* ═══ TESTIMONIALS ═══ */}
      <section className="section testimonials">
        <Reveal>
          <p className="section-label">Voices from the Circle</p>
          <h2 className="section-title" style={{ fontFamily: "var(--font-display)" }}>
            What Past Attendees <em>Say</em>
          </h2>
        </Reveal>
        <Reveal>
          <div className="testimonial-grid">
            {testimonials.map((t) => (
              <div className="testimonial-card" key={t.author}>
                <p className="testimonial-quote" style={{ fontFamily: "var(--font-accent)" }}>
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="testimonial-author">{t.author}</div>
                <div className="testimonial-loc">{t.loc}</div>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* ═══ FAQ ═══ */}
      <FAQ />

      {/* ═══ FOOTER ═══ */}
      <footer className="footer">
        <h2 className="footer-title" style={{ fontFamily: "var(--font-display)" }}>
          See You Under the <em>Midnight Sun</em> ✨
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
        <div className="footer-bottom">
          © 2026 Wellness Weekend · Sutton, Alaska · All rights reserved
        </div>
      </footer>
    </>
  );
}
