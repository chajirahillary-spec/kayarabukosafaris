import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  setDoc,
} from "firebase/firestore";
import { getFirebaseDb } from "./client";
import { destinations as localDestinations } from "@/data/destinations";
import { safaris as localSafaris } from "@/data/safaris";
import {
  SAVED_FIREBASE_IMAGE_OVERRIDES,
  communityProfiles as localCommunities,
  experiences as localExperiences,
  regionFeatures as localRegions,
  stories as localStories,
  visitExperiences as localVisitExperiences,
} from "@/data/content";
import { KAYARABUKO_LOGO_URL, site } from "@/data/site";
import type {
  CommunityProfile,
  Destination,
  Experience,
  RegionFeature,
  Safari,
  SocialLink,
  Story,
  VisitExperience,
} from "@/lib/types";
import type { Lead, LeadStatus } from "@/lib/bookings/types";

const ORG_ID = process.env.NEXT_PUBLIC_ORGANIZATION_ID || "kayarabuko-safaris";
const BUCKET =
  process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ||
  "legaprimed.firebasestorage.app";

export function getStorageBucketUrl(path: string): string {
  const encoded = encodeURIComponent(path);
  return `https://firebasestorage.googleapis.com/v0/b/${BUCKET}/o/${encoded}?alt=media`;
}

export interface PlatformSettings {
  companyName: string;
  tagline: string;
  brandStatement: string;
  supportingStatement: string;
  closingStatement: string;
  logoStorageUrl: string;
  useStorageLogo: boolean;
  officeAddress: string;
  coastalBranch: string;
  primaryPhone: string;
  whatsappNumber: string;
  emergencyPhone: string;
  email: string;
  reservationsEmail: string;
  adminEmail: string;
  socialLinks: SocialLink[];
  heroHeadline: string;
  heroDescription: string;
  introHeadline: string;
  aboutHeadline: string;
  contactHeadline: string;
  katoLicense: string;
  traLicense: string;
  usdToKesRate: number;
  mpesaShortcode: string;
  mpesaType: string;
  stripeConfigured: boolean;
  defaultDepositPercent: number;
  orgId: string;
  googleAnalyticsId: string;
}

export const DEFAULT_PLATFORM_SETTINGS: PlatformSettings = {
  companyName: site.name,
  tagline: site.tagline,
  brandStatement: site.statement,
  supportingStatement: site.supporting,
  closingStatement: site.closingStatement,
  logoStorageUrl: KAYARABUKO_LOGO_URL,
  useStorageLogo: true,
  officeAddress: "Watamu, Timboni Stage, Kilifi County, Kenya",
  coastalBranch: "Watamu, Timboni Stage · Managed by Kaya Experience Ltd",
  primaryPhone: "+254 728 560303 / +254 712 863538",
  whatsappNumber: "254728560303",
  emergencyPhone: "+254 712 863538",
  email: site.contact.email,
  reservationsEmail: "kayaroots@kayarabuko.com",
  adminEmail: process.env.NEXT_PUBLIC_ADMIN_EMAIL || "admin@kayarabuko.com",
  socialLinks: [...site.social],
  heroHeadline: "Discover Kenya Beyond the Ordinary.",
  heroDescription:
    "From ancient cultural traditions and vibrant communities to remarkable forests and living ecosystems, discover the stories, people and natural heritage that make Kenya extraordinary.",
  introHeadline: "Kenya Is More Than a Destination. It's a Living Story.",
  aboutHeadline: "Rooted in Discovery. Driven by Preservation.",
  contactHeadline: "Your Journey Into Kenya's Stories Starts Here.",
  katoLicense: "",
  traLicense: "",
  usdToKesRate: 130.0,
  mpesaShortcode: "",
  mpesaType: "Paybill",
  stripeConfigured: false,
  defaultDepositPercent: 30,
  orgId: ORG_ID,
  googleAnalyticsId: "",
};

