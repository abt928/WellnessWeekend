"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { practitioners, type Practitioner } from "@/lib/practitioners";
import Reveal from "@/components/Reveal";
import { useFocusTrap } from "@/lib/useFocusTrap";

function BioModal({ person, onClose }: { person: Practitioner; onClose: () => void }) {
  const modalRef = useRef<HTMLDivElement>(null);
  // Trap focus, autofocus, restore focus, and lock body scroll while open
  useFocusTrap(true, modalRef);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const initials = person.name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div
      className="bio-overlay"
      role="dialog"
      aria-modal="true"
      aria-label={`${person.name} bio`}
      onClick={onClose}
    >
      <div className="bio-modal" ref={modalRef} onClick={(e) => e.stopPropagation()}>
        <button className="bio-close" onClick={onClose} aria-label="Close">✕</button>
        <div className="bio-avatar">
          {person.photo ? (
            <Image src={person.photo} alt={person.name} fill style={{ objectFit: "cover" }} />
          ) : (
            <span className="bio-initials">{initials}</span>
          )}
        </div>
        <div className="bio-header">
          <h2 className="bio-name">{person.name}</h2>
          <p className="bio-role">{person.role}</p>
          {person.offering && <p className="bio-offering">{person.offering}</p>}
        </div>
        <p className="bio-text">{person.bio}</p>
        {(person.instagram || person.website) && (
          <div className="bio-links">
            {person.instagram && (
              <a
                href={`https://instagram.com/${person.instagram.replace("@", "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bio-link"
              >
                Instagram
              </a>
            )}
            {person.website && (
              <a href={person.website} target="_blank" rel="noopener noreferrer" className="bio-link">
                Website
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

const PRIORITY_ORDER = [
  "j-brave",
  "white-eagle",
  "gail",
  "avalon-starling",
  "alice",
  "ashleigh",
];

function sortedInstructors(list: Practitioner[]) {
  const instructors = list.filter((p) => !p.isMusician);
  return [
    ...PRIORITY_ORDER.map((slug) => instructors.find((p) => p.slug === slug)).filter(Boolean) as Practitioner[],
    ...instructors.filter((p) => !PRIORITY_ORDER.includes(p.slug)),
  ];
}

export default function Instructors() {
  const [selected, setSelected] = useState<Practitioner | null>(null);
  const ordered = sortedInstructors(practitioners);

  return (
    <section id="instructors" className="section instructors-section">
      <Reveal>
        <p className="section-label">Meet the Healers</p>
        <h2 className="section-title">Practitioners.</h2>
        <p className="section-desc">
          The teachers, artists, and ceremony holders who make Wellness Weekend what it is.
          Click any card to learn more.
        </p>
      </Reveal>

      <Reveal>
        <div className="instructors-grid">
          {ordered.map((p: Practitioner) => {
            const initials = p.name
              .split(" ")
              .map((w) => w[0])
              .join("")
              .slice(0, 2)
              .toUpperCase();

            return (
              <button
                key={p.slug}
                className="instructor-card"
                onClick={() => setSelected(p)}
                aria-label={`Learn more about ${p.name}`}
              >
                <div className="instructor-avatar">
                  {p.photo ? (
                    <Image src={p.photo} alt={p.name} fill style={{ objectFit: "cover" }} />
                  ) : (
                    <span className="instructor-initials">{initials}</span>
                  )}
                </div>
                <div className="instructor-info">
                  <span className="instructor-name">{p.name}</span>
                  <span className="instructor-role">{p.role}</span>
                  <span className="instructor-offering">{p.offering}</span>
                </div>
              </button>
            );
          })}
        </div>
      </Reveal>

      {selected && <BioModal person={selected} onClose={() => setSelected(null)} />}
    </section>
  );
}
