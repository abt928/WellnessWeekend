"use client";
import { useState } from "react";
import Link from "next/link";

export default function AffiliateApplyPage() {
  const [form, setForm] = useState({
    name: "", email: "", company: "", website: "", description: "", password: "", confirm: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (form.password !== form.confirm) { setError("Passwords don't match"); return; }
    if (form.password.length < 8) { setError("Password must be at least 8 characters"); return; }

    setLoading(true);
    const res = await fetch("/api/affiliates/apply", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.name, email: form.email, company: form.company,
        website: form.website, description: form.description, password: form.password,
      }),
    });
    const data = await res.json();
    if (res.ok) {
      setSuccess(true);
    } else {
      setError(data.error || "Something went wrong");
    }
    setLoading(false);
  };

  if (success) {
    return (
      <div className="admin-login">
        <div className="admin-login-card" style={{ textAlign: "center" }}>
          <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>✦</div>
          <h2 style={{ fontFamily: "var(--font-display)", color: "var(--ink)", marginBottom: "0.75rem" }}>
            Application Received
          </h2>
          <p style={{ color: "var(--ink-muted)", lineHeight: "1.7", marginBottom: "1.5rem" }}>
            We&apos;ll review your application and reach out within 1–2 business days.
            Once approved, you can log in with the email and password you set.
          </p>
          <Link href="/affiliates" style={{ color: "var(--psyche-cyan)", fontSize: "0.9rem" }}>
            Go to Partner Portal →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-login" style={{ minHeight: "100vh", paddingBlock: "4rem" }}>
      <div className="admin-login-card" style={{ maxWidth: "480px" }}>
        <div className="admin-login-logo" style={{ fontFamily: "var(--font-display)" }}>
          Wellness Weekend
        </div>
        <h1 className="admin-login-title">Become a Partner</h1>
        <p style={{ color: "var(--ink-muted)", fontSize: "0.875rem", textAlign: "center", marginBottom: "1.5rem", lineHeight: "1.6" }}>
          Earn {10}% commission on every ticket sold through your referral link.
          Applications are reviewed within 1–2 business days.
        </p>
        <form onSubmit={handleSubmit} className="admin-login-form">
          <input type="text" placeholder="Your name *" value={form.name} onChange={set("name")} className="admin-input" required />
          <input type="email" placeholder="Email address *" value={form.email} onChange={set("email")} className="admin-input" required />
          <input type="text" placeholder="Company / Brand name" value={form.company} onChange={set("company")} className="admin-input" />
          <input type="url" placeholder="Website or social media URL" value={form.website} onChange={set("website")} className="admin-input" />
          <textarea
            placeholder="Tell us about your audience (followers, community, niche) *"
            value={form.description}
            onChange={set("description")}
            className="admin-input"
            rows={3}
            required
            style={{ resize: "vertical", fontFamily: "inherit" }}
          />
          <input type="password" placeholder="Create a password (min 8 chars) *" value={form.password} onChange={set("password")} className="admin-input" required />
          <input type="password" placeholder="Confirm password *" value={form.confirm} onChange={set("confirm")} className="admin-input" required />
          {error && <p className="admin-error">{error}</p>}
          <button type="submit" className="admin-login-btn" disabled={loading}>
            {loading ? "Submitting…" : "Submit Application"}
          </button>
        </form>
        <p style={{ marginTop: "1.25rem", textAlign: "center", fontSize: "0.875rem", color: "var(--ink-muted)" }}>
          Already a partner?{" "}
          <Link href="/affiliates" style={{ color: "var(--psyche-cyan)" }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}
