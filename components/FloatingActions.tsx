"use client";

import { useState, useEffect, useCallback } from "react";
import { trackLead } from "@/lib/tracking";

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
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

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
    // Listen for storage changes (from other tabs or Store component updates)
    window.addEventListener("storage", syncCart);
    // Poll every 2s to catch same-tab updates
    const interval = setInterval(syncCart, 2000);
    return () => {
      window.removeEventListener("storage", syncCart);
      clearInterval(interval);
    };
  }, []);

  const handleCartClick = useCallback(() => {
    if (cartCount > 0) {
      // Dispatch a custom event that the Store component can listen for
      window.dispatchEvent(new CustomEvent("open-cart"));
    } else {
      // Scroll to store section
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
        trackLead({
          email: formData.email,
          description: "message_form",
          contentName: "Lead Message Form",
        });
        setStatus("sent");
        setFormData({ name: "", email: "", message: "" });
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <>
      {/* Cart FAB - Left */}
      <button
        className="fab fab-cart"
        onClick={handleCartClick}
        aria-label={cartCount > 0 ? `Cart (${cartCount} items)` : "View tickets"}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
        </svg>
        {cartCount > 0 && <span className="fab-badge">{cartCount}</span>}
      </button>

      {/* Message FAB - Right */}
      <button
        className="fab fab-message"
        onClick={() => { setShowMessage(true); setStatus("idle"); }}
        aria-label="Send a message"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
        </svg>
      </button>

      {/* Message Modal */}
      {showMessage && (
        <div className="modal-overlay" onClick={() => setShowMessage(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowMessage(false)} aria-label="Close">✕</button>

            {status === "sent" ? (
              <div className="modal-success">
                <div className="modal-success-icon">✉️</div>
                <h3 className="modal-title" style={{ fontFamily: "var(--font-display)" }}>
                  Message Sent!
                </h3>
                <p style={{ color: "var(--sage)", fontSize: "0.95rem" }}>
                  Thank you for reaching out. We&apos;ll get back to you soon.
                </p>
              </div>
            ) : (
              <>
                <h3 className="modal-title" style={{ fontFamily: "var(--font-display)" }}>
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
