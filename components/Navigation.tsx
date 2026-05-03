"use client";
import { useEffect, useState } from "react";

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <nav className={`nav${scrolled ? " scrolled" : ""}`}>
      <div className="nav-logo" style={{ fontFamily: "var(--font-display)" }}>
        Wellness Weekend
      </div>
      <ul className="nav-links">
        <li><a href="#about">About</a></li>
        <li><a href="#experience">Experience</a></li>
        <li><a href="#alaska">The Land</a></li>
        <li><a href="#schedule">Schedule</a></li>
        <li><a href="#store">Store</a></li>
        <li><a href="#faq">FAQ</a></li>
      </ul>
      <a href="#store"><button className="nav-cta">Reserve Your Spot</button></a>
    </nav>
  );
}
