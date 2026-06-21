"use client";
import { useState, useEffect } from "react";
import Reveal from "@/components/Reveal";

interface PackageVariation {
  id: string;
  name: string;
  price: number;
}

interface Package {
  id: string;
  name: string;
  description: string;
  variations: PackageVariation[];
}

function formatPrice(cents: number) {
  return `$${(cents / 100).toFixed(cents % 100 === 0 ? 0 : 2)}`;
}

const PACKAGE_ICONS = ["✦", "◈", "⬡"];

export default function Packages() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/square/packages")
      .then((r) => r.json())
      .then((d) => {
        setPackages(d.packages || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  function addToCart(pkg: Package, variation: PackageVariation) {
    setAdding(variation.id);

    window.dispatchEvent(
      new CustomEvent("ww-add-to-cart", {
        detail: {
          variationId: variation.id,
          name: pkg.name,
          variantName: variation.name,
          price: variation.price,
        },
      })
    );

    setTimeout(() => {
      window.dispatchEvent(new Event("open-cart"));
      setAdding(null);
    }, 350);
  }

  if (!loading && packages.length === 0) return null;

  return (
    <section id="packages" className="packages-section section">
      <Reveal>
        <p className="section-label">Curated Experiences</p>
        <h2 className="section-title">Weekend Packages.</h2>
        <p className="section-desc">
          Immersive bundles crafted for the seeker who wants to go deeper — every
          detail tended to so you can arrive fully present.
        </p>
      </Reveal>

      {loading ? (
        <div className="packages-loading">
          <div className="store-spinner" />
          <p>Gathering packages…</p>
        </div>
      ) : (
        <div className="packages-grid">
          {packages.map((pkg, i) => {
            const icon = PACKAGE_ICONS[i % PACKAGE_ICONS.length];
            const primaryVariation = pkg.variations[0];
            return (
              <Reveal key={pkg.id}>
                <div className="package-card">
                  <div className="package-card-glow" />
                  <div className="package-icon">{icon}</div>
                  <h3 className="package-name">{pkg.name}</h3>
                  <p className="package-desc">{pkg.description}</p>
                  <div className="package-footer">
                    {pkg.variations.length === 1 ? (
                      <>
                        <span className="package-price">{formatPrice(primaryVariation.price)}</span>
                        <button
                          className={`package-btn${adding === primaryVariation.id ? " adding" : ""}`}
                          onClick={() => addToCart(pkg, primaryVariation)}
                          disabled={adding !== null}
                        >
                          {adding === primaryVariation.id ? "Adding…" : "Reserve This Package"}
                        </button>
                      </>
                    ) : (
                      <div className="package-variants">
                        {pkg.variations.map((v) => (
                          <button
                            key={v.id}
                            className={`package-variant-btn${adding === v.id ? " adding" : ""}`}
                            onClick={() => addToCart(pkg, v)}
                            disabled={adding !== null}
                          >
                            <span className="pv-name">{v.name}</span>
                            <span className="pv-price">{formatPrice(v.price)}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      )}
    </section>
  );
}
