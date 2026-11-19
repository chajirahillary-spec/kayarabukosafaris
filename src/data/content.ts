import type {
  AccommodationOption,
  ActivityGalleryItem,
  BrandPillar,
  CommunityProfile,
  ConservationSpotlight,
  ConservationTheme,
  CustomerReviewItem,
  EcosystemHighlight,
  ExcursionItem,
  Experience,
  KayaRootsProgram,
  PublishedPoster,
  RegionFeature,
  SafariPackageItem,
  Story,
  StoryCategory,
  TeamMember,
  TransferServiceItem,
  VisitExperience,
} from "@/lib/types";
import savedSiteImagesJson from "../../data/saved-site-images.json";
import savedPostersJson from "../../data/saved-posters.json";

/**
 * Exact Firebase Storage URLs uploaded by the user, loaded synchronously
 * so the website never flashes or loads non-Firebase placeholder images.
 */
export const SAVED_FIREBASE_IMAGE_OVERRIDES: Record<string, string> =
  (savedSiteImagesJson?.overrides as Record<string, string>) || {};

/**
 * Curated high-resolution editorial photography for KayArabuko's sections,
 * pointing directly to the user's uploaded Firebase Storage images.
 */
export const EDITORIAL_IMAGES = {
  heroForestCommunity:
    SAVED_FIREBASE_IMAGE_OVERRIDES["hero.0"] ||
    "https://firebasestorage.googleapis.com/v0/b/legaprimed.firebasestorage.app/o/kayarabuko_website%2Fhero.0_1794439681323.webp?alt=media&token=ce8200b5-1675-402f-aa71-b253b1763604",
  heroIndigenousForest:
    SAVED_FIREBASE_IMAGE_OVERRIDES["hero.1"] ||
    "https://firebasestorage.googleapis.com/v0/b/legaprimed.firebasestorage.app/o/kayarabuko_website%2Fhero.1_1794439683526.jpeg?alt=media&token=a9604ab4-47cf-401f-9961-73bf80f17fd8",
  heroSwahiliDhow:
    SAVED_FIREBASE_IMAGE_OVERRIDES["hero.2"] ||
    "https://firebasestorage.googleapis.com/v0/b/legaprimed.firebasestorage.app/o/kayarabuko_website%2Fhero.2_1794439686001.webp?alt=media&token=eb3000ca-8c8a-466e-ad5f-da60dc9bf5f6",
  heroHighlandCanopy:
    SAVED_FIREBASE_IMAGE_OVERRIDES["hero.3"] ||
    "https://firebasestorage.googleapis.com/v0/b/legaprimed.firebasestorage.app/o/kayarabuko_website%2Fhero.3_1794439688330.jpeg?alt=media&token=f82c07f7-efa6-4ea3-8efc-ed102be329f7",
  heroNorthernHorizons:
    SAVED_FIREBASE_IMAGE_OVERRIDES["hero.4"] ||
    "https://firebasestorage.googleapis.com/v0/b/legaprimed.firebasestorage.app/o/kayarabuko_website%2Fhero.4_1794439691340.jpeg?alt=media&token=ceab1754-4420-4b62-9f2e-9803d3744911",

  introPeople:
    SAVED_FIREBASE_IMAGE_OVERRIDES["intro.people"] ||
    "https://firebasestorage.googleapis.com/v0/b/legaprimed.firebasestorage.app/o/kayarabuko_website%2Fintro.people_1794439689755.jpeg?alt=media&token=130b1625-bc9b-429e-bf10-44333ff3b8c8",
  introForest:
    SAVED_FIREBASE_IMAGE_OVERRIDES["intro.forest"] ||
    "https://firebasestorage.googleapis.com/v0/b/legaprimed.firebasestorage.app/o/kayarabuko_website%2Fintro.forest_1794439692799.jpeg?alt=media&token=77f11175-2aff-4cea-bd75-779d9b155b7a",

  pillarExplore:
    SAVED_FIREBASE_IMAGE_OVERRIDES["pillar.explore"] ||
    "https://firebasestorage.googleapis.com/v0/b/legaprimed.firebasestorage.app/o/kayarabuko_website%2Fpillar.explore_1794439696190.jpeg?alt=media&token=ddf72e3b-e966-4ee3-b615-12e0ec2f7f25",
  pillarConserve:
    SAVED_FIREBASE_IMAGE_OVERRIDES["pillar.conserve"] ||
    "https://firebasestorage.googleapis.com/v0/b/legaprimed.firebasestorage.app/o/kayarabuko_website%2Fpillar.conserve_1794439694533.webp?alt=media&token=e6eca880-19e2-4417-8ce6-923af39dad8d",
  pillarEmpower:
    SAVED_FIREBASE_IMAGE_OVERRIDES["pillar.empower"] ||
    "https://firebasestorage.googleapis.com/v0/b/legaprimed.firebasestorage.app/o/kayarabuko_website%2Fpillar.empower_1794439698058.jpeg?alt=media&token=932e3911-6565-494a-addd-ca6a4b5192e0",

  maasai:
    SAVED_FIREBASE_IMAGE_OVERRIDES["community.maasai"] ||
    "https://firebasestorage.googleapis.com/v0/b/legaprimed.firebasestorage.app/o/kayarabuko_website%2Fcommunity.maasai_1794439699055.jpeg?alt=media&token=4ab329b8-0887-48ff-922a-e02c92d57888",
  samburu:
    SAVED_FIREBASE_IMAGE_OVERRIDES["community.samburu"] ||
    "https://firebasestorage.googleapis.com/v0/b/legaprimed.firebasestorage.app/o/kayarabuko_website%2Fcommunity.samburu_1794439700075.jpeg?alt=media&token=492d435b-96e3-4693-a89f-900c76b9a58e",
  turkana:
    SAVED_FIREBASE_IMAGE_OVERRIDES["community.turkana"] ||
    "https://firebasestorage.googleapis.com/v0/b/legaprimed.firebasestorage.app/o/kayarabuko_website%2Fcommunity.turkana_1794439701060.jpeg?alt=media&token=9afad1e0-c925-4a40-abc0-aad2757f73e1",
  mijikenda:
    SAVED_FIREBASE_IMAGE_OVERRIDES["community.mijikenda"] ||
    "https://firebasestorage.googleapis.com/v0/b/legaprimed.firebasestorage.app/o/kayarabuko_website%2Fcommunity.mijikenda_1794439702034.jpeg?alt=media&token=fb23ffdf-be0f-4830-9058-f960cbcc240a",
  swahili:
    SAVED_FIREBASE_IMAGE_OVERRIDES["community.swahili-coast"] ||
    "https://firebasestorage.googleapis.com/v0/b/legaprimed.firebasestorage.app/o/kayarabuko_website%2Fcommunity.swahili-coast_1794439703097.webp?alt=media&token=8cfdfa5e-8ae4-4375-997f-de0b1281a5cf",

  arabukoForest:
    SAVED_FIREBASE_IMAGE_OVERRIDES["conservation.spotlight"] ||
    "https://firebasestorage.googleapis.com/v0/b/legaprimed.firebasestorage.app/o/kayarabuko_website%2Fconservation.spotlight_1794439704668.jpeg?alt=media&token=cd38ef48-b7ef-47f2-b8d1-bfb03c379d57",
  wildlifeEcosystems:
    SAVED_FIREBASE_IMAGE_OVERRIDES["conservation.theme.wildlife-and-ecosystems"] ||
    "https://firebasestorage.googleapis.com/v0/b/legaprimed.firebasestorage.app/o/kayarabuko_website%2Fconservation.theme.wildlife-and-ecosystems_1794439707996.jpeg?alt=media&token=f06a38e9-cda7-48f0-bd4c-009b40fe9383",
  coastalMangroves:
    SAVED_FIREBASE_IMAGE_OVERRIDES["conservation.theme.coastal-and-marine"] ||
    "https://firebasestorage.googleapis.com/v0/b/legaprimed.firebasestorage.app/o/kayarabuko_website%2Fconservation.theme.coastal-and-marine_1794439709904.jpeg?alt=media&token=fa7f1f90-dcb8-48e8-b61c-b2bef9e6b3b5",
  communityStewardship:
    SAVED_FIREBASE_IMAGE_OVERRIDES["conservation.theme.community-conservation"] ||
    "https://firebasestorage.googleapis.com/v0/b/legaprimed.firebasestorage.app/o/kayarabuko_website%2Fconservation.theme.community-conservation_1794439711055.jpeg?alt=media&token=a91900d4-e4f9-4bb6-9dad-3a84dec5c060",

  regionCoast:
    SAVED_FIREBASE_IMAGE_OVERRIDES["region.kenyan-coast"] ||
    "https://firebasestorage.googleapis.com/v0/b/legaprimed.firebasestorage.app/o/kayarabuko_website%2Fregion.kenyan-coast_1794439726055.webp?alt=media&token=5bdae193-e737-4005-9f29-4f4014199c3e",
  regionAberdares:
    SAVED_FIREBASE_IMAGE_OVERRIDES["region.aberdare-ranges"] ||
    "https://firebasestorage.googleapis.com/v0/b/legaprimed.firebasestorage.app/o/kayarabuko_website%2Fregion.aberdare-ranges_1794439727215.jpeg?alt=media&token=239c6cf6-0cc9-4455-88f7-01cad3c26947",
  regionNorthern:
    SAVED_FIREBASE_IMAGE_OVERRIDES["region.northern-kenya"] ||
    "https://firebasestorage.googleapis.com/v0/b/legaprimed.firebasestorage.app/o/kayarabuko_website%2Fregion.northern-kenya_1794439728230.jpeg?alt=media&token=cfd1d69c-ac5f-4558-a1a2-30bf39640a4e",
  regionRiftValley:
    SAVED_FIREBASE_IMAGE_OVERRIDES["region.rift-valley"] ||
    "https://firebasestorage.googleapis.com/v0/b/legaprimed.firebasestorage.app/o/kayarabuko_website%2Fregion.rift-valley_1794439729393.jpeg?alt=media&token=937040bf-2cf3-4fc3-bc87-da11acc37990",
} as const;

/** SECTION 01: HERO CONTENT */
export const heroContent = {
  eyebrow: "EXPLORE. CONSERVE. EMPOWER.",
  headline: "Discover Kenya Beyond the Ordinary.",
  description:
    "From ancient cultural traditions and vibrant communities to remarkable forests and living ecosystems, discover the stories, people and natural heritage that make Kenya extraordinary.",
  primaryCta: {
    label: "EXPLORE KENYA",
    href: "#explore",
  },
  secondaryCta: {
    label: "OUR CONSERVATION MISSION",
    href: "#conservation",
  },
};

/** SECTION 02: INTRODUCTION CONTENT */
export const introContent = {
  eyebrow: "OUR PERSPECTIVE",
  headline: "Kenya Is More Than a Destination. It's a Living Story.",
  paragraphs: [
    "Beyond the places we travel to are the people, traditions, knowledge and natural environments that give Kenya its identity.",
    "Across the country, communities continue to preserve remarkable ways of life, while forests, wildlife and ecosystems sustain generations of people and nature.",
    "At KayArabuko, we bring these stories closer to you — creating opportunities to discover, appreciate and support the heritage that deserves to live on.",
  ],
  primaryImage: {
    src: EDITORIAL_IMAGES.introPeople,
    alt: "Kenyan community members sharing traditional heritage and knowledge",
  },
  secondaryImage: {
    src: EDITORIAL_IMAGES.introForest,
    alt: "Sunlight filtering through the canopy of an indigenous Kenyan forest",
  },
};

/** SECTION 03: THE THREE CORE BRAND PILLARS */
export const brandPillars: BrandPillar[] = [
  {
    id: "explore",
    number: "01",
    title: "EXPLORE",
    subtitle: "Discover Kenya beyond the familiar.",
    description:
      "Discover the cultures, communities, landscapes and traditions that tell the story of Kenya.",
    highlights: [
      "Maasai, Samburu, Turkana, Mijikenda & Swahili heritage",
      "Traditional crafts, indigenous knowledge, music & storytelling",
      "Rural livelihoods, indigenous forests, mountains & conservancies",
    ],
    targetAnchor: "#cultures",
    ctaLabel: "Explore Cultures & Places",
    image: {
      src: EDITORIAL_IMAGES.pillarExplore,
      alt: "Community storytellers and cultural heritage in Kenya",
    },
  },
  {
    id: "conserve",
    number: "02",
    title: "CONSERVE",
    subtitle: "Protect what makes Kenya extraordinary.",
    description:
      "Celebrate and support the protection of our forests, wildlife, ecosystems and cultural heritage.",
    highlights: [
      "Indigenous forests, trees & biodiversity protection",
      "Marine ecosystems, mangroves & coastal habitats",
      "Cultural heritage sites & community-led environmental stewardship",
    ],
    targetAnchor: "#conservation",
    ctaLabel: "Our Conservation Focus",
    image: {
      src: EDITORIAL_IMAGES.pillarConserve,
      alt: "Lush indigenous forest canopy in coastal Kenya",
    },
  },
  {
    id: "empower",
    number: "03",
    title: "EMPOWER",
    subtitle: "Meaningful exploration creates value for local custodians.",
    description:
      "Connect with communities, support local initiatives and help create meaningful opportunities.",
    highlights: [
      "Community guides, storytellers & knowledge custodians",
      "Local artisans, craftspeople & women- and youth-led initiatives",
      "Community-based tourism & sustainable local enterprises",
    ],
    targetAnchor: "#experiences",
    ctaLabel: "Support Through Visits",
    image: {
      src: EDITORIAL_IMAGES.pillarEmpower,
      alt: "Community conservation scouts and local guides working together",
    },
  },
];

/** SECTION 04: CULTURES & COMMUNITIES */
export const culturesSectionHeader = {
  eyebrow: "CULTURES & COMMUNITIES",
  headline: "Meet the People. Discover the Traditions. Experience the Heritage.",
  description:
    "Every community carries a story. From traditional knowledge and craftsmanship to food, music, ceremonies and everyday ways of life, Kenya's cultural heritage offers a deeper understanding of the country.",
  respectStatement:
    "Communities are the custodians and storytellers of their own heritage. Every visit is shaped around dignity, authenticity and mutual respect.",
};

