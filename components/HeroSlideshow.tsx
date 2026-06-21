"use client";
import Image from "next/image";
import { useState, useEffect } from "react";

const PHOTOS = [
  { src: "/images/gallery/2023-08-06_Festival_Wellness_Evening-Campfire.jpg",         alt: "Evening campfire ceremony" },
  { src: "/images/gallery/2025-08-09_Festival_Wellness_Group-Circle-Arms-Raised.jpg", alt: "Community gathering, arms raised" },
  { src: "/images/gallery/2025-08-09_Festival_Wellness_Woman-Dancing-Colorful-Dress.jpg", alt: "Dancer in colorful dress" },
  { src: "/images/gallery/2025-08-09_Festival_Wellness_Group-Dancing-Labyrinth.jpg",  alt: "Group dancing in the labyrinth" },
  { src: "/images/gallery/2025-08-09_Festival_Wellness_Woman-Harmonium-Gong.jpg",     alt: "Sound healing with harmonium and gong" },
  { src: "/images/gallery/2025-08-09_Festival_Wellness_Woman-Dancing-Laughing.jpg",   alt: "Joyful dancing" },
  { src: "/images/gallery/2024-08-01_Festival_Wellness_Woman-Playing-Drum-Gong.jpg",  alt: "Drum and gong ceremony" },
  { src: "/images/gallery/2025-08-10_Festival_Wellness_Woman-Dancing-Barefoot.jpg",   alt: "Barefoot dancing on the land" },
];

const DURATION = 5500; // ms per slide

export default function HeroSlideshow() {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setIdx((i) => (i + 1) % PHOTOS.length), DURATION);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="hero-slideshow" aria-hidden="true">
      {PHOTOS.map((photo, i) => (
        <div key={photo.src} className={`hero-slide${i === idx ? " active" : ""}`}>
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
    </div>
  );
}
