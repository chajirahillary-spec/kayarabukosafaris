import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getStorage, type FirebaseStorage } from "firebase/storage";
import { firebaseConfig, DEFAULT_ORG_ID } from "./config";

let app: FirebaseApp;
let auth: Auth | null = null;
let db: Firestore | null = null;
let storage: FirebaseStorage | null = null;

try {
  app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);

  // Initialize analytics only on client
  if (typeof window !== "undefined" && firebaseConfig.measurementId) {
    import("firebase/analytics")
      .then(({ getAnalytics, isSupported }) => {
        isSupported().then((supported) => {
          if (supported) {
            getAnalytics(app);
          }
        });
      })
      .catch(() => {
        // Analytics not supported or blocked (e.g. adblocker)
      });
  }
} catch (e) {
  console.warn("Firebase initialization warning:", e);
}

/**
 * Returns the Firestore instance, initializing it lazily if not already available.
 */
export function getFirebaseDb(): Firestore | null {
  if (!db) {
    try {
      const fbApp = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
      db = getFirestore(fbApp);
    } catch (e) {
      console.warn("Failed to get Firestore instance:", e);
      return null;
    }
  }
  return db;
}

/**
 * Returns the Auth instance, initializing it lazily if not already available.
 */
export function getFirebaseAuth(): Auth | null {
  if (!auth) {
    try {
      const fbApp = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
      auth = getAuth(fbApp);
    } catch (e) {
      console.warn("Failed to get Auth instance:", e);
      return null;
    }
  }
  return auth;
}

/**
 * Returns the FirebaseStorage instance, initializing it lazily if not already available.
 */
export function getFirebaseStorage(): FirebaseStorage | null {
  if (!storage) {
    try {
      const fbApp = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
      storage = getStorage(fbApp);
    } catch (e) {
      console.warn("Failed to get Storage instance:", e);
      return null;
    }
  }
  return storage;
}

export { app, auth, db, storage };

/**
 * Multi-organization document & collection path helpers.
 * Organizations/{orgId}/[collection]
 */
export const orgPaths = {
  root: (orgId: string = DEFAULT_ORG_ID) => `organizations/${orgId}`,
  users: (orgId: string = DEFAULT_ORG_ID) => `organizations/${orgId}/users`,
  safaris: (orgId: string = DEFAULT_ORG_ID) => `organizations/${orgId}/safaris`,
  destinations: (orgId: string = DEFAULT_ORG_ID) => `organizations/${orgId}/destinations`,
  counties: (orgId: string = DEFAULT_ORG_ID) => `organizations/${orgId}/counties`,
  bookings: (orgId: string = DEFAULT_ORG_ID) => `organizations/${orgId}/bookings`,
  customers: (orgId: string = DEFAULT_ORG_ID) => `organizations/${orgId}/customers`,
  vehicles: (orgId: string = DEFAULT_ORG_ID) => `organizations/${orgId}/vehicles`,
  guides: (orgId: string = DEFAULT_ORG_ID) => `organizations/${orgId}/guides`,
  accommodations: (orgId: string = DEFAULT_ORG_ID) => `organizations/${orgId}/accommodations`,
  payments: (orgId: string = DEFAULT_ORG_ID) => `organizations/${orgId}/payments`,
  quotations: (orgId: string = DEFAULT_ORG_ID) => `organizations/${orgId}/quotations`,
  leads: (orgId: string = DEFAULT_ORG_ID) => `organizations/${orgId}/leads`,
  reviews: (orgId: string = DEFAULT_ORG_ID) => `organizations/${orgId}/reviews`,
  stories: (orgId: string = DEFAULT_ORG_ID) => `organizations/${orgId}/stories`,
  gallery: (orgId: string = DEFAULT_ORG_ID) => `organizations/${orgId}/gallery`,
  promotions: (orgId: string = DEFAULT_ORG_ID) => `organizations/${orgId}/promotions`,
  notifications: (orgId: string = DEFAULT_ORG_ID) => `organizations/${orgId}/notifications`,
};
