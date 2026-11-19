"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
  useMemo,
} from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { SAVED_FIREBASE_IMAGE_OVERRIDES } from "@/data/content";
import { AdminAuthService, type AdminSession } from "@/lib/firebase/adminAuth";
import {
  MediaService,
  SITE_IMAGE_SLOTS,
  getInitialFirebaseStorageLibrary,
  sanitizePublicLabel,
  type SiteImageOverrides,
  type SiteTextOverrides,
  type StorageLibraryImage,
} from "@/lib/firebase/mediaService";
import {
  Pencil,
  Check,
  X,
  Upload,
  Loader2,
  RotateCcw,
  Save,
  Image as ImageIcon,
  Type,
  Sparkles,
  Eye,
  Trash2,
  Layers,
  Search,
  RefreshCw,
  MousePointerClick,
  BoxSelect,
  ShieldCheck,
} from "lucide-react";

export interface ImageEditTarget {
  slotKey: string;
  label: string;
  currentSrc: string;
  defaultSrc?: string;
}

export interface WebsiteSectionMeta {
  id: string;
  label: string;
  description: string;
}

export const WEBSITE_SECTIONS: WebsiteSectionMeta[] = [
  {
    id: "home",
    label: "01. Hero Banner & Slideshow",
    description: "Top hero section with 5-slide photography & main statement",
  },
  {
    id: "introduction",
    label: "02. Introduction — Beyond the Ordinary",
    description: "Editorial introduction to KayArabuko & Kenya's living heritage",
  },
  {
    id: "pillars",
    label: "03. Three Core Pillars (Explore · Conserve · Empower)",
    description: "The 3 foundational pillars of KayArabuko",
  },
  {
    id: "cultures",
    label: "04. Cultures & Communities",
    description: "Maasai, Samburu, Turkana, Mijikenda & Swahili community profiles",
  },
  {
    id: "conservation",
    label: "05. Conservation & Ecosystems",
    description: "Arabuko-Sokoke Forest spotlight, themes & 6 landscape cards",
  },
  {
    id: "explore",
    label: "06. Explore Kenya — Regions",
    description: "Interactive regional selector (Coast, Highlands, North, Rift)",
  },
  {
    id: "experiences",
    label: "07. Visits & Experiences",
    description: "8 tailored cultural, forest & community visit categories",
  },
  {
    id: "safari-packages",
    label: "07A. Multi-Day Safari Packages & Transfer Add-Ons",
    description:
      "Pollman's, Bonfire & Watamu Safaris packages + Airport & SGR Transfer Add-Ons",
  },
  {
    id: "excursions",
    label: "07B. Excursions & One-Day Visits",
    description: "Arabuko-Sokoke, Gede Ruins, Safari Blue & Mida Creek day trips",
  },
  {
    id: "accommodation",
    label: "07C. Accommodation & Coastal Stays",
    description: "Private villas, coastal cottages, hotels, resorts & lodgings",
  },
  {
    id: "kaya-roots",
    label: "07D. Kaya Roots Africa (Dr. Milcah Wambua)",
    description: "Indigenous cassava & farmer livelihood empowerment across Kenya",
  },
  {
    id: "gallery",
    label: "07E. Safari & Activity Gallery",
    description: "Plain photo showcase of safaris, forest walks & creek rides",
  },
  {
    id: "stories",
    label: "08. Stories & Insights",
    description: "Editorial articles on Kenyan culture, people & conservation",
  },
  {
    id: "about",
    label: "09. About KayArabuko",
    description: "Brand philosophy & Managed by Kaya Experience Ltd card",
  },
  {
    id: "team",
    label: "09B. Meet Our Team",
    description: "Mrisa (“The Shepherd”), Dr. Milcah Wambua & Field Naturalists",
  },
  {
    id: "reviews",
    label: "09B2. Customer Reviews (TripAdvisor & Google Ratings)",
    description: "Verified guest testimonials with TripAdvisor & Google rating badges",
  },
  {
    id: "posters",
    label: "09C. Published Posters",
    description: "Plain campaign & excursion posters showcase",
  },
  {
    id: "contact",
    label: "10. Contact & Experience Enquiries",
    description: "Enquiry form, WhatsApp direct chat & Watamu office contacts",
  },
];

interface SelectedBlockInfo {
  key: string;
  label: string;
}

interface VisualEditContextValue {
  editMode: boolean;
  setEditMode: (val: boolean) => void;
  isAdminAuthenticated: boolean;
  adminSession: AdminSession | null;
  imageOverrides: SiteImageOverrides;
  textOverrides: SiteTextOverrides;
  deletedSections: string[];
  selectedSectionId: string | null;
  setSelectedSectionId: (id: string | null) => void;
  deleteSectionOrBlock: (targetId: string, label?: string) => Promise<void>;
  restoreSectionOrBlock: (targetId: string, label?: string) => Promise<void>;
  resolveImageSrc: (slotKey?: string, fallbackSrc?: string) => string | undefined;
  openImageEditor: (target: ImageEditTarget) => void;
  saveAllChangesToFirebase: () => Promise<void>;
  savingAll: boolean;
  lastSavedMessage: string | null;
}

const VisualEditContext = createContext<VisualEditContextValue>({
  editMode: false,
  setEditMode: () => {},
  isAdminAuthenticated: false,
  adminSession: null,
  imageOverrides: SAVED_FIREBASE_IMAGE_OVERRIDES,
  textOverrides: {},
  deletedSections: [],
  selectedSectionId: null,
  setSelectedSectionId: () => {},
  deleteSectionOrBlock: async () => {},
  restoreSectionOrBlock: async () => {},
  resolveImageSrc: (_slotKey, fallbackSrc) => fallbackSrc,
  openImageEditor: () => {},
  saveAllChangesToFirebase: async () => {},
  savingAll: false,
  lastSavedMessage: null,
});

export function useVisualEdit() {
  return useContext(VisualEditContext);
}

const EDITABLE_TEXT_TAGS = new Set([
  "H1",
  "H2",
  "H3",
  "H4",
  "H5",
  "H6",
  "P",
  "SPAN",
  "LI",
  "BLOCKQUOTE",
  "A",
  "BUTTON",
  "LABEL",
  "STRONG",
  "EM",
]);

function computeShortHash(input: string): string {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0).toString(36);
}

function findEnclosingSectionId(el: HTMLElement): string {
  let curr: HTMLElement | null = el;
  while (curr && curr !== document.body) {
    const secEl = curr.tagName === "SECTION" && curr.id ? curr.id : null;
    if (secEl) return secEl;
    if (curr.id && WEBSITE_SECTIONS.some((s) => s.id === curr?.id)) {
      return curr.id;
    }
    if (curr.tagName === "HEADER") return "header";
    if (curr.tagName === "FOOTER") return "footer";
    curr = curr.parentElement;
  }
  return "page";
}

function extractReadableElementSummary(
  el: HTMLElement,
  fallbackLabel: string
): string {
  const heading = el.querySelector("h1, h2, h3, h4");
  if (heading && heading.textContent) {
    const clean = sanitizePublicLabel(
      heading.textContent.trim().slice(0, 42),
      fallbackLabel
    );
    if (clean && clean.length >= 2) return clean;
  }
  const text = (el.textContent || "").replace(/\s+/g, " ").trim();
  if (text.length >= 3) {
    const snippet = text.slice(0, 38) + (text.length > 38 ? "…" : "");
    return sanitizePublicLabel(snippet, fallbackLabel);
  }
  return fallbackLabel;
}

function isDirectTextLeaf(el: HTMLElement): boolean {
  if (!EDITABLE_TEXT_TAGS.has(el.tagName)) return false;
  if (el.closest("[data-ve-ignore='true']")) return false;
  if (el.getAttribute("aria-hidden") === "true") return false;

  for (let i = 0; i < el.children.length; i++) {
    const child = el.children[i] as HTMLElement;
    const childText = (child.textContent || "").trim();
    if (childText.length > 0 && EDITABLE_TEXT_TAGS.has(child.tagName)) {
      return false;
    }
  }

  const text = (el.textContent || "").trim();
  return text.length >= 2;
}