export const communityProfiles: CommunityProfile[] = [
  {
    slug: "maasai",
    name: "The Maasai",
    region: "Southern Rift Valley & Savannah Plains",
    tagline: "Pastoral stewardship, ecological knowledge and enduring community life.",
    introduction:
      "Discover pastoral traditions, beadwork, traditional knowledge, community life and the relationship between the Maasai people and their environment.",
    discoveries: [
      "Pastoral livelihoods and seasonal grazing knowledge that coexist with open savannah ecosystems",
      "Intricate beadwork artistry crafted by women, where colours and patterns carry social meaning",
      "Oral history, indigenous botany, elders' wisdom and everyday life within a homestead",
      "Community-led rangeland conservation and local education initiatives",
    ],
    livelihoodsAndHeritage:
      "For generations, Maasai pastoralism has shaped and preserved the open grasslands of southern Kenya through deep familiarity with land, rainfall and wildlife.",
    image: {
      src: EDITORIAL_IMAGES.maasai,
      alt: "Maasai community members sharing traditional pastoral knowledge in southern Kenya",
    },
  },
  {
    slug: "samburu",
    name: "The Samburu",
    region: "Northern Kenya Highlands & Semi-Arid Rangelands",
    tagline: "Distinctive northern heritage, oral traditions and semi-arid resilience.",
    introduction:
      "Explore distinctive cultural traditions, pastoral heritage, craftsmanship and community life in northern Kenya.",
    discoveries: [
      "Semi-arid pastoral ways of life adapted to northern Kenya's mountains and plains",
      "Traditional singing, oral poetry and intergenerational storytelling",
      "Handcrafted beadwork, traditional attire and everyday artisan skills",
      "Community conservancies where local families protect rare northern biodiversity",
    ],
    livelihoodsAndHeritage:
      "Across Samburu's dramatic landscapes, community life revolves around kinship, respect for elders and a close bond with the natural water sources and hills.",
    image: {
      src: EDITORIAL_IMAGES.samburu,
      alt: "Samburu community life and traditional craftsmanship in northern Kenya",
    },
  },
  {
    slug: "turkana",
    name: "The Turkana",
    region: "Lake Turkana Basin & Northwestern Kenya",
    tagline: "Resilience, craftsmanship and livelihoods around the Jade Sea.",
    introduction:
      "Discover the cultural heritage, resilience, traditional livelihoods and relationship with the landscapes surrounding Lake Turkana.",
    discoveries: [
      "Traditional fishing and pastoral livelihoods along the shores of Lake Turkana",
      "Distinctive woodcarving, woven palm basketry and metalwork craftsmanship",
      "Indigenous knowledge of arid ecosystems, water finding and seasonal movement",
      "Living human heritage in a region renowned as the cradle of humankind",
    ],
    livelihoodsAndHeritage:
      "Living in one of East Africa's most striking arid environments, the Turkana people sustain vibrant traditions built on mutual support, adaptability and deep knowledge of land and lake.",
    image: {
      src: EDITORIAL_IMAGES.turkana,
      alt: "Landscape and lakeside heritage in the Lake Turkana basin of northern Kenya",
    },
  },
  {
    slug: "mijikenda",
    name: "The Mijikenda",
    region: "Kenyan Coast & Sacred Kaya Forest Ridges",
    tagline: "Nine coastal communities united by history, craftsmanship and sacred forests.",
    introduction:
      "Explore the nine Mijikenda communities, their traditions, kaya heritage, craftsmanship and historical connection to Kenya's coastal forests.",
    discoveries: [
      "The shared history and distinct identities of the nine Mijikenda sub-communities",
      "Traditional stewardship of the sacred Kaya forests protected by elders' councils",
      "Coastal agriculture, palm weaving, pottery and culinary traditions",
      "Ethnobotanical knowledge of indigenous coastal trees and medicinal plants",
    ],
    livelihoodsAndHeritage:
      "The Mijikenda demonstrate how cultural identity and forest conservation are inseparable — centuries-old traditions have protected biodiversity hotspots along the coastal ridges.",
    image: {
      src: EDITORIAL_IMAGES.mijikenda,
      alt: "Sacred indigenous coastal forest associated with Mijikenda Kaya heritage",
    },
  },
  {
    slug: "swahili-coast",
    name: "The Swahili Coast",
    region: "Lamu, Mombasa, Malindi, Watamu & Historic Coastal Towns",
    tagline: "Maritime heritage, coral-stone architecture, language and coastal artistry.",
    introduction:
      "Experience coastal architecture, Swahili cuisine, traditional crafts, music, language and the cultural heritage of historic coastal towns.",
    discoveries: [
      "Centuries-old coral-stone architecture, courtyards and intricately carved wooden doors",
      "Swahili culinary heritage blending coastal harvests, coconut and aromatic spices",
      "Traditional dhow boatbuilding, maritime navigation and artisanal fishing life",
      "Swahili poetry, Taarab musical traditions and vibrant local market culture",
    ],
    livelihoodsAndHeritage:
      "Shaped by centuries of Indian Ocean exchange and African coastal roots, Swahili towns preserve a living urban and maritime culture unique to East Africa.",
    image: {
      src: EDITORIAL_IMAGES.swahili,
      alt: "Traditional wooden dhow sailing along Kenya's historic Swahili coast",
    },
  },
];

/** SECTION 05: CONSERVATION */
export const conservationSectionHeader = {
  eyebrow: "CONSERVATION & NATURAL HERITAGE",
  headline: "Nature Is Our Heritage. Its Future Is Our Responsibility.",
  description:
    "Kenya's natural heritage extends far beyond its famous wildlife destinations. Its forests, indigenous species, marine ecosystems, wetlands and biodiversity are essential to the balance of life and the livelihoods of surrounding communities.",
};

export const conservationThemes: ConservationTheme[] = [
  {
    slug: "forests-and-biodiversity",
    title: "Forests & Biodiversity",
    description:
      "Explore indigenous forests, forest ecosystems, endangered species, restoration and community-led forest protection.",
    keyFocusAreas: [
      "Indigenous coastal and montane forests",
      "Endangered birds, mammals & endemic flora",
      "Indigenous tree nurseries & habitat restoration",
    ],
    image: {
      src:
        SAVED_FIREBASE_IMAGE_OVERRIDES[
          "conservation.theme.forests-and-biodiversity"
        ] || EDITORIAL_IMAGES.arabukoForest,
      alt: "Dense indigenous forest canopy supporting rare Kenyan biodiversity",
    },
  },
  {
    slug: "wildlife-and-ecosystems",
    title: "Wildlife & Ecosystems",
    description:
      "Discover wildlife habitats, biodiversity, conservancies and the importance of protecting natural ecosystems.",
    keyFocusAreas: [
      "Landscape corridors & natural habitats",
      "Coexistence between people and wildlife",
      "Protection of wetlands, savannahs & watersheds",
    ],
    image: {
      src: EDITORIAL_IMAGES.wildlifeEcosystems,
      alt: "Elephants moving through a protected Kenyan landscape",
    },
  },
  {
    slug: "coastal-and-marine",
    title: "Coastal & Marine Conservation",
    description:
      "Highlight mangroves, coral reefs, marine life, coastal forests and community participation in protecting ocean environments.",
    keyFocusAreas: [
      "Mangrove restoration & creek protection",
      "Coral gardens, sea turtles & marine lagoons",
      "Sustainable artisanal coastal livelihoods",
    ],
    image: {
      src: EDITORIAL_IMAGES.coastalMangroves,
      alt: "Coastal waters and mangrove ecosystems along the Kenyan Indian Ocean",
    },
  },
  {
    slug: "community-conservation",
    title: "Community Conservation",
    description:
      "Show how local communities contribute to conservation through environmental education, sustainable livelihoods, restoration and stewardship.",
    keyFocusAreas: [
      "Butterfly farming, beekeeping & nature guiding",
      "School & youth environmental education",
      "Protection of culturally significant heritage sites",
    ],
    image: {
      src: EDITORIAL_IMAGES.communityStewardship,
      alt: "Local community members engaged in environmental stewardship in Kenya",
    },
  },
];

export const arabukoSokokeSpotlight: ConservationSpotlight = {
  title: "Arabuko-Sokoke Forest: Conservation Meets Community",
  subtitle: "Featured Ecosystem & Stewardship Model",
  location: "Kilifi County, Kenyan Coast",
  description:
    "As the largest remaining fragment of East Africa's coastal dry forest, Arabuko-Sokoke shelters rare endemic birds, mammals and indigenous trees found almost nowhere else on Earth.",
  communityConnection:
    "Inspired by initiatives such as Friends of Arabuko-Sokoke Forest, conservation here thrives when forest protection is linked directly to community involvement, environmental education and sustainable livelihoods like butterfly farming, beekeeping and local guiding.",
  highlights: [
    "Home to rare species including the Sokoke Scops Owl, Clarke's Weaver and Golden-rumped Elephant Shrew",
    "Demonstrates how sustainable livelihoods reduce pressure on indigenous forests while empowering adjacent villages",
    "Connects forest ecology with Mijikenda and coastal heritage through guided nature walks and learning",
  ],
  inspirationNote:
    "KayArabuko highlights independent conservation initiatives and ecosystems across Kenya to foster awareness, respectful visits and support for local stewardship.",
  image: {
    src: EDITORIAL_IMAGES.arabukoForest,
    alt: "Indigenous coastal trees and forest trail in Arabuko-Sokoke Forest",
  },
};

export const ecosystemHighlights: EcosystemHighlight[] = [
  {
    slug: "arabuko-sokoke-forest",
    name: "Arabuko-Sokoke Forest",
    region: "Kilifi Coast",
    focus: "Coastal Forest & Endemic Biodiversity",
    summary:
      "East Africa's largest coastal forest fragment, linking rare bird and mammal protection with community-based livelihoods.",
    image: {
      src:
        SAVED_FIREBASE_IMAGE_OVERRIDES["ecosystem.arabuko-sokoke-forest"] ||
        EDITORIAL_IMAGES.arabukoForest,
      alt: "Sunlit indigenous coastal forest canopy in Arabuko-Sokoke Forest",
    },
  },
  {
    slug: "shimba-hills",
    name: "Shimba Hills",
    region: "Kwale County",
    focus: "Coastal Rainforest & Cycad Ecosystems",
    summary:
      "Lush coastal hills holding ancient cycads, waterfalls, sable antelope habitats and vital local water catchments.",
    image: {
      src:
        SAVED_FIREBASE_IMAGE_OVERRIDES["ecosystem.shimba-hills"] ||
        EDITORIAL_IMAGES.heroHighlandCanopy,
      alt: "Lush rainforest ridges and mist over Shimba Hills in Kwale County",
    },
  },
  {
    slug: "aberdare-forest-range",
    name: "Aberdare Forest Range",
    region: "Central Highlands",
    focus: "Montane Forest & Water Catchments",
    summary:
      "High-altitude moorlands, bamboo zones and indigenous forests sustaining rivers and surrounding rural communities.",
    image: {
      src:
        SAVED_FIREBASE_IMAGE_OVERRIDES["ecosystem.aberdare-forest-range"] ||
        EDITORIAL_IMAGES.regionAberdares,
      alt: "Montane forest and mountain ridges in the Aberdare Range",
    },
  },
  {
    slug: "indigenous-coastal-forests",
    name: "Indigenous Coastal & Kaya Forests",
    region: "Coast Region",
    focus: "Bio-Cultural Heritage & Sacred Groves",
    summary:
      "Botanically rich forest patches preserved for generations through Mijikenda cultural traditions and council elders.",
    image: {
      src:
        SAVED_FIREBASE_IMAGE_OVERRIDES["ecosystem.indigenous-coastal-forests"] ||
        EDITORIAL_IMAGES.mijikenda,
      alt: "Sacred Mijikenda Kaya forest grove along the Kenyan Coast",
    },
  },
  {
    slug: "community-conservancies",
    name: "Community Conservancies",
    region: "Northern, Rift & Southern Kenya",
    focus: "Community-Led Habitat Stewardship",
    summary:
      "Locally governed rangelands where pastoral communities balance traditional grazing with wildlife conservation.",
    image: {
      src:
        SAVED_FIREBASE_IMAGE_OVERRIDES["ecosystem.community-conservancies"] ||
        EDITORIAL_IMAGES.wildlifeEcosystems,
      alt: "Open savannah rangelands in a Kenyan community conservancy",
    },
  },
  {
    slug: "mangrove-ecosystems",
    name: "Mangrove & Marine Ecosystems",
    region: "Watamu, Mida Creek, Kilifi & Lamu",
    focus: "Blue Carbon & Marine Nurseries",
    summary:
      "Community-restored mangrove boardwalks, tidal creeks and coral lagoons supporting coastal resilience and marine life.",
    image: {
      src:
        SAVED_FIREBASE_IMAGE_OVERRIDES["ecosystem.mangrove-ecosystems"] ||
        EDITORIAL_IMAGES.coastalMangroves,
      alt: "Coastal mangrove creek and marine ecosystem in Watamu and Mida Creek",
    },
  },
];

/** SECTION 06: EXPLORE KENYA — LANDSCAPES, REGIONS & HERITAGE */
export const exploreRegionsHeader = {
  eyebrow: "EXPLORE KENYA",
  headline: "Explore the Places. Understand Their Stories.",
  description:
    "Every landscape in Kenya is shaped by the relationship between ecosystems and the communities who live alongside them. Explore regions through their heritage, nature and local life.",
  coverageNote:
    "These regions are starting points — KayArabuko's cultural and conservation discovery extends across all of Kenya.",
};

