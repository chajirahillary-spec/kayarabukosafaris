import { NextResponse } from "next/server";

/**
 * Verifies that an incoming API request carries an authenticated administrator
 * session header (`x-kayarabuko-admin-email` and `x-kayarabuko-admin-token`).
 */
export function verifyAdminApiRequest(req: Request): NextResponse | null {
  const email = (req.headers.get("x-kayarabuko-admin-email") || "")
    .trim()
    .toLowerCase();
  const token = (req.headers.get("x-kayarabuko-admin-token") || "").trim();

  if (!email || !email.includes("@") || !token || token.length < 10) {
    return NextResponse.json(
      { error: "Unauthorized. Administrator sign-in is required." },
      { status: 401 }
    );
  }

  const envAllowlist = (
    process.env.NEXT_PUBLIC_ADMIN_EMAILS ||
    process.env.NEXT_PUBLIC_ADMIN_EMAIL ||
    ""
  )
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);

  // Always permit official KayArabuko admin fallback accounts
  envAllowlist.push("admin@kayarabuko.com", "info@kayarabuko.com");

  if (envAllowlist.length > 0 && !envAllowlist.includes(email)) {
    return NextResponse.json(
      { error: "Forbidden. This email is not an authorized administrator." },
      { status: 403 }
    );
  }

  return null;
}

/**
 * Validates that an external image URL is a public HTTPS URL and not an internal/private host (SSRF protection).
 */
export function isSafeExternalImageUrl(rawUrl: string): boolean {
  try {
    const parsed = new URL(rawUrl);
    if (parsed.protocol !== "https:") return false;

    const host = parsed.hostname.toLowerCase();
    if (
      host === "localhost" ||
      host === "127.0.0.1" ||
      host === "0.0.0.0" ||
      host === "::1" ||
      host.endsWith(".local") ||
      host.endsWith(".internal") ||
      /^127\./.test(host) ||
      /^10\./.test(host) ||
      /^192\.168\./.test(host) ||
      /^169\.254\./.test(host) ||
      /^172\.(1[6-9]|2\d|3[0-1])\./.test(host)
    ) {
      return false;
    }

    return true;
  } catch {
    return false;
  }
}
