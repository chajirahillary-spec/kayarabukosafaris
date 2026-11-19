"use client";

import { useState } from "react";
import Link from "next/link";
import type { Safari, AccommodationTier, TransportType } from "@/lib/types";
import { formatUsd } from "@/components/ui/commerce";
import { Button } from "@/components/ui/Button";
import { calculateBookingPricing } from "@/lib/bookings/pricing";
import type { Booking } from "@/lib/bookings/types";

export function BookingFlow({ safari }: { safari: Safari }) {
  const [step, setStep] = useState<"details" | "customer" | "payment" | "confirmed">("details");

  // Itinerary options
  const [departureDate, setDepartureDate] = useState("");
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [tier, setTier] = useState<AccommodationTier>(safari.tier);
  const [transport, setTransport] = useState<TransportType>(safari.transport);
  const [optionalExperiences, setOptionalExperiences] = useState<string[]>([]);
  const [pickupLocation, setPickupLocation] = useState("Nairobi Hotel or Jomo Kenyatta Airport (NBO)");

  // Customer info
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("Kenya");
  const [emergencyName, setEmergencyName] = useState("");
  const [emergencyPhone, setEmergencyPhone] = useState("");
  const [emergencyRelation, setEmergencyRelation] = useState("");
  const [specialRequests, setSpecialRequests] = useState("");

  // Payment states
  const [paymentProvider, setPaymentProvider] = useState<"mpesa" | "card">("mpesa");
  const [mpesaPhone, setMpesaPhone] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [bookingResult, setBookingResult] = useState<Booking | null>(null);
  const [paymentNotice, setPaymentNotice] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Live client estimated calculation (server re-calculates on submit)
  const pricing = calculateBookingPricing({
    basePricePerPersonUsd: safari.fromPriceUsd,
    adults,
    children,
    tier,
    transport,
    optionalExperiences,
  });

  const toggleExp = (expId: string) => {
    setOptionalExperiences((prev) =>
      prev.includes(expId) ? prev.filter((e) => e !== expId) : [...prev, expId]
    );
  };

  const handleCreateBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setErrorMsg(null);

    try {
      // 1. Create booking in Firestore via API
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          safariSlug: safari.slug,
          departureDate,
          adults,
          children,
          tier,
          transport,
          optionalExperiences,
          customerName: name,
          customerEmail: email,
          customerPhone: phone,
          country,
          pickupLocation,
          emergencyContact: {
            name: emergencyName || "Not provided",
            relationship: emergencyRelation || "Not provided",
            phone: emergencyPhone || "Not provided",
          },
          specialRequests,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to create booking.");
      }

      setBookingResult(data.booking);

      // 2. Initiate Payment
      const payRes = await fetch("/api/payments/initiate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId: data.booking.id,
          customerId: email,
          amount: data.booking.depositAmountUsd,
          currency: "USD",
          provider: paymentProvider,
          customerPhone: paymentProvider === "mpesa" ? mpesaPhone || phone : phone,
          customerEmail: email,
          customerName: name,
        }),
      });

      const payData = await payRes.json();
      setPaymentNotice(payData.message);
      setStep("confirmed");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "An error occurred during booking.";
      setErrorMsg(message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_380px]">
      <div>
        {/* Step indicator */}
        <div className="mb-6 flex border-b border-charcoal/15 pb-4 text-xs font-semibold uppercase tracking-[0.14em]">
          <span className={step === "details" ? "text-green border-b-2 border-green pb-4 -mb-4" : "text-charcoal/40"}>
            1. Safari Options
          </span>
          <span className="mx-4 text-charcoal/30">/</span>
          <span className={step === "customer" ? "text-green border-b-2 border-green pb-4 -mb-4" : "text-charcoal/40"}>
            2. Traveller Details
          </span>
          <span className="mx-4 text-charcoal/30">/</span>
          <span className={step === "payment" ? "text-green border-b-2 border-green pb-4 -mb-4" : "text-charcoal/40"}>
            3. Deposit Payment
          </span>
        </div>

        {errorMsg && (
          <div className="mb-6 rounded-ka border border-red-500/50 bg-red-50 p-4 text-sm text-red-800">
            {errorMsg}
          </div>
        )}

        {/* STEP 1: Details */}
        {step === "details" && (
          <div className="space-y-6">
            <div>
              <label htmlFor="b-date" className="block text-xs font-semibold uppercase tracking-[0.12em] text-green mb-1">
                Departure Date *
              </label>
              <input
                id="b-date"
                type="date"
                required
                value={departureDate}
                onChange={(e) => setDepartureDate(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
                className="h-12 w-full max-w-sm rounded-ka border border-charcoal/25 bg-ivory px-3 text-sm"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-[0.12em] text-green mb-1">
                  Adults (12+ years)
                </label>
                <input
                  type="number"
                  min={1}
                  max={20}
                  value={adults}
                  onChange={(e) => setAdults(Math.max(1, Number(e.target.value)))}
                  className="h-12 w-full rounded-ka border border-charcoal/25 bg-ivory px-3 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-[0.12em] text-green mb-1">
                  Children (Under 12 years)
                </label>
                <input
                  type="number"
                  min={0}
                  max={15}
                  value={children}
                  onChange={(e) => setChildren(Math.max(0, Number(e.target.value)))}
                  className="h-12 w-full rounded-ka border border-charcoal/25 bg-ivory px-3 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-[0.12em] text-green mb-2">
                Accommodation Tier
              </label>
              <div className="grid gap-3 sm:grid-cols-3">
                {[
                  { id: "budget", name: "Budget", desc: "Adventure camps & bandas" },
                  { id: "mid-range", name: "Mid-Range", desc: "Comfortable lodges & camps" },
                  { id: "luxury", name: "Luxury", desc: "Exclusive luxury tented suites" },
                ].map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setTier(t.id as AccommodationTier)}
                    className={`rounded-ka border p-3 text-left transition-all ${
                      tier === t.id
                        ? "border-green bg-green/10 text-green font-medium"
                        : "border-charcoal/20 bg-ivory text-charcoal hover:border-gold"
                    }`}
                  >
                    <span className="font-semibold block">{t.name}</span>
                    <span className="text-xs text-charcoal/70">{t.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-[0.12em] text-green mb-2">
                Safari Transport
              </label>
              <div className="grid gap-3 sm:grid-cols-3">
                {[
                  { id: "safari-van", name: "Safari Van", desc: "Pop-up roof 4x4 van" },
                  { id: "land-cruiser", name: "Land Cruiser", desc: "Heavy-duty 4x4 Cruiser" },
                  { id: "fly-in", name: "Fly-in Safari", desc: "Direct bush light flights" },
                ].map((tr) => (
                  <button
                    key={tr.id}
                    type="button"
                    onClick={() => setTransport(tr.id as TransportType)}
                    className={`rounded-ka border p-3 text-left transition-all ${
                      transport === tr.id
                        ? "border-green bg-green/10 text-green font-medium"
                        : "border-charcoal/20 bg-ivory text-charcoal hover:border-gold"
                    }`}
                  >
                    <span className="font-semibold block">{tr.name}</span>
                    <span className="text-xs text-charcoal/70">{tr.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-[0.12em] text-green mb-2">
                Optional Safari Add-ons
              </label>
              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  { id: "balloon_safari", name: "Hot-Air Balloon Safari & Bush Breakfast", cost: 450 },
                  { id: "maasai_village_visit", name: "Maasai / Samburu Cultural Visit", cost: 40 },
                  { id: "night_game_drive", name: "Night Game Drive in Conservancy", cost: 85 },
                  { id: "guided_bush_walk", name: "Guided Bush Walk with Naturalist", cost: 50 },
                ].map((add) => {
                  const selected = optionalExperiences.includes(add.id);
                  return (
                    <button
                      key={add.id}
                      type="button"
                      onClick={() => toggleExp(add.id)}
                      className={`flex items-center justify-between rounded-ka border p-3 text-left text-xs ${
                        selected
                          ? "border-green bg-green text-ivory"
                          : "border-charcoal/20 bg-ivory text-charcoal hover:border-gold"
                      }`}
                    >
                      <span>{add.name}</span>
                      <span className="font-semibold">+{formatUsd(add.cost)}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label htmlFor="b-pickup" className="block text-xs font-semibold uppercase tracking-[0.12em] text-green mb-1">
                Pickup Location in Kenya
              </label>
              <input
                id="b-pickup"
                type="text"
                value={pickupLocation}
                onChange={(e) => setPickupLocation(e.target.value)}
                placeholder="e.g. Hotel in Nairobi, or JKIA Flight #..."
                className="h-12 w-full rounded-ka border border-charcoal/25 bg-ivory px-3 text-sm"
              />
            </div>

            <div className="pt-4">
              <Button
                onClick={() => {
                  if (!departureDate) {
                    setErrorMsg("Please select a departure date to continue.");
                    return;
                  }
                  setErrorMsg(null);
                  setStep("customer");
                }}
              >
                Continue to Traveller Details →
              </Button>
            </div>
          </div>
        )}

        {/* STEP 2: Customer Info */}
        {step === "customer" && (
          <div className="space-y-6">
            <h3 className="font-display text-2xl text-green">Traveller Information</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-[0.12em] text-green mb-1">
                  Full Name (Primary Traveller) *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-12 w-full rounded-ka border border-charcoal/25 bg-ivory px-3 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-[0.12em] text-green mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 w-full rounded-ka border border-charcoal/25 bg-ivory px-3 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-[0.12em] text-green mb-1">
                  Phone / WhatsApp *
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+254 700 000 000"
                  className="h-12 w-full rounded-ka border border-charcoal/25 bg-ivory px-3 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-[0.12em] text-green mb-1">
                  Country of Residence *
                </label>
                <input
                  type="text"
                  required
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="h-12 w-full rounded-ka border border-charcoal/25 bg-ivory px-3 text-sm"
                />
              </div>
            </div>

            <div className="border-t border-charcoal/15 pt-4">
              <h4 className="font-semibold text-green mb-3 text-sm">Emergency Contact</h4>
              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-[0.12em] text-green mb-1">
                    Contact Name
                  </label>
                  <input
                    type="text"
                    value={emergencyName}
                    onChange={(e) => setEmergencyName(e.target.value)}
                    className="h-12 w-full rounded-ka border border-charcoal/25 bg-ivory px-3 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-[0.12em] text-green mb-1">
                    Relationship
                  </label>
                  <input
                    type="text"
                    value={emergencyRelation}
                    onChange={(e) => setEmergencyRelation(e.target.value)}
                    placeholder="e.g. Spouse, Sibling"
                    className="h-12 w-full rounded-ka border border-charcoal/25 bg-ivory px-3 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-[0.12em] text-green mb-1">
                    Emergency Phone
                  </label>
                  <input
                    type="tel"
                    value={emergencyPhone}
                    onChange={(e) => setEmergencyPhone(e.target.value)}
                    className="h-12 w-full rounded-ka border border-charcoal/25 bg-ivory px-3 text-sm"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-[0.12em] text-green mb-1">
                Special Requests or Dietary Requirements
              </label>
              <textarea
                rows={2}
                value={specialRequests}
                onChange={(e) => setSpecialRequests(e.target.value)}
                placeholder="Vegetarian, allergies, anniversary celebration..."
                className="w-full rounded-ka border border-charcoal/25 bg-ivory p-3 text-sm"
              />
            </div>

            <div className="flex gap-4 pt-4">
              <Button variant="secondary" onClick={() => setStep("details")}>
                ← Back
              </Button>
              <Button
                onClick={() => {
                  if (!name || !email || !phone) {
                    setErrorMsg("Please fill in your name, email, and phone number.");
                    return;
                  }
                  setErrorMsg(null);
                  setStep("payment");
                }}
              >
                Proceed to Payment →
              </Button>
            </div>
          </div>
        )}

        {/* STEP 3: Payment */}
        {step === "payment" && (
          <form onSubmit={handleCreateBooking} className="space-y-6">
            <h3 className="font-display text-2xl text-green">Select Payment Method</h3>
            <p className="text-sm text-charcoal/80">
              A 30% deposit of <strong>{formatUsd(pricing.depositAmountUsd)}</strong> is required to confirm camp reservations and vehicle allocation.
            </p>

            <div className="grid gap-4 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => setPaymentProvider("mpesa")}
                className={`rounded-ka border p-5 text-left transition-all ${
                  paymentProvider === "mpesa"
                    ? "border-green bg-green/10 text-green font-medium"
                    : "border-charcoal/20 bg-ivory text-charcoal hover:border-gold"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-display text-2xl">M-Pesa</span>
                  <span className="rounded-ka bg-green/20 px-2 py-0.5 text-xs text-green font-semibold">
                    Instant Kenya STK
                  </span>
                </div>
                <p className="mt-2 text-xs text-charcoal/70">
                  Pay via M-Pesa mobile money prompt on your phone (Safaricom).
                </p>
              </button>

              <button
                type="button"
                onClick={() => setPaymentProvider("card")}
                className={`rounded-ka border p-5 text-left transition-all ${
                  paymentProvider === "card"
                    ? "border-green bg-green/10 text-green font-medium"
                    : "border-charcoal/20 bg-ivory text-charcoal hover:border-gold"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-display text-2xl">Credit / Debit Card</span>
                  <span className="rounded-ka bg-gold/20 px-2 py-0.5 text-xs text-charcoal font-semibold">
                    Visa / Mastercard
                  </span>
                </div>
                <p className="mt-2 text-xs text-charcoal/70">
                  Secure international card checkout via encrypted gateway.
                </p>
              </button>
            </div>

            {paymentProvider === "mpesa" && (
              <div className="border border-green/30 bg-cream/40 p-4">
                <label className="block text-xs font-semibold uppercase tracking-[0.12em] text-green mb-1">
                  M-Pesa Phone Number (254...)
                </label>
                <input
                  type="tel"
                  required
                  value={mpesaPhone || phone}
                  onChange={(e) => setMpesaPhone(e.target.value)}
                  placeholder="254700000000"
                  className="h-12 w-full max-w-sm rounded-ka border border-charcoal/25 bg-ivory px-3 text-sm"
                />
                <p className="mt-2 text-xs text-charcoal/70">
                  A PIN prompt will appear on this handset to authorise payment.
                </p>
              </div>
            )}

            <div className="flex gap-4 pt-4">
              <Button variant="secondary" onClick={() => setStep("customer")} disabled={isProcessing}>
                ← Back
              </Button>
              <Button type="submit" disabled={isProcessing}>
                {isProcessing
                  ? "Processing..."
                  : `Confirm & Pay Deposit (${formatUsd(pricing.depositAmountUsd)})`}
              </Button>
            </div>
          </form>
        )}

        {/* STEP 4: Confirmed Confirmation Screen */}
        {step === "confirmed" && bookingResult && (
          <div className="border border-green bg-ivory p-8">
            <p className="text-[12px] font-semibold uppercase tracking-[0.2em] text-gold">
              Booking Received
            </p>
            <h3 className="font-display mt-2 text-4xl text-green">
              Safari Journey Initialized!
            </h3>
            <p className="mt-2 text-sm text-charcoal/80">
              Booking Reference:{" "}
              <strong className="text-green text-base">
                {bookingResult.bookingReference}
              </strong>
            </p>

            {paymentNotice && (
              <div className="mt-6 border-l-4 border-gold bg-cream/60 p-4 text-sm text-charcoal/90">
                <strong>Payment Notice:</strong> {paymentNotice}
              </div>
            )}

            <div className="mt-8 border-t border-charcoal/15 pt-6 text-sm space-y-2">
              <p>
                <strong>Safari:</strong> {bookingResult.safariTitle}
              </p>
              <p>
                <strong>Departure:</strong> {bookingResult.departureDate} ({bookingResult.durationDays} Days)
              </p>
              <p>
                <strong>Travellers:</strong> {bookingResult.adults} Adults
                {bookingResult.children > 0 ? `, ${bookingResult.children} Children` : ""}
              </p>
              <p>
                <strong>Deposit Amount:</strong> {formatUsd(bookingResult.depositAmountUsd)}
              </p>
              <p>
                <strong>Remaining Balance:</strong> {formatUsd(bookingResult.remainingBalanceUsd)}
              </p>
            </div>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/account"
                className="rounded-ka bg-green px-5 py-3 text-xs font-semibold uppercase tracking-wider text-ivory hover:bg-forest"
              >
                Go to My Account & Digital Itinerary →
              </Link>
              <Link
                href="/"
                className="rounded-ka border border-gold px-5 py-3 text-xs font-semibold uppercase tracking-wider text-green hover:bg-cream"
              >
                Return to Homepage
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Right Column: Dynamic Price Summary */}
      <aside className="h-fit space-y-4 border border-gold/60 bg-cream/40 p-6 lg:sticky lg:top-24">
        <h3 className="font-display text-2xl text-green">Booking Summary</h3>
        <p className="text-sm font-semibold text-charcoal">{safari.title}</p>
        <p className="text-xs text-charcoal/70">{safari.days} Days / {safari.days - 1} Nights</p>

        <div className="border-t border-charcoal/15 pt-4 space-y-2 text-xs">
          <div className="flex justify-between">
            <span className="text-charcoal/80">Base Rate ({adults} Adults)</span>
            <span className="font-semibold">{formatUsd(pricing.adultsTotal)}</span>
          </div>
          {children > 0 && (
            <div className="flex justify-between">
              <span className="text-charcoal/80">Children Subtotal ({children})</span>
              <span className="font-semibold">{formatUsd(pricing.childrenTotal)}</span>
            </div>
          )}
          {pricing.transportSurchargeTotal > 0 && (
            <div className="flex justify-between">
              <span className="text-charcoal/80">Transport Upgrade</span>
              <span className="font-semibold">{formatUsd(pricing.transportSurchargeTotal)}</span>
            </div>
          )}
          {pricing.optionalExperiencesTotal > 0 && (
            <div className="flex justify-between">
              <span className="text-charcoal/80">Optional Add-ons</span>
              <span className="font-semibold">{formatUsd(pricing.optionalExperiencesTotal)}</span>
            </div>
          )}
        </div>

        <div className="border-t border-charcoal/15 pt-4 space-y-2">
          <div className="flex justify-between text-base font-bold text-green">
            <span>Total Safari Price:</span>
            <span>{formatUsd(pricing.totalPriceUsd)}</span>
          </div>
          <div className="flex justify-between text-xs font-semibold text-gold">
            <span>Deposit Required (30%):</span>
            <span>{formatUsd(pricing.depositAmountUsd)}</span>
          </div>
          <div className="flex justify-between text-xs text-charcoal/70">
            <span>Remaining Balance:</span>
            <span>{formatUsd(pricing.remainingBalanceUsd)}</span>
          </div>
        </div>

        <div className="pt-2 text-[11px] text-charcoal/60 leading-relaxed">
          * Prices include government park fees and accommodation VAT. Final confirmation verified by server.
        </div>
      </aside>
    </div>
  );
}
