"use client";
import { useState, FormEvent } from "react";
import { trackLead } from "@/lib/tracking";
import { SunIcon } from "@/components/Icons";

export default function NewsletterForm() {
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
      trackLead({ email, description: "newsletter_signup" });
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="newsletter" style={{ justifyContent: "center" }}>
        <p style={{ color: "var(--gold-light)", fontSize: "0.95rem" }}>
          <SunIcon size={18} color="var(--gold)" /> You&apos;re on the list! See you under the midnight sun.
        </p>
      </div>
    );
  }

  return (
    <form className="newsletter" onSubmit={handleSubmit}>
      <input name="email" type="email" required placeholder="Your email address" aria-label="Email address" />
      <button type="submit" disabled={status === "sending"}>
        {status === "sending" ? "..." : status === "error" ? "Retry" : "Subscribe"}
      </button>
    </form>
  );
}
