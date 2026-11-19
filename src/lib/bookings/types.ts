import type { AccommodationTier, TransportType, SafariStyle } from "@/lib/types";
import type { PaymentStatus } from "@/lib/payments/types";

export type BookingStatus =
  | "inquiry"
  | "pending"
  | "confirmed"
  | "preparing"
  | "active"
  | "completed"
  | "cancelled";

export interface Booking {
  id: string;
  bookingReference: string; // e.g. KA-2026-0814
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  country: string;
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  specialRequests?: string;
  pickupLocation: string;

  safariSlug: string;
  safariTitle: string;
  departureDate: string;
  returnDate: string;
  durationDays: number;

  adults: number;
  children: number;

  tier: AccommodationTier;
  transport: TransportType;
  optionalExperiences: string[];

  // Pricing (Calculated securely)
  basePricePerPerson: number;
  totalPriceUsd: number;
  depositAmountUsd: number;
  paidAmountUsd: number;
  remainingBalanceUsd: number;
  paymentStatus: PaymentStatus;
  status: BookingStatus;

  // Operations assignments
  assignedGuideId?: string;
  assignedGuideName?: string;
  assignedGuidePhone?: string;
  assignedVehicleId?: string;
  assignedVehiclePlate?: string;
  assignedAccommodation?: string;

  createdAt: string;
  updatedAt: string;
}

export type LeadStatus =
  | "new"
  | "contacted"
  | "qualified"
  | "proposal_sent"
  | "negotiating"
  | "booked"
  | "lost";

export type LeadSource =
  | "google"
  | "instagram"
  | "facebook"
  | "tiktok"
  | "whatsapp"
  | "direct"
  | "referral"
  | "campaign";

export interface Lead {
  id: string;
  leadReference: string;
  name: string;
  email: string;
  phone?: string;
  country?: string;
  travelDates?: string;
  travellerCount?: number;
  budgetRange?: string;
  areaOfInterest?: string;
  preferredLocation?: string;
  interestedDestinations: string[];
  interestedStyles: SafariStyle[];
  source: LeadSource;
  status: LeadStatus;
  notes?: string;
  createdAt: string;
}

export interface SafariProposal {
  id: string;
  proposalNumber: string; // e.g. KA-2026-0001
  customerId: string;
  customerName: string;
  customerEmail: string;
  destinations: string[];
  durationDays: number;
  departureDate: string;
  travellers: {
    adults: number;
    children: number;
  };
  accommodationTier: AccommodationTier;
  transportType: TransportType;
  suggestedAccommodation: string[];
  includedActivities: string[];
  totalPriceUsd: number;
  depositRequiredUsd: number;
  terms: string[];
  expirationDate: string;
  status: "draft" | "sent" | "accepted" | "changes_requested" | "expired";
  createdAt: string;
}