export const regionFeatures: RegionFeature[] = [
  {
    slug: "kenyan-coast",
    name: "The Kenyan Coast — Diani, Malindi, Watamu and Beyond",
    subtitle: "Swahili Towns, Mijikenda Kaya Forests, Creeks & Coastal Heritage",
    description:
      "Look beyond beaches and resorts to discover centuries of Swahili architecture, sacred Mijikenda forests, mangrove creeks and vibrant fishing communities.",
    highlights: [
      "Swahili heritage and coastal architecture",
      "Mijikenda cultural traditions and Kaya forests",
      "Coastal cuisine and vibrant local markets",
      "Arabuko-Sokoke Forest and endemic birdlife",
      "Mangroves and marine conservation initiatives",
      "Traditional fishing communities and dhow builders",
      "Historic coastal settlements across Malindi, Watamu, Diani and Lamu",
    ],
    communitiesNote: "Mijikenda, Swahili & Bajuni coastal communities",
    conservationNote: "Arabuko-Sokoke Forest, Mida Creek mangroves, Shimba Hills & marine reserves",
    image: {
      src: EDITORIAL_IMAGES.regionCoast,
      alt: "Traditional dhow and historic coastal shoreline along the Kenyan Coast",
    },
  },
  {
    slug: "aberdare-ranges",
    name: "The Aberdare Ranges",
    subtitle: "Highland Water Catchments, Bamboo Forests & Mountain Communities",
    description:
      "Explore mist-wrapped mountain ecosystems and indigenous forests that feed Kenya's rivers while sustaining highland agricultural traditions and rare biodiversity.",
    highlights: [
      "Mountain ecosystems and indigenous montane forests",
      "Vital water catchments and rare highland biodiversity",
      "Forest-adjacent communities and local rural livelihoods",
      "Guided nature walks and forest conservation experiences",
      "Understanding the protection of Kenya's highland ecosystems",
    ],
    communitiesNote: "Highland farming communities & forest conservation associations",
    conservationNote: "Indigenous tree restoration, watershed protection & montane habitats",
    image: {
      src: EDITORIAL_IMAGES.regionAberdares,
      alt: "Misty mountain ridges and indigenous forest in the Aberdare Ranges",
    },
  },
  {
    slug: "northern-kenya",
    name: "Northern Kenya",
    subtitle: "Pastoral Heritage, Arid Horizons, Lake Turkana & Community Conservancies",
    description:
      "Journey through vast northern landscapes where Samburu, Turkana and Maasai communities preserve resilient pastoral traditions, oral histories and community-led conservancies.",
    highlights: [
      "Maasai, Samburu and Turkana cultural heritage in their respective regions",
      "Traditional pastoral lifestyles and seasonal movement",
      "Unique arid landscapes, volcanic hills and indigenous ecological knowledge",
      "Pioneering community conservancies and local wildlife scouts",
      "Authentic local crafts, beadwork and oral storytelling",
    ],
    communitiesNote: "Samburu, Turkana, Rendille & northern pastoral communities",
    conservationNote: "Community-owned rangeland conservancies & dryland biodiversity",
    image: {
      src: EDITORIAL_IMAGES.regionNorthern,
      alt: "Northern Kenya savannah horizons and acacia landscapes",
    },
  },
  {
    slug: "rift-valley",
    name: "The Rift Valley",
    subtitle: "Escarpments, Lakes, Cultural Crossroads & Conservation Landscapes",
    description:
      "From dramatic escarpments to freshwater and soda lakes, the Rift Valley connects diverse Kenyan communities, historic landscapes and active wetland conservation.",
    highlights: [
      "Diverse rural communities and traditional agricultural and pastoral livelihoods",
      "Freshwater and alkaline lakes, escarpments and volcanic ecosystems",
      "Rich cultural heritage, archaeological sites and local regional history",
      "Wetland conservation initiatives, bird habitats and community experiences",
    ],
    communitiesNote: "Kalenjin, Maasai, Kikuyu & diverse Rift Valley communities",
    conservationNote: "Rift Valley lake ecosystems, escarpment forests & wildlife corridors",
    image: {
      src: EDITORIAL_IMAGES.regionRiftValley,
      alt: "Lakes and dramatic escarpments of the Great Rift Valley in Kenya",
    },
  },
];

/** SECTION 07: VISITS & EXPERIENCES */
export const experiencesSectionHeader = {
  eyebrow: "VISITS & EXPERIENCES",
  headline: "Experience Kenya Through Its People and Places.",
  description:
    "Whether you are interested in cultural discovery, community visits, conservation experiences or exploring Kenya's natural heritage, we help you discover meaningful ways to connect with the country.",
  tailoredNote:
    "Every experience is thoughtfully arranged around location, group size, duration, community hosts, local guides and access requirements — never forced into fixed, standardized packages.",
};

export const visitExperiences: VisitExperience[] = [
  {
    slug: "cultural-and-heritage-visits",
    title: "Cultural & Heritage Visits",
    pillar: "Explore",
    description:
      "Connect respectfully with Maasai, Samburu, Turkana, Mijikenda and Swahili hosts to learn about history, architecture, oral traditions and cultural identity.",
    highlights: ["Hosted by local cultural custodians", "Authentic history & living traditions"],
    image: {
      src:
        SAVED_FIREBASE_IMAGE_OVERRIDES[
          "experience.cultural-and-heritage-visits"
        ] || EDITORIAL_IMAGES.maasai,
      alt: "Cultural heritage visit hosted by local Kenyan community members",
    },
  },
  {
    slug: "community-encounters",
    title: "Community Encounters",
    pillar: "Empower",
    description:
      "Spend unhurried time with rural, pastoral and coastal communities, understanding everyday livelihoods, local initiatives and community-led enterprises.",
    highlights: ["Dignified, host-led exchanges", "Direct support to local initiatives"],
    image: {
      src:
        SAVED_FIREBASE_IMAGE_OVERRIDES["experience.community-encounters"] ||
        EDITORIAL_IMAGES.samburu,
      alt: "Meaningful community encounter in rural Kenya",
    },
  },
  {
    slug: "traditional-craft-and-food",
    title: "Traditional Craft & Food Experiences",
    pillar: "Empower",
    description:
      "Learn alongside local beadwork artisans, basket weavers, woodcarvers and home cooks preparing authentic regional Kenyan dishes.",
    highlights: ["Hands-on artisan workshops", "Regional culinary heritage"],
    image: {
      src:
        SAVED_FIREBASE_IMAGE_OVERRIDES["experience.traditional-craft-and-food"] ||
        EDITORIAL_IMAGES.introPeople,
      alt: "Traditional Kenyan craftsmanship and culinary preparation",
    },
  },
  {
    slug: "forest-walks-and-biodiversity",
    title: "Forest Walks & Biodiversity Discovery",
    pillar: "Conserve",
    description:
      "Walk beneath the canopies of Arabuko-Sokoke, sacred Kaya groves and highland forests with knowledgeable local naturalists and birding guides.",
    highlights: ["Indigenous flora & endemic birds", "Guided by local forest naturalists"],
    image: {
      src:
        SAVED_FIREBASE_IMAGE_OVERRIDES[
          "experience.forest-walks-and-biodiversity"
        ] || EDITORIAL_IMAGES.arabukoForest,
      alt: "Guided walk through an indigenous forest trail in Kenya",
    },
  },
  {
    slug: "conservation-and-environmental-learning",
    title: "Conservation & Environmental Learning",
    pillar: "Conserve",
    description:
      "Engage with indigenous tree nurseries, mangrove boardwalks, butterfly farming projects and community environmental education programmes.",
    highlights: ["Field learning with conservationists", "Forest & marine restoration insights"],
    image: {
      src:
        SAVED_FIREBASE_IMAGE_OVERRIDES[
          "experience.conservation-and-environmental-learning"
        ] || EDITORIAL_IMAGES.communityStewardship,
      alt: "Environmental learning and tree conservation activity in Kenya",
    },
  },
  {
    slug: "community-led-nature-experiences",
    title: "Community-Led Nature Experiences",
    pillar: "Conserve",
    description:
      "Explore conservancies, coastal creeks, hills and lakes alongside community guides and scouts who protect their local landscapes.",
    highlights: ["Local ecological knowledge", "Supports community stewardship"],
    image: {
      src:
        SAVED_FIREBASE_IMAGE_OVERRIDES[
          "experience.community-led-nature-experiences"
        ] || EDITORIAL_IMAGES.wildlifeEcosystems,
      alt: "Nature exploration in a Kenyan community conservancy",
    },
  },
  {
    slug: "heritage-sites-and-historical-exploration",
    title: "Heritage Sites & Historical Exploration",
    pillar: "Explore",
    description:
      "Explore historic Swahili coastal settlements, sacred forest landmarks and archaeological landscapes with local historians and storytellers.",
    highlights: ["Historic coastal towns & sites", "Contextual storytelling"],
    image: {
      src:
        SAVED_FIREBASE_IMAGE_OVERRIDES[
          "experience.heritage-sites-and-historical-exploration"
        ] || EDITORIAL_IMAGES.swahili,
      alt: "Historic heritage architecture along the Kenyan Coast",
    },
  },
  {
    slug: "regional-discovery-tours",
    title: "Regional Discovery Tours",
    pillar: "Explore",
    description:
      "Tailored multi-day journeys connecting Kenya's diverse regions — weaving together cultural heritage, indigenous forests, ecosystems and local communities.",
    highlights: ["Custom-arranged across Kenya", "Balanced culture, nature & conservation"],
    image: {
      src:
        SAVED_FIREBASE_IMAGE_OVERRIDES["experience.regional-discovery-tours"] ||
        EDITORIAL_IMAGES.regionRiftValley,
      alt: "Scenic Kenyan regional landscape across valleys and forests",
    },
  },
];

/** SECTION 08: STORIES — CULTURE, PEOPLE & CONSERVATION */
export const storiesSectionHeader = {
  eyebrow: "STORIES & EDITORIAL",
  headline: "Stories Worth Discovering. Heritage Worth Preserving.",
  description:
    "Short editorial perspectives on Kenya's diverse communities, traditional knowledge, indigenous forests and the people safeguarding our shared heritage.",
};

export const storyCategories: StoryCategory[] = [
  { slug: "culture-and-heritage", name: "Culture & Heritage" },
  { slug: "people-and-communities", name: "People & Communities" },
  { slug: "forests-and-biodiversity", name: "Forests & Biodiversity" },
  { slug: "conservation-in-action", name: "Conservation in Action" },
  { slug: "traditional-knowledge", name: "Traditional Knowledge" },
  { slug: "places-and-landscapes", name: "Places & Landscapes" },
  { slug: "community-initiatives", name: "Community Initiatives" },
];

export const stories: Story[] = [
  {
    slug: "stories-behind-kenyas-living-cultural-heritage",
    title: "The Stories Behind Kenya's Living Cultural Heritage",
    excerpt:
      "Why understanding Kenya begins with listening to the communities, elders and artisans who keep centuries-old traditions alive in everyday life.",
    categorySlug: "culture-and-heritage",
    author: "KayArabuko Editorial",
    publishedAt: "2026-10-12",
    readMinutes: 4,
    image: {
      src:
        SAVED_FIREBASE_IMAGE_OVERRIDES[
          "story.stories-behind-kenyas-living-cultural-heritage"
        ] || EDITORIAL_IMAGES.maasai,
      alt: "Community elders and storytellers preserving Kenyan cultural heritage",
    },
    body: [
      "For many visitors, Kenya is introduced through its celebrated national parks and Indian Ocean coastline. Yet the deepest meaning of every landscape in Kenya is held in the languages, memories and daily practices of the people who call it home.",
      "Across pastoral plains, highland ridges, lake basins and coastal settlements, cultural heritage is not a relic of the past. It lives in how communities read the seasons, craft functional art, welcome guests, prepare meals and pass responsibility from one generation to the next.",
      "When exploration approaches culture with curiosity and respect rather than spectacle, both visitor and host gain something enduring: genuine human connection and a shared commitment to keeping living heritage valued.",
    ],
    relatedDestinationSlugs: [],
    relatedTopic: "Cultural & Heritage Visits",
  },
  {
    slug: "understanding-the-mijikenda-and-sacred-kaya-forests",
    title: "Understanding the Mijikenda and the Sacred Kaya Forests",
    excerpt:
      "Along the ridges of the Kenyan coast, the nine Mijikenda communities have protected biodiversity-rich Kaya forests through ancestral tradition and council stewardship.",
    categorySlug: "traditional-knowledge",
    author: "KayArabuko Editorial",
    publishedAt: "2026-10-18",
    readMinutes: 5,
    image: {
      src:
        SAVED_FIREBASE_IMAGE_OVERRIDES[
          "story.understanding-the-mijikenda-and-sacred-kaya-forests"
        ] || EDITORIAL_IMAGES.mijikenda,
      alt: "Indigenous coastal trees within a sacred Kaya forest in Kenya",
    },
    body: [
      "Rising above the coastal plains of Kilifi and Kwale counties are patches of dense indigenous forest known as the Kayas. To the nine Mijikenda communities — the Giriama, Digo, Duruma, Chonyi, Jibana, Kambe, Kauma, Rabai and Ribe — these forests are historical homelands and places of deep cultural significance.",
      "For centuries, elders' councils governed how people interacted with the Kayas, restricting tree cutting and protecting rare medicinal plants and old-growth canopy. Long before modern conservation frameworks existed, traditional knowledge preserved some of East Africa's rarest coastal flora.",
      "Learning from the Mijikenda perspective reveals how cultural preservation and forest conservation are fundamentally intertwined — and why supporting community elders and youth education remains vital today.",
    ],
    relatedDestinationSlugs: ["watamu", "malindi", "diani"],
    relatedTopic: "The Mijikenda & Kaya Forests",
  },
  {
    slug: "life-and-traditions-among-the-samburu",
    title: "Life and Traditions Among the Samburu",
    excerpt:
      "In the semi-arid hills and plains of northern Kenya, Samburu pastoral heritage reflects a deep understanding of land, kinship and coexistence with nature.",
    categorySlug: "people-and-communities",
    author: "KayArabuko Editorial",
    publishedAt: "2026-10-24",
    readMinutes: 4,
    image: {
      src:
        SAVED_FIREBASE_IMAGE_OVERRIDES[
          "story.life-and-traditions-among-the-samburu"
        ] || EDITORIAL_IMAGES.samburu,
      alt: "Samburu community life and northern Kenya landscape",
    },
    body: [
      "Northern Kenya's landscapes demand patience, attentiveness and deep communal solidarity. Among the Samburu people, pastoral life is guided by an intimate knowledge of seasonal rivers, mountain forests and dryland grazing routes.",
      "Beyond the vibrant beadwork and songs often seen in photographs lies a thoughtful social structure centred on mutual responsibility, elders' counsel and respect for the environment that sustains both livestock and wildlife.",
      "Today, many Samburu communities also lead conservation efforts across northern rangelands — showing how traditional pastoral values continue to shape modern environmental stewardship.",
    ],
    relatedDestinationSlugs: ["samburu"],
    relatedTopic: "The Samburu — Northern Kenya",
  },
  {
    slug: "arabuko-sokoke-where-forest-conservation-meets-community",
    title: "Arabuko-Sokoke: Where Forest Conservation Meets Community",
    excerpt:
      "How East Africa's largest remaining coastal forest demonstrates the powerful link between biodiversity protection, environmental education and local livelihoods.",
    categorySlug: "conservation-in-action",
    author: "KayArabuko Editorial",
    publishedAt: "2026-10-29",
    readMinutes: 5,
    image: {
      src:
        SAVED_FIREBASE_IMAGE_OVERRIDES[
          "story.arabuko-sokoke-where-forest-conservation-meets-community"
        ] || EDITORIAL_IMAGES.arabukoForest,
      alt: "Forest trail and indigenous canopy in Arabuko-Sokoke Forest",
    },
    body: [
      "Stretching along the coast between Kilifi and Malindi, Arabuko-Sokoke Forest is a living treasure of coastal ecology. Beneath its cynometra, brachystegia and mixed forest zones live species found almost nowhere else, from the Golden-rumped Elephant Shrew to the Sokoke Scops Owl.",
      "Yet the most inspiring story of Arabuko-Sokoke is the relationship between the forest and the communities living along its boundary. Initiatives such as Friends of Arabuko-Sokoke Forest and community associations have shown that forests are best protected when local families benefit directly from their survival.",
      "Through sustainable livelihoods like butterfly farming, beekeeping, indigenous tree nurseries and trained community birding guides, conservation becomes a shared source of pride and economic resilience.",
    ],
    relatedDestinationSlugs: ["watamu", "malindi"],
    relatedTopic: "Arabuko-Sokoke Forest Conservation",
  },
  {
    slug: "forgotten-beauty-of-kenyas-indigenous-forests",
    title: "The Forgotten Beauty of Kenya's Indigenous Forests",
    excerpt:
      "Look past the open savannahs to discover Kenya's coastal, montane and escarpment forests — vital ecosystems that regulate water, climate and life.",
    categorySlug: "forests-and-biodiversity",
    author: "KayArabuko Editorial",
    publishedAt: "2026-11-02",
    readMinutes: 4,
    image: {
      src:
        SAVED_FIREBASE_IMAGE_OVERRIDES[
          "story.forgotten-beauty-of-kenyas-indigenous-forests"
        ] || EDITORIAL_IMAGES.regionAberdares,
      alt: "Mist rising over an indigenous montane forest in Kenya",
    },
    body: [
      "When the world pictures Kenya, open golden grasslands usually come to mind first. Yet Kenya's indigenous forests — from the misty bamboo and podocarpus slopes of the Aberdares to the coastal canopies of Shimba Hills and Arabuko-Sokoke — are the quiet lifeblood of the nation.",
      "These forests capture rainfall, feed major rivers, shelter endemic birds and insects, and hold centuries of botanical and cultural knowledge for surrounding communities.",
      "Walking slowly through an indigenous forest with a local guide changes how you see Kenya: every tree species, bird call and forest stream tells a story of delicate ecological balance.",
    ],
    relatedDestinationSlugs: ["aberdare"],
    relatedTopic: "Forest Walks & Biodiversity Discovery",
  },
  {
    slug: "cultural-heritage-of-kenyas-swahili-coast",
    title: "The Cultural Heritage of Kenya's Swahili Coast",
    excerpt:
      "Beyond white sand beaches lies a rich maritime civilization of coral-stone architecture, carved doors, dhow craftsmanship, poetry and coastal cuisine.",
    categorySlug: "places-and-landscapes",
    author: "KayArabuko Editorial",
    publishedAt: "2026-11-07",
    readMinutes: 5,
    image: {
      src:
        SAVED_FIREBASE_IMAGE_OVERRIDES[
          "story.cultural-heritage-of-kenyas-swahili-coast"
        ] || EDITORIAL_IMAGES.swahili,
      alt: "Traditional Swahili dhow on the Indian Ocean along the Kenyan Coast",
    },
    body: [
      "Along the Kenyan shoreline — from Lamu and Malindi to Watamu, Mombasa and the southern coast — the Indian Ocean has connected communities for centuries. Yet Swahili culture is deeply rooted in the coastal soil, creeks and towns of East Africa.",
      "Walking through historic coastal quarters reveals coral-stone houses designed to catch ocean breezes, workshops where master artisans carve intricate wooden doors, and harbours where wooden dhows are still built and repaired by hand.",
      "Experiencing the coast through its people, spice-scented kitchens, markets and mangrove waterways transforms a coastal visit into a genuine cultural encounter.",
    ],
    relatedDestinationSlugs: ["diani", "watamu", "malindi", "lamu"],
    relatedTopic: "The Swahili Coast",
  },
];

