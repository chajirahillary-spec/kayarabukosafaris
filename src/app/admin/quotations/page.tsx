"use client";

import { useState } from "react";
import Link from "next/link";
import { formatUsd } from "@/components/ui/commerce";
import { Check, Copy, ExternalLink, X } from "lucide-react";

export type ProposalStatus = "draft" | "sent" | "viewed" | "accepted" | "converted" | "expired";

export interface Quotation {
  id: string;
  ref: string;
  clientName: string;
  clientEmail: string;
  country: string;
  safariTitle: string;
  durationDays: number;
  departureDate: string;
  pax: number;
  totalUsd: number;
  depositUsd: number;
  status: ProposalStatus;
  createdAt: string;
  expiresAt: string;
}

const INITIAL_QUOTATIONS: Quotation[] = [
  {
    id: "prop-881",
    ref: "KA-PROP-881",
    clientName: "Eleanor & Marcus Vance",
    clientEmail: "m.vance@vancemedia.com",
    country: "United States",
    safariTitle: "8-Day Kilimanjaro, Tsavo & Diani Luxury Honeymoon",
    durationDays: 8,
    departureDate: "2026-11-24",
    pax: 2,
    totalUsd: 5850,
    depositUsd: 1755,
    status: "viewed",
    createdAt: "2026-10-02",
    expiresAt: "2026-11-10",
  },
  {
    id: "prop-882",
    ref: "KA-PROP-882",
    clientName: "Familie Weber",
    clientEmail: "h.weber@weber-eng.de",
    country: "Germany",
    safariTitle: "10-Day Complete Rift Valley & Big Cat Photographic Expedition",
    durationDays: 10,
    departureDate: "2026-12-05",
    pax: 4,
    totalUsd: 8400,
    depositUsd: 2520,
    status: "accepted",
    createdAt: "2026-10-01",
    expiresAt: "2026-10-25",
  },
  {
    id: "prop-883",
    ref: "KA-PROP-883",
    clientName: "Sir Julian Thorne",
    clientEmail: "thorne.j@thornecapital.co.uk",
    country: "United Kingdom",
    safariTitle: "6-Day Private Mara Flying Safari & Hot Air Balloon",
    durationDays: 6,
    departureDate: "2026-12-18",
    pax: 2,
    totalUsd: 7200,
    depositUsd: 2160,
    status: "sent",
    createdAt: "2026-10-04",
    expiresAt: "2026-10-30",
  },
  {
    id: "prop-884",
    ref: "KA-PROP-884",
    clientName: "Amina Al Mansoori",
    clientEmail: "amina.almansoori@dubaiholding.ae",
    country: "UAE",
    safariTitle: "5-Day Ol Pejeta Rhino Sanctuary & Samburu Special Five",
    durationDays: 5,
    departureDate: "2027-01-10",
    pax: 3,
    totalUsd: 4950,
    depositUsd: 1485,
    status: "draft",
    createdAt: "2026-10-05",
    expiresAt: "2026-11-15",
  },
];

