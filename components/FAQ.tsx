"use client";
import { useState } from "react";

const faqs = [
  {
    q: "What should I bring?",
    a: "Layers of warm clothing, a sleeping bag (for Seedling campers), yoga mat, water bottle, journal, sunscreen, insect repellent, and an open heart. We'll send a detailed packing list upon registration.",
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
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <section id="faq" className="section faq">
      <p className="section-label">Questions & Answers</p>
      <h2 className="section-title" style={{ fontFamily: "var(--font-display)" }}>
        Everything You <em>Need to Know</em>
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
