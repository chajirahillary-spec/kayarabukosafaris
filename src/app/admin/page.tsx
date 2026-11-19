"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  communityProfiles,
  conservationThemes,
  ecosystemHighlights,
  stories,
  visitExperiences,
} from "@/data/content";
import {
  FirestoreService,
  INITIAL_SEED_LEADS,
} from "@/lib/firebase/firestoreService";
import type { Lead } from "@/lib/bookings/types";
import { Inbox, ArrowRight, MessageCircle, Mail } from "lucide-react";

export default function AdminDashboardPage() {
  const [leads, setLeads] = useState<Lead[]>(INITIAL_SEED_LEADS);

  useEffect(() => {
    FirestoreService.getLeads().then((data) => {
      setLeads(data);
    });
  }, []);

  const newLeadsCount = leads.filter((l) => l.status === "new").length;

  const metrics = [
    {
      label: "Contacts & Inquiries",
      val: String(leads.length),
      note: `${newLeadsCount} new awaiting reply`,
      highlight: true,
    },
    {
      label: "Cultural Communities",
      val: String(communityProfiles.length),
      note: "Maasai, Samburu, Turkana, Mijikenda, Swahili",
    },
    {
      label: "Conservation Themes",
      val: String(conservationThemes.length),
      note: `${ecosystemHighlights.length} ecosystem highlights`,
    },
    {
      label: "Experience Categories",
      val: String(visitExperiences.length),
      note: "Enquiry-based (no fixed prices)",
    },
    {
      label: "Editorial Stories",
      val: String(stories.length),
      note: "Culture, People & Conservation",
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">
            EXPLORE. CONSERVE. EMPOWER.
          </p>
          <h1 className="font-display mt-1 text-3xl sm:text-4xl text-green">
            KayArabuko Admin Portal Overview
          </h1>
          <p className="mt-1 text-xs text-charcoal/70">
            Manage visitor contacts, cultural &amp; conservation enquiries,
            WhatsApp routing, stories and website settings.
          </p>
        </div>

        <Link
          href="/admin/leads"
          className="inline-flex items-center gap-2 rounded-ka bg-green px-5 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-ivory hover:bg-forest transition-colors shadow-xs"
        >
          <Inbox className="h-4 w-4 text-gold-light" />
          <span>Manage Contacts &amp; Inquiries</span>
          <ArrowRight className="h-3.5 w-3.5 text-gold-light" />
        </Link>
      </div>

      {/* Metrics grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {metrics.map((m) => (
          <div
            key={m.label}
            className={`border p-5 rounded-ka ${
              m.highlight
                ? "border-gold/50 bg-cream/40"
                : "border-charcoal/15 bg-ivory"
            }`}
          >
            <span className="block text-[11px] font-semibold uppercase tracking-wider text-charcoal/60">
              {m.label}
            </span>
            <span className="font-display mt-2 block text-3xl text-green">
              {m.val}
            </span>
            <span className="mt-1 block text-xs text-gold font-medium">
              {m.note}
            </span>
          </div>
        ))}
      </div>

      {/* Recent Contacts & Inquiries Preview */}
      <div className="border border-charcoal/15 bg-ivory p-6 rounded-ka space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl text-green">
              Recent Contacts &amp; Experience Enquiries
            </h2>
            <p className="text-xs text-charcoal/65">
              Latest visitor contacts submitted via the website enquiry form or
              WhatsApp.
            </p>
          </div>
          <Link
            href="/admin/leads"
            className="text-xs font-semibold text-green hover:underline"
          >
            View All ({leads.length}) →
          </Link>
        </div>

        <div className="divide-y divide-charcoal/10 text-xs">
          {leads.slice(0, 4).map((lead) => (
            <div
              key={lead.id}
              className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-green">
                    {lead.leadReference}
                  </span>
                  <span className="font-semibold text-charcoal text-sm">
                    {lead.name}
                  </span>
                  <span className="rounded-ka bg-cream px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-forest">
                    {lead.status}
                  </span>
                </div>
                <p className="text-charcoal/70 mt-0.5">
                  {lead.areaOfInterest || "Cultural & Conservation Visit"}
                  {lead.preferredLocation ? ` · ${lead.preferredLocation}` : ""}
                </p>
              </div>

              <div className="flex items-center gap-2">
                {lead.phone && (
                  <a
                    href={`https://wa.me/${lead.phone.replace(/[^\d]/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 rounded-ka border border-forest/30 px-2.5 py-1.5 text-[11px] font-semibold text-forest hover:bg-forest hover:text-ivory transition-colors"
                  >
                    <MessageCircle className="h-3.5 w-3.5" />
                    <span>WhatsApp</span>
                  </a>
                )}
                <a
                  href={`mailto:${lead.email}`}
                  className="inline-flex items-center gap-1 rounded-ka bg-green px-2.5 py-1.5 text-[11px] font-semibold text-ivory hover:bg-forest transition-colors"
                >
                  <Mail className="h-3.5 w-3.5" />
                  <span>Email</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick CMS Action Links */}
      <div className="flex flex-wrap gap-3">
        <Link
          href="/admin/leads"
          className="rounded-ka bg-green px-4 py-2.5 text-xs font-semibold text-ivory hover:bg-forest transition-colors shadow-xs"
        >
          Manage Visitor Contacts &amp; Enquiries →
        </Link>
        <Link
          href="/admin/settings"
          className="rounded-ka border border-gold bg-gold/15 px-4 py-2.5 text-xs font-semibold text-charcoal hover:bg-gold/25 transition-colors"
        >
          Configure Headings, Contact &amp; WhatsApp →
        </Link>
        <Link
          href="/admin/stories"
          className="rounded-ka border border-charcoal/20 bg-ivory px-4 py-2.5 text-xs font-semibold text-charcoal hover:bg-cream/40 transition-colors"
        >
          Manage Editorial Stories →
        </Link>
        <Link
          href="/admin/gallery"
          className="rounded-ka border border-forest bg-forest/10 px-4 py-2.5 text-xs font-semibold text-forest hover:bg-forest/20 transition-colors"
        >
          Media &amp; Photography Gallery →
        </Link>
      </div>
    </div>
  );
}
