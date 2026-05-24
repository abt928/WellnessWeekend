"use client";
import { useEffect, useState, useCallback } from "react";
import { CloseIcon } from "@/components/Icons";

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  // Lock body scroll when menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  return (
    <nav className={`nav${scrolled ? " scrolled" : ""}${menuOpen ? " menu-open" : ""}`}>
      <div className="nav-logo">
        Wellness Weekend
      </div>

      {/* Desktop nav links */}
      <ul className="nav-links">
        <li><a href="#schedule">Schedule</a></li>
        <li><a href="#portal">Portal</a></li>
        <li><a href="#labyrinth">Labyrinth</a></li>
        <li><a href="#alaska">The Land</a></li>
        <li><a href="#store">Tickets</a></li>
        <li><a href="#faq">FAQ</a></li>
      </ul>

      {/* Desktop CTA — surfaces only after first scroll past hero */}
      {scrolled && (
        <a href="#store" className="nav-cta-link">
          <button className="nav-cta">Reserve Your Spot</button>
        </a>
      )}

      {/* Mobile hamburger button */}
      <button
        className="nav-hamburger"
        onClick={() => setMenuOpen((prev) => !prev)}
        aria-label={menuOpen ? "Close menu" : "Open menu"}
        aria-expanded={menuOpen}
      >
        <span className="hamburger-line" />
        <span className="hamburger-line" />
        <span className="hamburger-line" />
      </button>

      {/* Mobile slide-out menu */}
      {menuOpen && (
        <div className="mobile-menu-overlay" onClick={closeMenu}>
          <div className="mobile-menu" onClick={(e) => e.stopPropagation()}>
            <div className="mobile-menu-header">
              <div className="nav-logo">
                Wellness Weekend
              </div>
              <button className="mobile-menu-close" onClick={closeMenu} aria-label="Close menu">
                <CloseIcon size={20} />
              </button>
            </div>
            <ul className="mobile-menu-links">
              <li><a href="#schedule" onClick={closeMenu}>Schedule</a></li>
              <li><a href="#portal" onClick={closeMenu}>Portal</a></li>
              <li><a href="#labyrinth" onClick={closeMenu}>Labyrinth</a></li>
              <li><a href="#store" onClick={closeMenu}>Tickets</a></li>
              <li><a href="#gallery" onClick={closeMenu}>Gallery</a></li>
              <li><a href="#alaska" onClick={closeMenu}>The Land</a></li>
              <li><a href="#faq" onClick={closeMenu}>FAQ</a></li>
              <li><a href="#get-involved" onClick={closeMenu}>Get Involved</a></li>
            </ul>
            <a href="#store" className="mobile-menu-cta" onClick={closeMenu}>
              Reserve Your Spot
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
