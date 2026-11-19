import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import fs from "node:fs";
import path from "node:path";

function loadEnvConfig() {
  const envPath = path.resolve(process.cwd(), ".env.local");
  const config = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  };

  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, "utf-8").split("\n");
    for (const line of lines) {
      const match = line.match(/^([^=]+)=(.*)$/);
      if (match) {
        const key = match[1].trim();
        const value = match[2].trim().replace(/^["']|["']$/g, "");
        if (key === "NEXT_PUBLIC_FIREBASE_API_KEY") config.apiKey = value;
        if (key === "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN") config.authDomain = value;
        if (key === "NEXT_PUBLIC_FIREBASE_PROJECT_ID") config.projectId = value;
        if (key === "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET") config.storageBucket = value;
        if (key === "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID") config.messagingSenderId = value;
        if (key === "NEXT_PUBLIC_FIREBASE_APP_ID") config.appId = value;
      }
    }
  }
  return config;
}

const firebaseConfig = loadEnvConfig();
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const ORG_ID = process.env.NEXT_PUBLIC_ORGANIZATION_ID || "kayarabuko-safaris";
const BUCKET = firebaseConfig.storageBucket || "legaprimed.firebasestorage.app";

function getStorageUrl(path) {
  const encoded = encodeURIComponent(path);
  return `https://firebasestorage.googleapis.com/v0/b/${BUCKET}/o/${encoded}?alt=media`;
}

// 27 Destinations
const allDestinations = [
  "maasai-mara", "amboseli", "lake-nakuru", "lake-naivasha", "hells-gate",
  "tsavo-east", "tsavo-west", "samburu", "shaba", "buffalo-springs",
  "ol-pejeta", "mount-kenya", "aberdare", "nairobi-national-park", "meru",
  "mount-longonot", "chyulu-hills", "shimba-hills", "diani", "watamu",
  "malindi", "kakamega-forest", "mount-elgon", "ruma", "lake-turkana",
  "marsabit", "sibiloi"
];

// 10 Safaris
const allSafaris = [
  "3-day-maasai-mara-safari",
  "4-day-amboseli-and-tsavo-safari",
  "5-day-maasai-mara-and-lake-nakuru-safari",
  "7-day-kenya-safari-and-diani-beach",
  "6-day-samburu-and-ol-pejeta-safari",
  "8-day-great-rift-valley-and-mara-safari",
  "10-day-grand-kenya-wildlife-expedition",
  "4-day-mount-kenya-and-aberdare-safari",
  "6-day-coastal-wilderness-and-bush-safari",
  "12-day-epic-northern-and-southern-circuits"
];

// 7 Experiences
const allExperiences = [
  "the-wild", "the-adventurer", "the-photographer",
  "the-romantic", "the-family", "the-cultural-explorer",
  "the-conservationist"
];

// 9 Stories
const allStories = [
  "best-time-to-visit-maasai-mara",
  "what-to-pack-for-a-kenyan-safari",
  "kenya-safari-cost-guide",
  "great-migration-explained",
  "birding-in-the-rift-valley",
  "conservation-in-the-mara-conservancies",
  "swahili-coast-history-and-culture",
  "first-time-safari-tips",
  "photography-tips-for-kenya"
];

async function runCompleteSeed() {
  console.log("Seeding all 27 destinations to Firestore...");
  for (const slug of allDestinations) {
    const dRef = doc(db, "organizations", ORG_ID, "destinations", slug);
    await setDoc(dRef, {
      slug,
      image: {
        src: getStorageUrl(`destinations/${slug}.jpg`),
        storagePath: `destinations/${slug}.jpg`,
        alt: `${slug.replace(/-/g, " ")} Kenya destination photography`
      },
      updatedAt: new Date().toISOString()
    }, { merge: true });
  }
  console.log("✓ All 27 destinations seeded with bucket image URLs.");

  console.log("Seeding all 10 safaris to Firestore...");
  for (const slug of allSafaris) {
    const sRef = doc(db, "organizations", ORG_ID, "safaris", slug);
    await setDoc(sRef, {
      slug,
      image: {
        src: getStorageUrl(`safaris/${slug}.jpg`),
        storagePath: `safaris/${slug}.jpg`,
        alt: `${slug.replace(/-/g, " ")} Kenya safari tour package`
      },
      updatedAt: new Date().toISOString()
    }, { merge: true });
  }
  console.log("✓ All 10 safari packages seeded with bucket image URLs.");

  console.log("Seeding all 7 experiences to Firestore...");
  for (const slug of allExperiences) {
    const eRef = doc(db, "organizations", ORG_ID, "experiences", slug);
    await setDoc(eRef, {
      slug,
      image: {
        src: getStorageUrl(`experiences/${slug}.jpg`),
        storagePath: `experiences/${slug}.jpg`,
        alt: `${slug.replace(/-/g, " ")} experience story`
      },
      updatedAt: new Date().toISOString()
    }, { merge: true });
  }
  console.log("✓ All 7 experiences seeded.");

  console.log("Seeding all 9 stories to Firestore...");
  for (const slug of allStories) {
    const stRef = doc(db, "organizations", ORG_ID, "stories", slug);
    await setDoc(stRef, {
      slug,
      image: {
        src: getStorageUrl(`stories/${slug}.jpg`),
        storagePath: `stories/${slug}.jpg`,
        alt: `${slug.replace(/-/g, " ")} safari journal article`
      },
      updatedAt: new Date().toISOString()
    }, { merge: true });
  }
  console.log("✓ All 9 stories seeded.");

  console.log("\n>>> FIRESTORE IS FULLY SYNCHRONIZED WITH STORAGE BUCKET ASSETS <<<");
  process.exit(0);
}

runCompleteSeed().catch((err) => {
  console.error("Complete seed failed:", err);
  process.exit(1);
});
