"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import Image from "next/image";
import Reveal from "@/components/Reveal";
import { CloseIcon } from "@/components/Icons";
import { useFocusTrap } from "@/lib/useFocusTrap";

const IMAGES = [
  { src: "/images/gallery/2025-08-09_Festival_Wellness_Group-Dancing-Labyrinth.jpg", alt: "Group dancing labyrinth", w: 4000, h: 6000 },
  { src: "/images/gallery/2025-08-09_Festival_Wellness_Woman-Dancing-Colorful-Dress.jpg", alt: "Woman dancing in colorful dress", w: 4000, h: 6000 },
  { src: "/images/gallery/2023-08-06_Festival_Wellness_Crystal-Bowls-Sound-Healing.jpg", alt: "Crystal bowls sound healing", w: 4032, h: 3024 },
  { src: "/images/gallery/2025-08-09_Festival_Wellness_Woman-Dancing-Laughing.jpg", alt: "Woman dancing and laughing", w: 4000, h: 6000 },
  { src: "/images/gallery/2023-08-06_Festival_Wellness_Women-Laying-Grass-Drumming.jpg", alt: "Women laying in grass drumming", w: 1500, h: 1000 },
  { src: "/images/gallery/2024-01-28_Festival_Wellness_Outdoor-Sound-Healing-Setup.jpg", alt: "Outdoor sound healing setup", w: 1200, h: 686 },
  { src: "/images/gallery/2025-08-09_Festival_Wellness_Group-Circle-Meditation.jpg", alt: "Group circle meditation", w: 4000, h: 6000 },
  { src: "/images/gallery/2025-08-09_Festival_Wellness_Woman-Harmonium-Gong.jpg", alt: "Woman with harmonium and gong", w: 4000, h: 6000 },
  { src: "/images/gallery/2025-08-10_Festival_Wellness_Woman-Dancing-Barefoot.jpg", alt: "Woman dancing barefoot", w: 4000, h: 6000 },
  { src: "/images/gallery/2023-08-06_Festival_Wellness_Evening-Campfire.jpg", alt: "Evening campfire gathering", w: 4032, h: 3024 },
  { src: "/images/gallery/2024-08-01_Festival_Wellness_Woman-Playing-Drum-Gong.jpg", alt: "Woman playing drum and gong", w: 3024, h: 4032 },
  { src: "/images/gallery/2025-08-09_Festival_Wellness_Group-Circle-Arms-Raised.jpg", alt: "Group circle with arms raised", w: 4000, h: 6000 },
  { src: "/images/gallery/2025-08-09_Festival_Wellness_Woman-Smiling-White-Shirt.jpg", alt: "Woman smiling in white shirt", w: 4000, h: 6000 },
] as const;

export default function Gallery() {
  const [lightbox, setLightbox] = useState<number | null>(null);
  const lightboxRef = useRef<HTMLDivElement>(null);

  // Trap focus, autofocus, restore focus, and lock body scroll while the lightbox is open
  useFocusTrap(lightbox !== null, lightboxRef);

  const openLightbox = useCallback((idx: number) => setLightbox(idx), []);
  const closeLightbox = useCallback(() => setLightbox(null), []);

  const goNext = useCallback(() => {
    setLightbox((prev) => (prev !== null ? (prev + 1) % IMAGES.length : null));
  }, []);

  const goPrev = useCallback(() => {
    setLightbox((prev) => (prev !== null ? (prev - 1 + IMAGES.length) % IMAGES.length : null));
  }, []);

  // Keyboard navigation while lightbox is open
  useEffect(() => {
    if (lightbox === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      else if (e.key === "ArrowRight") goNext();
      else if (e.key === "ArrowLeft") goPrev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox, closeLightbox, goNext, goPrev]);

  return (
    <>
      <section id="gallery" className="section gallery-section">
        <Reveal>
          <div className="gallery-header">
            <p className="section-label">Moments in Time</p>
            <h2 className="section-title">
              Moments.
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
                className="masonry-item"
                style={{ animationDelay: `${idx * 0.06}s` }}
                role="button"
                tabIndex={0}
                aria-label={`Open image: ${img.alt}`}
                onClick={() => openLightbox(idx)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    openLightbox(idx);
                  }
                }}
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  width={img.w}
                  height={img.h}
                  sizes="(max-width: 768px) 50vw, (max-width: 1024px) 50vw, 33vw"
                  quality={75}
                  loading="lazy"
                  className="masonry-img"
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
        <div
          className="lightbox"
          ref={lightboxRef}
          onClick={closeLightbox}
          role="dialog"
          aria-modal="true"
          aria-label="Image gallery"
        >
          <button className="lightbox-close" onClick={closeLightbox} aria-label="Close lightbox"><CloseIcon size={20} /></button>
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
