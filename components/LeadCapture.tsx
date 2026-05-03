"use client";

import { useState } from "react";
import { SparklesIcon } from "@/components/Icons";
import { trackLead } from "@/lib/tracking";

export default function LeadCapture() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error();
      setStatus("success");
      setEmail("");

      // Fire unified tracking: both pixels + server CAPI with email for matching
      trackLead({ email, description: "lead_capture" });
    } catch {
      setStatus("error");
    }
  }

  return (
    <section className="lead-capture">
      <div className="lead-capture-inner">
        <div className="lead-capture-badge">
          <SparklesIcon size={18} color="var(--gold)" />
          <span>Limited Spots Available</span>
        </div>
        <h2 className="lead-capture-title" style={{ fontFamily: "var(--font-display)" }}>
          Don&apos;t Miss <em>This Year&apos;s</em> Gathering
        </h2>
        <p className="lead-capture-desc" style={{ fontFamily: "var(--font-accent)" }}>
          Join 200+ seekers for three days of transformation, healing, and deep connection
          under Alaska&apos;s midnight sun. Get early access to tickets, schedule announcements,
          and exclusive updates.
        </p>

        {status === "success" ? (
          <div className="lead-capture-success">
            <SparklesIcon size={24} color="var(--psyche-cyan)" />
            <p>You&apos;re on the list. See you under the midnight sun.</p>
          </div>
        ) : (
          <form className="lead-capture-form" onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="lead-capture-input"
            />
            <button
              type="submit"
              className="lead-capture-btn"
              disabled={status === "loading"}
            >
              {status === "loading" ? "Joining..." : "Join the Tribe"}
            </button>
          </form>
        )}

        {status === "error" && (
          <p className="lead-capture-error">Something went wrong. Please try again.</p>
        )}

        <p className="lead-capture-note">
          No spam, ever. Unsubscribe anytime.
        </p>
      </div>
    </section>
  );
}
