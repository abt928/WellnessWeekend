"use client";
import { useState, useEffect, useId, useRef, FormEvent } from "react";
import Link from "next/link";
import { trackFormSubmit } from "@/lib/tracking";
import { useFocusTrap } from "@/lib/useFocusTrap";
import { MeditateIcon, StorefrontIcon, HandsIcon, DiamondIcon, CloseIcon, SparklesIcon } from "@/components/Icons";

type FormType = "vendor" | "volunteer" | "sponsor" | "instructor_waitlist" | null;

const apiPathByForm: Record<NonNullable<FormType>, string> = {
  vendor: "/api/vendors",
  volunteer: "/api/volunteers",
  sponsor: "/api/sponsors",
  instructor_waitlist: "/api/instructor-waitlist",
};

const modalTitleByForm: Record<NonNullable<FormType>, string> = {
  vendor: "Vendor Application",
  volunteer: "Volunteer Application",
  sponsor: "Sponsor Inquiry",
  instructor_waitlist: "Instructor Waitlist",
};

const successCopyByForm: Record<NonNullable<FormType>, { heading: string; body: string }> = {
  vendor: {
    heading: "Application Received!",
    body: "We'll be in touch soon. See you under the midnight sun.",
  },
  volunteer: {
    heading: "Application Received!",
    body: "We'll be in touch soon. See you under the midnight sun.",
  },
  sponsor: {
    heading: "Inquiry Received",
    body: "Thank you. We'll review and reply with a tailored proposal within a week.",
  },
  instructor_waitlist: {
    heading: "You're on the List",
    body: "We'll reach out if a 2026 spot opens, and you're prioritized for 2027.",
  },
};

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

const sponsorActivationOptions = [
  "Logo placement & branding",
  "On-site brand activation",
  "Product sampling",
  "Speaker / session sponsorship",
  "Co-branded content",
  "Other",
];

const sponsorBudgetRanges = [
  "Under $1k",
  "$1k–5k",
  "$5k–15k",
  "$15k–50k",
  "$50k+",
  "Tell us",
];

