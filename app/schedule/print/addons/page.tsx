import Link from "next/link";
import PrintButton from "@/components/PrintButton";

export const metadata = {
  title: "Add-Ons & Sauna · Wellness Weekend 2026",
  description: "Printable add-ons, sauna pricing, and bookable experiences for Wellness Weekend — August 7–9, 2026",
};

const ADDONS = [
  // ── Sauna ──
  {
    name: "Lakeside Sauna",
    category: "Sauna",
    description:
      "Traditional dry sauna on the water's edge by Solstice Saunas. Heat up, step into the lake, and repeat. No booking needed — pay at the gate all weekend.",
    when: "Fri from 1 PM · Sat & Sun from 9 AM · Lakeside",
    host: "Solstice Saunas",
    price: "$22 / 1 hr · $45 / all day · $99 / full weekend",
    limited: false,
    notes: "Pay at the gate — no reservation needed",
  },
  // ── Movement ──
  {
    name: "Intro Aerial Silks",
    category: "Movement",
    description:
      "A beginner-friendly aerial silks class — learn to float in fabric, build upper body strength, and feel the joy of leaving the ground. All bodies welcome.",
    when: "Fri 3 PM & 7 PM · Sat 10 AM & 2 PM · Sun 10:30 AM · Max 6 per session",
    host: "Beth",
    price: "$20 / session",
    limited: true,
    notes: "Max 6 per class — book ahead at /aerial",
  },
  {
    name: "Intro Aerial Silks for Kids",
    category: "Movement",
    description:
      "Children discover the joy of movement in the air. Beginner-friendly and fully supervised. Sunday Family Day.",
    when: "Sunday · 2:00 PM",
    host: "Beth",
    price: "Add-on",
    limited: true,
    notes: "Limited spots — book ahead at /aerial",
  },
  {
    name: "Silk Hammock Solo Rental",
    category: "Movement",
    description:
      "Rent a silk hammock during any Sound offering, Ecstatic Dance, or live music set — settle in and let the frequency hold you. No instruction, no choreography — just you, suspended in sound.",
    when: "During sound baths, ecstatic dance & live music — see /aerial for full slot list",
    host: "Alaska Fly Dog",
    price: "$20 / 30 min",
    limited: false,
    notes: "7 hammocks available — reserve at /aerial",
  },
  {
    name: "Paddleboard Yoga",
    category: "Movement",
    description:
      "All-levels stand-up paddleboard yoga on the lake. Beginner flow — expect to get wet and to feel amazing. Boards and paddles provided by Alaska Fly Dog.",
    when: "Fri 2 PM · Sat 1 PM · Sun 1 PM (Kids) & 3 PM · Lakeside",
    host: "Alice Sullivan",
    price: "Add-on",
    limited: true,
    notes: "Limited boards — book ahead at /paddleboard",
  },
  // ── Bodywork ──
  {
    name: "Floating Sound Bath",
    category: "Healing Experience",
    description:
      "Float in an aerial silk hammock or on the lake by paddleboard while Peace Pixy's handpan fills the Alaskan sky with healing tones. The signature ceremony of the 8/8 Lion's Gate Activation.",
    when: "Saturday · 7:00 AM & 8:00 AM · Lakeside",
    host: "Peace Pixy · Avalon Starling",
    price: "Included",
    limited: true,
    notes: "Book hammock or paddleboard slot in advance",
  },
  {
    name: "Craniosacral Session",
    category: "Bodywork",
    description:
      "One-on-one craniosacral therapy session with Tundra Wellness. A deeply gentle, hands-on modality that works with the central nervous system to release tension and restore balance.",
    when: "Available throughout the weekend — schedule at the Tundra Wellness booth",
    host: "Tundra Wellness",
    price: "Priced at booth",
    limited: true,
    notes: "Schedule directly with vendor on-site",
  },
  {
    name: "Chair Massage",
    category: "Bodywork",
    description:
      "On-site chair massage sessions. Drop in or schedule ahead with Flow Massage in the Vendor Village.",
    when: "All weekend · Vendor Village",
    host: "Flow Massage",
    price: "Priced at booth",
    limited: false,
    notes: "Drop-in or schedule at booth",
  },
  // ── Vendor Village ──
  {
    name: "Tarot Reading",
    category: "Divination",
    description:
      "Private tarot and psychic readings with Northern Messages. Find your clarity, receive your message.",
    when: "Available throughout the weekend · Vendor Village",
    host: "Northern Messages",
    price: "Priced at booth",
    limited: true,
    notes: "Schedule directly with vendor",
  },
  {
    name: "Acupuncture",
    category: "Healing",
    description:
      "Individual acupuncture sessions with Aurora Acupuncture. Restore flow, release pain, and recalibrate your energy field.",
    when: "Available throughout the weekend · Vendor Village",
    host: "Aurora Acupuncture",
    price: "Priced at booth",
    limited: true,
    notes: "Schedule at booth",
  },
];

const CATEGORIES = [...new Set(ADDONS.map((a) => a.category))];

export default function AddOnsPrintPage() {
  return (
    <div className="print-page">
      {/* Screen-only controls */}
      <div className="print-controls no-print">
        <Link href="/schedule/print" className="print-back-link">← Class Schedule</Link>
        <PrintButton />
        <Link href="/#store" className="print-back-link">
          Book Now →
        </Link>
      </div>

      <header className="print-header">
        <p className="print-eyebrow">4th Annual Healing Arts Gathering · Lion&apos;s Gate</p>
        <h1 className="print-title">Add-Ons &amp; Sauna</h1>
        <p className="print-subtitle">August 7–9, 2026 · Warrior Lodge · Sutton, Alaska</p>
        <p className="print-subtitle" style={{ fontSize: "0.8rem", opacity: 0.6, marginTop: "0.25rem" }}>
          Book at wellnessweekendak.com · Questions: support@thesoundspace.us
        </p>
      </header>

      {CATEGORIES.map((cat) => {
        const items = ADDONS.filter((a) => a.category === cat);
        return (
          <section key={cat} className="print-day" style={{ marginBottom: "1.5rem" }}>
            <div className="print-day-header">
              <h2 className="print-day-title" style={{ fontSize: "1rem" }}>{cat}</h2>
            </div>
            <table className="print-table">
              <thead>
                <tr>
                  <th style={{ width: "150px" }}>Experience</th>
                  <th>Description</th>
                  <th style={{ width: "160px" }}>When</th>
                  <th style={{ width: "90px" }}>Host</th>
                  <th style={{ width: "110px" }}>Price</th>
                </tr>
              </thead>
              <tbody>
                {items.map((a, i) => (
                  <tr key={i} className="print-row">
                    <td className="print-event-name">
                      <strong>{a.name}</strong>
                      {a.limited && <div><span className="print-badge-limited">⚑ Book ahead</span></div>}
                    </td>
                    <td className="print-detail" style={{ fontSize: "0.75rem" }}>{a.description}</td>
                    <td className="print-location" style={{ fontSize: "0.75rem" }}>{a.when}</td>
                    <td className="print-hosts" style={{ fontSize: "0.75rem" }}>{a.host}</td>
                    <td className="print-notes" style={{ fontSize: "0.75rem", fontWeight: 600, color: "#2E7A6D" }}>{a.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        );
      })}

      <footer className="print-footer">
        <p>Lakeside Sauna by Solstice Saunas — pay at the gate, no reservation needed.</p>
        <p style={{ marginTop: "0.25rem" }}>wellnessweekendak.com · support@thesoundspace.us</p>
      </footer>
    </div>
  );
}
