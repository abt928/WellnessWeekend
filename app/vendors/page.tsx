"use client";
import { useRef, useState, useEffect, useCallback } from "react";
import Link from "next/link";

const SPACE_OPTIONS = [
  { id: "1day-10x10",  label: "1 Day — 10×10 ft",                    price: 75,  days: 1 },
  { id: "3day-10x10",  label: "3 Days — 10×10 ft",                   price: 200, days: 3 },
  { id: "3day-10x20",  label: "3 Days — 10×20 ft",                   price: 300, days: 3 },
  { id: "sponsor",     label: "Sponsor / Partner (Complimentary)",    price: 0,   days: 3 },
] as const;

const EVENT_DAYS = ["Friday, August 7", "Saturday, August 8", "Sunday, August 9"];

const TERMS = `WELLNESS WEEKEND 2026 — VENDOR AGREEMENT
Sound Healing Products LLC d/b/a Wellness Weekend
Warrior Lodge · Sutton, Alaska · August 7–9, 2026

By signing this agreement, the vendor acknowledges and agrees to the following terms and conditions:

1. SPACE & SETUP
Vendor spaces are assigned by festival management. Vendors are responsible for bringing their own tables, chairs, canopies, and display materials. Setup begins Friday, August 7 at 9:00 AM. All vendor structures must be secured and able to withstand wind and weather. Vendors operating in assigned spaces only — no encroachment into neighboring spaces or walkways.

2. FESTIVAL HOURS
Friday, August 7: 12:00 PM – 10:00 PM
Saturday, August 8: 9:00 AM – 11:00 PM
Sunday, August 9: 10:00 AM – 7:00 PM
Vendors are expected to be open during all festival hours on their contracted days. Early breakdown is not permitted without prior written approval from festival management.

3. FEES & PAYMENT
Space fees are due in full at the time of booking. No space is confirmed until payment is received. Fees are non-refundable except in the event of festival cancellation by the organizers. In the event of festival cancellation, a full refund will be issued within 14 days.

4. PRODUCTS & CONDUCT
Vendors may only sell products and services that were disclosed at the time of application. Festival management reserves the right to prohibit the sale of any product deemed inappropriate or inconsistent with the festival's values. Vendors are responsible for the conduct of themselves and their staff. Harassment, discrimination, or disruptive behavior will result in immediate removal without refund.

5. INSURANCE & LICENSING
All vendors are required to carry general liability insurance with a minimum of $1,000,000 per occurrence. Proof of insurance and any applicable business licenses must be provided to festival management before setup begins. Vendors selling food, beverages, or health products may be subject to additional licensing requirements under Alaska law.

6. ELECTRICITY
Electricity access (standard 120V outlet) is available for an additional fee where indicated. Vendors requiring electricity must declare their usage at the time of application. Vendors found using electricity without paying for access will be charged and may be asked to leave.

7. WASTE & LEAVE NO TRACE
Vendors are responsible for maintaining a clean space throughout the event and removing all waste, materials, and equipment at the close of the festival. Vendors generating food waste or excessive packaging are expected to provide their own trash solutions. The festival operates on a Leave No Trace ethic — any vendor found leaving waste or damaging the site will be invoiced for cleanup costs.

8. INDEMNIFICATION
The vendor agrees to indemnify, defend, and hold harmless Sound Healing Products LLC, its organizers, volunteers, staff, partners, and the property owner (Warrior Lodge) from any and all claims, damages, losses, costs, or expenses (including attorney's fees) arising out of or relating to the vendor's participation in the festival, the vendor's products or services, or any act or omission of the vendor or the vendor's employees, agents, or contractors.

9. ASSUMPTION OF RISK
The vendor acknowledges that participation in an outdoor festival in Alaska involves inherent risks, including but not limited to weather, uneven terrain, and wildlife. The vendor accepts full responsibility for the safety of their space, display materials, and inventory.

10. PHOTOGRAPHY & MEDIA
By participating in Wellness Weekend, the vendor grants Sound Healing Products LLC a non-exclusive, royalty-free license to use photographs, video, and other media capturing the vendor's booth or products for promotional and marketing purposes.

11. FORCE MAJEURE
Sound Healing Products LLC shall not be liable for any failure to perform obligations due to circumstances beyond its reasonable control, including but not limited to acts of God, government orders, extreme weather, or public health emergencies.

12. GOVERNING LAW
This agreement is governed by the laws of the State of Alaska. Any disputes shall be resolved in the courts of the Matanuska-Susitna Borough, Alaska.

Questions? Contact us at support@thesoundspace.us or (907) 600-4390.`;