export default function AdminQuotationsPage() {
  const [quotations, setQuotations] = useState<Quotation[]>(INITIAL_QUOTATIONS);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Form State
  const [newProp, setNewProp] = useState({
    clientName: "",
    clientEmail: "",
    country: "United States",
    safariTitle: "",
    durationDays: 7,
    departureDate: "2026-12-01",
    pax: 2,
    totalUsd: 4500,
  });

  const filtered = quotations.filter((q) => {
    const matchesSearch =
      q.clientName.toLowerCase().includes(search.toLowerCase()) ||
      q.ref.toLowerCase().includes(search.toLowerCase()) ||
      q.safariTitle.toLowerCase().includes(search.toLowerCase()) ||
      q.clientEmail.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === "ALL" || q.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProp.clientName || !newProp.safariTitle) return;

    const id = `prop-${Math.floor(885 + Math.random() * 500)}`;
    const depositUsd = Math.round(newProp.totalUsd * 0.3);

    const created: Quotation = {
      id,
      ref: `KA-${id.toUpperCase()}`,
      clientName: newProp.clientName,
      clientEmail: newProp.clientEmail,
      country: newProp.country,
      safariTitle: newProp.safariTitle,
      durationDays: Number(newProp.durationDays),
      departureDate: newProp.departureDate,
      pax: Number(newProp.pax),
      totalUsd: Number(newProp.totalUsd),
      depositUsd,
      status: "sent",
      createdAt: new Date().toISOString().split("T")[0],
      expiresAt: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    };

    setQuotations([created, ...quotations]);
    setIsModalOpen(false);
  };

  const copyProposalLink = (id: string) => {
    const url = `${window.location.origin}/proposal/${id}`;
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const getStatusBadge = (status: ProposalStatus) => {
    switch (status) {
      case "accepted":
      case "converted":
        return "bg-green/15 text-forest border border-green/30 font-semibold";
      case "viewed":
        return "bg-gold/20 text-charcoal border border-gold/40 font-semibold";
      case "sent":
        return "bg-blue-50 text-blue-800 border border-blue-200 font-medium";
      case "draft":
        return "bg-charcoal/10 text-charcoal/70 border border-charcoal/20 font-medium";
      case "expired":
        return "bg-rose-50 text-rose-800 border border-rose-200 font-medium";
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold text-forest">Quotations & Custom Safari Proposals</h1>
          <p className="text-xs text-charcoal/70">
            Tailor-made safari proposals, live client shareable links, and conversion tracking.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 rounded-ka bg-forest px-4 py-2 text-xs font-semibold text-ivory hover:bg-green transition-colors"
        >
          <span>+ Create Custom Proposal</span>
        </button>
      </div>

      {/* KPI Counters */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-ka border border-charcoal/10 bg-ivory p-4 shadow-xs">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-charcoal/60">Proposals Value</p>
          <p className="mt-1 font-serif text-2xl font-bold text-forest">
            {formatUsd(quotations.reduce((sum, q) => sum + q.totalUsd, 0))}
          </p>
          <p className="mt-0.5 text-[10px] text-charcoal/60">Total active pipeline</p>
        </div>
        <div className="rounded-ka border border-charcoal/10 bg-ivory p-4 shadow-xs">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-charcoal/60">Accepted / Converted</p>
          <p className="mt-1 font-serif text-2xl font-bold text-green">
            {quotations.filter((q) => q.status === "accepted" || q.status === "converted").length}
          </p>
          <p className="mt-0.5 text-[10px] text-charcoal/60">Ready for deposit</p>
        </div>
        <div className="rounded-ka border border-charcoal/10 bg-ivory p-4 shadow-xs">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-charcoal/60">Client Viewed</p>
          <p className="mt-1 font-serif text-2xl font-bold text-gold">
            {quotations.filter((q) => q.status === "viewed").length}
          </p>
          <p className="mt-0.5 text-[10px] text-charcoal/60">Engaging proposal link</p>
        </div>
        <div className="rounded-ka border border-charcoal/10 bg-ivory p-4 shadow-xs">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-charcoal/60">Conversion Rate</p>
          <p className="mt-1 font-serif text-2xl font-bold text-forest">42.5%</p>
          <p className="mt-0.5 text-[10px] text-charcoal/60">Custom safari itineraries</p>
        </div>
      </div>

      {/* Filter toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-ka border border-charcoal/10 bg-ivory p-4 shadow-xs">
        <input
          type="text"
          placeholder="Search client, ref number, email, or safari itinerary..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-md w-full rounded-ka border border-charcoal/20 bg-cream/20 px-3 py-2 text-xs focus:border-forest focus:outline-none"
        />
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="text-charcoal/60 font-medium">Status:</span>
          {["ALL", "sent", "viewed", "accepted", "draft", "expired"].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`rounded-ka px-3 py-1 text-xs capitalize transition-colors ${
                statusFilter === st ? "bg-forest text-ivory font-semibold" : "bg-cream/40 text-charcoal hover:bg-cream"
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Quotations Table */}
      <div className="overflow-hidden rounded-ka border border-charcoal/10 bg-ivory shadow-xs">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-charcoal/10 bg-cream/30 text-[11px] font-semibold uppercase tracking-wider text-charcoal/70">
            <tr>
              <th className="p-3.5">Ref / Client</th>
              <th className="p-3.5">Safari Itinerary</th>
              <th className="p-3.5">Duration & Pax</th>
              <th className="p-3.5">Total & 30% Deposit</th>
              <th className="p-3.5">Status</th>
              <th className="p-3.5">Validity</th>
              <th className="p-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-charcoal/10">
            {filtered.map((item) => (
              <tr key={item.id} className="hover:bg-cream/15 transition-colors">
                <td className="p-3.5">
                  <p className="font-mono font-bold text-forest">{item.ref}</p>
                  <p className="font-semibold text-charcoal">{item.clientName}</p>
                  <p className="text-[11px] text-charcoal/60">{item.clientEmail} ({item.country})</p>
                </td>
                <td className="p-3.5 max-w-xs">
                  <p className="font-medium text-charcoal truncate">{item.safariTitle}</p>
                  <p className="text-[11px] text-charcoal/60">Departing: {item.departureDate}</p>
                </td>
                <td className="p-3.5">
                  <p className="font-medium text-charcoal">{item.durationDays} Days / {item.durationDays - 1} Nights</p>
                  <p className="text-[11px] text-charcoal/60">{item.pax} Guests Sharing</p>
                </td>
                <td className="p-3.5 font-mono">
                  <p className="text-forest font-bold">{formatUsd(item.totalUsd)}</p>
                  <p className="text-gold font-medium text-[11px]">Deposit: {formatUsd(item.depositUsd)}</p>
                </td>
                <td className="p-3.5">
                  <span className={`rounded-ka px-2 py-0.5 text-[10px] capitalize ${getStatusBadge(item.status)}`}>
                    {item.status}
                  </span>
                </td>
                <td className="p-3.5 text-charcoal/70 text-[11px]">
                  <p>Created: {item.createdAt}</p>
                  <p className="text-rose-700 font-medium">Expires: {item.expiresAt}</p>
                </td>
                <td className="p-3.5 text-right space-x-2">
                  <button
                    onClick={() => copyProposalLink(item.id)}
                    className="inline-flex items-center gap-1 rounded border border-gold/50 bg-gold/10 px-2 py-1 text-[11px] font-semibold text-charcoal hover:bg-gold/20"
                    title="Copy interactive client proposal link"
                  >
                    {copiedId === item.id ? (
                      <>
                        <Check className="h-3 w-3 text-green" /> Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="h-3 w-3 opacity-70" /> Copy Link
                      </>
                    )}
                  </button>
                  <Link
                    href={`/proposal/${item.id}`}
                    target="_blank"
                    className="inline-flex items-center gap-1 rounded border border-charcoal/20 px-2 py-1 text-[11px] font-medium text-charcoal hover:bg-cream/40"
                  >
                    <span>Preview</span>
                    <ExternalLink className="h-3 w-3 opacity-60" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Create Proposal Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg rounded-ka border border-charcoal/15 bg-ivory p-6 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-charcoal/10 pb-3">
              <h2 className="font-serif text-lg font-bold text-forest">Create Tailor-Made Safari Proposal</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="rounded p-1 text-charcoal/60 hover:text-charcoal"
                aria-label="Close modal"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="mt-4 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-charcoal">Client Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sarah Jenkins"
                    value={newProp.clientName}
                    onChange={(e) => setNewProp({ ...newProp, clientName: e.target.value })}
                    className="mt-1 w-full rounded-ka border border-charcoal/20 bg-cream/20 p-2 focus:border-forest focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-charcoal">Client Email</label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. sarah@example.com"
                    value={newProp.clientEmail}
                    onChange={(e) => setNewProp({ ...newProp, clientEmail: e.target.value })}
                    className="mt-1 w-full rounded-ka border border-charcoal/20 bg-cream/20 p-2 focus:border-forest focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-charcoal">Origin Country</label>
                <input
                  type="text"
                  placeholder="e.g. United Kingdom"
                  value={newProp.country}
                  onChange={(e) => setNewProp({ ...newProp, country: e.target.value })}
                  className="mt-1 w-full rounded-ka border border-charcoal/20 bg-cream/20 p-2 focus:border-forest focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-charcoal">Custom Safari Itinerary Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 7-Day Great Migration, Chyulu Hills & Diani Bush-to-Beach"
                  value={newProp.safariTitle}
                  onChange={(e) => setNewProp({ ...newProp, safariTitle: e.target.value })}
                  className="mt-1 w-full rounded-ka border border-charcoal/20 bg-cream/20 p-2 focus:border-forest focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-charcoal">Duration (Days)</label>
                  <input
                    type="number"
                    min="1"
                    value={newProp.durationDays}
                    onChange={(e) => setNewProp({ ...newProp, durationDays: Number(e.target.value) })}
                    className="mt-1 w-full rounded-ka border border-charcoal/20 bg-cream/20 p-2 focus:border-forest focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-charcoal">Travel Date</label>
                  <input
                    type="date"
                    value={newProp.departureDate}
                    onChange={(e) => setNewProp({ ...newProp, departureDate: e.target.value })}
                    className="mt-1 w-full rounded-ka border border-charcoal/20 bg-cream/20 p-2 focus:border-forest focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-charcoal">Travellers</label>
                  <input
                    type="number"
                    min="1"
                    value={newProp.pax}
                    onChange={(e) => setNewProp({ ...newProp, pax: Number(e.target.value) })}
                    className="mt-1 w-full rounded-ka border border-charcoal/20 bg-cream/20 p-2 focus:border-forest focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-charcoal">Total Agreed Itinerary Price (USD)</label>
                <input
                  type="number"
                  min="500"
                  value={newProp.totalUsd}
                  onChange={(e) => setNewProp({ ...newProp, totalUsd: Number(e.target.value) })}
                  className="mt-1 w-full rounded-ka border border-charcoal/20 bg-cream/20 p-2 focus:border-forest focus:outline-none"
                />
                <p className="mt-1 text-[11px] text-charcoal/60">
                  Calculated 30% Deposit: <strong className="text-gold font-mono">{formatUsd(Math.round(newProp.totalUsd * 0.3))}</strong>
                </p>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-charcoal/10">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-ka px-4 py-2 font-medium text-charcoal hover:bg-cream/40"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-ka bg-forest px-4 py-2 font-semibold text-ivory hover:bg-green"
                >
                  Generate Proposal & Link
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
