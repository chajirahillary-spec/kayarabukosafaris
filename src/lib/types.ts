/**
 * Domain model for KayArabuko — Cultural Discovery, Conservation & Community Empowerment Platform.
 * These shapes mirror the Firestore documents under organizations/{orgId}/...
 * so seed data can be seamlessly managed via the CMS.
 */

export type ThemeTag =
  | "wildlife"
  | "beach"
  | "adventure"
  | "culture"
  | "mountains"
  | "conservation"
  | "birding"
  | "marine"
  | "forest"
  | "community"
  | "heritage";

export interface ImageRef {
  /** Public path or Storage URL. When absent a branded placeholder renders. */
  src?: string;
  alt: string;
  credit?: string;
  /** Optional slot key for Firebase Storage visual editing & overrides. */
  slotKey?: string;
}

export interface Faq {
  question: string;
  answer: string;
}

export interface BrandPillar {
  id: "explore" | "conserve" | "empower";
  number: string;
  title: string;
  subtitle: string;
  description: string;
  highlights: string[];
  targetAnchor: string;
  ctaLabel: string;
  image: ImageRef;
}

export interface CommunityProfile {
  slug: string;
  name: string;
  region: string;
  tagline: string;
  introduction: string;
  discoveries: string[];
  livelihoodsAndHeritage: string;
  image: ImageRef;
  secondaryImage?: ImageRef;
}

export interface ConservationTheme {
  slug: string;
  title: string;
  description: string;
  keyFocusAreas: string[];
  image: ImageRef;
}

export interface ConservationSpotlight {
  title: string;
  subtitle: string;
  location: string;
  description: string;
  communityConnection: string;
  highlights: string[];
  inspirationNote: string;
  image: ImageRef;
}

export interface EcosystemHighlight {
  slug: string;
  name: string;
  region: string;
  focus: string;
  summary: string;
  image?: ImageRef;
}

export interface RegionFeature {
  slug: string;
  name: string;
  subtitle: string;
  description: string;
  highlights: string[];
  communitiesNote: string;
  conservationNote: string;
  image: ImageRef;
}

export interface VisitExperience {
  slug: string;
  title: string;
  pillar: "Explore" | "Conserve" | "Empower";
  description: string;
  highlights: string[];
  image: ImageRef;
}

export interface StoryCategory {
  slug: string;
  name: string;
}

export interface Story {
  slug: string;
  title: string;
  excerpt: string;
  categorySlug: string;
  author: string;
  publishedAt: string;
  readMinutes: number;
  image: ImageRef;
  /** Short editorial paragraphs; manageable via CMS. */
  body: string[];
  relatedDestinationSlugs: string[];
  relatedTopic?: string;
}

export interface SocialLink {
  label: string;
  href: string;
}

export interface ExcursionItem {
  slug: string;
  title: string;
  duration: string;
  location: string;
  category: string;
  description: string;
  activities: string[];
  image: ImageRef;
}

export interface AccommodationOption {
  slug: string;
  title: string;
  category: string;
  locations: string;
  description: string;
  amenities: string[];
  idealFor: string;
  image: ImageRef;
}

export interface TeamMember {
  slug: string;
  name: string;
  aka?: string;
  role: string;
  organization: string;
  bio: string;
  heritageMeaning?: string;
  focusAreas: string[];
  contactEmail?: string;
  contactPhone?: string;
  image: ImageRef;
}

export interface KayaRootsProgram {
  name: string;
  parentOrg: string;
  leadName: string;
  leadRole: string;
  email: string;
  secondaryEmail: string;
  headline: string;
  description: string;
  missionPoints: string[];
  regionsCovered: string[];
  cropsAndFocus: string[];
  image: ImageRef;
}

export interface PublishedPoster {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  dateLabel: string;
  description: string;
  image: ImageRef;
}

export interface ActivityGalleryItem {
  id: string;
  title: string;
  location: string;
  category:
    | "Real Safari Wildlife & Animals"
    | "Family & Kid-Friendly Stays"
    | "Mambrui Quad Bikes & Hell's Kitchen"
    | "Safari Blue Glass-Bottom Boat & Dolphins"
    | "Past Guests & Cultural Memories"
    | "Wildlife & Game Safaris"
    | "Forest & Birding Walks"
    | "Safari Blue, Dhows & Creek Rides"
    | "Cultural & Heritage Encounters"
    | "Villas & Coastal Stays";
  caption: string;
  featuredSpan?: boolean;
  image: ImageRef;
}