export const INITIAL_SEED_LEADS: Lead[] = [
  {
    id: "lead_seed_1",
    leadReference: "KA-ENQ-4910",
    name: "Dr. Amani Mwangi",
    email: "amwangi@example.org",
    phone: "+254 712 345 678",
    country: "Kenya",
    travelDates: "December 2026",
    travellerCount: 4,
    areaOfInterest: "Forest Walks & Biodiversity Discovery",
    preferredLocation: "Arabuko-Sokoke Forest & Mijikenda Kayas",
    interestedDestinations: ["Arabuko-Sokoke Forest"],
    interestedStyles: ["conservation"],
    source: "direct",
    status: "new",
    notes:
      "Interested in endemic birding and learning about community butterfly farming and beekeeping around Arabuko-Sokoke.",
    createdAt: "2026-11-10T14:10:00.000Z",
  },
  {
    id: "lead_seed_2",
    leadReference: "KA-ENQ-4908",
    name: "Clara Lindqvist",
    email: "clara.l@example.se",
    phone: "+46 70 123 45 67",
    country: "Sweden",
    travelDates: "January 2027",
    travellerCount: 2,
    areaOfInterest: "Cultural & Heritage Visits",
    preferredLocation: "The Samburu & Northern Kenya",
    interestedDestinations: ["Northern Kenya"],
    interestedStyles: ["cultural"],
    source: "whatsapp",
    status: "contacted",
    notes:
      "Keen on respectful community-hosted cultural discovery and visiting northern community conservancies.",
    createdAt: "2026-11-08T09:32:00.000Z",
  },
  {
    id: "lead_seed_3",
    leadReference: "KA-ENQ-4904",
    name: "Marcus Sterling",
    email: "marcus.s@example.co.uk",
    phone: "+44 7911 123456",
    country: "United Kingdom",
    travelDates: "Flexible",
    travellerCount: 2,
    areaOfInterest: "Heritage Sites & Historical Exploration",
    preferredLocation: "The Swahili Coast (Watamu, Malindi & Lamu)",
    interestedDestinations: ["The Kenyan Coast"],
    interestedStyles: ["cultural"],
    source: "google",
    status: "qualified",
    notes:
      "Looking to explore Swahili coral-stone architecture, traditional dhow building and coastal culinary heritage.",
    createdAt: "2026-11-05T18:24:00.000Z",
  },
];

