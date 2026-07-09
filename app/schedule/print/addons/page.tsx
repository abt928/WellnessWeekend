import Link from "next/link";
import PrintButton from "@/components/PrintButton";

export const metadata = {
  title: "Add-Ons & Bookable Experiences · Wellness Weekend 2026",
  description: "Printable add-ons and bookable experiences for Wellness Weekend — August 7–9, 2026",
};

const ADDONS = [
  {
    name: "Floating Sound Bath",
    category: "Healing Experience",
    description:
      "Float in an aerial silk hammock or on the lake by paddleboard while Peace Pixy's handpan fills the Alaskan sky with healing tones. The signature ceremony of the 8/8 Lion's Gate Activation.",
    when: "Saturday · 7:00 AM & 8:00 AM · Lakeside",
    host: "Peace Pixy · Avalon Starling",
    price: "Add-on",
    limited: true,
    notes: "Book in advance — limited hammock & paddleboard spots",
  },
  {
    name: "Intro Aerial Silks",
    category: "Movement",
    description:
      "A beginner-friendly aerial silks class — learn to float in fabric, build upper body strength, and feel the joy of leaving the ground. All bodies welcome.",
    when: "Friday 3 PM · Saturday 10 AM & 2 PM · Max 6 people per session",
    host: "Beth",
    price: "Add-on",
    limited: true,
    notes: "Max 6 per class — book ahead",
  },
  {
    name: "Intro Aerial Silks for Kids",
    category: "Family Day",
    description:
      "Children discover the joy of movement in the air. Beginner-friendly and fully supervised. Sunday Family Day.",
    when: "Sunday · 10:30 AM",
    host: "Beth",
    price: "Add-on",
    limited: true,
    notes: "Limited spots — book ahead",
  },
  {
    name: "Paddleboard Yoga",
    category: "Movement",
    description:
      "All-levels stand-up paddleboard yoga on the lake. Beginner flow — expect to get wet and to feel amazing. One of the most memorable experiences of the weekend.",
    when: "Friday 2 PM · Saturday 1 PM · Lakeside",
    host: "Alice Sullivan · Ashleigh Bicknell",
    price: "Add-on",
    limited: true,
    notes: "Limited boards — book ahead",
  },
  {
    name: "Contrast Therapy",
    category: "Recovery & Wellness",
    description:
      "Cold plunge + dry sauna cycling on the lakeshore. Activates circulation, reduces inflammation, and powerfully resets the nervous system. Facilitated sessions with breathwork coaching available. Sauna holds maximum 4 people.",
    when: "All day Fri–Sun · 30-min sessions · Must be booked in advance",
    host: "Ashleigh Bicknell",
    price: "Add-on",
    limited: true,
    notes: "Sauna max 4 · Book your slot in advance",
  },
  {
    name: "Ayni Despacho Ceremony",
    category: "Sacred Ceremony",
    description:
      "An Andean ceremony of sacred reciprocity. A bundle of seeds, flowers, and offerings is built together with intention and given back to the mountain spirits. A profound practice of gratitude and release.",
    when: "Saturday · 2:00 PM · Lodge",
    host: "—",
    price: "$75 materials fee",
    limited: false,
    notes: "Workshop materials fee · $75",
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
        <Link href="/schedule/print" className="print-back-link">← Full Schedule</Link>
        <PrintButton />
        <Link href="/#store" className="print-back-link">
          Book Now →
        </Link>
      </div>

      <header className="print-header">
        <p className="print-eyebrow">4th Annual Healing Arts Gathering · Lion&apos;s Gate</p>
        <h1 className="print-title">Add-Ons & Bookable Experiences</h1>
        <p className="print-subtitle">August 7–9, 2026 · Warrior Lodge · Sutton, Alaska</p>
        <p className="print-subtitle" style={{ fontSize: "0.8rem", opacity: 0.6, marginTop: "0.25rem" }}>
          Book at wellnessweekendak.com/#store · Questions: support@thesoundspace.us
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
                  <th style={{ width: "160px" }}>Experience</th>
                  <th>Description</th>
                  <th style={{ width: "150px" }}>When</th>
                  <th style={{ width: "100px" }}>Host</th>
                  <th style={{ width: "90px" }}>Price</th>
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
                    <td className="print-notes" style={{ fontSize: "0.75rem", fontWeight: 600 }}>{a.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        );
      })}

      <footer className="print-footer">
        <p>Add-ons must be booked in advance through the store — limited spots fill quickly.</p>
        <p style={{ marginTop: "0.25rem" }}>wellnessweekendak.com/#store · support@thesoundspace.us</p>
      </footer>
    </div>
  );
}
