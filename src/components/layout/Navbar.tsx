"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, useCallback } from "react";
import { navGroups, site, type NavGroup } from "@/data/site";
import { BrandLogo } from "@/components/layout/BrandLogo";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { FirestoreService } from "@/lib/firebase/firestoreService";
import { buildEnquiryWhatsAppMessage, whatsappLink } from "@/lib/whatsapp";
import { useVisualEdit } from "@/components/visual-editor/VisualEditProvider";
import {
  MessageCircle,
  X,
  ArrowUpRight,
  ChevronDown,
  ArrowRight,
} from "lucide-react";

export function Wordmark({
  inverse = false,
  size = "default",
}: {
  inverse?: boolean;
  size?: "default" | "lg";
}) {
  return <BrandLogo inverse={inverse} size={size} />;
}

export function Navbar() {
  const pathname = usePathname();
  const { deletedSections } = useVisualEdit();
  const [open, setOpen] = useState(false);
  const [compact, setCompact] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeHash, setActiveHash] = useState<string>("#home");
  const [openDesktopDropdown, setOpenDesktopDropdown] = useState<string | null>(
    null
  );
  const [expandedMobileGroups, setExpandedMobileGroups] = useState<
    Record<string, boolean>
  >({
    "Safari Packages": true,
    "Excursions & Stays": true,
    "Discover Kenya": true,
    "About & Team": true,
  });
  const [whatsappNumber, setWhatsappNumber] = useState<string>(
    site.contact.whatsapp
  );

  const drawerRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const navContainerRef = useRef<HTMLElement>(null);
  const hoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isAdmin = pathname?.startsWith("/admin");

  useEffect(() => {
    FirestoreService.getPlatformSettings().then((settings) => {
      if (settings.whatsappNumber) setWhatsappNumber(settings.whatsappNumber);
    });
  }, []);

  // Scroll-morphing header + live reading progress bar
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setCompact(y > 30);

      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight > 0) {
        setScrollProgress(Math.min(1, Math.max(0, y / docHeight)));
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Scroll-spy for one-page sections
  useEffect(() => {
    if (pathname !== "/") return;

    const sectionIds = [
      "home",
      "introduction",
      "pillars",
      "cultures",
      "conservation",
      "explore",
      "experiences",
      "safari-packages",
      "excursions",
      "accommodation",
      "kaya-roots",
      "gallery",
      "stories",
      "about",
      "team",
      "reviews",
      "posters",
      "contact",
    ];

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            if (id === "introduction" || id === "pillars") {
              setActiveHash("#home");
            } else {
              setActiveHash(`#${id}`);
            }
          }
        }
      },
      {
        rootMargin: "-25% 0px -60% 0px",
        threshold: 0,
      }
    );

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [pathname]);

  // Close desktop dropdown when clicking outside or pressing Escape
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        navContainerRef.current &&
        !navContainerRef.current.contains(e.target as Node)
      ) {
        setOpenDesktopDropdown(null);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpenDesktopDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // Close drawer on route change & auto-scroll to hash section when arriving
  useEffect(() => {
    setOpen(false);
    setOpenDesktopDropdown(null);
    if (typeof window !== "undefined" && window.location.hash) {
      const targetId = window.location.hash.slice(1);
      setTimeout(() => {
        const targetEl = document.getElementById(targetId);
        if (targetEl) {
          setActiveHash(window.location.hash);
          targetEl.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 80);
    }
  }, [pathname]);

  const closeDrawer = useCallback(() => {
    setOpen(false);
    toggleRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!open) return;

    const originalOverflow = document.body.style.overflow;
    const originalPaddingRight = document.body.style.paddingRight;

    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }
    document.body.style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeDrawer();
      }
    };
    document.addEventListener("keydown", onKey);
    closeButtonRef.current?.focus();

    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.paddingRight = originalPaddingRight;
      document.removeEventListener("keydown", onKey);
    };
  }, [open, closeDrawer]);

  if (isAdmin) return null;

  const resolveHref = (hashHref: string) => {
    if (hashHref.startsWith("/")) return hashHref;
    return pathname === "/" ? hashHref : `/${hashHref}`;
  };

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    hashHref: string
  ) => {
    setOpenDesktopDropdown(null);
    if (pathname === "/" && hashHref.startsWith("#")) {
      const targetId = hashHref.slice(1);
      const targetEl = document.getElementById(targetId);
      if (targetEl) {
        e.preventDefault();
        setOpen(false);
        setActiveHash(hashHref);
        targetEl.scrollIntoView({ behavior: "smooth", block: "start" });
        window.history.replaceState(null, "", hashHref);
      }
    } else {
      setOpen(false);
    }
  };

  const isGroupActive = (group: NavGroup): boolean => {
    if (group.href.startsWith("/")) {
      return pathname === group.href;
    }
    if (pathname !== "/") return false;
    if (activeHash === group.href && !group.children) return true;
    if (group.children) {
      return group.children.some((child) => child.href === activeHash);
    }
    return false;
  };

  const handleMouseEnterGroup = (label: string) => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    setOpenDesktopDropdown(label);
  };

  const handleMouseLeaveGroup = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setOpenDesktopDropdown(null);
    }, 140);
  };

  const toggleMobileGroup = (label: string) => {
    setExpandedMobileGroups((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  // Filter out any deleted sections from the desktop & mobile navigation
  const visibleNavGroups: NavGroup[] = navGroups
    .map((group) => {
      if (!group.children) {
        if (group.href.startsWith("/")) return group;
        const secId = group.href.replace(/^#/, "");
        if (deletedSections.includes(secId)) return null;
        return group;
      }
      const remainingChildren = group.children.filter((child) => {
        if (child.href.startsWith("/")) return true;
        const secId = child.href.replace(/^#/, "");
        return !deletedSections.includes(secId);
      });
      if (remainingChildren.length === 0) return null;
      return {
        ...group,
        href: remainingChildren[0].href,
        children: remainingChildren,
      };
    })
    .filter((g): g is NavGroup => g !== null);

  const waHref = whatsappLink(
    buildEnquiryWhatsAppMessage({
      areaOfInterest:
        "Cultural Discovery, Conservation & Community Experiences",
    }),
    whatsappNumber
  );

  return (
    <>
      {/* Top Brand Philosophy Strip */}
      <div className="bg-forest px-4 py-2 text-center text-[11px] sm:text-[12px] text-cream border-b border-gold/20">
        <span className="text-gold-light font-semibold tracking-[0.2em] uppercase">
          {site.tagline}
        </span>
        <span
          className="mx-2.5 hidden md:inline text-cream/40"
          aria-hidden="true"
        >
          ·
        </span>
        <span className="hidden md:inline text-cream/85">
          {site.announcement}
        </span>
      </div>

      {/* Main Scroll-Morphing Sticky Header */}
      <header
        className={`sticky top-0 z-40 border-b transition-all duration-300 ease-out ${
          compact
            ? "border-gold/35 bg-ivory/95 py-2 shadow-[0_8px_30px_rgba(6,59,37,0.08)] backdrop-blur-md"
            : "border-gold/20 bg-ivory/90 py-3 sm:py-4 backdrop-blur-xs"
        }`}
      >
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          {/* Logo with subtle scroll scale transition */}
          <a
            href={resolveHref("#home")}
            onClick={(e) => handleNavClick(e, "#home")}
            aria-label={`${site.name} — return to top`}
            className={`shrink-0 flex items-center transition-all duration-300 hover:opacity-90 ${
              compact ? "scale-[0.95] origin-left" : "scale-100"
            }`}
          >
            <Wordmark />
          </a>

          {/* Desktop Organized Navigation with Dropdown Submenus */}
          <nav
            ref={navContainerRef}
            data-ve-ignore="true"
            aria-label="Primary section navigation"
            className="hidden lg:block"
          >
            <ul className="flex items-center gap-4 xl:gap-6">
              {visibleNavGroups.map((group) => {
                const active = isGroupActive(group);
                const hasSubmenu =
                  Array.isArray(group.children) && group.children.length > 0;
                const isDropdownOpen = openDesktopDropdown === group.label;

                if (!hasSubmenu) {
                  return (
                    <li key={group.label}>
                      <a
                        href={resolveHref(group.href)}
                        onClick={(e) => handleNavClick(e, group.href)}
                        aria-current={active ? "location" : undefined}
                        className={`group relative block py-2 text-xs font-semibold uppercase tracking-[0.11em] whitespace-nowrap transition-colors duration-200 ${
                          active
                            ? "text-green font-bold"
                            : "text-charcoal/85 hover:text-green"
                        }`}
                      >
                        <span>{group.label}</span>
                        <span
                          className={`pointer-events-none absolute bottom-0 left-0 right-0 h-[2px] origin-left bg-gold transition-transform duration-300 ease-out ${
                            active
                              ? "scale-x-100"
                              : "scale-x-0 group-hover:scale-x-100"
                          }`}
                          aria-hidden="true"
                        />
                      </a>
                    </li>
                  );
                }

                return (
                  <li
                    key={group.label}
                    className="relative"
                    onMouseEnter={() => handleMouseEnterGroup(group.label)}
                    onMouseLeave={handleMouseLeaveGroup}
                  >
                    <a
                      href={resolveHref(group.href)}
                      aria-expanded={isDropdownOpen}
                      aria-haspopup="true"
                      onClick={(e) => handleNavClick(e, group.href)}
                      className={`group relative flex items-center gap-1 py-2 text-xs font-semibold uppercase tracking-[0.11em] whitespace-nowrap transition-colors duration-200 cursor-pointer ${
                        active || isDropdownOpen
                          ? "text-green font-bold"
                          : "text-charcoal/85 hover:text-green"
                      }`}
                    >
                      <span>{group.label}</span>
                      <ChevronDown
                        className={`h-3.5 w-3.5 text-gold-dark transition-transform duration-200 ${
                          isDropdownOpen ? "rotate-180 text-green" : ""
                        }`}
                        aria-hidden="true"
                      />
                      <span
                        className={`pointer-events-none absolute bottom-0 left-0 right-0 h-[2px] origin-left bg-gold transition-transform duration-300 ease-out ${
                          active || isDropdownOpen
                            ? "scale-x-100"
                            : "scale-x-0 group-hover:scale-x-100"
                        }`}
                        aria-hidden="true"
                      />
                    </a>

                    {/* Dropdown Submenu Panel */}
                    <div
                      className={`absolute left-0 top-full pt-2.5 w-80 z-50 transition-all duration-200 origin-top-left ${
                        isDropdownOpen
                          ? "opacity-100 translate-y-0 scale-100 pointer-events-auto"
                          : "opacity-0 -translate-y-1.5 scale-95 pointer-events-none"
                      }`}
                    >
                      <div className="rounded-ka border border-gold/40 bg-ivory/98 p-2 shadow-[0_18px_45px_rgba(6,59,37,0.16)] backdrop-blur-md">
                        <div className="px-3 py-1.5 border-b border-gold/20 flex items-center justify-between">
                          <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-gold-dark">
                            {group.label}
                          </span>
                          <span className="text-[10px] text-charcoal/50 font-medium">
                            {group.children?.length} Sections
                          </span>
                        </div>
                        <ul className="mt-1 space-y-0.5">
                          {group.children?.map((subItem) => {
                            const subActive =
                              pathname === "/" && activeHash === subItem.href;
                            return (
                              <li key={subItem.href}>
                                <a
                                  href={resolveHref(subItem.href)}
                                  onClick={(e) =>
                                    handleNavClick(e, subItem.href)
                                  }
                                  className={`group/sub flex items-start justify-between gap-3 rounded-ka px-3 py-2.5 transition-all duration-150 ${
                                    subActive
                                      ? "bg-green/10 border-l-2 border-gold"
                                      : "hover:bg-cream/65"
                                  }`}
                                >
                                  <div className="space-y-0.5">
                                    <p
                                      className={`font-display text-sm font-semibold transition-colors ${
                                        subActive
                                          ? "text-green"
                                          : "text-forest group-hover/sub:text-green"
                                      }`}
                                    >
                                      {subItem.label}
                                    </p>
                                    <p className="text-[11px] leading-snug text-charcoal/70">
                                      {subItem.description}
                                    </p>
                                  </div>
                                  <ArrowRight
                                    className={`h-3.5 w-3.5 mt-1 shrink-0 transition-transform duration-150 ${
                                      subActive
                                        ? "text-gold-dark translate-x-0.5"
                                        : "text-charcoal/35 group-hover/sub:text-green group-hover/sub:translate-x-0.5"
                                    }`}
                                    aria-hidden="true"
                                  />
                                </a>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Right Header Actions */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <div className="hidden sm:block">
              <WhatsAppButton
                label="Inquire"
                href={waHref}
                variant="compact"
              />
            </div>

            {/* Mobile / Tablet Collapsible Menu Button with Animated Bars */}
            <button
              ref={toggleRef}
              type="button"
              className="group flex h-10 items-center justify-center gap-2 rounded-ka border border-green/30 bg-cream/25 px-3 py-2 text-[12px] font-semibold uppercase tracking-[0.12em] text-green hover:border-gold hover:bg-cream/55 lg:hidden transition-all duration-200"
              aria-expanded={open}
              aria-controls="mobile-navigation-drawer"
              aria-label="Open navigation menu"
              onClick={() => setOpen(true)}
            >
              <span className="font-semibold text-[11px] sm:text-[12px]">
                Menu
              </span>
              <span
                aria-hidden="true"
                className="flex flex-col justify-center gap-[4px] w-4.5"
              >
                <span className="block h-[2px] w-4.5 bg-green rounded-full transition-all duration-200 group-hover:w-3.5" />
                <span className="block h-[2px] w-4.5 bg-gold rounded-full" />
                <span className="block h-[2px] w-3.5 bg-green rounded-full ml-auto transition-all duration-200 group-hover:w-4.5" />
              </span>
            </button>
          </div>
        </div>

        {/* Live 2px Gold Reading Progress Hairline */}
        <div
          className="pointer-events-none absolute bottom-0 left-0 right-0 h-[2px] bg-transparent overflow-hidden"
          aria-hidden="true"
        >
          <div
            className="h-full w-full origin-left bg-gold transition-transform duration-150 ease-out"
            style={{ transform: `scaleX(${scrollProgress})` }}
          />
        </div>
      </header>

      {/* Mobile Collapsible Navigation Drawer with Grouped Accordion Submenus */}
      {open && (
        <div
          className="fixed inset-0 z-[60] lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Site navigation menu"
          id="mobile-navigation-drawer"
        >
          {/* Backdrop overlay */}
          <div
            className="fixed inset-0 bg-charcoal/75 backdrop-blur-xs transition-opacity duration-300"
            onClick={closeDrawer}
            aria-hidden="true"
          />

          {/* Sliding Drawer Container */}
          <div
            ref={drawerRef}
            className="fixed inset-y-0 right-0 flex h-full w-[min(90vw,23rem)] flex-col justify-between bg-forest text-ivory shadow-2xl animate-panel-enter"
          >
            {/* Drawer Header */}
            <div className="flex items-center justify-between border-b border-cream/15 px-5 py-4 shrink-0">
              <Wordmark inverse />
              <button
                ref={closeButtonRef}
                type="button"
                onClick={closeDrawer}
                className="flex h-10 w-10 items-center justify-center rounded-ka text-gold-light hover:bg-green/40 hover:text-ivory transition-colors"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Scrollable Navigation Body */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-gold-light">
                {site.tagline}
              </p>

              <nav
                data-ve-ignore="true"
                aria-label="Mobile Section Navigation"
              >
                <ul className="divide-y divide-cream/10">
                  {visibleNavGroups.map((group, idx) => {
                    const active = isGroupActive(group);
                    const hasSubmenu =
                      Array.isArray(group.children) &&
                      group.children.length > 0;
                    const isExpanded = !!expandedMobileGroups[group.label];

                    if (!hasSubmenu) {
                      return (
                        <li
                          key={group.label}
                          className="animate-hero-slide-right"
                          style={{ animationDelay: `${idx * 40}ms` }}
                        >
                          <a
                            href={resolveHref(group.href)}
                            onClick={(e) => handleNavClick(e, group.href)}
                            className={`group flex items-center justify-between py-3.5 text-base font-medium transition-all duration-200 ${
                              active
                                ? "text-gold-light font-bold pl-2.5 border-l-2 border-gold"
                                : "text-ivory hover:text-gold-light hover:pl-1.5"
                            }`}
                          >
                            <span className="font-display tracking-wide">
                              {group.label}
                            </span>
                            <span
                              className="text-gold-light/60 text-xs transition-transform duration-200 group-hover:translate-x-1"
                              aria-hidden="true"
                            >
                              →
                            </span>
                          </a>
                        </li>
                      );
                    }

                    return (
                      <li
                        key={group.label}
                        className="py-1.5 animate-hero-slide-right"
                        style={{ animationDelay: `${idx * 40}ms` }}
                      >
                        <div className="flex w-full items-center justify-between py-2.5">
                          <a
                            href={resolveHref(group.href)}
                            onClick={(e) => handleNavClick(e, group.href)}
                            className={`flex-1 text-left text-base font-medium transition-colors ${
                              active
                                ? "text-gold-light font-bold"
                                : "text-ivory hover:text-gold-light"
                            }`}
                          >
                            <span className="font-display tracking-wide">
                              {group.label}
                            </span>
                          </a>
                          <button
                            type="button"
                            onClick={() => toggleMobileGroup(group.label)}
                            aria-expanded={isExpanded}
                            aria-label={`Toggle ${group.label} submenu`}
                            className="cursor-pointer p-1 text-gold-light hover:text-ivory"
                          >
                            <ChevronDown
                              className={`h-4 w-4 transition-transform duration-200 ${
                                isExpanded ? "rotate-180" : ""
                              }`}
                            />
                          </button>
                        </div>

                        {isExpanded && (
                          <ul className="mt-1 mb-2 ml-2 space-y-1 border-l border-gold/30 pl-3.5">
                            {group.children?.map((subItem) => {
                              const subActive =
                                pathname === "/" && activeHash === subItem.href;
                              return (
                                <li key={subItem.href}>
                                  <a
                                    href={resolveHref(subItem.href)}
                                    onClick={(e) =>
                                      handleNavClick(e, subItem.href)
                                    }
                                    className={`block rounded-ka py-2 px-2.5 transition-colors ${
                                      subActive
                                        ? "bg-green/35 text-gold-light font-semibold"
                                        : "text-cream/85 hover:bg-green/20 hover:text-ivory"
                                    }`}
                                  >
                                    <span className="block text-sm font-medium">
                                      {subItem.label}
                                    </span>
                                    <span className="block text-[11px] text-cream/60 leading-snug">
                                      {subItem.description}
                                    </span>
                                  </a>
                                </li>
                              );
                            })}
                          </ul>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </nav>

              {/* Direct Contact Box */}
              <div className="rounded-ka border border-gold/30 bg-green/25 p-3.5 text-xs space-y-1.5">
                <p className="font-semibold text-gold-light">
                  Managed by Kaya Experience Ltd
                </p>
                <p className="text-cream/85 text-[11px] leading-relaxed">
                  Office: <strong>Watamu, Timboni Stage</strong>
                </p>
                <div className="flex flex-wrap gap-3 pt-1 font-mono font-semibold text-ivory">
                  <a
                    href="tel:+254728560303"
                    className="hover:text-gold-light transition-colors"
                  >
                    +254 728 560303
                  </a>
                  <span className="text-gold/50">·</span>
                  <a
                    href="tel:+254712863538"
                    className="hover:text-gold-light transition-colors"
                  >
                    +254 712 863538
                  </a>
                </div>
                <p className="text-[11px] text-cream/75 pt-0.5">
                  Kaya Roots Africa:{" "}
                  <a
                    href="mailto:kayaroots@kayarabuko.com"
                    className="text-gold-light underline"
                  >
                    kayaroots@kayarabuko.com
                  </a>
                </p>
              </div>
            </div>

            {/* Drawer Footer Actions */}
            <div className="border-t border-cream/15 bg-forest/95 p-5 space-y-2.5 shrink-0">
              <WhatsAppButton
                label="Inquire on WhatsApp"
                href={waHref}
                variant="gold"
                fullWidth
                onClick={() => setOpen(false)}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
