"use client";

import Image from "next/image";
import Reveal from "@/components/Reveal";

// Filter out logos/posters and select only the best event/portrait shots
const IMAGES = [
  { src: "/images/gallery/2025-08-09_Festival_Wellness_Group-Dancing-Labyrinth.jpg", alt: "Group dancing labyrinth" },
  { src: "/images/gallery/2025-08-09_Festival_Wellness_Woman-Dancing-Colorful-Dress.jpg", alt: "Woman dancing colorful dress" },
  { src: "/images/gallery/2023-08-06_Festival_Wellness_Crystal-Bowls-Sound-Healing.jpg", alt: "Crystal bowls sound healing" },
  { src: "/images/gallery/2025-08-09_Festival_Wellness_Woman-Dancing-Laughing.jpg", alt: "Woman dancing laughing" },
  { src: "/images/gallery/2023-08-06_Festival_Wellness_Women-Laying-Grass-Drumming.jpg", alt: "Women laying grass drumming" },
  { src: "/images/gallery/2024-01-28_Festival_Wellness_Outdoor-Sound-Healing-Setup.png", alt: "Outdoor sound healing setup" },
  { src: "/images/gallery/2025-08-09_Festival_Wellness_Group-Circle-Meditation.jpg", alt: "Group circle meditation" },
  { src: "/images/gallery/2025-08-09_Festival_Wellness_Woman-Harmonium-Gong.jpg", alt: "Woman harmonium gong" },
  { src: "/images/gallery/2025-08-10_Festival_Wellness_Woman-Dancing-Barefoot.jpg", alt: "Woman dancing barefoot" },
  { src: "/images/gallery/2023-08-06_Festival_Wellness_Evening-Campfire.jpg", alt: "Evening campfire" },
  { src: "/images/gallery/2024-08-01_Festival_Wellness_Woman-Playing-Drum-Gong.jpg", alt: "Woman playing drum gong" },
  { src: "/images/gallery/2025-08-09_Festival_Wellness_Group-Circle-Arms-Raised.jpg", alt: "Group circle arms raised" },
  { src: "/images/gallery/2025-08-09_Festival_Wellness_Woman-Smiling-White-Shirt.jpg", alt: "Woman smiling white shirt" },
];

export default function Gallery() {
  return (
    <section id="gallery" className="section gallery" style={{ padding: "8rem 2rem", background: "var(--bg)" }}>
      <Reveal>
        <div style={{ textAlign: "center", marginBottom: "4rem" }}>
          <p className="section-label">Moments in Time</p>
          <h2 className="section-title" style={{ fontFamily: "var(--font-display)" }}>
            A Glimpse of the <em>Magic</em>
          </h2>
          <p className="section-desc" style={{ maxWidth: "600px", margin: "0 auto" }}>
            Real moments captured from previous gatherings. Witness the joy, 
            connection, and healing that unfolds under the midnight sun.
          </p>
        </div>
      </Reveal>

      <Reveal>
        <div className="gallery-grid" style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: "1.5rem",
          maxWidth: "1200px",
          margin: "0 auto"
        }}>
          {IMAGES.map((img, idx) => (
            <div key={idx} className="gallery-item" style={{
              position: "relative",
              aspectRatio: idx % 3 === 0 ? "1 / 1" : "3 / 4",
              borderRadius: "12px",
              overflow: "hidden",
              boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
              transition: "transform 0.4s ease, box-shadow 0.4s ease",
              cursor: "pointer"
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = "scale(1.02) translateY(-5px)";
              e.currentTarget.style.boxShadow = "0 15px 40px rgba(0,0,0,0.2)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = "scale(1) translateY(0)";
              e.currentTarget.style.boxShadow = "0 10px 30px rgba(0,0,0,0.1)";
            }}>
              <Image 
                src={img.src} 
                alt={img.alt} 
                fill 
                style={{ objectFit: "cover" }} 
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              <div style={{
                position: "absolute",
                inset: 0,
                background: "linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 40%)",
                opacity: 0,
                transition: "opacity 0.3s ease"
              }} 
              onMouseOver={(e) => e.currentTarget.style.opacity = "1"}
              onMouseOut={(e) => e.currentTarget.style.opacity = "0"}>
                <div style={{
                  position: "absolute",
                  bottom: "1rem",
                  left: "1rem",
                  color: "var(--cream)",
                  fontFamily: "var(--font-accent)",
                  fontSize: "1.1rem",
                  letterSpacing: "0.05em"
                }}>
                  {img.alt}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
