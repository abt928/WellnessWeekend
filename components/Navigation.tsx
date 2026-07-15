"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { CloseIcon } from "@/components/Icons";
import { useFocusTrap } from "@/lib/useFocusTrap";

const links = [
  { href: "#experience", label: "Experience" },
  { href: "#store", label: "Passes" },
  { href: "#schedule", label: "Schedule" },
  { href: "#visit", label: "Plan your trip" },
  { href: "#faq", label: "FAQ" },
];

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 28);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  const closeMenu = useCallback(() => setMenuOpen(false), []);
  useFocusTrap(menuOpen, menuRef);

  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeMenu();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [closeMenu, menuOpen]);

  return (
    <nav
      className={`ww-nav${scrolled ? " scrolled" : ""}${menuOpen ? " menu-open" : ""}`}
      aria-label="Primary navigation"
    >
      <a className="ww-nav-brand" href="#main" aria-label="Wellness Weekend home">
        <span>Wellness</span>
        <span>Weekend</span>
      </a>

      <ul className="ww-nav-links">
        {links.map((link) => (
          <li key={link.href}>
            <a href={link.href}>{link.label}</a>
          </li>
        ))}
      </ul>

      <a className="ww-nav-cta" href="#store" data-cta="nav_choose_pass">
        Choose a pass
      </a>

      <button
        type="button"
        className="ww-nav-menu-button"
        onClick={() => setMenuOpen((open) => !open)}
        aria-label={menuOpen ? "Close navigation" : "Open navigation"}
        aria-expanded={menuOpen}
        aria-controls="ww-mobile-menu"
      >
        <span />
        <span />
      </button>

      {menuOpen && (
        <div className="ww-mobile-menu-overlay" onClick={closeMenu}>
          <div
            id="ww-mobile-menu"
            className="ww-mobile-menu"
            ref={menuRef}
            role="dialog"
            aria-modal="true"
            aria-label="Site navigation"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="ww-mobile-menu-header">
              <span className="ww-nav-brand" aria-hidden="true">
                <span>Wellness</span>
                <span>Weekend</span>
              </span>
              <button
                type="button"
                className="ww-mobile-menu-close"
                onClick={closeMenu}
                aria-label="Close navigation"
              >
                <CloseIcon size={20} />
              </button>
            </div>
            <ul className="ww-mobile-menu-links">
              {links.map((link) => (
                <li key={link.href}>
                  <a href={link.href} onClick={closeMenu}>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
            <a
              className="ww-mobile-menu-cta"
              href="#store"
              onClick={closeMenu}
              data-cta="menu_choose_pass"
            >
              Choose a pass
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
