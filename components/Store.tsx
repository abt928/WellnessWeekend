"use client";
import { useState, useEffect, useCallback, useId, useRef } from "react";
import { trackAddToCart, trackInitiateCheckout, trackViewContent } from "@/lib/tracking";
import { useFocusTrap } from "@/lib/useFocusTrap";
import { TicketIcon, SparkleIcon, CupIcon, ShirtIcon, LotusIcon, CloseIcon } from "@/components/Icons";

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

const MAX_QTY_PER_ITEM = 20;

function formatPrice(cents: number) {
  return `$${(cents / 100).toFixed(cents % 100 === 0 ? 0 : 2)}`;
}

function readInitialCart(): CartEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const saved = window.localStorage.getItem("ww-cart");
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

function readInitialTab(): string {
  if (typeof window === "undefined") return "tickets";
  const tab = new URLSearchParams(window.location.search).get("tab");
  return TABS.some((t) => t.key === tab) ? (tab as string) : "tickets";
}

export default function Store() {
  const [items, setItems] = useState<CatalogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTabState] = useState<string>(readInitialTab);
  const [cart, setCart] = useState<CartEntry[]>(readInitialCart);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkingOut, setCheckingOut] = useState(false);
  const [pendingRedemption, setPendingRedemption] = useState<{
    id: number;
    rewardType: string;
    discountCents: number;
  } | null>(null);

  const [error, setError] = useState<string | null>(null);
  const [promoInput, setPromoInput] = useState("");
  const [promoLoading, setPromoLoading] = useState(false);
  const [promoResult, setPromoResult] = useState<{
    valid: boolean;
    code?: string;
    label?: string;
    discountCents?: number;
    discountDisplay?: string;
    message?: string;
  } | null>(null);

  const setActiveTab = useCallback((key: string) => {
    setActiveTabState(key);
    if (typeof window === "undefined") return;
    const url = new URL(window.location.href);
    if (key === "tickets") url.searchParams.delete("tab");
    else url.searchParams.set("tab", key);
    window.history.replaceState({}, "", url.toString());
  }, []);

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

  // Cart hydration is the lazy initializer above (readInitialCart). Persist on changes:
  useEffect(() => {
    localStorage.setItem("ww-cart", JSON.stringify(cart));
    // Clear promo result if cart changes so stale discount doesn't carry over
    setPromoResult(null);
  }, [cart]);

  // Listen for external cart open requests (from FloatingActions FAB)
  useEffect(() => {
    const handler = () => setCartOpen(true);
    window.addEventListener("open-cart", handler);
    return () => window.removeEventListener("open-cart", handler);
  }, []);

  // Listen for add-to-cart events from Packages component
  useEffect(() => {
    const handler = (e: Event) => {
      const { variationId, name, variantName, price } = (e as CustomEvent).detail;
      setCart((prev) => {
        const existing = prev.find((c) => c.variationId === variationId);
        if (existing) {
          if (existing.quantity >= MAX_QTY_PER_ITEM) return prev;
          return prev.map((c) =>
            c.variationId === variationId ? { ...c, quantity: c.quantity + 1 } : c
          );
        }
        return [...prev, { variationId, name, variantName, price, quantity: 1 }];
      });
    };
    window.addEventListener("ww-add-to-cart", handler);
    return () => window.removeEventListener("ww-add-to-cart", handler);
  }, []);

  // Check for pending member redemption whenever cart opens
  useEffect(() => {
    if (!cartOpen) return;
    fetch("/api/members/redeem")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.pending) {
          setPendingRedemption({
            id: data.id,
            rewardType: data.rewardType,
            discountCents: data.discountCents,
          });
        } else {
          setPendingRedemption(null);
        }
      })
      .catch(() => setPendingRedemption(null));
  }, [cartOpen]);

  // Cart drawer a11y: focus trap + escape-to-close
  const cartDrawerRef = useRef<HTMLDivElement>(null);
  const cartTitleId = useId();
  useFocusTrap(cartOpen, cartDrawerRef);
  useEffect(() => {
    if (!cartOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setCartOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [cartOpen]);

  const addToCart = useCallback((item: CatalogItem, variation: Variation) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.variationId === variation.id);
      if (existing) {
        if (existing.quantity >= MAX_QTY_PER_ITEM) return prev;
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
        .map((c) =>
          c.variationId === variationId
            ? { ...c, quantity: Math.min(c.quantity + delta, MAX_QTY_PER_ITEM) }
            : c
        )
        .filter((c) => c.quantity > 0)
    );
  }, []);

  const applyPromo = useCallback(async () => {
    if (!promoInput.trim()) return;
    setPromoLoading(true);
    try {
      const res = await fetch("/api/promo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: promoInput.trim(),
          cart: cart.map((c) => ({ variationId: c.variationId, name: c.name, price: c.price, quantity: c.quantity })),
        }),
      });
      setPromoResult(await res.json());
    } catch {
      setPromoResult({ valid: false, message: "Something went wrong." });
    } finally {
      setPromoLoading(false);
    }
  }, [promoInput, cart]);

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

    // Read referral code from localStorage
    let referralCode: string | undefined;
    try {
      referralCode = localStorage.getItem("ww-ref") || undefined;
    } catch {
      // ignore
    }

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
          ...(referralCode ? { referralCode } : {}),
          ...(pendingRedemption ? { redemptionId: pendingRedemption.id } : {}),
          ...(promoResult?.valid && promoResult.discountCents ? { promoCents: promoResult.discountCents } : {}),
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
      <p className="section-label">Tickets & Add-Ons</p>
      <h2 className="section-title">
        We welcome all guests for a day or a weekend.
      </h2>
      <p className="section-desc">
        Choose your tickets, add-on experiences, and merch — all processed securely through Square.
      </p>
      <p className="store-capacity" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}>
        <LotusIcon size={16} color="var(--aurora)" /> Limited lodging on-site — the nearest campground is 15 minutes away <LotusIcon size={16} color="var(--aurora)" />
      </p>
      <div className="camping-urgency">
        <span className="camping-urgency-badge">Almost Gone</span>
        <span>Camping passes are nearly sold out — fewer than 10 remain. <a href="#store">Secure yours now →</a></span>
      </div>

      {/* Rewards callout */}
      <div className="store-rewards-strip">
        <div className="store-rewards-earn">
          <span className="store-rewards-star">✦</span>
          <span><strong>Earn 1 point per $1 spent</strong> — plus 50 bonus points every time you refer a friend</span>
        </div>
        <div className="store-rewards-redeem">
          <span className="store-rewards-tier"><strong>100 pts</strong> $10 off add-ons or merch</span>
          <span className="store-rewards-sep">·</span>
          <span className="store-rewards-tier"><strong>500 pts</strong> Free day pass</span>
          <span className="store-rewards-sep">·</span>
          <span className="store-rewards-tier"><strong>1,000 pts</strong> Free weekend pass</span>
        </div>
        <a href="/members" className="store-rewards-cta">Join the Circle →</a>
      </div>

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
          <p style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", marginBottom: "0.5rem" }}>Catalog unavailable</p>
          <p>We can&apos;t load tickets right now. Please refresh, or come back in a few minutes.</p>
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
                <h3 className="store-card-name">
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
          <div
            className="cart-drawer"
            onClick={(e) => e.stopPropagation()}
            ref={cartDrawerRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={cartTitleId}
          >
            <div className="cart-header">
              <h3 id={cartTitleId} style={{ fontFamily: "var(--font-display)", fontSize: "1.3rem", margin: 0 }}>Your Cart</h3>
              <button className="modal-close" onClick={() => setCartOpen(false)} aria-label="Close cart"><CloseIcon size={18} /></button>
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
                  {/* Promo code input */}
                  <div style={{ display: "flex", gap: "0.5rem", marginBottom: "0.75rem" }}>
                    <input
                      type="text"
                      value={promoInput}
                      onChange={(e) => {
                        setPromoInput(e.target.value.toUpperCase());
                        if (promoResult) setPromoResult(null);
                      }}
                      onKeyDown={(e) => { if (e.key === "Enter") applyPromo(); }}
                      placeholder="Promo code"
                      aria-label="Promo code"
                      style={{
                        flex: 1, padding: "0.5rem 0.75rem", borderRadius: "8px",
                        border: "1px solid rgba(107,127,96,0.3)",
                        background: "var(--surface-elevated, #FEFCF8)",
                        fontFamily: "var(--font-body)", fontSize: "0.875rem",
                        color: "var(--charcoal)", letterSpacing: "0.05em",
                      }}
                    />
                    <button
                      onClick={applyPromo}
                      disabled={promoLoading || !promoInput.trim()}
                      style={{
                        padding: "0.5rem 1rem", borderRadius: "8px",
                        background: "var(--sage)", color: "white",
                        border: "none", cursor: "pointer",
                        fontSize: "0.875rem", fontWeight: 600,
                        opacity: promoLoading || !promoInput.trim() ? 0.6 : 1,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {promoLoading ? "..." : "Apply"}
                    </button>
                  </div>
                  {promoResult && (
                    <div style={{
                      padding: "0.6rem 0.75rem", marginBottom: "0.75rem",
                      background: promoResult.valid ? "rgba(107,127,96,0.08)" : "rgba(220,80,80,0.08)",
                      borderRadius: "8px",
                      border: `1px solid ${promoResult.valid ? "rgba(107,127,96,0.25)" : "rgba(220,80,80,0.25)"}`,
                      fontSize: "0.875rem",
                      color: promoResult.valid ? "var(--forest)" : "#cc4444",
                    }}>
                      {promoResult.valid ? (
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <span>{promoResult.label}</span>
                          <span style={{ fontWeight: 600 }}>-{promoResult.discountDisplay}</span>
                        </div>
                      ) : promoResult.message}
                    </div>
                  )}
                  <div className="cart-total">
                    <span>Total</span>
                    <span style={{ fontFamily: "var(--font-display)", fontSize: "1.3rem" }}>
                      {formatPrice(cartTotal - (promoResult?.valid ? (promoResult.discountCents ?? 0) : 0) - (pendingRedemption?.discountCents ?? 0))}
                    </span>
                  </div>
                  {pendingRedemption && pendingRedemption.discountCents > 0 && (
                    <div style={{
                      display: "flex", justifyContent: "space-between", alignItems: "center",
                      padding: "0.6rem 0.75rem", marginBottom: "0.75rem",
                      background: "rgba(139,95,191,0.08)", borderRadius: "8px",
                      border: "1px solid rgba(139,95,191,0.2)",
                      fontSize: "0.875rem", color: "var(--aurora)",
                    }}>
                      <span>Points discount applied</span>
                      <span style={{ fontWeight: 600 }}>-{formatPrice(pendingRedemption.discountCents)}</span>
                    </div>
                  )}
                  {pendingRedemption && pendingRedemption.discountCents === 0 && (
                    <div style={{
                      padding: "0.6rem 0.75rem", marginBottom: "0.75rem",
                      background: "rgba(139,95,191,0.08)", borderRadius: "8px",
                      border: "1px solid rgba(139,95,191,0.2)",
                      fontSize: "0.875rem", color: "var(--aurora)", textAlign: "center",
                    }}>
                      {pendingRedemption.rewardType === "day-pass" ? "Day Pass" : "Weekend Pass"} redemption pending — fulfilled after checkout
                    </div>
                  )}
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
