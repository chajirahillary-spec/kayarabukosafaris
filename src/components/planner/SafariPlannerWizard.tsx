"use client";

import { useState } from "react";
import { destinations } from "@/data/destinations";
import { safaris, safariStyleLabels } from "@/data/safaris";
import type { AccommodationTier, TransportType, SafariStyle } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { formatUsd } from "@/components/ui/commerce";
import { MonthPicker } from "@/components/forms/MonthPicker";
import { Check, Plus } from "lucide-react";

export function SafariPlannerWizard({
  initialDestination,
  initialSafari,
}: {
  initialDestination?: string;
  initialSafari?: string;
}) {
  const [step, setStep] = useState(1);
  const [selectedDestinations, setSelectedDestinations] = useState<string[]>(
    initialDestination ? [initialDestination] : ["maasai-mara"]
  );
  const [travelMonth, setTravelMonth] = useState("");
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [selectedStyle, setSelectedStyle] = useState<SafariStyle>("wildlife");
  const [tier, setTier] = useState<AccommodationTier>("mid-range");
  const [transport, setTransport] = useState<TransportType>("land-cruiser");
  const [selectedExperiences, setSelectedExperiences] = useState<string[]>([
    "Game drives",
    "Cultural experiences",
  ]);
  const [budgetPerPerson, setBudgetPerPerson] = useState(1500);

  // Inquiry form states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [notes, setNotes] = useState("");

  const toggleDestination = (slug: string) => {
    setSelectedDestinations((prev) =>
      prev.includes(slug)
        ? prev.length > 1
          ? prev.filter((s) => s !== slug)
          : prev
        : [...prev, slug]
    );
  };

  const toggleExperience = (exp: string) => {
    setSelectedExperiences((prev) =>
      prev.includes(exp) ? prev.filter((e) => e !== exp) : [...prev, exp]
    );
  };

  // Matched suggested safari
  const suggestedSafari =
    safaris.find((s) =>
      s.destinationSlugs.some((d) => selectedDestinations.includes(d))
    ) || safaris[0];

  // Dynamic estimated calculation
  const baseEstimated =
    (suggestedSafari.fromPriceUsd || 750) *
    (tier === "luxury" ? 2.1 : tier === "mid-range" ? 1.35 : 1.0);
  const estimatedPerPerson = Math.round(baseEstimated);
  const estimatedTotal =
    Math.round(estimatedPerPerson * adults + estimatedPerPerson * 0.6 * children);

  const handleSubmitInquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: contactName,
          email: contactEmail,
          phone: contactPhone,
          travelDates: travelMonth,
          travellerCount: adults + children,
          budgetRange: `$${budgetPerPerson} per person`,
          interestedDestinations: selectedDestinations,
          interestedStyles: [selectedStyle],
          source: "direct",
          notes: `Safari Planner Generated: Style ${selectedStyle}, Tier: ${tier}, Transport: ${transport}. Experiences: ${selectedExperiences.join(", ")}. Note: ${notes}`,
        }),
      });
      if (res.ok) {
        setSubmitted(true);
      }
    } catch (err) {
      console.error("Error submitting safari plan:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const experienceOptions = [
    "Game drives",
    "Cultural experiences",
    "Photography",
    "Walking safari",
    "Beach extension",
    "Mountains",
    "Conservation",
  ];

  return (
    <div className="border border-gold/40 bg-ivory p-6 sm:p-10 shadow-sm">
      {/* Progress header */}
      <div className="mb-8 border-b border-charcoal/15 pb-6">
        <div className="flex items-center justify-between text-[12px] font-semibold uppercase tracking-[0.14em] text-gold">
          <span>Step {Math.min(step, 8)} of 8</span>
          <span>
            {step === 1 && "Where to go"}
            {step === 2 && "When are you travelling"}
            {step === 3 && "Travellers"}
            {step === 4 && "Safari Style"}
            {step === 5 && "Accommodation"}
            {step === 6 && "Transport"}
            {step === 7 && "Signature Experiences"}
            {step === 8 && "Budget & Review"}
            {step > 8 && "Your Suggested Safari"}
          </span>
        </div>
        <div className="mt-3 h-1.5 w-full bg-cream">
          <div
            className="h-full bg-green transition-all duration-300"
            style={{ width: `${(Math.min(step, 8) / 8) * 100}%` }}
          />
        </div>
      </div>

      {/* Step 1: Destinations */}
      {step === 1 && (
        <div className="space-y-6">
          <h2 className="text-3xl text-green sm:text-4xl">
            Where do you want to explore?
          </h2>
          <p className="text-sm text-charcoal/80">
            Select one or more destinations you dream of visiting in Kenya:
          </p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {destinations.slice(0, 12).map((d) => {
              const active = selectedDestinations.includes(d.slug);
              return (
                <button
                  key={d.slug}
                  type="button"
                  onClick={() => toggleDestination(d.slug)}
                  className={`flex flex-col rounded-ka border p-4 text-left transition-all ${
                    active
                      ? "border-green bg-green/10 text-green font-medium shadow-sm"
                      : "border-charcoal/20 bg-ivory text-charcoal hover:border-gold"
                  }`}
                >
                  <span className="font-semibold text-lg">{d.name}</span>
                  <span className="text-[12px] text-charcoal/70">{d.tagline}</span>
                </button>
              );
            })}
          </div>
          <div className="flex justify-end pt-4">
            <Button onClick={() => setStep(2)}>Next: When Travelling →</Button>
          </div>
        </div>
      )}

      {/* Step 2: Travel Date */}
      {step === 2 && (
        <div className="space-y-6">
          <h2 className="text-3xl text-green sm:text-4xl">
            When are you travelling?
          </h2>
          <p className="text-sm text-charcoal/80">
            Kenya offers exceptional year-round wildlife. When are you planning to arrive?
          </p>
          <div className="max-w-md">
            <label
              htmlFor="plan-month"
              className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-green"
            >
              Estimated Month of Travel
            </label>
            <MonthPicker
              id="plan-month"
              value={travelMonth}
              onChange={(val) => setTravelMonth(val)}
              placeholder="Select estimated travel month"
            />
            <p className="mt-2 text-xs text-charcoal/70">
              Migration season is typically July to October; green season runs from April to May.
            </p>
          </div>
          <div className="flex gap-4 pt-4">
            <Button variant="secondary" onClick={() => setStep(1)}>
              ← Back
            </Button>
            <Button onClick={() => setStep(3)}>Next: Travellers →</Button>
          </div>
        </div>
      )}

      {/* Step 3: Travellers */}
      {step === 3 && (
        <div className="space-y-6">
          <h2 className="text-3xl text-green sm:text-4xl">
            How many travellers?
          </h2>
          <p className="text-sm text-charcoal/80">
            Help us configure the right vehicle and room arrangements:
          </p>
          <div className="grid max-w-lg gap-6 sm:grid-cols-2">
            <div className="rounded-ka border border-charcoal/20 p-5">
              <label className="block text-xs font-semibold uppercase tracking-[0.12em] text-green">
                Adults (Age 12+)
              </label>
              <div className="mt-3 flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => setAdults(Math.max(1, adults - 1))}
                  className="flex h-10 w-10 items-center justify-center border border-charcoal/30 text-xl font-bold"
                >
                  -
                </button>
                <span className="font-display text-3xl text-green">{adults}</span>
                <button
                  type="button"
                  onClick={() => setAdults(adults + 1)}
                  className="flex h-10 w-10 items-center justify-center border border-charcoal/30 text-xl font-bold"
                >
                  +
                </button>
              </div>
            </div>
            <div className="rounded-ka border border-charcoal/20 p-5">
              <label className="block text-xs font-semibold uppercase tracking-[0.12em] text-green">
                Children (Under 12)
              </label>
              <div className="mt-3 flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => setChildren(Math.max(0, children - 1))}
                  className="flex h-10 w-10 items-center justify-center border border-charcoal/30 text-xl font-bold"
                >
                  -
                </button>
                <span className="font-display text-3xl text-green">{children}</span>
                <button
                  type="button"
                  onClick={() => setChildren(children + 1)}
                  className="flex h-10 w-10 items-center justify-center border border-charcoal/30 text-xl font-bold"
                >
                  +
                </button>
              </div>
            </div>
          </div>
          <div className="flex gap-4 pt-4">
            <Button variant="secondary" onClick={() => setStep(2)}>
              ← Back
            </Button>
            <Button onClick={() => setStep(4)}>Next: Safari Style →</Button>
          </div>
        </div>
      )}

      {/* Step 4: Safari Style */}
      {step === 4 && (
        <div className="space-y-6">
          <h2 className="text-3xl text-green sm:text-4xl">
            What kind of safari?
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                style: "wildlife",
                title: "Wildlife Safari",
                desc: "Focus on big cats, elephants, and iconic game drives.",
              },
              {
                style: "cultural",
                title: "Cultural Experiences",
                desc: "Deep encounters with Maasai, Samburu, and coastal storytellers.",
              },
              {
                style: "photography",
                title: "Photography Safari",
                desc: "Dedicated beanbags, golden-hour drives, and vehicle space.",
              },
              {
                style: "family",
                title: "Family Safari",
                desc: "Slower driving pace, family cottages, and kid-friendly guides.",
              },
              {
                style: "honeymoon",
                title: "Honeymoon & Romantic",
                desc: "Intimate camps, private dining under stars, and beach add-ons.",
              },
              {
                style: "conservation",
                title: "Conservation Journey",
                desc: "Behind the scenes with rhino rangers and community conservancies.",
              },
            ].map((item) => (
              <button
                key={item.style}
                type="button"
                onClick={() => setSelectedStyle(item.style as SafariStyle)}
                className={`rounded-ka border p-5 text-left transition-all ${
                  selectedStyle === item.style
                    ? "border-green bg-green/10 text-green font-medium"
                    : "border-charcoal/20 bg-ivory text-charcoal hover:border-gold"
                }`}
              >
                <p className="font-display text-2xl">{item.title}</p>
                <p className="mt-1 text-xs text-charcoal/70">{item.desc}</p>
              </button>
            ))}
          </div>
          <div className="flex gap-4 pt-4">
            <Button variant="secondary" onClick={() => setStep(3)}>
              ← Back
            </Button>
            <Button onClick={() => setStep(5)}>Next: Accommodation →</Button>
          </div>
        </div>
      )}

      {/* Step 5: Accommodation */}
      {step === 5 && (
        <div className="space-y-6">
          <h2 className="text-3xl text-green sm:text-4xl">
            Accommodation Preference
          </h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              {
                tier: "budget",
                title: "Budget / Adventure",
                desc: "Clean, comfortable safari camps with en-suite facilities.",
              },
              {
                tier: "mid-range",
                title: "Mid-Range Lodges & Camps",
                desc: "Classic African safari lodges, swimming pools, quality dining.",
              },
              {
                tier: "luxury",
                title: "Luxury Tented Camps",
                desc: "Boutique, exclusive-use conservancies, fine wine & bush elegance.",
              },
            ].map((t) => (
              <button
                key={t.tier}
                type="button"
                onClick={() => setTier(t.tier as AccommodationTier)}
                className={`rounded-ka border p-5 text-left transition-all ${
                  tier === t.tier
                    ? "border-green bg-green/10 text-green font-medium"
                    : "border-charcoal/20 bg-ivory text-charcoal hover:border-gold"
                }`}
              >
                <p className="font-display text-2xl">{t.title}</p>
                <p className="mt-2 text-xs text-charcoal/75">{t.desc}</p>
              </button>
            ))}
          </div>
          <div className="flex gap-4 pt-4">
            <Button variant="secondary" onClick={() => setStep(4)}>
              ← Back
            </Button>
            <Button onClick={() => setStep(6)}>Next: Transport →</Button>
          </div>
        </div>
      )}

      {/* Step 6: Transport */}
      {step === 6 && (
        <div className="space-y-6">
          <h2 className="text-3xl text-green sm:text-4xl">
            Safari Transport Preference
          </h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              {
                type: "safari-van",
                title: "Safari Minivan (4x4)",
                desc: "Pop-up roof for photography. Most affordable option.",
              },
              {
                type: "land-cruiser",
                title: "Custom 4x4 Land Cruiser",
                desc: "The classic safari vehicle with rugged capability and fridge.",
              },
              {
                type: "fly-in",
                title: "Fly-in Safari",
                desc: "Scheduled bush flights connecting parks directly. Maximizes time.",
              },
            ].map((tr) => (
              <button
                key={tr.type}
                type="button"
                onClick={() => setTransport(tr.type as TransportType)}
                className={`rounded-ka border p-5 text-left transition-all ${
                  transport === tr.type
                    ? "border-green bg-green/10 text-green font-medium"
                    : "border-charcoal/20 bg-ivory text-charcoal hover:border-gold"
                }`}
              >
                <p className="font-display text-2xl">{tr.title}</p>
                <p className="mt-2 text-xs text-charcoal/75">{tr.desc}</p>
              </button>
            ))}
          </div>
          <div className="flex gap-4 pt-4">
            <Button variant="secondary" onClick={() => setStep(5)}>
              ← Back
            </Button>
            <Button onClick={() => setStep(7)}>Next: Experiences →</Button>
          </div>
        </div>
      )}

      {/* Step 7: Experiences */}
      {step === 7 && (
        <div className="space-y-6">
          <h2 className="text-3xl text-green sm:text-4xl">
            Special Experiences to Include
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {experienceOptions.map((exp) => {
              const active = selectedExperiences.includes(exp);
              return (
                <button
                  key={exp}
                  type="button"
                  onClick={() => toggleExperience(exp)}
                  className={`flex items-center justify-between rounded-ka border p-4 text-left font-medium transition-all ${
                    active
                      ? "border-green bg-green text-ivory"
                      : "border-charcoal/20 bg-ivory text-charcoal hover:border-gold"
                  }`}
                >
                  <span>{exp}</span>
                  {active ? <Check className="h-4 w-4 shrink-0" /> : <Plus className="h-4 w-4 shrink-0 opacity-60" />}
                </button>
              );
            })}
          </div>
          <div className="flex gap-4 pt-4">
            <Button variant="secondary" onClick={() => setStep(6)}>
              ← Back
            </Button>
            <Button onClick={() => setStep(8)}>Next: Budget Range →</Button>
          </div>
        </div>
      )}

      {/* Step 8: Budget Range */}
      {step === 8 && (
        <div className="space-y-6">
          <h2 className="text-3xl text-green sm:text-4xl">
            Estimated Budget Range
          </h2>
          <p className="text-sm text-charcoal/80">
            What is your approximate budget per person (excluding international flights)?
          </p>
          <div className="max-w-md space-y-4">
            <div className="flex justify-between items-center text-sm font-semibold text-green">
              <span>Selected Target:</span>
              <span className="font-display text-2xl text-green">
                {formatUsd(budgetPerPerson)} / person
              </span>
            </div>
            <input
              type="range"
              min={500}
              max={6000}
              step={100}
              value={budgetPerPerson}
              onChange={(e) => setBudgetPerPerson(Number(e.target.value))}
              className="w-full accent-green cursor-pointer"
            />
            <div className="flex justify-between text-xs text-charcoal/60">
              <span>$500</span>
              <span>$3,000</span>
              <span>$6,000+</span>
            </div>
          </div>
          <div className="flex gap-4 pt-4">
            <Button variant="secondary" onClick={() => setStep(7)}>
              ← Back
            </Button>
            <Button onClick={() => setStep(9)}>Generate My Suggested Safari →</Button>
          </div>
        </div>
      )}

      {/* Generated Suggested Safari & Proposal Request */}
      {step >= 9 && (
        <div className="space-y-8">
          <div className="border-l-4 border-gold bg-cream/50 p-6">
            <p className="text-[12px] font-semibold uppercase tracking-[0.2em] text-gold">
              Curated for your group
            </p>
            <h2 className="mt-1 text-4xl text-green sm:text-5xl">
              Your Suggested Safari
            </h2>
            <p className="mt-2 text-sm text-charcoal/80">
              Based on your preferences, here is a custom itinerary concept crafted by KayArabuko Safaris:
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              <div className="border border-charcoal/15 bg-ivory p-6">
                <h3 className="font-display text-3xl text-green">
                  {suggestedSafari.title}
                </h3>
                <p className="mt-2 text-sm text-charcoal/80">
                  {suggestedSafari.shortDescription}
                </p>

                <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4 border-y border-charcoal/15 py-4 text-xs">
                  <div>
                    <span className="block font-semibold text-green uppercase tracking-wider">
                      Duration
                    </span>
                    <span className="text-charcoal/80">{suggestedSafari.days} Days</span>
                  </div>
                  <div>
                    <span className="block font-semibold text-green uppercase tracking-wider">
                      Tier
                    </span>
                    <span className="text-charcoal/80 capitalize">{tier}</span>
                  </div>
                  <div>
                    <span className="block font-semibold text-green uppercase tracking-wider">
                      Transport
                    </span>
                    <span className="text-charcoal/80 capitalize">
                      {transport.replace("-", " ")}
                    </span>
                  </div>
                  <div>
                    <span className="block font-semibold text-green uppercase tracking-wider">
                      Travellers
                    </span>
                    <span className="text-charcoal/80">
                      {adults} Adults{children > 0 ? `, ${children} Children` : ""}
                    </span>
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  <h4 className="font-semibold text-green">Included Experiences:</h4>
                  <ul className="flex flex-wrap gap-2 text-xs">
                    {selectedExperiences.map((e) => (
                      <li key={e} className="rounded-ka bg-cream px-3 py-1 text-green font-medium">
                        {e}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-6">
                  <h4 className="font-semibold text-green mb-3">Highlights:</h4>
                  <ul className="list-disc pl-5 text-sm text-charcoal/80 space-y-1">
                    {suggestedSafari.highlights.map((h) => (
                      <li key={h}>{h}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="border border-gold/50 bg-forest text-ivory p-6 flex flex-col justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-gold-light">
                  Estimated Safari Investment
                </p>
                <div className="mt-3">
                  <span className="font-display text-4xl text-ivory">
                    {formatUsd(estimatedTotal)}
                  </span>
                  <span className="block text-xs text-cream/70 mt-1">
                    ~{formatUsd(estimatedPerPerson)} per adult sharing
                  </span>
                </div>
                <p className="mt-4 text-xs text-cream/80 leading-relaxed">
                  Price includes vehicle & guide, national park entry fees, full-board accommodation, and listed activities. Final price verified via written proposal.
                </p>
              </div>

              <div className="mt-8 pt-6 border-t border-cream/20">
                <Button
                  variant="light"
                  className="w-full"
                  onClick={() => {
                    const el = document.getElementById("request-form");
                    el?.scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  Request This Safari ↓
                </Button>
              </div>
            </div>
          </div>

          {/* Form to submit request */}
          <div id="request-form" className="mt-12 border-t border-charcoal/20 pt-10">
            <h3 className="font-display text-3xl text-green">
              Request Your Tailor-Made Proposal
            </h3>
            <p className="mt-2 text-sm text-charcoal/80">
              Submit your details and our Kenyan safari architect will prepare a formal proposal with exact room availability and itinerary notes.
            </p>

            {submitted ? (
              <div className="mt-6 border border-green bg-green/10 p-6 text-green">
                <h4 className="font-display text-2xl font-semibold">
                  Thank You, {contactName}!
                </h4>
                <p className="mt-2 text-sm leading-relaxed">
                  Your customized safari request has been sent to the KayArabuko Safari Desk. We will review availability and send your comprehensive proposal shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmitInquiry} className="mt-6 grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-[0.12em] text-green mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
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
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    className="h-12 w-full rounded-ka border border-charcoal/25 bg-ivory px-3 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-[0.12em] text-green mb-1">
                    Phone / WhatsApp Number
                  </label>
                  <input
                    type="tel"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    placeholder="+254 700 000000"
                    className="h-12 w-full rounded-ka border border-charcoal/25 bg-ivory px-3 text-sm"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold uppercase tracking-[0.12em] text-green mb-1">
                    Specific Requests or Dietary Notes
                  </label>
                  <textarea
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Tell us about special milestones, dietary preferences, or specific animals you want to see..."
                    className="w-full rounded-ka border border-charcoal/25 bg-ivory p-3 text-sm"
                  />
                </div>
                <div className="sm:col-span-2 pt-2">
                  <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
                    {isSubmitting ? "Submitting Request..." : "Request This Safari"}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
