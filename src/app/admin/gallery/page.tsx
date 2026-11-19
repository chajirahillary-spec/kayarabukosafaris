"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  MediaService,
  SITE_IMAGE_SLOTS,
  isFirebaseStorageUrl,
  type SiteImageOverrides,
  type BrandMediaSettings,
} from "@/lib/firebase/mediaService";
import { initialPublishedPosters } from "@/data/content";
import type { PublishedPoster } from "@/lib/types";
import {
  Check,
  Upload,
  RotateCcw,
  Save,
  Search,
  Loader2,
  ExternalLink,
  Image as ImageIcon,
  CloudCheck,
  AlertCircle,
  Trash2,
  Plus,
} from "lucide-react";

export default function AdminGalleryPage() {
  const [overrides, setOverrides] = useState<SiteImageOverrides>({});
  const [brandSettings, setBrandSettings] = useState<BrandMediaSettings>({
    logoUrl: "/images/kayarabuko-logo-transparent.png",
    logoDarkUrl: "/images/kayarabuko-logo-light.png",
  });
  const [selectedSection, setSelectedSection] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [loading, setLoading] = useState(true);

  // Published Posters Manager state (supports Mass / Bulk Poster Upload)
  const [posters, setPosters] = useState<PublishedPoster[]>(
    initialPublishedPosters
  );
  const [queuedPosters, setQueuedPosters] = useState<
    Array<{ file: File; title: string; category: string }>
  >([]);
  const [posterSubtitle, setPosterSubtitle] = useState("");
  const [posterCategory, setPosterCategory] = useState("Excursions");
  const [posterDesc, setPosterDesc] = useState("");
  const [replaceExistingPosters, setReplaceExistingPosters] = useState(false);
  const [uploadingPoster, setUploadingPoster] = useState(false);
  const [posterProgress, setPosterProgress] = useState<{
    done: number;
    total: number;
    currentName: string;
  } | null>(null);

  // Per-card & global action states
  const [savingKey, setSavingKey] = useState<string | null>(null);
  const [uploadingKey, setUploadingKey] = useState<string | null>(null);
  const [justSavedKey, setJustSavedKey] = useState<string | null>(null);
  const [savingAll, setSavingAll] = useState(false);
  const [saveAllProgress, setSaveAllProgress] = useState<{
    done: number;
    total: number;
    currentLabel: string;
  } | null>(null);

  const [toast, setToast] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const sections = Array.from(
    new Set(SITE_IMAGE_SLOTS.map((slot) => slot.section))
  );

  useEffect(() => {
    async function load() {
      setLoading(true);
      const [loadedOverrides, loadedBrand, loadedPosters] = await Promise.all([
        MediaService.getSiteImageOverrides(),
        MediaService.getBrandMedia(),
        MediaService.getPublishedPosters(),
      ]);
      setOverrides(loadedOverrides);
      setPosters(loadedPosters);
      if (loadedBrand) {
        setBrandSettings((prev) => ({ ...prev, ...loadedBrand }));
      }
      setLoading(false);
    }
    load();
  }, []);

  const showNotification = (
    message: string,
    type: "success" | "error" = "success"
  ) => {
    setToast({ type, message });
    setTimeout(() => {
      setToast((prev) => (prev?.message === message ? null : prev));
    }, 5000);
  };

  const handleUrlChange = (key: string, value: string) => {
    setOverrides((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleQueuePosterFiles = (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    const added = Array.from(fileList).map((file) => {
      const autoTitle = file.name
        .replace(/\.[^/.]+$/, "")
        .replace(/[-_]+/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase());
      return {
        file,
        title: autoTitle,
        category: posterCategory,
      };
    });
    setQueuedPosters((prev) => [...prev, ...added]);
  };

  const handleAddPoster = async (e: React.FormEvent) => {
    e.preventDefault();
    if (queuedPosters.length === 0) {
      showNotification(
        "Please select one or more poster image files first.",
        "error"
      );
      return;
    }
    setUploadingPoster(true);
    try {
      const uploadedBatch: PublishedPoster[] = [];
      const newOverrides: SiteImageOverrides = {};
      const total = queuedPosters.length;

      for (let i = 0; i < queuedPosters.length; i++) {
        const item = queuedPosters[i];
        setPosterProgress({
          done: i + 1,
          total,
          currentName: item.title || item.file.name,
        });

        const posterId = `poster-${Date.now()}-${i}`;
        const storageUrl = await MediaService.uploadWebsiteImage(
          item.file,
          `poster.${posterId}`
        );
        newOverrides[`poster.${posterId}`] = storageUrl;

        uploadedBatch.push({
          id: posterId,
          title: item.title.trim() || item.file.name.replace(/\.[^/.]+$/, ""),
          subtitle:
            posterSubtitle.trim() ||
            "Managed by Kaya Experience Ltd · Watamu, Timboni Stage",
          category: item.category || posterCategory,
          dateLabel: "Published Poster",
          description:
            posterDesc.trim() ||
            "Official poster published by KayArabuko / Kaya Experience Ltd. Contacts: +254 728 560303 / +254 712 863538.",
          image: {
            src: storageUrl,
            alt: item.title.trim() || "KayArabuko Published Poster",
          },
        });
      }

      const base = replaceExistingPosters ? [] : posters;
      const updated = [...uploadedBatch, ...base];
      const saved = await MediaService.savePublishedPosters(updated);
      setPosters(saved);
      setOverrides((prev) => ({
        ...prev,
        ...newOverrides,
      }));
      setQueuedPosters([]);
      setPosterSubtitle("");
      setPosterDesc("");
      showNotification(
        `Mass uploaded ${uploadedBatch.length} poster${
          uploadedBatch.length > 1 ? "s" : ""
        } to Firebase Storage and published to the website!`
      );
    } catch (err: unknown) {
      showNotification(
        err instanceof Error ? err.message : "Failed to upload posters.",
        "error"
      );
    } finally {
      setUploadingPoster(false);
      setPosterProgress(null);
    }
  };

  const handleDeletePoster = async (posterId: string, title: string) => {
    const ok =
      typeof window !== "undefined"
        ? window.confirm(`Permanently remove poster "${title}"?`)
        : true;
    if (!ok) return;

    try {
      const updated = posters.filter((p) => p.id !== posterId);
      const saved = await MediaService.savePublishedPosters(updated);
      setPosters(saved);
      setOverrides((prev) => {
        const next = { ...prev };
        delete next[`poster.${posterId}`];
        return next;
      });
      showNotification(`Removed poster "${title}".`);
    } catch {
      showNotification(`Could not remove poster "${title}".`, "error");
    }
  };

  const handleClearAllPosters = async () => {
    const ok =
      typeof window !== "undefined"
        ? window.confirm("Are you sure you want to remove all published posters?")
        : true;
    if (!ok) return;

    try {
      const saved = await MediaService.savePublishedPosters([]);
      setPosters(saved);
      showNotification("Removed all published posters.");
    } catch {
      showNotification("Could not clear posters.", "error");
    }
  };

  /**
   * Individual Card "Save" button:
   * Uploads the card's image URL to Firebase Storage (`legaprimed.firebasestorage.app`)
   * if not already hosted there, updates the input box with the Firebase Storage URL,
   * and persists to Firestore (`organizations/kayarabuko-safaris/settings/siteImages`).
   */
  const handleSaveSingle = async (
    key: string,
    label: string,
    defaultUrl: string
  ) => {
    const candidateUrl = (overrides[key] ?? defaultUrl).trim();
    if (!candidateUrl) {
      showNotification(`Please provide a valid URL for "${label}".`, "error");
      return;
    }

    setSavingKey(key);
    try {
      const { storageUrl } = await MediaService.saveSingleSlotToFirebase(
        key,
        candidateUrl,
        overrides
      );
      setOverrides((prev) => ({
        ...prev,
        [key]: storageUrl,
      }));
      setJustSavedKey(key);
      setTimeout(() => {
        setJustSavedKey((prev) => (prev === key ? null : prev));
      }, 3500);
      showNotification(
        `Uploaded & saved "${label}" to Firebase Storage and Firestore!`
      );
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : `Failed to save "${label}" to Firebase Storage.`;
      showNotification(msg, "error");
    } finally {
      setSavingKey(null);
    }
  };

  const handleResetSingle = async (
    key: string,
    label: string,
    defaultUrl: string
  ) => {
    setSavingKey(key);
    try {
      const { storageUrl } = await MediaService.saveSingleSlotToFirebase(
        key,
        defaultUrl,
        overrides
      );
      setOverrides((prev) => ({
        ...prev,
        [key]: storageUrl,
      }));
      showNotification(`Reset "${label}" and synced to Firebase Storage.`);
    } catch {
      const next = { ...overrides };
      delete next[key];
      setOverrides(next);
      await MediaService.saveSiteImageOverrides(next);
      showNotification(`Reset "${label}" to default photograph.`);
    } finally {
      setSavingKey(null);
    }
  };

  /**
   * Individual Card "Upload Photo" file picker:
   * Uploads selected local file directly to Firebase Storage (`kayarabuko_website/...`)
   * and saves the download URL to Firestore & disk immediately.
   */
  const handleFileUpload = async (
    key: string,
    label: string,
    file: File | undefined
  ) => {
    if (!file) return;
    setUploadingKey(key);
    try {
      const uploadedStorageUrl = await MediaService.uploadWebsiteImage(
        file,
        key
      );
      setOverrides((prev) => ({
        ...prev,
        [key]: uploadedStorageUrl,
      }));
      setJustSavedKey(key);
      setTimeout(() => {
        setJustSavedKey((prev) => (prev === key ? null : prev));
      }, 3500);
      showNotification(
        `Uploaded "${file.name}" to Firebase Storage and saved for "${label}"!`
      );
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : "Could not upload image file to Firebase Storage.";
      showNotification(msg, "error");
    } finally {
      setUploadingKey(null);
    }
  };

  /**
   * Top "Save All Image Changes" button:
   * Ensures every website image slot is uploaded to Firebase Storage (`legaprimed.firebasestorage.app`)
   * and saves the complete map to Firestore (`organizations/kayarabuko-safaris/settings/siteImages`) and disk.
   */
  const handleSaveAll = async () => {
    setSavingAll(true);
    try {
      const nextOverrides: SiteImageOverrides = { ...overrides };
      const urlCache = new Map<string, string>();
      const total = SITE_IMAGE_SLOTS.length;

      for (let i = 0; i < SITE_IMAGE_SLOTS.length; i++) {
        const slot = SITE_IMAGE_SLOTS[i];
        const candidateUrl = (
          nextOverrides[slot.key] ?? slot.defaultUrl
        ).trim();

        if (isFirebaseStorageUrl(candidateUrl)) {
          nextOverrides[slot.key] = candidateUrl;
          continue;
        }

        setSaveAllProgress({
          done: i + 1,
          total,
          currentLabel: slot.label,
        });

        if (urlCache.has(candidateUrl)) {
          nextOverrides[slot.key] = urlCache.get(candidateUrl)!;
          continue;
        }

        const storageUrl = await MediaService.ensureInFirebaseStorage(
          candidateUrl,
          slot.key
        );
        urlCache.set(candidateUrl, storageUrl);
        nextOverrides[slot.key] = storageUrl;
      }

      setSaveAllProgress({
        done: total,
        total,
        currentLabel: "Syncing all 46 images to Firestore...",
      });

      const [savedOverrides] = await Promise.all([
        MediaService.saveSiteImageOverrides(nextOverrides),
        MediaService.saveBrandMedia(brandSettings),
      ]);

      setOverrides(savedOverrides);

      showNotification(
        `All ${total} website images uploaded to Firebase Storage and saved to Firestore!`
      );
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : "Failed to save all images to Firebase Storage.";
      showNotification(msg, "error");
    } finally {
      setSavingAll(false);
      setSaveAllProgress(null);
    }
  };

  const filteredSlots = SITE_IMAGE_SLOTS.filter((slot) => {
    if (selectedSection !== "all" && slot.section !== selectedSection) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        slot.label.toLowerCase().includes(q) ||
        slot.section.toLowerCase().includes(q) ||
        slot.key.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const storageBackedCount = SITE_IMAGE_SLOTS.filter((slot) =>
    isFirebaseStorageUrl(overrides[slot.key] ?? slot.defaultUrl)
  ).length;

  return (
    <div className="space-y-8 pb-20">
      {/* Floating Bottom-Right Toast Notification (Always visible regardless of scroll position) */}
      {toast && (
        <div
          role="status"
          className={`fixed bottom-6 right-6 z-50 flex max-w-md items-center gap-3 rounded-ka border px-4 py-3.5 text-xs font-semibold shadow-2xl animate-modal-enter ${
            toast.type === "error"
              ? "border-rose-300 bg-rose-950 text-ivory"
              : "border-gold bg-forest text-ivory"
          }`}
        >
          {toast.type === "error" ? (
            <AlertCircle className="h-4 w-4 text-rose-400 shrink-0" />
          ) : (
            <Check className="h-4 w-4 text-gold-light shrink-0" />
          )}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">
              Firebase Storage &amp; Firestore Media Manager
            </p>
            <span className="inline-flex items-center gap-1 rounded-ka bg-green/15 px-2.5 py-0.5 text-[10px] font-semibold text-forest">
              <CloudCheck className="h-3.5 w-3.5 text-green" />
              <span>
                {storageBackedCount} / {SITE_IMAGE_SLOTS.length} in Firebase
                Storage
              </span>
            </span>
          </div>
          <h1 className="font-display mt-1 text-3xl sm:text-4xl text-green">
            Website Images — Quick Edit
          </h1>
          <p className="mt-1 text-xs text-charcoal/70">
            Upload a photo from your device or paste an image URL on any card
            and click <strong>Save</strong> (or{" "}
            <strong>Save All Image Changes</strong>) to store in Firebase
            Storage (<code>legaprimed.firebasestorage.app</code>) and sync live.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            href="/gallery"
            className="inline-flex items-center gap-1.5 rounded-ka border border-gold/50 bg-gold/15 px-3.5 py-2.5 text-xs font-semibold text-forest hover:bg-gold/30 transition-colors"
          >
            <ImageIcon className="h-3.5 w-3.5 text-gold-dark" />
            <span>Tours &amp; Travels Photo Gallery</span>
          </Link>

          <Link
            href="/"
            target="_blank"
            className="inline-flex items-center gap-1.5 rounded-ka border border-charcoal/25 bg-ivory px-3.5 py-2.5 text-xs font-semibold text-charcoal hover:border-gold transition-colors"
          >
            <span>Preview Live Site</span>
            <ExternalLink className="h-3.5 w-3.5 text-forest" />
          </Link>

          <button
            type="button"
            onClick={handleSaveAll}
            disabled={savingAll}
            className="cursor-pointer inline-flex items-center gap-2 rounded-ka bg-green px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-ivory hover:bg-forest transition-colors shadow-sm disabled:opacity-60"
          >
            {savingAll ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin text-gold-light" />
                <span>
                  {saveAllProgress
                    ? `Uploading (${saveAllProgress.done}/${saveAllProgress.total})...`
                    : "Uploading to Storage..."}
                </span>
              </>
            ) : (
              <>
                <Save className="h-4 w-4 text-gold-light" />
                <span>Save All Image Changes</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Live Batch Progress Bar when "Save All Image Changes" is running */}
      {savingAll && saveAllProgress && (
        <div className="rounded-ka border border-gold/50 bg-cream/60 p-4 space-y-2 text-xs">
          <div className="flex items-center justify-between font-semibold text-forest">
            <span>
              Uploading &amp; syncing to Firebase Storage:{" "}
              <strong>{saveAllProgress.currentLabel}</strong>
            </span>
            <span>
              {saveAllProgress.done} / {saveAllProgress.total}
            </span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-charcoal/10">
            <div
              className="h-full bg-green transition-all duration-200"
              style={{
                width: `${Math.round(
                  (saveAllProgress.done / saveAllProgress.total) * 100
                )}%`,
              }}
            />
          </div>
        </div>
      )}

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-y border-charcoal/15 py-4 text-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-charcoal/45" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search section or image (e.g. Hero, Maasai, Arabuko, Shimba)..."
            className="w-full rounded-ka border border-charcoal/25 bg-ivory pl-9 pr-3.5 py-2 text-xs text-charcoal focus:border-green focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 font-semibold">
          <label
            htmlFor="section-filter"
            className="text-charcoal/70 uppercase tracking-wider whitespace-nowrap"
          >
            Section:
          </label>
          <select
            id="section-filter"
            value={selectedSection}
            onChange={(e) => setSelectedSection(e.target.value)}
            className="rounded-ka border border-charcoal/25 bg-ivory px-3 py-2 text-xs text-charcoal focus:border-green focus:outline-none"
          >
            <option value="all">
              All Website Sections ({SITE_IMAGE_SLOTS.length} Images)
            </option>
            {sections.map((sec) => (
              <option key={sec} value={sec}>
                {sec}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Section-by-Section Image Cards Grid */}
      {loading ? (
        <div className="flex h-48 items-center justify-center gap-2.5 text-xs text-charcoal/70">
          <Loader2 className="h-5 w-5 animate-spin text-green" />
          <span>Loading website images from Firestore...</span>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredSlots.map((slot) => {
            const customUrl = overrides[slot.key];
            const activeUrl = customUrl || slot.defaultUrl;
            const inFirebaseStorage = isFirebaseStorageUrl(activeUrl);
            const isSavingThis = savingKey === slot.key;
            const isUploadingThis = uploadingKey === slot.key;
            const isJustSaved = justSavedKey === slot.key;

            return (
              <div
                key={slot.key}
                className="rounded-ka border border-charcoal/15 bg-ivory overflow-hidden shadow-xs flex flex-col justify-between"
              >
                <div>
                  {/* Live Image Preview */}
                  <div className="relative aspect-[16/10] w-full bg-charcoal/10 overflow-hidden">
                    <Image
                      src={activeUrl}
                      alt={slot.label}
                      fill
                      unoptimized
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30 pointer-events-none" />

                    <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between gap-2">
                      <span className="rounded-ka bg-forest/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-gold-light">
                        {slot.section.replace(/^Section \d+:\s*/, "")}
                      </span>
                      {inFirebaseStorage ? (
                        <span className="inline-flex items-center gap-1 rounded-ka bg-green/95 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-ivory">
                          <CloudCheck className="h-3 w-3 text-gold-light" />
                          <span>Firebase Storage</span>
                        </span>
                      ) : (
                        <span className="rounded-ka bg-gold/90 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-forest">
                          External URL
                        </span>
                      )}
                    </div>

                    <div className="absolute bottom-2.5 left-2.5 right-2.5">
                      <p className="font-display text-lg leading-tight text-ivory drop-shadow-xs">
                        {slot.label}
                      </p>
                    </div>
                  </div>

                  {/* URL Input & Upload Controls */}
                  <div className="p-4 space-y-3 text-xs">
                    <div>
                      <label className="block text-[10px] font-semibold uppercase tracking-wider text-charcoal/70 mb-1">
                        Image URL (Paste link or upload photo below)
                      </label>
                      <input
                        type="text"
                        value={customUrl ?? slot.defaultUrl}
                        onChange={(e) =>
                          handleUrlChange(slot.key, e.target.value)
                        }
                        placeholder="https://firebasestorage.googleapis.com/..."
                        className="w-full rounded-ka border border-charcoal/25 bg-cream/20 px-2.5 py-2 font-mono text-[11px] text-charcoal focus:border-green focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Action Footer */}
                <div className="px-4 pb-4 pt-1 flex flex-wrap items-center justify-between gap-2">
                  <label className="cursor-pointer inline-flex items-center gap-1.5 rounded-ka border border-forest/35 bg-forest/5 px-3 py-1.5 text-[11px] font-semibold text-forest hover:bg-forest hover:text-ivory transition-colors">
                    {isUploadingThis ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Upload className="h-3.5 w-3.5" />
                    )}
                    <span>
                      {isUploadingThis ? "Uploading..." : "Upload Photo"}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      disabled={isUploadingThis || isSavingThis}
                      onChange={(e) =>
                        handleFileUpload(
                          slot.key,
                          slot.label,
                          e.target.files?.[0]
                        )
                      }
                    />
                  </label>

                  <div className="flex items-center gap-1.5">
                    {customUrl && customUrl !== slot.defaultUrl && (
                      <button
                        type="button"
                        disabled={isSavingThis || isUploadingThis}
                        onClick={() =>
                          handleResetSingle(
                            slot.key,
                            slot.label,
                            slot.defaultUrl
                          )
                        }
                        title="Reset to default photograph"
                        className="cursor-pointer inline-flex items-center gap-1 rounded-ka border border-charcoal/20 px-2.5 py-1.5 text-[11px] font-semibold text-charcoal/70 hover:bg-cream hover:text-charcoal transition-colors disabled:opacity-50"
                      >
                        <RotateCcw className="h-3 w-3" />
                        <span>Reset</span>
                      </button>
                    )}

                    <button
                      type="button"
                      disabled={isSavingThis || isUploadingThis}
                      onClick={() =>
                        handleSaveSingle(slot.key, slot.label, slot.defaultUrl)
                      }
                      className={`cursor-pointer inline-flex items-center gap-1.5 rounded-ka px-3.5 py-1.5 text-[11px] font-semibold transition-colors disabled:opacity-60 ${
                        isJustSaved
                          ? "bg-forest text-gold-light"
                          : "bg-green text-ivory hover:bg-forest"
                      }`}
                    >
                      {isSavingThis ? (
                        <>
                          <Loader2 className="h-3 w-3 animate-spin" />
                          <span>Saving...</span>
                        </>
                      ) : isJustSaved ? (
                        <>
                          <Check className="h-3 w-3 text-gold-light" />
                          <span>Saved ✓</span>
                        </>
                      ) : (
                        <>
                          <Save className="h-3 w-3" />
                          <span>Save</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Published Posters Mass Upload & Management Section */}
      <div
        id="posters-manager"
        className="border border-gold/40 bg-ivory p-6 rounded-ka space-y-5 shadow-xs"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-charcoal/15 pb-4">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gold">
              Kaya Experience Ltd · Mass Campaign &amp; Event Poster Uploader
            </p>
            <h2 className="font-display text-2xl sm:text-3xl text-green">
              Published Posters — Mass Upload &amp; Manage ({posters.length}{" "}
              Posters)
            </h2>
            <p className="text-xs text-charcoal/70 mt-0.5">
              Select multiple poster files at once to bulk-upload them directly
              to Firebase Storage (<code>legaprimed.firebasestorage.app</code>)
              and publish them live to the <strong>#posters</strong> section.
            </p>
          </div>

          {posters.length > 0 && (
            <button
              type="button"
              onClick={handleClearAllPosters}
              className="cursor-pointer shrink-0 rounded-ka border border-rose-300 bg-rose-50 px-3.5 py-2 text-xs font-semibold text-rose-700 hover:bg-rose-100 transition-colors"
            >
              Clear All Posters ({posters.length})
            </button>
          )}
        </div>

        <form
          onSubmit={handleAddPoster}
          className="rounded-ka border border-charcoal/15 bg-cream/30 p-5 space-y-4 text-xs"
        >
          {/* Multi-file picker dropzone */}
          <label className="cursor-pointer flex flex-col items-center justify-center gap-2 rounded-ka border-2 border-dashed border-gold/60 bg-ivory p-6 text-center hover:border-green hover:bg-cream/40 transition-colors">
            <Upload className="h-6 w-6 text-green" />
            <div>
              <span className="font-semibold text-forest uppercase tracking-wider">
                Click to Select Multiple Poster Images (Mass Upload)
              </span>
              <p className="text-[11px] text-charcoal/70 mt-0.5">
                Hold <strong>Ctrl / Shift</strong> (or select multiple on
                mobile) to pick 5, 10, or 20+ posters in one go.
              </p>
            </div>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => handleQueuePosterFiles(e.target.files)}
              className="hidden"
            />
          </label>

          {/* Queued Files Preview & Individual Title Editor */}
          {queuedPosters.length > 0 && (
            <div className="rounded-ka border border-charcoal/15 bg-ivory p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-forest uppercase tracking-wider text-[11px]">
                  Batch Queue Ready ({queuedPosters.length} Poster
                  {queuedPosters.length > 1 ? "s" : ""} Selected)
                </span>
                <button
                  type="button"
                  onClick={() => setQueuedPosters([])}
                  className="cursor-pointer text-[11px] font-semibold text-rose-700 hover:underline"
                >
                  Clear Selected Queue
                </button>
              </div>

              <div className="max-h-56 overflow-y-auto space-y-2 pr-1">
                {queuedPosters.map((qItem, idx) => (
                  <div
                    key={`${qItem.file.name}-${idx}`}
                    className="grid gap-2 sm:grid-cols-12 items-center rounded-ka border border-charcoal/10 bg-cream/20 p-2"
                  >
                    <div className="sm:col-span-3 truncate font-mono text-[11px] text-charcoal/70">
                      {idx + 1}. {qItem.file.name}
                    </div>
                    <div className="sm:col-span-5">
                      <input
                        type="text"
                        value={qItem.title}
                        onChange={(e) => {
                          const val = e.target.value;
                          setQueuedPosters((prev) =>
                            prev.map((item, i) =>
                              i === idx ? { ...item, title: val } : item
                            )
                          );
                        }}
                        placeholder="Poster title"
                        className="w-full rounded-ka border border-charcoal/20 bg-ivory px-2.5 py-1.5 text-xs text-charcoal"
                      />
                    </div>
                    <div className="sm:col-span-3">
                      <select
                        value={qItem.category}
                        onChange={(e) => {
                          const val = e.target.value;
                          setQueuedPosters((prev) =>
                            prev.map((item, i) =>
                              i === idx ? { ...item, category: val } : item
                            )
                          );
                        }}
                        className="w-full rounded-ka border border-charcoal/20 bg-ivory px-2 py-1.5 text-xs text-charcoal"
                      >
                        <option value="Excursions">Excursions</option>
                        <option value="Accommodation">Accommodation</option>
                        <option value="Kaya Roots Africa">
                          Kaya Roots Africa
                        </option>
                        <option value="Marine & Creek">Marine &amp; Creek</option>
                        <option value="Cultural & Conservation">
                          Cultural &amp; Conservation
                        </option>
                      </select>
                    </div>
                    <div className="sm:col-span-1 flex justify-end">
                      <button
                        type="button"
                        onClick={() =>
                          setQueuedPosters((prev) =>
                            prev.filter((_, i) => i !== idx)
                          )
                        }
                        className="cursor-pointer rounded-ka border border-rose-200 px-2 py-1 text-[10px] font-semibold text-rose-700 hover:bg-rose-50"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Shared Batch Metadata & Submit */}
          <div className="grid gap-4 sm:grid-cols-12 items-end">
            <div className="sm:col-span-3">
              <label className="block text-[10px] font-semibold uppercase tracking-wider text-charcoal mb-1">
                Default Category for Batch
              </label>
              <select
                value={posterCategory}
                onChange={(e) => {
                  const cat = e.target.value;
                  setPosterCategory(cat);
                  setQueuedPosters((prev) =>
                    prev.map((q) => ({ ...q, category: cat }))
                  );
                }}
                className="w-full rounded-ka border border-charcoal/25 bg-ivory px-2.5 py-2 text-xs text-charcoal"
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

            <div className="sm:col-span-4">
              <label className="block text-[10px] font-semibold uppercase tracking-wider text-charcoal mb-1">
                Shared Subtitle / Contact Note
              </label>
              <input
                type="text"
                value={posterSubtitle}
                onChange={(e) => setPosterSubtitle(e.target.value)}
                placeholder="Managed by Kaya Experience Ltd · Watamu, Timboni Stage"
                className="w-full rounded-ka border border-charcoal/25 bg-ivory px-3 py-2 text-xs text-charcoal"
              />
            </div>

            <div className="sm:col-span-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-charcoal/85">
                <input
                  type="checkbox"
                  checked={replaceExistingPosters}
                  onChange={(e) => setReplaceExistingPosters(e.target.checked)}
                  className="rounded border-charcoal/30 text-green focus:ring-green"
                />
                <span>Replace existing posters</span>
              </label>

              <button
                type="submit"
                disabled={uploadingPoster || queuedPosters.length === 0}
                className="cursor-pointer inline-flex items-center justify-center gap-1.5 rounded-ka bg-green px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-ivory hover:bg-forest transition-colors disabled:opacity-60"
              >
                {uploadingPoster ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    <span>
                      Uploading{" "}
                      {posterProgress
                        ? `${posterProgress.done}/${posterProgress.total}`
                        : "Batch"}
                      ...
                    </span>
                  </>
                ) : (
                  <>
                    <Plus className="h-3.5 w-3.5" />
                    <span>
                      Mass Upload{" "}
                      {queuedPosters.length > 0
                        ? `${queuedPosters.length} Poster${
                            queuedPosters.length > 1 ? "s" : ""
                          }`
                        : "Posters"}
                    </span>
                  </>
                )}
              </button>
            </div>
          </div>

          {uploadingPoster && posterProgress && (
            <div className="rounded-ka border border-gold/50 bg-ivory p-3 space-y-1.5">
              <div className="flex items-center justify-between font-semibold text-forest">
                <span>
                  Uploading to Firebase Storage:{" "}
                  <strong>{posterProgress.currentName}</strong>
                </span>
                <span>
                  {posterProgress.done} / {posterProgress.total}
                </span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-charcoal/10">
                <div
                  className="h-full bg-green transition-all duration-200"
                  style={{
                    width: `${Math.round(
                      (posterProgress.done / posterProgress.total) * 100
                    )}%`,
                  }}
                />
              </div>
            </div>
          )}
        </form>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {posters.map((p) => {
            const imgSrc =
              overrides[`poster.${p.id}`] ||
              p.image.src ||
              "/images/kayarabuko-logo-transparent.png";
            return (
              <div
                key={p.id}
                className="rounded-ka border border-charcoal/15 bg-ivory overflow-hidden flex flex-col justify-between text-xs shadow-xs"
              >
                <div className="relative aspect-[3/4] w-full bg-ivory overflow-hidden">
                  <Image
                    src={imgSrc}
                    alt={p.title || "Published Poster"}
                    fill
                    unoptimized
                    className="object-cover"
                  />
                </div>
                <div className="px-3 py-2 flex items-center justify-between border-t border-charcoal/10 bg-cream/20">
                  <span className="text-[10px] text-forest font-semibold">
                    Live in #posters
                  </span>
                  <button
                    type="button"
                    onClick={() => handleDeletePoster(p.id, p.title)}
                    className="cursor-pointer inline-flex items-center gap-1 rounded-ka border border-rose-300 px-2 py-1 text-[10px] font-semibold text-rose-700 hover:bg-rose-50"
                  >
                    <Trash2 className="h-3 w-3" />
                    <span>Remove</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Brand Logo Configuration Card */}
      <div className="border border-charcoal/15 bg-ivory p-6 rounded-ka space-y-4">
        <div className="flex items-center gap-2">
          <ImageIcon className="h-4 w-4 text-forest" />
          <h2 className="font-display text-2xl text-green">
            Official Transparent Brand Logo Settings
          </h2>
        </div>
        <p className="text-xs text-charcoal/70">
          Your transparent KayArabuko logos (for light/ivory and dark forest
          sections) are uploaded to Firebase Storage and configured across the
          platform.
        </p>

        <div className="grid gap-4 sm:grid-cols-2 text-xs">
          <div className="rounded-ka border border-charcoal/15 bg-ivory p-4 space-y-2">
            <p className="font-semibold text-forest uppercase tracking-wider text-[10px]">
              Light / Ivory Background Logo (Transparent PNG)
            </p>
            <div className="flex h-20 items-center justify-center rounded-ka bg-ivory border border-charcoal/10 p-3">
              <Image
                src={
                  brandSettings.logoUrl ||
                  "/images/kayarabuko-logo-transparent.png"
                }
                alt="Light Mode Logo"
                width={200}
                height={60}
                unoptimized
                className="max-h-14 w-auto object-contain"
              />
            </div>
          </div>

          <div className="rounded-ka border border-charcoal/15 bg-ivory p-4 space-y-2">
            <p className="font-semibold text-forest uppercase tracking-wider text-[10px]">
              Dark / Forest Background Logo (Transparent PNG)
            </p>
            <div className="flex h-20 items-center justify-center rounded-ka bg-forest p-3">
              <Image
                src={
                  brandSettings.logoDarkUrl ||
                  "/images/kayarabuko-logo-light.png"
                }
                alt="Dark Mode Logo"
                width={200}
                height={60}
                unoptimized
                className="max-h-14 w-auto object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
