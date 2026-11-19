"use client";

import { useEffect, useState } from "react";
import {
  Save,
  Check,
  Image as ImageIcon,
  RefreshCw,
  Loader2,
  AlertCircle,
  MessageCircle,
  FileText,
  Globe,
} from "lucide-react";
import {
  FirestoreService,
  DEFAULT_PLATFORM_SETTINGS,
  type PlatformSettings,
} from "@/lib/firebase/firestoreService";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<PlatformSettings>(
    DEFAULT_PLATFORM_SETTINGS
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [savedNotice, setSavedNotice] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSeeding, setIsSeeding] = useState(false);
  const [seedNotice, setSeedNotice] = useState<string | null>(null);

  useEffect(() => {
    async function loadSettings() {
      try {
        setIsLoading(true);
        const data = await FirestoreService.getPlatformSettings();
        setSettings(data);
      } catch (err) {
        console.warn("Could not load Firestore settings:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadSettings();
  }, []);

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSaving(true);
    setSavedNotice(null);
    setErrorMessage(null);

    try {
      await FirestoreService.savePlatformSettings(settings);
      setSavedNotice("Settings saved and synced to Firestore successfully!");
      setTimeout(() => setSavedNotice(null), 4000);
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Failed to save settings to Firestore.";
      setErrorMessage(msg);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSeedAllData = async () => {
    setIsSeeding(true);
    setSeedNotice(null);
    try {
      const res = await FirestoreService.seedAllToFirestore();
      setSeedNotice(
        `Synced ${res.communitiesCount ?? 5} communities, ${res.regionsCount ?? 4} regions, ${res.experiencesCount} experience categories, and ${res.storiesCount} editorial stories to Firestore.`
      );
      setTimeout(() => setSeedNotice(null), 6000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Seeding failed.";
      setErrorMessage(msg);
    } finally {
      setIsSeeding(false);
    }
  };

  const updateSocialHref = (index: number, href: string) => {
    const updated = [...(settings.socialLinks || [])];
    if (updated[index]) {
      updated[index] = { ...updated[index], href };
      setSettings({ ...settings, socialLinks: updated });
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center gap-3 text-sm text-charcoal/70">
        <Loader2 className="h-5 w-5 animate-spin text-green" />
        <span>Loading KayArabuko CMS settings...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl pb-16">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold text-forest">
            Website Content, Brand &amp; WhatsApp Settings
          </h1>
          <p className="text-xs text-charcoal/70">
            Manage hero &amp; section headings, configurable WhatsApp contact number, brand logo, contact details and social links.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleSeedAllData}
            disabled={isSeeding}
            className="cursor-pointer inline-flex items-center gap-1.5 rounded-ka border border-gold/60 bg-gold/10 px-3.5 py-2 text-xs font-semibold text-charcoal hover:bg-gold/20 transition-colors disabled:opacity-50"
          >
            {isSeeding ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin text-forest" />
            ) : (
              <RefreshCw className="h-3.5 w-3.5 text-forest" />
            )}
            <span>Sync Content to Firestore</span>
          </button>
        </div>
      </div>

      {savedNotice && (
        <div className="flex items-center gap-2 rounded-ka bg-green/15 border border-green/30 p-3 text-xs font-semibold text-forest">
          <Check className="h-4 w-4 shrink-0 text-green" />
          <span>{savedNotice}</span>
        </div>
      )}

      {seedNotice && (
        <div className="flex items-center gap-2 rounded-ka bg-gold/15 border border-gold/40 p-3 text-xs font-semibold text-charcoal">
          <Check className="h-4 w-4 shrink-0 text-gold" />
          <span>{seedNotice}</span>
        </div>
      )}

      {errorMessage && (
        <div className="flex items-center gap-2 rounded-ka bg-rose-50 border border-rose-300 p-3 text-xs font-semibold text-rose-800">
          <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6 text-xs">
        {/* Brand Identity & Logo */}
        <div className="rounded-ka border border-charcoal/10 bg-ivory p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-charcoal/10 pb-3">
            <ImageIcon className="h-4 w-4 text-forest" />
            <h2 className="font-serif text-base font-bold text-forest">
              Brand Identity &amp; Logo
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-charcoal">
                Organisation Name
              </label>
              <input
                type="text"
                value={settings.companyName}
                onChange={(e) =>
                  setSettings({ ...settings, companyName: e.target.value })
                }
                className="mt-1 w-full rounded-ka border border-charcoal/20 bg-cream/20 p-2.5 focus:border-forest focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-semibold text-charcoal">
                Central Brand Philosophy (Eyebrow)
              </label>
              <input
                type="text"
                value={settings.tagline}
                onChange={(e) =>
                  setSettings({ ...settings, tagline: e.target.value })
                }
                className="mt-1 w-full rounded-ka border border-charcoal/20 bg-cream/20 p-2.5 focus:border-forest focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-charcoal">
              Footer Closing Statement
            </label>
            <input
              type="text"
              value={settings.closingStatement}
              onChange={(e) =>
                setSettings({ ...settings, closingStatement: e.target.value })
              }
              className="mt-1 w-full rounded-ka border border-charcoal/20 bg-cream/20 p-2.5 focus:border-forest focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-charcoal">
              Firebase Storage Logo URL
            </label>
            <input
              type="text"
              value={settings.logoStorageUrl}
              onChange={(e) =>
                setSettings({ ...settings, logoStorageUrl: e.target.value })
              }
              className="mt-1 w-full rounded-ka border border-charcoal/20 bg-cream/20 p-2.5 font-mono text-[11px] focus:border-forest focus:outline-none"
            />
          </div>
        </div>

        {/* Hero & Section Headings */}
        <div className="rounded-ka border border-charcoal/10 bg-ivory p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-charcoal/10 pb-3">
            <FileText className="h-4 w-4 text-forest" />
            <h2 className="font-serif text-base font-bold text-forest">
              Hero &amp; Section Headlines
            </h2>
          </div>

          <div>
            <label className="block font-semibold text-charcoal">
              Section 01: Hero Main Headline
            </label>
            <input
              type="text"
              value={settings.heroHeadline}
              onChange={(e) =>
                setSettings({ ...settings, heroHeadline: e.target.value })
              }
              className="mt-1 w-full rounded-ka border border-charcoal/20 bg-cream/20 p-2.5 focus:border-forest focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-charcoal">
              Section 01: Hero Supporting Description (15–40 words recommended)
            </label>
            <textarea
              rows={2}
              value={settings.heroDescription}
              onChange={(e) =>
                setSettings({ ...settings, heroDescription: e.target.value })
              }
              className="mt-1 w-full rounded-ka border border-charcoal/20 bg-cream/20 p-2.5 focus:border-forest focus:outline-none"
            />
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-semibold text-charcoal">
                Section 02: Intro Headline
              </label>
              <input
                type="text"
                value={settings.introHeadline}
                onChange={(e) =>
                  setSettings({ ...settings, introHeadline: e.target.value })
                }
                className="mt-1 w-full rounded-ka border border-charcoal/20 bg-cream/20 p-2.5 focus:border-forest focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-semibold text-charcoal">
                Section 09: About Headline
              </label>
              <input
                type="text"
                value={settings.aboutHeadline}
                onChange={(e) =>
                  setSettings({ ...settings, aboutHeadline: e.target.value })
                }
                className="mt-1 w-full rounded-ka border border-charcoal/20 bg-cream/20 p-2.5 focus:border-forest focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-semibold text-charcoal">
                Section 10: Contact Headline
              </label>
              <input
                type="text"
                value={settings.contactHeadline}
                onChange={(e) =>
                  setSettings({ ...settings, contactHeadline: e.target.value })
                }
                className="mt-1 w-full rounded-ka border border-charcoal/20 bg-cream/20 p-2.5 focus:border-forest focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* WhatsApp & Contact Channels */}
        <div className="rounded-ka border border-charcoal/10 bg-ivory p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-charcoal/10 pb-3">
            <MessageCircle className="h-4 w-4 text-forest" />
            <h2 className="font-serif text-base font-bold text-forest">
              Configurable WhatsApp &amp; Contact Information
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-charcoal">
                WhatsApp Contact Number (with Country Code, e.g. 2547...)
              </label>
              <input
                type="text"
                value={settings.whatsappNumber}
                onChange={(e) =>
                  setSettings({ ...settings, whatsappNumber: e.target.value })
                }
                className="mt-1 w-full rounded-ka border border-charcoal/20 bg-cream/20 p-2.5 font-mono focus:border-forest focus:outline-none"
              />
              <p className="mt-1 text-[11px] text-charcoal/60">
                Used by all &ldquo;CHAT WITH US ON WHATSAPP&rdquo; buttons across the website.
              </p>
            </div>
            <div>
              <label className="block font-semibold text-charcoal">
                Display Telephone Number
              </label>
              <input
                type="text"
                value={settings.primaryPhone}
                onChange={(e) =>
                  setSettings({ ...settings, primaryPhone: e.target.value })
                }
                className="mt-1 w-full rounded-ka border border-charcoal/20 bg-cream/20 p-2.5 focus:border-forest focus:outline-none"
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-charcoal">
                Enquiries Email Address
              </label>
              <input
                type="email"
                value={settings.email}
                onChange={(e) =>
                  setSettings({ ...settings, email: e.target.value })
                }
                className="mt-1 w-full rounded-ka border border-charcoal/20 bg-cream/20 p-2.5 focus:border-forest focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-semibold text-charcoal">
                Location / Address Display
              </label>
              <input
                type="text"
                value={settings.officeAddress}
                onChange={(e) =>
                  setSettings({ ...settings, officeAddress: e.target.value })
                }
                className="mt-1 w-full rounded-ka border border-charcoal/20 bg-cream/20 p-2.5 focus:border-forest focus:outline-none"
              />
            </div>
          </div>

          <div className="pt-2 border-t border-charcoal/10">
            <label className="block font-semibold text-charcoal">
              Authorized Administrator Login Email(s)
            </label>
            <input
              type="text"
              value={settings.adminEmail || ""}
              onChange={(e) =>
                setSettings({ ...settings, adminEmail: e.target.value })
              }
              placeholder="admin@kayarabuko.com (comma-separated if multiple)"
              className="mt-1 w-full rounded-ka border border-charcoal/20 bg-cream/20 p-2.5 font-mono focus:border-forest focus:outline-none"
            />
            <p className="mt-1 text-[11px] text-charcoal/60">
              Controls which email address(es) are authorized to sign in at{" "}
              <code className="font-mono text-forest">/admin/login</code>.
            </p>
          </div>
        </div>

        {/* Social Media Links */}
        <div className="rounded-ka border border-charcoal/10 bg-ivory p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-charcoal/10 pb-3">
            <Globe className="h-4 w-4 text-forest" />
            <h2 className="font-serif text-base font-bold text-forest">
              Social Media Links
            </h2>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            {(settings.socialLinks || []).map((social, idx) => (
              <div key={social.label}>
                <label className="block font-semibold text-charcoal">
                  {social.label} URL
                </label>
                <input
                  type="url"
                  value={social.href}
                  onChange={(e) => updateSocialHref(idx, e.target.value)}
                  className="mt-1 w-full rounded-ka border border-charcoal/20 bg-cream/20 p-2.5 focus:border-forest focus:outline-none"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Save CTA */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-charcoal/15">
          <button
            type="submit"
            disabled={isSaving}
            onClick={handleSave}
            className="cursor-pointer inline-flex items-center gap-2 rounded-ka bg-forest px-8 py-3 text-xs font-semibold uppercase tracking-wider text-ivory hover:bg-green shadow-md transition-all disabled:opacity-60"
          >
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Saving to Firestore...</span>
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                <span>Save All Settings</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
