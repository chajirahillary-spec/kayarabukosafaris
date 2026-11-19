import type { AccommodationTier, TransportType } from "@/lib/types";

export interface PricingCalculationInput {
  basePricePerPersonUsd: number;
  adults: number;
  children: number;
  tier: AccommodationTier;
  transport: TransportType;
  optionalExperiences: string[];
}

export interface PricingBreakdown {
  basePricePerPerson: number;
  adultsTotal: number;
  childrenTotal: number;
  tierSurchargePerPerson: number;
  transportSurchargeTotal: number;
  optionalExperiencesTotal: number;
  totalPriceUsd: number;
  depositAmountUsd: number;
  remainingBalanceUsd: number;
}

const TIER_MULTIPLIERS: Record<AccommodationTier, number> = {
  budget: 1.0,
  "mid-range": 1.35,
  luxury: 2.1,
};

const TRANSPORT_FLAT_SURCHARGE: Record<TransportType, number> = {
  "safari-van": 0,
  "land-cruiser": 250, // Per vehicle flat
  "fly-in": 600, // Per person flight supplement
};

const EXPERIENCE_COSTS: Record<string, number> = {
  balloon_safari: 450,
  night_game_drive: 85,
  guided_bush_walk: 50,
  maasai_village_visit: 40,
  dhow_sunset_cruise: 75,
  rhino_tracking: 110,
};

/**
 * Server-authoritative calculation of booking totals.
 * Never trust total prices computed on the client.
 */
export function calculateBookingPricing(
  input: PricingCalculationInput
): PricingBreakdown {
  const safeAdults = Math.max(1, input.adults);
  const safeChildren = Math.max(0, input.children);

  const tierMultiplier = TIER_MULTIPLIERS[input.tier] || 1.0;
  const adjustedPerPerson = Math.round(input.basePricePerPersonUsd * tierMultiplier);

  // Children pay 60% of adult base rate
  const adultSubtotal = adjustedPerPerson * safeAdults;
  const childRate = Math.round(adjustedPerPerson * 0.6);
  const childSubtotal = childRate * safeChildren;

  // Transport surcharges
  let transportFee = 0;
  if (input.transport === "land-cruiser") {
    transportFee = TRANSPORT_FLAT_SURCHARGE["land-cruiser"];
  } else if (input.transport === "fly-in") {
    transportFee = TRANSPORT_FLAT_SURCHARGE["fly-in"] * (safeAdults + safeChildren);
  }

  // Optional experiences
  let experienceFees = 0;
  for (const exp of input.optionalExperiences) {
    const cost = EXPERIENCE_COSTS[exp] || 50;
    experienceFees += cost * safeAdults;
  }

  const totalPriceUsd = adultSubtotal + childSubtotal + transportFee + experienceFees;
  // 30% deposit standard for Kenyan safari bookings
  const depositAmountUsd = Math.round(totalPriceUsd * 0.3);
  const remainingBalanceUsd = totalPriceUsd - depositAmountUsd;

  return {
    basePricePerPerson: adjustedPerPerson,
    adultsTotal: adultSubtotal,
    childrenTotal: childSubtotal,
    tierSurchargePerPerson: adjustedPerPerson - input.basePricePerPersonUsd,
    transportSurchargeTotal: transportFee,
    optionalExperiencesTotal: experienceFees,
    totalPriceUsd,
    depositAmountUsd,
    remainingBalanceUsd,
  };
}
