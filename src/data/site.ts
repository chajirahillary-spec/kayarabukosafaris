/**
 * Site-wide configuration for KayArabuko — Managed by Kaya Experience Ltd.
 * All values can be overridden dynamically from the CMS (organizations/{orgId}/settings/platform)
 * or via NEXT_PUBLIC_* environment variables.
 */
export const KAYARABUKO_LOGO_URL =
  "https://firebasestorage.googleapis.com/v0/b/legaprimed.firebasestorage.app/o/kayarabuko_logo%2Ffe1c982e-1803-48f6-999e-8bca8b906167.png?alt=media&token=0fc9b362-5f16-4ab7-8ed8-a6c3e216c828";

export const KAYA_EXPERIENCE_LOGO_URL = "/images/kaya-experience-logo.svg";
export const KAYA_EXPERIENCE_LOGO_LIGHT_URL =
  "/images/kaya-experience-logo-light.svg";

export const site = {
  name: "KayArabuko",
  shortName: "KayArabuko",
  managedBy: "Kaya Experience Ltd",
  logoUrl: KAYARABUKO_LOGO_URL,
  kayaExperienceLogoUrl: KAYA_EXPERIENCE_LOGO_URL,
  kayaExperienceLogoLightUrl: KAYA_EXPERIENCE_LOGO_LIGHT_URL,
  tagline: "EXPLORE. CONSERVE. EMPOWER.",
  statement: "Discover Kenya Beyond the Ordinary.",
  supporting:
    "From ancient cultural traditions and vibrant communities to remarkable forests and living ecosystems, discover the stories, people and natural heritage that make Kenya extraordinary.",
  closingStatement:
    "Managed by Kaya Experience Ltd (Watamu, Timboni Stage) — preserving the stories, cultures, indigenous livelihoods and natural heritage that make Kenya extraordinary.",
  finalPhilosophy:
    "Discover the stories. Preserve the heritage. Empower the communities.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.kayarabukosafaris.com",
  contact: {
    phone:
      process.env.NEXT_PUBLIC_CONTACT_PHONE ??
      "+254 728 560303 / +254 712 863538",
    primaryPhoneRaw: "+254728560303",
    secondaryPhoneRaw: "+254712863538",
    primaryPhoneDisplay: "+254 728 560303",
    secondaryPhoneDisplay: "+254 712 863538",
    email: process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "hello@kayarabuko.com",
    kayaRootsEmail: "kayaroots@kayarabuko.com",
    whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "254728560303",
    address:
      process.env.NEXT_PUBLIC_CONTACT_LOCATION ??
      "Watamu, Timboni Stage, Kilifi County, Kenya",
  },
  social: [
    {
      label: "Instagram",
      href: process.env.NEXT_PUBLIC_INSTAGRAM_URL ?? "https://instagram.com",
    },
    {
      label: "Facebook",
      href: process.env.NEXT_PUBLIC_FACEBOOK_URL ?? "https://facebook.com",
    },
    {
      label: "YouTube",
      href: process.env.NEXT_PUBLIC_YOUTUBE_URL ?? "https://youtube.com",
    },
  ],
  announcement:
    "Managed by Kaya Experience Ltd · Office: Watamu, Timboni Stage · Tel: +254 728 560303 / +254 712 863538",
} as const;

export interface NavSubItem {
  label: string;
  href: string;
  description: string;
}

export interface NavGroup {
  label: string;
  href: string;
  children?: NavSubItem[];
}

/**
 * Clean, organized top-level navigation with grouped dropdown submenus
 * so the header remains uncluttered and easy to scan.
 */
