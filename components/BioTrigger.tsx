"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { practitioners } from "@/lib/practitioners";

export default function BioTrigger({ slug }: { slug: string }) {
  const [open, setOpen] = useState(false);
  const person = practitioners.find((p) => p.slug === slug);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  if (!person) return null;

  const initials = person.name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <>
      <button className="bio-trigger-btn" onClick={() => setOpen(true)}>
        {person.name}
      </button>

      {open && (
        <div
          className="bio-overlay"
          role="dialog"
          aria-modal="true"
          aria-label={`${person.name} bio`}
          onClick={() => setOpen(false)}
        >
          <div className="bio-modal" onClick={(e) => e.stopPropagation()}>

            <button className="bio-close" onClick={() => setOpen(false)} aria-label="Close">
              ✕
            </button>

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
              {person.offering && (
                <p className="bio-offering">{person.offering}</p>
              )}
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
                  <a
                    href={person.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bio-link"
                  >
                    Website
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