export const FirestoreService = {
  /**
   * Fetch all visitor enquiries / contacts from Firestore (ordered newest first),
   * merging with seed enquiries if the collection is empty.
   */
  async getLeads(): Promise<Lead[]> {
    try {
      const db = getFirebaseDb();
      if (!db) return INITIAL_SEED_LEADS;

      const colRef = collection(db, "organizations", ORG_ID, "leads");
      const snap = await getDocs(colRef);

      if (!snap.empty) {
        const fromDb = snap.docs.map((docSnap) => ({
          ...(docSnap.data() as Lead),
          id: docSnap.id,
        }));
        return fromDb.sort(
          (a, b) =>
            new Date(b.createdAt || 0).getTime() -
            new Date(a.createdAt || 0).getTime()
        );
      }
    } catch (err) {
      console.warn("Firestore getLeads fallback to local data:", err);
    }
    return INITIAL_SEED_LEADS;
  },

  /**
   * Create or update a contact / inquiry in Firestore
   */
  async saveLead(lead: Lead): Promise<void> {
    const db = getFirebaseDb();
    if (!db) return;
    const docRef = doc(db, "organizations", ORG_ID, "leads", lead.id);
    await setDoc(docRef, lead, { merge: true });
  },

  /**
   * Update an inquiry's status and internal admin notes in Firestore
   */
  async updateLeadStatusAndNotes(
    leadId: string,
    status: LeadStatus,
    notes?: string
  ): Promise<void> {
    const db = getFirebaseDb();
    if (!db) return;
    const docRef = doc(db, "organizations", ORG_ID, "leads", leadId);
    const payload: Record<string, unknown> = {
      status,
      updatedAt: new Date().toISOString(),
    };
    if (typeof notes === "string") {
      payload.notes = notes;
    }
    await setDoc(docRef, payload, { merge: true });
  },

  /**
   * Delete a contact / inquiry from Firestore
   */
  async deleteLead(leadId: string): Promise<void> {
    const db = getFirebaseDb();
    if (!db) return;
    const docRef = doc(db, "organizations", ORG_ID, "leads", leadId);
    await deleteDoc(docRef);
  },

  /**
   * Fetch all cultural community profiles from Firestore, falling back to local dataset
   */
  async getCommunities(): Promise<CommunityProfile[]> {
    try {
      const db = getFirebaseDb();
      if (!db) return localCommunities;

      const colRef = collection(db, "organizations", ORG_ID, "communities");
      const snap = await getDocs(colRef);

      if (!snap.empty) {
        const fromDb = snap.docs.map(
          (docSnap) => docSnap.data() as CommunityProfile
        );
        const localMap = new Map(localCommunities.map((c) => [c.slug, c]));
        for (const item of fromDb) {
          const base = localMap.get(item.slug);
          const slotUrl =
            SAVED_FIREBASE_IMAGE_OVERRIDES[`community.${item.slug}`] ||
            base?.image?.src ||
            item.image?.src;
          localMap.set(item.slug, {
            ...base,
            ...item,
            image: {
              alt: item.image?.alt || base?.image?.alt || item.name,
              src: slotUrl,
            },
          });
        }
        return Array.from(localMap.values());
      }
    } catch (err) {
      console.warn("Firestore getCommunities fallback to local data:", err);
    }
    return localCommunities;
  },

  /**
   * Fetch all regional features from Firestore, falling back to local dataset
   */
  async getRegions(): Promise<RegionFeature[]> {
    try {
      const db = getFirebaseDb();
      if (!db) return localRegions;

      const colRef = collection(db, "organizations", ORG_ID, "regions");
      const snap = await getDocs(colRef);

      if (!snap.empty) {
        const fromDb = snap.docs.map(
          (docSnap) => docSnap.data() as RegionFeature
        );
        const localMap = new Map(localRegions.map((r) => [r.slug, r]));
        for (const item of fromDb) {
          const base = localMap.get(item.slug);
          const slotUrl =
            SAVED_FIREBASE_IMAGE_OVERRIDES[`region.${item.slug}`] ||
            base?.image?.src ||
            item.image?.src;
          localMap.set(item.slug, {
            ...base,
            ...item,
            image: {
              alt: item.image?.alt || base?.image?.alt || item.name,
              src: slotUrl,
            },
          });
        }
        return Array.from(localMap.values());
      }
    } catch (err) {
      console.warn("Firestore getRegions fallback to local data:", err);
    }
    return localRegions;
  },

  /**
   * Fetch all visit & experience categories from Firestore, falling back to local dataset
   */
  async getVisitExperiences(): Promise<VisitExperience[]> {
    try {
      const db = getFirebaseDb();
      if (!db) return localVisitExperiences;

      const colRef = collection(db, "organizations", ORG_ID, "visitExperiences");
      const snap = await getDocs(colRef);

      if (!snap.empty) {
        const fromDb = snap.docs.map(
          (docSnap) => docSnap.data() as VisitExperience
        );
        const localMap = new Map(
          localVisitExperiences.map((v) => [v.slug, v])
        );
        for (const item of fromDb) {
          const base = localMap.get(item.slug);
          const slotUrl =
            SAVED_FIREBASE_IMAGE_OVERRIDES[`experience.${item.slug}`] ||
            base?.image?.src ||
            item.image?.src;
          localMap.set(item.slug, {
            ...base,
            ...item,
            image: {
              alt: item.image?.alt || base?.image?.alt || item.title,
              src: slotUrl,
            },
          });
        }
        return Array.from(localMap.values());
      }
    } catch (err) {
      console.warn("Firestore getVisitExperiences fallback to local data:", err);
    }
    return localVisitExperiences;
  },

  /**
   * Fetch all destinations from Firestore, falling back to local dataset if offline or empty
   */
  async getDestinations(): Promise<Destination[]> {
    try {
      const db = getFirebaseDb();
      if (!db) return localDestinations;

      const colRef = collection(db, "organizations", ORG_ID, "destinations");
      const snap = await getDocs(colRef);

      if (!snap.empty) {
        const fromDb = snap.docs.map(
          (docSnap) => docSnap.data() as Destination
        );
        const localMap = new Map(localDestinations.map((d) => [d.slug, d]));
        for (const item of fromDb) {
          localMap.set(item.slug, { ...localMap.get(item.slug), ...item });
        }
        return Array.from(localMap.values());
      }
    } catch (err) {
      console.warn("Firestore getDestinations fallback to local data:", err);
    }
    return localDestinations;
  },

  /**
   * Fetch specific destination by slug
   */
  async getDestinationBySlug(slug: string): Promise<Destination | undefined> {
    try {
      const db = getFirebaseDb();
      if (db) {
        const docRef = doc(db, "organizations", ORG_ID, "destinations", slug);
        const snap = await getDoc(docRef);
        if (snap.exists()) {
          const local = localDestinations.find((d) => d.slug === slug);
          return { ...(local || {}), ...(snap.data() as Destination) };
        }
      }
    } catch (err) {
      console.warn(`Firestore getDestinationBySlug (${slug}) fallback:`, err);
    }
    return localDestinations.find((d) => d.slug === slug);
  },

  /**
   * Fetch all safaris from Firestore
   */
  async getSafaris(): Promise<Safari[]> {
    try {
      const db = getFirebaseDb();
      if (!db) return localSafaris;

      const colRef = collection(db, "organizations", ORG_ID, "safaris");
      const snap = await getDocs(colRef);

      if (!snap.empty) {
        const fromDb = snap.docs.map((docSnap) => docSnap.data() as Safari);
        const localMap = new Map(localSafaris.map((s) => [s.slug, s]));
        for (const item of fromDb) {
          localMap.set(item.slug, { ...localMap.get(item.slug), ...item });
        }
        return Array.from(localMap.values());
      }
    } catch (err) {
      console.warn("Firestore getSafaris fallback to local data:", err);
    }
    return localSafaris;
  },

  /**
   * Fetch specific safari by slug
   */
  async getSafariBySlug(slug: string): Promise<Safari | undefined> {
    try {
      const db = getFirebaseDb();
      if (db) {
        const docRef = doc(db, "organizations", ORG_ID, "safaris", slug);
        const snap = await getDoc(docRef);
        if (snap.exists()) {
          const local = localSafaris.find((s) => s.slug === slug);
          return { ...(local || {}), ...(snap.data() as Safari) };
        }
      }
    } catch (err) {
      console.warn(`Firestore getSafariBySlug (${slug}) fallback:`, err);
    }
    return localSafaris.find((s) => s.slug === slug);
  },

  /**
   * Fetch all experiences from Firestore
   */
  async getExperiences(): Promise<Experience[]> {
    try {
      const db = getFirebaseDb();
      if (!db) return localExperiences;

      const colRef = collection(db, "organizations", ORG_ID, "experiences");
      const snap = await getDocs(colRef);

      if (!snap.empty) {
        const fromDb = snap.docs.map((d) => d.data() as Experience);
        const localMap = new Map(localExperiences.map((e) => [e.slug, e]));
        for (const item of fromDb) {
          localMap.set(item.slug, { ...localMap.get(item.slug), ...item });
        }
        return Array.from(localMap.values());
      }
    } catch (err) {
      console.warn("Firestore getExperiences fallback:", err);
    }
    return localExperiences;
  },

  /**
   * Fetch all stories from Firestore
   */
  async getStories(): Promise<Story[]> {
    try {
      const db = getFirebaseDb();
      if (!db) return localStories;

      const colRef = collection(db, "organizations", ORG_ID, "stories");
      const snap = await getDocs(colRef);

      if (!snap.empty) {
        const fromDb = snap.docs.map((d) => d.data() as Story);
        const localMap = new Map(localStories.map((s) => [s.slug, s]));
        for (const item of fromDb) {
          const base = localMap.get(item.slug);
          const slotUrl =
            SAVED_FIREBASE_IMAGE_OVERRIDES[`story.${item.slug}`] ||
            base?.image?.src ||
            item.image?.src;
          localMap.set(item.slug, {
            ...base,
            ...item,
            image: {
              alt: item.image?.alt || base?.image?.alt || item.title,
              src: slotUrl,
            },
          });
        }
        return Array.from(localMap.values());
      }
    } catch (err) {
      console.warn("Firestore getStories fallback:", err);
    }
    return localStories;
  },

  /**
   * Fetch specific story by slug
   */
  async getStoryBySlug(slug: string): Promise<Story | undefined> {
    try {
      const db = getFirebaseDb();
      if (db) {
        const docRef = doc(db, "organizations", ORG_ID, "stories", slug);
        const snap = await getDoc(docRef);
        if (snap.exists()) {
          const local = localStories.find((s) => s.slug === slug);
          const item = snap.data() as Story;
          const slotUrl =
            SAVED_FIREBASE_IMAGE_OVERRIDES[`story.${slug}`] ||
            local?.image?.src ||
            item.image?.src;
          return {
            ...(local || {}),
            ...item,
            image: {
              alt: item.image?.alt || local?.image?.alt || item.title,
              src: slotUrl,
            },
          };
        }
      }
    } catch (err) {
      console.warn(`Firestore getStoryBySlug (${slug}) fallback:`, err);
    }
    return localStories.find((s) => s.slug === slug);
  },

  /**
   * Load Platform Settings from Firestore
   */
  async getPlatformSettings(): Promise<PlatformSettings> {
    try {
      const db = getFirebaseDb();
      if (db) {
        const docRef = doc(db, "organizations", ORG_ID, "settings", "platform");
        const snap = await getDoc(docRef);
        if (snap.exists()) {
          const remote = snap.data() as Partial<PlatformSettings>;
          const merged: PlatformSettings = {
            ...DEFAULT_PLATFORM_SETTINGS,
            ...remote,
          };
          // Upgrade any legacy placeholder or non-+254 contact values to the owner's official +254 contacts
          if (
            !merged.primaryPhone ||
            merged.primaryPhone.includes("700 000") ||
            merged.primaryPhone.includes("700000")
          ) {
            merged.primaryPhone = DEFAULT_PLATFORM_SETTINGS.primaryPhone;
          } else {
            merged.primaryPhone = merged.primaryPhone
              .replace(/\b0728\b/g, "+254 728")
              .replace(/\b0712\b/g, "+254 712");
          }
          if (merged.emergencyPhone) {
            merged.emergencyPhone = merged.emergencyPhone
              .replace(/\b0728\b/g, "+254 728")
              .replace(/\b0712\b/g, "+254 712");
          }
          if (
            !merged.whatsappNumber ||
            merged.whatsappNumber.includes("700000")
          ) {
            merged.whatsappNumber = DEFAULT_PLATFORM_SETTINGS.whatsappNumber;
          }
          if (
            !merged.officeAddress ||
            merged.officeAddress === "Kenya" ||
            merged.officeAddress === "Coastal Kenya"
          ) {
            merged.officeAddress = DEFAULT_PLATFORM_SETTINGS.officeAddress;
          }
          return merged;
        }
      }
    } catch (err) {
      console.warn(
        "Failed to load platform settings from Firestore, using default:",
        err
      );
    }
    return DEFAULT_PLATFORM_SETTINGS;
  },

  /**
   * Save Platform Settings to Firestore & update Brand Document
   */
  async savePlatformSettings(settings: PlatformSettings): Promise<void> {
    const db = getFirebaseDb();
    if (!db) {
      throw new Error("Firebase database client is not initialized.");
    }

    const platformRef = doc(
      db,
      "organizations",
      ORG_ID,
      "settings",
      "platform"
    );
    await setDoc(
      platformRef,
      { ...settings, updatedAt: new Date().toISOString() },
      { merge: true }
    );

    const brandRef = doc(db, "organizations", ORG_ID, "settings", "brand");
    await setDoc(
      brandRef,
      {
        companyName: settings.companyName,
        tagline: settings.tagline,
        statement: settings.brandStatement,
        supporting: settings.supportingStatement,
        logoUrl: settings.logoStorageUrl || KAYARABUKO_LOGO_URL,
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );
  },

  /**
   * Complete seeding function to push communities, regions, visit experiences, and stories into Firestore
   */
  async seedAllToFirestore(): Promise<{
    destinationsCount: number;
    safarisCount: number;
    experiencesCount: number;
    storiesCount: number;
    communitiesCount?: number;
    regionsCount?: number;
  }> {
    const db = getFirebaseDb();
    if (!db) {
      throw new Error("Firebase database client is not initialized.");
    }

    for (const c of localCommunities) {
      const commDoc = doc(db, "organizations", ORG_ID, "communities", c.slug);
      await setDoc(commDoc, c, { merge: true });
    }

    for (const r of localRegions) {
      const regDoc = doc(db, "organizations", ORG_ID, "regions", r.slug);
      await setDoc(regDoc, r, { merge: true });
    }

    for (const v of localVisitExperiences) {
      const expDoc = doc(
        db,
        "organizations",
        ORG_ID,
        "visitExperiences",
        v.slug
      );
      await setDoc(expDoc, v, { merge: true });
    }

    for (const st of localStories) {
      const storyDoc = doc(db, "organizations", ORG_ID, "stories", st.slug);
      await setDoc(storyDoc, st, { merge: true });
    }

    return {
      destinationsCount: localRegions.length,
      safarisCount: localCommunities.length,
      experiencesCount: localVisitExperiences.length,
      storiesCount: localStories.length,
      communitiesCount: localCommunities.length,
      regionsCount: localRegions.length,
    };
  },
};
