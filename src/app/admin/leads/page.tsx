"use client";

import { useEffect, useState } from "react";
import type { Lead, LeadStatus } from "@/lib/bookings/types";
import { FirestoreService } from "@/lib/firebase/firestoreService";
import { contactContent } from "@/data/content";
import {
  Search,
  RefreshCw,
  Plus,
  MessageCircle,
  Mail,
  Trash2,
  Eye,
  X,
  Save,
  Loader2,
  Check,
  UserPlus,
  Phone,
  Globe,
  Calendar,
  Users,
} from "lucide-react";

const STATUS_OPTIONS: { id: LeadStatus; label: string; badgeClass: string }[] = [
  {
    id: "new",
    label: "New Enquiry",
    badgeClass: "bg-gold/20 text-forest border-gold/50",
  },
  {
    id: "contacted",
    label: "In Conversation",
    badgeClass: "bg-green/15 text-green border-green/35",
  },
  {
    id: "qualified",
    label: "Arranging Host / Guide",
    badgeClass: "bg-forest/15 text-forest border-forest/35",
  },
  {
    id: "booked",
    label: "Visit Confirmed",
    badgeClass: "bg-emerald-100 text-emerald-900 border-emerald-300",
  },
  {
    id: "lost",
    label: "Archived",
    badgeClass: "bg-charcoal/10 text-charcoal/65 border-charcoal/20",
  },
];

