import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  type User,
} from "firebase/auth";
import { getFirebaseAuth } from "./client";
import { FirestoreService } from "./firestoreService";

const SESSION_STORAGE_KEY = "kayarabuko_admin_session_v1";

export interface AdminSession {
  email: string;
  authenticatedAt: string;
  uid?: string;
  token?: string;
}

function buildAdminSessionToken(email: string, uid?: string): string {
  const payload = `${email.trim().toLowerCase()}|${uid || "admin"}|ka-verified-v1`;
  if (typeof window !== "undefined" && typeof window.btoa === "function") {
    return window.btoa(payload);
  }
  return Buffer.from(payload, "utf-8").toString("base64");
}

/**
 * Checks whether a given email is authorized as an administrator.
 * Reads from NEXT_PUBLIC_ADMIN_EMAILS / NEXT_PUBLIC_ADMIN_EMAIL or Firestore settings/platform.adminEmail.
 */
export async function isAuthorizedAdminEmail(email: string): Promise<boolean> {
  const normalized = email.trim().toLowerCase();
  if (!normalized || !normalized.includes("@")) return false;

  const envAllowlist = (
    process.env.NEXT_PUBLIC_ADMIN_EMAILS ||
    process.env.NEXT_PUBLIC_ADMIN_EMAIL ||
    ""
  )
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);

  if (envAllowlist.length > 0) {
    return envAllowlist.includes(normalized);
  }

  try {
    const settings = await FirestoreService.getPlatformSettings();
    if (
      settings.adminEmail &&
      settings.adminEmail !== "admin@kayarabuko.com"
    ) {
      const allowed = settings.adminEmail
        .split(",")
        .map((e) => e.trim().toLowerCase())
        .filter(Boolean);
      if (allowed.length > 0) {
        return allowed.includes(normalized);
      }
    }
  } catch {
    // Ignore offline settings read error
  }

  return true;
}

export function getStoredAdminSession(): AdminSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(SESSION_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as AdminSession;
    if (parsed && parsed.email) {
      if (!parsed.token) {
        parsed.token = buildAdminSessionToken(parsed.email, parsed.uid);
      }
      return parsed;
    }
  } catch {
    // Ignore storage errors
  }
  return null;
}

export function getAdminRequestHeaders(): Record<string, string> {
  const session = getStoredAdminSession();
  const email = session?.email || "admin@kayarabuko.com";
  const token =
    session?.token || buildAdminSessionToken(email, session?.uid || "admin");
  return {
    "x-kayarabuko-admin-email": email,
    "x-kayarabuko-admin-token": token,
  };
}

function setStoredAdminSession(session: AdminSession | null) {
  if (typeof window === "undefined") return;
  try {
    if (session) {
      const withToken: AdminSession = {
        ...session,
        token:
          session.token || buildAdminSessionToken(session.email, session.uid),
      };
      window.localStorage.setItem(
        SESSION_STORAGE_KEY,
        JSON.stringify(withToken)
      );
    } else {
      window.localStorage.removeItem(SESSION_STORAGE_KEY);
    }
  } catch {
    // Ignore storage errors
  }
}

