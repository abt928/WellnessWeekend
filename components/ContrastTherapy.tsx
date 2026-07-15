"use client";
import Reveal from "@/components/Reveal";
import { FlameIcon, WaterDropIcon } from "@/components/Icons";

const BENEFITS = [
  {
    icon: "🫀",
    title: "Circulation",
    desc: "Cold immersion causes blood vessels to contract; heat causes them to dilate. Cycling between the two pumps blood through the body and activates the cardiovascular system.",
  },
  {
    icon: "🧠",
    title: "Nervous System Reset",
    desc: "The contrast between heat and cold triggers a powerful parasympathetic response, flushing stress hormones and leaving the body in a deep state of regulated calm.",
  },
  {
    icon: "🔥",
    title: "Inflammation Relief",
    desc: "Cold water immersion reduces inflammation and muscle soreness. Paired with sauna heat, the effect is amplified: recovery in a fraction of the time.",
  },
  {
    icon: "✨",
    title: "Mood & Energy",
    desc: "Cold exposure spikes dopamine by up to 250%: a sustained, natural elevation in mood, focus, and energy that carries through hours of ceremony and dance.",
  },
];

export default function ContrastTherapy() {
  return (
    <section id="contrast-therapy" className="section contrast-section">
      <Reveal>
        <p className="section-label">Lakeside · All Weekend</p>
        <h2 className="section-title">Contrast Therapy.</h2>
        <p className="section-desc">
          Cold plunge meets fire sauna on the shore of the lake. One of the most powerful
          tools for physical recovery and nervous system regulation, available throughout
          the weekend, and unlike anything you&apos;ll experience at home.
        </p>
      </Reveal>

      {/* Hero banner */}
      <Reveal>
        <div className="contrast-hero">
          <div className="contrast-hero-half contrast-cold">
            <WaterDropIcon size={36} color="#3DB8AF" />
            <h3>Cold Plunge</h3>
            <p>Glacial-temperature immersion in the lake. The cold is the teacher: it asks you to breathe, to be present, to let go.</p>
          </div>
          <div className="contrast-hero-divider">
            <span className="contrast-hero-symbol">⟷</span>
          </div>
          <div className="contrast-hero-half contrast-hot">
            <FlameIcon size={36} color="#FF6B35" />
            <h3>Sauna</h3>
            <p>Dry heat sauna on the lakeside, maximum 4 people per session, creating an intimate container for the practice.</p>
          </div>
        </div>
      </Reveal>

      {/* Benefits grid */}
      <Reveal>
        <div className="contrast-benefits">
          {BENEFITS.map((b) => (
            <div key={b.title} className="contrast-benefit">
              <span className="contrast-benefit-icon">{b.icon}</span>
              <h4 className="contrast-benefit-title">{b.title}</h4>
              <p className="contrast-benefit-desc">{b.desc}</p>
            </div>
          ))}
        </div>
      </Reveal>

      {/* Ashleigh facilitation callout */}
      <Reveal>
        <div className="contrast-facilitator">
          <div className="contrast-facilitator-content">
            <p className="section-label" style={{ textAlign: "left" }}>Facilitated by Ashleigh Bicknell</p>
            <h3 className="contrast-facilitator-title">Held sessions. Not just hot and cold.</h3>
            <p className="contrast-facilitator-desc">
              Ashleigh is on-site throughout the weekend to guide and facilitate contrast therapy sessions, coaching breathwork, setting intention, and holding the space between extremes. Private coaching sessions are also available for those wanting a deeper, one-on-one experience.
            </p>
            <ul className="contrast-details">
              <li><span className="contrast-detail-dot" />30-minute sessions</li>
              <li><span className="contrast-detail-dot" />Sauna maximum 4 people</li>
              <li><span className="contrast-detail-dot" />Available Friday, Saturday & Sunday</li>
              <li><span className="contrast-detail-dot" />Must be booked in advance</li>
              <li><span className="contrast-detail-dot" />Coaching sessions available with Ashleigh</li>
            </ul>
            <a href="#build" className="contrast-cta">Book a Session →</a>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