export function VisualEditProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/admin");

  const [adminSession, setAdminSession] = useState<AdminSession | null>(null);
  const isAdminAuthenticated = Boolean(adminSession?.email);
  const [rawEditMode, setRawEditMode] = useState(false);
  const editMode = isAdminAuthenticated && rawEditMode;
  const setEditMode = useCallback(
    (val: boolean) => {
      if (!isAdminAuthenticated) {
        setRawEditMode(false);
        return;
      }
      setRawEditMode(val);
    },
    [isAdminAuthenticated]
  );
  const [imageOverrides, setImageOverrides] = useState<SiteImageOverrides>(
    SAVED_FIREBASE_IMAGE_OVERRIDES
  );
  const [textOverrides, setTextOverrides] = useState<SiteTextOverrides>({});
  const [deletedSections, setDeletedSections] = useState<string[]>([]);
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(
    null
  );
  const [selectedCardInfo, setSelectedCardInfo] =
    useState<SelectedBlockInfo | null>(null);
  const [selectedBlockInfo, setSelectedBlockInfo] =
    useState<SelectedBlockInfo | null>(null);
  const [selectedParentBlockInfo, setSelectedParentBlockInfo] =
    useState<SelectedBlockInfo | null>(null);
  const [blockLabelRegistry, setBlockLabelRegistry] = useState<
    Record<string, string>
  >({});

  const [showSectionManager, setShowSectionManager] = useState(false);
  const [savingAll, setSavingAll] = useState(false);
  const [lastSavedMessage, setLastSavedMessage] = useState<string | null>(null);

  // Selected Text Element State
  const [selectedTextKey, setSelectedTextKey] = useState<string | null>(null);
  const [selectedTextDefault, setSelectedTextDefault] = useState<string>("");
  const [selectedTextValue, setSelectedTextValue] = useState<string>("");
  const [selectedTextTag, setSelectedTextTag] = useState<string>("");
  const [selectedEnclosingSectionId, setSelectedEnclosingSectionId] =
    useState<string | null>(null);
  const [savingText, setSavingText] = useState(false);
  const selectedElementRef = useRef<HTMLElement | null>(null);

  // Selected Image Element & Media Library State
  const [activeImageTarget, setActiveImageTarget] =
    useState<ImageEditTarget | null>(null);
  const [imageEditorTab, setImageEditorTab] = useState<"library" | "upload">(
    "library"
  );
  const [storageLibrary, setStorageLibrary] = useState<StorageLibraryImage[]>(
    () => getInitialFirebaseStorageLibrary()
  );
  const [loadingLibrary, setLoadingLibrary] = useState(false);
  const [librarySearch, setLibrarySearch] = useState("");
  const [libraryCategory, setLibraryCategory] = useState("All");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [savingImage, setSavingImage] = useState(false);
  const [imageModalNotice, setImageModalNotice] = useState<string | null>(null);

  const textOverridesRef = useRef<SiteTextOverrides>({});
  textOverridesRef.current = textOverrides;

  const deletedSectionsRef = useRef<string[]>([]);
  deletedSectionsRef.current = deletedSections;

  // Subscribe to administrator authentication state (Visual Quick-Edit is strictly Admin-Only)
  useEffect(() => {
    const unsubscribe = AdminAuthService.subscribe((session) => {
      setAdminSession(session);
      if (!session?.email) {
        setRawEditMode(false);
      } else {
        MediaService.getFirebaseStorageLibrary().then((libData) => {
          if (libData.length > 0) setStorageLibrary(libData);
        });
      }
    });
    return () => unsubscribe();
  }, []);

  // Load initial overrides & deleted sections on mount
  useEffect(() => {
    MediaService.getSiteImageOverrides().then((imgData) => {
      setImageOverrides(imgData);
    });
    MediaService.getSiteTextOverrides().then((txtData) => {
      setTextOverrides(txtData);
    });
    MediaService.getSiteDeletedSections().then((delData) => {
      setDeletedSections(delData);
    });
  }, []);

  const refreshStorageLibrary = useCallback(async () => {
    setLoadingLibrary(true);
    try {
      const libData = await MediaService.getFirebaseStorageLibrary();
      if (libData.length > 0) {
        setStorageLibrary(libData);
      }
    } finally {
      setLoadingLibrary(false);
    }
  }, []);

  // Sync DOM highlight attributes for selected section and selected subsection/container/card
  useEffect(() => {
    if (typeof document === "undefined") return;
    document
      .querySelectorAll("[data-ve-section-selected='true']")
      .forEach((el) => el.removeAttribute("data-ve-section-selected"));
    document
      .querySelectorAll("[data-ve-block-selected='true']")
      .forEach((el) => el.removeAttribute("data-ve-block-selected"));

    if (editMode && !isAdminRoute) {
      if (selectedSectionId) {
        const secEl = document.getElementById(selectedSectionId);
        if (secEl) {
          secEl.setAttribute("data-ve-section-selected", "true");
        }
      }
      const activeSubKey =
        selectedCardInfo?.key ||
        selectedBlockInfo?.key ||
        selectedParentBlockInfo?.key;
      if (activeSubKey) {
        const subEl = document.querySelector<HTMLElement>(
          `[data-ve-card-key="${activeSubKey}"], [data-ve-block-key="${activeSubKey}"]`
        );
        if (subEl) {
          subEl.setAttribute("data-ve-block-selected", "true");
        }
      }
    }
  }, [
    editMode,
    selectedSectionId,
    selectedCardInfo,
    selectedBlockInfo,
    selectedParentBlockInfo,
    isAdminRoute,
  ]);

  // Delete a section, subsection, container, or card and persist immediately
  const deleteSectionOrBlock = useCallback(
    async (targetId: string, label?: string) => {
      const cleanName = sanitizePublicLabel(label, "Selected Item");
      const next = Array.from(
        new Set([...deletedSectionsRef.current, targetId])
      );
      setDeletedSections(next);
      if (selectedEnclosingSectionId === targetId) {
        setSelectedTextKey(null);
      }
      if (selectedSectionId === targetId) {
        setSelectedSectionId(null);
      }
      if (selectedCardInfo?.key === targetId) {
        setSelectedCardInfo(null);
      }
      if (selectedBlockInfo?.key === targetId) {
        setSelectedBlockInfo(null);
      }
      if (selectedParentBlockInfo?.key === targetId) {
        setSelectedParentBlockInfo(null);
      }
      try {
        const saved = await MediaService.saveSiteDeletedSections(next);
        setDeletedSections(saved);
        setLastSavedMessage(`Deleted "${cleanName}" ✓`);
        setTimeout(() => setLastSavedMessage(null), 3500);
      } catch (err) {
        console.error("Failed to delete item:", err);
      }
    },
    [
      selectedEnclosingSectionId,
      selectedSectionId,
      selectedCardInfo,
      selectedBlockInfo,
      selectedParentBlockInfo,
    ]
  );

  // Restore a deleted section, subsection, container, or card
  const restoreSectionOrBlock = useCallback(
    async (targetId: string, label?: string) => {
      const cleanName = sanitizePublicLabel(label, "Restored Item");
      const next = deletedSectionsRef.current.filter((id) => id !== targetId);
      setDeletedSections(next);
      try {
        const saved = await MediaService.saveSiteDeletedSections(next);
        setDeletedSections(saved);
        setLastSavedMessage(`Restored "${cleanName}" ✓`);
        setTimeout(() => setLastSavedMessage(null), 3500);
      } catch (err) {
        console.error("Failed to restore item:", err);
      }
    },
    []
  );

  // Sync body attribute for visual edit mode styling
  useEffect(() => {
    if (typeof document === "undefined") return;
    if (editMode && !isAdminRoute) {
      document.body.setAttribute("data-visual-edit", "true");
    } else {
      document.body.removeAttribute("data-visual-edit");
      setSelectedTextKey(null);
      setSelectedSectionId(null);
      setSelectedCardInfo(null);
      setSelectedBlockInfo(null);
      setSelectedParentBlockInfo(null);
      selectedElementRef.current = null;
    }
  }, [editMode, isAdminRoute]);

  // Inject floating "Select / Delete Section" toolbar badges into each <section id="..."> when editMode is ON
  const syncSectionDeleteOverlays = useCallback(() => {
    if (typeof document === "undefined") return;

    const existingBadges = document.querySelectorAll(
      "[data-ve-section-badge='true']"
    );
    if (!editMode || isAdminRoute) {
      existingBadges.forEach((b) => b.remove());
      return;
    }

    WEBSITE_SECTIONS.forEach((secMeta) => {
      const secEl = document.getElementById(secMeta.id);
      if (!secEl) return;

      const computedPos = window.getComputedStyle(secEl).position;
      if (computedPos === "static") {
        secEl.style.position = "relative";
      }

      let badge = secEl.querySelector<HTMLElement>(
        `[data-ve-section-badge-for="${secMeta.id}"]`
      );
      if (!badge) {
        badge = document.createElement("div");
        badge.setAttribute("data-ve-ignore", "true");
        badge.setAttribute("data-ve-section-badge", "true");
        badge.setAttribute("data-ve-section-badge-for", secMeta.id);
        badge.className =
          "absolute top-3 right-3 z-30 flex flex-wrap items-center gap-1.5 rounded-ka border-2 border-gold bg-forest/95 px-3 py-1.5 text-[11px] font-semibold text-ivory shadow-xl backdrop-blur-md";

        const selectBtn = document.createElement("button");
        selectBtn.type = "button";
        selectBtn.className =
          "cursor-pointer inline-flex items-center gap-1 text-gold-light hover:text-gold text-[10px] mr-1";
        selectBtn.textContent = `${secMeta.label} (Select / Double-Click)`;
        selectBtn.onclick = (ev) => {
          ev.preventDefault();
          ev.stopPropagation();
          setSelectedSectionId(secMeta.id);
          setSelectedEnclosingSectionId(secMeta.id);
        };

        const delBtn = document.createElement("button");
        delBtn.type = "button";
        delBtn.className =
          "cursor-pointer inline-flex items-center gap-1 rounded-ka bg-rose-700 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-ivory hover:bg-rose-600 transition-colors";
        delBtn.textContent = "Delete Section";
        delBtn.onclick = (ev) => {
          ev.preventDefault();
          ev.stopPropagation();
          deleteSectionOrBlock(secMeta.id, secMeta.label);
        };

        badge.appendChild(selectBtn);
        badge.appendChild(delBtn);
        secEl.appendChild(badge);
      }
    });
  }, [editMode, isAdminRoute, deleteSectionOrBlock]);

  // Stamp deterministic keys onto cards, subsections, containers, and leaf text elements
  const scanAndApplyTextOverrides = useCallback(() => {
    if (typeof document === "undefined" || isAdminRoute) return;

    const newLabelMap: Record<string, string> = {};

    // 1. Stamp deterministic keys onto <article> cards
    const cardCounters = new Map<string, number>();
    const allArticles = document.body.querySelectorAll<HTMLElement>("article");
    allArticles.forEach((art) => {
      if (art.closest("[data-ve-ignore='true']")) return;
      let cardKey = art.getAttribute("data-ve-card-key");
      const secId = findEnclosingSectionId(art);
      const count = cardCounters.get(secId) || 0;
      cardCounters.set(secId, count + 1);
      if (!cardKey) {
        cardKey = `card::${secId}::${count}`;
        art.setAttribute("data-ve-card-key", cardKey);
      }
      const cardLabel = extractReadableElementSummary(
        art,
        `Card ${count + 1}`
      );
      art.setAttribute("data-ve-card-label", cardLabel);
      newLabelMap[cardKey] = cardLabel;
    });

    // 2. Stamp deterministic keys onto subsections, containers, callouts, banners & smaller blocks inside each section
    WEBSITE_SECTIONS.forEach((secMeta) => {
      const secEl = document.getElementById(secMeta.id);
      if (!secEl) return;

      let blockIdx = 0;
      const registerBlock = (el: HTMLElement, defaultName: string) => {
        if (
          el.closest("[data-ve-ignore='true']") ||
          el.tagName === "ARTICLE" ||
          el.hasAttribute("data-ve-image-slot")
        ) {
          return;
        }
        let bKey = el.getAttribute("data-ve-block-key");
        if (!bKey) {
          bKey = `block::${secMeta.id}::${blockIdx}`;
          el.setAttribute("data-ve-block-key", bKey);
        }
        blockIdx++;
        const bLabel = extractReadableElementSummary(el, defaultName);
        el.setAttribute("data-ve-block-label", bLabel);
        newLabelMap[bKey] = `${bLabel} (${secMeta.label.split(".")[0]})`;
      };

      // Direct children inside section container (`section > div > *`) and their major sub-containers
      const containerEl =
        secEl.querySelector<HTMLElement>(":scope > div") || secEl;
      Array.from(containerEl.children).forEach((child, i) => {
        const htmlChild = child as HTMLElement;
        if (!htmlChild || htmlChild.getAttribute("data-ve-ignore") === "true") {
          return;
        }
        registerBlock(htmlChild, `Subsection ${i + 1}`);

        // Also stamp nested containers/columns/callouts inside each subsection so smaller containers can be deleted too
        Array.from(htmlChild.children).forEach((subChild, j) => {
          const htmlSub = subChild as HTMLElement;
          if (
            !htmlSub ||
            htmlSub.getAttribute("data-ve-ignore") === "true" ||
            htmlSub.tagName === "ARTICLE"
          ) {
            return;
          }
          if (
            htmlSub.tagName === "DIV" ||
            htmlSub.tagName === "ASIDE" ||
            htmlSub.tagName === "BLOCKQUOTE"
          ) {
            registerBlock(htmlSub, `Container ${i + 1}.${j + 1}`);
          }
        });
      });
    });

    setBlockLabelRegistry((prev) => {
      const merged = { ...prev, ...newLabelMap };
      return Object.keys(merged).length === Object.keys(prev).length
        ? prev
        : merged;
    });

    // 3. Stamp deterministic keys onto leaf text elements
    const counters = new Map<string, number>();
    const allElements = document.body.querySelectorAll<HTMLElement>(
      "h1, h2, h3, h4, h5, h6, p, span, li, blockquote, a, button, label, strong, em"
    );

    allElements.forEach((el) => {
      if (!isDirectTextLeaf(el)) return;

      let key = el.getAttribute("data-ve-text-key");
      let defaultText = el.getAttribute("data-ve-default-text");

      if (!key || defaultText === null) {
        const rawText = (el.textContent || "").trim();
        defaultText = rawText;
        const secId = findEnclosingSectionId(el);
        const baseSig = `${secId}::${el.tagName.toLowerCase()}::${computeShortHash(
          rawText
        )}`;
        const count = counters.get(baseSig) || 0;
        counters.set(baseSig, count + 1);
        key = count === 0 ? baseSig : `${baseSig}::${count}`;

        el.setAttribute("data-ve-text-key", key);
        el.setAttribute("data-ve-default-text", defaultText);
      }

      const overrideVal = textOverridesRef.current[key];
      if (typeof overrideVal === "string" && overrideVal !== "__RESET__") {
        if (el.textContent !== overrideVal) {
          el.textContent = overrideVal;
        }
      } else if (
        overrideVal === undefined &&
        defaultText &&
        el.getAttribute("data-ve-modified") === "true"
      ) {
        el.textContent = defaultText;
        el.removeAttribute("data-ve-modified");
      }
    });

    syncSectionDeleteOverlays();
  }, [isAdminRoute, syncSectionDeleteOverlays]);

  useEffect(() => {
    scanAndApplyTextOverrides();
    const timer = setTimeout(scanAndApplyTextOverrides, 500);
    return () => clearTimeout(timer);
  }, [textOverrides, pathname, editMode, scanAndApplyTextOverrides]);

  useEffect(() => {
    if (typeof document === "undefined" || isAdminRoute) return;
    let rafId: number | null = null;

    const observer = new MutationObserver(() => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        scanAndApplyTextOverrides();
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      observer.disconnect();
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [isAdminRoute, scanAndApplyTextOverrides]);

  const openImageEditor = useCallback(
    (target: ImageEditTarget) => {
      setSelectedTextKey(null);
      setActiveImageTarget({
        ...target,
        label: sanitizePublicLabel(target.label, "Website Photograph"),
      });
      setImageModalNotice(null);
      setImageEditorTab("library");
      refreshStorageLibrary();
    },
    [refreshStorageLibrary]
  );

  // Helper to resolve card, container, and outer subsection from any clicked/double-clicked DOM node
  const resolveHierarchyFromTarget = useCallback((target: HTMLElement) => {
    const secId = findEnclosingSectionId(target);
    const validSection = WEBSITE_SECTIONS.some((s) => s.id === secId)
      ? secId
      : null;

    const cardEl = target.closest<HTMLElement>("[data-ve-card-key]");
    const cardInfo: SelectedBlockInfo | null = cardEl
      ? {
          key: cardEl.getAttribute("data-ve-card-key")!,
          label:
            cardEl.getAttribute("data-ve-card-label") ||
            extractReadableElementSummary(cardEl, "Card Item"),
        }
      : null;

    const blockEl = target.closest<HTMLElement>("[data-ve-block-key]");
    const blockInfo: SelectedBlockInfo | null = blockEl
      ? {
          key: blockEl.getAttribute("data-ve-block-key")!,
          label:
            blockEl.getAttribute("data-ve-block-label") ||
            extractReadableElementSummary(blockEl, "Container Block"),
        }
      : null;

    const parentBlockEl = blockEl?.parentElement
      ? blockEl.parentElement.closest<HTMLElement>("[data-ve-block-key]")
      : null;
    const parentBlockInfo: SelectedBlockInfo | null =
      parentBlockEl && parentBlockEl !== blockEl
        ? {
            key: parentBlockEl.getAttribute("data-ve-block-key")!,
            label:
              parentBlockEl.getAttribute("data-ve-block-label") ||
              extractReadableElementSummary(parentBlockEl, "Subsection"),
          }
        : null;

    return {
      validSection,
      cardInfo,
      blockInfo,
      parentBlockInfo,
    };
  }, []);

  // Global click & double-click interceptor when editMode is ON
  useEffect(() => {
    if (!editMode || isAdminRoute || typeof document === "undefined") return;

    const handleDocumentDoubleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target || target.closest("[data-ve-ignore='true']")) return;

      const { validSection, cardInfo, blockInfo, parentBlockInfo } =
        resolveHierarchyFromTarget(target);

      if (validSection || cardInfo || blockInfo) {
        e.preventDefault();
        e.stopPropagation();
        setSelectedSectionId(validSection);
        setSelectedEnclosingSectionId(validSection);
        setSelectedCardInfo(cardInfo);
        setSelectedBlockInfo(blockInfo);
        setSelectedParentBlockInfo(parentBlockInfo);
      }
    };

    const handleDocumentClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      if (target.closest("[data-ve-ignore='true']")) {
        return;
      }

      const { validSection, cardInfo, blockInfo, parentBlockInfo } =
        resolveHierarchyFromTarget(target);

      if (validSection) {
        setSelectedSectionId(validSection);
        setSelectedEnclosingSectionId(validSection);
      }
      setSelectedCardInfo(cardInfo);
      setSelectedBlockInfo(blockInfo);
      setSelectedParentBlockInfo(parentBlockInfo);

      // 1. Check if user clicked an editable image slot ("Replace Image")
      const imageContainer = target.closest<HTMLElement>(
        "[data-ve-image-slot]"
      );
      if (imageContainer) {
        e.preventDefault();
        e.stopPropagation();
        const slotKey =
          imageContainer.getAttribute("data-ve-image-slot") || "hero.0";
        const slotMeta = SITE_IMAGE_SLOTS.find((s) => s.key === slotKey);
        const fallbackSrc =
          imageContainer.getAttribute("data-ve-image-src") ||
          slotMeta?.defaultUrl ||
          "";
        const currentSrc = imageOverrides[slotKey] || fallbackSrc;

        const rawLabel =
          imageContainer.getAttribute("data-ve-image-label") ||
          slotMeta?.label ||
          "Website Photograph";

        openImageEditor({
          slotKey,
          label: sanitizePublicLabel(rawLabel, "Website Photograph"),
          currentSrc,
          defaultSrc: slotMeta?.defaultUrl || fallbackSrc,
        });
        return;
      }

      // 2. Check if user clicked a text element
      const textEl = target.closest<HTMLElement>("[data-ve-text-key]");
      if (textEl) {
        e.preventDefault();
        e.stopPropagation();
        const key = textEl.getAttribute("data-ve-text-key")!;
        const defText =
          textEl.getAttribute("data-ve-default-text") ||
          textEl.textContent ||
          "";
        const currentVal =
          textOverridesRef.current[key] !== undefined
            ? textOverridesRef.current[key]
            : textEl.textContent || defText;

        if (
          selectedElementRef.current &&
          selectedElementRef.current !== textEl
        ) {
          selectedElementRef.current.removeAttribute("data-ve-selected");
        }
        selectedElementRef.current = textEl;
        textEl.setAttribute("data-ve-selected", "true");

        setSelectedTextKey(key);
        setSelectedTextDefault(defText);
        setSelectedTextValue(currentVal);
        setSelectedTextTag(textEl.tagName.toLowerCase());
        return;
      }

      // 3. User clicked directly on a section / subsection / container background -> select it for deletion
      if (validSection || cardInfo || blockInfo) {
        if (selectedElementRef.current) {
          selectedElementRef.current.removeAttribute("data-ve-selected");
          selectedElementRef.current = null;
        }
        setSelectedTextKey(null);
      }
    };

    document.addEventListener("click", handleDocumentClick, true);
    document.addEventListener("dblclick", handleDocumentDoubleClick, true);
    return () => {
      document.removeEventListener("click", handleDocumentClick, true);
      document.removeEventListener("dblclick", handleDocumentDoubleClick, true);
    };
  }, [
    editMode,
    isAdminRoute,
    imageOverrides,
    openImageEditor,
    resolveHierarchyFromTarget,
  ]);

  const resolveImageSrc = useCallback(
    (slotKey?: string, fallbackSrc?: string): string | undefined => {
      if (slotKey && imageOverrides[slotKey]) {
        return imageOverrides[slotKey];
      }
      if (fallbackSrc) {
        const matchedSlot = SITE_IMAGE_SLOTS.find(
          (s) => s.defaultUrl === fallbackSrc
        );
        if (matchedSlot && imageOverrides[matchedSlot.key]) {
          return imageOverrides[matchedSlot.key];
        }
      }
      return fallbackSrc;
    },
    [imageOverrides]
  );

  // Handle Live Text Editing & Saving
  const handleTextDraftChange = (val: string) => {
    setSelectedTextValue(val);
    if (selectedElementRef.current) {
      selectedElementRef.current.textContent = val;
      selectedElementRef.current.setAttribute("data-ve-modified", "true");
    }
    if (selectedTextKey) {
      setTextOverrides((prev) => ({
        ...prev,
        [selectedTextKey]: val,
      }));
    }
  };

  const handleSaveSelectedText = async () => {
    if (!selectedTextKey) return;
    setSavingText(true);
    try {
      const updatedMap: SiteTextOverrides = {
        ...textOverrides,
        [selectedTextKey]: selectedTextValue,
      };
      const saved = await MediaService.saveSiteTextOverrides(updatedMap);
      setTextOverrides(saved);
      setLastSavedMessage("Text changes saved ✓");
      setTimeout(() => setLastSavedMessage(null), 3000);
    } catch (err) {
      console.error("Failed to save text:", err);
    } finally {
      setSavingText(false);
    }
  };

  const handleResetSelectedText = async () => {
    if (!selectedTextKey) return;
    setSavingText(true);
    try {
      if (selectedElementRef.current) {
        selectedElementRef.current.textContent = selectedTextDefault;
        selectedElementRef.current.removeAttribute("data-ve-modified");
      }
      setSelectedTextValue(selectedTextDefault);
      const saved = await MediaService.saveSiteTextOverrides({
        [selectedTextKey]: "__RESET__",
      });
      setTextOverrides(saved);
      setLastSavedMessage("Text reset to default ✓");
      setTimeout(() => setLastSavedMessage(null), 3000);
    } catch (err) {
      console.error("Failed to reset text:", err);
    } finally {
      setSavingText(false);
    }
  };

  // Select an existing image from the Media Library and save it to the current slot
  const handleSelectFromMediaLibrary = async (storageUrl: string) => {
    if (!activeImageTarget) return;
    setSavingImage(true);
    setImageModalNotice(null);
    setActiveImageTarget((prev) =>
      prev ? { ...prev, currentSrc: storageUrl } : null
    );
    try {
      const nextOverrides: SiteImageOverrides = {
        ...imageOverrides,
        [activeImageTarget.slotKey]: storageUrl,
      };
      const saved = await MediaService.saveSiteImageOverrides(nextOverrides);
      setImageOverrides(saved);
      setImageModalNotice("Selected photograph applied & saved ✓");
      setLastSavedMessage(`Updated "${activeImageTarget.label}" ✓`);
      setTimeout(() => setLastSavedMessage(null), 3500);
    } catch (err: unknown) {
      setImageModalNotice(
        err instanceof Error ? err.message : "Could not apply selected image."
      );
    } finally {
      setSavingImage(false);
    }
  };

  // Upload a new file from the user's computer
  const handleUploadImageFile = async (file?: File) => {
    if (!file || !activeImageTarget) return;
    setUploadingImage(true);
    setImageModalNotice(null);
    try {
      const storageUrl = await MediaService.uploadWebsiteImage(
        file,
        activeImageTarget.slotKey
      );
      setImageOverrides((prev) => ({
        ...prev,
        [activeImageTarget.slotKey]: storageUrl,
      }));
      setActiveImageTarget((prev) =>
        prev ? { ...prev, currentSrc: storageUrl } : null
      );
      setStorageLibrary((prev) => [
        {
          id: `uploaded-${Date.now()}`,
          url: storageUrl,
          label: sanitizePublicLabel(
            activeImageTarget.label,
            "Uploaded Photograph"
          ),
          slotKey: activeImageTarget.slotKey,
          category: "Uploaded Media",
          updatedAt: new Date().toISOString(),
        },
        ...prev.filter((item) => item.url !== storageUrl),
      ]);
      setImageModalNotice("Uploaded from your computer & saved ✓");
      setLastSavedMessage("New photograph uploaded & saved ✓");
      setTimeout(() => setLastSavedMessage(null), 3500);
    } catch (err: unknown) {
      setImageModalNotice(
        err instanceof Error ? err.message : "Failed to upload image."
      );
    } finally {
      setUploadingImage(false);
    }
  };

  const handleResetImageSlot = async () => {
    if (!activeImageTarget) return;
    setSavingImage(true);
    setImageModalNotice(null);
    try {
      const isBrandLogo = activeImageTarget.slotKey.startsWith("brand.");
      const defUrl = isBrandLogo
        ? "__RESET__"
        : SAVED_FIREBASE_IMAGE_OVERRIDES[activeImageTarget.slotKey] ||
          activeImageTarget.defaultSrc ||
          "";
      const nextOverrides = {
        ...imageOverrides,
        [activeImageTarget.slotKey]: defUrl,
      };
      const saved = await MediaService.saveSiteImageOverrides(nextOverrides);
      setImageOverrides(saved);
      setActiveImageTarget((prev) =>
        prev
          ? {
              ...prev,
              currentSrc: isBrandLogo ? prev.defaultSrc || "" : defUrl,
            }
          : null
      );
      setImageModalNotice("Reset to default ✓");
    } catch (err: unknown) {
      setImageModalNotice(
        err instanceof Error ? err.message : "Could not reset image."
      );
    } finally {
      setSavingImage(false);
    }
  };

  const saveAllChangesToFirebase = useCallback(async () => {
    setSavingAll(true);
    try {
      const [savedTexts, savedImages, savedDeleted] = await Promise.all([
        MediaService.saveSiteTextOverrides(textOverridesRef.current, true),
        MediaService.saveSiteImageOverrides(imageOverrides),
        MediaService.saveSiteDeletedSections(deletedSectionsRef.current),
      ]);
      setTextOverrides(savedTexts);
      setImageOverrides(savedImages);
      setDeletedSections(savedDeleted);
      setLastSavedMessage("All website changes saved ✓");
      setTimeout(() => setLastSavedMessage(null), 4000);
    } catch (err) {
      console.error("Error saving all visual changes:", err);
    } finally {
      setSavingAll(false);
    }
  }, [imageOverrides]);

  const heroSlideSlots = SITE_IMAGE_SLOTS.filter((s) =>
    s.key.startsWith("hero.")
  );
  const isEditingHeroSlot = activeImageTarget?.slotKey.startsWith("hero.");

  // Filtered Media Library items
  const libraryCategories = useMemo(() => {
    const cats = new Set<string>(["All"]);
    storageLibrary.forEach((item) => {
      if (item.category) cats.add(item.category);
    });
    return Array.from(cats);
  }, [storageLibrary]);

  const filteredLibraryImages = useMemo(() => {
    return storageLibrary.filter((item) => {
      const matchesCat =
        libraryCategory === "All" || item.category === libraryCategory;
      if (!matchesCat) return false;
      if (!librarySearch.trim()) return true;
      const q = librarySearch.toLowerCase();
      return (
        item.label.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q)
      );
    });
  }, [storageLibrary, libraryCategory, librarySearch]);

  // Build CSS rules to hide deleted sections, subsections, containers, and cards
  const deletedCssRules = deletedSections
    .map((id) => {
      if (id.startsWith("card::")) {
        return `[data-ve-card-key="${id}"] { display: none !important; }`;
      }
      if (id.startsWith("block::")) {
        return `[data-ve-block-key="${id}"] { display: none !important; }`;
      }
      return `section#${id}, #${id} { display: none !important; }`;
    })
    .join("\n");

  const deletedSubElements = deletedSections.filter(
    (id) => id.startsWith("card::") || id.startsWith("block::")
  );

  const activeSectionId = selectedSectionId || selectedEnclosingSectionId;
  const selectedSectionMeta = activeSectionId
    ? WEBSITE_SECTIONS.find((s) => s.id === activeSectionId)
    : null;

  return (
    <VisualEditContext.Provider
      value={{
        editMode,
        setEditMode,
        isAdminAuthenticated,
        adminSession,
        imageOverrides,
        textOverrides,
        deletedSections,
        selectedSectionId,
        setSelectedSectionId,
        deleteSectionOrBlock,
        restoreSectionOrBlock,
        resolveImageSrc,
        openImageEditor,
        saveAllChangesToFirebase,
        savingAll,
        lastSavedMessage,
      }}
    >
      {/* Hide Deleted Sections, Subsections, Containers & Cards Globally */}
      {deletedSections.length > 0 && !isAdminRoute && (
        <style>{deletedCssRules}</style>
      )}

      {/* Global CSS rules when Visual Quick-Edit Mode is ON */}
      {editMode && !isAdminRoute && (
        <style>{`
          body[data-visual-edit="true"] [data-ve-text-key] {
            transition: outline 0.15s ease, background-color 0.15s ease;
            border-radius: 3px;
          }
          body[data-visual-edit="true"] [data-ve-text-key]:hover {
            outline: 2px dashed #C7942D !important;
            outline-offset: 3px !important;
            background-color: rgba(199, 148, 45, 0.12) !important;
            cursor: pointer !important;
          }
          body[data-visual-edit="true"] [data-ve-text-key][data-ve-selected="true"] {
            outline: 2px solid #C7942D !important;
            outline-offset: 4px !important;
            background-color: rgba(199, 148, 45, 0.18) !important;
          }
          body[data-visual-edit="true"] [data-ve-image-slot] {
            cursor: pointer !important;
            transition: outline 0.2s ease, box-shadow 0.2s ease;
          }
          body[data-visual-edit="true"] [data-ve-image-slot]:hover {
            outline: 3px solid #C7942D !important;
            outline-offset: -3px !important;
            box-shadow: 0 0 0 4px rgba(199, 148, 45, 0.3) !important;
          }
          body[data-visual-edit="true"] [data-ve-image-slot]:hover .ve-replace-overlay {
            opacity: 1 !important;
          }
          body[data-visual-edit="true"] section[data-ve-section-selected="true"] {
            outline: 3px dashed #E11D48 !important;
            outline-offset: -4px !important;
          }
          body[data-visual-edit="true"] [data-ve-block-selected="true"] {
            outline: 2px dashed #F59E0B !important;
            outline-offset: 4px !important;
          }
        `}</style>
      )}

      {children}

      {/* =====================================================================
          SELECTED SECTION / SUBSECTION / CONTAINER QUICK-DELETE FLOATING BAR
      ===================================================================== */}
      {editMode &&
        (selectedSectionMeta ||
          selectedCardInfo ||
          selectedBlockInfo ||
          selectedParentBlockInfo) &&
        !isAdminRoute && (
          <div
            data-ve-ignore="true"
            className="fixed top-20 left-1/2 -translate-x-1/2 z-[84] flex flex-wrap items-center gap-2 rounded-ka border-2 border-gold bg-forest/95 px-4 py-2.5 text-xs text-ivory shadow-[0_14px_40px_rgba(0,0,0,0.45)] backdrop-blur-md animate-panel-enter max-w-[95vw]"
          >
            <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-gold-light">
              <MousePointerClick className="h-3.5 w-3.5 text-gold" />
              <span>Selected:</span>
            </span>
            <span className="font-display text-sm sm:text-base font-semibold text-ivory mr-1">
              {selectedCardInfo?.label ||
                selectedBlockInfo?.label ||
                selectedSectionMeta?.label}
            </span>

            {/* Delete Smaller Card Item */}
            {selectedCardInfo && (
              <button
                type="button"
                onClick={() =>
                  deleteSectionOrBlock(
                    selectedCardInfo.key,
                    selectedCardInfo.label
                  )
                }
                className="cursor-pointer inline-flex items-center gap-1 rounded-ka border border-amber-300/70 bg-amber-900/80 px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-ivory hover:bg-amber-700 transition-colors"
              >
                <Trash2 className="h-3 w-3" />
                <span>Delete Card</span>
              </button>
            )}

            {/* Delete Smaller Container / Block */}
            {selectedBlockInfo && (
              <button
                type="button"
                onClick={() =>
                  deleteSectionOrBlock(
                    selectedBlockInfo.key,
                    selectedBlockInfo.label
                  )
                }
                className="cursor-pointer inline-flex items-center gap-1 rounded-ka border border-rose-300/70 bg-rose-900/90 px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-ivory hover:bg-rose-700 transition-colors"
              >
                <BoxSelect className="h-3 w-3" />
                <span>Delete Container / Block</span>
              </button>
            )}

            {/* Delete Outer Subsection (if nested) */}
            {selectedParentBlockInfo && (
              <button
                type="button"
                onClick={() =>
                  deleteSectionOrBlock(
                    selectedParentBlockInfo.key,
                    selectedParentBlockInfo.label
                  )
                }
                className="cursor-pointer inline-flex items-center gap-1 rounded-ka border border-rose-300/70 bg-rose-950/90 px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-rose-100 hover:bg-rose-800 transition-colors"
              >
                <Layers className="h-3 w-3" />
                <span>Delete Subsection</span>
              </button>
            )}

            {/* Delete Full Section */}
            {selectedSectionMeta && (
              <button
                type="button"
                onClick={() =>
                  deleteSectionOrBlock(
                    selectedSectionMeta.id,
                    selectedSectionMeta.label
                  )
                }
                className="cursor-pointer inline-flex items-center gap-1.5 rounded-ka bg-rose-700 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-ivory shadow-md hover:bg-rose-600 transition-colors"
              >
                <Trash2 className="h-3 w-3" />
                <span>Delete Entire Section</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                setSelectedSectionId(null);
                setSelectedEnclosingSectionId(null);
                setSelectedCardInfo(null);
                setSelectedBlockInfo(null);
                setSelectedParentBlockInfo(null);
              }}
              className="cursor-pointer rounded-ka p-1 text-cream/70 hover:bg-white/10 hover:text-ivory"
              aria-label="Clear selection"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

      {/* =====================================================================
          FLOATING VISUAL QUICK-EDIT DOCK (STRICTLY ADMIN-ONLY)
      ===================================================================== */}
      {isAdminAuthenticated && !isAdminRoute && (
        <div
          data-ve-ignore="true"
          className="fixed bottom-4 left-4 z-[80] flex flex-wrap items-center gap-2"
        >
          {!editMode ? (
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setEditMode(true)}
                className="cursor-pointer group inline-flex items-center gap-2.5 rounded-ka border border-gold/65 bg-forest/95 px-4 py-2.5 text-xs font-semibold text-ivory shadow-[0_10px_30px_rgba(6,59,37,0.35)] backdrop-blur-md hover:-translate-y-0.5 hover:bg-green transition-all"
                title="Turn ON Visual Quick-Edit Mode to edit any text, replace images or logos, or delete sections and containers"
              >
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gold/20 text-gold-light group-hover:bg-gold group-hover:text-forest transition-colors">
                  <Pencil className="h-3.5 w-3.5" />
                </span>
                <span>Quick Visual Edit: OFF</span>
                <span className="rounded-full bg-gold/25 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-gold-light">
                  Turn ON
                </span>
              </button>
              <Link
                href="/admin/leads"
                className="inline-flex items-center gap-1.5 rounded-ka border border-gold/50 bg-forest/90 px-3 py-2.5 text-[11px] font-semibold text-gold-light shadow-lg backdrop-blur-md hover:bg-green transition-colors"
                title={`Signed in as ${adminSession?.email}`}
              >
                <ShieldCheck className="h-3.5 w-3.5 text-gold" />
                <span>Admin Portal</span>
              </Link>
            </div>
          ) : (
            <div className="flex flex-wrap items-center gap-2 rounded-ka border-2 border-gold bg-forest/98 p-2 sm:px-4 sm:py-2.5 text-xs text-ivory shadow-[0_16px_45px_rgba(0,0,0,0.45)] backdrop-blur-md">
              <div className="flex items-center gap-2 pr-2 border-r border-cream/20">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-gold" />
                </span>
                <div>
                  <p className="font-bold uppercase tracking-wider text-gold-light text-[11px]">
                    Visual Quick-Edit: ON
                  </p>
                  <p className="text-[10px] text-cream/80 hidden sm:block">
                    Hover images to replace · Click or double-click any section
                    or container to delete
                  </p>
                </div>
              </div>

              <button
                type="button"
                disabled={savingAll}
                onClick={saveAllChangesToFirebase}
                className="cursor-pointer inline-flex items-center gap-1.5 rounded-ka bg-gold px-3.5 py-2 text-[11px] font-bold uppercase tracking-wider text-forest hover:bg-gold-light transition-colors disabled:opacity-60"
              >
                {savingAll ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save className="h-3.5 w-3.5" />
                    <span>Save All Changes</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setShowSectionManager(true)}
                className="cursor-pointer inline-flex items-center gap-1.5 rounded-ka border border-rose-300/60 bg-rose-900/70 px-3 py-2 text-[11px] font-semibold text-ivory hover:bg-rose-700 transition-colors"
              >
                <Trash2 className="h-3.5 w-3.5 text-rose-200" />
                <span>
                  Manage Sections &amp; Blocks
                  {deletedSections.length > 0
                    ? ` (${deletedSections.length} Hidden)`
                    : ""}
                </span>
              </button>

              <button
                type="button"
                onClick={() =>
                  openImageEditor({
                    slotKey: "hero.0",
                    label: "Hero Slideshow Images (Slides 1–5)",
                    currentSrc:
                      imageOverrides["hero.0"] ||
                      SITE_IMAGE_SLOTS[0]?.defaultUrl ||
                      "",
                    defaultSrc: SITE_IMAGE_SLOTS[0]?.defaultUrl || "",
                  })
                }
                className="cursor-pointer inline-flex items-center gap-1.5 rounded-ka border border-gold/45 bg-green/45 px-3 py-2 text-[11px] font-semibold text-gold-light hover:bg-green transition-colors"
              >
                <ImageIcon className="h-3.5 w-3.5" />
                <span>Replace Hero Slides</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setEditMode(false);
                  setSelectedTextKey(null);
                  setSelectedSectionId(null);
                  setSelectedCardInfo(null);
                  setSelectedBlockInfo(null);
                  setSelectedParentBlockInfo(null);
                  setActiveImageTarget(null);
                  setShowSectionManager(false);
                }}
                className="cursor-pointer inline-flex items-center gap-1 rounded-ka border border-cream/25 bg-black/25 px-3 py-2 text-[11px] font-semibold text-cream hover:bg-black/45 transition-colors"
              >
                <Eye className="h-3.5 w-3.5 text-gold-light" />
                <span>Turn OFF (Preview)</span>
              </button>
            </div>
          )}

          {lastSavedMessage && (
            <div className="inline-flex items-center gap-1.5 rounded-ka border border-gold bg-green px-3.5 py-2 text-xs font-semibold text-ivory shadow-lg animate-panel-enter">
              <Check className="h-3.5 w-3.5 text-gold-light shrink-0" />
              <span>{lastSavedMessage}</span>
            </div>
          )}
        </div>
      )}

      {/* =====================================================================
          FLOATING TEXT ELEMENT & BLOCK QUICK-EDITOR PANEL
      ===================================================================== */}
      {editMode && selectedTextKey && !isAdminRoute && (
        <div
          data-ve-ignore="true"
          className="fixed bottom-20 right-4 z-[85] w-[min(92vw,28rem)] rounded-ka border-2 border-gold bg-ivory p-4 sm:p-5 text-charcoal shadow-[0_20px_60px_rgba(6,59,37,0.3)] animate-modal-enter"
        >
          <div className="flex items-start justify-between gap-3 border-b border-charcoal/15 pb-2.5">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-ka bg-forest text-gold-light">
                <Type className="h-4 w-4" />
              </span>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-gold-dark">
                  Edit Website Text ({selectedTextTag.toUpperCase()})
                </p>
                <p className="text-xs font-semibold text-forest truncate max-w-[230px]">
                  {selectedSectionMeta?.label || "Live Text Editor"}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                if (selectedElementRef.current) {
                  selectedElementRef.current.removeAttribute(
                    "data-ve-selected"
                  );
                }
                setSelectedTextKey(null);
              }}
              className="cursor-pointer rounded-ka p-1 text-charcoal/60 hover:bg-cream hover:text-charcoal"
              aria-label="Close text editor"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-3 space-y-3 text-xs">
            <div>
              <label className="block text-[10px] font-semibold uppercase tracking-wider text-charcoal/75 mb-1">
                Live Text Content (Updates Page Instantly)
              </label>
              <textarea
                rows={4}
                value={selectedTextValue}
                onChange={(e) => handleTextDraftChange(e.target.value)}
                className="w-full rounded-ka border border-charcoal/25 bg-cream/25 p-2.5 text-xs sm:text-sm text-charcoal focus:border-green focus:outline-none"
                placeholder="Enter text content..."
              />
            </div>

            <div className="flex items-center justify-between gap-2 pt-1">
              <button
                type="button"
                disabled={savingText}
                onClick={handleResetSelectedText}
                className="cursor-pointer inline-flex items-center gap-1 rounded-ka border border-charcoal/20 px-3 py-2 text-[11px] font-semibold text-charcoal/75 hover:bg-cream transition-colors disabled:opacity-50"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Reset Default</span>
              </button>

              <button
                type="button"
                disabled={savingText}
                onClick={handleSaveSelectedText}
                className="cursor-pointer inline-flex items-center gap-1.5 rounded-ka bg-green px-4 py-2 text-[11px] font-semibold uppercase tracking-wider text-ivory hover:bg-forest transition-colors disabled:opacity-60"
              >
                {savingText ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save className="h-3.5 w-3.5" />
                    <span>Save Text</span>
                  </>
                )}
              </button>
            </div>

            {/* Granular Delete Options: Card, Container/Block, Subsection, or Entire Section */}
            {(selectedCardInfo ||
              selectedBlockInfo ||
              selectedParentBlockInfo ||
              selectedSectionMeta) && (
              <div className="mt-2 pt-3 border-t border-charcoal/15 space-y-2">
                <p className="text-[10px] font-bold uppercase tracking-wider text-rose-800">
                  Delete Unwanted Block, Subsection or Section
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {selectedCardInfo && (
                    <button
                      type="button"
                      onClick={() =>
                        deleteSectionOrBlock(
                          selectedCardInfo.key,
                          selectedCardInfo.label
                        )
                      }
                      className="cursor-pointer inline-flex items-center gap-1 rounded-ka border border-rose-300 bg-rose-50 px-2.5 py-1.5 text-[11px] font-semibold text-rose-800 hover:bg-rose-100 transition-colors"
                    >
                      <Trash2 className="h-3 w-3" />
                      <span>Delete This Card</span>
                    </button>
                  )}

                  {selectedBlockInfo && (
                    <button
                      type="button"
                      onClick={() =>
                        deleteSectionOrBlock(
                          selectedBlockInfo.key,
                          selectedBlockInfo.label
                        )
                      }
                      className="cursor-pointer inline-flex items-center gap-1 rounded-ka border border-rose-300 bg-rose-50 px-2.5 py-1.5 text-[11px] font-semibold text-rose-800 hover:bg-rose-100 transition-colors"
                    >
                      <BoxSelect className="h-3 w-3" />
                      <span>Delete Container ({selectedBlockInfo.label})</span>
                    </button>
                  )}

                  {selectedParentBlockInfo && (
                    <button
                      type="button"
                      onClick={() =>
                        deleteSectionOrBlock(
                          selectedParentBlockInfo.key,
                          selectedParentBlockInfo.label
                        )
                      }
                      className="cursor-pointer inline-flex items-center gap-1 rounded-ka border border-rose-300 bg-rose-100 px-2.5 py-1.5 text-[11px] font-semibold text-rose-900 hover:bg-rose-200 transition-colors"
                    >
                      <Layers className="h-3 w-3" />
                      <span>
                        Delete Subsection ({selectedParentBlockInfo.label})
                      </span>
                    </button>
                  )}

                  {selectedSectionMeta && (
                    <button
                      type="button"
                      onClick={() =>
                        deleteSectionOrBlock(
                          selectedSectionMeta.id,
                          selectedSectionMeta.label
                        )
                      }
                      className="cursor-pointer inline-flex items-center gap-1 rounded-ka bg-rose-700 px-3 py-1.5 text-[11px] font-semibold text-ivory hover:bg-rose-800 transition-colors"
                    >
                      <Trash2 className="h-3 w-3" />
                      <span>Delete {selectedSectionMeta.label}</span>
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* =====================================================================
          WEBSITE SECTIONS & SUBSECTIONS MANAGER MODAL
      ===================================================================== */}
      {showSectionManager && !isAdminRoute && (
        <div
          data-ve-ignore="true"
          className="fixed inset-0 z-[95] flex items-center justify-center bg-black/75 p-4 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
          aria-label="Manage Website Sections and Blocks"
          onClick={() => setShowSectionManager(false)}
        >
          <div
            className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-ka border-2 border-gold bg-ivory p-5 sm:p-7 text-charcoal shadow-2xl animate-modal-enter"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3 border-b border-charcoal/15 pb-3">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-gold-dark flex items-center gap-1.5">
                  <Layers className="h-3.5 w-3.5 text-gold" />
                  <span>Visual Section &amp; Block Manager</span>
                </p>
                <h3 className="font-display text-2xl sm:text-3xl text-green mt-0.5">
                  Delete or Restore Sections &amp; Containers
                </h3>
                <p className="text-xs text-charcoal/70 mt-0.5">
                  Click or double-click any section, subsection, container or
                  card on the page to delete it, or manage and restore them
                  below.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowSectionManager(false)}
                className="cursor-pointer rounded-ka p-1.5 text-charcoal/70 hover:bg-cream"
                aria-label="Close section manager"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {deletedSubElements.length > 0 && (
              <div className="mt-4 rounded-ka border border-rose-200 bg-rose-50/60 p-3.5 space-y-2">
                <p className="text-xs font-bold uppercase tracking-wider text-rose-900">
                  Deleted Subsections, Containers &amp; Cards (
                  {deletedSubElements.length})
                </p>
                <div className="flex flex-wrap gap-2">
                  {deletedSubElements.map((subKey, idx) => {
                    const readableLabel =
                      blockLabelRegistry[subKey] ||
                      (subKey.startsWith("card::")
                        ? `Deleted Card ${idx + 1}`
                        : `Deleted Container ${idx + 1}`);
                    return (
                      <button
                        key={subKey}
                        type="button"
                        onClick={() =>
                          restoreSectionOrBlock(subKey, readableLabel)
                        }
                        className="cursor-pointer inline-flex items-center gap-1.5 rounded-ka border border-charcoal/20 bg-ivory px-3 py-1.5 text-xs font-semibold text-forest hover:bg-cream shadow-xs"
                      >
                        <RotateCcw className="h-3 w-3 text-green" />
                        <span>Restore: {readableLabel}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="mt-4 space-y-2.5">
              {WEBSITE_SECTIONS.map((sec) => {
                const isDeleted = deletedSections.includes(sec.id);
                return (
                  <div
                    key={sec.id}
                    className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-ka border p-3.5 transition-colors ${
                      isDeleted
                        ? "border-rose-300 bg-rose-50/70"
                        : "border-charcoal/15 bg-cream/25 hover:border-gold"
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-display text-lg font-semibold text-forest">
                          {sec.label}
                        </span>
                        {isDeleted && (
                          <span className="rounded-full bg-rose-700 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-ivory">
                            Deleted
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-charcoal/75 mt-0.5">
                        {sec.description}
                      </p>
                    </div>

                    <div className="shrink-0">
                      {isDeleted ? (
                        <button
                          type="button"
                          onClick={() =>
                            restoreSectionOrBlock(sec.id, sec.label)
                          }
                          className="cursor-pointer inline-flex items-center gap-1.5 rounded-ka bg-green px-3.5 py-2 text-xs font-semibold text-ivory hover:bg-forest transition-colors"
                        >
                          <RotateCcw className="h-3.5 w-3.5" />
                          <span>Restore Section</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() =>
                            deleteSectionOrBlock(sec.id, sec.label)
                          }
                          className="cursor-pointer inline-flex items-center gap-1.5 rounded-ka border border-rose-300 bg-ivory px-3.5 py-2 text-xs font-semibold text-rose-700 hover:bg-rose-700 hover:text-ivory transition-colors"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          <span>Delete Section</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-5 flex items-center justify-end border-t border-charcoal/15 pt-4">
              <button
                type="button"
                onClick={() => setShowSectionManager(false)}
                className="cursor-pointer rounded-ka bg-forest px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-gold-light hover:bg-green"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          REPLACE IMAGE MODAL (SELECT FROM MEDIA LIBRARY OR UPLOAD FROM PC)
      ===================================================================== */}
      {activeImageTarget && !isAdminRoute && (
        <div
          data-ve-ignore="true"
          className="fixed inset-0 z-[90] flex items-center justify-center bg-black/75 p-3 sm:p-4 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
          aria-label="Replace Website Image"
          onClick={() => setActiveImageTarget(null)}
        >
          <div
            className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-ka border-2 border-gold bg-ivory p-4 sm:p-6 text-charcoal shadow-2xl animate-modal-enter"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Clean Public Header — Zero Backend or Slot Key Mentions */}
            <div className="flex items-start justify-between gap-3 border-b border-charcoal/15 pb-3">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-gold-dark flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-gold" />
                  <span>Quick Image Editor</span>
                </p>
                <h3 className="font-display text-2xl text-green mt-0.5">
                  {sanitizePublicLabel(
                    activeImageTarget.label,
                    "Website Photograph"
                  )}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveImageTarget(null)}
                className="cursor-pointer rounded-ka p-1.5 text-charcoal/70 hover:bg-cream"
                aria-label="Close image editor"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* If editing Hero Slideshow, allow switching between all 5 Hero Slides */}
            {isEditingHeroSlot && heroSlideSlots.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1.5 border-b border-charcoal/10 pb-3">
                {heroSlideSlots.map((slot, idx) => {
                  const active = activeImageTarget.slotKey === slot.key;
                  return (
                    <button
                      key={slot.key}
                      type="button"
                      onClick={() => {
                        const cur =
                          imageOverrides[slot.key] || slot.defaultUrl;
                        setActiveImageTarget({
                          slotKey: slot.key,
                          label: sanitizePublicLabel(
                            slot.label,
                            `Hero Slide ${idx + 1}`
                          ),
                          currentSrc: cur,
                          defaultSrc: slot.defaultUrl,
                        });
                        setImageModalNotice(null);
                      }}
                      className={`cursor-pointer rounded-ka px-2.5 py-1 text-[11px] font-semibold transition-colors ${
                        active
                          ? "bg-forest text-gold-light"
                          : "bg-cream/60 text-charcoal hover:bg-cream"
                      }`}
                    >
                      Hero Slide {idx + 1}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Current Image Preview Banner */}
            <div className="my-3.5 grid grid-cols-1 sm:grid-cols-12 gap-3 items-center rounded-ka border border-charcoal/15 bg-cream/30 p-3">
              <div className="sm:col-span-5 relative aspect-[16/10] w-full overflow-hidden rounded-ka border border-charcoal/15 bg-forest">
                {activeImageTarget.currentSrc ? (
                  <Image
                    src={activeImageTarget.currentSrc}
                    alt={sanitizePublicLabel(
                      activeImageTarget.label,
                      "Selected Photograph"
                    )}
                    fill
                    unoptimized
                    className={
                      activeImageTarget.slotKey.startsWith("brand.")
                        ? "object-contain p-3"
                        : "object-cover"
                    }
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-xs text-cream/70">
                    No image selected
                  </div>
                )}
              </div>
              <div className="sm:col-span-7 space-y-2.5 text-xs">
                <p className="text-[10px] font-bold uppercase tracking-wider text-forest">
                  Current Preview
                </p>
                <p className="text-charcoal/80 leading-relaxed">
                  Upload a new file directly from your computer below, or choose
                  an existing image from your <strong>Media Library</strong>.
                </p>
                <div className="pt-0.5">
                  <label className="cursor-pointer inline-flex items-center gap-2 rounded-ka bg-gold px-4 py-2 text-xs font-bold uppercase tracking-wider text-forest shadow-sm hover:bg-gold-light transition-colors">
                    {uploadingImage ? (
                      <>
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        <span>Uploading...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="h-3.5 w-3.5" />
                        <span>Upload New from Computer</span>
                      </>
                    )}
                    <input
                      type="file"
                      accept="image/*,.svg"
                      disabled={uploadingImage || savingImage}
                      onChange={(e) =>
                        handleUploadImageFile(e.target.files?.[0])
                      }
                      className="hidden"
                    />
                  </label>
                </div>
                {imageModalNotice && (
                  <div className="rounded-ka border border-gold bg-forest px-3 py-2 text-ivory flex items-center gap-2 text-xs">
                    <Check className="h-4 w-4 text-gold-light shrink-0" />
                    <span>{imageModalNotice}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Mode Switch Tabs: 1) Select from Media Library  2) Upload from Computer */}
            <div className="flex flex-wrap items-center gap-2 border-b border-charcoal/15 pb-3">
              <button
                type="button"
                onClick={() => setImageEditorTab("library")}
                className={`cursor-pointer inline-flex items-center gap-2 rounded-ka px-4 py-2 text-xs font-bold uppercase tracking-wider transition-colors ${
                  imageEditorTab === "library"
                    ? "bg-forest text-gold-light shadow-sm"
                    : "bg-cream/60 text-charcoal hover:bg-cream"
                }`}
              >
                <ImageIcon className="h-3.5 w-3.5 text-gold" />
                <span>
                  Select from Media Library ({storageLibrary.length})
                </span>
              </button>

              <button
                type="button"
                onClick={() => setImageEditorTab("upload")}
                className={`cursor-pointer inline-flex items-center gap-2 rounded-ka px-4 py-2 text-xs font-bold uppercase tracking-wider transition-colors ${
                  imageEditorTab === "upload"
                    ? "bg-forest text-gold-light shadow-sm"
                    : "bg-cream/60 text-charcoal hover:bg-cream"
                }`}
              >
                <Upload className="h-3.5 w-3.5 text-gold" />
                <span>Upload from Computer</span>
              </button>
            </div>

            {/* TAB 1: SELECT FROM MEDIA LIBRARY */}
            {imageEditorTab === "library" && (
              <div className="mt-4 space-y-3 text-xs">
                <div className="flex flex-col sm:flex-row gap-2 sm:items-center justify-between">
                  <div className="relative flex-1">
                    <Search className="h-3.5 w-3.5 text-charcoal/50 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={librarySearch}
                      onChange={(e) => setLibrarySearch(e.target.value)}
                      placeholder="Search media library (e.g. Hero, Arabuko, Poster, Maasai)..."
                      className="w-full rounded-ka border border-charcoal/25 bg-ivory pl-8 pr-3 py-2 text-xs text-charcoal focus:border-green focus:outline-none"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={refreshStorageLibrary}
                    disabled={loadingLibrary}
                    className="cursor-pointer inline-flex items-center gap-1.5 rounded-ka border border-charcoal/20 bg-cream/50 px-3 py-2 text-[11px] font-semibold text-forest hover:bg-cream"
                  >
                    <RefreshCw
                      className={`h-3.5 w-3.5 ${
                        loadingLibrary ? "animate-spin" : ""
                      }`}
                    />
                    <span>Refresh Library</span>
                  </button>
                </div>

                {/* Category Filter Pills */}
                <div className="flex flex-wrap gap-1.5">
                  {libraryCategories.map((cat) => {
                    const active = libraryCategory === cat;
                    return (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setLibraryCategory(cat)}
                        className={`cursor-pointer rounded-full px-3 py-1 text-[10px] font-semibold transition-colors ${
                          active
                            ? "bg-green text-ivory"
                            : "bg-cream/50 text-charcoal hover:bg-cream"
                        }`}
                      >
                        {cat}
                      </button>
                    );
                  })}
                </div>

                {/* Visual Grid of Uploaded Photographs */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 max-h-[340px] overflow-y-auto p-1">
                  {filteredLibraryImages.map((item, idx) => {
                    const isCurrent =
                      activeImageTarget.currentSrc === item.url;
                    const displayLabel = sanitizePublicLabel(
                      item.label,
                      `Photograph ${idx + 1}`
                    );
                    return (
                      <button
                        key={item.id}
                        type="button"
                        disabled={savingImage || uploadingImage}
                        onClick={() => handleSelectFromMediaLibrary(item.url)}
                        className={`cursor-pointer group relative flex flex-col overflow-hidden rounded-ka border-2 text-left transition-all ${
                          isCurrent
                            ? "border-gold ring-2 ring-gold/40 bg-forest/5"
                            : "border-charcoal/15 bg-ivory hover:border-green"
                        }`}
                      >
                        <div className="relative aspect-[4/3] w-full overflow-hidden bg-forest">
                          <Image
                            src={item.url}
                            alt={displayLabel}
                            fill
                            unoptimized
                            sizes="180px"
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 flex items-center justify-center bg-forest/70 opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="rounded-ka bg-gold px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-forest shadow">
                              Use This Image
                            </span>
                          </div>
                          {isCurrent && (
                            <span className="absolute top-1.5 right-1.5 rounded-full bg-gold px-2 py-0.5 text-[9px] font-bold uppercase text-forest shadow">
                              Active
                            </span>
                          )}
                        </div>
                        <div className="p-2">
                          <p className="font-semibold text-[11px] text-forest line-clamp-1">
                            {displayLabel}
                          </p>
                          <p className="text-[9px] text-charcoal/60 truncate">
                            {item.category}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB 2: UPLOAD FROM COMPUTER */}
            {imageEditorTab === "upload" && (
              <div className="mt-4 space-y-4 text-xs">
                <label className="cursor-pointer flex flex-col items-center justify-center gap-2.5 rounded-ka border-2 border-dashed border-gold bg-cream/40 p-8 text-center font-semibold text-forest hover:border-green hover:bg-cream/70 transition-colors">
                  {uploadingImage ? (
                    <>
                      <Loader2 className="h-7 w-7 animate-spin text-green" />
                      <span className="text-sm">
                        Uploading photograph from your computer...
                      </span>
                    </>
                  ) : (
                    <>
                      <Upload className="h-7 w-7 text-green" />
                      <span className="text-sm font-bold text-forest">
                        Click to Select &amp; Upload Photo from Your Computer
                      </span>
                      <span className="text-[11px] text-charcoal/70">
                        Supports JPG, PNG, WEBP &amp; AVIF · Updates this
                        section immediately
                      </span>
                    </>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    disabled={uploadingImage || savingImage}
                    onChange={(e) => handleUploadImageFile(e.target.files?.[0])}
                    className="hidden"
                  />
                </label>
              </div>
            )}

            {/* Footer Controls */}
            <div className="mt-5 flex items-center justify-between gap-2 border-t border-charcoal/15 pt-3.5">
              <button
                type="button"
                disabled={savingImage || uploadingImage}
                onClick={handleResetImageSlot}
                className="cursor-pointer inline-flex items-center gap-1 rounded-ka border border-charcoal/20 px-3 py-2 text-[11px] font-semibold text-charcoal/75 hover:bg-cream transition-colors disabled:opacity-50"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Reset Default</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveImageTarget(null)}
                className="cursor-pointer rounded-ka bg-forest px-5 py-2 text-xs font-semibold uppercase tracking-wider text-gold-light hover:bg-green"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </VisualEditContext.Provider>
  );
}