export default function VendorAgreementPage() {
  // Form fields
  const [vendorName,   setVendorName]   = useState("");
  const [businessName, setBusinessName] = useState("");
  const [contactName,  setContactName]  = useState("");
  const [email,        setEmail]        = useState("");
  const [phone,        setPhone]        = useState("");
  const [website,      setWebsite]      = useState("");
  const [category,     setCategory]     = useState("");
  const [description,  setDescription]  = useState("");
  const [spaceType,    setSpaceType]    = useState<string>("");
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [electricity,  setElectricity]  = useState<"yes" | "no" | "">("");
  const [licenseFile,  setLicenseFile]  = useState<File | null>(null);
  const [termsRead,    setTermsRead]    = useState(false);
  const [termsChecked, setTermsChecked] = useState(false);
  const [insChecked,   setInsChecked]   = useState(false);
  const [printedName,  setPrintedName]  = useState("");
  const [sigDate]                       = useState(() =>
    new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
  );
  const [hasSignature, setHasSignature] = useState(false);
  const [submitting,   setSubmitting]   = useState(false);
  const [error,        setError]        = useState("");

  const canvasRef   = useRef<HTMLCanvasElement>(null);
  const isDrawing   = useRef(false);
  const termsBoxRef = useRef<HTMLDivElement>(null);

  const selectedSpace = SPACE_OPTIONS.find((o) => o.id === spaceType);
  const isOneDay = spaceType === "1day-10x10";

  // ── Signature canvas ──────────────────────────────────────────────────────
  const getPos = (e: MouseEvent | TouchEvent, canvas: HTMLCanvasElement) => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    if ("touches" in e) {
      const t = e.touches[0];
      return { x: (t.clientX - rect.left) * scaleX, y: (t.clientY - rect.top) * scaleY };
    }
    return { x: (e.clientX - rect.left) * scaleX, y: (e.clientY - rect.top) * scaleY };
  };

  const startDraw = useCallback((e: MouseEvent | TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    e.preventDefault();
    isDrawing.current = true;
    const ctx = canvas.getContext("2d")!;
    const { x, y } = getPos(e, canvas);
    ctx.beginPath();
    ctx.moveTo(x, y);
  }, []);

  const draw = useCallback((e: MouseEvent | TouchEvent) => {
    if (!isDrawing.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    e.preventDefault();
    const ctx = canvas.getContext("2d")!;
    ctx.strokeStyle = "#1a2a1a";
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    const { x, y } = getPos(e, canvas);
    ctx.lineTo(x, y);
    ctx.stroke();
    setHasSignature(true);
  }, []);

  const endDraw = useCallback(() => { isDrawing.current = false; }, []);

  const clearSig = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.getContext("2d")!.clearRect(0, 0, canvas.width, canvas.height);
    setHasSignature(false);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.addEventListener("mousedown",  startDraw);
    canvas.addEventListener("mousemove",  draw);
    canvas.addEventListener("mouseup",    endDraw);
    canvas.addEventListener("mouseleave", endDraw);
    canvas.addEventListener("touchstart", startDraw, { passive: false });
    canvas.addEventListener("touchmove",  draw,      { passive: false });
    canvas.addEventListener("touchend",   endDraw);
    return () => {
      canvas.removeEventListener("mousedown",  startDraw);
      canvas.removeEventListener("mousemove",  draw);
      canvas.removeEventListener("mouseup",    endDraw);
      canvas.removeEventListener("mouseleave", endDraw);
      canvas.removeEventListener("touchstart", startDraw);
      canvas.removeEventListener("touchmove",  draw);
      canvas.removeEventListener("touchend",   endDraw);
    };
  }, [startDraw, draw, endDraw]);

  // ── Terms scroll detection ────────────────────────────────────────────────
  const onTermsScroll = () => {
    const el = termsBoxRef.current;
    if (!el) return;
    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 10) setTermsRead(true);
  };

  // ── Submit ────────────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!spaceType) { setError("Please select a vendor space."); return; }
    if (isOneDay && selectedDays.length === 0) { setError("Please select which day you will be attending."); return; }
    if (!electricity) { setError("Please indicate whether you need electricity."); return; }
    if (!termsChecked) { setError("Please confirm that you have read and agree to the vendor terms."); return; }
    if (!insChecked) { setError("Please certify that you carry proper licensing and insurance."); return; }
    if (!hasSignature) { setError("Please sign the agreement above."); return; }
    if (!printedName.trim()) { setError("Please enter your printed name."); return; }

    const canvas = canvasRef.current;
    const signatureDataUrl = canvas ? canvas.toDataURL("image/png") : "";

    setSubmitting(true);
    try {
      const res = await fetch("/api/vendor-agreement", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          vendorName:   vendorName.trim(),
          businessName: businessName.trim(),
          contactName:  contactName.trim(),
          email:        email.trim(),
          phone:        phone.trim(),
          website:      website.trim(),
          category:     category.trim(),
          description:  description.trim(),
          spaceType,
          selectedDays: isOneDay ? selectedDays : (selectedSpace?.days === 3 ? EVENT_DAYS : selectedDays),
          electricity,
          printedName:  printedName.trim(),
          sigDate,
          signatureDataUrl,
          priceCents: (selectedSpace?.price ?? 0) * 100,
        }),
      });

      const data = await res.json();
      if (!res.ok) { setError(data.error || "Something went wrong. Please try again."); return; }
      window.location.href = data.redirectUrl;
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const toggleDay = (day: string) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  return (
    <>
      <nav className="legal-nav">
        <Link href="/" className="legal-nav-back">← Back to Wellness Weekend</Link>
      </nav>

      <main className="vendor-page">
        <div className="vendor-container">

          {/* Header */}
          <header className="vendor-header">
            <p className="section-label">August 7–9, 2026 · Sutton, Alaska</p>
            <h1 className="vendor-title">Vendor Agreement</h1>
            <p className="vendor-subtitle">
              Welcome to Wellness Weekend 2026. Complete this agreement to reserve your
              vendor space at Warrior Lodge. Payment is collected securely through Square.
            </p>
          </header>

          <form onSubmit={handleSubmit} className="vendor-form" noValidate>

            {/* ── Section 1: Contact Info ── */}
            <fieldset className="vendor-fieldset">
              <legend className="vendor-legend">1. Vendor Information</legend>
              <div className="vendor-grid-2">
                <div className="vendor-field">
                  <label className="vendor-label" htmlFor="vendorName">Vendor / Business Name *</label>
                  <input
                    id="vendorName"
                    className="vendor-input"
                    type="text"
                    required
                    value={vendorName}
                    onChange={(e) => setVendorName(e.target.value)}
                    placeholder="e.g. Raven Moon Apothecary"
                  />
                </div>
                <div className="vendor-field">
                  <label className="vendor-label" htmlFor="businessName">Legal Business Name</label>
                  <input
                    id="businessName"
                    className="vendor-input"
                    type="text"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="If different from above"
                  />
                </div>
                <div className="vendor-field">
                  <label className="vendor-label" htmlFor="contactName">Contact Person *</label>
                  <input
                    id="contactName"
                    className="vendor-input"
                    type="text"
                    required
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                  />
                </div>
                <div className="vendor-field">
                  <label className="vendor-label" htmlFor="email">Email Address *</label>
                  <input
                    id="email"
                    className="vendor-input"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="vendor-field">
                  <label className="vendor-label" htmlFor="phone">Phone Number *</label>
                  <input
                    id="phone"
                    className="vendor-input"
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
                <div className="vendor-field">
                  <label className="vendor-label" htmlFor="website">Website / Social Media</label>
                  <input
                    id="website"
                    className="vendor-input"
                    type="url"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    placeholder="https://"
                  />
                </div>
                <div className="vendor-field vendor-field--full">
                  <label className="vendor-label" htmlFor="category">Type of Products / Services *</label>
                  <input
                    id="category"
                    className="vendor-input"
                    type="text"
                    required
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="e.g. Crystals & Minerals, Herbal Remedies, Handmade Jewelry"
                  />
                </div>
                <div className="vendor-field vendor-field--full">
                  <label className="vendor-label" htmlFor="description">Brief Description of Your Offerings *</label>
                  <textarea
                    id="description"
                    className="vendor-input vendor-textarea"
                    required
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Tell us a little about what you'll be selling or offering at the festival."
                  />
                </div>
              </div>
            </fieldset>

            {/* ── Section 2: Space Selection ── */}
            <fieldset className="vendor-fieldset">
              <legend className="vendor-legend">2. Space Selection</legend>
              <div className="vendor-space-grid">
                {SPACE_OPTIONS.map((opt) => (
                  <label
                    key={opt.id}
                    className={`vendor-space-card${spaceType === opt.id ? " selected" : ""}`}
                  >
                    <input
                      type="radio"
                      name="spaceType"
                      value={opt.id}
                      checked={spaceType === opt.id}
                      onChange={() => { setSpaceType(opt.id); setSelectedDays([]); }}
                      className="vendor-radio-hidden"
                    />
                    <div className="vendor-space-label">{opt.label}</div>
                    <div className="vendor-space-price">
                      {opt.price === 0 ? "Complimentary" : `$${opt.price}`}
                    </div>
                  </label>
                ))}
              </div>

              {/* Day picker — only shown for 1-day option */}
              {isOneDay && (
                <div className="vendor-days">
                  <p className="vendor-days-label">Select your day:</p>
                  <div className="vendor-days-grid">
                    {EVENT_DAYS.map((day) => (
                      <label key={day} className={`vendor-day-card${selectedDays.includes(day) ? " selected" : ""}`}>
                        <input
                          type="checkbox"
                          checked={selectedDays.includes(day)}
                          onChange={() => toggleDay(day)}
                          className="vendor-radio-hidden"
                        />
                        {day}
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </fieldset>

            {/* ── Section 3: Electricity ── */}
            <fieldset className="vendor-fieldset">
              <legend className="vendor-legend">3. Electricity</legend>
              <p className="vendor-field-hint">Standard 120V access is available for vendors who require it. Please declare your need now so we can plan accordingly.</p>
              <div className="vendor-radio-row">
                <label className={`vendor-radio-card${electricity === "yes" ? " selected" : ""}`}>
                  <input
                    type="radio"
                    name="electricity"
                    value="yes"
                    checked={electricity === "yes"}
                    onChange={() => setElectricity("yes")}
                    className="vendor-radio-hidden"
                  />
                  Yes, I need electricity
                </label>
                <label className={`vendor-radio-card${electricity === "no" ? " selected" : ""}`}>
                  <input
                    type="radio"
                    name="electricity"
                    value="no"
                    checked={electricity === "no"}
                    onChange={() => setElectricity("no")}
                    className="vendor-radio-hidden"
                  />
                  No, I don&apos;t need electricity
                </label>
              </div>
            </fieldset>

            {/* ── Section 4: Insurance / License Upload ── */}
            <fieldset className="vendor-fieldset">
              <legend className="vendor-legend">4. Business License &amp; Insurance</legend>
              <p className="vendor-field-hint">
                All vendors are required to carry general liability insurance ($1M minimum). Upload a copy here, or email it to{" "}
                <a href="mailto:support@thesoundspace.us" className="vendor-inline-link">support@thesoundspace.us</a>{" "}
                before the event. A copy must be on file before your space can be activated.
              </p>
              <div className="vendor-field">
                <label className="vendor-label" htmlFor="licenseFile">Upload Certificate of Insurance / Business License (optional)</label>
                <input
                  id="licenseFile"
                  className="vendor-file-input"
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => setLicenseFile(e.target.files?.[0] ?? null)}
                />
                {licenseFile && (
                  <p className="vendor-file-name">{licenseFile.name}</p>
                )}
              </div>
            </fieldset>

            {/* ── Section 5: Terms & Conditions ── */}
            <fieldset className="vendor-fieldset">
              <legend className="vendor-legend">5. Terms &amp; Conditions</legend>
              <p className="vendor-field-hint">Please read the full agreement below before signing.</p>
              <div
                ref={termsBoxRef}
                className="vendor-terms-box"
                onScroll={onTermsScroll}
                tabIndex={0}
                aria-label="Vendor terms and conditions"
              >
                <pre className="vendor-terms-text">{TERMS}</pre>
              </div>
              {!termsRead && (
                <p className="vendor-scroll-hint">↓ Scroll to the bottom of the agreement to continue</p>
              )}
              <div className={`vendor-checkboxes${termsRead ? "" : " vendor-checkboxes--locked"}`}>
                <label className="vendor-check-label">
                  <input
                    type="checkbox"
                    className="vendor-checkbox"
                    checked={termsChecked}
                    onChange={(e) => setTermsChecked(e.target.checked)}
                    disabled={!termsRead}
                  />
                  <span>
                    I have read and agree to all terms and conditions of the Wellness Weekend 2026 Vendor Agreement.
                  </span>
                </label>
                <label className="vendor-check-label">
                  <input
                    type="checkbox"
                    className="vendor-checkbox"
                    checked={insChecked}
                    onChange={(e) => setInsChecked(e.target.checked)}
                    disabled={!termsRead}
                  />
                  <span>
                    I certify that I carry valid general liability insurance and hold all required business licenses for my jurisdiction, and I will provide proof before the event.
                  </span>
                </label>
              </div>
            </fieldset>

            {/* ── Section 6: Signature ── */}
            <fieldset className="vendor-fieldset">
              <legend className="vendor-legend">6. Signature</legend>
              <p className="vendor-field-hint">Sign below using your mouse or finger.</p>
              <div className="vendor-sig-wrap">
                <canvas
                  ref={canvasRef}
                  className="vendor-sig-canvas"
                  width={700}
                  height={200}
                  aria-label="Signature canvas"
                />
                <button type="button" className="vendor-sig-clear" onClick={clearSig}>
                  Clear
                </button>
              </div>
              <div className="vendor-grid-2" style={{ marginTop: "1rem" }}>
                <div className="vendor-field">
                  <label className="vendor-label" htmlFor="printedName">Printed Name *</label>
                  <input
                    id="printedName"
                    className="vendor-input"
                    type="text"
                    required
                    value={printedName}
                    onChange={(e) => setPrintedName(e.target.value)}
                  />
                </div>
                <div className="vendor-field">
                  <label className="vendor-label">Date</label>
                  <input
                    className="vendor-input vendor-input--readonly"
                    type="text"
                    readOnly
                    value={sigDate}
                  />
                </div>
              </div>
            </fieldset>

            {/* ── Summary & Submit ── */}
            {selectedSpace && (
              <div className="vendor-summary">
                <div className="vendor-summary-label">Space Fee</div>
                <div className="vendor-summary-amount">
                  {selectedSpace.price === 0 ? "Complimentary" : `$${selectedSpace.price}.00`}
                </div>
                {selectedSpace.price > 0 && (
                  <p className="vendor-summary-note">
                    You will be redirected to a secure Square checkout page to complete payment.
                  </p>
                )}
                {selectedSpace.price === 0 && (
                  <p className="vendor-summary-note">
                    No payment is required for sponsor / partner spaces.
                  </p>
                )}
              </div>
            )}

            {error && <div className="vendor-error" role="alert">{error}</div>}

            <button
              type="submit"
              className="vendor-submit"
              disabled={submitting}
            >
              {submitting
                ? "Submitting…"
                : selectedSpace?.price === 0
                ? "Submit Agreement"
                : `Submit & Pay $${selectedSpace?.price ?? "—"}`}
            </button>

          </form>
        </div>
      </main>
    </>
  );
}
