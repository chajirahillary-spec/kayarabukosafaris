"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Wordmark } from "@/components/layout/Navbar";
import { AdminAuthService, type AdminSession } from "@/lib/firebase/adminAuth";
import {
  Inbox,
  LayoutDashboard,
  Settings,
  BookOpen,
  Image as ImageIcon,
  LogOut,
  Loader2,
  ShieldCheck,
} from "lucide-react";

const adminNav = [
  { label: "Contacts & Inquiries", href: "/admin/leads", icon: Inbox },
  { label: "Website Images (Quick Edit)", href: "/admin/gallery", icon: ImageIcon },
  { label: "Portal Overview", href: "/admin", icon: LayoutDashboard },
  { label: "Contact & WhatsApp Settings", href: "/admin/settings", icon: Settings },
  { label: "Stories & Journal CMS", href: "/admin/stories", icon: BookOpen },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [session, setSession] = useState<AdminSession | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    const unsubscribe = AdminAuthService.subscribe((currentSession) => {
      setSession(currentSession);
      setCheckingAuth(false);
      if (!currentSession && !isLoginPage) {
        router.replace("/admin/login");
      }
    });
    return () => unsubscribe();
  }, [isLoginPage, router]);

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (checkingAuth || !session) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-forest text-ivory gap-3">
        <Loader2 className="h-6 w-6 animate-spin text-gold-light" />
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-light">
          Verifying Administrator Session...
        </p>
      </div>
    );
  }

  const handleSignOut = async () => {
    await AdminAuthService.signOut();
    router.replace("/admin/login");
  };

  return (
    <div className="min-h-screen bg-ivory text-charcoal">
      {/* Top Admin Header */}
      <div className="border-b border-charcoal/15 bg-forest px-4 sm:px-6 py-3.5 text-ivory">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3 sm:gap-4">
            <Wordmark inverse />
            <span className="hidden sm:inline-flex items-center gap-1.5 rounded-ka bg-gold/20 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-gold-light">
              <ShieldCheck className="h-3.5 w-3.5 text-gold-light" />
              <span>Admin Contacts &amp; Inquiries Portal</span>
            </span>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-4 text-xs">
            <span
              className="hidden md:inline-flex items-center gap-1.5 rounded-ka border border-cream/20 bg-green/35 px-3 py-1 text-[11px] text-cream/90"
              title="Authenticated Administrator Email"
            >
              <span className="h-2 w-2 rounded-full bg-gold-light" />
              <span className="font-mono">{session.email}</span>
            </span>
            <Link
              href="/"
              className="rounded-ka border border-gold/40 px-3 py-1.5 text-[11px] font-semibold text-gold-light hover:bg-green/50 transition-colors"
            >
              View Live Website ↗
            </Link>
            <button
              type="button"
              onClick={handleSignOut}
              className="cursor-pointer inline-flex items-center gap-1.5 rounded-ka bg-rose-900/60 border border-rose-400/30 px-3 py-1.5 text-[11px] font-semibold text-ivory hover:bg-rose-800 transition-colors"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Sidebar + Content */}
      <div className="grid lg:grid-cols-[250px_1fr] min-h-[calc(100vh-61px)]">
        <aside className="border-b lg:border-b-0 lg:border-r border-charcoal/15 bg-cream/30 p-4">
          <p className="px-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-gold mb-3">
            Administration
          </p>
          <nav className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-x-visible text-xs font-semibold">
            {adminNav.map((item) => {
              const Icon = item.icon;
              const active =
                item.href === "/admin"
                  ? pathname === "/admin"
                  : pathname?.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2.5 rounded-ka px-3 py-2.5 whitespace-nowrap transition-colors ${
                    active
                      ? "bg-green text-ivory shadow-xs"
                      : "text-charcoal hover:bg-green/15 hover:text-forest"
                  }`}
                >
                  <Icon
                    className={`h-4 w-4 shrink-0 ${
                      active ? "text-gold-light" : "text-forest"
                    }`}
                  />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="mt-6 hidden lg:block rounded-ka border border-gold/30 bg-ivory p-3.5 text-[11px] space-y-1.5">
            <p className="font-semibold uppercase tracking-wider text-forest">
              Signed In Admin
            </p>
            <p className="font-mono text-charcoal/80 truncate">{session.email}</p>
            <p className="text-charcoal/60 leading-relaxed">
              Manage visitor contacts, cultural &amp; conservation enquiries, and
              WhatsApp routing.
            </p>
          </div>
        </aside>

        <main className="p-5 sm:p-8 lg:p-10 overflow-x-auto">{children}</main>
      </div>
    </div>
  );
}
