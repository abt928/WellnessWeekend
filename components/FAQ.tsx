"use client";
import { useState } from "react";

const faqs = [
  {
    q: "What should I bring?",
    a: "Layers of warm clothing, a cold-weather sleeping bag (rated for 40°F or below), your own towel, a tent that can handle rain, yoga mat, water bottle, journal, sunscreen, and insect repellent. We'll send a full packing list closer to the event.",
  },
  {
    q: "What's the weather like in August?",
    a: "Sutton, Alaska enjoys long summer days with temperatures between 55–75°F. Evenings can cool to 40–50°F. The midnight sun provides nearly 20 hours of daylight; bring an eye mask for sleeping!",
  },
  {
    q: "How do I get to the festival?",
    a: "Fly into Ted Stevens Anchorage International Airport (ANC). Sutton is a scenic 1.5-hour drive northeast on the Glenn Highway. We offer shuttle service from Anchorage for an additional fee.",
  },
  {
    q: "Are meals included?",
    a: "Meals are available for purchase on-site from our curated food vendors and the Cacao Bar. Vegan, vegetarian, and gluten-free options are always available. Beverage tokens can be pre-purchased in the store.",
  },
  {
    q: "What is the cancellation policy?",
    a: "All ticket sales are final: there are no refunds for cancellations. However, we can apply a credit toward next year’s gathering. Tickets may also be transferred to another attendee at any time. Contact us to arrange a transfer or credit.",
  },
  {
    q: "Is this suitable for beginners?",
    a: "Absolutely. Wellness Weekend welcomes all experience levels. Our practitioners create safe, inclusive spaces for both seasoned practitioners and those just beginning their healing journey.",
  },
  {
    q: "Will there be cell service?",
    a: "Cell service is very limited in Sutton. We encourage this as part of the digital detox experience. WiFi is available at the registration tent for emergencies.",
  },
  {
    q: "Is the festival pet friendly?",
    a: "No pets are allowed on the property or at the festival. Violations will result in your ticket being voided. Service animals are the only accepted accommodation and must be prearranged with us in advance.",
  },
  {
    q: "Are there showers on-site?",
    a: "Yes, showers are available on-site. Please bring your own towel.",
  },
  {
    q: "Is there RV camping?",
    a: "On-site camping is tent only — there are no RV hookups or pull-through spaces. If you're arriving by RV, nearby options include Matanuska River Park in Palmer (20 min west — full hookups) and several private RV parks in Palmer and Wasilla (30–40 min).",
  },
  {
    q: "Is tent camping available on-site?",
    a: "Yes — tent camping is open for 2026 at $345 for the full weekend. Grab your spot in the store before they fill up.",
  },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <section id="faq" className="section faq">
      <p className="section-label">Questions & Answers</p>
      <h2 className="section-title">
        Questions.
      </h2>
      <div className="faq-list">
        {faqs.map((f, i) => (
          <div key={i} className={`faq-item${open === i ? " open" : ""}`}>
            <button className="faq-question" onClick={() => setOpen(open === i ? null : i)}>
              {f.q}
              <span className="faq-icon">+</span>
            </button>
            <div className="faq-answer">
              <p>{f.a}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
