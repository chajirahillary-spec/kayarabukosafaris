"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Baby,
  Camera,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Image as ImageIcon,
  ImagePlus,
  Lock,
  MapPin,
  Plus,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import {
  activityGallerySectionHeader,
  initialActivityGallery,
  kidFriendlyAccommodationHighlight,
} from "@/data/content";
import type { ActivityGalleryItem } from "@/lib/types";
import {
  MediaService,
  sanitizePublicLabel,
} from "@/lib/firebase/mediaService";
import { AdminAuthService } from "@/lib/firebase/adminAuth";
import { Container } from "@/components/ui/primitives";
import { SiteImage } from "@/components/ui/SiteImage";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { useVisualEdit } from "@/components/visual-editor/VisualEditProvider";

const SORTABLE_CATEGORIES: ActivityGalleryItem["category"][] = [
  "Real Safari Wildlife & Animals",
  "Family & Kid-Friendly Stays",
  "Mambrui Quad Bikes & Hell's Kitchen",
  "Safari Blue Glass-Bottom Boat & Dolphins",
  "Past Guests & Cultural Memories",
];

interface QueuedBulkPhoto {
  id: string;
  file: File;
  previewUrl: string;
  name: string;
  sizeFormatted: string;
}

export default function ToursAndTravelsGalleryPage() {
  const { isAdminAuthenticated, editMode } = useVisualEdit();

  const [activityGallery, setActivityGallery] = useState<ActivityGalleryItem[]>(
    initialActivityGallery
  );
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);

  // Seamless Bulk Upload & Manage State
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [activeModalTab, setActiveModalTab] = useState<"upload" | "manage">(
    "upload"
  );
  const [manageMode, setManageMode] = useState(false);
  const [toastNotice, setToastNotice] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const showToast = (text: string, type: "success" | "error" = "success") => {
    setToastNotice({ type, text });
    setTimeout(() => {
      setToastNotice((prev) => (prev?.text === text ? null : prev));
    }, 4500);
  };

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

  const handleAdminQuickSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    setAuthLoading(true);
    try {
      await AdminAuthService.signInWithEmail(authEmail, authPassword);
      setIsAuthModalOpen(false);
      showToast("Signed in as Admin successfully! You can now upload and publish photos.");
    } catch (err: unknown) {
      setAuthError(err instanceof Error ? err.message : "Authentication failed.");
    } finally {
      setAuthLoading(false);
    }
  };

  const [bulkCategory, setBulkCategory] =
    useState<ActivityGalleryItem["category"]>("Real Safari Wildlife & Animals");
  const [bulkLocation, setBulkLocation] = useState(
    "Watamu, Tsavo & Kenyan Coast"
  );
  const [queuedFiles, setQueuedFiles] = useState<QueuedBulkPhoto[]>([]);
  const [isBulkUploading, setIsBulkUploading] = useState(false);
  const [bulkProgress, setBulkProgress] = useState<{
    current: number;
    total: number;
    percent: number;
    fileName: string;
  } | null>(null);
  const [uploadNotice, setUploadNotice] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  useEffect(() => {
    MediaService.getActivityGallery()
      .then((items) => {
        if (items && items.length > 0) {
          setActivityGallery(items);
        }
      })
      .catch(() => {});
  }, []);

  const filteredGallery = activityGallery;

  const lightboxItem =
    lightboxIdx !== null ? filteredGallery[lightboxIdx] || null : null;

  const handleQueueFiles = (files: FileList | File[] | null) => {
    if (!files || files.length === 0) return;
    const added: QueuedBulkPhoto[] = Array.from(files).map((file, i) => {
      const sizeKb = file.size / 1024;
      const sizeFormatted =
        sizeKb > 1024
          ? `${(sizeKb / 1024).toFixed(1)} MB`
          : `${Math.round(sizeKb)} KB`;
      return {
        id: `${Date.now()}-${i}-${Math.random().toString(36).substring(2, 7)}`,
        file,
        previewUrl: URL.createObjectURL(file),
        name: file.name,
        sizeFormatted,
      };
    });
    setQueuedFiles((prev) => [...prev, ...added]);
    setUploadNotice(null);
  };

  const handleRemoveQueuedFile = (id: string) => {
    setQueuedFiles((prev) => {
      const target = prev.find((item) => item.id === id);
      if (target) URL.revokeObjectURL(target.previewUrl);
      return prev.filter((item) => item.id !== id);
    });
  };

  const handleClearQueuedFiles = () => {
    queuedFiles.forEach((item) => URL.revokeObjectURL(item.previewUrl));
    setQueuedFiles([]);
    setBulkProgress(null);
    setUploadNotice(null);
  };

  const handleExecuteBulkUpload = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (queuedFiles.length === 0) {
      setUploadNotice({
        type: "error",
        text: "Please select or drag & drop at least one photograph to upload.",
      });
      return;
    }

    setIsBulkUploading(true);
    setUploadNotice(null);

    const total = queuedFiles.length;
    const newlyUploaded: ActivityGalleryItem[] = [];

    try {
      for (let i = 0; i < total; i++) {
        const item = queuedFiles[i];
        setBulkProgress({
          current: i + 1,
          total,
          percent: Math.round(((i + 1) / total) * 100),
          fileName: item.name,
        });

        const itemId = `act-tour-${Date.now()}-${i}`;
        const slotKey = `activity.${itemId}`;
        const uploadedUrl = await MediaService.uploadWebsiteImage(
          item.file,
          slotKey
        );

        const cleanFileTitle = sanitizePublicLabel(
          item.name.replace(/\.[^/.]+$/, "").replace(/[-_]+/g, " "),
          "KayArabuko Safari & Coastal Moment"
        );

        newlyUploaded.push({
          id: itemId,
          title: cleanFileTitle,
          location: bulkLocation.trim() || "Watamu & Kenyan Safaris",
          category: bulkCategory,
          caption: "", // Plain images without descriptions
          image: {
            src: uploadedUrl,
            alt: cleanFileTitle,
          },
        });
      }

      const updatedList = [...newlyUploaded, ...activityGallery];
      const saved = await MediaService.saveActivityGallery(updatedList);
      setActivityGallery(saved);

      queuedFiles.forEach((item) => URL.revokeObjectURL(item.previewUrl));
      setQueuedFiles([]);
      setBulkProgress(null);
      setUploadNotice({
        type: "success",
        text: `Published ${total} new ${
          total === 1 ? "photograph" : "photographs"
        } seamlessly to the gallery!`,
      });
      showToast(
        `Published ${total} new ${
          total === 1 ? "photograph" : "photographs"
        } to the gallery!`
      );
      setTimeout(() => {
        setIsUploadModalOpen(false);
        setUploadNotice(null);
      }, 1600);
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : "Could not upload tour photographs.";
      setUploadNotice({ type: "error", text: msg });
    } finally {
      setIsBulkUploading(false);
    }
  };

  const handleDeleteGalleryPhoto = async (itemId: string, title?: string) => {
    const cleanTitle = title || "Photograph";
    const confirmed =
      typeof window !== "undefined"
        ? window.confirm(
            `Are you sure you want to permanently remove "${cleanTitle}" from the gallery?`
          )
        : true;
    if (!confirmed) return;

    const updated = activityGallery.filter((item) => item.id !== itemId);
    setActivityGallery(updated);
    if (lightboxIdx !== null) {
      setLightboxIdx(null);
    }
    showToast(`Removed "${cleanTitle}" from gallery.`);
    try {
      await MediaService.saveActivityGallery(updated);
    } catch (err) {
      console.error("Failed to remove gallery item:", err);
      showToast("Could not remove photograph from server.", "error");
    }
  };

  return (
    <div className="min-h-screen bg-ivory text-charcoal">
      {/* HERO HEADER */}
      <section className="relative overflow-hidden bg-forest py-16 sm:py-24 text-ivory ka-topo-dark-bg border-b border-gold/25">
        <Container>
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <Link
              href="/#gallery"
              className="inline-flex items-center gap-2 rounded-full bg-green/50 border border-gold/35 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-ivory hover:bg-green hover:border-gold transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5 text-gold-light" />
              Back to Homepage
            </Link>

            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-full bg-gold/20 border border-gold/45 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-gold-light">
                <Camera className="h-3.5 w-3.5 text-gold" />
                {activityGallery.length} Curated Safari &amp; Coastal Moments
              </span>

              <button
                type="button"
                onClick={() => {
                  setUploadNotice(null);
                  setActiveModalTab("upload");
                  setIsUploadModalOpen(true);
                }}
                className="cursor-pointer inline-flex items-center gap-2 rounded-full bg-gold px-5 py-2 text-xs font-bold uppercase tracking-[0.16em] text-forest shadow-md hover:bg-gold-light transition-colors"
              >
                <ImagePlus className="h-3.5 w-3.5" />
                Bulk Upload Photos
              </button>

              <button
                type="button"
                onClick={() => setManageMode((prev) => !prev)}
                className={`cursor-pointer inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] transition-all border ${
                  manageMode
                    ? "bg-rose-700 text-white border-rose-400 shadow-md ring-2 ring-rose-400/50"
                    : "bg-green/40 text-ivory border-gold/40 hover:bg-green hover:border-gold"
                }`}
                title={
                  manageMode
                    ? "Exit photo delete mode"
                    : "Toggle delete icons on each photo"
                }
              >
                <Trash2 className="h-3.5 w-3.5 text-gold-light" />
                {manageMode ? "Exit Delete Mode" : "Manage & Delete Photos"}
              </button>
            </div>
          </div>

          <div className="max-w-4xl">
            <div className="flex items-center gap-3 mb-3">
              <span className="h-px w-8 bg-gold" />
              <p className="text-xs font-semibold uppercase tracking-[0.26em] text-gold-light">
                {activityGallerySectionHeader.eyebrow}
              </p>
            </div>
            <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-bold text-ivory leading-[1.08] tracking-tight">
              {activityGallerySectionHeader.headline}
            </h1>
            <p className="mt-5 text-base sm:text-lg text-cream/90 leading-relaxed max-w-3xl">
              {activityGallerySectionHeader.description}
            </p>
          </div>
        </Container>
      </section>

      {/* MAIN GALLERY CONTENT */}
      <section className="py-14 sm:py-20">
        <Container>
          {/* KID-FRIENDLY ACCOMMODATIONS & FAMILY PACKAGES SPOTLIGHT BANNER */}
          <div className="mb-14 rounded-ka border border-gold/45 bg-cream/35 shadow-md overflow-hidden grid grid-cols-1 lg:grid-cols-12">
              <div className="relative lg:col-span-5 min-h-[280px] sm:min-h-[340px] bg-forest">
                <SiteImage
                  image={kidFriendlyAccommodationHighlight.image}
                  slotKey={kidFriendlyAccommodationHighlight.slotKey}
                  className="h-full w-full min-h-[280px] sm:min-h-[340px]"
                  sizes="(max-width: 1024px) 100vw, 42vw"
                  tone="forest"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-forest/85 via-forest/20 to-transparent" />
                <div className="pointer-events-none absolute top-4 left-4">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-gold px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-forest shadow">
                    <Baby className="h-3.5 w-3.5" />
                    {kidFriendlyAccommodationHighlight.badge}
                  </span>
                </div>
                <div className="pointer-events-none absolute bottom-4 left-4 right-4">
                  <p className="text-xs font-semibold text-ivory">
                    Safe Kids&apos; Swimming Pools · Vetted Caregivers &amp; Nannies On Call
                  </p>
                </div>
              </div>

              <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between bg-ivory">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-gold">
                    FAMILY PACKAGES · WATAMU, MALINDI &amp; SAFARI LODGES
                  </span>
                  <h2 className="mt-2 font-display text-2xl sm:text-3xl font-bold text-green leading-snug">
                    {kidFriendlyAccommodationHighlight.title}
                  </h2>
                  <p className="mt-3 text-sm sm:text-base text-charcoal/85 leading-relaxed">
                    {kidFriendlyAccommodationHighlight.description}
                  </p>

                  <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {kidFriendlyAccommodationHighlight.highlights.map((pt) => (
                      <div
                        key={pt}
                        className="flex items-start gap-2.5 rounded-ka border border-charcoal/10 bg-cream/40 p-3 text-xs text-charcoal"
                      >
                        <CheckCircle2 className="h-4 w-4 text-green shrink-0 mt-0.5" />
                        <span>{pt}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-7 pt-5 border-t border-charcoal/15 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-2 text-xs font-semibold text-forest">
                    <ShieldCheck className="h-4 w-4 text-gold" />
                    <span>
                      Tailored for Families with Toddlers, Children &amp; Multi-Generational Groups
                    </span>
                  </div>
                  <WhatsAppButton
                    label="Inquire About Kid-Friendly Stays"
                    variant="compact"
                    context={{
                      areaOfInterest:
                        "Accommodation: Kid-Friendly Stays with Kids' Pools & Caregivers / Nannies On Call",
                      preferredLocation: "Watamu, Malindi & Coastal Family Villas",
                    }}
                  />
                </div>
              </div>
            </div>

          {/* SORTED PHOTO GRID — PLAIN IMAGES ONLY (NO DESCRIPTIONS) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-5">
            {filteredGallery.map((item, idx) => (
              <div
                key={item.id}
                onClick={() => setLightboxIdx(idx)}
                className="group relative aspect-[4/3] w-full overflow-hidden rounded-xl sm:rounded-2xl bg-forest/20 shadow-xs hover:shadow-xl transition-all duration-300 cursor-pointer border border-charcoal/10 hover:border-gold/50"
              >
                <SiteImage
                  image={item.image}
                  slotKey={`activity.${item.id}`}
                  className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  tone="forest"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Hover Zoom Camera Pill (hidden in manage mode) */}
                {!manageMode && (
                  <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-forest/85 backdrop-blur-md border border-gold/70 flex items-center justify-center text-gold-light shadow-xl transform scale-75 group-hover:scale-100 transition-transform duration-300">
                      <Camera className="h-5 w-5 sm:h-6 sm:w-6" />
                    </div>
                  </div>
                )}

                {/* Direct Delete Photo Button (Always visible in manageMode, or on hover) */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteGalleryPhoto(item.id, item.title);
                  }}
                  title="Permanently remove this photo from gallery"
                  className={`cursor-pointer absolute top-2.5 right-2.5 z-30 inline-flex items-center justify-center rounded-full bg-red-600 text-white shadow-lg hover:bg-red-700 transition-all ${
                    manageMode
                      ? "h-8 w-8 opacity-100 scale-100 ring-2 ring-white"
                      : "h-7 w-7 opacity-0 group-hover:opacity-100"
                  }`}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>

          {/* BOTTOM CTA STRIP */}
          <div className="mt-16 rounded-ka border border-gold/45 bg-forest p-8 sm:p-12 text-ivory shadow-xl flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            <div className="max-w-2xl">
              <span className="text-xs font-bold uppercase tracking-[0.22em] text-gold-light">
                CUSTOM SAFARIS, KID-FRIENDLY VILLAS &amp; COASTAL EXCURSIONS
              </span>
              <h3 className="mt-2 font-display text-3xl sm:text-4xl font-bold text-ivory leading-snug">
                Ready to Create Your Own Safari, Mambrui Quad Bike or Safari Blue Memories?
              </h3>
              <p className="mt-3 text-sm sm:text-base text-cream/85 leading-relaxed">
                Message Mrisa (&ldquo;The Shepherd&rdquo;) and our multilingual tour guides directly on WhatsApp to plan your multi-day wildlife safari, book a kid-friendly villa with kids&apos; pools and a nanny on call, ride quad bikes across Mambrui Sand Dunes, explore Marafa Hell&apos;s Kitchen, or cruise on the Safari Blue glass-bottom boat.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-4 shrink-0">
              <WhatsAppButton
                label="Chat on WhatsApp to Plan Your Trip"
                variant="gold"
                context={{
                  areaOfInterest:
                    "Custom Safari, Kid-Friendly Villa Stay, Mambrui Quad Bikes or Safari Blue Glass-Bottom Boat",
                  preferredLocation: "Watamu, Tsavo, Nakuru & Kenyan Coast",
                }}
              />
            </div>
          </div>
        </Container>
      </section>

      {/* LIGHTBOX VIEWER MODAL — PLAIN HIGH-RESOLUTION PHOTO VIEWER */}
      {lightboxItem && lightboxIdx !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-3 sm:p-6"
          onClick={() => setLightboxIdx(null)}
        >
          <div
            className="relative max-w-5xl w-full max-h-[95vh] flex flex-col rounded-2xl border border-gold/40 bg-forest/95 text-ivory overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setLightboxIdx(null)}
              className="cursor-pointer absolute top-3.5 right-3.5 z-30 inline-flex h-9 w-9 items-center justify-center rounded-full border border-gold/60 bg-forest/90 text-gold-light hover:bg-green transition-colors"
              aria-label="Close photo viewer"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full bg-black/60 overflow-hidden flex items-center justify-center">
              <SiteImage
                image={lightboxItem.image}
                slotKey={`activity.${lightboxItem.id}`}
                fit="contain"
                className="h-full w-full"
                sizes="100vw"
                tone="forest"
              />

              {filteredGallery.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() =>
                      setLightboxIdx(
                        (lightboxIdx - 1 + filteredGallery.length) %
                          filteredGallery.length
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
                      setLightboxIdx((lightboxIdx + 1) % filteredGallery.length)
                    }
                    className="cursor-pointer absolute right-3 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full border border-gold/50 bg-forest/85 text-gold-light hover:bg-gold hover:text-forest transition-colors"
                    aria-label="Next photo"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </>
              )}
            </div>

            {/* Clean Lightbox footer bar: category, location, and WhatsApp inquiry button without descriptions */}
            <div className="p-4 sm:p-5 flex flex-wrap items-center justify-between gap-3 border-t border-gold/20 bg-forest">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="rounded-full bg-gold/20 border border-gold/45 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-gold-light">
                  {lightboxItem.category}
                </span>
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-cream/90">
                  <MapPin className="h-3.5 w-3.5 text-gold" />
                  {lightboxItem.location}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() =>
                    handleDeleteGalleryPhoto(
                      lightboxItem.id,
                      lightboxItem.title
                    )
                  }
                  className="cursor-pointer inline-flex items-center gap-1.5 rounded-full border border-rose-400/60 bg-rose-950/80 hover:bg-rose-700 px-3.5 py-1.5 text-xs font-semibold text-rose-200 hover:text-white transition-colors"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span>Delete Photo</span>
                </button>

                <WhatsAppButton
                  label="Inquire on WhatsApp"
                  variant="compact"
                  context={{
                    areaOfInterest: `Tours & Travels Gallery Photograph: ${lightboxItem.category}`,
                    preferredLocation: lightboxItem.location,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SEAMLESS BULK PHOTO UPLOAD & MANAGEMENT MODAL */}
      {isUploadModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4 sm:p-6"
          onClick={() => {
            if (!isBulkUploading) setIsUploadModalOpen(false);
          }}
        >
          <div
            className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl border border-gold/50 bg-ivory p-6 sm:p-8 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-charcoal/15">
              <div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-gold/20 border border-gold/40 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.16em] text-gold-dark">
                    <Sparkles className="h-3 w-3 text-gold-dark" />
                    GALLERY PHOTO MANAGER
                  </span>
                </div>
                <h3 className="font-display text-2xl sm:text-3xl font-bold text-green mt-1">
                  Upload &amp; Manage Tour Photos
                </h3>
                <p className="text-xs text-charcoal/70 mt-1">
                  Upload multiple photos in bulk or manage and delete existing gallery images.
                </p>
              </div>
              <button
                type="button"
                disabled={isBulkUploading}
                onClick={() => setIsUploadModalOpen(false)}
                className="cursor-pointer inline-flex h-9 w-9 items-center justify-center rounded-full bg-cream text-charcoal hover:bg-gold/20 transition-colors disabled:opacity-40"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* TAB SELECTOR */}
            <div className="flex items-center gap-2 mt-4 border-b border-charcoal/15 pb-3">
              <button
                type="button"
                onClick={() => setActiveModalTab("upload")}
                className={`cursor-pointer px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-colors ${
                  activeModalTab === "upload"
                    ? "bg-green text-ivory shadow-xs"
                    : "text-charcoal/75 bg-cream/40 hover:bg-cream"
                }`}
              >
                Upload New Photos
              </button>
              <button
                type="button"
                onClick={() => setActiveModalTab("manage")}
                className={`cursor-pointer px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-colors ${
                  activeModalTab === "manage"
                    ? "bg-green text-ivory shadow-xs"
                    : "text-charcoal/75 bg-cream/40 hover:bg-cream"
                }`}
              >
                Published Photos ({activityGallery.length})
              </button>
            </div>

            {activeModalTab === "upload" ? (
              <form onSubmit={handleExecuteBulkUpload} className="mt-5 space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-charcoal mb-1.5">
                      Assign Category to All Photos
                    </label>
                    <select
                      value={bulkCategory}
                      disabled={isBulkUploading}
                      onChange={(e) =>
                        setBulkCategory(
                          e.target.value as ActivityGalleryItem["category"]
                        )
                      }
                      className="w-full rounded-ka border border-charcoal/25 bg-ivory px-3.5 py-2.5 text-sm text-charcoal focus:border-green focus:outline-none"
                    >
                      {SORTABLE_CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-charcoal mb-1.5">
                      Location (Default Tag)
                    </label>
                    <input
                      type="text"
                      value={bulkLocation}
                      disabled={isBulkUploading}
                      onChange={(e) => setBulkLocation(e.target.value)}
                      placeholder="e.g., Watamu, Tsavo, Mambrui & Amboseli"
                      className="w-full rounded-ka border border-charcoal/25 bg-ivory px-3.5 py-2.5 text-sm text-charcoal focus:border-green focus:outline-none"
                    >
                    </input>
                  </div>
                </div>

                {/* DRAG & DROP ZONE WITH DIRECT BROWSE BUTTON */}
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragOver(true);
                  }}
                  onDragLeave={() => setIsDragOver(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsDragOver(false);
                    handleQueueFiles(e.dataTransfer.files);
                  }}
                  className={`relative cursor-pointer rounded-2xl border-2 border-dashed p-6 sm:p-8 text-center transition-all ${
                    isDragOver
                      ? "border-green bg-green/10 ring-2 ring-green/20"
                      : "border-gold/60 bg-cream/40 hover:border-gold hover:bg-cream/70"
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    disabled={isBulkUploading}
                    onChange={(e) => {
                      handleQueueFiles(e.target.files);
                      e.target.value = "";
                    }}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                  />
                  <div className="flex flex-col items-center justify-center gap-2 pointer-events-none">
                    <div className="h-12 w-12 rounded-full bg-gold/20 flex items-center justify-center text-forest">
                      <Upload className="h-6 w-6 text-green" />
                    </div>
                    <div>
                      <span className="font-semibold text-forest text-sm uppercase tracking-wider">
                        Drag &amp; Drop Multiple Photographs Here
                      </span>
                      <p className="text-xs text-charcoal/75 mt-0.5">
                        Or click anywhere in this box to select 5, 10, 20+ images at once
                      </p>
                    </div>
                    <div className="mt-2 pointer-events-auto">
                      <button
                        type="button"
                        onClick={(ev) => {
                          ev.stopPropagation();
                          fileInputRef.current?.click();
                        }}
                        className="cursor-pointer inline-flex items-center gap-1.5 rounded-full bg-gold px-4 py-2 text-xs font-bold uppercase tracking-wider text-forest shadow hover:bg-gold-light transition-colors"
                      >
                        <ImagePlus className="h-3.5 w-3.5" />
                        Choose Photographs from Device
                      </button>
                    </div>
                    <span className="text-[11px] font-medium text-charcoal/60 bg-ivory/80 px-3 py-1 rounded-full border border-charcoal/15 mt-1">
                      Supports JPG, PNG, WEBP, AVIF
                    </span>
                  </div>
                </div>

                {/* QUEUED THUMBNAIL GALLERY */}
                {queuedFiles.length > 0 && (
                  <div className="rounded-xl border border-charcoal/15 bg-cream/30 p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-forest flex items-center gap-1.5">
                        <ImageIcon className="h-3.5 w-3.5 text-gold-dark" />
                        Queued for Upload ({queuedFiles.length} photos)
                      </span>
                      <button
                        type="button"
                        disabled={isBulkUploading}
                        onClick={handleClearQueuedFiles}
                        className="cursor-pointer text-xs font-semibold text-rose-700 hover:underline disabled:opacity-50"
                      >
                        Clear Queue
                      </button>
                    </div>

                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2.5 max-h-48 overflow-y-auto p-1.5">
                      {queuedFiles.map((item) => (
                        <div
                          key={item.id}
                          className="group relative aspect-square rounded-lg overflow-hidden border border-charcoal/20 bg-forest shadow-xs"
                        >
                          <img
                            src={item.previewUrl}
                            alt={item.name}
                            className="h-full w-full object-cover"
                          />
                          <button
                            type="button"
                            disabled={isBulkUploading}
                            onClick={() => handleRemoveQueuedFile(item.id)}
                            className="cursor-pointer absolute top-1 right-1 h-5 w-5 rounded-full bg-black/75 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-rose-600"
                            title="Remove from queue"
                          >
                            <X className="h-3 w-3" />
                          </button>
                          <span className="pointer-events-none absolute bottom-0 inset-x-0 bg-black/60 text-white text-[9px] px-1 py-0.5 truncate text-center">
                            {item.sizeFormatted}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* UPLOAD PROGRESS BAR */}
                {isBulkUploading && bulkProgress && (
                  <div className="rounded-xl border border-gold/50 bg-forest/90 p-4 text-ivory space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold flex items-center gap-2">
                        <RefreshCw className="h-3.5 w-3.5 animate-spin text-gold" />
                        Uploading {bulkProgress.current} of {bulkProgress.total} ({bulkProgress.percent}%)
                      </span>
                      <span className="text-gold-light text-[11px] truncate max-w-[200px]">
                        {bulkProgress.fileName}
                      </span>
                    </div>
                    <div className="w-full bg-forest rounded-full h-2.5 overflow-hidden border border-gold/40">
                      <div
                        className="bg-gold h-full transition-all duration-300"
                        style={{ width: `${bulkProgress.percent}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* NOTICES */}
                {uploadNotice && (
                  <div
                    className={`rounded-ka p-3 text-xs font-semibold flex items-center gap-2 ${
                      uploadNotice.type === "success"
                        ? "bg-forest text-ivory border border-gold"
                        : "bg-red-50 text-red-700 border border-red-200"
                    }`}
                  >
                    {uploadNotice.type === "success" ? (
                      <Check className="h-4 w-4 text-gold shrink-0" />
                    ) : (
                      <X className="h-4 w-4 text-red-600 shrink-0" />
                    )}
                    <span>{uploadNotice.text}</span>
                  </div>
                )}

                {/* MODAL FOOTER */}
                <div className="flex items-center justify-between pt-3 border-t border-charcoal/15">
                  <button
                    type="button"
                    disabled={isBulkUploading}
                    onClick={() => setIsUploadModalOpen(false)}
                    className="cursor-pointer rounded-full px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-charcoal hover:bg-cream transition-colors disabled:opacity-40"
                  >
                    Close
                  </button>

                  <button
                    type="submit"
                    disabled={isBulkUploading || queuedFiles.length === 0}
                    className="cursor-pointer inline-flex items-center gap-2 rounded-full bg-green px-6 py-3 text-xs font-bold uppercase tracking-wider text-ivory shadow-lg hover:bg-forest disabled:opacity-40 transition-all"
                  >
                    {isBulkUploading ? (
                      <>
                        <RefreshCw className="h-4 w-4 animate-spin text-gold" />
                        Uploading Photographs...
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4" />
                        Upload All {queuedFiles.length > 0 ? `(${queuedFiles.length} Photos)` : ""}
                      </>
                    )}
                  </button>
                </div>
              </form>
            ) : (
              /* TAB 2: MANAGE & DELETE EXISTING GALLERY PHOTOS */
              <div className="mt-5 space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-charcoal/70">
                    Click <strong>Delete</strong> on any photo below to permanently remove it from the gallery.
                  </p>
                  <span className="text-xs font-bold text-forest">
                    {activityGallery.length} Total Published
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-[55vh] overflow-y-auto p-1">
                  {activityGallery.map((item) => (
                    <div
                      key={item.id}
                      className="group relative rounded-xl overflow-hidden border border-charcoal/20 bg-forest shadow-xs flex flex-col"
                    >
                      <div className="relative aspect-[4/3] w-full bg-forest overflow-hidden">
                        <SiteImage
                          image={item.image}
                          slotKey={`activity.${item.id}`}
                          className="h-full w-full object-cover"
                          sizes="(max-width: 640px) 50vw, 25vw"
                          tone="forest"
                        />
                      </div>
                      <div className="p-2.5 bg-ivory flex flex-col justify-between flex-1 border-t border-charcoal/10">
                        <p className="text-[11px] font-semibold text-charcoal line-clamp-1">
                          {item.title}
                        </p>
                        <div className="mt-2 flex items-center justify-between gap-1">
                          <span className="text-[9px] font-bold uppercase tracking-wider text-gold-dark truncate">
                            {item.category.split(" ")[0]}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              handleDeleteGalleryPhoto(item.id, item.title)
                            }
                            className="cursor-pointer inline-flex items-center gap-1 rounded-full bg-rose-600 hover:bg-rose-700 text-white px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider transition-colors shadow-xs"
                          >
                            <Trash2 className="h-3 w-3" />
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-end pt-3 border-t border-charcoal/15">
                  <button
                    type="button"
                    onClick={() => setIsUploadModalOpen(false)}
                    className="cursor-pointer rounded-full bg-forest px-5 py-2 text-xs font-semibold uppercase tracking-wider text-ivory hover:bg-green transition-colors"
                  >
                    Done
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* FLOATING TOAST NOTIFICATION */}
      {toastNotice && (
        <div
          role="status"
          className={`fixed bottom-6 right-6 z-50 flex max-w-md items-center gap-2.5 rounded-full px-5 py-3 text-xs font-bold shadow-2xl animate-modal-enter ${
            toastNotice.type === "error"
              ? "bg-rose-950 text-ivory border border-rose-400"
              : "bg-forest text-ivory border border-gold"
          }`}
        >
          {toastNotice.type === "error" ? (
            <X className="h-4 w-4 text-rose-400 shrink-0" />
          ) : (
            <Check className="h-4 w-4 text-gold shrink-0" />
          )}
          <span>{toastNotice.text}</span>
        </div>
      )}

      {/* QUICK ADMIN AUTH MODAL */}
      {isAuthModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4"
          onClick={() => setIsAuthModalOpen(false)}
        >
          <div
            className="relative w-full max-w-md rounded-2xl border border-gold/50 bg-ivory p-6 sm:p-8 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-charcoal/15">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-forest text-gold-light flex items-center justify-center">
                  <Lock className="h-4 w-4" />
                </div>
                <h3 className="font-display text-xl font-bold text-green">
                  Admin Sign In
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAuthModalOpen(false)}
                className="cursor-pointer inline-flex h-8 w-8 items-center justify-center rounded-full bg-cream text-charcoal hover:bg-gold/20 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <p className="mt-3 text-xs text-charcoal/80 leading-relaxed">
              Sign in with your administrator credentials to seamlessly upload and publish photographs to the gallery.
            </p>

            <form onSubmit={handleAdminQuickSignIn} className="mt-4 space-y-3.5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-charcoal mb-1">
                  Admin Email
                </label>
                <input
                  type="email"
                  required
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                  placeholder="admin@kayarabuko.com"
                  className="w-full rounded-ka border border-charcoal/25 bg-ivory px-3.5 py-2 text-sm text-charcoal focus:border-green focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-charcoal mb-1">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-ka border border-charcoal/25 bg-ivory px-3.5 py-2 text-sm text-charcoal focus:border-green focus:outline-none"
                />
              </div>

              {authError && (
                <div className="rounded-ka bg-red-50 border border-red-200 p-2.5 text-xs font-semibold text-red-700">
                  {authError}
                </div>
              )}

              <div className="flex items-center justify-between pt-3">
                <Link
                  href="/admin/login"
                  className="text-xs text-forest hover:text-gold font-semibold underline"
                >
                  Go to Admin Portal
                </Link>
                <button
                  type="submit"
                  disabled={authLoading}
                  className="cursor-pointer inline-flex items-center gap-2 rounded-full bg-forest px-5 py-2 text-xs font-bold uppercase tracking-wider text-ivory hover:bg-green disabled:opacity-50 transition-colors shadow"
                >
                  {authLoading ? (
                    <>
                      <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    "Sign In & Upload"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
