"use client";
import Image from "next/image";
import { practitioners } from "@/lib/practitioners";

const featured = practitioners.filter((p) => !p.isMusician);

export default function InstructorSlideshow() {
  const doubled = [...featured, ...featured];

  return (
    <section className="instructor-reel section">
      <p className="section-label">The Healers</p>
      <h2 className="section-title">Meet Your Guides.</h2>
      <p className="section-desc" style={{ marginBottom: "2.5rem" }}>
        Our practitioners bring decades of experience in movement, sound, ceremony, and embodied healing.
      </p>
      <div className="reel-track-wrapper">
        <div className="reel-track">
          {doubled.map((p, i) => (
            <div key={`${p.slug}-${i}`} className="reel-card">
              <div className="reel-card-photo">
                {p.photo ? (
                  <Image
                    src={p.photo}
                    alt={p.name}
                    fill
                    style={{ objectFit: "cover" }}
                    sizes="200px"
                  />
                ) : (
                  <div className="reel-card-initials">
                    {p.name.split(" ").map((w) => w[0]).join("").slice(0, 2)}
                  </div>
                )}
              </div>
              <div className="reel-card-body">
                <strong className="reel-card-name">{p.name}</strong>
                <span className="reel-card-role">{p.role}</span>
                <p className="reel-card-bio">{p.bio.slice(0, 160)}{p.bio.length > 160 ? "…" : ""}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
