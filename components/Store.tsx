"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { trackAddToCart, trackInitiateCheckout, trackViewContent } from "@/lib/tracking";
import { TicketIcon, SparkleIcon, CupIcon, ShirtIcon } from "@/components/Icons";

interface Variation {
  id: string;
  name: string;
  price: number;
}

interface CatalogItem {
  id: string;
  name: string;
  description: string;
  category: string;
  variations: Variation[];
}

interface CartEntry {
  variationId: string;
  name: string;
  variantName: string;
  price: number;
  quantity: number;
}

const TABS = [
  { key: "tickets", label: "Tickets", Icon: TicketIcon },
  { key: "addons", label: "Add-Ons", Icon: SparkleIcon },
  { key: "cacao", label: "Cacao", Icon: CupIcon },
  { key: "merch", label: "Merch", Icon: ShirtIcon },
];

function formatPrice(cents: number) {
  return `$${(cents / 100).toFixed(cents % 100 === 0 ? 0 : 2)}`;
}

export default function Store() {
  const [items, setItems] = useState<CatalogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("tickets");
  const [cart, setCart] = useState<CartEntry[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkingOut, setCheckingOut] = useState(false);

  const [error, setError] = useState<string | null>(null);

  // Load catalog
  useEffect(() => {
    fetch("/api/square/catalog")
      .then((r) => r.json())
      .then((d) => {
        if (d.error) {
          setError(d.error);
          setLoading(false);
          return;
        }
        setItems(d.items || []); 
        setLoading(false); 
      })
      .catch(() => {
        setError("Failed to fetch catalog. Please check Square credentials.");
        setLoading(false);
      });
  }, []);

  // Fire ViewContent when the store section scrolls into view (once)
  const storeRef = useRef<HTMLElement | null>(null);
  const viewFired = useRef(false);
  useEffect(() => {
    if (viewFired.current || typeof IntersectionObserver === "undefined") return;
    const el = document.getElementById("store");
    if (!el) return;
    storeRef.current = el;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !viewFired.current) {
          viewFired.current = true;
          trackViewContent({
            contentId: "wellness-weekend-store",
            contentName: "Wellness Weekend Store",
            contentType: "product_group",
          });
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [loading]); // re-run when loading completes so store section exists

  // Load cart from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("ww-cart");
      if (saved) setCart(JSON.parse(saved));
    } catch { /* noop */ }
  }, []);

  // Save cart
  useEffect(() => {
    localStorage.setItem("ww-cart", JSON.stringify(cart));
  }, [cart]);

  // Listen for external cart open requests (from FloatingActions FAB)
  useEffect(() => {
    const handler = () => setCartOpen(true);
    window.addEventListener("open-cart", handler);
    return () => window.removeEventListener("open-cart", handler);
  }, []);

  const addToCart = useCallback((item: CatalogItem, variation: Variation) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.variationId === variation.id);
      if (existing) {
        return prev.map((c) =>
          c.variationId === variation.id ? { ...c, quantity: c.quantity + 1 } : c
        );
      }
      return [...prev, {
        variationId: variation.id,
        name: item.name,
        variantName: variation.name,
        price: variation.price,
        quantity: 1,
      }];
    });
    trackAddToCart({
      contentId: variation.id,
      contentName: item.name,
      contentType: "product",
      value: variation.price / 100,
      currency: "USD",
      quantity: 1,
    });
  }, []);

  const updateQty = useCallback((variationId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((c) => c.variationId === variationId ? { ...c, quantity: c.quantity + delta } : c)
        .filter((c) => c.quantity > 0)
    );
  }, []);

  const cartTotal = cart.reduce((sum, c) => sum + c.price * c.quantity, 0);
  const cartCount = cart.reduce((sum, c) => sum + c.quantity, 0);

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    setCheckingOut(true);
    trackInitiateCheckout({
      value: cartTotal / 100,
      currency: "USD",
      quantity: cartCount,
      contentId: cart[0]?.variationId || "wellness-weekend-checkout",
      contentName: cart.map((c) => c.name).join(", "),
      contentType: "product",
      description: cart.map((c) => c.name).join(", "),
      contents: cart.map((c) => ({
        contentId: c.variationId,
        quantity: c.quantity,
        price: c.price / 100,
        name: c.name,
      })),
    });

    // Save cart context for the thank-you page to fire purchase event with value
    localStorage.setItem("ww-checkout", JSON.stringify({
      value: cartTotal / 100,
      currency: "USD",
      quantity: cartCount,
      items: cart.map((c) => c.name).join(", "),
      contents: cart.map((c) => ({
        contentId: c.variationId,
        quantity: c.quantity,
        price: c.price / 100,
        name: c.name,
      })),
      timestamp: Date.now(),
    }));

    try {
      const res = await fetch("/api/square/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cart.map((c) => ({
            variationId: c.variationId,
            quantity: c.quantity,
            name: c.name,
          })),
          returnUrl: window.location.origin,
        }),
      });
      const data = await res.json();
      if (data.checkoutUrl) {
        // Clear the cart since checkout started
        setCart([]);
        window.location.href = data.checkoutUrl;
      }
    } catch {
      setCheckingOut(false);
    }
  };

  const filtered = items.filter((i) => i.category === activeTab);

  return (
    <section id="store" className="section store-section">
      <p className="section-label">Build Your Experience</p>
      <h2 className="section-title" style={{ fontFamily: "var(--font-display)" }}>
        Create Your <em>Weekend</em>
      </h2>
      <p className="section-desc">
        Choose your tickets, add-on experiences, and merch to craft the perfect
        Wellness Weekend, all processed securely through Square.
      </p>

      {/* Category Tabs */}
      <div className="store-tabs">
        {TABS.map((t) => (
          <button
            key={t.key}
            className={`store-tab${activeTab === t.key ? " active" : ""}`}
            onClick={() => setActiveTab(t.key)}
          >
            <t.Icon size={16} />
            {t.label}
          </button>
        ))}
      </div>

      {/* Items Grid */}
      {error ? (
        <div style={{ backgroundColor: "rgba(255, 100, 100, 0.1)", border: "1px solid rgba(255, 100, 100, 0.3)", padding: "2rem", borderRadius: "8px", margin: "2rem 0", color: "#ff8888", textAlign: "center" }}>
          <p style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", marginBottom: "0.5rem" }}>Square Integration Missing</p>
          <p>It looks like the <code>.env</code> file is missing or lacks the correct Square credentials. Please review the <code>.env.example</code> file and provide your Square access token to load the catalog.</p>
        </div>
      ) : loading ? (
        <div className="store-loading">
          <div className="store-spinner" />
          <p>Loading catalog...</p>
        </div>
      ) : (
        <div className="store-grid">
          {filtered.map((item) => (
            <div className="store-card" key={item.id}>
              <div className="store-card-header">
                <h3 className="store-card-name" style={{ fontFamily: "var(--font-display)" }}>
                  {item.name}
                </h3>
                {item.variations.length === 1 && (
                  <span className="store-card-price">
                    {formatPrice(item.variations[0].price)}
                  </span>
                )}
              </div>
              <p className="store-card-desc">{item.description}</p>
              <div className="store-card-actions">
                {item.variations.length === 1 ? (
                  <button
                    className="store-add-btn"
                    onClick={() => addToCart(item, item.variations[0])}
                  >
                    Add to Cart
                  </button>
                ) : (
                  <div className="store-variants">
                    {item.variations.map((v) => (
                      <button
                        key={v.id}
                        className="store-variant-btn"
                        onClick={() => addToCart(item, v)}
                      >
                        <span className="variant-name">{v.name}</span>
                        <span className="variant-price">{formatPrice(v.price)}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
          {filtered.length === 0 && !loading && (
            <p className="store-empty">No items in this category yet.</p>
          )}
        </div>
      )}

      {/* Floating Cart Bar */}
      {cartCount > 0 && (
        <div className="cart-bar" onClick={() => setCartOpen(true)}>
          <span className="cart-bar-count">{cartCount} item{cartCount !== 1 ? "s" : ""}</span>
          <span className="cart-bar-label">View Cart</span>
          <span className="cart-bar-total">{formatPrice(cartTotal)}</span>
        </div>
      )}

      {/* Cart Drawer */}
      {cartOpen && (
        <div className="cart-overlay" onClick={() => setCartOpen(false)}>
          <div className="cart-drawer" onClick={(e) => e.stopPropagation()}>
            <div className="cart-header">
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.3rem" }}>Your Cart</h3>
              <button className="modal-close" onClick={() => setCartOpen(false)}>✕</button>
            </div>

            {cart.length === 0 ? (
              <p style={{ color: "var(--sage)", padding: "2rem", textAlign: "center" }}>
                Your cart is empty
              </p>
            ) : (
              <>
                <div className="cart-items">
                  {cart.map((c) => (
                    <div className="cart-item" key={c.variationId}>
                      <div className="cart-item-info">
                        <div className="cart-item-name">{c.name}</div>
                        {c.variantName !== "Regular" && c.variantName !== c.name && (
                          <div className="cart-item-variant">{c.variantName}</div>
                        )}
                      </div>
                      <div className="cart-item-controls">
                        <button className="qty-btn" onClick={() => updateQty(c.variationId, -1)}>−</button>
                        <span className="qty-num">{c.quantity}</span>
                        <button className="qty-btn" onClick={() => updateQty(c.variationId, 1)}>+</button>
                      </div>
                      <div className="cart-item-price">{formatPrice(c.price * c.quantity)}</div>
                    </div>
                  ))}
                </div>
                <div className="cart-footer">
                  <div className="cart-total">
                    <span>Total</span>
                    <span style={{ fontFamily: "var(--font-display)", fontSize: "1.3rem" }}>
                      {formatPrice(cartTotal)}
                    </span>
                  </div>
                  <button
                    className="cart-checkout-btn"
                    onClick={handleCheckout}
                    disabled={checkingOut}
                  >
                    {checkingOut ? "Redirecting to checkout..." : "Proceed to Checkout"}
                  </button>
                  <p className="cart-secure">🔒 Secure checkout powered by Square</p>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
