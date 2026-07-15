"use client";
import { useEffect, useState, useCallback, useRef } from "react";
import { CloseIcon } from "@/components/Icons";
import { useFocusTrap } from "@/lib/useFocusTrap";

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  // Trap focus and lock body scroll while the drawer is open
  useFocusTrap(menuOpen, menuRef);

  // Escape closes the drawer
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") closeMenu(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen, closeMenu]);

  return (
    <nav className={`nav${scrolled ? " scrolled" : ""}${menuOpen ? " menu-open" : ""}`}>
      <div className="nav-logo">
        Wellness Weekend
      </div>

      {/* Desktop nav links */}
      <ul className="nav-links">
        <li><a href="#schedule">Schedule</a></li>
        <li><a href="#gallery">Gallery</a></li>
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
        aria-controls="mobile-nav-menu"
      >
        <span className="hamburger-line" />
        <span className="hamburger-line" />
        <span className="hamburger-line" />
      </button>

      {/* Mobile slide-out menu */}
      {menuOpen && (
        <div className="mobile-menu-overlay" onClick={closeMenu}>
          <div
            id="mobile-nav-menu"
            className="mobile-menu"
            onClick={(e) => e.stopPropagation()}
            ref={menuRef}
            role="dialog"
            aria-modal="true"
            aria-label="Site navigation"
          >
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
