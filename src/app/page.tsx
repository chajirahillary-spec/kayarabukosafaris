"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import Image from "next/image";
import {
  SAVED_FIREBASE_IMAGE_OVERRIDES,
  aboutContent,
  accommodationOptions,
  accommodationSectionHeader,
  activityGalleryCategories,
  activityGallerySectionHeader,
  arabukoSokokeSpotlight,
  brandPillars,
  communityProfiles as initialCommunities,
  conservationSectionHeader,
  conservationThemes,
  culturesSectionHeader,
  customerReviewsList,
  customerReviewsSectionHeader,
  ecosystemHighlights,
  excursionsList,
  excursionsSectionHeader,
  experiencesSectionHeader,
  exploreRegionsHeader,
  heroContent,
  initialActivityGallery,
  initialPublishedPosters,
  introContent,
  kayaRootsProgram,
  kidFriendlyAccommodationHighlight,
  postersSectionHeader,
  regionFeatures as initialRegions,
  safariPackagesList,
  safariPackagesSectionHeader,
  stories as initialStories,
  storiesSectionHeader,
  storyCategories,
  teamMembers,
  teamSectionHeader,
  transferServicesList,
  transfersSectionHeader,
  visitExperiences as initialVisitExperiences,
} from "@/data/content";
import { site } from "@/data/site";
import {
  KayaExperienceLogo,
  PartnerBadgeLogo,
} from "@/components/layout/BrandLogo";
import { buildEnquiryWhatsAppMessage, whatsappLink } from "@/lib/whatsapp";
import { Container } from "@/components/ui/primitives";
import { SiteImage } from "@/components/ui/SiteImage";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { HeroSlideshow, HERO_SLIDES } from "@/components/home/HeroSlideshow";
import { AnimatedImpactStrip } from "@/components/home/AnimatedImpactStrip";
import {
  ExperienceEnquirySection,
  type SelectedEnquiryPreset,
} from "@/components/forms/ExperienceEnquirySection";
import { StoryReaderModal } from "@/components/stories/StoryReaderModal";
import {
  FirestoreService,
  DEFAULT_PLATFORM_SETTINGS,
  type PlatformSettings,
} from "@/lib/firebase/firestoreService";
import {
  MediaService,
  sanitizePublicLabel,
  type SiteImageOverrides,
} from "@/lib/firebase/mediaService";
import { useVisualEdit } from "@/components/visual-editor/VisualEditProvider";
import type {
  ActivityGalleryItem,
  CommunityProfile,
  ImageRef,
  PublishedPoster,
  RegionFeature,
  Story,
  VisitExperience,
} from "@/lib/types";
import {
  ArrowDown,
  ArrowRight,
  Baby,
  CheckCircle2,
  Compass,
  Clock,
  Leaf,
  MapPin,
  Image as ImageIcon,
  Home,
  ShieldCheck,
  Sprout,
  Mail,
  Phone,
  Users,
  Upload,
  X,
  Loader2,
  Sparkles,
  Check,
  Camera,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Car,
  Train,
  Plane,
  Star,
  MessageCircle,
} from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  // CMS-hydratable state initialized with static editorial data for instant SSR & SEO
  const [communities, setCommunities] =
    useState<CommunityProfile[]>(initialCommunities);
  const [regions, setRegions] = useState<RegionFeature[]>(initialRegions);
  const [experiencesList, setExperiencesList] = useState<VisitExperience[]>(
    initialVisitExperiences
  );
  const [storiesList, setStoriesList] = useState<Story[]>(initialStories);
  const [postersList, setPostersList] = useState<PublishedPoster[]>(
    initialPublishedPosters
  );
  const [activityGalleryList, setActivityGalleryList] = useState<
    ActivityGalleryItem[]
  >(initialActivityGallery);
  const [platformSettings, setPlatformSettings] = useState<PlatformSettings>(
    DEFAULT_PLATFORM_SETTINGS
  );
  const [imageOverrides, setImageOverrides] = useState<SiteImageOverrides>(
    SAVED_FIREBASE_IMAGE_OVERRIDES
  );
  const {
    imageOverrides: liveVisualImageOverrides,
    isAdminAuthenticated,
  } = useVisualEdit();

  // Interactive UI states
  const [activeRegionSlug, setActiveRegionSlug] = useState<string>(
    initialRegions[0]?.slug || "kenyan-coast"
  );
  const [activePackageDurationFilter, setActivePackageDurationFilter] =
    useState<"all" | "short" | "classic" | "extended">("all");
  const [expandedPackageInclusions, setExpandedPackageInclusions] = useState<
    Record<string, boolean>
  >({});
  const reviewsCarouselRef = useRef<HTMLDivElement>(null);
  const [activeStoryCategory, setActiveStoryCategory] = useState<string>("all");
  const [activeStoryModal, setActiveStoryModal] = useState<Story | null>(null);
  const [activePosterModal, setActivePosterModal] =
    useState<PublishedPoster | null>(null);
  const [showPosterUploadModal, setShowPosterUploadModal] = useState(false);
  const [queuedPosterFiles, setQueuedPosterFiles] = useState<
    Array<{ file: File; title: string; category: string }>
  >([]);
  const [newPosterSubtitle, setNewPosterSubtitle] = useState("");
  const [newPosterCategory, setNewPosterCategory] = useState("Excursions");
  const [newPosterDesc, setNewPosterDesc] = useState("");
  const [replaceExistingPosters, setReplaceExistingPosters] = useState(false);
  const [uploadingPoster, setUploadingPoster] = useState(false);
  const [posterBatchProgress, setPosterBatchProgress] = useState<{
    done: number;
    total: number;
    currentName: string;
  } | null>(null);
  const [posterUploadNotice, setPosterUploadNotice] = useState<string | null>(
    null
  );

  // Safari & Activity Gallery interactive states
  const [activeGalleryCategory, setActiveGalleryCategory] =
    useState<string>("All Tours & Travels");
  const [activeGalleryLightboxIdx, setActiveGalleryLightboxIdx] = useState<
    number | null
  >(null);
  const [showActivityUploadModal, setShowActivityUploadModal] = useState(false);
  const [queuedActivityFiles, setQueuedActivityFiles] = useState<
    Array<{
      file: File;
      title: string;
      category: ActivityGalleryItem["category"];
      location: string;
    }>
  >([]);
  const [defaultActivityCategory, setDefaultActivityCategory] =
    useState<ActivityGalleryItem["category"]>("Real Safari Wildlife & Animals");
  const [defaultActivityLocation, setDefaultActivityLocation] = useState(
    "Watamu, Arabuko-Sokoke & Tsavo"
  );
  const [defaultActivityCaption, setDefaultActivityCaption] = useState("");
  const [uploadingActivities, setUploadingActivities] = useState(false);
  const [activityBatchProgress, setActivityBatchProgress] = useState<{
    done: number;
    total: number;
    currentName: string;
  } | null>(null);
  const [activityUploadNotice, setActivityUploadNotice] = useState<
    string | null
  >(null);

  const [enquiryPreset, setEnquiryPreset] =
    useState<SelectedEnquiryPreset | null>(null);

  // Hydrate live CMS overrides from Firestore if configured
  useEffect(() => {
    FirestoreService.getPlatformSettings().then(setPlatformSettings);
    MediaService.getSiteImageOverrides().then(setImageOverrides);
    MediaService.getPublishedPosters().then(setPostersList);
    MediaService.getActivityGallery().then(setActivityGalleryList);
    FirestoreService.getCommunities().then((data) => {
      if (data.length > 0) setCommunities(data);
    });
    FirestoreService.getRegions().then((data) => {
      if (data.length > 0) setRegions(data);
    });
    FirestoreService.getVisitExperiences().then((data) => {
      if (data.length > 0) setExperiencesList(data);
    });
    FirestoreService.getStories().then((data) => {
      if (data.length > 0) setStoriesList(data);
    });
  }, []);

  const handleSelectPosterFiles = (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    const incoming = Array.from(fileList).map((file, idx) => {
      const rawTitle = file.name
        .replace(/\.[^/.]+$/, "")
        .replace(/[-_]+/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase());
      const cleanTitle = sanitizePublicLabel(
        rawTitle,
        `Published Poster ${idx + 1}`
      );
      return {
        file,
        title: cleanTitle,
        category: newPosterCategory,
      };
    });
    setQueuedPosterFiles((prev) => [...prev, ...incoming]);
  };

  const handleUploadNewPoster = async (e: React.FormEvent) => {
    e.preventDefault();
    if (queuedPosterFiles.length === 0) return;
    setUploadingPoster(true);
    setPosterUploadNotice(null);
    try {
      const uploadedItems: PublishedPoster[] = [];
      const newOverridesMap: SiteImageOverrides = {};
      const total = queuedPosterFiles.length;

      for (let i = 0; i < queuedPosterFiles.length; i++) {
        const item = queuedPosterFiles[i];
        setPosterBatchProgress({
          done: i + 1,
          total,
          currentName: item.title || item.file.name,
        });

        const posterId = `poster-${Date.now()}-${i}`;
        const storageUrl = await MediaService.uploadWebsiteImage(
          item.file,
          `poster.${posterId}`
        );
        newOverridesMap[`poster.${posterId}`] = storageUrl;

        uploadedItems.push({
          id: posterId,
          title: item.title.trim() || item.file.name.replace(/\.[^/.]+$/, ""),
          subtitle:
            newPosterSubtitle.trim() ||
            "Managed by Kaya Experience Ltd · Watamu, Timboni Stage",
          category: item.category || newPosterCategory,
          dateLabel: "Published Poster",
          description:
            newPosterDesc.trim() ||
            "Official poster published by KayArabuko / Kaya Experience Ltd. Contacts: +254 728 560303 / +254 712 863538.",
          image: {
            src: storageUrl,
            alt: item.title.trim() || "KayArabuko Published Poster",
          },
        });
      }

      const baseList = replaceExistingPosters ? [] : postersList;
      const updated = [...uploadedItems, ...baseList];
      const saved = await MediaService.savePublishedPosters(updated);
      setPostersList(saved);
      setImageOverrides((prev) => ({
        ...prev,
        ...newOverridesMap,
      }));
      setQueuedPosterFiles([]);
      setNewPosterSubtitle("");
      setNewPosterDesc("");
      setPosterUploadNotice(
        `Successfully uploaded ${uploadedItems.length} poster${
          uploadedItems.length > 1 ? "s" : ""
        } and published to the website!`
      );
      setTimeout(() => {
        setShowPosterUploadModal(false);
        setPosterUploadNotice(null);
      }, 1600);
    } catch (err: unknown) {
      setPosterUploadNotice(
        err instanceof Error ? err.message : "Could not upload posters."
      );
    } finally {
      setUploadingPoster(false);
      setPosterBatchProgress(null);
    }
  };

  const handleSelectActivityFiles = (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    const incoming = Array.from(fileList).map((file, idx) => {
      const rawTitle = file.name
        .replace(/\.[^/.]+$/, "")
        .replace(/[-_]+/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase());
      const cleanTitle = sanitizePublicLabel(
        rawTitle,
        `Safari & Activity Photo ${idx + 1}`
      );
      return {
        file,
        title: cleanTitle,
        category: defaultActivityCategory,
        location: defaultActivityLocation,
      };
    });
    setQueuedActivityFiles((prev) => [...prev, ...incoming]);
  };

  const handleUploadActivityBatch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (queuedActivityFiles.length === 0) return;
    setUploadingActivities(true);
    setActivityUploadNotice(null);
    try {
      const uploadedItems: ActivityGalleryItem[] = [];
      const newOverridesMap: SiteImageOverrides = {};
      const total = queuedActivityFiles.length;

      for (let i = 0; i < queuedActivityFiles.length; i++) {
        const item = queuedActivityFiles[i];
        setActivityBatchProgress({
          done: i + 1,
          total,
          currentName: item.title || item.file.name,
        });

        const activityId = `act-${Date.now()}-${i}`;
        const storageUrl = await MediaService.uploadWebsiteImage(
          item.file,
          `activity.${activityId}`
        );
        newOverridesMap[`activity.${activityId}`] = storageUrl;

        uploadedItems.push({
          id: activityId,
          title: item.title.trim() || item.file.name.replace(/\.[^/.]+$/, ""),
          location: item.location.trim() || defaultActivityLocation,
          category: item.category || defaultActivityCategory,
          caption:
            defaultActivityCaption.trim() ||
            "Safari & excursion activity curated by Kaya Experience Ltd (Watamu, Timboni Stage). Contacts: +254 728 560303 / +254 712 863538.",
          image: {
            src: storageUrl,
            alt: item.title.trim() || "KayArabuko Safari & Activity Photo",
          },
          featuredSpan: i === 0,
        });
      }

      const updated = [...uploadedItems, ...activityGalleryList];
      const saved = await MediaService.saveActivityGallery(updated);
      setActivityGalleryList(saved);
      setImageOverrides((prev) => ({
        ...prev,
        ...newOverridesMap,
      }));
      setQueuedActivityFiles([]);
      setDefaultActivityCaption("");
      setActivityUploadNotice(
        `Successfully uploaded ${uploadedItems.length} safari activity photo${
          uploadedItems.length > 1 ? "s" : ""
        } to the gallery!`
      );
      setTimeout(() => {
        setShowActivityUploadModal(false);
        setActivityUploadNotice(null);
      }, 1500);
    } catch (err: unknown) {
      setActivityUploadNotice(
        err instanceof Error
          ? err.message
          : "Could not upload safari activity photos."
      );
    } finally {
      setUploadingActivities(false);
      setActivityBatchProgress(null);
    }
  };

  const withOverride = useCallback(
    (slotKey: string, image?: ImageRef): ImageRef => {
      const overrideSrc =
        liveVisualImageOverrides[slotKey] || imageOverrides[slotKey];
      return {
        alt: image?.alt || "KayArabuko Photography",
        src: overrideSrc || image?.src,
        slotKey,
      };
    },
    [imageOverrides, liveVisualImageOverrides]
  );

  const heroSlidesWithOverrides = HERO_SLIDES.map((s, idx) => ({
    ...s,
    src:
      liveVisualImageOverrides[`hero.${idx}`] ||
      imageOverrides[`hero.${idx}`] ||
      s.src,
  }));

  /**
   * Smoothly scrolls to #contact and pre-populates the Experience Enquiry form & WhatsApp CTA
   */
  const triggerContextualEnquiry = useCallback(
    (areaOfInterest: string, preferredLocation: string, contextNote: string) => {
      setEnquiryPreset({
        areaOfInterest,
        preferredLocation,
        contextNote,
        timestamp: Date.now(),
      });

      const contactEl = document.getElementById("contact");
      if (contactEl) {
        contactEl.scrollIntoView({ behavior: "smooth", block: "start" });
        window.history.replaceState(null, "", "#contact");
      }
    },
    []
  );

  const scrollToSection = (
    e: React.MouseEvent<HTMLAnchorElement>,
    sectionId: string
  ) => {
    const el = document.getElementById(sectionId);
    if (el) {
      e.preventDefault();
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      window.history.replaceState(null, "", `#${sectionId}`);
    }
  };

  const filteredStories =
    activeStoryCategory === "all"
      ? storiesList
      : storiesList.filter((s) => s.categorySlug === activeStoryCategory);

  const filteredActivityGallery =
    activeGalleryCategory === "All Tours & Travels" ||
    activeGalleryCategory === "All Activities"
      ? activityGalleryList
      : activityGalleryList.filter(
          (item) => item.category === activeGalleryCategory
        );

  const activeLightboxItem =
    activeGalleryLightboxIdx !== null
      ? filteredActivityGallery[activeGalleryLightboxIdx] || null
      : null;

  const selectedRegion =
    regions.find((r) => r.slug === activeRegionSlug) || regions[0];

  return (
    <>
      {/* =====================================================================
          SECTION 01: HERO — INTRODUCING KAYARABUKO
      ===================================================================== */}
      <section
        id="home"
        className="relative bg-forest text-ivory overflow-hidden scroll-mt-20"
        aria-labelledby="hero-title"
      >
        <HeroSlideshow intervalMs={6500} slides={heroSlidesWithOverrides} />

        <Container className="relative z-10 flex min-h-[84vh] sm:min-h-[88vh] flex-col justify-center pt-20 pb-28 sm:pt-28 sm:pb-36">
          <div className="max-w-3xl">
            {/* Step 1: Animated Gold Accent Rule + Eyebrow Slide-Right */}
            <div className="mb-4 inline-flex items-center gap-3">
              <span
                className="animate-hero-line-draw block h-5 w-[2px] bg-gold"
                style={{ animationDelay: "60ms" }}
                aria-hidden="true"
              />
              <p
                className="animate-hero-slide-right text-[11px] sm:text-xs font-semibold uppercase tracking-[0.26em] text-gold-light"
                style={{ animationDelay: "100ms" }}
              >
                {platformSettings.tagline || heroContent.eyebrow}
              </p>
            </div>

            {/* Step 2: Main Headline Editorial Rise Reveal */}
            <h1
              id="hero-title"
              className="animate-hero-fade-up font-display text-4xl sm:text-6xl lg:text-7xl leading-[1.05] tracking-tight text-ivory"
              style={{ animationDelay: "200ms" }}
            >
              {platformSettings.heroHeadline || heroContent.headline}
            </h1>

            {/* Step 3: Supporting Description Soft Upward Fade */}
            <p
              className="animate-hero-fade-up mt-5 sm:mt-6 max-w-2xl text-sm sm:text-base md:text-lg leading-relaxed text-cream/95"
              style={{ animationDelay: "340ms" }}
            >
              {platformSettings.heroDescription || heroContent.description}
            </p>

            {/* Step 4: Staggered Primary & Secondary CTA Buttons with Hover Micro-Interactions */}
            <div
              className="animate-hero-fade-up mt-8 sm:mt-10 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5"
              style={{ animationDelay: "480ms" }}
            >
              <a
                href="#explore"
                onClick={(e) => scrollToSection(e, "explore")}
                className="group inline-flex items-center justify-center gap-2.5 rounded-ka bg-gold px-7 py-4 text-center text-xs sm:text-[13px] font-semibold uppercase tracking-[0.14em] text-forest hover:-translate-y-0.5 hover:bg-gold-light hover:shadow-[0_12px_28px_-6px_rgba(199,148,45,0.5)] transition-all duration-300"
              >
                <span>{heroContent.primaryCta.label}</span>
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5" />
              </a>

              <a
                href="#conservation"
                onClick={(e) => scrollToSection(e, "conservation")}
                className="inline-flex items-center justify-center rounded-ka border border-gold-light/80 bg-forest/55 backdrop-blur-xs px-7 py-4 text-center text-xs sm:text-[13px] font-semibold uppercase tracking-[0.14em] text-ivory hover:-translate-y-0.5 hover:bg-ivory hover:text-forest hover:border-ivory transition-all duration-300"
              >
                {heroContent.secondaryCta.label}
              </a>
            </div>
          </div>

          {/* Step 5: Subtle Floating Scroll Indicator */}
          <div
            className="animate-hero-fade-up mt-14 sm:mt-20"
            style={{ animationDelay: "660ms" }}
          >
            <a
              href="#introduction"
              onClick={(e) => scrollToSection(e, "introduction")}
              className="group inline-flex items-center gap-2.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-cream/75 hover:text-gold-light transition-colors"
              aria-label="Scroll down to introduction"
            >
              <span>Scroll to discover</span>
              <span className="animate-hero-float inline-flex h-6 w-6 items-center justify-center rounded-full border border-gold/40 bg-forest/60 text-gold group-hover:border-gold group-hover:bg-gold group-hover:text-forest transition-colors">
                <ArrowDown className="h-3 w-3" />
              </span>
            </a>
          </div>
        </Container>
      </section>

      {/* =====================================================================
          SECTION 02: INTRODUCTION — MORE THAN A DESTINATION
      ===================================================================== */}
      <section
        id="introduction"
        className="scroll-mt-20 py-20 sm:py-28 lg:py-32 bg-ivory ka-topo-bg"
        aria-labelledby="intro-heading"
      >
        <Container>
          <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
            {/* Editorial Text Column */}
            <ScrollReveal
              variant="fade-up"
              className="lg:col-span-6 space-y-6"
            >
              <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.22em] text-gold">
                {introContent.eyebrow}
              </p>

              <h2
                id="intro-heading"
                className="font-display text-3xl sm:text-4xl lg:text-5xl leading-[1.08] text-green"
              >
                {platformSettings.introHeadline || introContent.headline}
              </h2>

              <div className="space-y-4 text-sm sm:text-base leading-relaxed text-charcoal/85 max-w-xl">
                {introContent.paragraphs.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>

              <div className="pt-2 flex flex-wrap items-center gap-6 border-t border-charcoal/15 text-xs font-semibold uppercase tracking-[0.16em] text-green">
                <a
                  href="#cultures"
                  onClick={(e) => scrollToSection(e, "cultures")}
                  className="group inline-flex items-center gap-1.5 hover:text-gold transition-colors"
                >
                  <span>Meet the Communities</span>
                  <ArrowRight className="h-3.5 w-3.5 text-gold transition-transform duration-250 group-hover:translate-x-1" />
                </a>
                <a
                  href="#conservation"
                  onClick={(e) => scrollToSection(e, "conservation")}
                  className="group inline-flex items-center gap-1.5 hover:text-gold transition-colors"
                >
                  <span>Explore Conservation</span>
                  <ArrowRight className="h-3.5 w-3.5 text-gold transition-transform duration-250 group-hover:translate-x-1" />
                </a>
              </div>
            </ScrollReveal>

            {/* Editorial Dual Image Composition */}
            <div className="lg:col-span-6">
              <div className="grid gap-4 sm:grid-cols-12 items-end">
                <ScrollReveal
                  variant="fade-left"
                  delayMs={100}
                  className="sm:col-span-7 group overflow-hidden rounded-ka border border-charcoal/10 shadow-sm"
                >
                  <SiteImage
                    image={withOverride("intro.people", introContent.primaryImage)}
                    className="aspect-[4/5] w-full transition-transform duration-700 ease-out group-hover:scale-105"
                    sizes="(min-width: 1024px) 30vw, 100vw"
                    tone="forest"
                  />
                  <div className="bg-cream/60 px-4 py-2.5 text-[11px] font-medium text-charcoal/80">
                    Living traditions, knowledge &amp; community identity
                  </div>
                </ScrollReveal>

                <ScrollReveal
                  variant="fade-left"
                  delayMs={240}
                  className="sm:col-span-5 space-y-4"
                >
                  <div className="group overflow-hidden rounded-ka border border-charcoal/10 shadow-sm">
                    <SiteImage
                      image={withOverride("intro.forest", introContent.secondaryImage)}
                      className="aspect-[4/4] w-full transition-transform duration-700 ease-out group-hover:scale-105"
                      sizes="(min-width: 1024px) 20vw, 100vw"
                      tone="green"
                    />
                    <div className="bg-forest px-4 py-2.5 text-[11px] font-medium text-cream/90">
                      Indigenous forests &amp; living ecosystems
                    </div>
                  </div>

                  <div className="rounded-ka border border-gold/40 bg-cream/40 p-4">
                    <p className="font-display text-lg leading-snug text-green">
                      &ldquo;To truly appreciate Kenya, we must understand its
                      people, cultures and natural heritage.&rdquo;
                    </p>
                  </div>
                </ScrollReveal>
              </div>
            </div>
          </div>

          {/* Scroll-Triggered Animated Impact & Heritage Milestones Bar */}
          <AnimatedImpactStrip />
        </Container>
      </section>

      {/* =====================================================================
          SECTION 03: OUR THREE PILLARS — EXPLORE. CONSERVE. EMPOWER.
      ===================================================================== */}
      <section
        id="pillars"
        className="scroll-mt-20 bg-cream/45 py-20 sm:py-28 border-y border-charcoal/10"
        aria-labelledby="pillars-heading"
      >
        <Container>
          <ScrollReveal variant="fade-up" className="max-w-2xl">
            <p className="mb-2.5 text-[11px] sm:text-xs font-semibold uppercase tracking-[0.22em] text-gold">
              OUR CORE PHILOSOPHY
            </p>
            <h2
              id="pillars-heading"
              className="font-display text-3xl sm:text-4xl lg:text-5xl leading-[1.06] text-green"
            >
              Explore. Conserve. Empower.
            </h2>
            <p className="mt-4 text-sm sm:text-base leading-relaxed text-charcoal/80">
              Every experience, story and partnership at KayArabuko is guided by
              three interconnected pillars.
            </p>
          </ScrollReveal>

          <div className="mt-12 grid gap-8 lg:grid-cols-3">
            {brandPillars.map((pillar, idx) => (
              <ScrollReveal
                key={pillar.id}
                variant="fade-up"
                delayMs={idx * 130}
                className="h-full"
              >
                <article className="ka-card-hover group flex h-full flex-col justify-between overflow-hidden rounded-ka border border-charcoal/15 bg-ivory hover:border-gold">
                  <div>
                    {/* Editorial Pillar Photography */}
                    <div className="relative overflow-hidden">
                      <SiteImage
                        image={withOverride(`pillar.${pillar.id}`, pillar.image)}
                        slotKey={`pillar.${pillar.id}`}
                        className="aspect-[16/10] w-full transition-transform duration-700 ease-out group-hover:scale-105"
                        sizes="(min-width: 1024px) 33vw, 100vw"
                        tone="forest"
                      />
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-forest/80 via-transparent to-transparent" />
                      <span className="pointer-events-none absolute bottom-3 left-4 font-display text-3xl text-gold-light transition-transform duration-300 group-hover:translate-x-1">
                        {pillar.number}
                      </span>
                    </div>

                    {/* Pillar Content */}
                    <div className="p-6 sm:p-8 space-y-4">
                      <div>
                        <h3 className="font-display text-3xl sm:text-4xl tracking-wide text-green">
                          {pillar.title}
                        </h3>
                        <p className="mt-1 text-xs font-semibold uppercase tracking-[0.12em] text-gold">
                          {pillar.subtitle}
                        </p>
                      </div>

                      <p className="text-sm sm:text-base leading-relaxed text-charcoal/85">
                        {pillar.description}
                      </p>

                      <ul className="space-y-2 pt-2 border-t border-charcoal/10 text-xs sm:text-[13px] text-charcoal/80">
                        {pillar.highlights.map((item) => (
                          <li key={item} className="flex items-start gap-2">
                            <span
                              className="mt-1.5 h-1.5 w-1.5 rounded-full bg-gold shrink-0"
                              aria-hidden="true"
                            />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="px-6 pb-6 sm:px-8 sm:pb-8">
                    <a
                      href={pillar.targetAnchor}
                      onClick={(e) =>
                        scrollToSection(e, pillar.targetAnchor.replace("#", ""))
                      }
                      className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-green group-hover:text-gold transition-colors"
                    >
                      <span>{pillar.ctaLabel}</span>
                      <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1.5" />
                    </a>
                  </div>
                </article>
              </ScrollReveal>
            ))}
          </div>
        </Container>
      </section>

      {/* =====================================================================
          SECTION 04: CULTURES & COMMUNITIES — THE HEART OF KENYA
      ===================================================================== */}
      <section
        id="cultures"
        className="scroll-mt-20 py-20 sm:py-28 lg:py-32 bg-ivory"
        aria-labelledby="cultures-heading"
      >
        <Container>
          {/* Section Header */}
          <ScrollReveal
            variant="fade-up"
            className="grid gap-8 lg:grid-cols-12 lg:items-end"
          >
            <div className="lg:col-span-7">
              <p className="mb-2.5 text-[11px] sm:text-xs font-semibold uppercase tracking-[0.22em] text-gold">
                {culturesSectionHeader.eyebrow}
              </p>
              <h2
                id="cultures-heading"
                className="font-display text-3xl sm:text-4xl lg:text-5xl leading-[1.06] text-green"
              >
                {culturesSectionHeader.headline}
              </h2>
              <p className="mt-4 max-w-2xl text-sm sm:text-base leading-relaxed text-charcoal/85">
                {culturesSectionHeader.description}
              </p>
            </div>

            <div className="lg:col-span-5">
              <div className="rounded-ka border-l-2 border-gold bg-cream/45 p-4 sm:p-5 text-xs sm:text-[13px] leading-relaxed text-charcoal/85">
                <strong className="block font-semibold text-forest uppercase tracking-[0.1em] text-[11px] mb-1">
                  Dignity, Authenticity &amp; Community Ownership
                </strong>
                {culturesSectionHeader.respectStatement}
              </div>
            </div>
          </ScrollReveal>

          {/* Quick Horizontal Community Jump Strip */}
          <ScrollReveal
            variant="fade-up"
            delayMs={100}
            className="mt-10 flex items-center gap-2 overflow-x-auto pb-2"
          >
            {communities.map((community) => (
              <a
                key={community.slug}
                href={`#community-${community.slug}`}
                className="shrink-0 rounded-ka border border-charcoal/20 bg-cream/35 px-4 py-2 text-xs font-semibold text-charcoal hover:-translate-y-0.5 hover:border-gold hover:bg-green hover:text-ivory transition-all duration-200"
              >
                {community.name}
              </a>
            ))}
          </ScrollReveal>

          {/* Alternating Editorial Community Features */}
          <div className="mt-10 space-y-12 sm:space-y-16">
            {communities.map((community, idx) => {
              const isEven = idx % 2 === 1;
              return (
                <ScrollReveal
                  key={community.slug}
                  variant={isEven ? "fade-left" : "fade-right"}
                  delayMs={60}
                >
                  <article
                    id={`community-${community.slug}`}
                    className="ka-card-hover group scroll-mt-28 grid gap-8 lg:grid-cols-12 lg:items-center rounded-ka border border-charcoal/15 bg-cream/25 p-5 sm:p-8 lg:p-10 hover:border-gold/60"
                  >
                    {/* Community Photograph */}
                    <div
                      className={`lg:col-span-5 ${
                        isEven ? "lg:order-2" : ""
                      } overflow-hidden rounded-ka border border-charcoal/10`}
                    >
                      <SiteImage
                        image={withOverride(
                          `community.${community.slug}`,
                          community.image
                        )}
                        className="aspect-[4/3] sm:aspect-[5/4] w-full transition-transform duration-700 ease-out group-hover:scale-105"
                        sizes="(min-width: 1024px) 42vw, 100vw"
                        tone="forest"
                      />
                    </div>

                    {/* Community Editorial Details */}
                    <div
                      className={`lg:col-span-7 ${
                        isEven ? "lg:order-1" : ""
                      } space-y-4`}
                    >
                      <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-gold">
                        <MapPin className="h-3.5 w-3.5 shrink-0" />
                        <span>{community.region}</span>
                      </div>

                      <h3 className="font-display text-3xl sm:text-4xl text-green">
                        {community.name}
                      </h3>

                      <p className="text-sm sm:text-base font-medium leading-relaxed text-charcoal/90">
                        {community.introduction}
                      </p>

                      <p className="text-xs sm:text-sm leading-relaxed text-charcoal/75">
                        {community.livelihoodsAndHeritage}
                      </p>

                      {/* What Visitors Can Discover */}
                      <div className="pt-2">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-forest mb-2.5">
                          What Visitors Can Discover
                        </p>
                        <ul className="grid gap-2 sm:grid-cols-2 text-xs sm:text-[13px] text-charcoal/85">
                          {community.discoveries.map((disc) => (
                            <li
                              key={disc}
                              className="flex items-start gap-2 rounded-ka bg-ivory/80 p-2.5 border border-charcoal/10 transition-colors duration-200 hover:border-gold/60 hover:bg-ivory"
                            >
                              <span
                                className="mt-1.5 h-1.5 w-1.5 rounded-full bg-gold shrink-0"
                                aria-hidden="true"
                              />
                              <span>{disc}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* CTA */}
                      <div className="pt-3">
                        <WhatsAppButton
                          label="Inquire via WhatsApp"
                          context={{
                            areaOfInterest: "Cultural & Heritage Visits",
                            preferredLocation: `${community.name} (${community.region})`,
                          }}
                          whatsappNumber={platformSettings.whatsappNumber}
                        />
                      </div>
                    </div>
                  </article>
                </ScrollReveal>
              );
            })}
          </div>

          {/* Growing Platform Note */}
          <ScrollReveal variant="fade-up" className="mt-12">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-ka border border-dashed border-gold/60 bg-cream/35 p-6">
              <div>
                <h3 className="font-display text-2xl text-green">
                  Exploring Kenya&apos;s Wider Cultural Tapestry
                </h3>
                <p className="mt-1 text-xs sm:text-sm text-charcoal/80 max-w-2xl">
                  Kenya is home to over forty diverse communities, each with its
                  own language, history, crafts and relationship with the land.
                  Enquire with us to connect with cultural experiences across
                  any region of Kenya.
                </p>
              </div>
              <WhatsAppButton
                label="Inquire via WhatsApp"
                context={{
                  areaOfInterest: "Cultural & Heritage Visits",
                  preferredLocation: "Kenyan Cultural Communities",
                }}
                whatsappNumber={platformSettings.whatsappNumber}
                className="shrink-0"
              />
            </div>
          </ScrollReveal>
        </Container>
      </section>

      {/* =====================================================================
          SECTION 05: CONSERVATION — PROTECTING OUR NATURAL HERITAGE
      ===================================================================== */}
      <section
        id="conservation"
        className="scroll-mt-20 bg-forest py-20 sm:py-28 lg:py-32 text-ivory"
        aria-labelledby="conservation-heading"
      >
        <Container>
          {/* Section Heading */}
          <ScrollReveal variant="fade-up" className="max-w-3xl">
            <p className="mb-2.5 text-[11px] sm:text-xs font-semibold uppercase tracking-[0.22em] text-gold-light">
              {conservationSectionHeader.eyebrow}
            </p>
            <h2
              id="conservation-heading"
              className="font-display text-3xl sm:text-4xl lg:text-5xl leading-[1.06] text-ivory"
            >
              {conservationSectionHeader.headline}
            </h2>
            <p className="mt-4 text-sm sm:text-base leading-relaxed text-cream/90">
              {conservationSectionHeader.description}
            </p>
          </ScrollReveal>

          {/* Four Conservation Themes */}
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {conservationThemes.map((theme, idx) => (
              <ScrollReveal
                key={theme.slug}
                variant="fade-up"
                delayMs={idx * 100}
                className="h-full"
              >
                <article className="ka-card-hover group flex h-full flex-col justify-between rounded-ka border border-cream/15 bg-green/35 overflow-hidden hover:border-gold/60">
                  <div>
                    <div className="overflow-hidden">
                      <SiteImage
                        image={withOverride(
                          `conservation.theme.${theme.slug}`,
                          theme.image
                        )}
                        className="aspect-[16/10] w-full transition-transform duration-700 ease-out group-hover:scale-105"
                        sizes="(min-width: 1024px) 25vw, 100vw"
                        tone="green"
                      />
                    </div>
                    <div className="p-5 sm:p-6 space-y-3">
                      <h3 className="font-display text-2xl text-gold-light">
                        {theme.title}
                      </h3>
                      <p className="text-xs sm:text-sm leading-relaxed text-cream/85">
                        {theme.description}
                      </p>
                      <ul className="space-y-1.5 pt-2 border-t border-cream/10 text-xs text-cream/75">
                        {theme.keyFocusAreas.map((area) => (
                          <li key={area} className="flex items-start gap-2">
                            <span className="mt-1.5 h-1 w-1 rounded-full bg-gold shrink-0" />
                            <span>{area}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </article>
              </ScrollReveal>
            ))}
          </div>

          {/* Featured Spotlight: Arabuko-Sokoke Forest & Community Livelihoods */}
          <ScrollReveal variant="scale-in" delayMs={100} className="mt-14">
            <div className="group rounded-ka border border-gold/40 bg-green/45 p-6 sm:p-10 lg:p-12 transition-colors hover:border-gold">
              <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
                <div className="lg:col-span-5 overflow-hidden rounded-ka border border-cream/15">
                  <SiteImage
                    image={withOverride(
                      "conservation.spotlight",
                      arabukoSokokeSpotlight.image
                    )}
                    className="aspect-[4/3] w-full transition-transform duration-700 ease-out group-hover:scale-105"
                    sizes="(min-width: 1024px) 40vw, 100vw"
                    tone="green"
                  />
                </div>

                <div className="lg:col-span-7 space-y-4">
                  <div className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-gold-light">
                    <Leaf className="h-3.5 w-3.5 text-gold" />
                    <span>
                      {arabukoSokokeSpotlight.subtitle} ·{" "}
                      {arabukoSokokeSpotlight.location}
                    </span>
                  </div>

                  <h3 className="font-display text-3xl sm:text-4xl text-ivory">
                    {arabukoSokokeSpotlight.title}
                  </h3>

                  <p className="text-sm sm:text-base leading-relaxed text-cream/90">
                    {arabukoSokokeSpotlight.description}
                  </p>

                  <p className="text-xs sm:text-sm leading-relaxed text-cream/85">
                    {arabukoSokokeSpotlight.communityConnection}
                  </p>

                  <ul className="space-y-2 pt-1 text-xs sm:text-[13px] text-cream/90">
                    {arabukoSokokeSpotlight.highlights.map((h) => (
                      <li key={h} className="flex items-start gap-2.5">
                        <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-gold shrink-0" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>

                  <p className="pt-2 text-[11px] italic text-cream/65">
                    {arabukoSokokeSpotlight.inspirationNote}
                  </p>
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* Kenyan Conservation Landscapes & Initiatives — Redesigned for Desktop & Mobile */}
          <div className="mt-16 pt-12 border-t border-cream/15">
            <ScrollReveal
              variant="fade-up"
              className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8"
            >
              <div>
                <span className="inline-flex items-center gap-2 rounded-ka bg-gold/20 border border-gold/40 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-gold-light mb-2.5">
                  <Leaf className="h-3 w-3 text-gold" />
                  <span>06 Key Landscapes &amp; Ecosystems</span>
                </span>
                <h3 className="font-display text-3xl sm:text-4xl text-ivory leading-tight">
                  Conservation Landscapes &amp; Initiatives Across Kenya
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-cream/80 max-w-md leading-relaxed">
                From coastal dry forests and sacred Mijikenda groves to highland
                water catchments, mangrove creeks and community rangelands.
              </p>
            </ScrollReveal>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {ecosystemHighlights.map((eco, idx) => (
                <ScrollReveal
                  key={eco.slug}
                  variant="fade-up"
                  delayMs={idx * 75}
                  className="h-full"
                >
                  <article className="ka-card-hover group h-full rounded-ka border border-gold/25 bg-green/35 overflow-hidden flex flex-col justify-between shadow-lg hover:border-gold/75">
                    <div>
                      {/* Visual Landscape Header with Region Pill & Index Badge */}
                      <div className="relative aspect-[16/10] w-full overflow-hidden bg-forest">
                        <SiteImage
                          image={withOverride(`ecosystem.${eco.slug}`, eco.image)}
                          className="h-full w-full transition-transform duration-700 ease-out group-hover:scale-105"
                          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                          tone="forest"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-forest via-forest/25 to-black/25 pointer-events-none" />

                        {/* Top Bar: Region Pill + Number Index */}
                        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
                          <span className="inline-flex items-center gap-1.5 rounded-ka bg-forest/90 backdrop-blur-xs border border-gold/40 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-gold-light shadow-xs">
                            <MapPin className="h-3 w-3 text-gold shrink-0" />
                            <span>{eco.region}</span>
                          </span>
                          <span className="rounded-ka bg-gold/95 px-2 py-0.5 font-mono text-[10px] font-bold text-forest shadow-xs">
                            0{idx + 1}
                          </span>
                        </div>

                        {/* Bottom Focus Pill */}
                        <div className="absolute bottom-3 left-3 right-3">
                          <span className="inline-flex items-center gap-1.5 rounded-ka bg-black/45 backdrop-blur-xs px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-cream/95">
                            <span className="h-1.5 w-1.5 rounded-full bg-gold shrink-0" />
                            <span>{eco.focus}</span>
                          </span>
                        </div>
                      </div>

                      {/* Card Content Body */}
                      <div className="p-5 sm:p-6 space-y-2.5">
                        <h4 className="font-display text-2xl sm:text-[26px] leading-snug text-ivory group-hover:text-gold-light transition-colors">
                          {eco.name}
                        </h4>
                        <p className="text-xs sm:text-sm leading-relaxed text-cream/85">
                          {eco.summary}
                        </p>
                      </div>
                    </div>

                    {/* Interactive Card Action Bar */}
                    <div className="px-5 pb-5 sm:px-6 sm:pb-6 pt-3 border-t border-cream/15">
                      <button
                        type="button"
                        onClick={() =>
                          triggerContextualEnquiry(
                            "Conservation & Environmental Learning",
                            eco.name,
                            `${eco.name} — Conservation Visit`
                          )
                        }
                        className="cursor-pointer w-full flex items-center justify-between gap-2 text-left text-[11px] sm:text-xs font-semibold uppercase tracking-[0.15em] text-gold-light group-hover:text-ivory transition-colors"
                      >
                        <span>Enquire About Visiting</span>
                        <span className="flex h-7 w-7 items-center justify-center rounded-full border border-gold/45 bg-gold/10 text-gold-light transition-all duration-300 group-hover:bg-gold group-hover:text-forest group-hover:translate-x-0.5">
                          <ArrowRight className="h-3.5 w-3.5" />
                        </span>
                      </button>
                    </div>
                  </article>
                </ScrollReveal>
              ))}
            </div>
          </div>

          {/* Section Conservation CTA */}
          <ScrollReveal
            variant="fade-up"
            className="mt-12 text-center sm:text-left"
          >
            <WhatsAppButton
              label="Inquire via WhatsApp"
              variant="gold"
              context={{
                areaOfInterest: "Conservation & Environmental Learning",
                preferredLocation:
                  "Arabuko-Sokoke & Kenyan Indigenous Forests",
              }}
              whatsappNumber={platformSettings.whatsappNumber}
            />
          </ScrollReveal>
        </Container>
      </section>

      {/* =====================================================================
          SECTION 06: EXPLORE KENYA — LANDSCAPES, REGIONS & HERITAGE
      ===================================================================== */}
      <section
        id="explore"
        className="scroll-mt-20 py-20 sm:py-28 lg:py-32 bg-ivory"
        aria-labelledby="explore-heading"
      >
        <Container>
          <ScrollReveal variant="fade-up" className="max-w-3xl">
            <p className="mb-2.5 text-[11px] sm:text-xs font-semibold uppercase tracking-[0.22em] text-gold">
              {exploreRegionsHeader.eyebrow}
            </p>
            <h2
              id="explore-heading"
              className="font-display text-3xl sm:text-4xl lg:text-5xl leading-[1.06] text-green"
            >
              {exploreRegionsHeader.headline}
            </h2>
            <p className="mt-4 text-sm sm:text-base leading-relaxed text-charcoal/85">
              {exploreRegionsHeader.description}
            </p>
          </ScrollReveal>

          {/* Interactive Regional Selector Tabs */}
          <ScrollReveal
            variant="fade-up"
            delayMs={100}
            className="mt-10 flex flex-wrap gap-2 border-b border-charcoal/15 pb-4"
          >
            <div
              className="flex flex-wrap gap-2"
              role="tablist"
              aria-label="Kenyan Regions"
            >
              {regions.map((region) => {
                const isSelected = region.slug === selectedRegion?.slug;
                return (
                  <button
                    key={region.slug}
                    type="button"
                    role="tab"
                    aria-selected={isSelected}
                    onClick={() => setActiveRegionSlug(region.slug)}
                    className={`cursor-pointer rounded-ka px-4 py-2.5 text-xs sm:text-[13px] font-semibold transition-all duration-250 ${
                      isSelected
                        ? "bg-green text-ivory shadow-sm -translate-y-0.5"
                        : "bg-cream/50 text-charcoal hover:bg-cream hover:-translate-y-0.5"
                    }`}
                  >
                    {region.name.split("—")[0].trim()}
                  </button>
                );
              })}
            </div>
          </ScrollReveal>

          {/* Featured Active Region Spotlight Panel with Keyed Entrance Animation */}
          {selectedRegion && (
            <div
              key={selectedRegion.slug}
              className="animate-panel-enter mt-8 rounded-ka border border-gold/40 bg-cream/35 p-6 sm:p-8 lg:p-10"
            >
              <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
                <div className="group lg:col-span-5 overflow-hidden rounded-ka border border-charcoal/10">
                  <SiteImage
                    image={withOverride(
                      `region.${selectedRegion.slug}`,
                      selectedRegion.image
                    )}
                    className="aspect-[4/3] w-full transition-transform duration-700 ease-out group-hover:scale-105"
                    sizes="(min-width: 1024px) 40vw, 100vw"
                    tone="forest"
                  />
                </div>

                <div className="lg:col-span-7 space-y-4">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gold">
                    {selectedRegion.subtitle}
                  </p>
                  <h3 className="font-display text-3xl sm:text-4xl text-green">
                    {selectedRegion.name}
                  </h3>
                  <p className="text-sm sm:text-base leading-relaxed text-charcoal/85">
                    {selectedRegion.description}
                  </p>

                  <div className="pt-1">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-forest mb-2.5">
                      Cultural, Natural &amp; Conservation Highlights
                    </p>
                    <ul className="grid gap-2 sm:grid-cols-2 text-xs sm:text-[13px] text-charcoal/85">
                      {selectedRegion.highlights.map((item) => (
                        <li key={item} className="flex items-start gap-2">
                          <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-gold shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2 pt-3 border-t border-charcoal/10 text-xs">
                    <div className="rounded-ka bg-ivory p-3 border border-charcoal/10">
                      <span className="block text-[10px] font-semibold uppercase tracking-[0.14em] text-gold">
                        Communities &amp; Heritage
                      </span>
                      <span className="mt-0.5 block font-medium text-charcoal">
                        {selectedRegion.communitiesNote}
                      </span>
                    </div>
                    <div className="rounded-ka bg-ivory p-3 border border-charcoal/10">
                      <span className="block text-[10px] font-semibold uppercase tracking-[0.14em] text-gold">
                        Ecosystems &amp; Conservation
                      </span>
                      <span className="mt-0.5 block font-medium text-charcoal">
                        {selectedRegion.conservationNote}
                      </span>
                    </div>
                  </div>

                  <div className="pt-2">
                    <WhatsAppButton
                      label="Inquire via WhatsApp"
                      context={{
                        areaOfInterest: "Regional Discovery Tours",
                        preferredLocation: selectedRegion.name,
                      }}
                      whatsappNumber={platformSettings.whatsappNumber}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Overview Grid of All Four Featured Regions */}
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {regions.map((region, idx) => (
              <ScrollReveal
                key={region.slug}
                variant="fade-up"
                delayMs={idx * 90}
                className="h-full"
              >
                <article
                  onClick={() => setActiveRegionSlug(region.slug)}
                  className={`ka-card-hover cursor-pointer h-full rounded-ka border p-5 flex flex-col justify-between ${
                    region.slug === selectedRegion?.slug
                      ? "border-green bg-cream/55 shadow-xs"
                      : "border-charcoal/15 bg-ivory hover:border-gold"
                  }`}
                >
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-gold">
                      Region Overview
                    </p>
                    <h4 className="mt-1.5 font-display text-2xl text-green leading-snug">
                      {region.name}
                    </h4>
                    <p className="mt-2 text-xs leading-relaxed text-charcoal/80">
                      {region.description}
                    </p>
                  </div>
                  <p className="mt-4 pt-3 border-t border-charcoal/10 text-[11px] font-semibold uppercase tracking-[0.12em] text-green">
                    {region.slug === selectedRegion?.slug
                      ? "Currently Viewing ↑"
                      : "Inspect Region Stories →"}
                  </p>
                </article>
              </ScrollReveal>
            ))}
          </div>

          <p className="mt-8 text-center text-xs sm:text-sm italic text-charcoal/70">
            {exploreRegionsHeader.coverageNote}
          </p>
        </Container>
      </section>

      {/* =====================================================================
          SECTION 07: VISITS & EXPERIENCES (NO FIXED PRICES)
      ===================================================================== */}
      <section
        id="experiences"
        className="scroll-mt-20 bg-cream/50 py-20 sm:py-28 lg:py-32 border-y border-charcoal/10"
        aria-labelledby="experiences-heading"
      >
        <Container>
          <ScrollReveal
            variant="fade-up"
            className="grid gap-8 lg:grid-cols-12 lg:items-end"
          >
            <div className="lg:col-span-7">
              <p className="mb-2.5 text-[11px] sm:text-xs font-semibold uppercase tracking-[0.22em] text-gold">
                {experiencesSectionHeader.eyebrow}
              </p>
              <h2
                id="experiences-heading"
                className="font-display text-3xl sm:text-4xl lg:text-5xl leading-[1.06] text-green"
              >
                {experiencesSectionHeader.headline}
              </h2>
              <p className="mt-4 max-w-2xl text-sm sm:text-base leading-relaxed text-charcoal/85">
                {experiencesSectionHeader.description}
              </p>
            </div>

            <div className="lg:col-span-5">
              <div className="rounded-ka border border-gold/45 bg-ivory p-4 sm:p-5 text-xs sm:text-[13px] leading-relaxed text-charcoal/85">
                <div className="flex items-center gap-2 font-semibold text-forest uppercase tracking-[0.12em] text-[11px] mb-1">
                  <Compass className="h-3.5 w-3.5 text-gold" />
                  <span>Tailored to Every Visit</span>
                </div>
                {experiencesSectionHeader.tailoredNote}
              </div>
            </div>
          </ScrollReveal>

          {/* 8 Experience Categories Grid */}
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {experiencesList.map((exp, idx) => (
              <ScrollReveal
                key={exp.slug}
                variant="fade-up"
                delayMs={(idx % 4) * 90}
                className="h-full"
              >
                <article className="ka-card-hover group flex h-full flex-col justify-between rounded-ka border border-charcoal/15 bg-ivory overflow-hidden hover:border-gold">
                  <div>
                    <div className="relative overflow-hidden">
                      <SiteImage
                        image={withOverride(`experience.${exp.slug}`, exp.image)}
                        className="aspect-[16/10] w-full transition-transform duration-700 ease-out group-hover:scale-105"
                        sizes="(min-width: 1024px) 25vw, 100vw"
                        tone="forest"
                      />
                      <span className="absolute top-3 left-3 rounded-ka bg-forest/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-gold-light">
                        {exp.pillar}
                      </span>
                    </div>

                    <div className="p-5 sm:p-6 space-y-3">
                      <h3 className="font-display text-2xl leading-snug text-green">
                        {exp.title}
                      </h3>
                      <p className="text-xs sm:text-sm leading-relaxed text-charcoal/80">
                        {exp.description}
                      </p>
                      <ul className="space-y-1 pt-2 border-t border-charcoal/10 text-[11px] text-charcoal/70">
                        {exp.highlights.map((h) => (
                          <li key={h} className="flex items-center gap-1.5">
                            <span className="h-1 w-1 rounded-full bg-gold shrink-0" />
                            <span>{h}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="px-5 pb-5 sm:px-6 sm:pb-6">
                    <WhatsAppButton
                      label="Inquire via WhatsApp"
                      fullWidth
                      context={{
                        areaOfInterest: exp.title,
                      }}
                      whatsappNumber={platformSettings.whatsappNumber}
                    />
                  </div>
                </article>
              </ScrollReveal>
            ))}
          </div>
        </Container>
      </section>

      {/* =====================================================================
          SECTION 07A: SIGNATURE MULTI-DAY SAFARI PACKAGES (POLLMAN'S, BONFIRE & WATAMU SAFARIS STYLE — NO PRICES)
      ===================================================================== */}
      <section
        id="safari-packages"
        className="scroll-mt-20 bg-cream/45 py-20 sm:py-28 lg:py-32 border-b border-charcoal/10"
        aria-labelledby="safari-packages-heading"
      >
        <Container>
          <ScrollReveal
            variant="fade-up"
            className="grid gap-8 lg:grid-cols-12 lg:items-end"
          >
            <div className="lg:col-span-7">
              <p className="mb-2.5 text-[11px] sm:text-xs font-semibold uppercase tracking-[0.22em] text-gold">
                {safariPackagesSectionHeader.eyebrow}
              </p>
              <h2
                id="safari-packages-heading"
                className="font-display text-3xl sm:text-4xl lg:text-5xl leading-[1.06] text-green"
              >
                {safariPackagesSectionHeader.headline}
              </h2>
              <p className="mt-4 max-w-2xl text-sm sm:text-base leading-relaxed text-charcoal/85">
                {safariPackagesSectionHeader.description}
              </p>
            </div>

            <div className="lg:col-span-5">
              <div className="rounded-ka border border-gold/45 bg-ivory p-4 sm:p-5 text-xs sm:text-[13px] leading-relaxed text-charcoal/85 shadow-xs">
                <div className="flex items-center gap-2 font-semibold text-forest uppercase tracking-[0.12em] text-[11px] mb-1">
                  <Compass className="h-3.5 w-3.5 text-gold" />
                  <span>2D/1N · 3D/2N · 4D/3N · 5D/4N · 7D/6N Circuits</span>
                </div>
                {safariPackagesSectionHeader.departureNote}
              </div>
            </div>
          </ScrollReveal>

          {/* Instant Duration Filter Tabs (All, 2–3 Days, 4-Day Classics, 5–7 Days) */}
          <ScrollReveal
            variant="fade-up"
            delayMs={60}
            className="mt-9 flex flex-wrap items-center justify-between gap-3 border-b border-charcoal/15 pb-4"
          >
            <div
              className="flex flex-wrap items-center gap-2"
              role="tablist"
              aria-label="Filter Safari Packages by Duration"
            >
              {(
                [
                  {
                    id: "all",
                    label: "All Packages",
                    count: safariPackagesList.length,
                  },
                  {
                    id: "short",
                    label: "Short Safaris (2–3 Days)",
                    count: safariPackagesList.filter((p) => p.durationDays <= 3)
                      .length,
                  },
                  {
                    id: "classic",
                    label: "4-Day Classics (4D/3N)",
                    count: safariPackagesList.filter(
                      (p) => p.durationDays === 4
                    ).length,
                  },
                  {
                    id: "extended",
                    label: "Extended & Family (5–7 Days)",
                    count: safariPackagesList.filter((p) => p.durationDays >= 5)
                      .length,
                  },
                ] as const
              ).map((tab) => {
                const active = activePackageDurationFilter === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => setActivePackageDurationFilter(tab.id)}
                    className={`cursor-pointer inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold transition-all duration-250 ${
                      active
                        ? "bg-forest text-ivory shadow-sm -translate-y-0.5"
                        : "border border-charcoal/15 bg-ivory text-charcoal hover:border-gold hover:-translate-y-0.5"
                    }`}
                  >
                    <span>{tab.label}</span>
                    <span
                      className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                        active
                          ? "bg-gold text-forest"
                          : "bg-cream text-charcoal/75"
                      }`}
                    >
                      {tab.count}
                    </span>
                  </button>
                );
              })}
            </div>
          </ScrollReveal>

          {/* 6 Multi-Day Safari Packages Grid — Pollman's "Mombasa Rendezvous" Card Format (Strictly No Prices) */}
          <div
            key={activePackageDurationFilter}
            className="animate-panel-enter ka-focus-grid mt-10 grid gap-8 md:grid-cols-2 lg:grid-cols-3"
          >
            {safariPackagesList
              .filter((pkg) => {
                if (activePackageDurationFilter === "short")
                  return pkg.durationDays <= 3;
                if (activePackageDurationFilter === "classic")
                  return pkg.durationDays === 4;
                if (activePackageDurationFilter === "extended")
                  return pkg.durationDays >= 5;
                return true;
              })
              .map((pkg, idx) => {
                const pkgSlotKey =
                  pkg.image.slotKey || `safari.pkg.${pkg.slug}`;
                const isExpandedOnMobile =
                  !!expandedPackageInclusions[pkg.slug];
                const pkgWaHref = whatsappLink(
                  buildEnquiryWhatsAppMessage({
                    areaOfInterest: `Safari Package: ${pkg.durationLabel} ${pkg.title}`,
                    preferredLocation: pkg.routeSummary,
                    message: `Hello Mrisa, I would like a tailored quote for the ${pkg.durationLabel} "${pkg.title}" safari package (${pkg.routeSummary}).`,
                  }),
                  platformSettings.whatsappNumber || site.contact.whatsapp
                );

                return (
                  <ScrollReveal
                    key={pkg.slug}
                    variant="fade-up"
                    delayMs={(idx % 3) * 100}
                    className="h-full"
                  >
                    <article className="ka-card-hover group flex h-full flex-col justify-between rounded-ka border border-charcoal/15 bg-ivory overflow-hidden hover:border-gold shadow-sm">
                      <div>
                        {/* Pollman's Style Top Banner with Title, Weekly Departures Subtitle & Torn-Edge Divider */}
                        <div className="relative aspect-[16/11] w-full overflow-hidden bg-forest">
                          <SiteImage
                            image={withOverride(pkgSlotKey, pkg.image)}
                            slotKey={pkgSlotKey}
                            className="h-full w-full transition-transform duration-700 ease-out group-hover:scale-105"
                            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                          />
                          {/* Warm Savannah / Sunset Overlay */}
                          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-amber-950/35 to-black/30" />

                          {/* Audience / Circuit Badge */}
                          <span className="pointer-events-none absolute top-3 left-3 rounded-ka bg-forest/90 backdrop-blur-md border border-gold/50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-gold-light">
                            {pkg.audienceBadge}
                          </span>

                          {/* Centered Package Title & Departure Subtitle (Pollman's Rendezvous Aesthetic) */}
                          <div className="pointer-events-none absolute inset-x-4 bottom-6 text-center text-ivory">
                            <h3 className="font-display text-2xl sm:text-[26px] font-bold leading-tight text-white drop-shadow-md">
                              {pkg.title}
                            </h3>
                            <p className="mt-1 font-serif italic text-sm sm:text-base text-gold-light drop-shadow">
                              {pkg.departureSubtitle}
                            </p>
                          </div>

                          {/* Organic Torn-Paper / Wave Divider at Bottom of Header */}
                          <svg
                            viewBox="0 0 1200 48"
                            preserveAspectRatio="none"
                            aria-hidden="true"
                            className="pointer-events-none absolute -bottom-px left-0 right-0 h-4 w-full text-ivory fill-current"
                          >
                            <path d="M0,24 Q75,6 150,22 T300,18 T450,26 T600,14 T750,24 T900,16 T1050,25 T1200,18 L1200,48 L0,48 Z" />
                          </svg>
                        </div>

                        {/* Package Body — Duration Heading (Strictly No Prices) & "What's Included" Gold-Dot Checklist */}
                        <div className="p-5 sm:p-6 space-y-4">
                          <div className="text-center border-b border-charcoal/10 pb-3.5">
                            <p className="font-display text-2xl sm:text-3xl font-bold text-green">
                              {pkg.durationLabel}
                            </p>
                            <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-gold">
                              {pkg.routeSummary}
                            </p>
                          </div>

                          <p className="text-xs sm:text-sm leading-relaxed text-charcoal/80">
                            {pkg.description}
                          </p>

                          <div className="pt-1">
                            <p className="text-center font-display text-lg font-bold text-forest mb-3">
                              What&rsquo;s Included
                            </p>
                            <ul className="space-y-2 text-xs sm:text-[13px] text-charcoal/85">
                              {pkg.whatsIncluded.map((item, itemIdx) => {
                                const hiddenOnMobile =
                                  !isExpandedOnMobile && itemIdx >= 4;
                                return (
                                  <li
                                    key={item}
                                    className={`${
                                      hiddenOnMobile
                                        ? "hidden sm:flex"
                                        : "flex"
                                    } items-start gap-2.5 leading-snug`}
                                  >
                                    <span className="mt-1.5 h-2 w-2 rounded-full bg-gold shrink-0 shadow-2xs" />
                                    <span>{item}</span>
                                  </li>
                                );
                              })}
                            </ul>
                            {pkg.whatsIncluded.length > 4 && (
                              <button
                                type="button"
                                onClick={() =>
                                  setExpandedPackageInclusions((prev) => ({
                                    ...prev,
                                    [pkg.slug]: !prev[pkg.slug],
                                  }))
                                }
                                className="mt-2.5 sm:hidden cursor-pointer text-[11px] font-bold uppercase tracking-wider text-green hover:text-forest underline underline-offset-4"
                              >
                                {isExpandedOnMobile
                                  ? "− Show fewer inclusions"
                                  : `+ View all ${pkg.whatsIncluded.length} inclusions`}
                              </button>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Single Aesthetic WhatsApp Action Button (No Phone Number Inside Button) */}
                      <div className="px-5 pb-5 sm:px-6 sm:pb-6 pt-2">
                        <WhatsAppButton
                          label="Book Package on WhatsApp"
                          href={pkgWaHref}
                          fullWidth
                        />
                      </div>
                    </article>
                  </ScrollReveal>
                );
              })}
          </div>

          {/* Seamless Airport, SGR Train & Private Coastal Transfers Add-On Strip (Part of Safari Packages) */}
          <ScrollReveal variant="fade-up" delayMs={140} className="mt-12">
            <div
              id="safari-transfers-addon"
              className="scroll-mt-24 rounded-ka border border-gold/45 bg-forest text-ivory p-6 sm:p-8 shadow-md"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-cream/15 pb-5">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-gold-light">
                    <Car className="h-3.5 w-3.5 text-gold" />
                    <span>Included &amp; Available Safari Package Add-Ons</span>
                  </div>
                  <h3 className="font-display text-2xl sm:text-3xl text-ivory">
                    {transfersSectionHeader.headline}
                  </h3>
                  <p className="text-xs sm:text-sm text-cream/85 max-w-3xl leading-relaxed">
                    Every multi-day safari package and coastal stay can be
                    seamlessly paired with door-to-door ground transfers and
                    ticketing assistance coordinated from our Watamu, Timboni
                    Stage office.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-gold-light shrink-0">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-gold/40 bg-green/45 px-3 py-1.5">
                    <Train className="h-3.5 w-3.5 text-gold" />
                    <span>Miritini &amp; Mariakani SGR</span>
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-gold/40 bg-green/45 px-3 py-1.5">
                    <Plane className="h-3.5 w-3.5 text-gold" />
                    <span>Malindi &amp; Mombasa Airports</span>
                  </span>
                </div>
              </div>

              <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {transferServicesList.map((tr) => (
                  <div
                    key={tr.slug}
                    className="rounded-ka border border-gold/25 bg-green/30 p-4 space-y-1.5"
                  >
                    <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-gold-light">
                      {tr.category}
                    </p>
                    <h4 className="font-display text-lg font-semibold text-ivory leading-snug">
                      {tr.title}
                    </h4>
                    <p className="text-xs text-cream/80 leading-relaxed">
                      {tr.routesCovered}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </Container>
      </section>

      {/* =====================================================================
          SECTION 07B: EXCURSIONS — SHORT TRIPS & FULL ONE-DAY VISITS
      ===================================================================== */}
      <section
        id="excursions"
        className="scroll-mt-20 bg-ivory py-20 sm:py-28 lg:py-32 border-b border-charcoal/10"
        aria-labelledby="excursions-heading"
      >
        <Container>
          <ScrollReveal
            variant="fade-up"
            className="grid gap-8 lg:grid-cols-12 lg:items-end"
          >
            <div className="lg:col-span-7">
              <p className="mb-2.5 text-[11px] sm:text-xs font-semibold uppercase tracking-[0.22em] text-gold">
                {excursionsSectionHeader.eyebrow}
              </p>
              <h2
                id="excursions-heading"
                className="font-display text-3xl sm:text-4xl lg:text-5xl leading-[1.06] text-green"
              >
                {excursionsSectionHeader.headline}
              </h2>
              <p className="mt-4 max-w-2xl text-sm sm:text-base leading-relaxed text-charcoal/85">
                {excursionsSectionHeader.description}
              </p>
            </div>

            <div className="lg:col-span-5">
              <div className="rounded-ka border border-gold/45 bg-cream/45 p-4 sm:p-5 text-xs sm:text-[13px] leading-relaxed text-charcoal/85">
                <div className="flex items-center gap-2 font-semibold text-forest uppercase tracking-[0.12em] text-[11px] mb-1">
                  <MapPin className="h-3.5 w-3.5 text-gold" />
                  <span>Watamu, Timboni Stage · Daily Departures</span>
                </div>
                {excursionsSectionHeader.officeNote}
              </div>
            </div>
          </ScrollReveal>

          {/* 6 Featured Excursions Grid (Horizontal Touch Snap-Carousel on Mobile, 3-Col Grid on Desktop) */}
          <p className="mt-8 sm:hidden text-[11px] font-semibold uppercase tracking-[0.16em] text-gold">
            Swipe horizontally to explore excursions →
          </p>
          <div className="ka-mobile-carousel ka-focus-grid mt-4 sm:mt-12 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {excursionsList.map((exc, idx) => (
              <ScrollReveal
                key={exc.slug}
                variant="fade-up"
                delayMs={idx * 85}
                className="h-full"
              >
                <article className="ka-card-hover group flex h-full flex-col justify-between rounded-ka border border-charcoal/15 bg-cream/25 overflow-hidden hover:border-gold shadow-xs">
                  <div>
                    <div className="relative aspect-[16/10] w-full overflow-hidden bg-forest">
                      <SiteImage
                        image={withOverride(`excursion.${exc.slug}`, exc.image)}
                        className="h-full w-full transition-transform duration-700 ease-out group-hover:scale-105"
                        sizes="(min-width: 1024px) 33vw, 100vw"
                        tone="forest"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-forest/85 via-transparent to-black/25 pointer-events-none" />

                      <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
                        <span className="rounded-ka bg-forest/90 backdrop-blur-xs border border-gold/40 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-gold-light">
                          {exc.duration}
                        </span>
                        <span className="rounded-ka bg-gold/95 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-forest">
                          {exc.category}
                        </span>
                      </div>

                      <div className="absolute bottom-3 left-3 right-3 flex items-center gap-1.5 text-[11px] font-semibold text-cream">
                        <MapPin className="h-3.5 w-3.5 text-gold shrink-0" />
                        <span>{exc.location}</span>
                      </div>
                    </div>

                    <div className="p-6 space-y-3.5">
                      <h3 className="font-display text-2xl sm:text-[26px] leading-snug text-green">
                        {exc.title}
                      </h3>
                      <p className="text-xs sm:text-sm leading-relaxed text-charcoal/85">
                        {exc.description}
                      </p>

                      <ul className="space-y-1.5 pt-2.5 border-t border-charcoal/10 text-xs text-charcoal/80">
                        {exc.activities.map((act) => (
                          <li key={act} className="flex items-start gap-2">
                            <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-gold shrink-0" />
                            <span>{act}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="px-6 pb-6 pt-2">
                    <WhatsAppButton
                      label="Book Excursion on WhatsApp"
                      fullWidth
                      context={{
                        areaOfInterest: `Excursion: ${exc.title}`,
                        preferredLocation: exc.location,
                      }}
                      whatsappNumber={platformSettings.whatsappNumber}
                    />
                  </div>
                </article>
              </ScrollReveal>
            ))}
          </div>
        </Container>
      </section>

      {/* =====================================================================
          SECTION 07C: ACCOMMODATION — VILLAS, COTTAGES, HOTELS & LODGINGS
      ===================================================================== */}
      <section
        id="accommodation"
        className="scroll-mt-20 bg-cream/45 py-20 sm:py-28 lg:py-32 border-b border-charcoal/10"
        aria-labelledby="accommodation-heading"
      >
        <Container>
          <ScrollReveal
            variant="fade-up"
            className="grid gap-8 lg:grid-cols-12 lg:items-end"
          >
            <div className="lg:col-span-7">
              <p className="mb-2.5 text-[11px] sm:text-xs font-semibold uppercase tracking-[0.22em] text-gold">
                {accommodationSectionHeader.eyebrow}
              </p>
              <h2
                id="accommodation-heading"
                className="font-display text-3xl sm:text-4xl lg:text-5xl leading-[1.06] text-green"
              >
                {accommodationSectionHeader.headline}
              </h2>
              <p className="mt-4 max-w-2xl text-sm sm:text-base leading-relaxed text-charcoal/85">
                {accommodationSectionHeader.description}
              </p>
            </div>

            <div className="lg:col-span-5">
              <div className="rounded-ka border border-gold/45 bg-ivory p-4 sm:p-5 text-xs sm:text-[13px] leading-relaxed text-charcoal/85">
                <div className="flex items-center gap-2 font-semibold text-forest uppercase tracking-[0.12em] text-[11px] mb-1">
                  <Home className="h-3.5 w-3.5 text-gold" />
                  <span>Curated by Kaya Experience Ltd</span>
                </div>
                {accommodationSectionHeader.bookingNote}
              </div>
            </div>
          </ScrollReveal>

          <p className="mt-8 sm:hidden text-[11px] font-semibold uppercase tracking-[0.16em] text-gold">
            Swipe horizontally to explore stays →
          </p>
          <div className="ka-mobile-carousel ka-focus-grid mt-4 sm:mt-12 grid gap-7 sm:grid-cols-2 lg:grid-cols-4">
            {accommodationOptions.map((acc, idx) => (
              <ScrollReveal
                key={acc.slug}
                variant="fade-up"
                delayMs={idx * 90}
                className="h-full"
              >
                <article className="ka-card-hover group flex h-full flex-col justify-between rounded-ka border border-charcoal/15 bg-ivory overflow-hidden hover:border-gold shadow-xs">
                  <div>
                    <div className="relative aspect-[16/10] w-full overflow-hidden bg-forest">
                      <SiteImage
                        image={withOverride(
                          `accommodation.${acc.slug}`,
                          acc.image
                        )}
                        className="h-full w-full transition-transform duration-700 ease-out group-hover:scale-105"
                        sizes="(min-width: 1024px) 25vw, 100vw"
                        tone="forest"
                      />
                      <span className="absolute top-3 left-3 rounded-ka bg-forest/90 border border-gold/40 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-gold-light">
                        {acc.category}
                      </span>
                    </div>

                    <div className="p-5 sm:p-6 space-y-3">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-gold">
                        {acc.locations}
                      </p>
                      <h3 className="font-display text-2xl leading-snug text-green">
                        {acc.title}
                      </h3>
                      <p className="text-xs sm:text-sm leading-relaxed text-charcoal/80">
                        {acc.description}
                      </p>

                      <ul className="space-y-1.5 pt-2 border-t border-charcoal/10 text-xs text-charcoal/75">
                        {acc.amenities.map((am) => (
                          <li key={am} className="flex items-start gap-2">
                            <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-gold shrink-0" />
                            <span>{am}</span>
                          </li>
                        ))}
                      </ul>

                      <p className="pt-1 text-[11px] font-medium text-forest">
                        <strong>Ideal For:</strong> {acc.idealFor}
                      </p>
                    </div>
                  </div>

                  <div className="px-5 pb-5 sm:px-6 sm:pb-6">
                    <WhatsAppButton
                      label={`Inquire About ${acc.category}`}
                      fullWidth
                      context={{
                        areaOfInterest: `Accommodation: ${acc.title}`,
                        preferredLocation: acc.locations,
                      }}
                      whatsappNumber={platformSettings.whatsappNumber}
                    />
                  </div>
                </article>
              </ScrollReveal>
            ))}
          </div>

          {/* Dedicated Kid-Friendly Accommodations Highlight Card (Kids' Pools & Caregivers / Nannies On Call) */}
          <ScrollReveal variant="fade-up" delayMs={120} className="mt-10">
            <div className="rounded-ka border border-gold/45 bg-ivory shadow-sm overflow-hidden grid grid-cols-1 lg:grid-cols-12">
              <div className="relative lg:col-span-5 min-h-[260px] sm:min-h-[320px] bg-forest">
                <SiteImage
                  image={withOverride(
                    kidFriendlyAccommodationHighlight.slotKey,
                    kidFriendlyAccommodationHighlight.image
                  )}
                  slotKey={kidFriendlyAccommodationHighlight.slotKey}
                  className="h-full w-full min-h-[260px] sm:min-h-[320px]"
                  sizes="(min-width: 1024px) 42vw, 100vw"
                  tone="forest"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-forest/85 via-forest/20 to-transparent" />
                <div className="pointer-events-none absolute top-3.5 left-3.5">
                  <span className="inline-flex items-center gap-1.5 rounded-ka bg-gold px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-forest shadow">
                    <Baby className="h-3.5 w-3.5" />
                    <span>{kidFriendlyAccommodationHighlight.badge}</span>
                  </span>
                </div>
                <div className="pointer-events-none absolute bottom-3.5 left-3.5 right-3.5">
                  <p className="text-xs font-semibold text-cream">
                    Shallow Kids&rsquo; Swimming Pools · Vetted Caregivers &amp; Nannies On Call
                  </p>
                </div>
              </div>

              <div className="lg:col-span-7 p-6 sm:p-8 lg:p-10 flex flex-col justify-between">
                <div className="space-y-3.5">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gold">
                    FAMILY SAFARI &amp; COASTAL VILLA PACKAGES · WATAMU, MALINDI &amp; DIANI
                  </p>
                  <h3 className="font-display text-2xl sm:text-3xl lg:text-4xl leading-snug text-green">
                    {kidFriendlyAccommodationHighlight.title}
                  </h3>
                  <p className="text-xs sm:text-sm leading-relaxed text-charcoal/85">
                    {kidFriendlyAccommodationHighlight.description}
                  </p>

                  <div className="grid gap-2.5 sm:grid-cols-2 pt-2">
                    {kidFriendlyAccommodationHighlight.highlights.map((pt) => (
                      <div
                        key={pt}
                        className="flex items-start gap-2.5 rounded-ka border border-charcoal/10 bg-cream/40 p-3 text-xs text-charcoal/90"
                      >
                        <CheckCircle2 className="h-4 w-4 text-green shrink-0 mt-0.5" />
                        <span>{pt}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-charcoal/10 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-2 text-xs font-semibold text-forest">
                    <ShieldCheck className="h-4 w-4 text-gold shrink-0" />
                    <span>
                      Ideal for Families with Toddlers, Young Kids &amp; Multi-Generational Stays
                    </span>
                  </div>
                  <WhatsAppButton
                    label="Inquire About Kid-Friendly Stays"
                    context={{
                      areaOfInterest:
                        "Accommodation: Kid-Friendly Stays with Kids' Pools & Caregivers / Nannies On Call",
                      preferredLocation: "Watamu, Malindi & Coastal Family Villas",
                    }}
                    whatsappNumber={platformSettings.whatsappNumber}
                  />
                </div>
              </div>
            </div>
          </ScrollReveal>
        </Container>
      </section>

      {/* =====================================================================
          SECTION 07D: KAYA ROOTS AFRICA — FARMERS & INDIGENOUS CROPS (CASSAVA)
      ===================================================================== */}
      <section
        id="kaya-roots"
        className="scroll-mt-20 bg-forest py-20 sm:py-28 lg:py-32 text-ivory border-b border-gold/25"
        aria-labelledby="kaya-roots-heading"
      >
        <Container>
          <ScrollReveal variant="fade-up">
            <div className="rounded-ka border border-gold/45 bg-green/35 p-6 sm:p-10 lg:p-12 shadow-xl">
              <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
                {/* Left Narrative Column */}
                <div className="lg:col-span-7 space-y-5">
                  <div className="inline-flex flex-wrap items-center gap-2 rounded-ka bg-gold/20 border border-gold/40 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-gold-light">
                    <Sprout className="h-3.5 w-3.5 text-gold" />
                    <span>
                      {kayaRootsProgram.name} · {kayaRootsProgram.parentOrg}
                    </span>
                  </div>

                  <h2
                    id="kaya-roots-heading"
                    className="font-display text-3xl sm:text-4xl lg:text-5xl leading-[1.08] text-ivory"
                  >
                    {kayaRootsProgram.headline}
                  </h2>

                  <p className="text-sm sm:text-base leading-relaxed text-cream/90">
                    {kayaRootsProgram.description}
                  </p>

                  {/* Mission Pillars */}
                  <div className="grid gap-3 sm:grid-cols-2 pt-2">
                    {kayaRootsProgram.missionPoints.map((pt) => (
                      <div
                        key={pt}
                        className="rounded-ka border border-cream/15 bg-forest/55 p-3.5 text-xs sm:text-[13px] leading-relaxed text-cream/90 flex items-start gap-2.5"
                      >
                        <span className="mt-1.5 h-2 w-2 rounded-full bg-gold shrink-0" />
                        <span>{pt}</span>
                      </div>
                    ))}
                  </div>

                  {/* Regions & Leadership Strip */}
                  <div className="grid gap-4 sm:grid-cols-2 pt-3 border-t border-cream/15 text-xs">
                    <div className="rounded-ka bg-forest/70 border border-gold/30 p-4 space-y-1.5">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-gold-light">
                        Regions Supported Across Kenya
                      </p>
                      <ul className="space-y-1 text-cream/90 font-medium">
                        {kayaRootsProgram.regionsCovered.map((reg) => (
                          <li key={reg} className="flex items-center gap-2">
                            <MapPin className="h-3 w-3 text-gold shrink-0" />
                            <span>{reg}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="rounded-ka bg-forest/70 border border-gold/30 p-4 space-y-1.5">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-gold-light">
                        Headed &amp; Led By
                      </p>
                      <p className="font-display text-xl text-ivory">
                        {kayaRootsProgram.leadName}
                      </p>
                      <p className="text-cream/80 text-[11px]">
                        {kayaRootsProgram.leadRole}
                      </p>
                      <p className="pt-1 flex items-center gap-1.5 text-gold-light font-mono text-xs">
                        <Mail className="h-3.5 w-3.5 text-gold shrink-0" />
                        <a
                          href={`mailto:${kayaRootsProgram.email}`}
                          className="underline underline-offset-4 hover:text-ivory"
                        >
                          {kayaRootsProgram.email}
                        </a>
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-2 flex flex-wrap items-center gap-3">
                    <a
                      href={`mailto:${kayaRootsProgram.email}?subject=${encodeURIComponent(
                        "Kaya Roots Africa — Cassava & Farmer Empowerment Enquiry"
                      )}`}
                      className="inline-flex items-center gap-2 rounded-ka bg-gold px-6 py-3.5 text-xs font-semibold uppercase tracking-[0.14em] text-forest hover:bg-gold-light transition-colors shadow-sm"
                    >
                      <Mail className="h-4 w-4" />
                      <span>Email Kaya Roots Africa ({kayaRootsProgram.email})</span>
                    </a>

                    <WhatsAppButton
                      label="Partner via WhatsApp"
                      variant="gold"
                      context={{
                        areaOfInterest:
                          "Kaya Roots Africa: Cassava, Indigenous Crops & Farmer Empowerment (Dr. Milcah Wambua)",
                        preferredLocation:
                          "Kaya Roots Africa (Nyanza, Nakuru & Coast Farmer Network)",
                      }}
                      whatsappNumber={platformSettings.whatsappNumber}
                    />
                  </div>
                </div>

                {/* Right Image & Crop Focus Card */}
                <div className="lg:col-span-5 space-y-4">
                  <div className="overflow-hidden rounded-ka border border-gold/40 shadow-lg">
                    <SiteImage
                      image={withOverride(
                        "kayaroots.main",
                        kayaRootsProgram.image
                      )}
                      className="aspect-[4/3] w-full"
                      sizes="(min-width: 1024px) 40vw, 100vw"
                      tone="green"
                    />
                  </div>

                  <div className="rounded-ka border border-gold/35 bg-forest/75 p-5 space-y-2.5">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gold-light">
                      Indigenous Crops &amp; Value Addition Focus
                    </p>
                    <ul className="grid gap-2 sm:grid-cols-2 text-xs text-cream/90">
                      {kayaRootsProgram.cropsAndFocus.map((item) => (
                        <li key={item} className="flex items-start gap-2">
                          <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-gold shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </Container>
      </section>

      {/* =====================================================================
          SECTION 07E: PREVIOUS TOURS & TRAVELS GALLERY — HOMEPAGE SNEAK PEEK (#gallery)
      ===================================================================== */}
      <section
        id="gallery"
        className="scroll-mt-20 bg-cream/35 py-20 sm:py-28 lg:py-32 border-b border-charcoal/10"
        aria-labelledby="gallery-heading"
      >
        <Container>
          <ScrollReveal
            variant="fade-up"
            className="flex flex-col lg:flex-row lg:items-end justify-between gap-6"
          >
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 text-[11px] sm:text-xs font-semibold uppercase tracking-[0.22em] text-gold mb-2.5">
                <Camera className="h-3.5 w-3.5 text-gold" />
                <span>{activityGallerySectionHeader.eyebrow} · HOMEPAGE SNEAK PEEK</span>
              </div>
              <h2
                id="gallery-heading"
                className="font-display text-3xl sm:text-4xl lg:text-5xl leading-[1.06] text-green"
              >
                {activityGallerySectionHeader.headline}
              </h2>
              <p className="mt-4 text-sm sm:text-base leading-relaxed text-charcoal/85">
                {activityGallerySectionHeader.description}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <Link
                href="/gallery"
                className="inline-flex items-center gap-2.5 rounded-full border border-gold bg-forest px-6 py-3.5 text-xs font-bold uppercase tracking-[0.15em] text-ivory shadow-md hover:bg-green hover:border-gold-light transition-all"
              >
                <Camera className="h-4 w-4 text-gold-light" />
                <span>View Full Tours &amp; Travels Gallery</span>
                <ArrowRight className="h-4 w-4 text-gold-light" />
              </Link>

              {isAdminAuthenticated && (
                <button
                  type="button"
                  onClick={() => setShowActivityUploadModal(true)}
                  className="cursor-pointer inline-flex items-center gap-2 rounded-full bg-green px-5 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-ivory hover:bg-forest hover:text-gold-light transition-all shadow-sm"
                >
                  <Upload className="h-4 w-4 text-gold-light" />
                  <span>Upload Tour Photos</span>
                </button>
              )}
            </div>
          </ScrollReveal>

          {/* Activity Category Filter Tabs */}
          <ScrollReveal
            variant="fade-up"
            delayMs={80}
            className="mt-9 flex flex-wrap gap-2 border-b border-charcoal/15 pb-4"
          >
            {activityGalleryCategories.map((cat) => {
              const isSelected = activeGalleryCategory === cat;
              const count =
                cat === "All Tours & Travels"
                  ? activityGalleryList.length
                  : activityGalleryList.filter((i) => i.category === cat)
                      .length;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => {
                    setActiveGalleryCategory(cat);
                    setActiveGalleryLightboxIdx(null);
                  }}
                  className={`cursor-pointer inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold transition-all duration-200 ${
                    isSelected
                      ? "bg-forest text-ivory shadow-sm -translate-y-0.5"
                      : "border border-charcoal/15 bg-ivory text-charcoal hover:border-gold hover:-translate-y-0.5"
                  }`}
                >
                  <span>{cat}</span>
                  <span
                    className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                      isSelected
                        ? "bg-gold text-forest"
                        : "bg-cream text-charcoal/75"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </ScrollReveal>

          {/* 4-Photo Sneak Peek Grid on Homepage */}
          <div
            key={activeGalleryCategory}
            className="animate-panel-enter mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
          >
            {filteredActivityGallery.slice(0, 4).map((item, idx) => {
              const resolvedImg = withOverride(
                `activity.${item.id}`,
                item.image
              );

              return (
                <ScrollReveal
                  key={item.id}
                  variant="fade-up"
                  delayMs={idx * 75}
                  className="col-span-1 h-full"
                >
                  <div
                    onClick={() => setActiveGalleryLightboxIdx(idx)}
                    className="group cursor-pointer relative aspect-[4/3] w-full overflow-hidden rounded-xl sm:rounded-2xl border border-charcoal/15 bg-forest shadow-xs hover:shadow-xl hover:border-gold/60 transition-all duration-300"
                  >
                    <SiteImage
                      image={resolvedImg}
                      slotKey={`activity.${item.id}`}
                      className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
                      sizes="(min-width: 1024px) 25vw, 50vw"
                      tone="forest"
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    {/* Hover Zoom Camera Pill */}
                    <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-forest/85 backdrop-blur-md border border-gold/70 flex items-center justify-center text-gold-light shadow-xl transform scale-75 group-hover:scale-100 transition-transform duration-300">
                        <Camera className="h-5 w-5 sm:h-6 sm:w-6" />
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>

          {/* Dedicated Full Gallery Page Callout Banner */}
          <ScrollReveal variant="fade-up" delayMs={120} className="mt-10">
            <div className="rounded-ka border border-gold/45 bg-forest p-6 sm:p-8 text-ivory shadow-md flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div className="space-y-1.5 max-w-2xl">
                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-gold-light">
                  EXPLORE ALL {activityGalleryList.length} CURATED TOUR &amp; SAFARI PHOTOGRAPHS
                </p>
                <h3 className="font-display text-2xl sm:text-3xl text-ivory">
                  Want to See More Real Safari Animals, Family Villas, Mambrui Quad Bikes &amp; Safari Blue Photos?
                </h3>
                <p className="text-xs sm:text-sm text-cream/85 leading-relaxed">
                  Visit our dedicated Tours &amp; Travels Gallery page to sort through all photos of real wildlife taken on safari, kid-friendly accommodations with kids&rsquo; pools &amp; nannies on call, Mambrui Sand Dunes quad biking, Marafa Hell&rsquo;s Kitchen, and our Safari Blue glass-bottom boat.
                </p>
              </div>

              <Link
                href="/gallery"
                className="shrink-0 inline-flex items-center gap-3 rounded-full border border-gold bg-gold px-6 py-3.5 text-xs font-bold uppercase tracking-[0.16em] text-forest shadow-lg hover:bg-gold-light transition-all"
              >
                <Camera className="h-4 w-4" />
                <span>Open Full Gallery Page ({activityGalleryList.length} Photos)</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </ScrollReveal>
        </Container>
      </section>

      {/* Safari & Activity Gallery Full-Screen Plain Lightbox Modal */}
      {activeLightboxItem && activeGalleryLightboxIdx !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
          aria-label="Gallery Photograph"
          onClick={() => setActiveGalleryLightboxIdx(null)}
        >
          <div
            className="relative max-h-[92vh] w-full max-w-4xl overflow-hidden rounded-ka border border-gold/45 bg-forest p-2 shadow-2xl animate-modal-enter"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setActiveGalleryLightboxIdx(null)}
              className="cursor-pointer absolute top-4 right-4 z-20 rounded-full border border-gold/60 bg-forest/90 p-2 text-gold-light shadow-lg hover:bg-green"
              aria-label="Close gallery lightbox"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="relative aspect-[16/10] w-full overflow-hidden rounded-ka bg-black/50">
              <SiteImage
                image={withOverride(
                  `activity.${activeLightboxItem.id}`,
                  activeLightboxItem.image
                )}
                fit="contain"
                className="h-full w-full"
                sizes="100vw"
                tone="forest"
              />

              {/* Previous / Next Lightbox Controls */}
              {filteredActivityGallery.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() =>
                      setActiveGalleryLightboxIdx(
                        (activeGalleryLightboxIdx -
                          1 +
                          filteredActivityGallery.length) %
                          filteredActivityGallery.length
                      )
                    }
                    className="cursor-pointer absolute left-3 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full border border-gold/50 bg-forest/85 text-gold-light hover:bg-gold hover:text-forest transition-colors"
                    aria-label="Previous photo"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setActiveGalleryLightboxIdx(
                        (activeGalleryLightboxIdx + 1) %
                          filteredActivityGallery.length
                      )
                    }
                    className="cursor-pointer absolute right-3 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full border border-gold/50 bg-forest/85 text-gold-light hover:bg-gold hover:text-forest transition-colors"
                    aria-label="Next photo"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Mass Safari & Activity Photo Upload Modal */}
      {showActivityUploadModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
          aria-label="Mass Upload Safari & Activity Photos"
          onClick={() => setShowActivityUploadModal(false)}
        >
          <div
            className="max-h-[90vh] overflow-y-auto w-full max-w-2xl rounded-ka border border-gold/50 bg-ivory p-6 sm:p-8 shadow-2xl animate-modal-enter"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-charcoal/15 pb-3">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gold">
                  Kaya Experience Ltd · Previous Tours &amp; Travels Gallery
                </p>
                <h3 className="font-display text-2xl sm:text-3xl text-green">
                  Upload Tour &amp; Safari Photographs
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowActivityUploadModal(false)}
                className="cursor-pointer rounded-ka p-1.5 text-charcoal/70 hover:bg-cream"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form
              onSubmit={handleUploadActivityBatch}
              className="mt-4 space-y-4 text-xs"
            >
              <label className="cursor-pointer flex flex-col items-center justify-center gap-2 rounded-ka border-2 border-dashed border-gold/60 bg-cream/35 p-6 text-center hover:border-green hover:bg-cream/60 transition-colors">
                <Upload className="h-7 w-7 text-green" />
                <div>
                  <span className="font-semibold text-forest uppercase tracking-wider">
                    Click to Select Multiple Safari / Tour Photos
                  </span>
                  <p className="text-[11px] text-charcoal/70 mt-0.5">
                    Select 1 or many photos at once (JPG, PNG, WEBP) to add
                    directly to the Tours &amp; Travels Gallery.
                  </p>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => handleSelectActivityFiles(e.target.files)}
                  className="hidden"
                />
              </label>

              {queuedActivityFiles.length > 0 && (
                <div className="rounded-ka border border-charcoal/15 bg-cream/25 p-3.5 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-forest uppercase tracking-wider text-[11px]">
                      Queued Tour Photos ({queuedActivityFiles.length})
                    </span>
                    <button
                      type="button"
                      onClick={() => setQueuedActivityFiles([])}
                      className="cursor-pointer text-[11px] font-semibold text-rose-700 hover:underline"
                    >
                      Clear Queue
                    </button>
                  </div>

                  <div className="max-h-48 overflow-y-auto space-y-2 pr-1">
                    {queuedActivityFiles.map((item, idx) => (
                      <div
                        key={`${item.file.name}-${idx}`}
                        className="grid gap-2 sm:grid-cols-12 items-center rounded-ka bg-ivory p-2 border border-charcoal/10"
                      >
                        <div className="sm:col-span-5">
                          <input
                            type="text"
                            value={item.title}
                            onChange={(e) => {
                              const val = e.target.value;
                              setQueuedActivityFiles((prev) =>
                                prev.map((q, i) =>
                                  i === idx ? { ...q, title: val } : q
                                )
                              );
                            }}
                            placeholder="Photo title"
                            className="w-full rounded-ka border border-charcoal/20 bg-cream/20 px-2 py-1.5 text-xs text-charcoal"
                          />
                        </div>
                        <div className="sm:col-span-5">
                          <select
                            value={item.category}
                            onChange={(e) => {
                              const val = e.target
                                .value as ActivityGalleryItem["category"];
                              setQueuedActivityFiles((prev) =>
                                prev.map((q, i) =>
                                  i === idx ? { ...q, category: val } : q
                                )
                              );
                            }}
                            className="w-full rounded-ka border border-charcoal/20 bg-cream/20 px-2 py-1.5 text-xs text-charcoal"
                          >
                            <option value="Real Safari Wildlife & Animals">
                              Real Safari Wildlife &amp; Animals
                            </option>
                            <option value="Family & Kid-Friendly Stays">
                              Family &amp; Kid-Friendly Stays
                            </option>
                            <option value="Mambrui Quad Bikes & Hell's Kitchen">
                              Mambrui Quad Bikes &amp; Hell&apos;s Kitchen
                            </option>
                            <option value="Safari Blue Glass-Bottom Boat & Dolphins">
                              Safari Blue Glass-Bottom Boat &amp; Dolphins
                            </option>
                            <option value="Past Guests & Cultural Memories">
                              Past Guests &amp; Cultural Memories
                            </option>
                          </select>
                        </div>
                        <div className="sm:col-span-2 flex justify-end">
                          <button
                            type="button"
                            onClick={() =>
                              setQueuedActivityFiles((prev) =>
                                prev.filter((_, i) => i !== idx)
                              )
                            }
                            className="cursor-pointer rounded-ka border border-rose-200 px-2 py-1 text-[10px] font-semibold text-rose-700 hover:bg-rose-50"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="block font-semibold uppercase tracking-wider text-charcoal mb-1">
                    Default Gallery Category
                  </label>
                  <select
                    value={defaultActivityCategory}
                    onChange={(e) => {
                      const cat = e.target
                        .value as ActivityGalleryItem["category"];
                      setDefaultActivityCategory(cat);
                      setQueuedActivityFiles((prev) =>
                        prev.map((q) => ({ ...q, category: cat }))
                      );
                    }}
                    className="w-full rounded-ka border border-charcoal/25 bg-ivory px-3 py-2 text-xs text-charcoal"
                  >
                    <option value="Real Safari Wildlife & Animals">
                      Real Safari Wildlife &amp; Animals
                    </option>
                    <option value="Family & Kid-Friendly Stays">
                      Family &amp; Kid-Friendly Stays
                    </option>
                    <option value="Mambrui Quad Bikes & Hell's Kitchen">
                      Mambrui Quad Bikes &amp; Hell&apos;s Kitchen
                    </option>
                    <option value="Safari Blue Glass-Bottom Boat & Dolphins">
                      Safari Blue Glass-Bottom Boat &amp; Dolphins
                    </option>
                    <option value="Past Guests & Cultural Memories">
                      Past Guests &amp; Cultural Memories
                    </option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold uppercase tracking-wider text-charcoal mb-1">
                    Location Label
                  </label>
                  <input
                    type="text"
                    value={defaultActivityLocation}
                    onChange={(e) => setDefaultActivityLocation(e.target.value)}
                    placeholder="e.g., Arabuko-Sokoke Forest · Watamu · Tsavo"
                    className="w-full rounded-ka border border-charcoal/25 bg-ivory px-3 py-2 text-xs text-charcoal"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold uppercase tracking-wider text-charcoal mb-1">
                  Shared Caption / Activity Description (Optional)
                </label>
                <textarea
                  rows={2}
                  value={defaultActivityCaption}
                  onChange={(e) => setDefaultActivityCaption(e.target.value)}
                  placeholder="Describe the safari or coastal excursion shown in these photos..."
                  className="w-full rounded-ka border border-charcoal/25 bg-ivory px-3 py-2 text-xs text-charcoal"
                />
              </div>

              {uploadingActivities && activityBatchProgress && (
                <div className="rounded-ka border border-gold/50 bg-cream/60 p-3 space-y-1.5">
                  <div className="flex items-center justify-between font-semibold text-forest">
                    <span>
                      Uploading photo:{" "}
                      <strong>{activityBatchProgress.currentName}</strong>
                    </span>
                    <span>
                      {activityBatchProgress.done} /{" "}
                      {activityBatchProgress.total}
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-charcoal/10">
                    <div
                      className="h-full bg-green transition-all duration-200"
                      style={{
                        width: `${Math.round(
                          (activityBatchProgress.done /
                            activityBatchProgress.total) *
                            100
                        )}%`,
                      }}
                    />
                  </div>
                </div>
              )}

              {activityUploadNotice && (
                <div className="rounded-ka border border-gold bg-forest p-3 text-ivory flex items-center gap-2">
                  <Check className="h-4 w-4 text-gold-light shrink-0" />
                  <span>{activityUploadNotice}</span>
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowActivityUploadModal(false)}
                  className="cursor-pointer rounded-ka border border-charcoal/20 px-4 py-2.5 font-semibold text-charcoal"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={
                    uploadingActivities || queuedActivityFiles.length === 0
                  }
                  className="cursor-pointer inline-flex items-center gap-2 rounded-ka bg-green px-5 py-2.5 font-semibold uppercase tracking-wider text-ivory hover:bg-forest disabled:opacity-60"
                >
                  {uploadingActivities ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Uploading...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4" />
                      <span>
                        Upload{" "}
                        {queuedActivityFiles.length > 0
                          ? `${queuedActivityFiles.length} Photo${
                              queuedActivityFiles.length > 1 ? "s" : ""
                            }`
                          : "Photos"}{" "}
                        to Gallery
                      </span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =====================================================================
          SECTION 08: STORIES — CULTURE, PEOPLE & CONSERVATION
      ===================================================================== */}
      <section
        id="stories"
        className="scroll-mt-20 py-20 sm:py-28 lg:py-32 bg-ivory"
        aria-labelledby="stories-heading"
      >
        <Container>
          <ScrollReveal variant="fade-up" className="max-w-3xl">
            <p className="mb-2.5 text-[11px] sm:text-xs font-semibold uppercase tracking-[0.22em] text-gold">
              {storiesSectionHeader.eyebrow}
            </p>
            <h2
              id="stories-heading"
              className="font-display text-3xl sm:text-4xl lg:text-5xl leading-[1.06] text-green"
            >
              {storiesSectionHeader.headline}
            </h2>
            <p className="mt-4 text-sm sm:text-base leading-relaxed text-charcoal/85">
              {storiesSectionHeader.description}
            </p>
          </ScrollReveal>

          {/* Editorial Category Filter Bar */}
          <ScrollReveal
            variant="fade-up"
            delayMs={80}
            className="mt-8 flex flex-wrap gap-2"
          >
            <button
              type="button"
              onClick={() => setActiveStoryCategory("all")}
              className={`cursor-pointer rounded-ka px-3.5 py-1.5 text-xs font-semibold transition-all duration-200 ${
                activeStoryCategory === "all"
                  ? "bg-forest text-ivory -translate-y-0.5 shadow-xs"
                  : "border border-charcoal/20 bg-cream/35 text-charcoal hover:border-gold hover:-translate-y-0.5"
              }`}
            >
              All Stories
            </button>
            {storyCategories.map((cat) => (
              <button
                key={cat.slug}
                type="button"
                onClick={() => setActiveStoryCategory(cat.slug)}
                className={`cursor-pointer rounded-ka px-3.5 py-1.5 text-xs font-semibold transition-all duration-200 ${
                  activeStoryCategory === cat.slug
                    ? "bg-forest text-ivory -translate-y-0.5 shadow-xs"
                    : "border border-charcoal/20 bg-cream/35 text-charcoal hover:border-gold hover:-translate-y-0.5"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </ScrollReveal>

          {/* Curated Stories Grid */}
          <div
            key={activeStoryCategory}
            className="animate-panel-enter mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
          >
            {filteredStories.map((story, idx) => {
              const catName =
                storyCategories.find((c) => c.slug === story.categorySlug)
                  ?.name || story.categorySlug;
              const resolvedStoryImage = withOverride(
                `story.${story.slug}`,
                story.image
              );
              const storyWithResolvedImage: Story = {
                ...story,
                image: resolvedStoryImage,
              };
              return (
                <ScrollReveal
                  key={story.slug}
                  variant="fade-up"
                  delayMs={idx * 90}
                  className="h-full"
                >
                  <article className="ka-card-hover group flex h-full flex-col justify-between rounded-ka border border-charcoal/15 bg-cream/20 overflow-hidden hover:border-gold">
                    <div>
                      <div
                        onClick={() =>
                          setActiveStoryModal(storyWithResolvedImage)
                        }
                        className="cursor-pointer overflow-hidden"
                      >
                        <SiteImage
                          image={resolvedStoryImage}
                          slotKey={`story.${story.slug}`}
                          className="aspect-[16/10] w-full transition-transform duration-700 ease-out group-hover:scale-105"
                          sizes="(min-width: 1024px) 33vw, 100vw"
                          tone="forest"
                        />
                      </div>

                      <div className="p-6 space-y-3">
                        <div className="flex items-center justify-between gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-gold">
                          <span>{catName}</span>
                          <span className="inline-flex items-center gap-1 text-charcoal/60">
                            <Clock className="h-3 w-3" />
                            {story.readMinutes} min read
                          </span>
                        </div>

                        <h3 className="font-display text-2xl sm:text-[26px] leading-snug text-green group-hover:text-forest">
                          <button
                            type="button"
                            onClick={() =>
                              setActiveStoryModal(storyWithResolvedImage)
                            }
                            className="cursor-pointer text-left hover:underline decoration-gold underline-offset-4"
                          >
                            {story.title}
                          </button>
                        </h3>

                        <p className="text-xs sm:text-sm leading-relaxed text-charcoal/80">
                          {story.excerpt}
                        </p>
                      </div>
                    </div>

                    <div className="px-6 pb-6 pt-2 flex items-center justify-between border-t border-charcoal/10">
                      <button
                        type="button"
                        onClick={() =>
                          setActiveStoryModal(storyWithResolvedImage)
                        }
                        className="cursor-pointer inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-green group-hover:text-gold transition-colors"
                      >
                        <span>Read Story</span>
                        <ArrowRight className="h-3.5 w-3.5 transition-transform duration-250 group-hover:translate-x-1" />
                      </button>

                      <a
                        href={`/stories/${story.slug}`}
                        className="text-[11px] text-charcoal/55 hover:text-green underline-offset-4 hover:underline"
                      >
                        Permalink ↗
                      </a>
                    </div>
                  </article>
                </ScrollReveal>
              );
            })}
          </div>
        </Container>
      </section>

      {/* =====================================================================
          SECTION 09: ABOUT KAYARABUKO
      ===================================================================== */}
      <section
        id="about"
        className="scroll-mt-20 bg-forest py-20 sm:py-28 lg:py-32 text-ivory"
        aria-labelledby="about-heading"
      >
        <Container>
          <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
            {/* About Narrative */}
            <ScrollReveal
              variant="fade-up"
              className="lg:col-span-6 space-y-6"
            >
              <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.22em] text-gold-light">
                {aboutContent.eyebrow}
              </p>

              <h2
                id="about-heading"
                className="font-display text-3xl sm:text-4xl lg:text-5xl leading-[1.08] text-ivory"
              >
                {platformSettings.aboutHeadline || aboutContent.headline}
              </h2>

              <div className="space-y-4 text-sm sm:text-base leading-relaxed text-cream/90">
                {aboutContent.paragraphs.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>

              {/* Managed by Kaya Experience Ltd Emblem & Watamu Office Card */}
              <div className="rounded-ka border border-gold/40 bg-green/45 p-5 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gold-light">
                      Managed &amp; Operated By
                    </p>
                    <p className="font-display text-2xl text-ivory">
                      Kaya Experience Ltd
                    </p>
                  </div>
                  <KayaExperienceLogo
                    variant="light"
                    alt="Kaya Experience Ltd Logo"
                    width={195}
                    height={52}
                    className="h-12 w-auto"
                  />
                </div>
                <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 pt-2 border-t border-cream/15 text-xs text-cream/90">
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-gold" />
                    <strong>Office:</strong> Watamu, Timboni Stage
                  </span>
                  <span className="inline-flex items-center gap-1.5 font-mono">
                    <Phone className="h-3.5 w-3.5 text-gold" />
                    <a
                      href="tel:+254728560303"
                      className="hover:text-gold-light"
                    >
                      +254 728 560303
                    </a>{" "}
                    /{" "}
                    <a
                      href="tel:+254712863538"
                      className="hover:text-gold-light"
                    >
                      +254 712 863538
                    </a>
                  </span>
                </div>
              </div>
            </ScrollReveal>

            {/* Concise Three-Pillar Summary Cards */}
            <div className="lg:col-span-6 space-y-4">
              {aboutContent.pillarsSummary.map((pillar, idx) => (
                <ScrollReveal
                  key={pillar.title}
                  variant="fade-left"
                  delayMs={idx * 120}
                >
                  <div className="ka-card-hover rounded-ka border border-cream/15 bg-green/40 p-5 sm:p-6 flex items-start gap-4 hover:border-gold/60">
                    <span className="font-display text-3xl text-gold-light shrink-0">
                      0{idx + 1}
                    </span>
                    <div>
                      <h3 className="font-display text-2xl tracking-wide text-ivory">
                        {pillar.title}
                      </h3>
                      <p className="mt-1 text-xs sm:text-sm leading-relaxed text-cream/85">
                        {pillar.text}
                      </p>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>

          {/* Unmistakable Final Brand Philosophy Statement */}
          <ScrollReveal variant="scale-in" delayMs={150} className="mt-16">
            <div className="rounded-ka border border-gold/45 bg-green/35 p-8 sm:p-12 text-center transition-colors hover:border-gold">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold-light">
                {aboutContent.finalBanner.brand}
              </p>
              <h3 className="mt-2 font-display text-3xl sm:text-5xl tracking-wide text-ivory">
                {aboutContent.finalBanner.pillars}
              </h3>
              <p className="mx-auto mt-3 max-w-xl font-serif text-lg sm:text-2xl italic text-cream/90">
                &ldquo;{aboutContent.finalBanner.closingQuote}&rdquo;
              </p>
            </div>
          </ScrollReveal>
        </Container>
      </section>

      {/* =====================================================================
          SECTION 09B: MEET OUR TEAM — KAYA EXPERIENCE LTD LEADERSHIP
      ===================================================================== */}
      <section
        id="team"
        className="scroll-mt-20 bg-ivory py-20 sm:py-28 lg:py-32 border-b border-charcoal/10"
        aria-labelledby="team-heading"
      >
        <Container>
          <ScrollReveal
            variant="fade-up"
            className="flex flex-col lg:flex-row lg:items-end justify-between gap-6"
          >
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 text-[11px] sm:text-xs font-semibold uppercase tracking-[0.22em] text-gold mb-2.5">
                <Users className="h-3.5 w-3.5 text-gold" />
                <span>{teamSectionHeader.eyebrow}</span>
              </div>
              <h2
                id="team-heading"
                className="font-display text-3xl sm:text-4xl lg:text-5xl leading-[1.06] text-green"
              >
                {teamSectionHeader.headline}
              </h2>
              <p className="mt-4 text-sm sm:text-base leading-relaxed text-charcoal/85">
                {teamSectionHeader.description}
              </p>
            </div>

            <div className="shrink-0">
              <KayaExperienceLogo
                variant="dark"
                alt="Managed by Kaya Experience Ltd"
                width={215}
                height={56}
                className="h-14 w-auto"
              />
            </div>
          </ScrollReveal>

          <div className="mt-12 grid gap-8 lg:grid-cols-3">
            {teamMembers.map((member, idx) => (
              <ScrollReveal
                key={member.slug}
                variant="fade-up"
                delayMs={idx * 110}
                className="h-full"
              >
                <article className="ka-card-hover group flex h-full flex-col justify-between rounded-ka border border-charcoal/15 bg-cream/30 overflow-hidden hover:border-gold shadow-xs">
                  <div>
                    <div className="relative aspect-[4/3] w-full overflow-hidden bg-forest">
                      <SiteImage
                        image={withOverride(`team.${member.slug}`, member.image)}
                        slotKey={`team.${member.slug}`}
                        className="h-full w-full transition-transform duration-700 ease-out group-hover:scale-105"
                        sizes="(min-width: 1024px) 33vw, 100vw"
                        tone="forest"
                      />
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-forest/85 via-transparent to-transparent" />
                      {member.aka && (
                        <span className="pointer-events-none absolute top-3 left-3 inline-block rounded-ka bg-forest/90 backdrop-blur-xs border border-gold/45 px-3 py-1 text-[11px] font-semibold text-gold-light">
                          {member.aka}
                        </span>
                      )}
                    </div>

                    <div className="p-6 space-y-4">
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-gold">
                          {member.organization}
                        </p>
                        <h3 className="mt-1 font-display text-3xl text-green">
                          {member.name}
                        </h3>
                        <p className="text-xs font-semibold text-forest/85">
                          {member.role}
                        </p>
                      </div>

                      <p className="text-xs sm:text-sm leading-relaxed text-charcoal/85">
                        {member.bio}
                      </p>

                      {member.heritageMeaning && (
                        <blockquote className="rounded-ka border-l-2 border-gold bg-ivory p-3.5 font-serif text-xs sm:text-sm italic leading-relaxed text-forest">
                          {member.heritageMeaning}
                        </blockquote>
                      )}

                      <ul className="space-y-1.5 pt-2 border-t border-charcoal/10 text-xs text-charcoal/80">
                        {member.focusAreas.map((fa) => (
                          <li key={fa} className="flex items-start gap-2">
                            <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-gold shrink-0" />
                            <span>{fa}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </article>
              </ScrollReveal>
            ))}
          </div>
        </Container>
      </section>

      {/* =====================================================================
          SECTION 09B2: CUSTOMER REVIEWS — HORIZONTAL AUTO-SCROLLING CAROUSEL
      ===================================================================== */}
      <section
        id="reviews"
        className="scroll-mt-20 bg-forest text-cream py-14 sm:py-20 border-b border-gold/25 overflow-hidden"
        aria-labelledby="reviews-heading"
      >
        <Container>
          <ScrollReveal
            variant="fade-up"
            className="flex flex-col lg:flex-row lg:items-end justify-between gap-6"
          >
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 text-[11px] sm:text-xs font-semibold uppercase tracking-[0.22em] text-gold-light mb-2">
                <Star className="h-3.5 w-3.5 fill-gold text-gold" />
                <span>{customerReviewsSectionHeader.eyebrow}</span>
              </div>
              <h2
                id="reviews-heading"
                className="font-display text-2xl sm:text-3xl lg:text-4xl leading-[1.08] text-ivory"
              >
                {customerReviewsSectionHeader.headline}
              </h2>
            </div>

            {/* Interactive TripAdvisor & Google Ratings Badges Scorecard + Manual Carousel Arrows */}
            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <PartnerBadgeLogo
                slotKey="brand.tripadvisor.badge"
                defaultSrc="/images/tripadvisor-badge.svg"
                label="TripAdvisor 5.0 Travellers' Choice Rating Badge"
                className="h-12 sm:h-14 w-auto"
                width={210}
                height={62}
              />
              <PartnerBadgeLogo
                slotKey="brand.googleReviews.badge"
                defaultSrc="/images/google-reviews-badge.svg"
                label="Google Reviews 4.9 Verified Rating Badge"
                className="h-12 sm:h-14 w-auto"
                width={210}
                height={62}
              />
              <div className="flex items-center gap-1.5 pl-1">
                <button
                  type="button"
                  onClick={() =>
                    reviewsCarouselRef.current?.scrollBy({
                      left: -390,
                      behavior: "smooth",
                    })
                  }
                  aria-label="Scroll reviews left"
                  className="cursor-pointer flex h-9 w-9 items-center justify-center rounded-full border border-gold/45 bg-green/45 text-gold-light hover:border-gold hover:bg-gold hover:text-forest transition-colors"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() =>
                    reviewsCarouselRef.current?.scrollBy({
                      left: 390,
                      behavior: "smooth",
                    })
                  }
                  aria-label="Scroll reviews right"
                  className="cursor-pointer flex h-9 w-9 items-center justify-center rounded-full border border-gold/45 bg-green/45 text-gold-light hover:border-gold hover:bg-gold hover:text-forest transition-colors"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </ScrollReveal>
        </Container>

        {/* Continuous Horizontal Auto-Scrolling Carousel Track (Pauses on Hover + Touch/Button Scrollable) */}
        <div
          ref={reviewsCarouselRef}
          className="relative mt-9 w-full overflow-x-auto scrollbar-none"
        >
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 sm:w-20 bg-gradient-to-r from-forest to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 sm:w-20 bg-gradient-to-l from-forest to-transparent" />

          <div className="animate-reviews-marquee gap-6 px-4">
            {[...customerReviewsList, ...customerReviewsList].map(
              (rev, idx) => {
                const isTripAdvisor = rev.platform === "TripAdvisor";
                const reviewSlotKey =
                  rev.image?.slotKey || `review.photo.${rev.id}`;
                return (
                  <article
                    key={`${rev.id}-${idx}`}
                    className="w-[340px] sm:w-[410px] shrink-0 flex flex-col justify-between rounded-ka border border-gold/30 bg-green/35 overflow-hidden shadow-md hover:border-gold transition-colors"
                  >
                    <div>
                      {/* Uploadable Reviewer Photo Section (Hover in Visual Quick-Edit Mode to Upload/Replace Reviewer Image) */}
                      <div className="relative aspect-[16/10] w-full overflow-hidden bg-forest">
                        <SiteImage
                          image={withOverride(reviewSlotKey, rev.image)}
                          slotKey={reviewSlotKey}
                          className="h-full w-full"
                          sizes="(min-width: 640px) 410px, 340px"
                          tone="forest"
                        />
                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-forest/85 via-transparent to-black/25" />

                        {/* Platform Badge + 5-Star Rating Pill Over Photo */}
                        <div className="pointer-events-none absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full backdrop-blur-md px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                              isTripAdvisor
                                ? "bg-forest/90 text-[#34E0A1] border border-[#34E0A1]/50"
                                : "bg-forest/90 text-gold-light border border-gold/50"
                            }`}
                          >
                            <span>{rev.platform} Verified</span>
                          </span>
                          <div
                            className="flex items-center gap-0.5 rounded-full bg-forest/85 backdrop-blur-md px-2.5 py-1 text-amber-400"
                            aria-label={`${rev.rating} out of 5 stars`}
                          >
                            {Array.from({ length: rev.rating }).map(
                              (_, sIdx) => (
                                <Star
                                  key={sIdx}
                                  className="h-3 w-3 fill-amber-400 text-amber-400"
                                />
                              )
                            )}
                          </div>
                        </div>

                        {/* Guest Name & Country Flag Overlay at Bottom of Reviewer Photo */}
                        <div className="pointer-events-none absolute bottom-2.5 left-3.5 right-3.5 flex items-end justify-between gap-2">
                          <div>
                            <p className="font-display text-xl font-bold text-ivory drop-shadow">
                              {rev.guestName}
                            </p>
                            <p className="text-[11px] font-semibold text-gold-light">
                              {rev.guestOrigin}
                            </p>
                          </div>
                          <span className="rounded-ka bg-gold/95 px-2 py-0.5 text-[9.5px] font-bold uppercase tracking-wider text-forest">
                            {rev.dateLabel}
                          </span>
                        </div>
                      </div>

                      <div className="p-5 space-y-3">
                        {/* Exact Client Photo Caption / Reviewer Highlight Note */}
                        {rev.photoCaption && (
                          <div className="rounded-ka border-l-2 border-gold bg-forest/75 px-3 py-2 text-[11.5px] font-medium leading-relaxed text-gold-light">
                            {rev.photoCaption}
                          </div>
                        )}

                        <div>
                          <span className="inline-block rounded-ka bg-forest/70 px-2 py-0.5 text-[9.5px] font-semibold uppercase tracking-wider text-gold-light mb-1">
                            {rev.stayOrPackageTag}
                          </span>
                          <h3 className="font-display text-lg leading-snug text-ivory">
                            {rev.tripTitle}
                          </h3>
                        </div>

                        <p className="text-xs leading-relaxed text-cream/90 italic">
                          &ldquo;{rev.reviewText}&rdquo;
                        </p>
                      </div>
                    </div>

                    <div className="px-5 pb-4 pt-3 border-t border-cream/15 flex items-center justify-between gap-2 text-[11px]">
                      <span className="font-semibold text-ivory">
                        {rev.guestName} · {rev.guestOrigin}
                      </span>
                      <span className="text-[10px] font-medium uppercase tracking-wider text-gold-light">
                        KayArabuko Safaris
                      </span>
                    </div>
                  </article>
                );
              }
            )}
          </div>
        </div>
      </section>

      {/* =====================================================================
          SECTION 09C: PUBLISHED POSTERS & CAMPAIGN BULLETINS (WITH UPLOAD)
      ===================================================================== */}
      <section
        id="posters"
        className="scroll-mt-20 bg-cream/40 py-20 sm:py-28 lg:py-32 border-b border-charcoal/10"
        aria-labelledby="posters-heading"
      >
        <Container>
          <ScrollReveal
            variant="fade-up"
            className="flex flex-col md:flex-row md:items-end justify-between gap-6"
          >
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 text-[11px] sm:text-xs font-semibold uppercase tracking-[0.22em] text-gold mb-2.5">
                <Sparkles className="h-3.5 w-3.5 text-gold" />
                <span>{postersSectionHeader.eyebrow}</span>
              </div>
              <h2
                id="posters-heading"
                className="font-display text-3xl sm:text-4xl lg:text-5xl leading-[1.06] text-green"
              >
                {postersSectionHeader.headline}
              </h2>
              <p className="mt-4 text-sm sm:text-base leading-relaxed text-charcoal/85">
                {postersSectionHeader.description}
              </p>
            </div>

            {isAdminAuthenticated && (
              <div className="flex flex-wrap items-center gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => setShowPosterUploadModal(true)}
                  className="cursor-pointer inline-flex items-center gap-2 rounded-ka bg-green px-5 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-ivory hover:bg-forest hover:text-gold-light transition-all shadow-sm"
                >
                  <Upload className="h-4 w-4 text-gold-light" />
                  <span>Mass Upload Posters</span>
                </button>

                <Link
                  href="/admin/gallery#posters-manager"
                  className="inline-flex items-center gap-1.5 rounded-ka border border-charcoal/25 bg-ivory px-4 py-3 text-xs font-semibold text-charcoal hover:border-gold transition-colors"
                >
                  <ImageIcon className="h-3.5 w-3.5 text-forest" />
                  <span>Manage in Media Studio</span>
                </Link>
              </div>
            )}
          </ScrollReveal>

          {/* Posters Showcase Grid — Plain Posters Without Overlaid Text */}
          <p className="mt-8 sm:hidden text-[11px] font-semibold uppercase tracking-[0.16em] text-gold">
            Swipe horizontally to browse posters →
          </p>
          <div className="ka-mobile-carousel ka-focus-grid mt-4 sm:mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {postersList.map((poster, idx) => {
              const resolvedPosterImg = withOverride(
                `poster.${poster.id}`,
                poster.image
              );
              return (
                <ScrollReveal
                  key={poster.id}
                  variant="fade-up"
                  delayMs={(idx % 4) * 85}
                  className="h-full"
                >
                  <article
                    onClick={() =>
                      setActivePosterModal({
                        ...poster,
                        image: resolvedPosterImg,
                      })
                    }
                    className="ka-card-hover group cursor-pointer relative overflow-hidden rounded-ka border border-charcoal/15 bg-ivory shadow-sm hover:border-gold"
                  >
                    <div className="relative aspect-[3/4] w-full overflow-hidden bg-ivory">
                      <SiteImage
                        image={resolvedPosterImg}
                        slotKey={`poster.${poster.id}`}
                        className="h-full w-full transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                        sizes="(min-width: 1024px) 25vw, 50vw"
                        tone="cream"
                      />
                    </div>
                  </article>
                </ScrollReveal>
              );
            })}
          </div>
        </Container>
      </section>

      {/* Poster Full-Screen Lightbox Modal — Plain Poster View */}
      {activePosterModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
          aria-label="Published Poster Preview"
          onClick={() => setActivePosterModal(null)}
        >
          <div
            className="relative max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-ka border border-gold/40 bg-forest text-ivory p-4 sm:p-6 shadow-2xl animate-modal-enter"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-end pb-3">
              <button
                type="button"
                onClick={() => setActivePosterModal(null)}
                className="cursor-pointer rounded-ka border border-cream/20 p-2 text-gold-light hover:bg-green/50"
                aria-label="Close poster preview"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="relative aspect-[3/4] w-full overflow-hidden rounded-ka bg-black/40">
              <SiteImage
                image={activePosterModal.image}
                slotKey={`poster.${activePosterModal.id}`}
                fit="contain"
                className="h-full w-full"
                sizes="100vw"
                tone="forest"
              />
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-cream/15">
              <span className="text-xs text-gold-light font-mono">
                Contacts: +254 728 560303 / +254 712 863538 · Watamu, Timboni Stage
              </span>
              <WhatsAppButton
                label="Inquire via WhatsApp"
                variant="gold"
                context={{
                  areaOfInterest: "Published Poster Enquiry",
                  preferredLocation: "Watamu, Timboni Stage (Office & Coastal Hub)",
                }}
                whatsappNumber={platformSettings.whatsappNumber}
              />
            </div>
          </div>
        </div>
      )}

      {/* Inline Mass Poster Upload Modal */}
      {showPosterUploadModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
          aria-label="Mass Upload Published Posters"
          onClick={() => setShowPosterUploadModal(false)}
        >
          <div
            className="max-h-[90vh] overflow-y-auto w-full max-w-2xl rounded-ka border border-gold/50 bg-ivory p-6 sm:p-8 shadow-2xl animate-modal-enter"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-charcoal/15 pb-3">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gold">
                  Kaya Experience Ltd · Bulk Poster Uploader
                </p>
                <h3 className="font-display text-2xl sm:text-3xl text-green">
                  Mass Upload Published Posters
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowPosterUploadModal(false)}
                className="cursor-pointer rounded-ka p-1.5 text-charcoal/70 hover:bg-cream"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form
              onSubmit={handleUploadNewPoster}
              className="mt-4 space-y-4 text-xs"
            >
              {/* Multi-File Dropzone */}
              <label className="cursor-pointer flex flex-col items-center justify-center gap-2 rounded-ka border-2 border-dashed border-gold/60 bg-cream/35 p-6 text-center hover:border-green hover:bg-cream/60 transition-colors">
                <Upload className="h-7 w-7 text-green" />
                <div>
                  <span className="font-semibold text-forest uppercase tracking-wider">
                    Click to Select Multiple Poster Images
                  </span>
                  <p className="text-[11px] text-charcoal/70 mt-0.5">
                    Select 1, 5, 10 or 20+ posters at once (JPG, PNG, WEBP). All
                    selected posters will be published in one batch.
                  </p>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => handleSelectPosterFiles(e.target.files)}
                  className="hidden"
                />
              </label>

              {/* Queued Files List with Editable Titles & Categories */}
              {queuedPosterFiles.length > 0 && (
                <div className="rounded-ka border border-charcoal/15 bg-cream/25 p-3.5 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-forest uppercase tracking-wider text-[11px]">
                      Selected Posters Ready for Upload (
                      {queuedPosterFiles.length})
                    </span>
                    <button
                      type="button"
                      onClick={() => setQueuedPosterFiles([])}
                      className="cursor-pointer text-[11px] font-semibold text-rose-700 hover:underline"
                    >
                      Clear Queue
                    </button>
                  </div>

                  <div className="max-h-48 overflow-y-auto space-y-2 pr-1">
                    {queuedPosterFiles.map((item, idx) => (
                      <div
                        key={`${item.file.name}-${idx}`}
                        className="grid gap-2 sm:grid-cols-12 items-center rounded-ka bg-ivory p-2 border border-charcoal/10"
                      >
                        <div className="sm:col-span-6">
                          <input
                            type="text"
                            value={item.title}
                            onChange={(e) => {
                              const val = e.target.value;
                              setQueuedPosterFiles((prev) =>
                                prev.map((q, i) =>
                                  i === idx ? { ...q, title: val } : q
                                )
                              );
                            }}
                            placeholder="Poster title"
                            className="w-full rounded-ka border border-charcoal/20 bg-cream/20 px-2.5 py-1.5 text-xs text-charcoal"
                          />
                        </div>
                        <div className="sm:col-span-4">
                          <select
                            value={item.category}
                            onChange={(e) => {
                              const val = e.target.value;
                              setQueuedPosterFiles((prev) =>
                                prev.map((q, i) =>
                                  i === idx ? { ...q, category: val } : q
                                )
                              );
                            }}
                            className="w-full rounded-ka border border-charcoal/20 bg-cream/20 px-2 py-1.5 text-xs text-charcoal"
                          >
                            <option value="Excursions">Excursions</option>
                            <option value="Accommodation">Accommodation</option>
                            <option value="Kaya Roots Africa">
                              Kaya Roots Africa
                            </option>
                            <option value="Marine & Creek">
                              Marine &amp; Creek
                            </option>
                            <option value="Cultural & Conservation">
                              Cultural &amp; Conservation
                            </option>
                          </select>
                        </div>
                        <div className="sm:col-span-2 flex justify-end">
                          <button
                            type="button"
                            onClick={() =>
                              setQueuedPosterFiles((prev) =>
                                prev.filter((_, i) => i !== idx)
                              )
                            }
                            className="cursor-pointer rounded-ka border border-rose-200 px-2 py-1 text-[10px] font-semibold text-rose-700 hover:bg-rose-50"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="block font-semibold uppercase tracking-wider text-charcoal mb-1">
                    Default Category for Batch
                  </label>
                  <select
                    value={newPosterCategory}
                    onChange={(e) => {
                      const cat = e.target.value;
                      setNewPosterCategory(cat);
                      setQueuedPosterFiles((prev) =>
                        prev.map((q) => ({ ...q, category: cat }))
                      );
                    }}
                    className="w-full rounded-ka border border-charcoal/25 bg-ivory px-3 py-2 text-xs text-charcoal"
                  >
                    <option value="Excursions">Excursions</option>
                    <option value="Accommodation">Accommodation</option>
                    <option value="Kaya Roots Africa">Kaya Roots Africa</option>
                    <option value="Marine & Creek">Marine &amp; Creek</option>
                    <option value="Cultural & Conservation">
                      Cultural &amp; Conservation
                    </option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold uppercase tracking-wider text-charcoal mb-1">
                    Shared Subtitle / Office Note
                  </label>
                  <input
                    type="text"
                    value={newPosterSubtitle}
                    onChange={(e) => setNewPosterSubtitle(e.target.value)}
                    placeholder="Managed by Kaya Experience Ltd · Watamu, Timboni Stage"
                    className="w-full rounded-ka border border-charcoal/25 bg-ivory px-3 py-2 text-xs text-charcoal"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold uppercase tracking-wider text-charcoal mb-1">
                  Shared Description (Optional)
                </label>
                <textarea
                  rows={2}
                  value={newPosterDesc}
                  onChange={(e) => setNewPosterDesc(e.target.value)}
                  placeholder="Optional details about these posters (Contacts: +254 728 560303 / +254 712 863538)..."
                  className="w-full rounded-ka border border-charcoal/25 bg-ivory px-3 py-2 text-xs text-charcoal"
                />
              </div>

              <label className="flex items-center gap-2 cursor-pointer text-xs text-charcoal/85">
                <input
                  type="checkbox"
                  checked={replaceExistingPosters}
                  onChange={(e) => setReplaceExistingPosters(e.target.checked)}
                  className="rounded border-charcoal/30 text-green focus:ring-green"
                />
                <span>
                  Replace existing/sample posters with this uploaded batch
                </span>
              </label>

              {uploadingPoster && posterBatchProgress && (
                <div className="rounded-ka border border-gold/50 bg-cream/60 p-3 space-y-1.5">
                  <div className="flex items-center justify-between font-semibold text-forest">
                    <span>
                      Uploading poster:{" "}
                      <strong>{posterBatchProgress.currentName}</strong>
                    </span>
                    <span>
                      {posterBatchProgress.done} / {posterBatchProgress.total}
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-charcoal/10">
                    <div
                      className="h-full bg-green transition-all duration-200"
                      style={{
                        width: `${Math.round(
                          (posterBatchProgress.done /
                            posterBatchProgress.total) *
                            100
                        )}%`,
                      }}
                    />
                  </div>
                </div>
              )}

              {posterUploadNotice && (
                <div className="rounded-ka border border-gold bg-forest p-3 text-ivory flex items-center gap-2">
                  <Check className="h-4 w-4 text-gold-light shrink-0" />
                  <span>{posterUploadNotice}</span>
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowPosterUploadModal(false)}
                  className="cursor-pointer rounded-ka border border-charcoal/20 px-4 py-2.5 font-semibold text-charcoal"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploadingPoster || queuedPosterFiles.length === 0}
                  className="cursor-pointer inline-flex items-center gap-2 rounded-ka bg-green px-5 py-2.5 font-semibold uppercase tracking-wider text-ivory hover:bg-forest disabled:opacity-60"
                >
                  {uploadingPoster ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>
                        Uploading{" "}
                        {posterBatchProgress
                          ? `${posterBatchProgress.done}/${posterBatchProgress.total}`
                          : "Batch"}
                        ...
                      </span>
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4" />
                      <span>
                        Upload{" "}
                        {queuedPosterFiles.length > 0
                          ? `${queuedPosterFiles.length} Poster${
                              queuedPosterFiles.length > 1 ? "s" : ""
                            }`
                          : "Posters"}{" "}
                        to Website
                      </span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =====================================================================
          SECTION 10: CONTACT & EXPERIENCE ENQUIRIES
      ===================================================================== */}
      <ScrollReveal variant="fade-up">
        <ExperienceEnquirySection
          preset={enquiryPreset}
          whatsappNumber={
            platformSettings.whatsappNumber || site.contact.whatsapp
          }
          contactEmail={platformSettings.email || site.contact.email}
          contactPhone={platformSettings.primaryPhone || site.contact.phone}
          headlineOverride={platformSettings.contactHeadline}
        />
      </ScrollReveal>

      {/* Inline Editorial Story Reader Modal */}
      <StoryReaderModal
        story={activeStoryModal}
        onClose={() => setActiveStoryModal(null)}
        onEnquireTopic={(topic, storyTitle) =>
          triggerContextualEnquiry(
            "Cultural & Heritage Visits",
            topic,
            `Story: ${storyTitle}`
          )
        }
      />
    </>
  );
}