export const navGroups: NavGroup[] = [
  {
    label: "Home",
    href: "#home",
  },
  {
    label: "Safari Packages",
    href: "#safari-packages",
    children: [
      {
        label: "Multi-Day Safari Packages",
        href: "#safari-packages",
        description:
          "2D/1N, 3D/2N, 4D/3N, 5D/4N & 7D/6N Safaris (Tsavo, Amboseli, Mara & Salt Lick)",
      },
      {
        label: "Airport & SGR Transfer Add-Ons",
        href: "#safari-transfers-addon",
        description:
          "Seamless Miritini SGR, Malindi & Mombasa Airport Transfers & 4x4 Hire",
      },
      {
        label: "Excursions & Day Trips",
        href: "#excursions",
        description:
          "Safari Blue Glass-Bottom Boat, Mambrui Quad Bikes, Hell's Kitchen, Gede & Arabuko",
      },
      {
        label: "Accommodation & Kid-Friendly Stays",
        href: "#accommodation",
        description:
          "Villas, Cottages, Resorts & Kid-Friendly Stays with Kids' Pools & Nannies On Call",
      },
    ],
  },
  {
    label: "Excursions & Stays",
    href: "#excursions",
    children: [
      {
        label: "Excursions & Day Trips",
        href: "#excursions",
        description:
          "Safari Blue Glass-Bottom Boat & Dolphins, Mambrui Quad Bikes, Hell's Kitchen & Gede",
      },
      {
        label: "Accommodation & Kid-Friendly Stays",
        href: "#accommodation",
        description:
          "Villas, Cottages, Beach Resorts & Kid-Friendly Stays with Kids' Pools & Nannies",
      },
      {
        label: "Visits & Experiences",
        href: "#experiences",
        description:
          "Cultural Visits, Forest Walks, Crafts & Community Tours",
      },
    ],
  },
  {
    label: "Discover Kenya",
    href: "#explore",
    children: [
      {
        label: "Explore Regions",
        href: "#explore",
        description: "Kenyan Coast, Aberdare Ranges, Northern Kenya & Rift Valley",
      },
      {
        label: "Cultures & Communities",
        href: "#cultures",
        description: "Maasai, Samburu, Turkana, Mijikenda & Swahili Heritage",
      },
      {
        label: "Conservation & Ecosystems",
        href: "#conservation",
        description: "Arabuko-Sokoke Forest, Mida Creek Mangroves & Wildlife",
      },
      {
        label: "Kaya Roots Africa",
        href: "#kaya-roots",
        description: "Cassava, Indigenous Crops & Farmer Empowerment (Dr. Milcah Wambua)",
      },
    ],
  },
  {
    label: "Gallery",
    href: "/gallery",
  },
  {
    label: "About & Team",
    href: "#team",
    children: [
      {
        label: "Meet Our Team",
        href: "#team",
        description:
          "Mrisa (“The Shepherd”), Dr. Milcah Wambua, Arnold Mramba & Multilingual Guides",
      },
      {
        label: "About KayArabuko",
        href: "#about",
        description: "Our Philosophy · Managed by Kaya Experience Ltd (Watamu)",
      },
      {
        label: "Customer Reviews",
        href: "#reviews",
        description: "Verified Guest Testimonials · TripAdvisor & Google Ratings",
      },
      {
        label: "Tours & Travels Gallery",
        href: "/gallery",
        description: "Real Safari Animals, Family Stays, Mambrui Quad Bikes & Safari Blue",
      },
      {
        label: "Published Posters",
        href: "#posters",
        description: "Campaign Posters & Excursion Bulletins",
      },
    ],
  },
  {
    label: "Reviews",
    href: "#reviews",
  },
  {
    label: "Contact",
    href: "#contact",
  },
];

export const nav = [
  { label: "Home", href: "#home" },
  { label: "Safari Packages", href: "#safari-packages" },
  { label: "Excursions", href: "#excursions" },
  { label: "Accommodation", href: "#accommodation" },
  { label: "Explore", href: "#explore" },
  { label: "Cultures", href: "#cultures" },
  { label: "Conservation", href: "#conservation" },
  { label: "Kaya Roots", href: "#kaya-roots" },
  { label: "Tours & Travels Gallery", href: "/gallery" },
  { label: "Our Team", href: "#team" },
  { label: "Guest Reviews", href: "#reviews" },
  { label: "Posters", href: "#posters" },
  { label: "Stories", href: "#stories" },
  { label: "Contact", href: "#contact" },
] as const;
