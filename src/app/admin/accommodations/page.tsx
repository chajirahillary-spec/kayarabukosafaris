"use client";

import { useState } from "react";
import { formatUsd } from "@/components/ui/commerce";
import { X } from "lucide-react";

export type AccommodationType =
  | "Luxury Tented Camp"
  | "Safari Lodge"
  | "Eco-Bush Camp"
  | "Treehouse Lodge"
  | "Coastal Beach Resort";

export type AccommodationTier = "Luxury" | "Mid-Range" | "Eco-Budget";
export type PartnerStatus = "Preferred Partner" | "Standard Partner" | "Under Review";

export interface Accommodation {
  id: string;
  name: string;
  type: AccommodationType;
  ecosystem: string;
  county: string;
  tier: AccommodationTier;
  rackRateHighUsd: number;
  rackRateLowUsd: number;
  roomsCount: number;
  amenities: string[];
  partnerStatus: PartnerStatus;
  reservationContact: string;
  reservationEmail: string;
  phone: string;
}

const INITIAL_ACCOMMODATIONS: Accommodation[] = [
  {
    id: "acc-1",
    name: "Mara Serena Safari Lodge",
    type: "Safari Lodge",
    ecosystem: "Maasai Mara Triangle",
    county: "Narok",
    tier: "Luxury",
    rackRateHighUsd: 480,
    rackRateLowUsd: 310,
    roomsCount: 74,
    amenities: ["Swimming Pool", "Panoramic Mara River View", "Wi-Fi", "Bush Breakfast", "Solar Power"],
    partnerStatus: "Preferred Partner",
    reservationContact: "Grace Ndung'u",
    reservationEmail: "reservations@serenahotels.com",
    phone: "+254 732 123 333",
  },
  {
    id: "acc-2",
    name: "Entim Mara Tented Camp",
    type: "Luxury Tented Camp",
    ecosystem: "Maasai Mara National Reserve",
    county: "Narok",
    tier: "Luxury",
    rackRateHighUsd: 690,
    rackRateLowUsd: 440,
    roomsCount: 12,
    amenities: ["Riverfront Tents", "Migration Crossing Viewpoint", "Photographic Vehicle", "Inclusive Drinks"],
    partnerStatus: "Preferred Partner",
    reservationContact: "Tarquin Wood",
    reservationEmail: "safaris@entim-mara.com",
    phone: "+254 720 902 441",
  },
  {
    id: "acc-3",
    name: "Ol Tukai Lodge Amboseli",
    type: "Safari Lodge",
    ecosystem: "Amboseli National Park",
    county: "Kajiado",
    tier: "Mid-Range",
    rackRateHighUsd: 340,
    rackRateLowUsd: 220,
    roomsCount: 80,
    amenities: ["Kilimanjaro View", "Elephant Watering Hole", "Conference Room", "Swimming Pool"],
    partnerStatus: "Preferred Partner",
    reservationContact: "Patrick Mwangi",
    reservationEmail: "oltukai@amphall.co.ke",
    phone: "+254 722 201 100",
  },
  {
    id: "acc-4",
    name: "Kilaguni Serena Safari Lodge",
    type: "Safari Lodge",
    ecosystem: "Tsavo West National Park",
    county: "Taita-Taveta",
    tier: "Mid-Range",
    rackRateHighUsd: 310,
    rackRateLowUsd: 195,
    roomsCount: 56,
    amenities: ["Floodlit Waterhole", "Chyulu Hills Views", "Airfield Shuttle", "Mzima Springs Trips"],
    partnerStatus: "Preferred Partner",
    reservationContact: "Lucy Wachira",
    reservationEmail: "kilaguni@serenahotels.com",
    phone: "+254 734 500 120",
  },
  {
    id: "acc-5",
    name: "Sarova Shaba Game Lodge",
    type: "Safari Lodge",
    ecosystem: "Shaba / Samburu Ecosystem",
    county: "Isiolo",
    tier: "Mid-Range",
    rackRateHighUsd: 290,
    rackRateLowUsd: 180,
    roomsCount: 85,
    amenities: ["Ewaso Nyiro Riverbank", "Natural Spring Pools", "Crocodile Feeding", "Cultural Maasai & Samburu Evenings"],
    partnerStatus: "Standard Partner",
    reservationContact: "Kevin Mutua",
    reservationEmail: "shaba@sarovahotels.com",
    phone: "+254 728 606 500",
  },
  {
    id: "acc-6",
    name: "Lake Naivasha Sopa Resort",
    type: "Safari Lodge",
    ecosystem: "Lake Naivasha Basin",
    county: "Nakuru",
    tier: "Mid-Range",
    rackRateHighUsd: 260,
    rackRateLowUsd: 170,
    roomsCount: 84,
    amenities: ["Roaming Zebras & Giraffes", "Lake Boat Launch", "Swimming Pool", "Gardens"],
    partnerStatus: "Preferred Partner",
    reservationContact: "Esther Wanja",
    reservationEmail: "reservations@sopalodges.com",
    phone: "+254 722 206 328",
  },
  {
    id: "acc-7",
    name: "Medina Palms Watamu",
    type: "Coastal Beach Resort",
    ecosystem: "Watamu Marine Park",
    county: "Kilifi",
    tier: "Luxury",
    rackRateHighUsd: 550,
    rackRateLowUsd: 340,
    roomsCount: 40,
    amenities: ["Private Coral Beachfront", "Sakina Ocean Spa", "Infinity Pools", "Deep Sea Marine Charter"],
    partnerStatus: "Preferred Partner",
    reservationContact: "Alina Roberts",
    reservationEmail: "res@medinapalms.com",
    phone: "+254 710 571 515",
  },
  {
    id: "acc-8",
    name: "The Sands at Nomad",
    type: "Coastal Beach Resort",
    ecosystem: "Diani Beach",
    county: "Kwale",
    tier: "Luxury",
    rackRateHighUsd: 490,
    rackRateLowUsd: 290,
    roomsCount: 37,
    amenities: ["White Sand Beach", "Diving School PADI", "Indo-Arab Architecture", "Eco-Certified"],
    partnerStatus: "Preferred Partner",
    reservationContact: "Hassan Omar",
    reservationEmail: "info@thesandsatnomad.com",
    phone: "+254 722 783 744",
  },
];

