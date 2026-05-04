"use client";

import { useState, useEffect, useCallback, useId, useRef } from "react";
import { trackLead } from "@/lib/tracking";
import { useFocusTrap } from "@/lib/useFocusTrap";
import { CloseIcon, EnvelopeIcon } from "@/components/Icons";

interface CartEntry {
  variationId: string;
  name: string;
  variantName: string;
  price: number;
  quantity: number;
}

export default function FloatingActions() {
  const [cartCount, setCartCount] = useState(0);
  const [showMessage, setShowMessage] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const messageModalRef = useRef<HTMLDivElement>(null);
  const messageTitleId = useId();
  useFocusTrap(showMessage, messageModalRef);

  // Escape closes the message modal
  useEffect(() => {
    if (!showMessage) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setShowMessage(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [showMessage]);

  // Reveal FABs only after the user scrolls past ~half the hero — first paint stays clean.
  useEffect(() => {
    const onScroll = () => {
      if (window.scrollY > window.innerHeight * 0.5) setRevealed(true);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Sync cart count from localStorage
  useEffect(() => {
    const syncCart = () => {
      try {
        const saved = localStorage.getItem("ww-cart");
        if (saved) {
          const cart: CartEntry[] = JSON.parse(saved);
          setCartCount(cart.reduce((sum, c) => sum + c.quantity, 0));
        } else {
          setCartCount(0);
        }
      } catch {
        setCartCount(0);
      }
    };
    syncCart();
    window.addEventListener("storage", syncCart);
    const interval = setInterval(syncCart, 2000);
    return () => {
      window.removeEventListener("storage", syncCart);
      clearInterval(interval);
    };
  }, []);

  const handleCartClick = useCallback(() => {
    if (cartCount > 0) {
      window.dispatchEvent(new CustomEvent("open-cart"));
    } else {
      document.getElementById("store")?.scrollIntoView({ behavior: "smooth" });
    }
  }, [cartCount]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        // Fire tracking to Meta, TikTok, and GA4
        trackLead({
          email: formData.email,
          phone: formData.phone || undefined,
          description: "message_form",
          contentName: "Lead Message Form",
        });
        setStatus("sent");
        setFormData({ name: "", email: "", phone: "", message: "" });
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  // Cart FAB always shows once revealed AND there are items, since the cart bar handles 0-item case.
  // Hide cart FAB at 0 items so first-paint and pre-add states don't show a duplicate "view tickets" CTA.
  const showCartFab = revealed && cartCount > 0;
  const showMessageFab = revealed;

  return (
    <>
      {/* Cart FAB - Left, only when items in cart */}
      {showCartFab && (
        <button
          className="fab fab-cart"
          onClick={handleCartClick}
          aria-label={`Cart (${cartCount} items)`}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
          </svg>
          <span className="fab-badge">{cartCount}</span>
        </button>
      )}

      {/* Message FAB - Right, only after first scroll */}
      {showMessageFab && (
        <button
          className="fab fab-message"
          onClick={() => { setShowMessage(true); setStatus("idle"); }}
          aria-label="Send a message"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
        </button>
      )}

      {/* Message Modal */}
      {showMessage && (
        <div className="modal-overlay" onClick={() => setShowMessage(false)}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            ref={messageModalRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={messageTitleId}
          >
            <button className="modal-close" onClick={() => setShowMessage(false)} aria-label="Close dialog"><CloseIcon size={18} /></button>

            {status === "sent" ? (
              <div className="modal-success">
                <div className="modal-success-icon" aria-hidden="true"><EnvelopeIcon size={32} color="var(--aurora)" /></div>
                <h3 id={messageTitleId} className="modal-title">
                  Message Sent!
                </h3>
                <p style={{ color: "var(--sage)", fontSize: "0.95rem" }}>
                  Thank you for reaching out. We&apos;ll get back to you soon.
                </p>
              </div>
            ) : (
              <>
                <h3 id={messageTitleId} className="modal-title">
                  Write a Message
                </h3>
                <form className="modal-form" onSubmit={handleSubmit}>
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="lead-name">Name</label>
                      <input
                        id="lead-name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                        placeholder="Your name"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="lead-email">Email</label>
                      <input
                        id="lead-email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="lead-phone">Phone <span style={{ opacity: 0.5 }}>(optional)</span></label>
                    <input
                      id="lead-phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData((p) => ({ ...p, phone: e.target.value }))}
                      placeholder="(555) 123-4567"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="lead-message">Message</label>
                    <textarea
                      id="lead-message"
                      required
                      value={formData.message}
                      onChange={(e) => setFormData((p) => ({ ...p, message: e.target.value }))}
                      placeholder="What would you like to know?"
                      rows={4}
                    />
                  </div>
                  {status === "error" && (
                    <p className="admin-error">Something went wrong. Please try again.</p>
                  )}
                  <button type="submit" className="form-submit" disabled={status === "sending"}>
                    {status === "sending" ? "Sending..." : "Send Message"}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
