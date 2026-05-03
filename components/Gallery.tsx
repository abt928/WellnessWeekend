"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import Reveal from "@/components/Reveal";

const IMAGES = [
  { src: "/images/gallery/2025-08-09_Festival_Wellness_Group-Dancing-Labyrinth.jpg", alt: "Group dancing labyrinth", span: "tall" },
  { src: "/images/gallery/2025-08-09_Festival_Wellness_Woman-Dancing-Colorful-Dress.jpg", alt: "Woman dancing in colorful dress", span: "normal" },
  { src: "/images/gallery/2023-08-06_Festival_Wellness_Crystal-Bowls-Sound-Healing.jpg", alt: "Crystal bowls sound healing", span: "normal" },
  { src: "/images/gallery/2025-08-09_Festival_Wellness_Woman-Dancing-Laughing.jpg", alt: "Woman dancing and laughing", span: "tall" },
  { src: "/images/gallery/2023-08-06_Festival_Wellness_Women-Laying-Grass-Drumming.jpg", alt: "Women laying in grass drumming", span: "normal" },
  { src: "/images/gallery/2024-01-28_Festival_Wellness_Outdoor-Sound-Healing-Setup.png", alt: "Outdoor sound healing setup", span: "wide" },
  { src: "/images/gallery/2025-08-09_Festival_Wellness_Group-Circle-Meditation.jpg", alt: "Group circle meditation", span: "normal" },
  { src: "/images/gallery/2025-08-09_Festival_Wellness_Woman-Harmonium-Gong.jpg", alt: "Woman with harmonium and gong", span: "tall" },
  { src: "/images/gallery/2025-08-10_Festival_Wellness_Woman-Dancing-Barefoot.jpg", alt: "Woman dancing barefoot", span: "normal" },
  { src: "/images/gallery/2023-08-06_Festival_Wellness_Evening-Campfire.jpg", alt: "Evening campfire gathering", span: "wide" },
  { src: "/images/gallery/2024-08-01_Festival_Wellness_Woman-Playing-Drum-Gong.jpg", alt: "Woman playing drum and gong", span: "normal" },
  { src: "/images/gallery/2025-08-09_Festival_Wellness_Group-Circle-Arms-Raised.jpg", alt: "Group circle with arms raised", span: "normal" },
  { src: "/images/gallery/2025-08-09_Festival_Wellness_Woman-Smiling-White-Shirt.jpg", alt: "Woman smiling in white shirt", span: "tall" },
] as const;

export default function Gallery() {
  const [lightbox, setLightbox] = useState<number | null>(null);

  const openLightbox = useCallback((idx: number) => setLightbox(idx), []);
  const closeLightbox = useCallback(() => setLightbox(null), []);

  const goNext = useCallback(() => {
    setLightbox((prev) => (prev !== null ? (prev + 1) % IMAGES.length : null));
  }, []);

  const goPrev = useCallback(() => {
    setLightbox((prev) => (prev !== null ? (prev - 1 + IMAGES.length) % IMAGES.length : null));
  }, []);

  return (
    <>
      <section id="gallery" className="section gallery-section">
        <Reveal>
          <div className="gallery-header">
            <p className="section-label">Moments in Time</p>
            <h2 className="section-title" style={{ fontFamily: "var(--font-display)" }}>
              A Glimpse of the <em>Magic</em>
            </h2>
            <p className="section-desc">
              Real moments captured from previous gatherings: the joy,
              connection, and healing that unfolds under the midnight sun.
            </p>
          </div>
        </Reveal>

        <Reveal>
          <div className="masonry">
            {IMAGES.map((img, idx) => (
              <div
                key={idx}
                className={`masonry-item masonry-${img.span}`}
                style={{ animationDelay: `${idx * 0.06}s` }}
                onClick={() => openLightbox(idx)}
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  style={{ objectFit: "cover" }}
                />
                <div className="masonry-overlay">
                  <span className="masonry-caption">{img.alt}</span>
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* Lightbox */}
      {lightbox !== null && (
        <div className="lightbox" onClick={closeLightbox}>
          <button className="lightbox-close" onClick={closeLightbox} aria-label="Close lightbox">✕</button>
          <button
            className="lightbox-nav lightbox-prev"
            onClick={(e) => { e.stopPropagation(); goPrev(); }}
            aria-label="Previous image"
          >
            ‹
          </button>
          <div className="lightbox-img-wrap" onClick={(e) => e.stopPropagation()}>
            <Image
              src={IMAGES[lightbox].src}
              alt={IMAGES[lightbox].alt}
              fill
              sizes="90vw"
              style={{ objectFit: "contain" }}
              priority
            />
          </div>
          <button
            className="lightbox-nav lightbox-next"
            onClick={(e) => { e.stopPropagation(); goNext(); }}
            aria-label="Next image"
          >
            ›
          </button>
          <div className="lightbox-counter">
            {lightbox + 1} / {IMAGES.length}
          </div>
        </div>
      )}
    </>
  );
}
