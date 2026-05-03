"use client";
import { useState, FormEvent } from "react";
import { trackFormSubmit } from "@/lib/tracking";
import { MeditateIcon, StorefrontIcon, HandsIcon, DiamondIcon } from "@/components/Icons";

type FormType = "vendor" | "volunteer" | null;

const vendorCategories = [
  "Healing Arts & Bodywork",
  "Crystals & Minerals",
  "Handmade Goods & Artisan",
  "Food & Beverage",
  "Wellness Products",
  "Spiritual Tools & Books",
  "Clothing & Accessories",
  "Other",
];

const volunteerInterests = [
  "Setup & Teardown",
  "Registration & Check-In",
  "Stage & Sound Support",
  "Wellness Tent Assistance",
  "Vendor Village Coordination",
  "Photography & Social Media",
  "Parking & Transportation",
  "General Support",
];

const availabilityOptions = [
  "Friday Only",
  "Saturday Only",
  "Sunday Only",
  "Friday + Saturday",
  "Saturday + Sunday",
  "Full Weekend",
];

export default function GetInvolved() {
  const [activeForm, setActiveForm] = useState<FormType>(null);
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      const res = await fetch(`/api/${activeForm}s`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error();
      setStatus("success");
      trackFormSubmit({
        description: `${activeForm}_application`,
        email: data.email as string,
      });
    } catch {
      setStatus("error");
    }
  }

  return (
    <section id="get-involved" className="section get-involved">
      <p className="section-label">Join the Circle</p>
      <h2 className="section-title" style={{ fontFamily: "var(--font-display)" }}>
        Get <em>Involved</em>
      </h2>
      <p className="section-desc">
        Wellness Weekend is built by community. Whether you&apos;re a healer, maker,
        or someone who wants to serve, there&apos;s a place for you.
      </p>

      <div className="involve-grid">
        {/* Instructor - Waitlist */}
        <div className="involve-card">
          <div className="involve-icon"><MeditateIcon size={32} color="var(--psyche-cyan)" /></div>
          <h3 className="involve-title" style={{ fontFamily: "var(--font-display)" }}>
            Instructor Application
          </h3>
          <p className="involve-desc">
            Instructor applications for 2026 are now full. Join the waitlist
            to be notified of openings or for priority consideration in future years.
          </p>
          <ul className="involve-perks">
            <li>Applications are full for 2026</li>
            <li>Waitlist for cancellations</li>
            <li>Priority for 2027 gathering</li>
          </ul>
          <button
            className="involve-btn"
            style={{ opacity: 0.7, background: "var(--sage)" }}
            onClick={() => { setActiveForm("vendor"); setStatus("idle"); }}
          >
            Join Waitlist
          </button>
        </div>

        {/* Vendor */}
        <div className="involve-card">
          <div className="involve-icon"><StorefrontIcon size={32} color="var(--psyche-cyan)" /></div>
          <h3 className="involve-title" style={{ fontFamily: "var(--font-display)" }}>
            Vendor Application
          </h3>
          <p className="involve-desc">
            Share your healing arts, handmade goods, crystals, wellness products, or
            food with our community of 200+ seekers.
          </p>
          <ul className="involve-perks">
            <li>10×10 booth space included</li>
            <li>Full weekend vendor pass</li>
            <li>Access to all ceremonies</li>
            <li>Listing on festival website</li>
          </ul>
          <button
            className="involve-btn"
            onClick={() => { setActiveForm("vendor"); setStatus("idle"); }}
          >
            Apply as Vendor
          </button>
        </div>

        {/* Volunteer */}
        <div className="involve-card">
          <div className="involve-icon"><HandsIcon size={32} color="var(--psyche-cyan)" /></div>
          <h3 className="involve-title" style={{ fontFamily: "var(--font-display)" }}>
            Volunteer Application
          </h3>
          <p className="involve-desc">
            Give your time and energy to help create this sacred container. Volunteers
            are the heartbeat of Wellness Weekend.
          </p>
          <ul className="involve-perks">
            <li>Free weekend pass</li>
            <li>Volunteer camping included</li>
            <li>Meals provided during shifts</li>
          </ul>
          <button
            className="involve-btn"
            onClick={() => { setActiveForm("volunteer"); setStatus("idle"); }}
          >
            Apply as Volunteer
          </button>
        </div>

        {/* Sponsor */}
        <div className="involve-card">
          <div className="involve-icon"><DiamondIcon size={32} color="var(--psyche-cyan)" /></div>
          <h3 className="involve-title" style={{ fontFamily: "var(--font-display)" }}>
            Sponsor Application
          </h3>
          <p className="involve-desc">
            Align your brand with Alaska&apos;s premier healing arts festival. Custom
            sponsorship packages designed for maximum visibility and impact.
          </p>
          <ul className="involve-perks">
            <li>Logo on all festival materials</li>
            <li>Dedicated brand activation space</li>
            <li>VIP passes for your team</li>
            <li>Social media features</li>
          </ul>
          <button
            className="involve-btn"
            onClick={() => { setActiveForm("vendor"); setStatus("idle"); }}
          >
            Apply as Sponsor
          </button>
        </div>
      </div>

      {/* Modal Overlay */}
      {activeForm && (
        <div className="modal-overlay" onClick={() => setActiveForm(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setActiveForm(null)}>✕</button>

            {status === "success" ? (
              <div className="modal-success">
                <div className="modal-success-icon">✨</div>
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", color: "var(--forest)" }}>
                  Application Received!
                </h3>
                <p style={{ color: "var(--sage)", marginTop: "0.5rem" }}>
                  We&apos;ll be in touch soon. See you under the midnight sun.
                </p>
                <button className="involve-btn" style={{ marginTop: "1.5rem" }} onClick={() => setActiveForm(null)}>
                  Close
                </button>
              </div>
            ) : (
              <>
                <h3 className="modal-title" style={{ fontFamily: "var(--font-display)" }}>
                  {activeForm === "vendor" ? "🏪 Vendor Application" : "🙌 Volunteer Application"}
                </h3>

                <form onSubmit={handleSubmit} className="modal-form">
                  <div className="form-row">
                    <div className="form-group">
                      <label>Name *</label>
                      <input name="name" required placeholder="Your full name" />
                    </div>
                    <div className="form-group">
                      <label>Email *</label>
                      <input name="email" type="email" required placeholder="you@email.com" />
                    </div>
                  </div>

                  {activeForm === "vendor" ? (
                    <>
                      <div className="form-row">
                        <div className="form-group">
                          <label>Business Name *</label>
                          <input name="business" required placeholder="Your business name" />
                        </div>
                        <div className="form-group">
                          <label>Category *</label>
                          <select name="category" required>
                            <option value="">Select category</option>
                            {vendorCategories.map((c) => <option key={c} value={c}>{c}</option>)}
                          </select>
                        </div>
                      </div>
                      <div className="form-group">
                        <label>Website</label>
                        <input name="website" placeholder="https://yoursite.com" />
                      </div>
                      <div className="form-group">
                        <label>Tell us about your offerings *</label>
                        <textarea name="description" required rows={3} placeholder="Describe what you'd bring to the festival..." />
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="form-row">
                        <div className="form-group">
                          <label>Phone</label>
                          <input name="phone" placeholder="(555) 123-4567" />
                        </div>
                        <div className="form-group">
                          <label>Area of Interest *</label>
                          <select name="interest" required>
                            <option value="">Select area</option>
                            {volunteerInterests.map((v) => <option key={v} value={v}>{v}</option>)}
                          </select>
                        </div>
                      </div>
                      <div className="form-group">
                        <label>Availability *</label>
                        <select name="availability" required>
                          <option value="">Select availability</option>
                          {availabilityOptions.map((a) => <option key={a} value={a}>{a}</option>)}
                        </select>
                      </div>
                      <div className="form-group">
                        <label>Relevant Experience</label>
                        <textarea name="experience" rows={3} placeholder="Any relevant experience or skills..." />
                      </div>
                    </>
                  )}

                  <button type="submit" className="form-submit" disabled={status === "sending"}>
                    {status === "sending" ? "Submitting..." : status === "error" ? "Try Again" : "Submit Application"}
                  </button>
                  {status === "error" && (
                    <p style={{ color: "var(--coral)", textAlign: "center", fontSize: "0.85rem", marginTop: "0.5rem" }}>
                      Something went wrong. Please try again.
                    </p>
                  )}
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
