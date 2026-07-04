import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { practitioners } from "@/lib/practitioners";

export function generateStaticParams() {
  return practitioners.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const person = practitioners.find((p) => p.slug === slug);
  if (!person) return {};
  return {
    title: `${person.name} · Wellness Weekend`,
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
            <a href="/#store" className="practitioner-link practitioner-link-cta">
              Get Tickets →
            </a>
          </div>
        </div>
      </div>

      <div className="practitioner-bio">
        <p>{person.bio}</p>
      </div>
    </div>
  );
}
