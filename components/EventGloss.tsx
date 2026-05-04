"use client";
import { useEffect, useRef, useState } from "react";

interface Props {
  term: string;
  gloss: string;
}

export default function EventGloss({ term, gloss }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDocClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <span className="gloss" ref={ref}>
      {term}
      <button
        type="button"
        className="gloss-trigger"
        onClick={(e) => { e.stopPropagation(); setOpen((o) => !o); }}
        aria-label={`What is ${term}? ${gloss}`}
        aria-expanded={open}
      >
        ?
      </button>
      {open && (
        <span className="gloss-popover" role="tooltip">
          {gloss}
        </span>
      )}
    </span>
  );
}