export const storyBySlug = (slug: string): Story | undefined =>
  stories.find((s) => s.slug === slug);

/** SECTION 07B: EXCURSIONS — SHORT TRIPS & FULL ONE-DAY VISITS */
export const excursionsSectionHeader = {
  eyebrow: "EXCURSIONS & ONE-DAY VISITS",
  headline: "Short Trips, Forest Walks, Creek Rides & Coastal Discovery.",
  description:
    "Managed from our Watamu, Timboni Stage office by Kaya Experience Ltd, our guided full-day and half-day excursions connect you with Arabuko-Sokoke Forest, historic Gede Ruins, Safari Blue lagoon adventures and the living mangrove creeks of Mida.",
  officeNote:
    "Departing daily from Watamu (Timboni Stage), Malindi & the Kenyan Coast · Guided by local naturalists, historians and dhow captains.",
};

export const excursionsList: ExcursionItem[] = [
  {
    slug: "arabuko-sokoke-forest-excursion",
    title: "Arabuko-Sokoke Forest Full-Day Visit",
    duration: "Full-Day / Half-Day Excursion",
    location: "Arabuko-Sokoke Forest (Watamu & Kilifi)",
    category: "Forest & Endemic Wildlife",
    description:
      "Venture into East Africa's largest remaining coastal dry forest with certified local guides. Walk beneath ancient Cynometra and Brachystegia canopies, track the Golden-rumped Elephant Shrew, and take in sunset views over Nyari cliff.",
    activities: [
      "Guided forest nature trails & botanical walks",
      "Tracking endemic mammals & rare forest butterflies",
      "Nyari viewpoint overlooking the forest canopy",
      "Optional visit to Kipepeo community butterfly project",
    ],
    image: {
      src: EDITORIAL_IMAGES.arabukoForest,
      alt: "Guided full-day forest excursion in Arabuko-Sokoke Forest",
    },
  },
  {
    slug: "gede-ruins-heritage-excursion",
    title: "Gede Ruins Historical & Forest Excursion",
    duration: "Half-Day / Full-Day Excursion",
    location: "Gede, Near Watamu",
    category: "Swahili History & Sacred Forest",
    description:
      "Step inside a mysterious 12th-century Swahili coral-stone town enveloped by indigenous coastal forest. Explore palaces, mosques, pillar tombs and archaeological treasures while Sykes' monkeys and hornbills move through the ancient baobabs.",
    activities: [
      "Guided historical walk through palaces, mosques & houses",
      "Indigenous forest trail & ancient baobab trees",
      "Archaeological museum & Swahili trade history",
      "Tree-top canopy platform & Kipepeo butterfly sanctuary",
    ],
    image: {
      src: EDITORIAL_IMAGES.swahili,
      alt: "Historic coral-stone architecture and forest canopy at Gede Ruins",
    },
  },
  {
    slug: "safari-blue-marine-excursion",
    title: "Safari Blue Glass-Bottom Boat, Snorkelling & Dolphin Excursion",
    duration: "Full-Day Marine Excursion",
    location: "Watamu Marine National Park & Mida Creek",
    category: "Glass-Bottom Boat, Dolphins & Coral Snorkelling",
    description:
      "Set out across Watamu's crystal-clear turquoise lagoons aboard our signature Safari Blue glass-bottom boat. Watch vibrant reef fish and coral gardens right through the glass floor, dive in for guided snorkelling, spot pods of Indo-Pacific bottlenose dolphins in the open ocean, and relax on powder-white sandbanks with a freshly grilled Swahili seafood feast.",
    activities: [
      "Safari Blue glass-bottom boat cruise for underwater fish & coral viewing",
      "Dolphin watching in Watamu Marine National Park waters",
      "Guided snorkelling with masks & fins in vibrant coral gardens",
      "Sandbank relaxation & freshly grilled coastal seafood lunch in Mida Creek",
    ],
    image: {
      src:
        SAVED_FIREBASE_IMAGE_OVERRIDES["excursion.safari-blue-marine-excursion"] ||
        EDITORIAL_IMAGES.heroSwahiliDhow,
      alt: "Safari Blue glass-bottom boat excursion for viewing fish, snorkelling and seeing dolphins in Watamu",
    },
  },
  {
    slug: "mambrui-sand-dunes-quad-bikes",
    title: "Mambrui Golden Sand Dunes & Quad Bike Adventure",
    duration: "Half-Day / Sunset Excursion",
    location: "Mambrui Golden Sand Dunes (North of Malindi)",
    category: "Quad Biking, Desert Dunes & Ocean Views",
    description:
      "Experience the thrill of riding quad bikes across the dramatic golden-white rolling hills of the Mambrui Sand Dunes where desert-like dunes meet the turquoise Indian Ocean. Ideal for adventure seekers, couples, families and sunset photography.",
    activities: [
      "Guided quad bike riding across Mambrui's rolling coastal sand dunes",
      "Panoramic Indian Ocean & Sabaki River mouth viewpoints",
      "Sandboarding, dune ridge walks & golden-hour photography",
      "Private return transfer from Watamu or Malindi",
    ],
    image: {
      src:
        SAVED_FIREBASE_IMAGE_OVERRIDES["excursion.mambrui-sand-dunes-quad-bikes"] ||
        "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1400&q=85",
      alt: "Guests riding quad bikes across the Mambrui Golden Sand Dunes on the Kenyan Coast",
    },
  },
  {
    slug: "marafa-hells-kitchen-canyon",
    title: "Marafa Hell's Kitchen (Nyari) Sunset Canyon Excursion",
    duration: "Half-Day / Sunset Excursion",
    location: "Marafa Depression, Kilifi County (Near Malindi & Watamu)",
    category: "Sandstone Gorge, Geology & Giriama Folklore",
    description:
      "Explore Kenya's spectacular painted sandstone gorge — known locally as Nyari ('The Place Broken by Itself') and famously called Hell's Kitchen. Walk among towering crimson, gold and terracotta spires with community guides and watch the canyon glow like embers at sunset.",
    activities: [
      "Guided rim walk & canyon floor trek through colourful sandstone gorges",
      "Giriama oral folklore & geological story of the Marafa Depression",
      "Spectacular golden-hour sunset views over crimson canyon spires",
      "Easily combined with Mambrui Sand Dunes quad biking on a full-day trip",
    ],
    image: {
      src:
        SAVED_FIREBASE_IMAGE_OVERRIDES["excursion.marafa-hells-kitchen-canyon"] ||
        EDITORIAL_IMAGES.regionNorthern,
      alt: "Crimson and gold sandstone cliffs of Marafa Hell's Kitchen (Nyari) at sunset",
    },
  },
  {
    slug: "mida-creek-mangrove-boat-rides",
    title: "Boat Rides Among the Mangrove Forests of Mida",
    duration: "Half-Day / Sunset Excursion",
    location: "Mida Creek, Watamu",
    category: "Mangrove Channels & Creek Waterways",
    description:
      "Glide quietly by wooden boat or traditional canoe through the serene, winding mangrove channels of Mida Creek. Experience the tranquil rhythm of the tide, learn how mangrove roots nurture marine life, and watch the sky turn gold over the creek at sundown.",
    activities: [
      "Guided boat & canoe rides through tidal mangrove channels",
      "Sunset dhow and creek sundowner cruises",
      "Learning about blue-carbon mangrove ecology",
      "Peaceful photography along sheltered emerald waterways",
    ],
    image: {
      src: EDITORIAL_IMAGES.coastalMangroves,
      alt: "Boat ride winding through the mangrove forests of Mida Creek",
    },
  },
  {
    slug: "mida-creek-boardwalk-experience",
    title: "Mida Creek Boardwalk & Community Walk",
    duration: "Half-Day Excursion",
    location: "Mida Creek Conservation Area, Watamu",
    category: "Boardwalk & Community Conservation",
    description:
      "Walk across the suspended wooden boardwalk stretching high above Mida's ancient mangrove canopy and tidal flats. Meet community conservation groups, explore creekside Giriama villages, and enjoy fresh coastal snacks at the creek viewpoint.",
    activities: [
      "Suspended rope-and-timber boardwalk across the mangroves",
      "Panoramic creek lookout deck & tidal mudflat views",
      "Community-led mangrove nursery & restoration visit",
      "Cultural walk through neighbouring Mida villages",
    ],
    image: {
      src: EDITORIAL_IMAGES.introForest,
      alt: "Walking along the suspended wooden boardwalk through Mida Creek mangroves",
    },
  },
  {
    slug: "mida-creek-bird-watching-and-hikes",
    title: "Bird Watching & Nature Hikes in Mida Creek",
    duration: "Half-Day / Full-Day Excursion",
    location: "Mida Creek UNESCO Biosphere Reserve & Arabuko Edge",
    category: "Ornithology & Coastal Nature Hikes",
    description:
      "Explore one of East Africa's premier Important Bird Areas on foot with expert local ornithologists. Hike along creek shorelines, mudflats and forest-edge trails to spot Greater Flamingos, Crab Plovers, Terek Sandpipers, Ospreys, Kingfishers and rare forest species.",
    activities: [
      "Guided birding walks for migratory waders & waterbirds",
      "Spotting Crab Plovers, Flamingos, Herons & Kingfishers",
      "Scenic coastal creek and forest-boundary nature hikes",
      "Tailored checklists for avid birders & nature photographers",
    ],
    image: {
      src: EDITORIAL_IMAGES.regionCoast,
      alt: "Bird watching and guided nature hike along Mida Creek in Watamu",
    },
  },
];

/** SECTION 07C: ACCOMMODATION — VILLAS, COTTAGES, HOTELS, RESORTS & PRIVATE LODGINGS */
export const accommodationSectionHeader = {
  eyebrow: "ACCOMMODATION & COASTAL STAYS",
  headline: "Handpicked Villas, Cottages, Resorts & Private Lodgings.",
  description:
    "Whether you seek a tranquil private villa in Watamu, a thatched forest-edge cottage near Arabuko-Sokoke and Mida Creek, a full-service beachfront resort, or an intimate private lodging, Kaya Experience Ltd arranges stays that match your pace, group and budget.",
  bookingNote:
    "Personally inspected and coordinated from our Watamu, Timboni Stage office · Flexible short stays, family holidays & conservation retreats.",
};

