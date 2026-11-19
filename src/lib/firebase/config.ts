export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyCkOzGWR8fV5XX-SGwz6h0upovw3LM9d1c",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "legaprimed.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "legaprimed",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "legaprimed.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "488460542273",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:488460542273:web:564386ce4f64b99be701c0",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-NVN0PP8Q1P",
};

export const DEFAULT_ORG_ID = process.env.NEXT_PUBLIC_ORGANIZATION_ID || "kayarabuko-safaris";
