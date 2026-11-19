"use client";

import { useEffect, useState } from "react";
import { contactContent } from "@/data/content";
import { site } from "@/data/site";
import { KayaExperienceLogo } from "@/components/layout/BrandLogo";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { Container } from "@/components/ui/primitives";
import { buildEnquiryWhatsAppMessage, whatsappLink } from "@/lib/whatsapp";
import { FirestoreService } from "@/lib/firebase/firestoreService";
import {
  Check,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Send,
  Sparkles,
  Sprout,
} from "lucide-react";

export interface SelectedEnquiryPreset {
  areaOfInterest?: string;
  preferredLocation?: string;
  contextNote?: string;
  timestamp?: number;
}

interface ExperienceEnquirySectionProps {
  preset?: SelectedEnquiryPreset | null;
  whatsappNumber?: string;
  contactEmail?: string;
  contactPhone?: string;
  headlineOverride?: string;
}

export function ExperienceEnquirySection({
  preset,
  whatsappNumber = site.contact.whatsapp,
  contactEmail = site.contact.email,
  contactPhone = site.contact.phone,
  headlineOverride,
}: ExperienceEnquirySectionProps) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("");
  const [areaOfInterest, setAreaOfInterest] = useState(
    contactContent.areasOfInterest[0]
  );
  const [preferredLocation, setPreferredLocation] = useState("");
  const [visitors, setVisitors] = useState("");
  const [preferredDates, setPreferredDates] = useState("");
  const [message, setMessage] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedRef, setSubmittedRef] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [presetBadge, setPresetBadge] = useState<string | null>(null);

  // React to contextual CTA selections from other sections on the page
  useEffect(() => {
    if (!preset) return;
    if (preset.areaOfInterest) {
      setAreaOfInterest(preset.areaOfInterest);
    }
    if (preset.preferredLocation) {
      setPreferredLocation(preset.preferredLocation);
    }
    if (preset.contextNote) {
      setPresetBadge(preset.contextNote);
    }
    setSubmittedRef(null);
  }, [preset]);

  const dynamicWhatsAppHref = whatsappLink(
    buildEnquiryWhatsAppMessage({
      name: fullName,
      email,
      phone,
      country,
      areaOfInterest,
      preferredLocation,
      visitors,
      dates: preferredDates,
      message,
    }),
    whatsappNumber
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: fullName.trim(),
          email: email.trim(),
          phone: phone.trim() || undefined,
          country: country.trim() || undefined,
          travelDates: preferredDates.trim() || undefined,
          travellerCount: visitors ? Number(visitors) || undefined : undefined,
          areaOfInterest,
          preferredLocation: preferredLocation.trim() || undefined,
          interestedDestinations: preferredLocation.trim()
            ? [preferredLocation.trim()]
            : [areaOfInterest],
          source: "direct",
          notes: [
            `Area of Interest: ${areaOfInterest}`,
            preferredLocation.trim()
              ? `Preferred Location/Community: ${preferredLocation.trim()}`
              : null,
            message.trim() ? `Message: ${message.trim()}` : null,
          ]
            .filter(Boolean)
            .join(" | "),
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Unable to send your enquiry right now.");
      }

      if (data.lead) {
        FirestoreService.saveLead(data.lead).catch(() => {
          // Handled by server or offline fallback
        });
      }

      setSubmittedRef(data.lead?.leadReference || "KA-ENQUIRY");
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : "Could not submit your enquiry. Please try again or reach us via WhatsApp.";
      setErrorMsg(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      id="contact"
      className="scroll-mt-20 bg-cream/55 py-20 sm:py-28 border-t border-gold/25"
      aria-labelledby="contact-heading"
    >
      <Container>
        <div className="grid gap-12 lg:grid-cols-12 lg:items-start">
          {/* Left Narrative & Direct WhatsApp Conversion Column */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <p className="mb-2.5 text-[11px] sm:text-[12px] font-semibold uppercase tracking-[0.22em] text-gold">
                {contactContent.eyebrow}
              </p>
              <h2
                id="contact-heading"
                className="font-display text-3xl sm:text-4xl lg:text-5xl leading-[1.06] text-green"
              >
                {headlineOverride || contactContent.headline}
              </h2>
              <p className="mt-4 text-sm sm:text-base leading-relaxed text-charcoal/85">
                {contactContent.description}
              </p>
            </div>

            {/* Office Location, Kaya Experience Ltd & Direct Contacts Callout */}
            <div className="rounded-ka border border-charcoal/15 bg-ivory p-5 sm:p-6 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-charcoal/10 pb-3">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gold">
                    Proudly Managed By
                  </p>
                  <p className="font-display text-xl text-green">
                    Kaya Experience Ltd
                  </p>
                </div>
                <KayaExperienceLogo
                  variant="dark"
                  alt="Kaya Experience Ltd Logo"
                  width={185}
                  height={48}
                  className="h-11 w-auto"
                />
              </div>

              <div className="space-y-2.5 text-xs sm:text-sm text-charcoal/85">
                <p className="flex items-start gap-2.5">
                  <MapPin className="h-4 w-4 text-gold shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-forest">Office Location:</strong>{" "}
                    Watamu, Timboni Stage, Kilifi County, Kenya
                  </span>
                </p>

                <p className="flex items-start gap-2.5">
                  <Phone className="h-4 w-4 text-gold shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-forest">
                      Direct Contacts (Mrisa — &ldquo;The Shepherd&rdquo;):
                    </strong>{" "}
                    <a
                      href="tel:+254728560303"
                      className="font-mono font-semibold text-green underline-offset-4 hover:underline"
                    >
                      +254 728 560303
                    </a>{" "}
                    &amp;{" "}
                    <a
                      href="tel:+254712863538"
                      className="font-mono font-semibold text-green underline-offset-4 hover:underline"
                    >
                      +254 712 863538
                    </a>
                  </span>
                </p>

                <p className="flex items-start gap-2.5">
                  <Mail className="h-4 w-4 text-gold shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-forest">
                      General, Excursions &amp; Stays:
                    </strong>{" "}
                    <a
                      href={`mailto:${contactEmail}`}
                      className="font-semibold text-green underline-offset-4 hover:underline"
                    >
                      {contactEmail}
                    </a>
                  </span>
                </p>

                <p className="flex items-start gap-2.5 pt-2 border-t border-charcoal/10">
                  <Sprout className="h-4 w-4 text-green shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-forest block">
                      Kaya Roots Africa (Dr. Milcah Wambua — Indigenous Crops &amp; Cassava):
                    </strong>
                    <a
                      href={`mailto:${site.contact.kayaRootsEmail}`}
                      className="font-semibold text-green underline-offset-4 hover:underline"
                    >
                      {site.contact.kayaRootsEmail}
                    </a>
                  </span>
                </p>
              </div>
            </div>

            {/* Prominent WhatsApp CTA Card */}
            <div className="rounded-ka bg-forest p-6 text-ivory shadow-md border border-gold/30 space-y-4">
              <div className="flex items-center gap-2.5">
                <MessageCircle className="h-5 w-5 text-gold-light shrink-0" />
                <h3 className="font-display text-2xl text-ivory">
                  Prefer an Instant Conversation?
                </h3>
              </div>
              <p className="text-xs sm:text-sm leading-relaxed text-cream/85">
                Message us directly on WhatsApp for tailored safari packages,
                excursions, coastal stays and airport or SGR transfers.
              </p>
              <WhatsAppButton
                label="Chat With Us on WhatsApp"
                href={dynamicWhatsAppHref}
                variant="gold"
                fullWidth
              />
              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-cream/15 text-xs text-cream/75">
                <span>Office: Watamu, Timboni Stage</span>
                <span>Tel: +254 728 560303 / +254 712 863538</span>
              </div>
            </div>
          </div>

          {/* Right Simplified Quick Contact Form Column */}
          <div className="lg:col-span-7">
            <div className="rounded-ka border border-charcoal/15 bg-ivory p-6 sm:p-8 shadow-xs">
              {presetBadge && (
                <div className="mb-5 flex items-center justify-between gap-3 rounded-ka border border-gold/50 bg-cream/50 px-4 py-2 text-xs text-forest">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-gold shrink-0" />
                    <span>
                      Topic:{" "}
                      <strong className="font-semibold">{presetBadge}</strong>
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setPresetBadge(null)}
                    className="text-[11px] underline text-charcoal/65 hover:text-charcoal"
                  >
                    Clear
                  </button>
                </div>
              )}

              {submittedRef ? (
                <div className="py-6 text-center space-y-4">
                  <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-green/15 text-green">
                    <Check className="h-5 w-5" />
                  </div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gold">
                    Message Received · Ref {submittedRef}
                  </p>
                  <h3 className="font-display text-3xl text-green">
                    Thank You for Reaching Out
                  </h3>
                  <p className="mx-auto max-w-md text-xs sm:text-sm leading-relaxed text-charcoal/80">
                    Our team at Watamu, Timboni Stage has received your message
                    and will connect with you shortly.
                  </p>
                  <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                    <WhatsAppButton
                      label="Continue on WhatsApp"
                      href={dynamicWhatsAppHref}
                    />
                    <button
                      type="button"
                      onClick={() => setSubmittedRef(null)}
                      className="inline-flex items-center justify-center rounded-full border border-charcoal/25 px-5 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-charcoal hover:border-gold transition-colors"
                    >
                      Send Another Message
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="border-b border-charcoal/10 pb-3">
                    <h3 className="font-display text-2xl sm:text-3xl text-green">
                      Quick Contact Form
                    </h3>
                    <p className="mt-1 text-xs text-charcoal/70">
                      Leave a quick note below or message us directly on
                      WhatsApp.
                    </p>
                  </div>

                  {errorMsg && (
                    <div className="rounded-ka border border-red-300 bg-red-50 p-3 text-xs font-medium text-red-800">
                      {errorMsg}
                    </div>
                  )}

                  {/* Simplified Row 1: Name & Email */}
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="enquiry-name"
                        className="block text-xs font-semibold uppercase tracking-[0.08em] text-charcoal"
                      >
                        Your Name <span className="text-gold">*</span>
                      </label>
                      <input
                        id="enquiry-name"
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Your name"
                        className="mt-1.5 w-full rounded-ka border border-charcoal/25 bg-ivory px-3.5 py-2.5 text-sm text-charcoal placeholder:text-charcoal/40 focus:border-green focus:outline-none"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="enquiry-email"
                        className="block text-xs font-semibold uppercase tracking-[0.08em] text-charcoal"
                      >
                        Email Address <span className="text-gold">*</span>
                      </label>
                      <input
                        id="enquiry-email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="mt-1.5 w-full rounded-ka border border-charcoal/25 bg-ivory px-3.5 py-2.5 text-sm text-charcoal placeholder:text-charcoal/40 focus:border-green focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Simplified Row 2: Phone / WhatsApp (Optional) */}
                  <div>
                    <label
                      htmlFor="enquiry-phone"
                      className="block text-xs font-semibold uppercase tracking-[0.08em] text-charcoal"
                    >
                      Phone / WhatsApp Number{" "}
                      <span className="text-[10px] font-normal lowercase text-charcoal/55">
                        (optional)
                      </span>
                    </label>
                    <input
                      id="enquiry-phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+254 700 000 000"
                      className="mt-1.5 w-full rounded-ka border border-charcoal/25 bg-ivory px-3.5 py-2.5 text-sm text-charcoal placeholder:text-charcoal/40 focus:border-green focus:outline-none"
                    />
                  </div>

                  {/* Simplified Row 3: Short Message */}
                  <div>
                    <label
                      htmlFor="enquiry-message"
                      className="block text-xs font-semibold uppercase tracking-[0.08em] text-charcoal"
                    >
                      Your Message
                    </label>
                    <textarea
                      id="enquiry-message"
                      rows={3}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="How can we help you plan your safari, excursion or stay?"
                      className="mt-1.5 w-full rounded-ka border border-charcoal/25 bg-ivory px-3.5 py-2.5 text-sm text-charcoal placeholder:text-charcoal/40 focus:border-green focus:outline-none"
                    />
                  </div>

                  {/* Primary WhatsApp CTA & Simple Send Action */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                    <WhatsAppButton
                      label="Inquire via WhatsApp"
                      href={dynamicWhatsAppHref}
                      className="flex-1 justify-between"
                    />

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="cursor-pointer inline-flex items-center justify-center gap-2 rounded-full border border-charcoal/25 bg-cream/40 px-5 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-forest hover:border-gold hover:bg-cream transition-all disabled:opacity-60"
                    >
                      <Send className="h-3.5 w-3.5" />
                      <span>
                        {isSubmitting ? "Sending..." : "Send Message"}
                      </span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
