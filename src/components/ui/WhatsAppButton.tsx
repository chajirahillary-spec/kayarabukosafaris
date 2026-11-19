"use client";

import { ArrowUpRight } from "lucide-react";
import {
  buildEnquiryWhatsAppMessage,
  whatsappLink,
  type WhatsAppEnquiryContext,
} from "@/lib/whatsapp";

export function WhatsAppIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={`fill-current ${className}`}
      aria-hidden="true"
    >
      <path d="M16.004 3.2c-7.068 0-12.8 5.732-12.8 12.8 0 2.256.588 4.46 1.706 6.404L3.09 28.8l6.564-1.722a12.74 12.74 0 0 0 6.35 1.694h.006c7.066 0 12.8-5.732 12.8-12.8 0-3.42-1.332-6.636-3.75-9.054A12.716 12.716 0 0 0 16.004 3.2zm0 23.386h-.004a10.58 10.58 0 0 1-5.394-1.478l-.386-.23-3.896 1.022 1.04-3.798-.252-.4a10.576 10.576 0 0 1-1.624-5.646c0-5.844 4.756-10.6 10.604-10.6 2.832 0 5.494 1.104 7.496 3.106a10.534 10.534 0 0 1 3.104 7.498c0 5.846-4.758 10.606-10.688 10.526zm5.816-7.934c-.318-.16-1.886-.93-2.178-1.036-.292-.106-.504-.16-.716.16-.212.318-.824 1.036-1.01 1.248-.186.212-.372.24-.69.08-.318-.16-1.346-.496-2.564-1.582-.948-.846-1.588-1.89-1.774-2.208-.186-.318-.02-.49.14-.65.144-.142.318-.372.478-.558.16-.186.212-.318.318-.53.106-.212.054-.398-.026-.558-.08-.16-.716-1.726-.982-2.364-.258-.62-.522-.536-.716-.546l-.61-.01c-.212 0-.558.08-.85.398-.292.318-1.116 1.09-1.116 2.656 0 1.568 1.142 3.082 1.3 3.294.16.212 2.246 3.43 5.442 4.81.76.328 1.354.524 1.816.672.764.242 1.46.208 2.01.126.614-.092 1.886-.77 2.152-1.514.266-.744.266-1.382.186-1.514-.08-.134-.292-.212-.61-.372z" />
    </svg>
  );
}

interface WhatsAppButtonProps {
  label?: string;
  href?: string;
  context?: WhatsAppEnquiryContext;
  whatsappNumber?: string;
  variant?: "primary" | "gold" | "compact";
  fullWidth?: boolean;
  className?: string;
  onClick?: () => void;
}

export function WhatsAppButton({
  label = "Inquire via WhatsApp",
  href,
  context,
  whatsappNumber,
  variant = "primary",
  fullWidth = false,
  className = "",
  onClick,
}: WhatsAppButtonProps) {
  const resolvedHref =
    href ||
    whatsappLink(
      buildEnquiryWhatsAppMessage(
        context || {
          areaOfInterest:
            "Safari Packages, Excursions, Accommodation & Cultural Visits",
        }
      ),
      whatsappNumber
    );

  const widthClass = fullWidth ? "w-full justify-between" : "inline-flex";

  if (variant === "gold") {
    return (
      <a
        href={resolvedHref}
        target="_blank"
        rel="noopener noreferrer"
        onClick={onClick}
        className={`group/wa relative overflow-hidden flex items-center gap-3 rounded-full border border-gold bg-gold bg-gradient-to-r from-gold via-[#d8ab4e] to-gold px-5 py-3 text-xs font-bold uppercase tracking-[0.15em] text-forest shadow-[0_8px_24px_-4px_rgba(200,155,60,0.45)] transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-gold-light hover:shadow-[0_14px_32px_-4px_rgba(200,155,60,0.65)] active:translate-y-0 ${widthClass} ${className}`}
      >
        <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/35 to-transparent transition-transform duration-700 ease-out group-hover/wa:translate-x-full" />
        <span className="relative flex items-center gap-2.5">
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-forest text-gold-light shadow-2xs transition-transform duration-300 group-hover/wa:scale-110 group-hover/wa:rotate-6">
            <WhatsAppIcon className="h-3.5 w-3.5" />
          </span>
          <span>{label}</span>
        </span>
        <ArrowUpRight className="relative h-4 w-4 shrink-0 text-forest transition-transform duration-300 group-hover/wa:translate-x-0.5 group-hover/wa:-translate-y-0.5" />
      </a>
    );
  }

  if (variant === "compact") {
    return (
      <a
        href={resolvedHref}
        target="_blank"
        rel="noopener noreferrer"
        onClick={onClick}
        className={`group/wa relative overflow-hidden inline-flex items-center gap-2 rounded-full border border-gold/65 bg-forest bg-gradient-to-r from-forest via-green to-forest px-4 py-2 text-[11px] font-bold uppercase tracking-[0.14em] text-ivory shadow-[0_6px_18px_-4px_rgba(6,59,37,0.38)] transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-gold hover:bg-green hover:shadow-[0_10px_24px_-4px_rgba(200,155,60,0.42)] active:translate-y-0 ${className}`}
      >
        <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-gold/25 to-transparent transition-transform duration-700 ease-out group-hover/wa:translate-x-full" />
        <span className="relative flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gold/20 border border-gold/50 text-gold-light transition-all duration-300 group-hover/wa:bg-gold group-hover/wa:text-forest group-hover/wa:scale-110">
          <WhatsAppIcon className="h-3 w-3" />
        </span>
        <span className="relative">{label}</span>
        <ArrowUpRight className="relative h-3.5 w-3.5 shrink-0 text-gold-light transition-transform duration-300 group-hover/wa:translate-x-0.5 group-hover/wa:-translate-y-0.5" />
      </a>
    );
  }

  return (
    <a
      href={resolvedHref}
      target="_blank"
      rel="noopener noreferrer"
      onClick={onClick}
      className={`group/wa relative overflow-hidden flex items-center gap-3 rounded-full border border-gold/65 bg-forest bg-gradient-to-r from-[#073621] via-[#0F5937] to-[#094228] px-5 py-3 text-xs font-bold uppercase tracking-[0.15em] text-ivory shadow-[0_10px_26px_-6px_rgba(6,59,37,0.48)] transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-gold hover:bg-green hover:shadow-[0_14px_32px_-6px_rgba(6,59,37,0.65),0_0_18px_rgba(200,155,60,0.28)] active:translate-y-0 ${widthClass} ${className}`}
    >
      {/* Subtle Animated Shimmer Sweep */}
      <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-gold/25 to-transparent transition-transform duration-700 ease-out group-hover/wa:translate-x-full" />

      <span className="relative flex items-center gap-2.5">
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-gold/55 bg-gold/15 text-gold-light shadow-2xs transition-all duration-300 group-hover/wa:bg-gold group-hover/wa:text-forest group-hover/wa:scale-110 group-hover/wa:rotate-6">
          <WhatsAppIcon className="h-3.5 w-3.5" />
        </span>
        <span className="tracking-[0.14em] group-hover/wa:text-gold-light transition-colors duration-200">
          {label}
        </span>
      </span>

      <span className="relative flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/8 text-gold-light transition-all duration-300 group-hover/wa:bg-gold/20 group-hover/wa:translate-x-0.5 group-hover/wa:-translate-y-0.5">
        <ArrowUpRight className="h-3.5 w-3.5" />
      </span>
    </a>
  );
}
