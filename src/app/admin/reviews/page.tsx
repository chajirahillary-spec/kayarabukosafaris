"use client";

import { useState } from "react";
import { Star, Check } from "lucide-react";

export type ReviewStatus = "Published" | "Pending Approval" | "Hidden";

export interface SafariReview {
  id: string;
  guestName: string;
  country: string;
  safariTitle: string;
  travelDate: string;
  rating: number;
  title: string;
  body: string;
  isVerifiedBooking: boolean;
  isFeatured: boolean;
  status: ReviewStatus;
  operatorReply?: string;
  submittedAt: string;
}

const INITIAL_REVIEWS: SafariReview[] = [
  {
    id: "rev-1",
    guestName: "Charlotte & David Miller",
    country: "United Kingdom",
    safariTitle: "5-Day Maasai Mara & Lake Nakuru Safari",
    travelDate: "September 2026",
    rating: 5,
    title: "Life-changing experience from start to finish",
    body: "Our guide Joseph was unbelievable. His knowledge of animal behavior meant we witnessed a river crossing without fighting 50 other vehicles. The Land Cruiser was immaculate, cold drinks always ready, and the lodging choices were exceptional.",
    isVerifiedBooking: true,
    isFeatured: true,
    status: "Published",
    operatorReply: "Thank you Charlotte and David! Joseph was thrilled to guide you through the Mara crossing. Safe travels and karibu tena!",
    submittedAt: "2026-09-28",
  },
  {
    id: "rev-2",
    guestName: "Jean-Luc Dubois",
    country: "France",
    safariTitle: "4-Day Amboseli & Tsavo Safari",
    travelDate: "September 2026",
    rating: 5,
    title: "Elephants beneath Kilimanjaro — a photographer's dream",
    body: "Simon, our naturalist guide, positioned our 4x4 with such patience and respect for wildlife lighting. Waking up to Mount Kilimanjaro clear of clouds with huge tuskers walking across the foreground is an image I will cherish forever.",
    isVerifiedBooking: true,
    isFeatured: true,
    status: "Published",
    submittedAt: "2026-09-24",
  },
  {
    id: "rev-3",
    guestName: "Dr. Mark & Sophia Hansen",
    country: "Germany",
    safariTitle: "7-Day Kenya Safari & Diani Beach",
    travelDate: "August 2026",
    rating: 5,
    title: "Perfect blend of wildlife thrill and coastal restoration",
    body: "Transitioning from the dusty savannah game drives to the turquoise sands of Diani was completely seamless. KayArabuko handled all domestic logistics with clockwork precision.",
    isVerifiedBooking: true,
    isFeatured: false,
    status: "Published",
    submittedAt: "2026-09-12",
  },
  {
    id: "rev-4",
    guestName: "Elena Rostova",
    country: "Canada",
    safariTitle: "3-Day Amboseli Elephant Safari",
    travelDate: "October 2026",
    rating: 5,
    title: "Exceeded all expectations for our short itinerary",
    body: "With only 3 days in Kenya on a work layover, KayArabuko designed an Amboseli itinerary that felt relaxed yet packed with lion, cheetah, and hundreds of elephants.",
    isVerifiedBooking: true,
    isFeatured: false,
    status: "Pending Approval",
    submittedAt: "2026-10-04",
  },
];

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<SafariReview[]>(INITIAL_REVIEWS);
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [activeReplyId, setActiveReplyId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");

  const filtered = reviews.filter((r) => {
    if (statusFilter === "ALL") return true;
    return r.status === statusFilter;
  });

  const toggleFeatured = (id: string) => {
    setReviews(
      reviews.map((r) => (r.id === id ? { ...r, isFeatured: !r.isFeatured } : r))
    );
  };

  const updateStatus = (id: string, status: ReviewStatus) => {
    setReviews(
      reviews.map((r) => (r.id === id ? { ...r, status } : r))
    );
  };

  const handleSaveReply = (id: string) => {
    setReviews(
      reviews.map((r) => (r.id === id ? { ...r, operatorReply: replyText } : r))
    );
    setActiveReplyId(null);
    setReplyText("");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold text-forest">Guest Reviews & Moderation</h1>
          <p className="text-xs text-charcoal/70">
            Authentic guest testimonials, verified booking badges, operator responses, and website showcases.
          </p>
        </div>
        <div className="rounded-ka bg-gold/15 px-3 py-1.5 text-xs font-semibold text-charcoal border border-gold/30">
          Strict Policy: Only verified traveler reviews are published
        </div>
      </div>

      {/* KPI Counters */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-ka border border-charcoal/10 bg-ivory p-4 shadow-xs">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-charcoal/60">Total Reviews</p>
          <p className="mt-1 font-serif text-2xl font-bold text-forest">{reviews.length}</p>
          <p className="mt-0.5 text-[10px] text-charcoal/60">100% Verified bookings</p>
        </div>
        <div className="rounded-ka border border-charcoal/10 bg-ivory p-4 shadow-xs">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-charcoal/60">Average Rating</p>
          <p className="mt-1 font-serif text-2xl font-bold text-gold flex items-center gap-1.5">
            4.98 <Star className="h-5 w-5 fill-gold text-gold" />
          </p>
          <p className="mt-0.5 text-[10px] text-charcoal/60">5-star satisfaction</p>
        </div>
        <div className="rounded-ka border border-charcoal/10 bg-ivory p-4 shadow-xs">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-charcoal/60">Pending Moderation</p>
          <p className="mt-1 font-serif text-2xl font-bold text-forest">
            {reviews.filter((r) => r.status === "Pending Approval").length}
          </p>
          <p className="mt-0.5 text-[10px] text-charcoal/60">Awaiting operator sign-off</p>
        </div>
        <div className="rounded-ka border border-charcoal/10 bg-ivory p-4 shadow-xs">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-charcoal/60">Featured on Home</p>
          <p className="mt-1 font-serif text-2xl font-bold text-forest">
            {reviews.filter((r) => r.isFeatured).length}
          </p>
          <p className="mt-0.5 text-[10px] text-charcoal/60">Highlighted stories</p>
        </div>
      </div>

      {/* Status Filter */}
      <div className="flex items-center gap-2 text-xs">
        <span className="font-semibold text-charcoal/60">Filter Status:</span>
        {["ALL", "Published", "Pending Approval", "Hidden"].map((st) => (
          <button
            key={st}
            onClick={() => setStatusFilter(st)}
            className={`rounded-ka px-3 py-1.5 transition-colors ${
              statusFilter === st ? "bg-forest text-ivory font-semibold" : "bg-cream/40 text-charcoal hover:bg-cream"
            }`}
          >
            {st}
          </button>
        ))}
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {filtered.map((rev) => (
          <div
            key={rev.id}
            className="rounded-ka border border-charcoal/10 bg-ivory p-5 shadow-xs transition-colors hover:border-gold/40"
          >
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-0.5 text-gold">
                    {Array.from({ length: rev.rating }).map((_, i) => (
                      <Star key={i} className="h-3.5 w-3.5 fill-gold text-gold" />
                    ))}
                  </div>
                  <h3 className="font-serif text-base font-bold text-forest">{rev.title}</h3>
                  {rev.isVerifiedBooking && (
                    <span className="inline-flex items-center gap-1 rounded bg-green/15 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-forest border border-green/30">
                      <Check className="h-3 w-3 text-forest" /> Verified Guest
                    </span>
                  )}
                  {rev.isFeatured && (
                    <span className="rounded bg-gold/20 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-charcoal border border-gold/40">
                      Featured
                    </span>
                  )}
                </div>
                <p className="text-xs text-charcoal/70 mt-0.5">
                  <strong>{rev.guestName}</strong> ({rev.country}) • Took <em>{rev.safariTitle}</em> in {rev.travelDate}
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs">
                {rev.status === "Pending Approval" ? (
                  <button
                    onClick={() => updateStatus(rev.id, "Published")}
                    className="rounded bg-forest px-3 py-1 font-semibold text-ivory hover:bg-green"
                  >
                    Approve & Publish
                  </button>
                ) : (
                  <button
                    onClick={() => updateStatus(rev.id, rev.status === "Published" ? "Hidden" : "Published")}
                    className="rounded border border-charcoal/20 px-2.5 py-1 text-charcoal hover:bg-cream/40"
                  >
                    {rev.status === "Published" ? "Hide" : "Publish"}
                  </button>
                )}
                <button
                  onClick={() => toggleFeatured(rev.id)}
                  className={`rounded border px-2.5 py-1 ${
                    rev.isFeatured
                      ? "border-gold bg-gold/15 text-charcoal font-semibold"
                      : "border-charcoal/20 text-charcoal/70 hover:bg-cream/40"
                  }`}
                >
                  {rev.isFeatured ? (
                    <span className="inline-flex items-center gap-1">
                      <Star className="h-3 w-3 fill-gold text-gold" /> Featured
                    </span>
                  ) : (
                    "Feature"
                  )}
                </button>
              </div>
            </div>

            <p className="mt-3 text-xs leading-relaxed text-charcoal/90 italic">
              &ldquo;{rev.body}&rdquo;
            </p>

            {rev.operatorReply && (
              <div className="mt-3 rounded-ka bg-cream/40 border-l-2 border-forest p-3 text-xs">
                <p className="font-semibold text-forest">Operator Response from KayArabuko Safaris:</p>
                <p className="mt-1 text-charcoal/80">{rev.operatorReply}</p>
              </div>
            )}

            {!rev.operatorReply && activeReplyId === rev.id && (
              <div className="mt-3 space-y-2 border-t border-charcoal/10 pt-3">
                <textarea
                  rows={2}
                  placeholder="Write a warm, professional response to this guest..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="w-full rounded-ka border border-charcoal/20 bg-cream/20 p-2 text-xs focus:border-forest focus:outline-none"
                />
                <div className="flex justify-end gap-2 text-xs">
                  <button
                    onClick={() => setActiveReplyId(null)}
                    className="rounded px-3 py-1 text-charcoal hover:bg-cream/40"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleSaveReply(rev.id)}
                    className="rounded bg-forest px-3 py-1 font-semibold text-ivory hover:bg-green"
                  >
                    Publish Response
                  </button>
                </div>
              </div>
            )}

            {!rev.operatorReply && activeReplyId !== rev.id && (
              <div className="mt-3 border-t border-charcoal/10 pt-2 text-right">
                <button
                  onClick={() => {
                    setActiveReplyId(rev.id);
                    setReplyText("");
                  }}
                  className="text-xs font-semibold text-forest hover:underline"
                >
                  + Add Official Response
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