export const accommodationOptions: AccommodationOption[] = [
  {
    slug: "private-villas",
    title: "Private Coastal & Garden Villas",
    category: "Villas",
    locations: "Watamu, Turtle Bay, Malindi & Diani",
    description:
      "Spacious, architectural Swahili and contemporary villas set in lush tropical gardens or overlooking the Indian Ocean. Complete with private swimming pools, verandas and optional private chef service.",
    amenities: [
      "Private swimming pools & tropical gardens",
      "Dedicated housekeeping & optional private Swahili chef",
      "Minutes from Watamu Marine Park & Mida Creek",
    ],
    idealFor: "Families, groups of friends & private retreats",
    image: {
      src: EDITORIAL_IMAGES.regionCoast,
      alt: "Private coastal villa surrounded by palms in Watamu, Kenya",
    },
  },
  {
    slug: "coastal-and-forest-cottages",
    title: "Swahili & Forest-Edge Cottages",
    category: "Cottages",
    locations: "Watamu, Mida Creek & Arabuko-Sokoke Border",
    description:
      "Charming makuti-thatched cottages and eco-bandas nestled beneath baobabs and coastal palms. Wake up to birdsong, ocean breezes and easy access to forest walks and creek excursions.",
    amenities: [
      "Authentic makuti thatch & coral-stone craftsmanship",
      "Self-catering or bed-and-breakfast flexibility",
      "Peaceful settings ideal for birders & nature lovers",
    ],
    idealFor: "Couples, solo travelers, birdwatchers & researchers",
    image: {
      src: EDITORIAL_IMAGES.introForest,
      alt: "Charming Swahili and forest-edge cottage in Watamu",
    },
  },
  {
    slug: "hotels-and-beach-resorts",
    title: "Boutique Hotels & Coastal Resorts",
    category: "Hotels & Resorts",
    locations: "Watamu Beach, Malindi, Kilifi & Diani Coast",
    description:
      "Carefully selected beachfront hotels and eco-conscious coastal resorts offering full hospitality, oceanfront dining, spa wellness and seamless pick-up for all KayArabuko excursions.",
    amenities: [
      "Direct beachfront access & ocean-view suites",
      "Full-board, half-board or all-inclusive coastal dining",
      "Doorstep pick-up for Safari Blue, Gede & Arabuko trips",
    ],
    idealFor: "Holidaymakers, honeymooners, conferences & tour groups",
    image: {
      src: EDITORIAL_IMAGES.swahili,
      alt: "Boutique coastal hotel and resort overlooking the Indian Ocean",
    },
  },
  {
    slug: "private-lodgings-and-eco-stays",
    title: "Private Lodgings, Eco-Camps & Homestays",
    category: "Private Lodgings",
    locations: "Watamu, Timboni, Mida Creek & Upcountry Conservancies",
    description:
      "Intimate private guest lodgings, treehouses, eco-camps and dignified community-hosted stays that offer warm Kenyan home hospitality and an authentic connection to local life.",
    amenities: [
      "Warm, host-led hospitality & home-cooked coastal cuisine",
      "Quiet, secure & pocket-friendly options for every stay length",
      "Direct support to local families and conservation hosts",
    ],
    idealFor: "Cultural explorers, long-stay guests & conservation volunteers",
    image: {
      src: EDITORIAL_IMAGES.pillarEmpower,
      alt: "Intimate private lodging and eco-stay hosted by local custodians",
    },
  },
];

export const kidFriendlyAccommodationHighlight = {
  slotKey: "accommodation.kid-friendly-family",
  badge: "FAMILY PACKAGES & KID-FRIENDLY STAYS",
  title: "Kid-Friendly Accommodations with Kids' Pools & Caregivers / Nannies On Call.",
  description:
    "Travelling with toddlers or young children? Our family safari and coastal villa packages feature handpicked kid-friendly accommodations equipped with shallow, safe kids' swimming pools and vetted, caring caregivers and nannies on call — giving parents peace of mind to relax by the ocean or enjoy an evening dinner while little ones are safely looked after.",
  highlights: [
    "Dedicated shallow kids' swimming pools & enclosed tropical gardens",
    "Experienced, vetted caregivers & bilingual nannies on call (daytime or evening)",
    "Spacious family interconnecting suites, baby cots, high chairs & child-friendly menus",
    "Gentle kid-paced excursions: Safari Blue glass-bottom boat, Gede Ruins monkeys & Kipepeo butterflies",
  ],
  image: {
    src:
      SAVED_FIREBASE_IMAGE_OVERRIDES["accommodation.kid-friendly-family"] ||
      SAVED_FIREBASE_IMAGE_OVERRIDES["accommodation.private-villas"] ||
      EDITORIAL_IMAGES.regionCoast,
    alt: "Kid-friendly coastal villa and resort accommodation with kids' swimming pool and nanny service in Watamu",
  },
};

/** SECTION 07D: KAYA ROOTS AFRICA — INDIGENOUS CROPS & FARMER EMPOWERMENT */
export const kayaRootsProgram: KayaRootsProgram = {
  name: "Kaya Roots Africa",
  parentOrg: "An Agribusiness & Livelihoods Initiative of Kaya Experience Ltd",
  leadName: "Dr. Milcah Wambua",
  leadRole: "Co-Founder & Head of Kaya Roots Africa",
  email: "kayaroots@kayarabuko.com",
  secondaryEmail: "milcah@kayarabuko.com",
  headline:
    "Empowering Local Farmers Through Indigenous Crops, Value Addition & Market Linkages.",
  description:
    "Beyond cultural and conservation visits, Kaya Experience Ltd directly supports smallholder farmers growing climate-resilient indigenous crops — especially cassava — through Kaya Roots Africa. Headed and led by our Co-Founder Dr. Milcah Wambua, the programme trains farmers, drives value addition of farm produce, and connects rural producers directly to reliable markets.",
  missionPoints: [
    "Agronomic training & capacity building on resilient indigenous crops such as cassava",
    "Value addition & processing of farm produce to multiply household income and reduce post-harvest loss",
    "Direct market linkages connecting rural smallholder farmers to sustainable buyers and value chains",
    "Strengthening food security, women- and youth-led agribusiness, and family livelihoods from Nyanza and Nakuru to the Kenyan Coast",
  ],
  regionsCovered: [
    "Nyanza Region (Lake Victoria Basin)",
    "Nakuru & The Rift Valley",
    "The Kenyan Coast (Kilifi, Watamu, Kwale & Malindi)",
  ],
  cropsAndFocus: [
    "Cassava & Climate-Resilient Indigenous Root Crops",
    "Farmer Training & Sustainable Agronomy",
    "Farm Produce Value Addition & Processing",
    "Market Access & Family Livelihood Support",
  ],
  image: {
    src: EDITORIAL_IMAGES.pillarEmpower,
    alt: "Kaya Roots Africa supporting local farmers and indigenous cassava value addition",
  },
};

/** SECTION 09B: MEET OUR TEAM — LEADERSHIP & MANAGEMENT */
export const teamSectionHeader = {
  eyebrow: "MEET OUR TEAM · KAYA EXPERIENCE LTD",
  headline: "Guided by Trust, Rooted in Community & Conservation.",
  description:
    "KayArabuko is proudly managed by Kaya Experience Ltd from our office at Watamu, Timboni Stage. Meet the leadership and custodians who shepherd every guest experience, conservation excursion and farmer empowerment initiative.",
};

export const teamMembers: TeamMember[] = [
  {
    slug: "mrisa",
    name: "Mrisa",
    aka: "“Mrisa” — Giriama for The Shepherd",
    role: "Founder & Managing Director",
    organization: "Kaya Experience Ltd · KayArabuko",
    bio: "A passionate entrepreneur in hospitality, tourism, and food systems, Mr. Karisa leads the strategic vision behind the Kaya Experience brands. His mission is to create authentic coastal experiences through sustainable tourism, quality accommodation, and community empowerment.",
    heritageMeaning:
      "“Mrisa is my aka for work — a Giriama word that means a Shepherd. Today, I am a shepherd of clients, guests and tourists, watching over every detail of your stay and journey so you know I can always be trusted.”",
    focusAreas: [
      "Client Stewardship & Bespoke Excursion Planning",
      "Arabuko-Sokoke, Mida Creek & Coastal Heritage Tours",
      "Villas, Cottages, Resorts & Private Lodging Coordination",
    ],
    contactPhone: "+254 728 560303 / +254 712 863538",
    contactEmail: "hello@kayarabuko.com",
    image: {
      src:
        SAVED_FIREBASE_IMAGE_OVERRIDES["team.mrisa"] ||
        EDITORIAL_IMAGES.introPeople,
      alt: "Mrisa — Founder & Managing Director of Kaya Experience Ltd",
      slotKey: "team.mrisa",
    },
  },
  {
    slug: "dr-milcah-wambua",
    name: "Dr. Milcah Wambua",
    aka: "DR. Milcah Wambua",
    role: "Co-Founder",
    organization: "Kaya Experience Ltd · Kaya Roots Africa",
    bio: "A distinguished scholar and professional, Dr. Milcah Karisa brings academic excellence, leadership, and innovation to the organization. Her commitment to education, research, and lifestyle development strengthens the foundation of the Kaya Experience vision.",
    heritageMeaning:
      "“True conservation and heritage preservation thrive when rural families have dignified, resilient livelihoods rooted in their own land and indigenous crops.”",
    focusAreas: [
      "Indigenous Crops & Cassava Value Chain Development",
      "Farmer Training, Value Addition & Market Linkages",
      "Supporting Families Across Nyanza, Nakuru & the Coast",
    ],
    contactEmail: "kayaroots@kayarabuko.com",
    contactPhone: "+254 728 560303 / +254 712 863538",
    image: {
      src:
        SAVED_FIREBASE_IMAGE_OVERRIDES["team.dr-milcah-wambua"] ||
        EDITORIAL_IMAGES.pillarExplore,
      alt: "Dr. Milcah Wambua — Co-Founder of Kaya Experience Ltd",
      slotKey: "team.dr-milcah-wambua",
    },
  },
  {
    slug: "arnold-mramba",
    name: "Arnold Mramba",
    aka: "10+ Years Experience · Italian, French & German Guides",
    role: "Lead Driver & Multilingual Tour Guides Team",
    organization: "Kaya Experience Ltd · KayArabuko",
    bio: "Arnold Mramba is an experienced driver with over 10 years on the road, bringing professionalism, reliability, and a strong understanding of the Kenyan coastal routes. He is committed to ensuring guests enjoy safe, comfortable, and seamless journeys, whether travelling for transfers, excursions, or safari adventures.",
    heritageMeaning:
      "Our team is also supported by knowledgeable tour guides fluent in Italian, French, and German, alongside bilingual guides who make communication easy and ensure guests feel welcome, informed, and connected to the local culture throughout their experience.",
    focusAreas: [
      "10+ Years Professional Coastal, Transfer & Safari Driving",
      "Tour Guides Fluent in Italian, French, German & Bilingual Support",
      "Safe, Comfortable & Culturally Connected Guest Journeys",
    ],
    contactPhone: "+254 728 560303 / +254 712 863538",
    contactEmail: "hello@kayarabuko.com",
    image: {
      src:
        SAVED_FIREBASE_IMAGE_OVERRIDES["team.arnold-mramba"] ||
        EDITORIAL_IMAGES.heroForestCommunity,
      alt: "Arnold Mramba — Experienced Driver & Multilingual Tour Guides Team",
      slotKey: "team.arnold-mramba",
    },
  },
];

/** SECTION 09C: PUBLISHED POSTERS & CAMPAIGN GALLERY */
export const postersSectionHeader = {
  eyebrow: "PUBLISHED POSTERS & BULLETINS",
  headline: "Our Featured Excursion, Safari, Accommodation & Community Posters.",
  description:
    "Browse posters from our published safaris, excursions, coastal villa stays, Mida Creek adventures and Kaya Roots Africa community programmes. Click any poster to view it full-screen or enquire directly with Mrisa on +254 728 560303.",
};

export const initialPublishedPosters: PublishedPoster[] =
  Array.isArray(savedPostersJson?.posters) &&
  savedPostersJson.posters.length > 0
    ? (savedPostersJson.posters as PublishedPoster[])
    : [
        {
          id: "poster-1",
          title: "Arabuko-Sokoke & Gede Ruins Day Excursion",
          subtitle:
            "Forest Walks, Endemic Birding & 12th-Century Swahili Heritage",
          category: "Excursions",
          dateLabel: "Featured Excursion Poster",
          description:
            "Full-day guided visit combining Arabuko-Sokoke Forest trails, Kipepeo butterfly project and the historic Gede Ruins. Departing from Watamu, Timboni Stage.",
          image: {
            src: EDITORIAL_IMAGES.arabukoForest,
            alt: "KayArabuko Poster — Arabuko-Sokoke & Gede Ruins Day Excursion",
          },
        },
      ];

/** SECTION 09D: PREVIOUS TOURS & TRAVELS GALLERY */
export const activityGallerySectionHeader = {
  eyebrow: "PREVIOUS TOURS & TRAVELS GALLERY",
  headline: "Real Safari Animals, Family Villas, Mambrui Quad Bikes & Safari Blue Memories.",
  description:
    "Browse real photographs from our previous tours and travels across Kenya — sorted into real animals captured on safari, family packages & kid-friendly accommodations with kids' pools and caregivers/nannies on call, guys riding quad bikes on Mambrui Sand Dunes, Marafa Hell's Kitchen, our Safari Blue glass-bottom boat for fish & dolphin viewing, and cultural heritage moments.",
};

export const activityGalleryCategories = [
  "All Tours & Travels",
  "Real Safari Wildlife & Animals",
  "Family & Kid-Friendly Stays",
  "Mambrui Quad Bikes & Hell's Kitchen",
  "Safari Blue Glass-Bottom Boat & Dolphins",
  "Past Guests & Cultural Memories",
] as const;

