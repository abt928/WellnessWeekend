import Link from "next/link";

const faqs = [
  {
    question: "What does my festival pass include?",
    answer: (
      <p>
        Your pass covers the main Wellness Weekend program, including more than
        40 scheduled sessions across the main stage, lake, aerial space, and
        labyrinth garden. Small-capacity experiences, bodywork, meals, and
        lodging are sold separately and clearly marked in the ticket shop.
      </p>
    ),
  },
  {
    question: "Can I come for just one day?",
    answer: (
      <p>
        Yes. Choose a single-day pass, the Sunday Family Day pass, or a full
        weekend pass in the ticket section. Your Square checkout will show the
        current price before payment.
      </p>
    ),
  },
  {
    question: "Is Wellness Weekend beginner-friendly?",
    answer: (
      <p>
        Yes. You do not need prior experience with yoga, meditation, sound work,
        or ceremony. Practitioners explain what to expect, and you can skip any
        session, take a break, or build a quieter weekend at your own pace.
      </p>
    ),
  },
  {
    question: "How does Sunday Family Day work?",
    answer: (
      <p>
        Sunday includes family-focused activities such as aerial silks, art,
        nature play, and a crystal scavenger hunt. Children under 18 receive free
        Sunday admission and must attend with a parent or legal guardian.
      </p>
    ),
  },
  {
    question: "Where can I stay if camping is sold out?",
    answer: (
      <p>
        Shared cabin beds and private cabin options appear in the ticket shop
        while available. Nearby camping and lodging can also be found around
        Palmer, Wasilla, King Mountain, Matanuska River Park, and Long Lake.
        Book early because August weekends in the Valley fill quickly.
      </p>
    ),
  },
  {
    question: "Are meals and showers available?",
    answer: (
      <p>
        Meals and drinks are available for purchase from on-site vendors, with
        vegan, vegetarian, and gluten-free options. Showers are available, but
        bring your own towel. Emergency Wi-Fi is available at registration;
        general cell service is limited.
      </p>
    ),
  },
  {
    question: "How do I get to Warrior Lodge?",
    answer: (
      <p>
        Fly into Ted Stevens Anchorage International Airport (ANC). Warrior
        Lodge in Sutton is about a 90-minute drive northeast on the Glenn
        Highway. Shuttle service can be added for an additional fee.
      </p>
    ),
  },
  {
    question: "What is the refund and transfer policy?",
    answer: (
      <p>
        Refunds depend on when the request is made: full refunds more than 60
        days before the event, 50% refunds 30–60 days before, and no refunds
        within 30 days. Tickets can be transferred to another attendee at no
        charge. Read the full <Link href="/refunds">refund policy</Link> before
        purchasing.
      </p>
    ),
  },
  {
    question: "What should I bring?",
    answer: (
      <p>
        Pack warm layers, rain protection, sturdy footwear, a yoga mat, water
        bottle, towel, sunscreen, insect repellent, and an eye mask for the long
        daylight hours. If you are staying off site, you will not need camping
        gear.
      </p>
    ),
  },
];

export default function FAQ() {
  return (
    <section id="faq" className="ww-faq" data-conversion-section="faq">
      <header className="ww-faq-header">
        <div>
          <p className="ww-faq-marker">Before you book</p>
          <h2>What you need to know.</h2>
        </div>
        <p>
          The practical details, from what your pass covers to where you can
          sleep. If your question is not here, email us and a real person will
          answer.
        </p>
      </header>
      <div className="ww-faq-list">
        {faqs.map((faq) => (
          <details className="ww-faq-item" key={faq.question}>
            <summary>{faq.question}</summary>
            <div className="ww-faq-answer">{faq.answer}</div>
          </details>
        ))}
      </div>
    </section>
  );
}
