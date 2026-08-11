"use client";
import { useState, FormEvent } from "react";
import { trackLead } from "@/lib/tracking";

export default function NewsletterSignup2027() {
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    const email = new FormData(e.currentTarget).get("email") as string;

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error();
      setStatus("success");
      trackLead({ email, description: "newsletter_signup_2027" });
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "0.5rem",
        padding: "0.9rem 1.5rem",
        borderRadius: "50px",
        background: "rgba(201,152,63,0.12)",
        border: "1px solid rgba(201,152,63,0.3)",
        color: "var(--gold, #C9983F)",
        fontSize: "0.9rem",
        fontWeight: 600,
        letterSpacing: "0.02em",
        width: "100%",
      }}>
        ✦ You&apos;re on the list — we&apos;ll be in touch.
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: "flex",
        gap: "0.5rem",
        width: "100%",
        flexWrap: "wrap",
      }}
    >
      <input
        name="email"
        type="email"
        required
        placeholder="Your email address"
        aria-label="Email address"
        style={{
          flex: "1 1 200px",
          padding: "0.8rem 1.2rem",
          borderRadius: "50px",
          border: "1px solid rgba(201,152,63,0.35)",
          background: "rgba(255,255,255,0.07)",
          color: "inherit",
          fontSize: "0.9rem",
          outline: "none",
          backdropFilter: "blur(4px)",
          WebkitBackdropFilter: "blur(4px)",
          minWidth: 0,
        }}
      />
      <button
        type="submit"
        disabled={status === "sending"}
        style={{
          padding: "0.8rem 1.6rem",
          borderRadius: "50px",
          border: "none",
          background: "var(--gold, #C9983F)",
          color: "#fff",
          fontWeight: 700,
          fontSize: "0.875rem",
          letterSpacing: "0.03em",
          cursor: status === "sending" ? "not-allowed" : "pointer",
          opacity: status === "sending" ? 0.7 : 1,
          whiteSpace: "nowrap",
          flexShrink: 0,
          transition: "opacity 0.15s",
        }}
      >
        {status === "sending" ? "…" : status === "error" ? "Try again" : "Notify me"}
      </button>
    </form>
  );
}
