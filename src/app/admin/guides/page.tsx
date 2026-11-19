"use client";

import { useState } from "react";
import { Star, X } from "lucide-react";

export type KpsgaLevel = "Gold" | "Silver" | "Bronze";
export type GuideStatus = "Available" | "On Safari" | "Off Duty" | "Training";

export interface Guide {
  id: string;
  name: string;
  kpsgaLevel: KpsgaLevel;
  badgeNumber: string;
  languages: string[];
  experienceYears: number;
  specialties: string[];
  status: GuideStatus;
  currentAssignment?: string;
  rating: number;
  phone: string;
  bio: string;
}

const INITIAL_GUIDES: Guide[] = [
  {
    id: "g1",
    name: "Joseph Ole Lenku",
    kpsgaLevel: "Gold",
    badgeNumber: "KPSGA-G-0421",
    languages: ["English", "Swahili", "Maa", "German (Conversational)"],
    experienceYears: 16,
    specialties: ["Big Cat Behavior", "Great Migration Dynamics", "Maasai Cultural History", "Wildlife Tracking"],
    status: "On Safari",
    currentAssignment: "5-Day Maasai Mara & Nakuru (Eleanor Vance)",
    rating: 4.98,
    phone: "+254 722 410 892",
    bio: "Born and raised along the Siria Escarpment bordering the Maasai Mara. Holds KPSGA Gold qualification with over 16 years leading specialized photographic and private family expeditions across the Rift Valley.",
  },
  {
    id: "g2",
    name: "Simon Kimani",
    kpsgaLevel: "Silver",
    badgeNumber: "KPSGA-S-1184",
    languages: ["English", "Swahili", "French (Fluent)"],
    experienceYears: 11,
    specialties: ["Ornithology (Birding)", "Mount Kenya Ecosystem", "Flora & Ethnobotany", "Photographic Safaris"],
    status: "On Safari",
    currentAssignment: "4-Day Amboseli & Tsavo (Dr. Peterson)",
    rating: 4.95,
    phone: "+254 733 912 344",
    bio: "Senior naturalist specializing in East African birdlife with over 680 catalogued bird species. Frequently requested by European ornithological groups and avid wildlife photographers.",
  },
  {
    id: "g3",
    name: "Faith Chebet",
    kpsgaLevel: "Silver",
    badgeNumber: "KPSGA-S-1429",
    languages: ["English", "Swahili", "Spanish (Conversational)"],
    experienceYears: 8,
    specialties: ["Rhino Sanctuary Ecology", "Community Conservation", "Family Safaris with Children", "Samburu Special Five"],
    status: "Available",
    rating: 4.97,
    phone: "+254 718 204 551",
    bio: "Passionate conservation biologist and guide who previously worked with the Northern Rangelands Trust. Excellent with young travelers and wildlife education.",
  },
  {
    id: "g4",
    name: "David Kaptich",
    kpsgaLevel: "Silver",
    badgeNumber: "KPSGA-S-0982",
    languages: ["English", "Swahili", "Italian"],
    experienceYears: 14,
    specialties: ["Tsavo Ecosystem", "Elephant Migration Corridors", "Night Game Drives", "Bush Survival"],
    status: "Available",
    rating: 4.92,
    phone: "+254 721 883 109",
    bio: "Tsavo and Amboseli specialist with extensive tracking skills learned over two decades. Expert in arid landscape adaptation and big tusker movements.",
  },
  {
    id: "g5",
    name: "Hamisi Mwangome",
    kpsgaLevel: "Bronze",
    badgeNumber: "KPSGA-B-2311",
    languages: ["English", "Swahili", "Giriama", "Italian"],
    experienceYears: 6,
    specialties: ["Arabuko Sokoke Forest Endemics", "Marine Biology & Mangroves", "Swahili Coast Heritage", "Birding"],
    status: "Off Duty",
    rating: 4.89,
    phone: "+254 705 667 820",
    bio: "Coastal Kenya native and custodian of Arabuko Sokoke Forest biodiversity. Leads nature trails, butterfly sanctuary education, and marine safaris in Watamu.",
  },
  {
    id: "g6",
    name: "Jackson Lerionka",
    kpsgaLevel: "Bronze",
    badgeNumber: "KPSGA-B-2540",
    languages: ["English", "Swahili", "Maa"],
    experienceYears: 5,
    specialties: ["Mara River Crossings", "Walking Safaris", "Stargazing & Astronomy", "Cultural Immersion"],
    status: "Available",
    rating: 4.91,
    phone: "+254 740 128 903",
    bio: "Walking safari naturalist certified for wilderness on-foot guiding in private conservancies. Deep knowledge of indigenous medicinal herbs and traditional bush tracking.",
  },
];

