"use client";
import { useState, useEffect } from "react";
import Image from "next/image";

const PAGES = [
  { src: "/images/archive/2023/schedule-p1.jpg", label: "Fri Aug 4 · Sat Aug 5" },
  { src: "/images/archive/2023/schedule-p2.jpg", label: "Sun Aug 6 · Sponsors" },
];

export default function ScheduleViewer2023({ color }: { color: string }) {
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(0);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
      if (e.key === "ArrowRight") setPage((p) => Math.min(p + 1, PAGES.length - 1));
      if (e.key === "ArrowLeft") setPage((p) => Math.max(p - 1, 0));
    };
    document.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <button
        onClick={() => { setPage(0); setOpen(true); }}
        style={{
          background: `${color}15`,
          border: `1px solid ${color}40`,
          borderRadius: 20,
          padding: "0.35rem 1rem",
          fontSize: "0.78rem",
          fontWeight: 700,
          color: color,
          cursor: "pointer",
          letterSpacing: "0.04em",
          transition: "background 0.15s ease",
        }}
      >
        View Schedule →
      </button>

      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{
            position: "fixed", inset: 0, zIndex: 9999,
            background: "rgba(0,0,0,0.88)",
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
            padding: "1.5rem",
          }}
        >
          {/* Modal */}
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#111",
              borderRadius: 18,
              overflow: "hidden",
              maxWidth: 520,
              width: "100%",
              boxShadow: `0 0 80px ${color}20, 0 32px 64px rgba(0,0,0,0.7)`,
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* Header */}
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "1rem 1.25rem",
              borderBottom: "1px solid rgba(255,255,255,0.08)",
            }}>
              <div>
                <span style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: color }}>
                  2023 Schedule
                </span>
                <p style={{ margin: "0.1rem 0 0", fontSize: "0.8rem", color: "rgba(255,255,255,0.45)" }}>
                  {PAGES[page].label}
                </p>
              </div>
              <button
                onClick={() => setOpen(false)}
                style={{ background: "none", border: "none", color: "rgba(255,255,255,0.4)", fontSize: "1.3rem", cursor: "pointer", lineHeight: 1 }}
              >
                ×
              </button>
            </div>

            {/* Image */}
            <div style={{ position: "relative", width: "100%", background: "#0a0a14" }}>
              <Image
                src={PAGES[page].src}
                alt={`2023 Wellness Weekend Schedule — ${PAGES[page].label}`}
                width={960}
                height={1200}
                style={{ width: "100%", height: "auto", display: "block" }}
              />
            </div>

            {/* Pagination */}
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "0.85rem 1.25rem",
              borderTop: "1px solid rgba(255,255,255,0.08)",
            }}>
              <button
                onClick={() => setPage((p) => Math.max(p - 1, 0))}
                disabled={page === 0}
                style={{
                  background: "none", border: "1px solid rgba(255,255,255,0.12)",
                  borderRadius: 20, padding: "0.3rem 0.9rem",
                  color: page === 0 ? "rgba(255,255,255,0.2)" : "#fff",
                  fontSize: "0.82rem", cursor: page === 0 ? "default" : "pointer",
                }}
              >
                ← Prev
              </button>
              <span style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.3)" }}>
                {page + 1} / {PAGES.length}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(p + 1, PAGES.length - 1))}
                disabled={page === PAGES.length - 1}
                style={{
                  background: "none", border: "1px solid rgba(255,255,255,0.12)",
                  borderRadius: 20, padding: "0.3rem 0.9rem",
                  color: page === PAGES.length - 1 ? "rgba(255,255,255,0.2)" : "#fff",
                  fontSize: "0.82rem", cursor: page === PAGES.length - 1 ? "default" : "pointer",
                }}
              >
                Next →
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