function formatWhatsAppReplyUrl(lead: Lead): string | null {
  if (!lead.phone) return null;
  const digits = lead.phone.replace(/[^\d]/g, "");
  if (!digits) return null;
  const msg = encodeURIComponent(
    `Hello ${lead.name}, thank you for reaching out to KayArabuko (${
      lead.leadReference
    }) regarding ${
      lead.areaOfInterest || "your cultural and conservation experience"
    }${
      lead.preferredLocation ? ` in ${lead.preferredLocation}` : ""
    }. We would love to help arrange your visit.`
  );
  return `https://wa.me/${digits}?text=${msg}`;
}

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [notesDraft, setNotesDraft] = useState("");
  const [statusDraft, setStatusDraft] = useState<LeadStatus>("new");
  const [savingLead, setSavingLead] = useState(false);
  const [savedBanner, setSavedBanner] = useState<string | null>(null);

  // New Contact / Inquiry Modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newContact, setNewContact] = useState({
    name: "",
    email: "",
    phone: "",
    country: "Kenya",
    areaOfInterest: contactContent.areasOfInterest[0],
    preferredLocation: "",
    travelDates: "Flexible",
    travellerCount: 2,
    notes: "",
  });

  const loadLeads = async () => {
    setLoading(true);
    try {
      const data = await FirestoreService.getLeads();
      setLeads(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLeads();
  }, []);

  const handleQuickStatusChange = async (lead: Lead, newStatus: LeadStatus) => {
    setLeads((prev) =>
      prev.map((l) => (l.id === lead.id ? { ...l, status: newStatus } : l))
    );
    try {
      await FirestoreService.updateLeadStatusAndNotes(
        lead.id,
        newStatus,
        lead.notes
      );
      setSavedBanner(`Updated ${lead.name} (${lead.leadReference}) status.`);
      setTimeout(() => setSavedBanner(null), 3000);
    } catch (err) {
      console.warn("Could not sync status change:", err);
    }
  };

  const openLeadDetail = (lead: Lead) => {
    setSelectedLead(lead);
    setNotesDraft(lead.notes || "");
    setStatusDraft(lead.status);
  };

  const handleSaveLeadDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLead) return;
    setSavingLead(true);

    const updated: Lead = {
      ...selectedLead,
      status: statusDraft,
      notes: notesDraft,
    };

    setLeads((prev) =>
      prev.map((l) => (l.id === updated.id ? updated : l))
    );

    try {
      await FirestoreService.updateLeadStatusAndNotes(
        updated.id,
        statusDraft,
        notesDraft
      );
      setSavedBanner(
        `Saved notes & status for ${updated.name} (${updated.leadReference}).`
      );
      setTimeout(() => setSavedBanner(null), 3500);
      setSelectedLead(null);
    } finally {
      setSavingLead(false);
    }
  };

  const handleDeleteLead = async (lead: Lead) => {
    setLeads((prev) => prev.filter((l) => l.id !== lead.id));
    if (selectedLead?.id === lead.id) {
      setSelectedLead(null);
    }
    try {
      await FirestoreService.deleteLead(lead.id);
      setSavedBanner(`Removed record ${lead.leadReference}.`);
      setTimeout(() => setSavedBanner(null), 3000);
    } catch (err) {
      console.warn("Delete error:", err);
    }
  };

  const handleAddContact = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContact.name.trim() || !newContact.email.trim()) return;
    setSavingLead(true);

    const id = `lead_${Date.now()}`;
    const ref = `KA-ENQ-${Math.floor(1000 + Math.random() * 9000)}`;
    const record: Lead = {
      id,
      leadReference: ref,
      name: newContact.name.trim(),
      email: newContact.email.trim(),
      phone: newContact.phone.trim() || undefined,
      country: newContact.country.trim() || undefined,
      areaOfInterest: newContact.areaOfInterest,
      preferredLocation: newContact.preferredLocation.trim() || undefined,
      travelDates: newContact.travelDates.trim() || "Flexible",
      travellerCount: Number(newContact.travellerCount) || 1,
      interestedDestinations: newContact.preferredLocation.trim()
        ? [newContact.preferredLocation.trim()]
        : [],
      interestedStyles: [],
      source: "direct",
      status: "new",
      notes: newContact.notes.trim(),
      createdAt: new Date().toISOString(),
    };

    setLeads((prev) => [record, ...prev]);
    try {
      await FirestoreService.saveLead(record);
      setSavedBanner(`Added new contact & inquiry ${record.leadReference}.`);
      setTimeout(() => setSavedBanner(null), 3500);
      setShowAddModal(false);
      setNewContact({
        name: "",
        email: "",
        phone: "",
        country: "Kenya",
        areaOfInterest: contactContent.areasOfInterest[0],
        preferredLocation: "",
        travelDates: "Flexible",
        travellerCount: 2,
        notes: "",
      });
    } finally {
      setSavingLead(false);
    }
  };

  const filtered = leads.filter((l) => {
    if (statusFilter !== "all" && l.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const hay = [
        l.leadReference,
        l.name,
        l.email,
        l.phone,
        l.country,
        l.areaOfInterest,
        l.preferredLocation,
        l.notes,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });

  const countByStatus = (st: LeadStatus) =>
    leads.filter((l) => l.status === st).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">
            Admin Contacts &amp; Inquiries Management
          </p>
          <h1 className="font-display mt-1 text-3xl sm:text-4xl text-green">
            Visitor Contacts &amp; Experience Enquiries
          </h1>
          <p className="mt-1 text-xs text-charcoal/70">
            Manage visitor contacts, cultural &amp; conservation enquiries,
            coordinator notes, and reply directly via Email or WhatsApp.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={loadLeads}
            disabled={loading}
            className="cursor-pointer inline-flex items-center gap-1.5 rounded-ka border border-charcoal/20 bg-ivory px-3.5 py-2 text-xs font-semibold text-charcoal hover:border-gold transition-colors"
          >
            <RefreshCw
              className={`h-3.5 w-3.5 text-forest ${
                loading ? "animate-spin" : ""
              }`}
            />
            <span>Refresh</span>
          </button>

          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="cursor-pointer inline-flex items-center gap-1.5 rounded-ka bg-green px-4 py-2 text-xs font-semibold text-ivory hover:bg-forest transition-colors shadow-xs"
          >
            <Plus className="h-3.5 w-3.5 text-gold-light" />
            <span>Add Contact / Inquiry</span>
          </button>
        </div>
      </div>

      {savedBanner && (
        <div className="flex items-center gap-2 rounded-ka border border-green/30 bg-green/10 px-4 py-2.5 text-xs font-semibold text-forest">
          <Check className="h-4 w-4 text-green shrink-0" />
          <span>{savedBanner}</span>
        </div>
      )}

      {/* Summary Metric Cards */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-ka border border-charcoal/15 bg-ivory p-4">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-charcoal/60">
            Total Contacts &amp; Inquiries
          </span>
          <span className="font-display mt-1 block text-3xl text-green">
            {leads.length}
          </span>
        </div>
        <div className="rounded-ka border border-gold/35 bg-cream/35 p-4">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-forest">
            New Enquiries
          </span>
          <span className="font-display mt-1 block text-3xl text-forest">
            {countByStatus("new")}
          </span>
        </div>
        <div className="rounded-ka border border-charcoal/15 bg-ivory p-4">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-charcoal/60">
            In Conversation / Arranging
          </span>
          <span className="font-display mt-1 block text-3xl text-green">
            {countByStatus("contacted") + countByStatus("qualified")}
          </span>
        </div>
        <div className="rounded-ka border border-charcoal/15 bg-ivory p-4">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-charcoal/60">
            Confirmed Visits
          </span>
          <span className="font-display mt-1 block text-3xl text-green">
            {countByStatus("booked")}
          </span>
        </div>
      </div>

      {/* Search & Status Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-y border-charcoal/15 py-4 text-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-charcoal/45" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, email, phone, community, or reference..."
            className="w-full rounded-ka border border-charcoal/25 bg-ivory pl-9 pr-3.5 py-2 text-xs text-charcoal focus:border-green focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 font-semibold">
          <label
            htmlFor="lead-status-filter"
            className="text-charcoal/70 uppercase tracking-wider"
          >
            Status:
          </label>
          <select
            id="lead-status-filter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-ka border border-charcoal/25 bg-ivory px-3 py-2 text-xs text-charcoal focus:border-green focus:outline-none"
          >
            <option value="all">All Contacts &amp; Enquiries ({leads.length})</option>
            {STATUS_OPTIONS.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label} ({countByStatus(s.id)})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Contacts & Enquiries Table */}
      <div className="border border-charcoal/15 bg-ivory rounded-ka overflow-x-auto shadow-xs">
        {loading ? (
          <div className="flex h-48 items-center justify-center gap-2.5 text-xs text-charcoal/70">
            <Loader2 className="h-5 w-5 animate-spin text-green" />
            <span>Loading contacts and enquiries...</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-10 text-center space-y-2">
            <p className="font-display text-2xl text-green">
              No matching contacts or enquiries
            </p>
            <p className="text-xs text-charcoal/65">
              Try clearing your search or status filter, or add a new contact
              above.
            </p>
          </div>
        ) : (
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-charcoal/15 bg-cream/35 text-charcoal/75 uppercase tracking-wider text-[11px]">
                <th className="py-3.5 px-4">Ref / Date</th>
                <th className="py-3.5 px-3">Visitor Contact</th>
                <th className="py-3.5 px-3">Area of Interest</th>
                <th className="py-3.5 px-3">Community / Location &amp; Notes</th>
                <th className="py-3.5 px-3">Group / Dates</th>
                <th className="py-3.5 px-3">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-charcoal/10">
              {filtered.map((lead) => {
                const waUrl = formatWhatsAppReplyUrl(lead);
                const formattedDate = lead.createdAt
                  ? new Date(lead.createdAt).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })
                  : "Recent";

                return (
                  <tr
                    key={lead.id}
                    className="hover:bg-cream/25 transition-colors align-top"
                  >
                    <td className="py-4 px-4 whitespace-nowrap">
                      <span className="font-mono font-bold text-green block">
                        {lead.leadReference}
                      </span>
                      <span className="text-[11px] text-charcoal/60 block mt-0.5">
                        {formattedDate}
                      </span>
                    </td>

                    <td className="py-4 px-3">
                      <span className="font-semibold text-charcoal text-sm block">
                        {lead.name}
                      </span>
                      <a
                        href={`mailto:${lead.email}`}
                        className="text-[11px] text-green hover:underline block"
                      >
                        {lead.email}
                      </a>
                      {lead.phone && (
                        <span className="text-[11px] text-charcoal/70 font-mono block">
                          {lead.phone}
                        </span>
                      )}
                      {lead.country && (
                        <span className="text-[10px] uppercase tracking-wider text-charcoal/50 block mt-0.5">
                          {lead.country}
                        </span>
                      )}
                    </td>

                    <td className="py-4 px-3">
                      <span className="inline-block rounded-ka bg-cream px-2.5 py-1 text-[11px] font-semibold text-forest">
                        {lead.areaOfInterest ||
                          lead.interestedDestinations?.[0] ||
                          "Cultural & Conservation Visit"}
                      </span>
                    </td>

                    <td className="py-4 px-3 max-w-xs">
                      <span className="font-semibold text-charcoal block">
                        {lead.preferredLocation ||
                          lead.interestedDestinations?.join(", ") ||
                          "Flexible across Kenya"}
                      </span>
                      {lead.notes && (
                        <p className="text-[11px] text-charcoal/70 line-clamp-2 mt-1 leading-relaxed">
                          {lead.notes}
                        </p>
                      )}
                    </td>

                    <td className="py-4 px-3 whitespace-nowrap">
                      <span className="block font-medium text-charcoal">
                        {lead.travellerCount || 1}{" "}
                        {(lead.travellerCount || 1) === 1
                          ? "Visitor"
                          : "Visitors"}
                      </span>
                      <span className="text-[11px] text-charcoal/65">
                        {lead.travelDates || "Flexible"}
                      </span>
                    </td>

                    <td className="py-4 px-3">
                      <select
                        aria-label={`Status for ${lead.name}`}
                        value={lead.status}
                        onChange={(e) =>
                          handleQuickStatusChange(
                            lead,
                            e.target.value as LeadStatus
                          )
                        }
                        className="rounded-ka border border-charcoal/30 bg-ivory px-2.5 py-1.5 text-[11px] font-semibold text-green focus:border-green focus:outline-none"
                      >
                        {STATUS_OPTIONS.map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.label}
                          </option>
                        ))}
                      </select>
                    </td>

                    <td className="py-4 px-4 text-right whitespace-nowrap">
                      <div className="inline-flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => openLeadDetail(lead)}
                          className="cursor-pointer inline-flex items-center gap-1 rounded-ka border border-charcoal/20 bg-ivory px-2.5 py-1.5 text-[11px] font-semibold text-charcoal hover:border-gold hover:text-forest transition-colors"
                          title="View & Edit Notes"
                        >
                          <Eye className="h-3.5 w-3.5 text-forest" />
                          <span>Manage</span>
                        </button>

                        {waUrl && (
                          <a
                            href={waUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 rounded-ka bg-forest px-2.5 py-1.5 text-[11px] font-semibold text-gold-light hover:bg-green transition-colors"
                            title="Reply via WhatsApp"
                          >
                            <MessageCircle className="h-3.5 w-3.5" />
                            <span className="hidden xl:inline">WhatsApp</span>
                          </a>
                        )}

                        <a
                          href={`mailto:${lead.email}?subject=${encodeURIComponent(
                            `KayArabuko Enquiry (${
                              lead.areaOfInterest || "Cultural & Conservation Visit"
                            }) - ${lead.leadReference}`
                          )}`}
                          className="inline-flex items-center gap-1 rounded-ka bg-green px-2.5 py-1.5 text-[11px] font-semibold text-ivory hover:bg-forest transition-colors"
                          title="Reply via Email"
                        >
                          <Mail className="h-3.5 w-3.5" />
                          <span className="hidden xl:inline">Email</span>
                        </a>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Manage Contact & Inquiry Modal */}
      {selectedLead && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/75 p-4 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
          aria-label="Manage Contact & Inquiry"
        >
          <div className="w-full max-w-xl rounded-ka border border-gold/40 bg-ivory p-6 sm:p-8 text-charcoal shadow-2xl animate-modal-enter space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between gap-4 border-b border-charcoal/15 pb-4">
              <div>
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-gold">
                  {selectedLead.leadReference}
                </span>
                <h2 className="font-display text-3xl text-green mt-0.5">
                  {selectedLead.name}
                </h2>
                <p className="text-xs text-charcoal/70">{selectedLead.email}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedLead(null)}
                className="cursor-pointer rounded-ka p-1.5 text-charcoal/60 hover:bg-cream hover:text-charcoal"
                aria-label="Close modal"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Contact Details Summary */}
            <div className="grid grid-cols-2 gap-3 rounded-ka bg-cream/40 p-4 text-xs border border-charcoal/10">
              <div className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5 text-forest shrink-0" />
                <span>{selectedLead.phone || "No phone provided"}</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="h-3.5 w-3.5 text-forest shrink-0" />
                <span>{selectedLead.country || "Not specified"}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-3.5 w-3.5 text-forest shrink-0" />
                <span>{selectedLead.travellerCount || 1} Visitors</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-3.5 w-3.5 text-forest shrink-0" />
                <span>{selectedLead.travelDates || "Flexible dates"}</span>
              </div>
              <div className="col-span-2 pt-1 border-t border-charcoal/10">
                <span className="font-semibold text-forest">
                  Interest:{" "}
                </span>
                <span>
                  {selectedLead.areaOfInterest || "Cultural & Conservation Visit"}
                </span>
                {selectedLead.preferredLocation && (
                  <span> · {selectedLead.preferredLocation}</span>
                )}
              </div>
            </div>

            <form onSubmit={handleSaveLeadDetails} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold uppercase tracking-wider text-charcoal">
                  Enquiry Status
                </label>
                <select
                  value={statusDraft}
                  onChange={(e) => setStatusDraft(e.target.value as LeadStatus)}
                  className="mt-1.5 w-full rounded-ka border border-charcoal/25 bg-ivory p-2.5 font-semibold text-green focus:border-green focus:outline-none"
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold uppercase tracking-wider text-charcoal">
                  Visitor Message &amp; Admin Coordinator Notes
                </label>
                <textarea
                  rows={4}
                  value={notesDraft}
                  onChange={(e) => setNotesDraft(e.target.value)}
                  placeholder="Add notes on community hosts, local guides, preferred dates or follow-up actions..."
                  className="mt-1.5 w-full rounded-ka border border-charcoal/25 bg-ivory p-3 text-xs leading-relaxed text-charcoal focus:border-green focus:outline-none"
                />
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-charcoal/15">
                <button
                  type="button"
                  onClick={() => handleDeleteLead(selectedLead)}
                  className="cursor-pointer inline-flex items-center gap-1.5 rounded-ka border border-rose-300 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-800 hover:bg-rose-100 transition-colors"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span>Delete</span>
                </button>

                <div className="flex items-center gap-2">
                  {formatWhatsAppReplyUrl(selectedLead) && (
                    <a
                      href={formatWhatsAppReplyUrl(selectedLead)!}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-ka border border-forest bg-forest/10 px-3.5 py-2 text-xs font-semibold text-forest hover:bg-forest hover:text-ivory transition-colors"
                    >
                      <MessageCircle className="h-3.5 w-3.5" />
                      <span>WhatsApp</span>
                    </a>
                  )}

                  <button
                    type="submit"
                    disabled={savingLead}
                    className="cursor-pointer inline-flex items-center gap-1.5 rounded-ka bg-green px-5 py-2 text-xs font-semibold text-ivory hover:bg-forest transition-colors disabled:opacity-60"
                  >
                    {savingLead ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Save className="h-3.5 w-3.5" />
                    )}
                    <span>Save Changes</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add New Contact / Inquiry Modal */}
      {showAddModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/75 p-4 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
          aria-label="Add New Contact or Inquiry"
        >
          <div className="w-full max-w-lg rounded-ka border border-gold/40 bg-ivory p-6 sm:p-8 text-charcoal shadow-2xl animate-modal-enter space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-charcoal/15 pb-3">
              <div className="flex items-center gap-2">
                <UserPlus className="h-5 w-5 text-green" />
                <h2 className="font-display text-2xl sm:text-3xl text-green">
                  Add Contact / Inquiry
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="cursor-pointer rounded-ka p-1.5 text-charcoal/60 hover:bg-cream"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAddContact} className="space-y-4 text-xs">
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-charcoal">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={newContact.name}
                    onChange={(e) =>
                      setNewContact({ ...newContact, name: e.target.value })
                    }
                    placeholder="Visitor full name"
                    className="mt-1 w-full rounded-ka border border-charcoal/25 bg-ivory p-2.5"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-charcoal">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={newContact.email}
                    onChange={(e) =>
                      setNewContact({ ...newContact, email: e.target.value })
                    }
                    placeholder="visitor@example.com"
                    className="mt-1 w-full rounded-ka border border-charcoal/25 bg-ivory p-2.5"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-charcoal">
                    Phone / WhatsApp
                  </label>
                  <input
                    type="tel"
                    value={newContact.phone}
                    onChange={(e) =>
                      setNewContact({ ...newContact, phone: e.target.value })
                    }
                    placeholder="+254 7..."
                    className="mt-1 w-full rounded-ka border border-charcoal/25 bg-ivory p-2.5"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-charcoal">
                    Country
                  </label>
                  <input
                    type="text"
                    value={newContact.country}
                    onChange={(e) =>
                      setNewContact({ ...newContact, country: e.target.value })
                    }
                    className="mt-1 w-full rounded-ka border border-charcoal/25 bg-ivory p-2.5"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-charcoal">
                    Area of Interest
                  </label>
                  <select
                    value={newContact.areaOfInterest}
                    onChange={(e) =>
                      setNewContact({
                        ...newContact,
                        areaOfInterest: e.target.value,
                      })
                    }
                    className="mt-1 w-full rounded-ka border border-charcoal/25 bg-ivory p-2.5"
                  >
                    {contactContent.areasOfInterest.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-charcoal">
                    Preferred Community / Location
                  </label>
                  <input
                    type="text"
                    value={newContact.preferredLocation}
                    onChange={(e) =>
                      setNewContact({
                        ...newContact,
                        preferredLocation: e.target.value,
                      })
                    }
                    placeholder="e.g. Arabuko-Sokoke, Samburu"
                    className="mt-1 w-full rounded-ka border border-charcoal/25 bg-ivory p-2.5"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-charcoal">
                  Notes / Inquiry Summary
                </label>
                <textarea
                  rows={3}
                  value={newContact.notes}
                  onChange={(e) =>
                    setNewContact({ ...newContact, notes: e.target.value })
                  }
                  placeholder="Details about the contact or enquiry..."
                  className="mt-1 w-full rounded-ka border border-charcoal/25 bg-ivory p-2.5"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="cursor-pointer rounded-ka border border-charcoal/25 px-4 py-2 text-xs font-semibold text-charcoal"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingLead}
                  className="cursor-pointer rounded-ka bg-green px-5 py-2 text-xs font-semibold text-ivory hover:bg-forest"
                >
                  Save Contact &amp; Inquiry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