export default function AdminGuidesPage() {
  const [guides, setGuides] = useState<Guide[]>(INITIAL_GUIDES);
  const [search, setSearch] = useState("");
  const [levelFilter, setLevelFilter] = useState<string>("ALL");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New guide form state
  const [newGuide, setNewGuide] = useState<Partial<Guide>>({
    name: "",
    kpsgaLevel: "Bronze",
    badgeNumber: "",
    languages: ["English", "Swahili"],
    experienceYears: 3,
    specialties: [],
    status: "Available",
    phone: "+254 ",
    bio: "",
  });

  const filteredGuides = guides.filter((g) => {
    const matchesSearch =
      g.name.toLowerCase().includes(search.toLowerCase()) ||
      g.badgeNumber.toLowerCase().includes(search.toLowerCase()) ||
      g.specialties.some((s) => s.toLowerCase().includes(search.toLowerCase())) ||
      g.languages.some((l) => l.toLowerCase().includes(search.toLowerCase()));

    const matchesLevel = levelFilter === "ALL" || g.kpsgaLevel === levelFilter;
    const matchesStatus = statusFilter === "ALL" || g.status === statusFilter;

    return matchesSearch && matchesLevel && matchesStatus;
  });

  const handleAddGuide = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGuide.name || !newGuide.badgeNumber) return;

    const created: Guide = {
      id: `g-${Date.now()}`,
      name: newGuide.name || "Guide Name",
      kpsgaLevel: (newGuide.kpsgaLevel as KpsgaLevel) || "Bronze",
      badgeNumber: newGuide.badgeNumber || "KPSGA-B-9999",
      languages: Array.isArray(newGuide.languages) ? newGuide.languages : ["English", "Swahili"],
      experienceYears: Number(newGuide.experienceYears) || 3,
      specialties: typeof newGuide.specialties === "string" 
        ? (newGuide.specialties as string).split(",").map((s) => s.trim()).filter(Boolean)
        : (newGuide.specialties || ["Bush Tracking"]),
      status: (newGuide.status as GuideStatus) || "Available",
      rating: 5.0,
      phone: newGuide.phone || "+254 700 000 000",
      bio: newGuide.bio || "Certified naturalist guide with KayArabuko Safaris.",
    };

    setGuides([created, ...guides]);
    setIsModalOpen(false);
    setNewGuide({
      name: "",
      kpsgaLevel: "Bronze",
      badgeNumber: "",
      languages: ["English", "Swahili"],
      experienceYears: 3,
      specialties: [],
      status: "Available",
      phone: "+254 ",
      bio: "",
    });
  };

  const getStatusBadge = (status: GuideStatus) => {
    switch (status) {
      case "Available":
        return "bg-green/15 text-forest border border-green/30";
      case "On Safari":
        return "bg-gold/20 text-charcoal border border-gold/40";
      case "Off Duty":
        return "bg-charcoal/10 text-charcoal/70 border border-charcoal/20";
      case "Training":
        return "bg-amber-100 text-amber-900 border border-amber-300";
    }
  };

  const getKpsgaBadge = (level: KpsgaLevel) => {
    switch (level) {
      case "Gold":
        return "bg-gradient-to-r from-amber-400 to-yellow-500 text-charcoal font-bold shadow-xs";
      case "Silver":
        return "bg-slate-300 text-slate-800 font-bold";
      case "Bronze":
        return "bg-amber-700/20 text-amber-900 font-medium";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold text-forest">Guides & Naturalists Roster</h1>
          <p className="text-xs text-charcoal/70">
            Kenya Professional Safari Guides Association (KPSGA) licensed professionals, specialties & duty roster.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 rounded-ka bg-forest px-4 py-2 text-xs font-semibold text-ivory hover:bg-green transition-colors"
        >
          <span>+ Add New Guide</span>
        </button>
      </div>

      {/* KPI Counters */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-ka border border-charcoal/10 bg-ivory p-4 shadow-xs">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-charcoal/60">Total Roster</p>
          <p className="mt-1 font-serif text-2xl font-bold text-forest">{guides.length}</p>
          <p className="mt-0.5 text-[10px] text-charcoal/60">100% KPSGA Certified</p>
        </div>
        <div className="rounded-ka border border-charcoal/10 bg-ivory p-4 shadow-xs">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-charcoal/60">Currently on Safari</p>
          <p className="mt-1 font-serif text-2xl font-bold text-gold">
            {guides.filter((g) => g.status === "On Safari").length}
          </p>
          <p className="mt-0.5 text-[10px] text-charcoal/60">Active in field</p>
        </div>
        <div className="rounded-ka border border-charcoal/10 bg-ivory p-4 shadow-xs">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-charcoal/60">Available Guides</p>
          <p className="mt-1 font-serif text-2xl font-bold text-green">
            {guides.filter((g) => g.status === "Available").length}
          </p>
          <p className="mt-0.5 text-[10px] text-charcoal/60">Ready for dispatch</p>
        </div>
        <div className="rounded-ka border border-charcoal/10 bg-ivory p-4 shadow-xs">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-charcoal/60">Average Guest Rating</p>
          <p className="mt-1 font-serif text-2xl font-bold text-forest inline-flex items-center gap-1.5">
            {(guides.reduce((acc, g) => acc + g.rating, 0) / guides.length).toFixed(2)}
            <Star className="h-5 w-5 fill-gold text-gold" />
          </p>
          <p className="mt-0.5 text-[10px] text-charcoal/60">Verified safari reviews</p>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-ka border border-charcoal/10 bg-ivory p-4 shadow-xs">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            placeholder="Search guide name, badge, language, or specialty..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-ka border border-charcoal/20 bg-cream/20 px-3 py-2 text-xs focus:border-forest focus:outline-none"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="text-charcoal/60 font-medium">KPSGA:</span>
          {["ALL", "Gold", "Silver", "Bronze"].map((level) => (
            <button
              key={level}
              onClick={() => setLevelFilter(level)}
              className={`rounded-ka px-3 py-1 text-xs transition-colors ${
                levelFilter === level
                  ? "bg-forest text-ivory font-semibold"
                  : "bg-cream/40 text-charcoal hover:bg-cream"
              }`}
            >
              {level}
            </button>
          ))}
          <span className="ml-2 text-charcoal/60 font-medium">Status:</span>
          {["ALL", "Available", "On Safari", "Off Duty"].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`rounded-ka px-3 py-1 text-xs transition-colors ${
                statusFilter === status
                  ? "bg-forest text-ivory font-semibold"
                  : "bg-cream/40 text-charcoal hover:bg-cream"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Guide Cards Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredGuides.map((guide) => (
          <div
            key={guide.id}
            className="flex flex-col justify-between rounded-ka border border-charcoal/10 bg-ivory p-5 shadow-xs transition-all hover:border-gold/50"
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-serif text-base font-bold text-forest">{guide.name}</h3>
                    <span className={`rounded px-1.5 py-0.5 text-[9px] uppercase tracking-wider ${getKpsgaBadge(guide.kpsgaLevel)}`}>
                      {guide.kpsgaLevel}
                    </span>
                  </div>
                  <p className="text-[11px] font-mono text-charcoal/60">{guide.badgeNumber}</p>
                </div>
                <span className={`rounded-ka px-2 py-0.5 text-[10px] font-semibold ${getStatusBadge(guide.status)}`}>
                  {guide.status}
                </span>
              </div>

              {guide.currentAssignment && (
                <div className="mt-2.5 rounded-ka bg-gold/10 p-2 text-[11px] text-charcoal">
                  <span className="font-semibold text-gold">Current:</span> {guide.currentAssignment}
                </div>
              )}

              <p className="mt-3 text-xs leading-relaxed text-charcoal/80 line-clamp-3">
                {guide.bio}
              </p>

              <div className="mt-4 space-y-2 border-t border-charcoal/10 pt-3 text-xs">
                <div>
                  <span className="font-semibold text-charcoal/70">Experience:</span> {guide.experienceYears} Years in Kenyan Parks
                </div>
                <div>
                  <span className="font-semibold text-charcoal/70">Languages:</span> {guide.languages.join(", ")}
                </div>
                <div>
                  <span className="font-semibold text-charcoal/70">Specialties:</span>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {guide.specialties.map((spec, i) => (
                      <span key={i} className="rounded bg-cream/70 px-1.5 py-0.5 text-[10px] text-charcoal/80">
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-5 flex items-center justify-between border-t border-charcoal/10 pt-3 text-xs">
              <div className="flex items-center gap-1.5 text-gold font-bold">
                <span>{guide.rating}</span>
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-3 w-3 fill-gold text-gold" />
                  ))}
                </div>
              </div>
              <a
                href={`tel:${guide.phone}`}
                className="font-medium text-forest hover:text-green hover:underline text-[11px]"
              >
                {guide.phone}
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Add Guide Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg rounded-ka border border-charcoal/15 bg-ivory p-6 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-charcoal/10 pb-3">
              <h2 className="font-serif text-lg font-bold text-forest">Add Naturalist / Guide to Roster</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="rounded p-1 text-charcoal/60 hover:text-charcoal"
                aria-label="Close modal"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleAddGuide} className="mt-4 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-charcoal">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kiprono Koech"
                  value={newGuide.name}
                  onChange={(e) => setNewGuide({ ...newGuide, name: e.target.value })}
                  className="mt-1 w-full rounded-ka border border-charcoal/20 bg-cream/20 p-2 focus:border-forest focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-charcoal">KPSGA Certification</label>
                  <select
                    value={newGuide.kpsgaLevel}
                    onChange={(e) => setNewGuide({ ...newGuide, kpsgaLevel: e.target.value as KpsgaLevel })}
                    className="mt-1 w-full rounded-ka border border-charcoal/20 bg-cream/20 p-2 focus:border-forest focus:outline-none"
                  >
                    <option value="Bronze">Bronze (Standard)</option>
                    <option value="Silver">Silver (Advanced)</option>
                    <option value="Gold">Gold (Master Naturalist)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-charcoal">KPSGA Badge Number</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. KPSGA-B-2890"
                    value={newGuide.badgeNumber}
                    onChange={(e) => setNewGuide({ ...newGuide, badgeNumber: e.target.value })}
                    className="mt-1 w-full rounded-ka border border-charcoal/20 bg-cream/20 p-2 focus:border-forest focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-charcoal">Years of Experience</label>
                  <input
                    type="number"
                    min="1"
                    value={newGuide.experienceYears}
                    onChange={(e) => setNewGuide({ ...newGuide, experienceYears: Number(e.target.value) })}
                    className="mt-1 w-full rounded-ka border border-charcoal/20 bg-cream/20 p-2 focus:border-forest focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-charcoal">Initial Status</label>
                  <select
                    value={newGuide.status}
                    onChange={(e) => setNewGuide({ ...newGuide, status: e.target.value as GuideStatus })}
                    className="mt-1 w-full rounded-ka border border-charcoal/20 bg-cream/20 p-2 focus:border-forest focus:outline-none"
                  >
                    <option value="Available">Available</option>
                    <option value="On Safari">On Safari</option>
                    <option value="Off Duty">Off Duty</option>
                    <option value="Training">Training</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-charcoal">Phone (Direct / WhatsApp)</label>
                <input
                  type="text"
                  placeholder="+254 7XX XXX XXX"
                  value={newGuide.phone}
                  onChange={(e) => setNewGuide({ ...newGuide, phone: e.target.value })}
                  className="mt-1 w-full rounded-ka border border-charcoal/20 bg-cream/20 p-2 focus:border-forest focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-charcoal">Specialties (comma separated)</label>
                <input
                  type="text"
                  placeholder="Big Cats, Birding, Photography, Walking Safaris"
                  value={typeof newGuide.specialties === "string" ? newGuide.specialties : newGuide.specialties?.join(", ")}
                  onChange={(e) => setNewGuide({ ...newGuide, specialties: e.target.value as any })}
                  className="mt-1 w-full rounded-ka border border-charcoal/20 bg-cream/20 p-2 focus:border-forest focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-charcoal">Bio & Field Background</label>
                <textarea
                  rows={3}
                  placeholder="Summary of experience, home ecosystem, and safari style..."
                  value={newGuide.bio}
                  onChange={(e) => setNewGuide({ ...newGuide, bio: e.target.value })}
                  className="mt-1 w-full rounded-ka border border-charcoal/20 bg-cream/20 p-2 focus:border-forest focus:outline-none"
                />
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
                  Save Guide to Roster
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