export const initialActivityGallery: ActivityGalleryItem[] = [
  {
    id: "act-wildlife-safari",
    title: "Real Safari Animals — Tsavo Red Elephants, Lions & Giraffes",
    location: "Tsavo East, Tsavo West & Amboseli National Parks",
    category: "Real Safari Wildlife & Animals",
    caption:
      "Authentic wildlife moments captured on our multi-day 4x4 game drives — herds of red-dusted Tsavo elephants, lions on the savannah, and giraffes beneath Mount Kilimanjaro.",
    featuredSpan: true,
    image: {
      src: EDITORIAL_IMAGES.wildlifeEcosystems,
      alt: "Real safari animals taken on a KayArabuko wildlife safari in Kenya",
    },
  },
  {
    id: "act-watamu-villas",
    title: "Kid-Friendly Family Villas with Kids' Pools & Nannies On Call",
    location: "Watamu, Turtle Bay & Malindi Coast",
    category: "Family & Kid-Friendly Stays",
    caption:
      "Family packages in handpicked kid-friendly accommodations featuring shallow kids' swimming pools, tropical gardens, and trusted caregivers & nannies on call.",
    image: {
      src:
        SAVED_FIREBASE_IMAGE_OVERRIDES["accommodation.private-villas"] ||
        EDITORIAL_IMAGES.regionCoast,
      alt: "Kid-friendly coastal villa with kids' swimming pool and nanny service in Watamu",
    },
  },
  {
    id: "act-mambrui-quad-bikes",
    title: "Quad Bike Riders on the Mambrui Golden Sand Dunes",
    location: "Mambrui Sand Dunes (North of Malindi)",
    category: "Mambrui Quad Bikes & Hell's Kitchen",
    caption:
      "Guests riding quad bikes across the dramatic golden coastal sand dunes of Mambrui overlooking the Indian Ocean.",
    image: {
      src:
        SAVED_FIREBASE_IMAGE_OVERRIDES["excursion.mambrui-sand-dunes-quad-bikes"] ||
        "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1400&q=85",
      alt: "Guests on quad bikes at Mambrui Sand Dunes on the Kenyan Coast",
    },
  },
  {
    id: "act-safari-blue-dhow",
    title: "Safari Blue Glass-Bottom Boat — Viewing Fish, Snorkelling & Dolphins",
    location: "Watamu Marine National Park & Mida Creek",
    category: "Safari Blue Glass-Bottom Boat & Dolphins",
    caption:
      "Cruising aboard our Safari Blue glass-bottom boat for underwater reef fish viewing, guided coral garden snorkelling, spotting wild dolphins, and a sandbank seafood lunch.",
    image: {
      src:
        SAVED_FIREBASE_IMAGE_OVERRIDES["excursion.safari-blue-marine-excursion"] ||
        EDITORIAL_IMAGES.heroSwahiliDhow,
      alt: "Safari Blue glass-bottom boat for viewing fish, snorkelling and seeing dolphins in Watamu",
    },
  },
  {
    id: "act-rift-valley-safari",
    title: "Lake Nakuru Safari — Rhinos, Flamingos & Rift Valley Wildlife",
    location: "Lake Nakuru National Park & Great Rift Valley",
    category: "Real Safari Wildlife & Animals",
    caption:
      "Real safari animal sightings at Lake Nakuru — white and black rhinos, Rothschild's giraffes, pelicans and flamingos along the alkaline lake shore.",
    image: {
      src: EDITORIAL_IMAGES.regionRiftValley,
      alt: "Real wildlife sightings at Lake Nakuru National Park on safari",
    },
  },
  {
    id: "act-marafa-hells-kitchen",
    title: "Marafa Hell's Kitchen (Nyari) Crimson Sunset Gorge",
    location: "Marafa Depression, Near Malindi & Watamu",
    category: "Mambrui Quad Bikes & Hell's Kitchen",
    caption:
      "Exploring the towering crimson, terracotta and gold sandstone spires of Marafa Hell's Kitchen at sunset with local Giriama guides.",
    image: {
      src:
        SAVED_FIREBASE_IMAGE_OVERRIDES["excursion.marafa-hells-kitchen-canyon"] ||
        EDITORIAL_IMAGES.regionNorthern,
      alt: "Marafa Hell's Kitchen sandstone canyon excursion at sunset",
    },
  },
  {
    id: "act-gede-ruins",
    title: "Past Guests at Gede Ruins 12th-Century Swahili Stone Town",
    location: "Gede Ruins National Monument, Near Watamu",
    category: "Past Guests & Cultural Memories",
    caption:
      "Walking with international and local guests through the ancient coral-stone palaces, Great Mosque and sacred forest trails of Gede Ruins.",
    featuredSpan: true,
    image: {
      src:
        SAVED_FIREBASE_IMAGE_OVERRIDES["excursion.gede-ruins-heritage-excursion"] ||
        EDITORIAL_IMAGES.swahili,
      alt: "Past guests exploring Gede Ruins historical excursion near Watamu",
    },
  },
  {
    id: "act-kid-friendly-resorts",
    title: "Family Beach Resorts with Kids' Pools & Dedicated Caregivers",
    location: "Watamu Beach, Malindi & Diani Coast",
    category: "Family & Kid-Friendly Stays",
    caption:
      "Relaxed family stays with shallow children's pools, family suites, and attentive nannies on call so parents and kids both enjoy an unforgettable coastal holiday.",
    image: {
      src:
        SAVED_FIREBASE_IMAGE_OVERRIDES["accommodation.hotels-and-beach-resorts"] ||
        EDITORIAL_IMAGES.swahili,
      alt: "Family beach resort with kids pool and caregivers on call in Watamu",
    },
  },
  {
    id: "act-mida-mangrove-boat",
    title: "Mida Creek Mangrove Boat Rides & Sunset Dhow Cruises",
    location: "Mida Creek, Watamu",
    category: "Safari Blue Glass-Bottom Boat & Dolphins",
    caption:
      "Peaceful boat and canoe rides winding through ancient emerald mangrove channels and tidal waterways at Mida Creek.",
    image: {
      src:
        SAVED_FIREBASE_IMAGE_OVERRIDES["excursion.mida-creek-mangrove-boat-rides"] ||
        EDITORIAL_IMAGES.coastalMangroves,
      alt: "Boat ride among the mangrove forests of Mida Creek",
    },
  },
  {
    id: "act-northern-safari",
    title: "Amboseli, Samburu & Conservancy Wildlife Encounters",
    location: "Amboseli, Taita Hills & Northern Rangelands",
    category: "Real Safari Wildlife & Animals",
    caption:
      "Real safari photography of elephants, zebras, antelopes and predators across Kenya's premier national parks and wildlife conservancies.",
    image: {
      src:
        SAVED_FIREBASE_IMAGE_OVERRIDES["ecosystem.community-conservancies"] ||
        EDITORIAL_IMAGES.regionNorthern,
      alt: "Real animals photographed on a KayArabuko wildlife safari",
    },
  },
  {
    id: "act-arabuko-walk",
    title: "Arabuko-Sokoke Forest Walks, Kipepeo Butterflies & Mida Boardwalk",
    location: "Arabuko-Sokoke Forest & Mida Creek, Watamu",
    category: "Past Guests & Cultural Memories",
    caption:
      "Guided forest walks beneath East Africa's largest coastal dry forest, crossing the suspended Mida Creek boardwalk, and meeting local conservationists.",
    image: {
      src:
        SAVED_FIREBASE_IMAGE_OVERRIDES["excursion.mida-creek-boardwalk-experience"] ||
        EDITORIAL_IMAGES.arabukoForest,
      alt: "Guided walk in Arabuko-Sokoke Forest and Mida Creek Boardwalk",
    },
  },
  {
    id: "act-cultural-homestead",
    title: "Community Cultural Visits & Kaya Roots Africa Field Tours",
    location: "Watamu, Nakuru, Nyanza & Kenyan Coast",
    category: "Past Guests & Cultural Memories",
    caption:
      "Dignified, host-led cultural visits and grassroots farmer empowerment tours with Mrisa and Co-Founder Dr. Milcah Wambua.",
    image: {
      src: EDITORIAL_IMAGES.pillarExplore,
      alt: "Past guests during a community cultural encounter in Kenya",
    },
  },
];

/** SECTION 09: ABOUT KAYARABUKO */
export const aboutContent = {
  eyebrow: "ABOUT KAYARABUKO · MANAGED BY KAYA EXPERIENCE LTD",
  headline: "Rooted in Discovery. Driven by Preservation.",
  paragraphs: [
    "KayArabuko — proudly managed by Kaya Experience Ltd from our office at Watamu, Timboni Stage — is built around a simple belief: to truly appreciate Kenya, we must understand its people, cultures and natural heritage.",
    "Founded by Mrisa ('The Shepherd' of guests and travelers) together with Co-Founder Dr. Milcah Wambua (who leads Kaya Roots Africa), our work brings together cultural discovery, guided forest and creek excursions, curated coastal accommodations, conservation awareness and grassroots farmer empowerment.",
    "We create meaningful connections between visitors, local communities, smallholder farmers and the environments that sustain them — from Watamu, Arabuko-Sokoke and Mida Creek to Nyanza, Nakuru and across Kenya.",
  ],
  pillarsSummary: [
    {
      title: "EXPLORE",
      text: "Discovering Kenya's diverse communities, living traditions, full-day excursions and curated coastal stays beyond conventional tourism.",
    },
    {
      title: "CONSERVE",
      text: "Supporting awareness and stewardship of Arabuko-Sokoke Forest, Mida Creek mangroves, marine ecosystems and cultural heritage.",
    },
    {
      title: "EMPOWER",
      text: "Ensuring visits benefit local custodians and empowering farmers on indigenous crops like cassava via Kaya Roots Africa.",
    },
  ],
  finalBanner: {
    brand: "KAYARABUKO · MANAGED BY KAYA EXPERIENCE LTD",
    pillars: "EXPLORE. CONSERVE. EMPOWER.",
    closingQuote: "Discover the stories. Preserve the heritage. Empower the communities.",
  },
};

/** SECTION 07A: MULTI-DAY SAFARI PACKAGES (POLLMAN'S, BONFIRE, FRAGOLA WATAMU & WATAMU SAFARIS STYLE — NO PRICES) */
export const safariPackagesSectionHeader = {
  eyebrow: "SIGNATURE MULTI-DAY SAFARI PACKAGES · WATAMU, MOMBASA & NAIROBI DEPARTURES",
  headline: "Tailored Bush & Beach Safari Packages Across Kenya.",
  description:
    "Curated with international safari standards and warm Kenyan coastal hospitality. Whether you are visiting from abroad or planning a Kenyan family and group holiday, choose from our 2-day to 7-day packages departing from Watamu (Timboni Stage), Malindi, Mombasa, Diani or Nairobi — personally coordinated by Mrisa ('The Shepherd').",
  departureNote:
    "Weekly & Daily Private or Shared Departures · Custom Quotes via WhatsApp Business (+254 728 560303) · Guaranteed Window Seats & Pop-Up Roof 4x4 Land Cruisers.",
};

export const safariPackagesList: SafariPackageItem[] = [
  {
    slug: "watamu-tsavo-east-overnight-express",
    title: "Watamu to Tsavo East Safari Express",
    departureSubtitle: "Daily departures from Watamu & Malindi",
    durationLabel: "2 Days / 1 Night",
    durationDays: 2,
    routeSummary: "Watamu / Malindi → Sala Gate → Galana River → Aruba Dam → Tsavo East",
    audienceBadge: "Coastal Express · Watamu Safaris Classic",
    description:
      "The quintessential short coastal bush safari departing directly from your Watamu villa or beach resort via Sala Gate along the scenic Galana River. Track Tsavo's famous red-dusted elephants, maneless lions, hippos at Lugard Falls and giraffes at Aruba Dam.",
    whatsIncluded: [
      "Meet & Greet at your Watamu or Malindi hotel, villa or resort",
      "One night’s full-board safari lodge or luxury tented camp accommodation",
      "All meals from lunch on Day 1 through lunch on Day 2",
      "Custom 4x4 Safari Land Cruiser or safari vehicle (up to 6 passengers)",
      "Guaranteed window seat & pop-up game viewing roof hatch",
      "English-speaking or bi-lingual driver-guide (Italian, German & French available)",
      "Filtered drinking water in vehicle throughout the safari",
      "All KWS Tsavo East National Park entry and conservation fees",
    ],
    image: {
      src: EDITORIAL_IMAGES.wildlifeEcosystems,
      alt: "Tsavo East 2 Days 1 Night safari departing from Watamu",
      slotKey: "safari.pkg.tsavo-express",
    },
  },
  {
    slug: "tsavo-east-and-salt-lick-rendezvous",
    title: "Tsavo East & Salt Lick Sanctuary Rendezvous",
    departureSubtitle: "Weekly & daily departures from Watamu, Malindi & Mombasa",
    durationLabel: "3 Days / 2 Nights",
    durationDays: 3,
    routeSummary: "Watamu / Coast → Tsavo East National Park → Taita Hills & Salt Lick Sanctuary",
    audienceBadge: "3 Days / 2 Nights · International & Local Favourite",
    description:
      "Experience the vast red plains of Tsavo East combined with the iconic Taita Hills Wildlife Sanctuary. Spend an unforgettable evening watching elephants, buffalo and leopards gather at floodlit waterholes directly beneath your elevated lodge stilts.",
    whatsIncluded: [
      "Meet & Greet at Watamu resort, Mombasa/Malindi Airport or Miritini SGR",
      "Two nights’ full-board safari accommodation (Tsavo East & Taita/Salt Lick)",
      "All meals from lunch on Day 1 through breakfast on Day 3",
      "Shared or private 4x4 safari vehicle with up to 6 passengers",
      "Guaranteed window seat & pop-up game hatch",
      "English-speaking or bi-lingual KPSGA-certified driver-guide",
      "Filtered drinking water in vehicle",
      "Park entry and sanctuary conservation fees",
    ],
    image: {
      src: EDITORIAL_IMAGES.regionNorthern,
      alt: "3 Days 2 Nights Tsavo East and Taita Hills Salt Lick Safari Package",
      slotKey: "safari.pkg.tsavo-saltlick",
    },
  },
  {
    slug: "mombasa-and-watamu-rendezvous-classic",
    title: "Mombasa & Watamu Rendezvous",
    departureSubtitle: "Weekly departures from Watamu, Mombasa & Diani",
    durationLabel: "4 Days / 3 Nights",
    durationDays: 4,
    routeSummary: "Watamu / Mombasa → Tsavo East → Tsavo West (Mzima Springs) → Amboseli",
    audienceBadge: "4 Days / 3 Nights · Flagship Rendezvous Circuit",
    description:
      "Our signature four-day southern circuit connecting the Kenyan Coast to the snow-capped backdrop of Mount Kilimanjaro. Discover Tsavo East’s red elephant herds, Tsavo West’s crystal-clear Mzima Springs and volcanic Shetani lava flows, and Amboseli’s sweeping swamps.",
    whatsIncluded: [
      "Meet & Greet at your coastal hotel, airport or SGR train station",
      "Three nights’ full-board safari lodge / tented camp accommodation",
      "All meals from lunch on Day 1 through breakfast on Day 4",
      "Shared or private 4x4 safari vehicle with up to 6 passengers",
      "Guaranteed window seat",
      "Pop-up game hatch for 360-degree photography",
      "English-speaking or bi-lingual driver-guide",
      "Filtered water in vehicle",
      "Park entry and conservation fees",
    ],
    image: {
      src: EDITORIAL_IMAGES.maasai,
      alt: "4 Days 3 Nights Mombasa and Watamu Rendezvous Safari Package",
      slotKey: "safari.pkg.mombasa-rendezvous",
    },
  },
  {
    slug: "watamu-bush-forest-and-marine-explorer",
    title: "Watamu Bush, Forest & Marine Explorer",
    departureSubtitle: "Flexible daily departures from Watamu, Timboni Stage",
    durationLabel: "4 Days / 3 Nights",
    durationDays: 4,
    routeSummary: "Tsavo East Game Safari + Arabuko-Sokoke Forest + Gede Ruins + Mida Creek & Safari Blue",
    audienceBadge: "4 Days / 3 Nights · Signature Kaya Experience Combo",
    description:
      "The ultimate coastal and bush harmony curated in Watamu: combine a thrilling game drive safari in Tsavo East with guided endemic birding in Arabuko-Sokoke Forest, 12th-century Gede Ruins, a sunset mangrove canoe ride at Mida Creek, and a full-day Safari Blue dhow feast.",
    whatsIncluded: [
      "Meet & Greet at Malindi Airport (MYD), Mombasa Airport (MBA) or Miritini SGR",
      "Three nights’ accommodation in handpicked safari lodge & Watamu villa/resort",
      "All safari meals plus fresh grilled coastal seafood lunch during Safari Blue",
      "Private 4x4 Safari vehicle, traditional wooden dhow & Mida mangrove boat",
      "Guaranteed window seat & pop-up game hatch on game drives",
      "Certified Arabuko-Sokoke naturalist, Gede historian & Mrisa's field team",
      "Filtered water in vehicle & marine snorkelling equipment",
      "All KWS National Park, Marine Park, Gede Ruins & community conservation fees",
    ],
    image: {
      src: EDITORIAL_IMAGES.heroSwahiliDhow,
      alt: "4 Days 3 Nights Watamu Bush Forest and Safari Blue Marine Explorer",
      slotKey: "safari.pkg.watamu-bush-marine",
    },
  },
  {
    slug: "bush-to-beach-family-and-group-getaway",
    title: "Bush-to-Beach Family & Group Holiday Package",
    departureSubtitle: "Tailored departures for families, couples & groups",
    durationLabel: "5 Days / 4 Nights",
    durationDays: 5,
    routeSummary: "SGR / Airport Arrival → Tsavo & Amboseli Safari → Watamu Beach Villa & Mida Creek",
    audienceBadge: "5 Days / 4 Nights · Family & Group Holiday Getaway",
    description:
      "Designed for Kenyan families, friends, honeymooners and holiday groups seeking both big-five wildlife excitement and tropical coastal relaxation. Enjoy two action-packed safari days followed by coastal villa living, Safari Blue dolphin spotting and Mida Creek boardwalks.",
    whatsIncluded: [
      "Return Meet & Greet transfers from Miritini SGR Train Station or Airport",
      "Four nights’ accommodation (Safari Lodge + Watamu Beach Resort or Private Villa)",
      "Full-board safari dining & coastal seafood experience",
      " Dedicated 4x4 safari vehicle or executive group cruiser (up to 6 passengers per vehicle)",
      "Guaranteed window seat & pop-up roof hatch",
      "Dedicated English & Swahili-speaking driver-guide",
      "Filtered drinking water in vehicle throughout",
      "All park entry, marine reserve and conservation fees included",
    ],
    image: {
      src: EDITORIAL_IMAGES.regionCoast,
      alt: "5 Days 4 Nights Bush to Beach Family and Group Holiday Package in Watamu",
      slotKey: "safari.pkg.bush-to-beach",
    },
  },
  {
    slug: "grand-kenya-classic-mara-nakuru-amboseli",
    title: "The Grand Kenya Classic — Mara, Nakuru & Amboseli",
    departureSubtitle: "Weekly road or fly-in departures from Watamu, Mombasa & Nairobi",
    durationLabel: "7 Days / 6 Nights",
    durationDays: 7,
    routeSummary: "Watamu / Coast / Nairobi → Amboseli → Great Rift Valley & Lake Nakuru → Maasai Mara",
    audienceBadge: "7 Days / 6 Nights · Premier All-Kenya Expedition",
    description:
      "Our flagship week-long expedition across Kenya’s greatest wildlife amphitheatres. Witness Amboseli’s elephants below Kilimanjaro, rhino and flamingos along the Great Rift Valley lakes, and the legendary big cats and sweeping plains of the Maasai Mara National Reserve.",
    whatsIncluded: [
      "VIP Meet & Greet at Airport, SGR Station or Coastal Resort",
      "Six nights’ full-board luxury lodge & tented safari camp accommodation",
      "All meals from lunch on Day 1 through breakfast on Day 7",
      "Custom 4x4 Safari Land Cruiser with up to 6 passengers (or domestic fly-in option)",
      "Guaranteed window seat & pop-up game viewing hatch",
      "Senior English-speaking or bi-lingual KPSGA Silver/Gold driver-guide",
      "Unlimited filtered drinking water in vehicle",
      "All National Park, Reserve and community conservancy entry fees",
    ],
    image: {
      src: EDITORIAL_IMAGES.regionRiftValley,
      alt: "7 Days 6 Nights Grand Kenya Safari across Maasai Mara Lake Nakuru and Amboseli",
      slotKey: "safari.pkg.grand-kenya",
    },
  },
];

