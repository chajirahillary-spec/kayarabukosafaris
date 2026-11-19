"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { BrandLogo } from "@/components/layout/BrandLogo";
import { AdminAuthService } from "@/lib/firebase/adminAuth";
import {
  Lock,
  Mail,
  ArrowRight,
  Loader2,
  AlertCircle,
  CheckCircle2,
  ShieldCheck,
} from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = AdminAuthService.subscribe((session) => {
      if (session?.email) {
        router.replace("/admin/leads");
      }
    });
    return () => unsubscribe();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setNotice(null);
    setLoading(true);

    try {
      await AdminAuthService.signInWithEmail(email, password);
      router.replace("/admin/leads");
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : "Unable to sign in. Please verify your admin email and password.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async () => {
    setError(null);
    setNotice(null);
    if (!email.trim() || !email.includes("@")) {
      setError("Enter your administrator email address above to receive a reset link.");
      return;
    }
    setResetLoading(true);
    try {
      await AdminAuthService.sendPasswordReset(email);
      setNotice(`Password reset instructions sent to ${email.trim()}.`);
    } catch {
      setNotice(
        `If ${email.trim()} is registered in Firebase Authentication, a reset email has been dispatched.`
      );
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-forest text-ivory flex flex-col justify-between relative overflow-hidden">
      {/* Subtle architectural background glow */}
      <div
        className="pointer-events-none absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 20%, rgba(200, 155, 60, 0.35), transparent 45%), radial-gradient(circle at 80% 80%, rgba(11, 75, 46, 0.65), transparent 55%)",
        }}
        aria-hidden="true"
      />

      {/* Top Bar */}
      <header className="relative z-10 border-b border-cream/15 px-6 py-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <BrandLogo inverse />
          <Link
            href="/"
            className="rounded-ka border border-gold/40 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-gold-light hover:bg-green/50 transition-colors"
          >
            ← Back to Public Website
          </Link>
        </div>
      </header>

      {/* Center Login Card */}
      <div className="relative z-10 mx-auto flex w-full max-w-md flex-col justify-center px-4 py-12">
        <div className="rounded-ka border border-gold/30 bg-ivory p-7 sm:p-9 text-charcoal shadow-2xl animate-modal-enter">
          <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-gold">
            <ShieldCheck className="h-4 w-4 text-green" />
            <span>Administrator Access Only</span>
          </div>

          <h1 className="font-display mt-2 text-3xl sm:text-4xl text-green">
            Admin Sign In
          </h1>
          <p className="mt-1.5 text-xs leading-relaxed text-charcoal/75">
            Sign in with your authorized KayArabuko administrator email to manage
            visitor contacts, cultural &amp; conservation enquiries, and platform
            settings.
          </p>

          {error && (
            <div
              role="alert"
              className="mt-4 flex items-start gap-2.5 rounded-ka border border-rose-300 bg-rose-50 p-3 text-xs font-medium text-rose-900"
            >
              <AlertCircle className="h-4 w-4 shrink-0 text-rose-600 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {notice && (
            <div
              role="status"
              className="mt-4 flex items-start gap-2.5 rounded-ka border border-green/30 bg-green/10 p-3 text-xs font-medium text-forest"
            >
              <CheckCircle2 className="h-4 w-4 shrink-0 text-green mt-0.5" />
              <span>{notice}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label
                htmlFor="admin-email"
                className="block text-[11px] font-semibold uppercase tracking-[0.14em] text-charcoal/80"
              >
                Admin Email Address
              </label>
              <div className="relative mt-1.5">
                <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-charcoal/45" />
                <input
                  id="admin-email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="admin@kayarabuko.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-ka border border-charcoal/25 bg-ivory pl-10 pr-3.5 py-2.5 text-sm text-charcoal focus:border-green focus:outline-none"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="admin-password"
                  className="block text-[11px] font-semibold uppercase tracking-[0.14em] text-charcoal/80"
                >
                  Password
                </label>
                <button
                  type="button"
                  onClick={handlePasswordReset}
                  disabled={resetLoading}
                  className="cursor-pointer text-[11px] font-semibold text-green hover:text-forest hover:underline disabled:opacity-50"
                >
                  {resetLoading ? "Sending..." : "Reset password"}
                </button>
              </div>
              <div className="relative mt-1.5">
                <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-charcoal/45" />
                <input
                  id="admin-password"
                  type="password"
                  required
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-ka border border-charcoal/25 bg-ivory pl-10 pr-3.5 py-2.5 text-sm text-charcoal focus:border-green focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="cursor-pointer mt-2 flex w-full items-center justify-center gap-2 rounded-ka bg-green px-5 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-ivory hover:bg-forest hover:text-gold-light transition-all shadow-sm disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Verifying Admin Credentials...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Admin Portal</span>
                  <ArrowRight className="h-4 w-4 text-gold-light" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 border-t border-charcoal/10 pt-4 text-center">
            <p className="text-[11px] text-charcoal/60">
              Protected by KayArabuko Email Authentication · Explore. Conserve.
              Empower.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Strip */}
      <footer className="relative z-10 border-t border-cream/10 px-6 py-4 text-center text-xs text-cream/60">
        © {new Date().getFullYear()} KayArabuko · Authorised Administrator Portal
      </footer>
    </div>
  );
}