export default function GetInvolved() {
  const [activeForm, setActiveForm] = useState<FormType>(null);
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const titleId = useId();

  function openForm(form: NonNullable<FormType>) {
    setActiveForm(form);
    setStatus("idle");
    setErrorMsg(null);
  }

  function closeForm() {
    setActiveForm(null);
    setErrorMsg(null);
  }

  useEffect(() => {
    if (!activeForm) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") closeForm();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [activeForm]);

  useFocusTrap(activeForm !== null, modalRef);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!activeForm) return;
    setErrorMsg(null);
    setStatus("sending");

    const formData = new FormData(e.currentTarget);
    let payload: Record<string, unknown>;

    if (activeForm === "sponsor") {
      const interests = formData.getAll("interests").map(String);
      if (interests.length === 0) {
        setStatus("error");
        setErrorMsg("Pick at least one activation interest.");
        return;
      }
      payload = {
        name: formData.get("name"),
        email: formData.get("email"),
        phone: formData.get("phone"),
        company: formData.get("company"),
        website: formData.get("website"),
        interests,
        budgetRange: formData.get("budgetRange"),
        goals: formData.get("goals"),
        source: formData.get("source"),
      };
    } else if (activeForm === "instructor_waitlist") {
      const interests = formData.getAll("interests").map(String);
      const interestedIn2026 = interests.includes("2026");
      const interestedIn2027 = interests.includes("2027");
      if (!interestedIn2026 && !interestedIn2027) {
        setStatus("error");
        setErrorMsg("Pick at least one: 2026 openings, 2027 priority, or both.");
        return;
      }
      payload = {
        name: formData.get("name"),
        email: formData.get("email"),
        phone: formData.get("phone"),
        modality: formData.get("modality"),
        yearsTeaching: formData.get("yearsTeaching"),
        website: formData.get("website"),
        interestedIn2026,
        interestedIn2027,
        offering: formData.get("offering"),
      };
    } else {
      payload = Object.fromEntries(formData.entries());
    }

    try {
      const res = await fetch(apiPathByForm[activeForm], {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        let serverMsg: string | null = null;
        try {
          const data = await res.json();
          if (data && typeof data.error === "string") serverMsg = data.error;
        } catch {}
        setStatus("error");
        setErrorMsg(serverMsg ?? "Something went wrong. Please try again.");
        return;
      }
      setStatus("success");
      const email = payload.email;
      trackFormSubmit({
        description: `${activeForm}_application`,
        email: typeof email === "string" ? email : "",
      });
    } catch {
      setStatus("error");
      setErrorMsg("Something went wrong. Please try again.");
    }
  }

  return (
    <section id="get-involved" className="section get-involved">
      <p className="section-label">Join the Circle</p>
      <h2 className="section-title">
        Get involved.
      </h2>
      <p className="section-desc">
        Wellness Weekend is built by community. Whether you&apos;re a healer, maker,
        or someone who wants to serve, there&apos;s a place for you.
      </p>

      <div className="involve-grid">
        {/* Vendor */}
        <div className="involve-card">
          <div className="involve-icon"><StorefrontIcon size={32} color="var(--psyche-cyan)" /></div>
          <h3 className="involve-title">
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
          <Link href="/vendors" className="involve-btn" style={{ display: "block", textAlign: "center" }}>
            Apply as Vendor
          </Link>
        </div>

        {/* Sponsor */}
        <div className="involve-card">
          <div className="involve-icon"><DiamondIcon size={32} color="var(--psyche-cyan)" /></div>
          <h3 className="involve-title">
            Sponsor Inquiry
          </h3>
          <p className="involve-desc">
            Align your brand with Alaska&apos;s premier healing arts festival. Custom
            sponsorship packages designed for maximum visibility and impact.
          </p>
          <ul className="involve-perks">
            <li>Logo on all festival materials</li>
            <li>Dedicated brand activation space</li>
            <li>Social media features</li>
          </ul>
          <button className="involve-btn" onClick={() => openForm("sponsor")}>
            Apply as Sponsor
          </button>
        </div>

        {/* Volunteer */}
        <div className="involve-card">
          <div className="involve-icon"><HandsIcon size={32} color="var(--psyche-cyan)" /></div>
          <h3 className="involve-title">
            Volunteer Application
          </h3>
          <p className="involve-desc">
            Give your time and energy to help create this sacred container. Volunteers
            are the heartbeat of Wellness Weekend.
          </p>
          <ul className="involve-perks">
            <li>Free weekend pass</li>
            <li>Volunteer camping included</li>
          </ul>
          <button className="involve-btn" onClick={() => openForm("volunteer")}>
            Apply as Volunteer
          </button>
        </div>

        {/* Instructor - Waitlist */}
        <div className="involve-card">
          <div className="involve-icon"><MeditateIcon size={32} color="var(--psyche-cyan)" /></div>
          <h3 className="involve-title">
            Instructor Waitlist
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
            onClick={() => openForm("instructor_waitlist")}
          >
            Join Waitlist
          </button>
        </div>
      </div>

      {/* Modal Overlay */}
      {activeForm && (
        <div className="modal-overlay" onClick={closeForm}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            ref={modalRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
          >
            <button className="modal-close" onClick={closeForm} aria-label="Close dialog"><CloseIcon size={18} /></button>

            {status === "success" ? (
              <div className="modal-success">
                <div className="modal-success-icon" aria-hidden="true"><SparklesIcon size={36} color="var(--gold)" /></div>
                <h3 id={titleId} style={{ fontSize: "1.5rem", color: "var(--forest)", margin: 0 }}>
                  {successCopyByForm[activeForm].heading}
                </h3>
                <p style={{ color: "var(--sage)", marginTop: "0.5rem" }}>
                  {successCopyByForm[activeForm].body}
                </p>
                <button className="involve-btn" style={{ marginTop: "1.5rem" }} onClick={closeForm}>
                  Close
                </button>
              </div>
            ) : (
              <>
                <h3 id={titleId} className="modal-title">
                  {modalTitleByForm[activeForm]}
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

                  {activeForm === "vendor" && (
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
                  )}

                  {activeForm === "volunteer" && (
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

                  {activeForm === "sponsor" && (
                    <>
                      <div className="form-row">
                        <div className="form-group">
                          <label>Phone</label>
                          <input name="phone" placeholder="(555) 123-4567" />
                        </div>
                        <div className="form-group">
                          <label>Company / Brand *</label>
                          <input name="company" required placeholder="Your company name" />
                        </div>
                      </div>
                      <div className="form-group">
                        <label>Website</label>
                        <input name="website" placeholder="https://yourbrand.com" />
                      </div>
                      <div className="form-group">
                        <label>Activation interests *</label>
                        <div className="checkbox-group">
                          {sponsorActivationOptions.map((opt) => (
                            <label key={opt} className="checkbox-item">
                              <input type="checkbox" name="interests" value={opt} />
                              <span>{opt}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                      <div className="form-group">
                        <label>Budget range *</label>
                        <select name="budgetRange" required>
                          <option value="">Select range</option>
                          {sponsorBudgetRanges.map((b) => <option key={b} value={b}>{b}</option>)}
                        </select>
                      </div>
                      <div className="form-group">
                        <label>Tell us about your brand and goals *</label>
                        <textarea
                          name="goals"
                          required
                          rows={4}
                          placeholder="What does a partnership look like for you? What are you hoping to accomplish?"
                        />
                      </div>
                      <div className="form-group">
                        <label>How did you hear about us?</label>
                        <input name="source" placeholder="Optional" />
                      </div>
                    </>
                  )}

                  {activeForm === "instructor_waitlist" && (
                    <>
                      <div className="form-row">
                        <div className="form-group">
                          <label>Phone</label>
                          <input name="phone" placeholder="(555) 123-4567" />
                        </div>
                        <div className="form-group">
                          <label>Modality *</label>
                          <input
                            name="modality"
                            required
                            placeholder="Sound healing, breathwork, yoga, etc."
                          />
                        </div>
                      </div>
                      <div className="form-row">
                        <div className="form-group">
                          <label>Years teaching</label>
                          <input
                            name="yearsTeaching"
                            type="number"
                            min={0}
                            max={80}
                            placeholder="e.g. 8"
                          />
                        </div>
                        <div className="form-group">
                          <label>Website / sample</label>
                          <input name="website" placeholder="https://yoursite.com" />
                        </div>
                      </div>
                      <div className="form-group">
                        <label>Interested in *</label>
                        <div className="checkbox-group">
                          <label className="checkbox-item">
                            <input type="checkbox" name="interests" value="2026" />
                            <span>2026 cancellation openings</span>
                          </label>
                          <label className="checkbox-item">
                            <input type="checkbox" name="interests" value="2027" />
                            <span>2027 priority consideration</span>
                          </label>
                        </div>
                      </div>
                      <div className="form-group">
                        <label>Briefly describe what you&apos;d bring *</label>
                        <textarea
                          name="offering"
                          required
                          rows={4}
                          placeholder="Modality, format, what makes your offering distinctive..."
                        />
                      </div>
                    </>
                  )}

                  <button type="submit" className="form-submit" disabled={status === "sending"}>
                    {status === "sending"
                      ? "Submitting..."
                      : status === "error"
                      ? "Try Again"
                      : activeForm === "sponsor"
                      ? "Submit Inquiry"
                      : activeForm === "instructor_waitlist"
                      ? "Join Waitlist"
                      : "Submit Application"}
                  </button>
                  {status === "error" && errorMsg && (
                    <p style={{ color: "var(--coral)", textAlign: "center", fontSize: "0.85rem", marginTop: "0.5rem" }}>
                      {errorMsg}
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
