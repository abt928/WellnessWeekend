"use client";
import { useEffect, useState, useCallback } from "react";
import { CloseIcon } from "@/components/Icons";

const NAV_LINKS = [
  { label: "Schedule",       href: "/#schedule" },
  { label: "Sacred Spaces",  href: "/#sacred-spaces" },
  { label: "Ecstatic Dance", href: "/ecstatic-dance" },
  { label: "Travel",         href: "/travel" },
  { label: "Archive",        href: "/archive" },
];

const MOBILE_EXTRA = [
  { label: "Book Your Session", href: "/#build" },
  { label: "FAQ",               href: "/#faq" },
  { label: "Get Involved",      href: "/#get-involved" },
  { label: "Share Your Story",  href: "/archive#share" },
];

export default function Navigation() {
  const [scrolled, setScrolled]   = useState(false);
  const [menuOpen, setMenuOpen]   = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const close = useCallback(() => setMenuOpen(false), []);

  return (
    <nav className={`nav${scrolled ? " scrolled" : ""}${menuOpen ? " menu-open" : ""}`}>

      {/* Logo */}
      <a href="/" className="nav-logo" style={{ textDecoration: "none" }}>
        Wellness Weekend
      </a>

      {/* Desktop links */}
      <ul className="nav-links">
        {NAV_LINKS.map((l) => (
          <li key={l.label}><a href={l.href}>{l.label}</a></li>
        ))}
      </ul>

      {/* Desktop CTA */}
      <a href="/#store" className="nav-cta-link" style={{ opacity: scrolled ? 1 : 0, pointerEvents: scrolled ? "auto" : "none", transition: "opacity 0.2s" }}>
        <button className="nav-cta">Get Tickets</button>
      </a>

      {/* Hamburger */}
      <button
        className="nav-hamburger"
        onClick={() => setMenuOpen((p) => !p)}
        aria-label={menuOpen ? "Close menu" : "Open menu"}
        aria-expanded={menuOpen}
      >
        <span className="hamburger-line" />
        <span className="hamburger-line" />
        <span className="hamburger-line" />
      </button>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="mobile-menu-overlay" onClick={close}>
          <div className="mobile-menu" onClick={(e) => e.stopPropagation()}>
            <div className="mobile-menu-header">
              <div className="nav-logo">Wellness Weekend</div>
              <button className="mobile-menu-close" onClick={close} aria-label="Close menu">
                <CloseIcon size={20} />
              </button>
            </div>

            <ul className="mobile-menu-links">
              {NAV_LINKS.map((l) => (
                <li key={l.label}><a href={l.href} onClick={close}>{l.label}</a></li>
              ))}
              <li style={{ borderTop: "1px solid rgba(51,53,51,0.08)", paddingTop: "0.5rem", marginTop: "0.25rem" }} />
              {MOBILE_EXTRA.map((l) => (
                <li key={l.label} style={{ opacity: 0.65 }}>
                  <a href={l.href} onClick={close} style={{ fontSize: "0.9rem" }}>{l.label}</a>
                </li>
              ))}
            </ul>

            {/* Booking shortcuts */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem", padding: "0.75rem 1.5rem", borderTop: "1px solid rgba(51,53,51,0.08)" }}>
              <a href="/book" className="mobile-menu-book-btn primary" onClick={close}>
                Book Add-Ons →
              </a>
              <a href="/aerial" className="mobile-menu-book-btn secondary" onClick={close}>
                Book a Silk Class
              </a>
            </div>

            <a href="/#store" className="mobile-menu-cta" onClick={close}>
              Get Tickets →
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