export default function AdminAccommodationsPage() {
  const [accommodations, setAccommodations] = useState<Accommodation[]>(INITIAL_ACCOMMODATIONS);
  const [search, setSearch] = useState("");
  const [tierFilter, setTierFilter] = useState<string>("ALL");
  const [typeFilter, setTypeFilter] = useState<string>("ALL");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [newAcc, setNewAcc] = useState<Partial<Accommodation>>({
    name: "",
    type: "Luxury Tented Camp",
    ecosystem: "",
    county: "Narok",
    tier: "Mid-Range",
    rackRateHighUsd: 350,
    rackRateLowUsd: 220,
    roomsCount: 20,
    amenities: ["Solar Power", "Wi-Fi", "Game Drives"],
    partnerStatus: "Standard Partner",
    reservationContact: "",
    reservationEmail: "",
    phone: "+254 ",
  });

  const filtered = accommodations.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.ecosystem.toLowerCase().includes(search.toLowerCase()) ||
      item.county.toLowerCase().includes(search.toLowerCase());

    const matchesTier = tierFilter === "ALL" || item.tier === tierFilter;
    const matchesType = typeFilter === "ALL" || item.type === typeFilter;

    return matchesSearch && matchesTier && matchesType;
  });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAcc.name || !newAcc.ecosystem) return;

    const created: Accommodation = {
      id: `acc-${Date.now()}`,
      name: newAcc.name || "",
      type: (newAcc.type as AccommodationType) || "Safari Lodge",
      ecosystem: newAcc.ecosystem || "",
      county: newAcc.county || "Narok",
      tier: (newAcc.tier as AccommodationTier) || "Mid-Range",
      rackRateHighUsd: Number(newAcc.rackRateHighUsd) || 300,
      rackRateLowUsd: Number(newAcc.rackRateLowUsd) || 200,
      roomsCount: Number(newAcc.roomsCount) || 15,
      amenities: typeof newAcc.amenities === "string"
        ? (newAcc.amenities as string).split(",").map((a) => a.trim()).filter(Boolean)
        : (newAcc.amenities || []),
      partnerStatus: (newAcc.partnerStatus as PartnerStatus) || "Standard Partner",
      reservationContact: newAcc.reservationContact || "Reservations Team",
      reservationEmail: newAcc.reservationEmail || "info@lodge.co.ke",
      phone: newAcc.phone || "+254 700 000 000",
    };

    setAccommodations([created, ...accommodations]);
    setIsModalOpen(false);
  };

  const getTierBadge = (tier: AccommodationTier) => {
    switch (tier) {
      case "Luxury":
        return "bg-gold/20 text-charcoal border border-gold/40 font-bold";
      case "Mid-Range":
        return "bg-forest/10 text-forest border border-forest/30 font-medium";
      case "Eco-Budget":
        return "bg-cream text-charcoal border border-charcoal/20 font-medium";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold text-forest">Lodges, Camps & Partner Resorts</h1>
          <p className="text-xs text-charcoal/70">
            Contracted safari accommodations, rack rates, ecosystem distribution & direct booking contacts.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 rounded-ka bg-forest px-4 py-2 text-xs font-semibold text-ivory hover:bg-green transition-colors"
        >
          <span>+ Add Partner Lodge / Camp</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-ka border border-charcoal/10 bg-ivory p-4 shadow-xs">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-charcoal/60">Partner Lodges</p>
          <p className="mt-1 font-serif text-2xl font-bold text-forest">{accommodations.length}</p>
          <p className="mt-0.5 text-[10px] text-charcoal/60">Active contracting</p>
        </div>
        <div className="rounded-ka border border-charcoal/10 bg-ivory p-4 shadow-xs">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-charcoal/60">Preferred Partners</p>
          <p className="mt-1 font-serif text-2xl font-bold text-gold">
            {accommodations.filter((a) => a.partnerStatus === "Preferred Partner").length}
          </p>
          <p className="mt-0.5 text-[10px] text-charcoal/60">Negotiated STO rates</p>
        </div>
        <div className="rounded-ka border border-charcoal/10 bg-ivory p-4 shadow-xs">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-charcoal/60">Luxury Camps</p>
          <p className="mt-1 font-serif text-2xl font-bold text-forest">
            {accommodations.filter((a) => a.tier === "Luxury").length}
          </p>
          <p className="mt-0.5 text-[10px] text-charcoal/60">High-end fly-in camps</p>
        </div>
        <div className="rounded-ka border border-charcoal/10 bg-ivory p-4 shadow-xs">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-charcoal/60">Avg. High Season Rate</p>
          <p className="mt-1 font-serif text-2xl font-bold text-forest">
            ${Math.round(accommodations.reduce((sum, a) => sum + a.rackRateHighUsd, 0) / accommodations.length)}
          </p>
          <p className="mt-0.5 text-[10px] text-charcoal/60">Per person / night</p>
        </div>
      </div>

      {/* Filter toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-ka border border-charcoal/10 bg-ivory p-4 shadow-xs">
        <input
          type="text"
          placeholder="Search lodge name, ecosystem, or county..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-md w-full rounded-ka border border-charcoal/20 bg-cream/20 px-3 py-2 text-xs focus:border-forest focus:outline-none"
        />
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="text-charcoal/60 font-medium">Tier:</span>
          {["ALL", "Luxury", "Mid-Range", "Eco-Budget"].map((t) => (
            <button
              key={t}
              onClick={() => setTierFilter(t)}
              className={`rounded-ka px-3 py-1 text-xs transition-colors ${
                tierFilter === t ? "bg-forest text-ivory font-semibold" : "bg-cream/40 text-charcoal hover:bg-cream"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Accommodations Table */}
      <div className="overflow-hidden rounded-ka border border-charcoal/10 bg-ivory shadow-xs">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-charcoal/10 bg-cream/30 text-[11px] font-semibold uppercase tracking-wider text-charcoal/70">
            <tr>
              <th className="p-3.5">Lodge / Property</th>
              <th className="p-3.5">Ecosystem & County</th>
              <th className="p-3.5">Category & Tier</th>
              <th className="p-3.5">Rack Rates (PP)</th>
              <th className="p-3.5">Contract Status</th>
              <th className="p-3.5">Reservations Contact</th>
              <th className="p-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-charcoal/10">
            {filtered.map((item) => (
              <tr key={item.id} className="hover:bg-cream/15 transition-colors">
                <td className="p-3.5">
                  <p className="font-semibold text-forest text-sm">{item.name}</p>
                  <p className="text-[11px] text-charcoal/60">{item.roomsCount} Rooms / Tents</p>
                </td>
                <td className="p-3.5">
                  <p className="font-medium text-charcoal">{item.ecosystem}</p>
                  <p className="text-[11px] text-charcoal/60">County: {item.county}</p>
                </td>
                <td className="p-3.5">
                  <p className="text-charcoal">{item.type}</p>
                  <span className={`inline-block mt-1 rounded-ka px-2 py-0.5 text-[10px] ${getTierBadge(item.tier)}`}>
                    {item.tier}
                  </span>
                </td>
                <td className="p-3.5 font-mono">
                  <p className="text-forest font-semibold">High: {formatUsd(item.rackRateHighUsd)}</p>
                  <p className="text-charcoal/60 text-[11px]">Low: {formatUsd(item.rackRateLowUsd)}</p>
                </td>
                <td className="p-3.5">
                  <span
                    className={`rounded-ka px-2 py-0.5 text-[10px] font-semibold ${
                      item.partnerStatus === "Preferred Partner"
                        ? "bg-green/15 text-forest border border-green/30"
                        : "bg-charcoal/10 text-charcoal/80"
                    }`}
                  >
                    {item.partnerStatus}
                  </span>
                </td>
                <td className="p-3.5">
                  <p className="font-medium text-charcoal">{item.reservationContact}</p>
                  <p className="text-[11px] text-forest hover:underline">
                    <a href={`mailto:${item.reservationEmail}`}>{item.reservationEmail}</a>
                  </p>
                  <p className="text-[11px] text-charcoal/60">{item.phone}</p>
                </td>
                <td className="p-3.5 text-right space-x-2">
                  <button
                    onClick={() => alert(`Details for ${item.name}:\n\nAmenities: ${item.amenities.join(", ")}\nEmail: ${item.reservationEmail}`)}
                    className="rounded border border-charcoal/20 px-2 py-1 text-[11px] font-medium text-charcoal hover:bg-cream/40"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Accommodation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg rounded-ka border border-charcoal/15 bg-ivory p-6 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-charcoal/10 pb-3">
              <h2 className="font-serif text-lg font-bold text-forest">Add Partner Accommodation</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="rounded p-1 text-charcoal/60 hover:text-charcoal"
                aria-label="Close modal"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleAdd} className="mt-4 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-charcoal">Property / Camp Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Governors' Camp"
                  value={newAcc.name}
                  onChange={(e) => setNewAcc({ ...newAcc, name: e.target.value })}
                  className="mt-1 w-full rounded-ka border border-charcoal/20 bg-cream/20 p-2 focus:border-forest focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-charcoal">Property Type</label>
                  <select
                    value={newAcc.type}
                    onChange={(e) => setNewAcc({ ...newAcc, type: e.target.value as AccommodationType })}
                    className="mt-1 w-full rounded-ka border border-charcoal/20 bg-cream/20 p-2 focus:border-forest focus:outline-none"
                  >
                    <option value="Luxury Tented Camp">Luxury Tented Camp</option>
                    <option value="Safari Lodge">Safari Lodge</option>
                    <option value="Eco-Bush Camp">Eco-Bush Camp</option>
                    <option value="Treehouse Lodge">Treehouse Lodge</option>
                    <option value="Coastal Beach Resort">Coastal Beach Resort</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-charcoal">Tier</label>
                  <select
                    value={newAcc.tier}
                    onChange={(e) => setNewAcc({ ...newAcc, tier: e.target.value as AccommodationTier })}
                    className="mt-1 w-full rounded-ka border border-charcoal/20 bg-cream/20 p-2 focus:border-forest focus:outline-none"
                  >
                    <option value="Luxury">Luxury</option>
                    <option value="Mid-Range">Mid-Range</option>
                    <option value="Eco-Budget">Eco-Budget</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-charcoal">Ecosystem / Area</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Maasai Mara / Olare Motorogi"
                    value={newAcc.ecosystem}
                    onChange={(e) => setNewAcc({ ...newAcc, ecosystem: e.target.value })}
                    className="mt-1 w-full rounded-ka border border-charcoal/20 bg-cream/20 p-2 focus:border-forest focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-charcoal">County</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Narok"
                    value={newAcc.county}
                    onChange={(e) => setNewAcc({ ...newAcc, county: e.target.value })}
                    className="mt-1 w-full rounded-ka border border-charcoal/20 bg-cream/20 p-2 focus:border-forest focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-charcoal">High Season Rack (USD)</label>
                  <input
                    type="number"
                    value={newAcc.rackRateHighUsd}
                    onChange={(e) => setNewAcc({ ...newAcc, rackRateHighUsd: Number(e.target.value) })}
                    className="mt-1 w-full rounded-ka border border-charcoal/20 bg-cream/20 p-2 focus:border-forest focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-charcoal">Low Season Rack (USD)</label>
                  <input
                    type="number"
                    value={newAcc.rackRateLowUsd}
                    onChange={(e) => setNewAcc({ ...newAcc, rackRateLowUsd: Number(e.target.value) })}
                    className="mt-1 w-full rounded-ka border border-charcoal/20 bg-cream/20 p-2 focus:border-forest focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-charcoal">Reservation Contact Name</label>
                  <input
                    type="text"
                    placeholder="Contact person"
                    value={newAcc.reservationContact}
                    onChange={(e) => setNewAcc({ ...newAcc, reservationContact: e.target.value })}
                    className="mt-1 w-full rounded-ka border border-charcoal/20 bg-cream/20 p-2 focus:border-forest focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-charcoal">Reservation Email</label>
                  <input
                    type="email"
                    placeholder="reservations@lodge.co.ke"
                    value={newAcc.reservationEmail}
                    onChange={(e) => setNewAcc({ ...newAcc, reservationEmail: e.target.value })}
                    className="mt-1 w-full rounded-ka border border-charcoal/20 bg-cream/20 p-2 focus:border-forest focus:outline-none"
                  />
                </div>
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
                  Save Accommodation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
