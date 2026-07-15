"use client";

import { useCallback, useEffect, useState } from "react";

interface CartEntry {
  quantity: number;
}

function readCartCount() {
  if (typeof window === "undefined") return 0;
  try {
    const saved = window.localStorage.getItem("ww-cart");
    const cart: CartEntry[] = saved ? JSON.parse(saved) : [];
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  } catch {
    return 0;
  }
}

export default function FloatingActions() {
  const [visible, setVisible] = useState(false);
  const [cartCount, setCartCount] = useState(readCartCount);
  const [storeInView, setStoreInView] = useState(false);

  const syncCart = useCallback(() => {
    setCartCount(readCartCount());
  }, []);

  useEffect(() => {
    const updateVisibility = () => {
      setVisible(window.scrollY > window.innerHeight * 0.68);
    };
    updateVisibility();
    window.addEventListener("scroll", updateVisibility, { passive: true });
    return () => window.removeEventListener("scroll", updateVisibility);
  }, []);

  useEffect(() => {
    const store = document.getElementById("store");
    if (!store || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      ([entry]) => setStoreInView(entry.isIntersecting),
      { threshold: 0.08 },
    );
    observer.observe(store);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    window.addEventListener("storage", syncCart);
    window.addEventListener("ww-cart-change", syncCart);
    return () => {
      window.removeEventListener("storage", syncCart);
      window.removeEventListener("ww-cart-change", syncCart);
    };
  }, [syncCart]);

  const handleClick = useCallback(() => {
    if (cartCount > 0) {
      window.dispatchEvent(new Event("open-cart"));
      return;
    }
    document.getElementById("store")?.scrollIntoView({ behavior: "smooth" });
  }, [cartCount]);

  if (!visible || cartCount > 0 || storeInView) return null;

  return (
    <button
      type="button"
      className="mobile-ticket-bar"
      onClick={handleClick}
      data-cta="sticky_choose_pass"
      aria-label="Choose a Wellness Weekend pass"
    >
      <span>
        <strong>August 7–9</strong>
        <span>Day and weekend passes</span>
      </span>
      <span className="mobile-ticket-bar-action">Choose a pass</span>
    </button>
  );
}
