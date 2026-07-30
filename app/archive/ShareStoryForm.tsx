"use client";
import { useState, FormEvent } from "react";

const YEARS = ["2023", "2024", "2025"];

export default function ShareStoryForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [selectedYears, setSelectedYears] = useState<string[]>([]);
  const [story, setStory] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  function toggleYear(y: string) {
    setSelectedYears((prev) =>
      prev.includes(y) ? prev.filter((x) => x !== y) : [...prev, y]
    );
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/share-story", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, years: selectedYears, story }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Submission failed.");
      setSubmitted(true);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div style={{
        background: "rgba(201,152,63,0.08)",
        border: "1px solid rgba(201,152,63,0.3)",
        borderRadius: 16,
        padding: "2.5rem",
        textAlign: "center",
      }}>
        <div style={{ fontSize: "2rem", marginBottom: "0.75rem" }}>✨</div>
        <h3 style={{ fontFamily: "var(--font-display, serif)", fontSize: "1.5rem", marginBottom: "0.6rem" }}>
          Thank you, {name.split(" ")[0]}.
        </h3>
        <p style={{ color: "rgba(255,255,255,0.65)", fontSize: "0.95rem", lineHeight: 1.75, maxWidth: 420, margin: "0 auto 1.25rem" }}>
          Your story has been received. We hold it with care.
        </p>
        <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.85rem", lineHeight: 1.7 }}>
          To share photos or videos, email them to{" "}
          <a href="mailto:support@thesoundspace.us" style={{ color: "var(--gold, #C9983F)", textDecoration: "none" }}>
            support@thesoundspace.us
          </a>{" "}
          with your name and the year you attended.
        </p>
      </div>
    );
  }

  const inputStyle: React.CSSProperties = {
    width: "100%",
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: 10,
    padding: "0.75rem 1rem",
    color: "#fff",
    fontSize: "0.95rem",
    outline: "none",
    boxSizing: "border-box",
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: "0.72rem",
    fontWeight: 700,
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    color: "rgba(255,255,255,0.45)",
    marginBottom: "0.4rem",
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "grid", gap: "1.25rem" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
        <div>
          <label style={labelStyle}>Your Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Full name"
            required
            style={inputStyle}
          />
        </div>
        <div>
          <label style={labelStyle}>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            required
            style={inputStyle}
          />
        </div>
      </div>

      <div>
        <label style={labelStyle}>Year(s) Attended</label>
        <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap" }}>
          {YEARS.map((y) => {
            const checked = selectedYears.includes(y);
            return (
              <button
                key={y}
                type="button"
                onClick={() => toggleYear(y)}
                style={{
                  padding: "0.35rem 1rem",
                  borderRadius: 20,
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                  background: checked ? "var(--gold, #C9983F)" : "rgba(255,255,255,0.05)",
                  border: checked ? "1px solid var(--gold, #C9983F)" : "1px solid rgba(255,255,255,0.12)",
                  color: checked ? "#fff" : "rgba(255,255,255,0.55)",
                }}
              >
                {y}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <label style={labelStyle}>Your Story</label>
        <textarea
          value={story}
          onChange={(e) => setStory(e.target.value)}
          placeholder="What did Wellness Weekend mean to you? What moment do you still carry?"
          required
          rows={5}
          style={{ ...inputStyle, resize: "vertical", lineHeight: 1.65 }}
        />
      </div>

      {error && (
        <p style={{ color: "#ff6b6b", fontSize: "0.85rem", margin: 0 }}>{error}</p>
      )}

      <button
        type="submit"
        disabled={submitting}
        style={{
          background: submitting ? "rgba(201,152,63,0.5)" : "var(--gold, #C9983F)",
          color: "#fff",
          fontWeight: 700,
          fontSize: "0.95rem",
          padding: "0.85rem 2rem",
          borderRadius: 30,
          border: "none",
          cursor: submitting ? "not-allowed" : "pointer",
          transition: "opacity 0.15s ease",
          width: "100%",
        }}
      >
        {submitting ? "Sending…" : "Share Your Story →"}
      </button>

      <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.78rem", textAlign: "center", margin: 0 }}>
        Photos & videos? Email{" "}
        <a href="mailto:support@thesoundspace.us" style={{ color: "var(--gold, #C9983F)", textDecoration: "none" }}>
          support@thesoundspace.us
        </a>
      </p>
    </form>
  );
}
