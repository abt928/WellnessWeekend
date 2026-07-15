"use client";
import { useState, useEffect, useCallback, useId, useRef } from "react";
import { trackAddToCart, trackInitiateCheckout, trackViewContent } from "@/lib/tracking";
import { useFocusTrap } from "@/lib/useFocusTrap";
import { TicketIcon, SparkleIcon, CupIcon, ShirtIcon, CloseIcon } from "@/components/Icons";

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

// Items whose name contains any of these strings (case-insensitive) are shown as sold out
const SOLD_OUT_PATTERNS = ["earth pass"];

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
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [pendingRedemption, setPendingRedemption] = useState<{
    id: number;
    rewardType: string;
    discountCents: number;
  } | null>(null);

  const [error, setError] = useState<string | null>(null);
  const [justAddedId, setJustAddedId] = useState<string | null>(null);
  const justAddedTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [showPromo, setShowPromo] = useState(false);
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
      // Packages component only dispatches the event; fire the AddToCart
      // conversion here so package add-to-carts match the in-store ones.
      try {
        trackAddToCart({
          contentId: variationId,
          contentName: name,
          contentType: "product",
          value: price / 100,
          currency: "USD",
          quantity: 1,
        });
      } catch { /* fail-open — never break the cart */ }
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

  // Promo field defaults collapsed each time the cart opens
  useEffect(() => { if (cartOpen) setShowPromo(false); }, [cartOpen]);

  // Clear the transient "just added" timer on unmount
  useEffect(() => () => { if (justAddedTimer.current) clearTimeout(justAddedTimer.current); }, []);

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
    setJustAddedId(variation.id);
    if (justAddedTimer.current) clearTimeout(justAddedTimer.current);
    justAddedTimer.current = setTimeout(() => setJustAddedId(null), 1200);
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

  // Cross-sell order bump: up to 3 add-on/cacao items not already in the cart,
  // shown only once the cart holds at least one ticket.
  const cartVariationIds = new Set(cart.map((c) => c.variationId));
  const ticketVariationIds = new Set(
    items.filter((i) => i.category === "tickets").flatMap((i) => i.variations.map((v) => v.id))
  );
  const cartHasTicket = cart.some((c) => ticketVariationIds.has(c.variationId));
  const bumpItems = items
    .filter((i) => (i.category === "addons" || i.category === "cacao") && i.variations.length > 0)
    .filter((i) => !i.variations.some((v) => cartVariationIds.has(v.id)))
    .slice(0, 3);

  // Points earned on this order, using the same discounted total shown below.
  const pointsToEarn = Math.max(
    0,
    Math.floor(
      (cartTotal - (promoResult?.valid ? (promoResult.discountCents ?? 0) : 0) - (pendingRedemption?.discountCents ?? 0)) / 100
    )
  );

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    setCheckoutError(null);
    setCheckingOut(true);

    // True paid value: cart total minus the valid promo and pending redemption
    // discounts, floored at 0. This mirrors the discounted total shown in the
    // cart and the Square order total, and it feeds both the InitiateCheckout
    // value and the ww-checkout value the thank-you Purchase reads (which also
    // auto-corrects the members/earn points award).
    const discountedTotalCents = Math.max(
      0,
      cartTotal
        - (promoResult?.valid ? (promoResult.discountCents ?? 0) : 0)
        - (pendingRedemption?.discountCents ?? 0)
    );
    const paidValue = discountedTotalCents / 100;
    const contents = cart.map((c) => ({
      contentId: c.variationId,
      quantity: c.quantity,
      price: c.price / 100,
      name: c.name,
    }));

    trackInitiateCheckout({
      value: paidValue,
      currency: "USD",
      quantity: cartCount,
      contentId: cart[0]?.variationId || "wellness-weekend-checkout",
      contentName: cart.map((c) => c.name).join(", "),
      contentType: "product",
      description: cart.map((c) => c.name).join(", "),
      contents,
    });

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
          ...(promoResult?.valid && promoResult.code ? { promoCode: promoResult.code } : {}),
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.checkoutUrl) {
        // Keep the cart intact so the shopper can retry.
        setCheckingOut(false);
        setCheckoutError("Checkout is unavailable right now. Please try again.");
        return;
      }

      // Save cart context for the thank-you page to fire the Purchase event.
      // orderId (the Square order id) lets thank-you + the Square webhook derive
      // a byte-identical event_id (`purchase_${orderId}`) so the two Purchase
      // fires dedupe; it is only known after the checkout link is created.
      try {
        localStorage.setItem("ww-checkout", JSON.stringify({
          value: paidValue,
          currency: "USD",
          quantity: cartCount,
          items: cart.map((c) => c.name).join(", "),
          contents,
          ...(data.orderId ? { orderId: data.orderId } : {}),
          timestamp: Date.now(),
        }));
      } catch {
        /* quota exceeded — Purchase still fires with a random event_id */
      }

      // Clear the cart since checkout started
      setCart([]);
      window.location.href = data.checkoutUrl;
    } catch {
      setCheckingOut(false);
      setCheckoutError("Checkout is unavailable right now. Please try again.");
    }
  };

  const filtered = items.filter((i) => i.category === activeTab);

  return (
    <section id="store" className="section store-section">
      <p className="section-label">Tickets & Add-Ons</p>
      <h2 className="section-title">
        We welcome all guests for a day or a weekend.
      </h2>
      <p className="section-desc" style={{ marginBottom: "0.75rem" }}>
        Choose your tickets, add-on experiences, and merch, all processed securely through Square. Your weekend pass includes 40+ sessions across three days.
      </p>
      <p className="section-desc" style={{ fontSize: "0.95rem", marginBottom: "0", opacity: 0.85 }}>
        Fourth annual gathering, capacity 200. Intimate by design.
      </p>
      <div className="camping-urgency">
        <span className="camping-urgency-badge">Limited Cabin Beds</span>
        <span>Camping passes are sold out for 2026. A few on-site cabin beds remain; reserve yours before they&apos;re gone.</span>
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
        <div style={{ backgroundColor: "rgba(255, 100, 100, 0.1)", border: "1px solid rgba(255, 100, 100, 0.3)", padding: "2rem", borderRadius: "8px", margin: "2rem 0", color: "#b44040", textAlign: "center" }}>
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
          {filtered.map((item) => {
            const soldOut = SOLD_OUT_PATTERNS.some((p) =>
              item.name.toLowerCase().includes(p)
            );
            const featured = activeTab === "tickets" && !soldOut && /weekend/i.test(item.name);
            return (
            <div className={`store-card${soldOut ? " store-card-sold-out" : ""}${featured ? " store-card-featured" : ""}`} key={item.id}>
              <div className="store-card-header">
                <h3 className="store-card-name">
                  {item.name}
                  {soldOut && <span className="store-sold-out-badge">Sold Out</span>}
                  {featured && <span className="store-featured-badge">Full Weekend</span>}
                </h3>
                {!soldOut && item.variations.length === 1 && (
                  <span className="store-card-price">
                    {formatPrice(item.variations[0].price)}
                  </span>
                )}
              </div>
              <p className="store-card-desc">{item.description}</p>
              <div className="store-card-actions">
                {soldOut ? (
                  <button className="store-add-btn" disabled style={{ opacity: 0.4, cursor: "not-allowed" }}>
                    Sold Out
                  </button>
                ) : item.variations.length === 1 ? (
                  <button
                    className="store-add-btn"
                    onClick={() => addToCart(item, item.variations[0])}
                    disabled={justAddedId === item.variations[0].id}
                  >
                    {justAddedId === item.variations[0].id ? "Added ✓" : "Add to Cart"}
                  </button>
                ) : (
                  <div className="store-variants">
                    {item.variations.map((v) => {
                      const vFeatured = activeTab === "tickets" && /weekend/i.test(v.name);
                      return (
                      <button
                        key={v.id}
                        className={`store-variant-btn${vFeatured ? " store-variant-btn-featured" : ""}`}
                        onClick={() => addToCart(item, v)}
                        disabled={justAddedId === v.id}
                      >
                        <span className="variant-name">{justAddedId === v.id ? "Added ✓" : v.name}</span>
                        <span className="variant-price">{formatPrice(v.price)}</span>
                      </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
            );
          })}
          {filtered.length === 0 && !loading && (
            <p className="store-empty">No items in this category yet.</p>
          )}
        </div>
      )}

      {/* Rewards callout — one quiet line below the grid */}
      <div
        className="store-rewards-strip"
        style={{
          flexDirection: "row", flexWrap: "wrap", justifyContent: "center",
          gap: "0.75rem 1rem", padding: "0.75rem 1.25rem",
          background: "transparent", border: "1px solid var(--line-subtle)",
        }}
      >
        <span className="store-rewards-earn" style={{ fontSize: "0.85rem" }}>
          <span className="store-rewards-star">✦</span>
          <span>Members earn 1 point per $1, redeemable toward add-ons and passes.</span>
        </span>
        <a href="/members" className="store-rewards-cta">Join the Circle →</a>
      </div>

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
                  {/* Cross-sell order bump — only once a ticket is in the cart */}
                  {cartHasTicket && bumpItems.length > 0 && (
                    <div className="cart-bump">
                      <p className="cart-bump-heading">Complete your weekend</p>
                      {bumpItems.map((bump) => (
                        <div className="cart-bump-item" key={bump.id}>
                          <span className="cart-bump-name">{bump.name}</span>
                          <span className="cart-bump-price">{formatPrice(bump.variations[0].price)}</span>
                          <button
                            className="cart-bump-add"
                            onClick={() => addToCart(bump, bump.variations[0])}
                          >
                            Add
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  {/* Promo code — collapsed by default, revealed on request */}
                  {showPromo || promoResult ? (
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
                  ) : (
                    <button
                      type="button"
                      onClick={() => setShowPromo(true)}
                      style={{
                        display: "block", background: "none", border: "none", padding: 0,
                        marginBottom: "0.75rem", color: "var(--aurora)", fontSize: "0.8rem",
                        fontWeight: 600, cursor: "pointer", fontFamily: "inherit", textDecoration: "underline",
                      }}
                    >
                      Have a promo code?
                    </button>
                  )}
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
                      {pendingRedemption.rewardType === "day-pass" ? "Day Pass" : "Weekend Pass"} redemption pending, fulfilled after checkout
                    </div>
                  )}
                  {checkoutError && (
                    <div role="alert" style={{
                      padding: "0.6rem 0.75rem", marginBottom: "0.75rem",
                      background: "rgba(220,80,80,0.08)", borderRadius: "8px",
                      border: "1px solid rgba(220,80,80,0.25)",
                      fontSize: "0.875rem", color: "#cc4444", textAlign: "center",
                    }}>
                      {checkoutError}
                    </div>
                  )}
                  <p style={{
                    textAlign: "center", fontSize: "0.8rem", lineHeight: 1.5,
                    color: "var(--ink-muted)", margin: "0 0 0.75rem",
                  }}>
                    Members earn {pointsToEarn} points on this order toward add-ons and passes.{" "}
                    <a href="/members" style={{ color: "var(--aurora)", fontWeight: 600, textDecoration: "none" }}>Join the Circle</a>
                  </p>
                  <button
                    className="cart-checkout-btn"
                    onClick={handleCheckout}
                    disabled={checkingOut}
                  >
                    {checkingOut ? "Redirecting to checkout..." : "Proceed to Checkout"}
                  </button>
                  <p className="cart-secure">🔒 Secure checkout powered by Square</p>
                  <p className="cart-secure" style={{ marginTop: "0.35rem" }}>
                    You&apos;ll finish payment on Square&apos;s secure page. Questions? See our{" "}
                    <a href="/refunds" style={{ color: "var(--aurora)", fontWeight: 600, textDecoration: "none" }}>refund policy</a>.
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
