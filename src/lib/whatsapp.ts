import { site } from "@/data/site";

export interface WhatsAppEnquiryContext {
  name?: string;
  email?: string;
  phone?: string;
  country?: string;
  areaOfInterest?: string;
  preferredLocation?: string;
  visitors?: string;
  dates?: string;
  message?: string;
}

/**
 * Normalizes a phone/WhatsApp number string to international digits only (e.g. "2547...").
 */
export function sanitizeWhatsAppNumber(rawNumber?: string): string {
  const candidate = (rawNumber || site.contact.whatsapp || "").replace(/[^\d]/g, "");
  if (!candidate) return site.contact.whatsapp.replace(/[^\d]/g, "");
  if (candidate.startsWith("0") && candidate.length === 10) {
    return `254${candidate.slice(1)}`;
  }
  return candidate;
}

/**
 * Click-to-WhatsApp link with a contextual, URL-encoded message and configurable WhatsApp number.
 */
export function whatsappLink(message: string, customWhatsAppNumber?: string): string {
  const phone = sanitizeWhatsAppNumber(customWhatsAppNumber);
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

/**
 * Constructs a polite, structured WhatsApp message pre-populated with the visitor's selected
 * experience, community, conservation topic, or form details.
 */
export function buildEnquiryWhatsAppMessage(ctx: WhatsAppEnquiryContext = {}): string {
  const lines: string[] = [
    "Hello KayArabuko,",
    "I would like to enquire about discovering Kenya with you.",
  ];

  if (ctx.areaOfInterest) {
    lines.push(`• Area of Interest: ${ctx.areaOfInterest}`);
  }
  if (ctx.preferredLocation) {
    lines.push(`• Preferred Community / Location: ${ctx.preferredLocation}`);
  }
  if (ctx.visitors) {
    lines.push(`• Number of Visitors: ${ctx.visitors}`);
  }
  if (ctx.dates) {
    lines.push(`• Preferred Dates: ${ctx.dates}`);
  }
  if (ctx.name) {
    lines.push(`• Name: ${ctx.name}`);
  }
  if (ctx.country) {
    lines.push(`• Country: ${ctx.country}`);
  }
  if (ctx.message?.trim()) {
    lines.push(`\nNotes: ${ctx.message.trim()}`);
  }

  return lines.join("\n");
}
