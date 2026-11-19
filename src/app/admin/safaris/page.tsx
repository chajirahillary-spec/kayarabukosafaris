"use client";

import { useState } from "react";
import { safaris, safariStyleLabels } from "@/data/safaris";
import { formatUsd } from "@/components/ui/commerce";
import type { Safari, AccommodationTier, TransportType, SafariStyle } from "@/lib/types";
import { X } from "lucide-react";

export default function AdminSafarisPage() {
  const [items, setItems] = useState<Safari[]>(safaris);
  const [search, setSearch] = useState("");
  const [filterStyle, setFilterStyle] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSafari, setEditingSafari] = useState<Safari | null>(null);

  // Form states for Create/Edit
  const [formTitle, setFormTitle] = useState("");
  const [formDays, setFormDays] = useState(3);
  const [formPrice, setFormPrice] = useState(650);
  const [formTier, setFormTier] = useState<AccommodationTier>("mid-range");
  const [formTransport, setFormTransport] = useState<TransportType>("land-cruiser");
  const [formStyle, setFormStyle] = useState<SafariStyle>("wildlife");
  const [formShortDesc, setFormShortDesc] = useState("");

  const filtered = items.filter((s) => {
    if (search && !s.title.toLowerCase().includes(search.toLowerCase())) return false;
    if (filterStyle && !s.styles.includes(filterStyle as SafariStyle)) return false;
    return true;
  });

  const openCreateModal = () => {
    setEditingSafari(null);
    setFormTitle("");
    setFormDays(3);
    setFormPrice(650);
    setFormTier("mid-range");
    setFormTransport("land-cruiser");
    setFormStyle("wildlife");
    setFormShortDesc("");
    setModalOpen(true);
  };

  const openEditModal = (s: Safari) => {
    setEditingSafari(s);
    setFormTitle(s.title);
    setFormDays(s.days);
    setFormPrice(s.fromPriceUsd);
    setFormTier(s.tier);
    setFormTransport(s.transport);
    setFormStyle(s.styles[0] || "wildlife");
    setFormShortDesc(s.shortDescription);
    setModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingSafari) {
      setItems((prev) =>
        prev.map((s) =>
          s.slug === editingSafari.slug
            ? {
                ...s,
                title: formTitle,
                days: formDays,
                fromPriceUsd: formPrice,
                tier: formTier,
                transport: formTransport,
                styles: [formStyle],
                shortDescription: formShortDesc,
              }
            : s
        )
      );
    } else {
      const slug = formTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
      const newSafari: Safari = {
        slug,
        title: formTitle,
        days: formDays,
        destinationSlugs: ["maasai-mara"],
        countySlugs: ["narok"],
        styles: [formStyle],
        tier: formTier,
        transport: formTransport,
        difficulty: "easy",
        departureFrom: "Nairobi",
        groupTypes: ["private", "couple"],
        wildlife: ["Big Five"],
        activities: ["Game drives"],
        shortDescription: formShortDesc,
        overview: formShortDesc,
        highlights: ["Game drives"],
        itinerary: [],
        included: ["Park fees", "Full board accommodation", "Transport"],
        excluded: ["International flights", "Tips"],
        fromPriceUsd: formPrice,
        popularity: 50,
        publishedAt: new Date().toISOString().split("T")[0],
        accommodationNotes: "Subject to availability",
        faqs: [],
        image: { alt: formTitle },
        isSeed: false,
      };
      setItems((prev) => [newSafari, ...prev]);
    }
    setModalOpen(false);
  };

  const handleDelete = (slug: string) => {
    if (confirm("Are you sure you want to remove this safari package?")) {
      setItems((prev) => prev.filter((s) => s.slug !== slug));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">
            Safari CMS
          </p>
          <h1 className="font-display mt-1 text-3xl sm:text-4xl text-green">
            Safaris &amp; Tour Packages
          </h1>
          <p className="mt-1 text-xs text-charcoal/70">
            Create, edit, adjust base pricing, and manage live itineraries across your catalogue.
          </p>
        </div>
        <div>
          <button
            type="button"
            onClick={openCreateModal}
            className="rounded-ka bg-green px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-ivory hover:bg-forest transition-colors"
          >
            + Create New Safari
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center gap-3 border-y border-charcoal/15 py-3 text-xs">
        <input
          type="search"
          placeholder="Search safaris..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-10 rounded border border-charcoal/25 bg-ivory px-3 text-xs min-w-[220px]"
        />

        <select
          value={filterStyle}
          onChange={(e) => setFilterStyle(e.target.value)}
          className="h-10 rounded border border-charcoal/25 bg-ivory px-3 text-xs"
        >
          <option value="">All Safari Styles</option>
          {Object.entries(safariStyleLabels).map(([key, label]) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </select>
        <span className="text-charcoal/60 ml-auto">
          Showing {filtered.length} of {items.length} packages
        </span>
      </div>

      {/* Packages Table */}
      <div className="border border-charcoal/15 bg-ivory rounded-ka overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-charcoal/15 bg-cream/30 text-charcoal/70 uppercase tracking-wider">
              <th className="py-3 px-4">Title &amp; Route</th>
              <th>Duration</th>
              <th>Style</th>
              <th>Tier</th>
              <th>Transport</th>
              <th>Starting Price</th>
              <th>Status</th>
              <th className="text-right px-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-charcoal/10">
            {filtered.map((s) => (
              <tr key={s.slug} className="hover:bg-cream/20">
                <td className="py-3 px-4">
                  <span className="font-semibold text-green block text-sm">{s.title}</span>
                  <span className="text-[11px] text-charcoal/60">/safaris/{s.slug}</span>
                </td>
                <td>{s.days} Days</td>
                <td>
                  <span className="rounded bg-cream px-2 py-0.5 text-[11px] font-medium text-green">
                    {safariStyleLabels[s.styles[0]] || s.styles[0]}
                  </span>
                </td>
                <td className="capitalize">{s.tier}</td>
                <td className="capitalize">{s.transport.replace("-", " ")}</td>
                <td className="font-semibold text-sm">{formatUsd(s.fromPriceUsd)}</td>
                <td>
                  <span className="rounded bg-green/10 px-2 py-0.5 text-[10px] uppercase font-semibold text-green">
                    Published
                  </span>
                </td>
                <td className="text-right px-4 space-x-2">
                  <button
                    type="button"
                    onClick={() => openEditModal(s)}
                    className="rounded border border-gold px-2.5 py-1 text-green font-semibold hover:bg-cream"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(s.slug)}
                    className="rounded border border-charcoal/20 px-2 py-1 text-red-700 font-semibold hover:bg-red-50"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Create / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/60 p-4">
          <div className="max-w-xl w-full bg-ivory border border-gold/50 p-6 rounded-ka shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-charcoal/15 pb-3">
              <h3 className="font-display text-2xl text-green">
                {editingSafari ? "Edit Safari Package" : "Create New Safari Package"}
              </h3>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="inline-flex items-center gap-1 text-xs uppercase font-semibold text-charcoal/60 hover:text-charcoal"
              >
                <X className="h-3.5 w-3.5" /> Close
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold uppercase tracking-wider text-green mb-1">
                  Safari Title *
                </label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g. 5-Day Amboseli & Chyulu Hills Safari"
                  className="h-10 w-full rounded border border-charcoal/30 bg-ivory px-3 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold uppercase tracking-wider text-green mb-1">
                    Duration (Days) *
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={30}
                    required
                    value={formDays}
                    onChange={(e) => setFormDays(Number(e.target.value))}
                    className="h-10 w-full rounded border border-charcoal/30 bg-ivory px-3 text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold uppercase tracking-wider text-green mb-1">
                    Starting Price ($ USD per person) *
                  </label>
                  <input
                    type="number"
                    min={100}
                    step={25}
                    required
                    value={formPrice}
                    onChange={(e) => setFormPrice(Number(e.target.value))}
                    className="h-10 w-full rounded border border-charcoal/30 bg-ivory px-3 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block font-semibold uppercase tracking-wider text-green mb-1">
                    Primary Style
                  </label>
                  <select
                    value={formStyle}
                    onChange={(e) => setFormStyle(e.target.value as SafariStyle)}
                    className="h-10 w-full rounded border border-charcoal/30 bg-ivory px-2 text-xs"
                  >
                    {Object.entries(safariStyleLabels).map(([k, v]) => (
                      <option key={k} value={k}>
                        {v}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold uppercase tracking-wider text-green mb-1">
                    Accommodation Tier
                  </label>
                  <select
                    value={formTier}
                    onChange={(e) => setFormTier(e.target.value as AccommodationTier)}
                    className="h-10 w-full rounded border border-charcoal/30 bg-ivory px-2 text-xs"
                  >
                    <option value="budget">Budget</option>
                    <option value="mid-range">Mid-Range</option>
                    <option value="luxury">Luxury</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold uppercase tracking-wider text-green mb-1">
                    Vehicle Transport
                  </label>
                  <select
                    value={formTransport}
                    onChange={(e) => setFormTransport(e.target.value as TransportType)}
                    className="h-10 w-full rounded border border-charcoal/30 bg-ivory px-2 text-xs"
                  >
                    <option value="safari-van">Safari Van 4x4</option>
                    <option value="land-cruiser">Land Cruiser 4x4</option>
                    <option value="fly-in">Fly-in Safari</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold uppercase tracking-wider text-green mb-1">
                  Short Editorial Description
                </label>
                <textarea
                  rows={3}
                  value={formShortDesc}
                  onChange={(e) => setFormShortDesc(e.target.value)}
                  placeholder="Summary of the wildlife highlights, landscapes, and route..."
                  className="w-full rounded border border-charcoal/30 bg-ivory p-3 text-xs"
                />
              </div>

              <div className="flex gap-3 pt-3 border-t border-charcoal/15">
                <button
                  type="submit"
                  className="rounded bg-green px-4 py-2 font-semibold text-ivory uppercase tracking-wider hover:bg-forest"
                >
                  {editingSafari ? "Update Safari" : "Save & Publish Safari"}
                </button>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="rounded border border-charcoal/30 px-4 py-2 uppercase tracking-wider text-charcoal"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
