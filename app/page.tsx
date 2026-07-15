import Image from "next/image";
import Navigation from "@/components/Navigation";
import CountdownTimer from "@/components/CountdownTimer";
import ConversionTracker from "@/components/ConversionTracker";
import FAQ from "@/components/FAQ";
import FloatingActions from "@/components/FloatingActions";
import NewsletterForm from "@/components/NewsletterForm";
import Store from "@/components/Store";
import { scheduleDays } from "@/lib/schedule-data";
import heroPhoto from "../public/images/gallery/2025-08-09_Festival_Wellness_Woman-Harmonium-Gong.jpg";
import circlePhoto from "../public/images/gallery/2025-08-09_Festival_Wellness_Group-Circle-Arms-Raised.jpg";
import joyPhoto from "../public/images/gallery/2025-08-09_Festival_Wellness_Woman-Dancing-Laughing.jpg";
import colorPhoto from "../public/images/gallery/2025-08-09_Festival_Wellness_Woman-Dancing-Colorful-Dress.jpg";
import soundPhoto from "../public/images/gallery/2023-08-06_Festival_Wellness_Crystal-Bowls-Sound-Healing.jpg";
import campfirePhoto from "../public/images/gallery/2023-08-06_Festival_Wellness_Evening-Campfire.jpg";
import paddleboardPhoto from "../public/images/client-2026/lakeside-paddleboard-practice.webp";
import jBraveFeature from "../public/images/client-2026/j-brave-feature.webp";
import whiteEagleFeature from "../public/images/client-2026/white-eagle-medicine-woman-feature.webp";
import messageFromBeesFeature from "../public/images/client-2026/message-from-the-bees-feature.webp";
import styles from "./home.module.css";

const experiencePhotos = [
  {
    src: joyPhoto,
    alt: "A Wellness Weekend guest dancing with both arms raised among the birch trees",
    title: "Move freely",
    detail: "Yoga, ecstatic dance, aerial silks, and lakeside movement",
    className: styles.photoTall,
  },
  {
    src: soundPhoto,
    alt: "Crystal singing bowls arranged on the grass for an outdoor sound bath",
    title: "Drop deeper",
    detail: "Sound journeys, meditation, cacao, and earth-based ceremony",
    className: styles.photoWide,
  },
  {
    src: circlePhoto,
    alt: "A real Wellness Weekend circle raising their arms together outdoors",
    title: "Find your people",
    detail: "An intentionally small gathering capped at 200 guests",
    className: styles.photoWide,
  },
];

const featuredProgram = [
  {
    src: jBraveFeature,
    alt: "",
    name: "J Brave",
    role: "Keys artist + sound alchemist",
    detail: "Keys to Kreation · Friday / Ecstatic Dance · Saturday / Live set · Sunday",
  },
  {
    src: whiteEagleFeature,
    alt: "",
    name: "White Eagle Medicine Woman",
    role: "Traditional ceremony leader",
    detail: "Lionsgate drumming ceremony · Saturday at noon",
  },
  {
    src: messageFromBeesFeature,
    alt: "",
    name: "Ecstatic Dance + Message from the Bees",
    role: "Two movement-led gatherings",
    detail: "Friday evening + Sunday at 11:11 AM",
  },
];

const schedulePicks = [
  ["Opening Ceremony", "Paddleboard Yoga", "Sacred Heart Activation", "Ecstatic Dance"],
  ["Lionsgate Activation + Floating Sound Bath", "Ayni Despacho Ceremony", "Authentic Relating Practice", "Cacao Ceremony"],
  ["Sound Journey", "Intro Aerial for Kids", "Kuf Knotz + Christine Elise", "Closing Ceremony"],
];