/** Legacy types preserved for compatibility with internal data modules */
export interface County {
  slug: string;
  name: string;
  region: string;
  summary: string;
  destinationSlugs: string[];
  alsoFeatured: string[];
  themes: ThemeTag[];
}

export interface Destination {
  slug: string;
  name: string;
  countySlugs: string[];
  regionNote?: string;
  region: string;
  type:
    | "national-park"
    | "reserve"
    | "lake"
    | "mountain"
    | "coast"
    | "forest"
    | "conservancy"
    | "heritage";
  tagline: string;
  summary: string;
  signatureExperience: string;
  knownFor: string[];
  themes: ThemeTag[];
  bestTime: string;
  wildlife: string[];
  activities: string[];
  culture: string;
  gettingThere: string;
  recommendedDuration: string;
  travelTips: string[];
  faqs: Faq[];
  relatedSlugs: string[];
  coords: { lat: number; lng: number };
  image: ImageRef;
}

export type SafariStyle =
  | "budget"
  | "mid-range"
  | "luxury"
  | "private"
  | "group"
  | "family"
  | "honeymoon"
  | "photography"
  | "wildlife"
  | "cultural"
  | "beach-and-safari"
  | "adventure"
  | "birding"
  | "walking-hiking"
  | "conservation";

export type Difficulty = "easy" | "moderate" | "demanding";
export type TransportType = "safari-van" | "land-cruiser" | "fly-in";
export type AccommodationTier = "budget" | "mid-range" | "luxury";

export interface ItineraryDay {
  day: number;
  title: string;
  from: string;
  to: string;
  summary: string;
  activities: string[];
  meals: ("Breakfast" | "Lunch" | "Dinner")[];
  accommodation: string;
  distanceKm?: number;
  travelTime?: string;
}

export interface Safari {
  slug: string;
  title: string;
  days: number;
  destinationSlugs: string[];
  countySlugs: string[];
  styles: SafariStyle[];
  tier: AccommodationTier;
  transport: TransportType;
  difficulty: Difficulty;
  departureFrom: string;
  groupTypes: ("private" | "shared" | "family" | "couple")[];
  wildlife: string[];
  activities: string[];
  shortDescription: string;
  overview: string;
  highlights: string[];
  itinerary: ItineraryDay[];
  included: string[];
  excluded: string[];
  fromPriceUsd: number;
  rating?: { score: number; count: number };
  popularity: number;
  publishedAt: string;
  accommodationNotes: string;
  faqs: Faq[];
  image: ImageRef;
  isSeed: boolean;
}

export interface Experience {
  slug: string;
  title: string;
  persona: string;
  blurb: string;
  styles: SafariStyle[];
  themes: ThemeTag[];
  image: ImageRef;
}

/**
 * Multi-Day Safari Package (Pollman's Safaris, Bonfire Adventures, Fragola Watamu & Watamu Safaris style).
 * Strictly no prices displayed — tailored quotes via WhatsApp Business (+254 728 560303) or Enquiry Form.
 */
export interface SafariPackageItem {
  slug: string;
  title: string;
  departureSubtitle: string;
  durationLabel: string;
  durationDays: number;
  routeSummary: string;
  audienceBadge: string;
  description: string;
  whatsIncluded: string[];
  image: ImageRef;
}

/**
 * Airport, SGR Madaraka Express Train Station & Coastal Transfer / Concierge Service.
 */
export interface TransferServiceItem {
  slug: string;
  title: string;
  category:
    | "SGR Train Transfers"
    | "Airport Transfers"
    | "Coastal & Resort Shuttles"
    | "Private Chauffeur & 4x4 Hire"
    | "Ticketing & Travel Concierge"
    | "Group & Event Fleet";
  routesCovered: string;
  vehicleTypes: string;
  description: string;
  includedFeatures: string[];
  image: ImageRef;
}

/**
 * Verified Guest Review (TripAdvisor & Google Reviews).
 */
export interface CustomerReviewItem {
  id: string;
  guestName: string;
  guestOrigin: string;
  platform: "TripAdvisor" | "Google";
  rating: number;
  dateLabel: string;
  tripTitle: string;
  stayOrPackageTag: string;
  photoCaption?: string;
  reviewText: string;
  image?: ImageRef;
}
