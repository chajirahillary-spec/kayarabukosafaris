"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { ArrowUp } from "lucide-react";
import { site } from "@/data/site";
import { FirestoreService } from "@/lib/firebase/firestoreService";
import { buildEnquiryWhatsAppMessage, whatsappLink } from "@/lib/whatsapp";
import { WhatsAppIcon } from "@/components/ui/WhatsAppButton";

export function FloatingWhatsAppButton() {
  const pathname = usePathname();
  const [whatsappNumber, setWhatsappNumber] = useState<string>(
    site.contact.whatsapp
  );
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [scrollFraction, setScrollFraction] = useState(0);

  useEffect(() => {
    FirestoreService.getPlatformSettings()
      .then((settings) => {
        if (settings.whatsappNumber) {
          setWhatsappNumber(settings.whatsappNumber);
        }
      })
      .catch(() => {
        // Fallback to default WhatsApp Business number
      });
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setShowBackToTop(y > 420);
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight > 0) {
        setScrollFraction(Math.min(1, Math.max(0, y / docHeight)));
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (pathname?.startsWith("/admin")) return null;

  const waHref = whatsappLink(
    buildEnquiryWhatsAppMessage({
      areaOfInterest:
        "Safari Packages, Watamu Excursions, Accommodation & Cultural Visits",
    }),
    whatsappNumber
  );

  const ringCircumference = 2 * Math.PI * 18;
  const strokeDashoffset = ringCircumference * (1 - scrollFraction);

  return (
    <div
      data-ve-ignore="true"
      className="fixed bottom-5 right-5 z-[75] flex flex-col items-end gap-2.5"
    >
      {/* Discreet Animated Back-to-Top Button with Live Scroll Progress Ring */}
      <button
        type="button"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="Scroll back to top"
        className={`cursor-pointer group relative flex h-10 w-10 items-center justify-center rounded-full bg-forest/90 text-gold-light shadow-lg backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:bg-forest hover:text-ivory ${
          showBackToTop
            ? "translate-y-0 scale-100 opacity-100 pointer-events-auto"
            : "translate-y-3 scale-75 opacity-0 pointer-events-none"
        }`}
      >
        <svg
          className="pointer-events-none absolute inset-0 h-10 w-10 -rotate-90"
          viewBox="0 0 40 40"
          aria-hidden="true"
        >
          <circle
            cx="20"
            cy="20"
            r="18"
            fill="none"
            stroke="rgba(200, 155, 60, 0.22)"
            strokeWidth="1.8"
          />
          <circle
            cx="20"
            cy="20"
            r="18"
            fill="none"
            stroke="#C89B3C"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeDasharray={ringCircumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-[stroke-dashoffset] duration-150"
          />
        </svg>
        <ArrowUp className="h-4 w-4 transition-transform duration-200 group-hover:-translate-y-0.5" />
      </button>

      {/* Refined Forest & Brushed-Gold Circular WhatsApp Medallion */}
      <a
        href={waHref}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with us on WhatsApp"
        className="group relative flex items-center justify-end"
      >
        {/* Discreet Hover Tooltip Label (Only expands on hover so it is never disruptive) */}
        <span className="pointer-events-none mr-2.5 translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300 ease-out rounded-full border border-gold/55 bg-forest/95 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-gold-light shadow-lg backdrop-blur-md whitespace-nowrap">
          Chat on WhatsApp
        </span>

        <span className="relative flex h-12 w-12 items-center justify-center rounded-full border border-gold/70 bg-forest bg-gradient-to-br from-[#0B4B2E] via-[#0F5E3A] to-[#06331E] text-gold-light shadow-[0_8px_24px_rgba(6,59,37,0.45)] backdrop-blur-md transition-all duration-300 ease-out group-hover:-translate-y-1 group-hover:scale-105 group-hover:border-gold group-hover:bg-gold group-hover:text-forest group-hover:shadow-[0_12px_28px_rgba(200,155,60,0.45)]">
          <WhatsAppIcon className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
          <span className="absolute top-0.5 right-0.5 flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold opacity-60" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#34E0A1] border border-forest" />
          </span>
        </span>
      </a>
    </div>
  );
}
