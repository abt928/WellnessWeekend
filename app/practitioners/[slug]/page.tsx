import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { practitioners } from "@/lib/practitioners";
import { scheduleDays } from "@/lib/schedule-data";

export function generateStaticParams() {
  return practitioners.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const person = practitioners.find((p) => p.slug === slug);
  if (!person) return {};
  return {
    title: person.name,
    description: person.bio.slice(0, 160),
  };
}

export default async function PractitionerPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const person = practitioners.find((p) => p.slug === slug);
  if (!person) notFound();

  const initials = person.name
    .split(" ")
    .map((w: string) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  // Sessions this practitioner hosts, in schedule order
  const sessions = scheduleDays.flatMap((day) =>
    day.events
      .filter((e) => e.hosts?.includes(slug))
      .map((e) => ({
        day: day.label,
        time: e.time,
        event: e.event,
        location: e.location,
      }))
  );

  // A few other non-musician practitioners to explore
  const others = practitioners
    .filter((p) => p.slug !== slug && !p.isMusician)
    .slice(0, 4);

  return (
    <div className="practitioner-page">
      <Link href="/#schedule" className="practitioner-back">
        ← Back to Schedule
      </Link>

      <div className="practitioner-hero">
        <div className="practitioner-avatar">
          {person.photo ? (
            <Image src={person.photo} alt={person.name} fill style={{ objectFit: "cover" }} />
          ) : (
            <span className="practitioner-initials">{initials}</span>
          )}
        </div>

        <div className="practitioner-meta">
          <p className="practitioner-role">{person.role}</p>
          <h1 className="practitioner-name">{person.name}</h1>
          {person.offering && (
            <p className="practitioner-offering">{person.offering}</p>
          )}

          <div className="practitioner-links">
            {person.instagram && (
              <a
                href={`https://instagram.com/${person.instagram.replace("@", "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="practitioner-link"
              >
                Instagram →
              </a>
            )}
            {person.website && (
              <a
                href={person.website}
                target="_blank"
                rel="noopener noreferrer"
                className="practitioner-link"
              >
                Website →
              </a>
            )}
            <Link href="/#store" className="practitioner-link practitioner-link-cta">
              Get Tickets →
            </Link>
          </div>
        </div>
      </div>

      <div className="practitioner-bio">
        <p>{person.bio}</p>
      </div>

      {sessions.length > 0 && (
        <section className="practitioner-sessions">
          <h2 className="practitioner-sessions-title">
            Sessions at Wellness Weekend
          </h2>
          <ul className="practitioner-sessions-list">
            {sessions.map((s, i) => (
              <li key={i} className="practitioner-session">
                <span className="practitioner-session-day">{s.day}</span>
                <div className="practitioner-session-main">
                  <span className="practitioner-session-name">{s.event}</span>
                  <span className="practitioner-session-meta">
                    {s.time}
                    {s.location ? ` · ${s.location}` : ""}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      {others.length > 0 && (
        <section className="practitioner-more">
          <h2 className="practitioner-more-title">Explore more practitioners</h2>
          <div className="practitioner-more-row">
            {others.map((o) => (
              <Link
                key={o.slug}
                href={`/practitioners/${o.slug}`}
                className="bio-trigger-btn"
              >
                {o.name}
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