export default function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: "Wellness Weekend · 4th Annual Healing Arts Festival",
    description:
      "A three-day healing arts gathering with sound, movement, ceremony, and lakeside restoration under Alaska's midnight sun.",
    startDate: "2026-08-07",
    endDate: "2026-08-09",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    location: {
      "@type": "Place",
      name: "Warrior Lodge",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Sutton",
        addressRegion: "AK",
        addressCountry: "US",
      },
    },
    image: [
      "https://www.wellnessweekendak.com/images/gallery/2025-08-09_Festival_Wellness_Group-Circle-Arms-Raised.jpg",
    ],
    organizer: {
      "@type": "Organization",
      name: "Wellness Weekend",
      url: "https://www.wellnessweekendak.com",
    },
    offers: {
      "@type": "AggregateOffer",
      url: "https://www.wellnessweekendak.com/#store",
      availability: "https://schema.org/InStock",
      priceCurrency: "USD",
      lowPrice: "33",
      highPrice: "123",
      offerCount: 3,
    },
    maximumAttendeeCapacity: 200,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <a className="skip-link" href="#main">
        Skip to main content
      </a>
      <Navigation />

      <main id="main" className={styles.home}>
        <section
          className={styles.hero}
          aria-labelledby="hero-title"
          data-conversion-section="hero"
        >
          <Image
            src={heroPhoto}
            alt="A Wellness Weekend musician in ceremony with harmonium, singing bowl, and gong"
            fill
            priority
            sizes="100vw"
            className={styles.heroImage}
          />
          <div className={styles.heroVeil} />
          <div className={styles.heroContent}>
            <p className={styles.heroDate}>August 7–9, 2026 · Sutton, Alaska</p>
            <h1 id="hero-title" className={styles.heroTitle}>
              Three days to feel <span>fully alive.</span>
            </h1>
            <p className={styles.heroCopy}>
              Healing arts, ecstatic movement, live music, and lakeside ceremony
              under Alaska&apos;s midnight sun.
            </p>
            <div className={styles.heroActions}>
              <a
                href="#store"
                className={styles.primaryButton}
                data-cta="hero_choose_pass"
              >
                Choose your pass
              </a>
              <a
                href="#experience"
                className={styles.textButton}
                data-cta="hero_see_experience"
              >
                See what&apos;s included
              </a>
            </div>
            <div className={styles.heroProof} aria-label="Event highlights">
              <span>4th annual</span>
              <span>40+ sessions</span>
              <span>200-person cap</span>
            </div>
            <CountdownTimer />
          </div>
        </section>

        <section
          id="experience"
          className={styles.experience}
          data-conversion-section="experience"
        >
          <div className={styles.sectionIntro}>
            <p className={styles.sectionMarker}>The weekend</p>
            <h2>Come for the practices. Stay for the feeling.</h2>
            <p>
              Move before breakfast. Learn by the lake. Sit in ceremony as the
              sky stays bright late into the evening. Pick your own pace, from
              full-volume dance to a quiet walk through the labyrinth garden.
            </p>
          </div>

          <div className={styles.photoMosaic}>
            {experiencePhotos.map((photo) => (
              <figure className={photo.className} key={photo.title}>
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  sizes="(max-width: 760px) 100vw, 50vw"
                />
                <figcaption>
                  <strong>{photo.title}</strong>
                  <span>{photo.detail}</span>
                </figcaption>
              </figure>
            ))}
          </div>

          <div className={styles.inclusionStrip}>
            <p>
              <strong>Your pass includes the main three-day program.</strong>
              Select small-group sessions, bodywork, meals, and lodging are
              booked separately.
            </p>
            <a href="#store" data-cta="experience_choose_pass">
              Compare passes
            </a>
          </div>
        </section>

        <div className={styles.storeFrame} data-conversion-section="store">
          <Store />
        </div>

        <section
          id="schedule"
          className={styles.schedule}
          data-conversion-section="schedule"
        >
          <div className={styles.sectionIntroDark}>
            <p className={styles.sectionMarker}>Three days, your pace</p>
            <h2>A full weekend without the frantic festival feeling.</h2>
            <p>
              These are a few anchors. The full program includes more than 40
              sessions across the main stage, lake, aerial space, and labyrinth
              garden.
            </p>
          </div>

          <div className={styles.dayList}>
            {scheduleDays.map((day, dayIndex) => {
              const highlights = schedulePicks[dayIndex]
                .map((name) => day.events.find((event) => event.event === name))
                .filter((event) => event !== undefined);

              return (
                <article className={styles.day} key={day.label}>
                  <header>
                    <p>{day.label}</p>
                    <h3>{day.headingText}</h3>
                    <span>{day.theme}</span>
                  </header>
                  <ol>
                    {highlights.map((event) => (
                      <li key={`${event.time}-${event.event}`}>
                        <time>{event.time}</time>
                        <div>
                          <strong>{event.event}</strong>
                          {event.location && <span>{event.location}</span>}
                        </div>
                      </li>
                    ))}
                  </ol>
                </article>
              );
            })}
          </div>

          <div className={styles.scheduleActions}>
            <a href="/schedule/print" data-cta="schedule_view_full">
              View the full schedule
            </a>
            <a href="#store" data-cta="schedule_choose_pass">
              Choose a pass
            </a>
          </div>

          <div className={styles.featuredLineup} aria-labelledby="featured-lineup-title">
            <div className={styles.featuredLineupHeader}>
              <div>
                <p className={styles.sectionMarker}>Featured in 2026</p>
                <h3 id="featured-lineup-title">People and practices worth circling.</h3>
              </div>
              <p>
                Visiting artists and ceremony leaders shape a program that moves
                from quiet listening to full-room release.
              </p>
            </div>

            <div className={styles.lineupRail}>
              {featuredProgram.map((feature) => (
                <figure className={styles.lineupCard} key={feature.name}>
                  <div className={styles.lineupArtwork}>
                    <Image
                      src={feature.src}
                      alt={feature.alt}
                      fill
                      placeholder="blur"
                      sizes="(max-width: 760px) 78vw, (max-width: 1100px) 45vw, 24rem"
                    />
                  </div>
                  <figcaption>
                    <strong>{feature.name}</strong>
                    <span>{feature.role}</span>
                    <small>{feature.detail}</small>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        <section className={styles.realWeekend} data-conversion-section="proof">
          <div className={styles.realWeekendCopy}>
            <p className={styles.sectionMarker}>This is what it looks like</p>
            <h2>The weekend, as it really happens.</h2>
            <p>
              Bare feet on cold grass. A gong carrying through the birch trees.
              Breakfast with someone who was a stranger the day before. The
              photographs here are all from Wellness Weekend gatherings.
            </p>
          </div>
          <div className={styles.realWeekendPhotos}>
            <figure>
              <Image
                src={colorPhoto}
                alt="A ceremony leader in a colorful dress moving outdoors at Wellness Weekend"
                fill
                sizes="(max-width: 760px) 80vw, 34vw"
              />
            </figure>
            <figure>
              <Image
                src={circlePhoto}
                alt="Wellness Weekend guests moving together in a circle"
                fill
                sizes="(max-width: 760px) 80vw, 34vw"
              />
            </figure>
            <figure>
              <Image
                src={paddleboardPhoto}
                alt="A person kneeling in prayer on a paddleboard on a calm Alaska lake"
                fill
                sizes="(max-width: 760px) 80vw, 34vw"
              />
            </figure>
          </div>
        </section>

        <section
          id="visit"
          className={styles.visit}
          data-conversion-section="visit"
        >
          <div className={styles.visitPhoto}>
            <Image
              src={campfirePhoto}
              alt="The evening campfire at a previous Wellness Weekend gathering in Sutton"
              fill
              sizes="(max-width: 900px) 100vw, 48vw"
            />
          </div>
          <div className={styles.visitContent}>
            <p className={styles.sectionMarker}>Warrior Lodge · Sutton</p>
            <h2>Close enough to reach. Far enough to exhale.</h2>
            <p>
              Warrior Lodge is about 90 minutes northeast of Anchorage along the
              Glenn Highway. August days are long, nights are cool, and the lake
              is only steps from the gathering spaces.
            </p>
            <dl className={styles.visitFacts}>
              <div>
                <dt>Getting here</dt>
                <dd>Fly into ANC, then drive or add a shuttle to your trip.</dd>
              </div>
              <div>
                <dt>Staying over</dt>
                <dd>On-site camping is sold out. Limited shared cabin beds remain.</dd>
              </div>
              <div>
                <dt>Food and comfort</dt>
                <dd>Meals are sold on site. Showers and emergency Wi-Fi are available.</dd>
              </div>
            </dl>
            <a href="#store" className={styles.visitLink} data-cta="visit_view_lodging">
              See passes and cabin options
            </a>
            <p className={styles.landAcknowledgment}>
              We gather on the unceded ancestral homeland of the Dena&apos;ina
              Athabascan people, whose relationship with this valley continues
              today. We are grateful to be guests on this land.
            </p>
          </div>
        </section>

        <FAQ />

        <section className={styles.finalCta} data-conversion-section="final_cta">
          <div>
            <p className={styles.sectionMarker}>August 7–9 · Sutton, Alaska</p>
            <h2>There is still room in the circle.</h2>
            <p>
              Pick a day, stay for the weekend, or reserve one of the remaining
              cabin options.
            </p>
            <a href="#store" className={styles.primaryButton} data-cta="final_choose_pass">
              Choose your pass
            </a>
          </div>
          <div className={styles.emailCapture}>
            <h3>Not ready to choose?</h3>
            <p>Get schedule notes and final lodging updates by email.</p>
            <NewsletterForm />
          </div>
        </section>
      </main>

      <footer className={styles.footer}>
        <div className={styles.footerBrand}>
          <strong>Wellness Weekend</strong>
          <span>August 7–9, 2026 · Sutton, Alaska</span>
        </div>
        <nav aria-label="Footer navigation" className={styles.footerLinks}>
          <a href="/vendors">Vendors</a>
          <a href="/affiliates">Affiliates</a>
          <a href="/join">Join the Circle</a>
          <a href="mailto:support@thesoundspace.us">Contact</a>
          <a href="/privacy">Privacy</a>
          <a href="/terms">Terms</a>
          <a href="/refunds">Refunds</a>
        </nav>
        <div className={styles.footerSocials}>
          <a
            href="https://www.instagram.com/wellnessweekendak"
            target="_blank"
            rel="noopener noreferrer"
          >
            Instagram
          </a>
          <a
            href="https://www.facebook.com/wellnessweekendak"
            target="_blank"
            rel="noopener noreferrer"
          >
            Facebook
          </a>
        </div>
        <p>© {new Date().getFullYear()} Wellness Weekend</p>
      </footer>

      <FloatingActions />
      <ConversionTracker />
    </>
  );
}