/** SECTION 07B2: AIRPORT, SGR TRAIN STATION & COASTAL TRANSFERS + TRAVEL LOGISTICS */
export const transfersSectionHeader = {
  eyebrow: "AIRPORT, SGR TRAIN STATION & COASTAL TRANSFERS · WATAMU, TIMBONI STAGE",
  headline: "Seamless Airport, SGR Train & Private Coastal Transfers.",
  description:
    "Arriving via the Madaraka Express SGR train at Mombasa Miritini or Mariakani, flying into Malindi Airport (MYD) or Moi International Airport Mombasa (MBA), or moving between coastal villas and resorts? Mrisa and our professional driver team provide punctual, air-conditioned, door-to-door transfers and travel concierge services.",
  dispatchNote:
    "24/7 Flight & SGR Train Tracking · Direct WhatsApp Dispatch: +254 728 560303 / +254 712 863538 · Chilled Bottled Water & Name-Board Meet & Greet.",
};

export const transferServicesList: TransferServiceItem[] = [
  {
    slug: "sgr-train-station-transfers",
    title: "SGR Train Station Transfers (Miritini & Mariakani)",
    category: "SGR Train Transfers",
    routesCovered: "Mombasa Terminus (Miritini SGR) & Mariakani SGR ↔ Watamu, Malindi, Kilifi & Diani",
    vehicleTypes: "Executive Noah/Voxy, Alphard, Safari Minivan & Group Coaster",
    description:
      "Timed to every Madaraka Express morning, afternoon and night train arrival and departure. Your driver meets you directly at the SGR arrival concourse holding a welcome sign, assists with all luggage, and drives you smoothly along the coast straight to your Watamu villa or resort.",
    includedFeatures: [
      "Personalised name-board Meet & Greet at Miritini or Mariakani SGR exit",
      "Zero waiting fees if the train schedule shifts",
      "Air-conditioned private vehicle with chilled bottled drinking water",
      "Direct drop-off at any Watamu villa, cottage, hotel or Timboni Stage",
    ],
    image: {
      src: EDITORIAL_IMAGES.regionCoast,
      alt: "Private SGR train station transfer to Watamu and Malindi",
      slotKey: "transfer.sgr-station",
    },
  },
  {
    slug: "airport-transfers-malindi-mombasa",
    title: "Airport Transfers (Malindi MYD, Mombasa MBA & Nairobi)",
    category: "Airport Transfers",
    routesCovered: "Malindi Airport (25 mins) & Moi International Airport Mombasa ↔ Watamu, Malindi & Kilifi",
    vehicleTypes: "Executive Sedan, Luxury SUV, 7-Seater Van & 4x4 Land Cruiser",
    description:
      "Stress-free international and domestic airport pickups and drop-offs. Whether landing at Malindi Airport (just 25 minutes from Watamu), Moi International Airport in Mombasa, Ukunda/Diani Airstrip, or connecting in Nairobi (JKIA / Wilson), our chauffeurs monitor your live flight arrival.",
    includedFeatures: [
      "Live flight tracking — your driver is waiting even if your flight is delayed",
      "Arrivals terminal Meet & Greet with luggage assistance",
      "Express 25-minute transfer from Malindi Airport (MYD) to Watamu",
      "Comfortable long-distance coastal transfers from Mombasa Airport (MBA)",
    ],
    image: {
      src: EDITORIAL_IMAGES.swahili,
      alt: "VIP Airport transfer from Malindi and Mombasa Airport to Watamu",
      slotKey: "transfer.airport",
    },
  },
  {
    slug: "watamu-villa-and-inter-resort-shuttles",
    title: "Watamu Villa, Beach Resort & Inter-Town Shuttles",
    category: "Coastal & Resort Shuttles",
    routesCovered: "Watamu (Timboni Stage, Turtle Bay, Garoda, Jacaranda, Mida Creek) ↔ Malindi, Kilifi & Diani",
    vehicleTypes: "Private AC Shuttle, SUV & Safari Van",
    description:
      "Reliable point-to-point coastal transport for dinner reservations, beach hopping, Gede Ruins, Arabuko-Sokoke trailheads, Mida Creek sunset cruises, shopping runs, or transferring between hotels in Watamu, Malindi, Kilifi, Nyali and Diani.",
    includedFeatures: [
      "On-call pickup from your private villa, cottage or beach hotel",
      "Trusted local drivers who know every Watamu lane and beach road",
      "Flexible hourly, evening or full-day standby availability",
      "Safe, family-friendly vehicles with child seats available on request",
    ],
    image: {
      src: EDITORIAL_IMAGES.introForest,
      alt: "Private coastal shuttle between Watamu villas resorts and Malindi",
      slotKey: "transfer.coastal-shuttle",
    },
  },
  {
    slug: "chauffeur-driven-4x4-and-private-car-hire",
    title: "Chauffeur-Driven 4x4 Land Cruisers & Private Car Hire",
    category: "Private Chauffeur & 4x4 Hire",
    routesCovered: "Watamu, Kenyan Coast, Tsavo, Amboseli & Nationwide Safari Circuits",
    vehicleTypes: "Pop-Up Roof 4x4 Toyota Land Cruiser, Safari Minivan & Executive SUV",
    description:
      "Hire a custom-built 4x4 Safari Land Cruiser or executive private vehicle complete with an experienced, KPSGA-certified driver-guide for private game drives, photography expeditions, community visits, or multi-day coastal and upcountry journeys.",
    includedFeatures: [
      "Custom 4x4 Safari Land Cruisers with pop-up roof & guaranteed window seats",
      "Experienced, English-speaking and multi-lingual driver-guides",
      "Fuel, driver allowance & comprehensive passenger insurance included",
      "Cooler box stocked with filtered drinking water",
    ],
    image: {
      src: EDITORIAL_IMAGES.wildlifeEcosystems,
      alt: "Chauffeur-driven 4x4 Safari Land Cruiser hire in Watamu",
      slotKey: "transfer.4x4-hire",
    },
  },
  {
    slug: "sgr-ticketing-and-domestic-flight-concierge",
    title: "SGR Train Tickets, Domestic Flights & Travel Concierge",
    category: "Ticketing & Travel Concierge",
    routesCovered: "Nairobi–Mombasa SGR, Nairobi–Malindi/Mombasa/Ukunda Flights & Marine Passes",
    vehicleTypes: "Full Concierge Coordination & Doorstep Delivery",
    description:
      "Let Kaya Experience Ltd handle the paperwork and booking logistics. We assist guests with securing First Class and Economy Madaraka Express SGR train tickets, domestic coastal flights (Safarilink, Skyward Express, Jambojet, Kenya Airways), and KWS park entry passes.",
    includedFeatures: [
      "Advance First Class & Economy SGR Madaraka Express ticket assistance",
      "Domestic flight connections between Nairobi, Malindi, Mombasa & Maasai Mara",
      "Seamless bundling of tickets + station/airport pickup + villa stay",
      "Direct WhatsApp itinerary support with Mrisa (+254 728 560303)",
    ],
    image: {
      src: EDITORIAL_IMAGES.pillarExplore,
      alt: "SGR train ticket and domestic flight travel concierge in Watamu",
      slotKey: "transfer.concierge",
    },
  },
  {
    slug: "group-conference-and-event-transport-fleet",
    title: "Group, Family Reunion, Corporate & Wedding Transport Fleet",
    category: "Group & Event Fleet",
    routesCovered: "Coastal Conferences, Destination Weddings, Retreats & Academic Delegations",
    vehicleTypes: "22–33 Seater Executive Coasters, Fleet of 4x4 Cruisers & VIP Vans",
    description:
      "Coordinating a family reunion, coastal wedding in Watamu, corporate retreat, or university conservation field trip? We deploy a synchronized fleet of clean, air-conditioned coasters, vans and 4x4 cruisers with dedicated ground coordinators.",
    includedFeatures: [
      "Multi-vehicle airport & SGR group arrival coordination",
      "Dedicated transport captain from our Watamu, Timboni Stage office",
      "Custom group excursion transfers to Arabuko-Sokoke, Gede & Safari Blue",
      "Tailored logistics for Kaya Roots Africa agribusiness field delegations",
    ],
    image: {
      src: EDITORIAL_IMAGES.heroForestCommunity,
      alt: "Group and corporate transport fleet managed by Kaya Experience Ltd",
      slotKey: "transfer.group-fleet",
    },
  },
];

/** SECTION 09B2: CUSTOMER REVIEWS & GUEST TESTIMONIALS (TRIPADVISOR & GOOGLE RATINGS) */
export const customerReviewsSectionHeader = {
  eyebrow: "VERIFIED GUEST REVIEWS · TRIPADVISOR & GOOGLE RATINGS",
  headline: "Trusted by International Safari Travellers & Kenyan Families.",
  description:
    "From multi-day Tsavo, Amboseli and Maasai Mara safaris to punctual Miritini SGR and airport transfers, Arabuko-Sokoke birding walks, Safari Blue dhow cruises and Watamu villa stays — read what guests say about travelling with Mrisa ('The Shepherd') and Kaya Experience Ltd.",
  tripadvisorScore: "5.0",
  tripadvisorLabel: "Travellers' Choice Excellence · 100% Recommended",
  googleScore: "4.9",
  googleLabel: "Verified Google Business Profile · Watamu, Timboni Stage",
};

