import Link from "next/link";

const ADDONS: { href: string; icon: string; title: string; subtitle: string; desc: string; cta: string }[] = [
  {
    href: "/massage",
    icon: "🌿",
    title: "Massage",
    subtitle: "Flow Massage · Alaska Massage Band",
    desc: "Book a therapeutic massage session with Flow Massage or Alaska Massage Band — available throughout the weekend. 30 or 60 minute sessions.",
    cta: "Book a Session",
  },
  {
    href: "/contrast-therapy",
    icon: "🔥",
    title: "Contrast Therapy",
    subtitle: "Hot · Cold · Reset",
    desc: "Alternating sauna heat and cold plunge to activate circulation, reduce inflammation, and ground your nervous system. 30-minute facilitated sessions at Lakeside.",
    cta: "View Sessions",
  },
  {
    href: "/aerial",
    icon: "🎋",
    title: "Aerial Silk",
    subtitle: "Fly · Float · Flow",
    desc: "Beginner silks flow with instructor Beth — no experience needed. Small groups of 6 create an intimate, supportive environment to discover the freedom of movement in the air. Silks provided by Alaska Fly Dog.",
    cta: "Reserve a Spot",
  },
  {
    href: "/paddleboard",
    icon: "🏄",
    title: "Paddleboard Yoga",
    subtitle: "Water · Balance · Breath",
    desc: "All-levels flow on the lake under the Alaskan sun. You might get wet — that's part of the magic. Boards provided by Alaska Fly Dog.",
    cta: "Reserve a Spot",
  },
];

export default function BuildYourWeekend() {
  return (
    <section id="build" className="section build-weekend">
      <p className="section-label">Add-On Experiences</p>
      <h2 className="section-title">Book Your Session.</h2>
      <p className="section-desc">
        Layer in what calls to you — each add-on is bookable ahead of time so you arrive ready.
      </p>
      <div className="build-grid">
        {ADDONS.map((a) => (
          <div key={a.title} className="build-card">
            <div className="build-card-icon">{a.icon}</div>
            <div className="build-card-body">
              <h3 className="build-card-title">{a.title}</h3>
              <p className="build-card-sub">{a.subtitle}</p>
              <p className="build-card-desc">{a.desc}</p>
            </div>
            <Link href={a.href} className="build-card-cta">
              {a.cta}
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
