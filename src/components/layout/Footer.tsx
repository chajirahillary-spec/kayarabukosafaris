"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { nav, site } from "@/data/site";
import { Wordmark } from "@/components/layout/Navbar";
import {
  KayaExperienceLogo,
  PartnerBadgeLogo,
} from "@/components/layout/BrandLogo";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { Container } from "@/components/ui/primitives";
import { FirestoreService } from "@/lib/firebase/firestoreService";
import { buildEnquiryWhatsAppMessage, whatsappLink } from "@/lib/whatsapp";
import type { SocialLink } from "@/lib/types";
import { MapPin, MessageCircle, Phone, Mail, Sprout } from "lucide-react";

const linkClass =
  "text-[13px] text-cream/85 underline-offset-4 hover:text-gold-light hover:underline transition-colors duration-200";
const headingClass =
  "mb-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-gold-light";

export function Footer() {
  const pathname = usePathname();
  const [contactEmail, setContactEmail] = useState<string>(site.contact.email);
  const [contactPhone, setContactPhone] = useState<string>(site.contact.phone);
  const [contactAddress, setContactAddress] = useState<string>(
    site.contact.address
  );
  const [whatsappNumber, setWhatsappNumber] = useState<string>(
    site.contact.whatsapp
  );
  const [closingStatement, setClosingStatement] = useState<string>(
    site.closingStatement
  );
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([
    ...site.social,
  ]);

  useEffect(() => {
    FirestoreService.getPlatformSettings().then((settings) => {
      if (settings.email) setContactEmail(settings.email);
      if (settings.primaryPhone) setContactPhone(settings.primaryPhone);
      if (settings.officeAddress) setContactAddress(settings.officeAddress);
      if (settings.whatsappNumber) setWhatsappNumber(settings.whatsappNumber);
      if (settings.closingStatement)
        setClosingStatement(settings.closingStatement);
      if (settings.socialLinks?.length) setSocialLinks(settings.socialLinks);
    });
  }, []);

  if (pathname?.startsWith("/admin")) return null;

  const resolveHref = (hashHref: string) =>
    hashHref.startsWith("/")
      ? hashHref
      : pathname === "/"
        ? hashHref
        : `/${hashHref}`;

  const waHref = whatsappLink(
    buildEnquiryWhatsAppMessage({
      areaOfInterest:
        "Excursions, Accommodation, Cultural Discovery & Kaya Roots Africa",
    }),
    whatsappNumber
  );

  return (
    <footer className="bg-forest text-cream border-t border-gold/25">
      <Container className="grid gap-10 py-14 sm:py-20 grid-cols-1 sm:grid-cols-2 lg:grid-cols-12">
        {/* Brand Identity & Kaya Experience Ltd Management Column */}
        <div className="sm:col-span-2 lg:col-span-5 space-y-4">
          <div className="flex flex-wrap items-center gap-4">
            <Wordmark inverse size="lg" />
          </div>

          <p className="font-display text-lg sm:text-xl tracking-[0.16em] uppercase text-gold-light pt-1">
            {site.tagline}
          </p>

          <p className="max-w-md text-sm leading-relaxed text-cream/85">
            {closingStatement}
          </p>

          {/* Managed by Kaya Experience Ltd Emblem Badge */}
          <div className="rounded-ka border border-gold/35 bg-green/35 p-3.5 max-w-md space-y-2">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gold-light">
              Proudly Managed By
            </p>
            <div className="flex items-center gap-3">
              <KayaExperienceLogo
                variant="light"
                alt="Kaya Experience Ltd Official Logo"
                width={210}
                height={56}
                className="h-12 w-auto"
              />
            </div>
            <p className="text-[11px] text-cream/80 leading-relaxed">
              Headquartered at <strong>Watamu, Timboni Stage</strong> · Led by{" "}
              <strong>Mrisa</strong> (&ldquo;The Shepherd&rdquo;) &amp; Co-Founder{" "}
              <strong>Dr. Milcah Wambua</strong> (Kaya Roots Africa).
            </p>
          </div>

          <p className="font-serif italic text-gold-light/90 text-base pt-1">
            &ldquo;{site.finalPhilosophy}&rdquo;
          </p>
        </div>

        {/* Quick Section Navigation */}
        <nav aria-label="Footer Navigation" className="lg:col-span-3">
          <h2 className={headingClass}>Discover KayArabuko</h2>
          <ul className="space-y-2">
            {nav.map((item) => (
              <li key={item.href}>
                <a className={linkClass} href={resolveHref(item.href)}>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Contact, Watamu Office & Kaya Roots Africa */}
        <div className="lg:col-span-4 space-y-5">
          <div>
            <h2 className={headingClass}>
              Office &amp; Direct Contacts ({contactPhone})
            </h2>
            <address className="space-y-2.5 text-xs sm:text-sm not-italic text-cream/85">
              <p className="flex items-start gap-2 text-cream/90">
                <MapPin className="h-4 w-4 text-gold shrink-0 mt-0.5" />
                <span>
                  <strong className="text-gold-light">Office Location:</strong>{" "}
                  {contactAddress}
                </span>
              </p>

              <p className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-gold shrink-0" />
                <span>
                  <a className={linkClass} href="tel:+254728560303">
                    +254 728 560303
                  </a>{" "}
                  /{" "}
                  <a className={linkClass} href="tel:+254712863538">
                    +254 712 863538
                  </a>
                </span>
              </p>

              <p className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-gold shrink-0" />
                <span>
                  General &amp; Tours:{" "}
                  <a className={linkClass} href={`mailto:${contactEmail}`}>
                    {contactEmail}
                  </a>
                </span>
              </p>

              <p className="flex items-start gap-2 pt-1 border-t border-cream/10">
                <Sprout className="h-4 w-4 text-gold-light shrink-0 mt-0.5" />
                <span>
                  <strong className="text-gold-light block text-xs">
                    Kaya Roots Africa (Dr. Milcah Wambua — Cassava &amp; Farmers):
                  </strong>
                  <a
                    className={linkClass}
                    href={`mailto:${site.contact.kayaRootsEmail}`}
                  >
                    {site.contact.kayaRootsEmail}
                  </a>
                </span>
              </p>
            </address>
          </div>

          <div>
            <WhatsAppButton
              label="Inquire on WhatsApp"
              href={waHref}
              variant="gold"
            />
          </div>

          {socialLinks.length > 0 && (
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-cream/55 mb-2">
                Follow the Story
              </p>
              <ul className="flex flex-wrap gap-x-5 gap-y-2 text-xs">
                {socialLinks.map((s) => (
                  <li key={s.label}>
                    <a
                      className={linkClass}
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {s.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </Container>

      {/* Vital Accreditations, Customer Ratings (TripAdvisor & Google) & Official Tourism/Conservation Logos (Magical Kenya & KWS) */}
      <Container className="border-t border-cream/15 py-7">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="max-w-md space-y-1">
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-gold-light">
              Accreditations, Guest Ratings &amp; Conservation Partners
            </p>
            <p className="font-display text-xl sm:text-2xl text-ivory">
              Top-Rated on TripAdvisor &amp; Google · Proudly Partnered With
              Magical Kenya &amp; KWS
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-6 sm:gap-8">
            <a
              href={resolveHref("#reviews")}
              className="transition-transform hover:-translate-y-0.5"
              title="View Verified TripAdvisor Guest Reviews (5.0 ★)"
            >
              <PartnerBadgeLogo
                slotKey="brand.tripadvisor.badge"
                defaultSrc="/images/tripadvisor-badge.svg"
                label="TripAdvisor 5.0 Travellers' Choice Rating Badge"
                className="h-11 sm:h-12 w-auto"
                width={200}
                height={54}
              />
            </a>

            <a
              href={resolveHref("#reviews")}
              className="transition-transform hover:-translate-y-0.5"
              title="View Verified Google Guest Reviews (4.9 ★)"
            >
              <PartnerBadgeLogo
                slotKey="brand.googleReviews.badge"
                defaultSrc="/images/google-reviews-badge.svg"
                label="Google Reviews 4.9 Verified Rating Badge"
                className="h-11 sm:h-12 w-auto"
                width={200}
                height={54}
              />
            </a>

            <PartnerBadgeLogo
              slotKey="brand.magicalKenya.logo"
              defaultSrc="/images/magical-kenya-logo.svg"
              label="Magical Kenya Official Destination Emblem"
              className="h-11 sm:h-12 w-auto"
              width={190}
              height={54}
            />

            <PartnerBadgeLogo
              slotKey="brand.kws.logo"
              defaultSrc="/images/kws-logo.svg"
              label="KWS (Kenya Wildlife Service) Conservation Emblem"
              className="h-11 sm:h-12 w-auto"
              width={195}
              height={54}
            />
          </div>
        </div>
      </Container>

      {/* Bottom Copyright & Closing Strip */}
      <Container className="border-t border-cream/15 py-6">
        <div className="flex flex-col gap-3 text-xs text-cream/70 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {site.name} · Managed by{" "}
            <strong className="text-ivory">{site.managedBy}</strong> (Watamu,
            Timboni Stage). All rights reserved. ·{" "}
            <span className="text-gold-light">{site.tagline}</span>
          </p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-1">
            <Link
              className="underline-offset-4 hover:text-gold-light hover:underline"
              href="/legal/privacy-policy"
            >
              Privacy Policy
            </Link>
            <Link
              className="underline-offset-4 hover:text-gold-light hover:underline"
              href="/legal/responsible-tourism-policy"
            >
              Responsible Cultural &amp; Nature Engagement
            </Link>
          </div>
        </div>
      </Container>
      <div className="ka-diamonds" aria-hidden="true" />
    </footer>
  );
}