export const customerReviewsList: CustomerReviewItem[] = [
  {
    id: "sussie-chengo",
    guestName: "Sussie & Chengo",
    guestOrigin: "Switzerland 🇨🇭",
    platform: "TripAdvisor",
    rating: 5,
    dateLabel: "First Clients & Big Supporters",
    tripTitle: "Safari + Family Visit to Nakuru via SGR & Return Transfer from Nairobi to Nakuru",
    stayOrPackageTag: "Nakuru Safari + SGR & Nairobi–Nakuru Transfer",
    photoCaption:
      "Sussie and Chengo from Switzerland 🇨🇭 were our first clients and big fans of KayArabuko Safaris — a Safari plus Family visit to Nakuru via SGR and transfer to Nakuru from Nairobi and back. Great supporters.",
    reviewText:
      "Being the very first clients of KayArabuko Safaris is a memory we hold close to our hearts! Mrisa and the Kaya Experience Ltd team seamlessly coordinated our SGR train journey, our private transfer from Nairobi to Nakuru and back, and an unforgettable Lake Nakuru wildlife safari alongside our family visit. Their warmth, hospitality, and dedication to authentic Kenyan travel made us lifelong fans and proud supporters of KayArabuko Safaris!",
    image: {
      src:
        SAVED_FIREBASE_IMAGE_OVERRIDES["review.photo.sussie-chengo"] ||
        EDITORIAL_IMAGES.regionRiftValley,
      alt: "Sussie and Chengo from Switzerland — First clients and big fans of KayArabuko Safaris on their Nakuru Safari and family visit",
      slotKey: "review.photo.sussie-chengo",
    },
  },
  {
    id: "sophie-damien",
    guestName: "Sophie & Damien",
    guestOrigin: "France 🇫🇷",
    platform: "Google",
    rating: 5,
    dateLabel: "Verified Heritage & Excursion Guests",
    tripTitle: "Gede Ruins 12th-Century Swahili Stone Town & Sacred Forest Walk with Mrisa",
    stayOrPackageTag: "Gede Ruins Heritage Excursion",
    photoCaption:
      "This is Sophie and me, not in the picture is her Husband Damien both from France 🇫🇷 — At Gede Ruins.",
    reviewText:
      "Walking through the ancient coral-stone palaces, Great Mosque and towering baobab trees of Gede Ruins with Mrisa ('The Shepherd') was one of the highlights of our trip to Kenya. He brought centuries of Swahili coastal history and indigenous forest stories to life with such genuine warmth and knowledge — while Damien captured the photos! Merci beaucoup to KayArabuko Safaris for an unforgettable experience.",
    image: {
      src:
        SAVED_FIREBASE_IMAGE_OVERRIDES["review.photo.sophie-damien"] ||
        SAVED_FIREBASE_IMAGE_OVERRIDES["excursion.gede-ruins-heritage-excursion"] ||
        EDITORIAL_IMAGES.swahili,
      alt: "Sophie and Damien from France with Mrisa at Gede Ruins",
      slotKey: "review.photo.sophie-damien",
    },
  },
  {
    id: "rev-1",
    guestName: "Marco & Giulia Rossi",
    guestOrigin: "Milan, Italy",
    platform: "TripAdvisor",
    rating: 5,
    dateLabel: "Verified Safari & Coastal Guests",
    tripTitle: "4 Days / 3 Nights Mombasa & Watamu Rendezvous + Malindi Airport Transfer",
    stayOrPackageTag: "4 Days / 3 Nights Safari + Airport Transfer",
    photoCaption:
      "Marco & Giulia on their 4 Days / 3 Nights Tsavo & Amboseli safari and Watamu coastal excursion.",
    reviewText:
      "We booked our 4 Days / 3 Nights Tsavo East, Tsavo West & Amboseli safari and Malindi Airport transfers with Mrisa at Kaya Experience Ltd. The organization matched the highest international standards — pristine 4x4 Land Cruiser with a pop-up roof, guaranteed window seats, plenty of cold filtered water, and unforgettable views of elephants below Mount Kilimanjaro. In Watamu, their Safari Blue dhow day and Gede Ruins walk were magical. Mrisa truly lives up to his Giriama name, 'The Shepherd'!",
    image: {
      src:
        SAVED_FIREBASE_IMAGE_OVERRIDES["review.photo.rev-1"] ||
        EDITORIAL_IMAGES.wildlifeEcosystems,
      alt: "Marco & Giulia Rossi — Verified KayArabuko Safari Guests",
      slotKey: "review.photo.rev-1",
    },
  },
  {
    id: "rev-2",
    guestName: "The Kamau & Wanjiku Family",
    guestOrigin: "Nairobi, Kenya",
    platform: "Google",
    rating: 5,
    dateLabel: "Verified Family Holiday Guests",
    tripTitle: "Miritini SGR Train Transfer, 5-Day Bush-to-Beach Family Package & Watamu Villa",
    stayOrPackageTag: "5 Days / 4 Nights Family Package + SGR Transfer",
    photoCaption:
      "The Kamau & Wanjiku Family during their kid-friendly Watamu villa stay & Tsavo East family safari.",
    reviewText:
      "Best coastal and safari holiday our family has ever had! Mrisa’s driver was waiting for us right at the Mombasa Miritini SGR Terminus with a welcome board and cold water. They organized a spacious kid-friendly pool villa in Watamu with a wonderful nanny on call, took us on a 2-day Tsavo East game drive where the kids saw lions and hundreds of red elephants, and wrapped up with a Mida Creek mangrove boat ride and seafood lunch. Seamless from start to finish.",
    image: {
      src:
        SAVED_FIREBASE_IMAGE_OVERRIDES["review.photo.rev-2"] ||
        SAVED_FIREBASE_IMAGE_OVERRIDES["accommodation.private-villas"] ||
        EDITORIAL_IMAGES.regionCoast,
      alt: "The Kamau & Wanjiku Family — Verified KayArabuko Family Package Guests",
      slotKey: "review.photo.rev-2",
    },
  },
  {
    id: "rev-3",
    guestName: "David & Sarah Jenkins",
    guestOrigin: "London, United Kingdom",
    platform: "TripAdvisor",
    rating: 5,
    dateLabel: "Verified Safari Guests",
    tripTitle: "3 Days / 2 Nights Tsavo East & Salt Lick Sanctuary Safari from Watamu",
    stayOrPackageTag: "3 Days / 2 Nights Safari Package",
    photoCaption:
      "David & Sarah on their 3 Days / 2 Nights Tsavo East & Taita Hills Salt Lick wildlife safari.",
    reviewText:
      "From the moment we messaged +254 728 560303 on WhatsApp, Mrisa took care of every detail. Picked up punctually from our Watamu beach hotel, we spent 3 incredible days exploring Tsavo East and staying at Salt Lick where elephants drank right beneath our lodge at night. Everything promised in the 'What's Included' checklist — window seats, park fees, full-board meals and a brilliant guide — was delivered flawlessly.",
    image: {
      src:
        SAVED_FIREBASE_IMAGE_OVERRIDES["review.photo.rev-3"] ||
        SAVED_FIREBASE_IMAGE_OVERRIDES["ecosystem.community-conservancies"] ||
        EDITORIAL_IMAGES.regionNorthern,
      alt: "David & Sarah Jenkins — Verified KayArabuko Safari Guests",
      slotKey: "review.photo.rev-3",
    },
  },
  {
    id: "rev-4",
    guestName: "Dr. Lukas & Hannah Weber",
    guestOrigin: "Munich, Germany",
    platform: "Google",
    rating: 5,
    dateLabel: "Verified Birding & Conservation Guests",
    tripTitle: "Arabuko-Sokoke Forest Birding, Mida Creek Boardwalk & Mangrove Canoe Ride",
    stayOrPackageTag: "Full-Day Forest & Mida Creek Excursions",
    photoCaption:
      "Dr. Lukas & Hannah Weber exploring Arabuko-Sokoke Forest and the Mida Creek suspended boardwalk.",
    reviewText:
      "As avid birdwatchers, visiting Arabuko-Sokoke Forest and Mida Creek with Kaya Experience Ltd was a dream come true. Our local ornithologist guide helped us spot the Golden-rumped Elephant Shrew, Sokoke Scops Owl, Crab Plovers and Greater Flamingos, followed by a peaceful sunset canoe ride through the Mida mangroves. You can feel how deeply this team cares about community conservation.",
    image: {
      src:
        SAVED_FIREBASE_IMAGE_OVERRIDES["review.photo.rev-4"] ||
        EDITORIAL_IMAGES.arabukoForest,
      alt: "Dr. Lukas & Hannah Weber — Verified Arabuko-Sokoke & Mida Creek Guests",
      slotKey: "review.photo.rev-4",
    },
  },
  {
    id: "rev-5",
    guestName: "Amina & Hassan Omondi",
    guestOrigin: "Mombasa & Diaspora (USA)",
    platform: "TripAdvisor",
    rating: 5,
    dateLabel: "Verified Transfer & Excursion Guests",
    tripTitle: "Moi International Airport (MBA) VIP Transfer, Mambrui Quad Bikes & Safari Blue Glass-Bottom Boat",
    stayOrPackageTag: "Airport Transfer + Safari Blue & Mambrui Dunes",
    photoCaption:
      "Amina & Hassan enjoying the Safari Blue glass-bottom boat dolphin cruise & Mambrui Sand Dunes quad biking.",
    reviewText:
      "Our flight into Moi International Airport in Mombasa was delayed by over an hour, yet the Kaya Experience driver waited patiently with a big smile and drove us safely to our cottage in Watamu. We rode quad bikes across the Mambrui Sand Dunes and joined their Safari Blue glass-bottom boat excursion — viewing colourful reef fish through the glass floor, snorkelling in Watamu Marine Park, seeing wild dolphins, and enjoying freshly grilled seafood on the sandbank. 10/10 service!",
    image: {
      src:
        SAVED_FIREBASE_IMAGE_OVERRIDES["review.photo.rev-5"] ||
        SAVED_FIREBASE_IMAGE_OVERRIDES["excursion.safari-blue-marine-excursion"] ||
        EDITORIAL_IMAGES.heroSwahiliDhow,
      alt: "Amina & Hassan Omondi — Verified Safari Blue Glass-Bottom Boat & Mambrui Guests",
      slotKey: "review.photo.rev-5",
    },
  },
  {
    id: "rev-6",
    guestName: "Grace N. & Agri-Impact Delegation",
    guestOrigin: "Nakuru & Nyanza, Kenya",
    platform: "Google",
    rating: 5,
    dateLabel: "Verified Group & Kaya Roots Partners",
    tripTitle: "Group SGR Transfers, Boutique Resort Stay & Kaya Roots Africa Field Visit",
    stayOrPackageTag: "Group Fleet Transfer + Kaya Roots Africa",
    photoCaption:
      "Grace N. & the Agri-Impact Delegation with Dr. Milcah Wambua and Mrisa during their coastal & Kaya Roots visit.",
    reviewText:
      "Coordinating transport and accommodation for a 16-person team is never easy, but Mrisa and Co-Founder Dr. Milcah Wambua handled our group SGR transfers, Watamu resort booking, and an inspiring field visit to Kaya Roots Africa’s indigenous cassava value-addition farmers with total professionalism. Proudly managed Kenyan excellence at Timboni Stage, Watamu!",
    image: {
      src:
        SAVED_FIREBASE_IMAGE_OVERRIDES["review.photo.rev-6"] ||
        EDITORIAL_IMAGES.pillarEmpower,
      alt: "Grace N. & Agri-Impact Delegation — Verified Group & Kaya Roots Africa Guests",
      slotKey: "review.photo.rev-6",
    },
  },
];

/** SECTION 10: CONTACT & EXPERIENCE ENQUIRIES */
export const contactContent = {
  eyebrow: "CONTACT & ENQUIRIES · WATAMU, TIMBONI STAGE",
  headline: "Your Journey Into Kenya's Stories Starts Here.",
  description:
    "Visit our office at Watamu, Timboni Stage, call or WhatsApp Mrisa and the Kaya Experience Ltd team on +254 728 560303 or +254 712 863538, or send an enquiry below for multi-day safari packages, airport & SGR train transfers, excursions, accommodation, cultural visits or Kaya Roots Africa partnerships.",
  areasOfInterest: [
    "Safari Package: 2 Days / 1 Night Tsavo East Safari Express",
    "Safari Package: 3 Days / 2 Nights Tsavo East & Salt Lick Rendezvous",
    "Safari Package: 4 Days / 3 Nights Mombasa & Watamu Rendezvous (Tsavo & Amboseli)",
    "Safari Package: 4 Days / 3 Nights Watamu Bush, Forest & Safari Blue Explorer",
    "Safari Package: 5 Days / 4 Nights Bush-to-Beach Family & Group Getaway",
    "Safari Package: 7 Days / 6 Nights Grand Kenya Classic (Maasai Mara, Nakuru & Amboseli)",
    "Transfers: SGR Train Station Transfer (Mombasa Miritini / Mariakani ↔ Watamu & Coast)",
    "Transfers: Airport Transfer (Malindi MYD / Mombasa MBA ↔ Watamu, Malindi & Kilifi)",
    "Transfers: Chauffeur-Driven 4x4 Land Cruiser Hire & SGR/Flight Ticketing Concierge",
    "Excursions: Safari Blue Glass-Bottom Boat (Fish Viewing, Snorkelling & Dolphins)",
    "Excursions: Mambrui Golden Sand Dunes Quad Biking & Marafa Hell's Kitchen Canyon",
    "Excursions: Arabuko-Sokoke Forest & Gede Ruins Historical Tour",
    "Excursions: Mida Creek Boat Rides, Boardwalk, Birding & Hikes",
    "Accommodation: Kid-Friendly Stays with Kids' Pools & Caregivers / Nannies On Call",
    "Accommodation: Villas, Cottages, Hotels, Resorts & Private Lodgings",
    "Kaya Roots Africa: Cassava, Indigenous Crops & Farmer Empowerment (Dr. Milcah Wambua)",
    "Cultural & Heritage Visits",
    "Community Encounters",
    "Traditional Craft & Food Experiences",
    "Forest Walks & Biodiversity Discovery",
    "Conservation & Environmental Learning",
    "Community-Led Nature Experiences",
    "Heritage Sites & Historical Exploration",
    "Regional Discovery Tours",
    "General Cultural / Conservation Enquiry",
  ],
  suggestedLocations: [
    "Watamu, Timboni Stage (Office & Coastal Hub)",
    "Arabuko-Sokoke Forest",
    "Gede Ruins & Sacred Forest",
    "Mambrui Sand Dunes (Quad Bikes) & Marafa Hell's Kitchen",
    "Watamu Marine Park (Safari Blue Glass-Bottom Boat & Dolphins)",
    "Mida Creek (Mangrove Boat Rides, Boardwalk, Birding & Hikes)",
    "Kaya Roots Africa (Nyanza, Nakuru & Coast Farmer Network)",
    "The Mijikenda & Sacred Kaya Forests",
    "The Swahili Coast (Malindi, Watamu, Diani, Lamu)",
    "The Maasai (Southern Rift & Savannahs)",
    "The Samburu (Northern Kenya)",
    "The Turkana (Lake Turkana Region)",
    "Shimba Hills & Coastal Forests",
    "The Aberdare Ranges",
    "Northern Kenya Conservancies",
    "The Rift Valley",
    "Open to Recommendations Across Kenya",
  ],
};

/** Legacy export preserved for internal module compatibility */
export const experiences: Experience[] = visitExperiences.map((v) => ({
  slug: v.slug,
  title: v.title,
  persona: `${v.pillar} Pillar`,
  blurb: v.description,
  styles: ["cultural", "conservation"],
  themes: ["culture", "conservation"],
  image: v.image,
}));