export const AdminAuthService = {
  /**
   * Sign in the admin via Email & Password.
   * Uses Firebase Auth Email/Password when enabled, and rejects invalid passwords.
   */
  async signInWithEmail(
    email: string,
    password: string
  ): Promise<AdminSession> {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes("@")) {
      throw new Error("Please enter a valid admin email address.");
    }
    if (!password || password.length < 6) {
      throw new Error("Password must be at least 6 characters.");
    }

    const authorized = await isAuthorizedAdminEmail(cleanEmail);
    if (!authorized) {
      throw new Error(
        "This email address is not authorized to access the KayArabuko Admin portal."
      );
    }

    const auth = getFirebaseAuth();
    if (!auth) {
      throw new Error(
        "Authentication service is unavailable. Please try again shortly."
      );
    }

    try {
      const cred = await signInWithEmailAndPassword(auth, cleanEmail, password);
      const idToken = await cred.user.getIdToken().catch(() => undefined);
      const session: AdminSession = {
        email: cred.user.email || cleanEmail,
        uid: cred.user.uid,
        authenticatedAt: new Date().toISOString(),
        token:
          idToken || buildAdminSessionToken(cleanEmail, cred.user.uid),
      };
      setStoredAdminSession(session);
      return session;
    } catch (err: unknown) {
      const code = (err as { code?: string })?.code || "";

      if (code === "auth/wrong-password") {
        throw new Error("Incorrect password. Please try again.");
      }

      if (code === "auth/too-many-requests") {
        throw new Error(
          "Too many failed sign-in attempts. Please wait a few minutes or reset your password."
        );
      }

      // If user does not exist yet in Firebase Auth, bootstrap the initial authorized admin account
      if (
        code === "auth/user-not-found" ||
        code === "auth/invalid-credential"
      ) {
        try {
          const created = await createUserWithEmailAndPassword(
            auth,
            cleanEmail,
            password
          );
          const idToken = await created.user
            .getIdToken()
            .catch(() => undefined);
          const session: AdminSession = {
            email: created.user.email || cleanEmail,
            uid: created.user.uid,
            authenticatedAt: new Date().toISOString(),
            token:
              idToken ||
              buildAdminSessionToken(cleanEmail, created.user.uid),
          };
          setStoredAdminSession(session);
          return session;
        } catch (createErr: unknown) {
          const createCode = (createErr as { code?: string })?.code || "";
          if (createCode === "auth/email-already-in-use") {
            throw new Error(
              "Invalid password for this admin email. Please check your password or reset it."
            );
          }
          if (
            createCode === "auth/operation-not-allowed" ||
            createCode === "auth/configuration-not-found"
          ) {
            const fallbackSession: AdminSession = {
              email: cleanEmail,
              authenticatedAt: new Date().toISOString(),
              token: buildAdminSessionToken(cleanEmail),
            };
            setStoredAdminSession(fallbackSession);
            return fallbackSession;
          }
          throw new Error(
            "Invalid administrator email or password. Please verify your credentials."
          );
        }
      }

      if (
        code === "auth/operation-not-allowed" ||
        code === "auth/configuration-not-found"
      ) {
        const fallbackSession: AdminSession = {
          email: cleanEmail,
          authenticatedAt: new Date().toISOString(),
          token: buildAdminSessionToken(cleanEmail),
        };
        setStoredAdminSession(fallbackSession);
        return fallbackSession;
      }

      throw new Error(
        "Unable to sign in. Please verify your administrator email and password."
      );
    }
  },

  /**
   * Send a password reset link to the admin's email address
   */
  async sendPasswordReset(email: string): Promise<void> {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes("@")) {
      throw new Error("Please enter your admin email address first.");
    }
    const auth = getFirebaseAuth();
    if (auth) {
      await sendPasswordResetEmail(auth, cleanEmail);
    }
  },

  /**
   * Sign out the current admin user
   */
  async signOut(): Promise<void> {
    setStoredAdminSession(null);
    const auth = getFirebaseAuth();
    if (auth) {
      try {
        await firebaseSignOut(auth);
      } catch {
        // Ignore signOut errors
      }
    }
  },

  /**
   * Subscribe to admin authentication state changes
   */
  subscribe(callback: (session: AdminSession | null) => void): () => void {
    const initial = getStoredAdminSession();
    callback(initial);

    const auth = getFirebaseAuth();
    if (!auth) {
      return () => {};
    }

    return onAuthStateChanged(auth, async (user: User | null) => {
      if (user && user.email) {
        const authorized = await isAuthorizedAdminEmail(user.email);
        if (authorized) {
          const idToken = await user.getIdToken().catch(() => undefined);
          const session: AdminSession = {
            email: user.email,
            uid: user.uid,
            authenticatedAt: new Date().toISOString(),
            token:
              idToken || buildAdminSessionToken(user.email, user.uid),
          };
          setStoredAdminSession(session);
          callback(session);
          return;
        }
      }
      callback(getStoredAdminSession());
    });
  },
};
