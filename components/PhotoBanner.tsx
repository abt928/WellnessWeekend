"use client";
import Image from "next/image";
import { useState, useEffect, useCallback } from "react";

const PHOTOS = [
  { src: "/images/gallery/2025-08-09_Festival_Wellness_Group-Circle-Arms-Raised.jpg",     alt: "Community circle, arms raised" },
  { src: "/images/gallery/2025-08-09_Festival_Wellness_Woman-Dancing-Colorful-Dress.jpg", alt: "Dancer in colorful dress" },
  { src: "/images/gallery/2023-08-06_Festival_Wellness_Crystal-Bowls-Sound-Healing.jpg",  alt: "Crystal bowl sound healing" },
  { src: "/images/gallery/2025-08-09_Festival_Wellness_Woman-Harmonium-Gong.jpg",         alt: "Sound healing with harmonium and gong" },
  { src: "/images/gallery/2025-08-09_Festival_Wellness_Group-Dancing-Labyrinth.jpg",      alt: "Group dancing in the labyrinth" },
  { src: "/images/gallery/2023-08-06_Festival_Wellness_Evening-Campfire.jpg",             alt: "Evening campfire ceremony" },
  { src: "/images/gallery/2025-08-09_Festival_Wellness_Woman-Dancing-Laughing.jpg",       alt: "Joyful dancing" },
  { src: "/images/gallery/2025-08-09_Festival_Wellness_Group-Circle-Meditation.jpg",      alt: "Group meditation circle" },
  { src: "/images/gallery/2024-08-01_Festival_Wellness_Woman-Playing-Drum-Gong.jpg",      alt: "Drum and gong ceremony" },
  { src: "/images/gallery/2023-08-06_Festival_Wellness_Women-Laying-Grass-Drumming.jpg",  alt: "Women drumming on the grass" },
  { src: "/images/gallery/2025-08-09_Festival_Wellness_Woman-Smiling-White-Shirt.jpg",    alt: "Smiling attendee" },
  { src: "/images/gallery/2025-08-10_Festival_Wellness_Woman-Dancing-Barefoot.jpg",       alt: "Barefoot dancing on the land" },
];

const DURATION = 5000;

export default function PhotoBanner() {
  const [idx, setIdx] = useState(0);

  const next = useCallback(() => setIdx((i) => (i + 1) % PHOTOS.length), []);
  const prev = useCallback(() => setIdx((i) => (i - 1 + PHOTOS.length) % PHOTOS.length), []);

  useEffect(() => {
    const id = setInterval(next, DURATION);
    return () => clearInterval(id);
  }, [next]);

  return (
    <div className="photo-banner" aria-label="Photos from past gatherings">
      {/* Slides */}
      {PHOTOS.map((photo, i) => (
        <div key={photo.src} className={`photo-banner-slide${i === idx ? " active" : ""}`}>
          <Image
            src={photo.src}
            alt={photo.alt}
            fill
            priority={i === 0}
            sizes="100vw"
            style={{ objectFit: "cover", objectPosition: "center 30%" }}
          />
        </div>
      ))}

      {/* Overlay gradient */}
      <div className="photo-banner-overlay" aria-hidden="true" />

      {/* Arrows */}
      <button className="photo-banner-arrow photo-banner-arrow-prev" onClick={prev} aria-label="Previous photo">‹</button>
      <button className="photo-banner-arrow photo-banner-arrow-next" onClick={next} aria-label="Next photo">›</button>

      {/* Dot navigation */}
      <div className="photo-banner-dots" role="tablist" aria-label="Photo navigation">
        {PHOTOS.map((_, i) => (
          <button
            key={i}
            role="tab"
            aria-selected={i === idx}
            aria-label={`Photo ${i + 1}`}
            className={`photo-banner-dot${i === idx ? " active" : ""}`}
            onClick={() => setIdx(i)}
          />
        ))}
      </div>

      {/* Caption */}
      <p className="photo-banner-caption">Moments from past gatherings</p>
    </div>
  );
}
