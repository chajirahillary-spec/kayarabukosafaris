import { NextResponse } from "next/server";
import { z } from "zod";
import { safariBySlug } from "@/data/safaris";
import { calculateBookingPricing } from "@/lib/bookings/pricing";
import { db, orgPaths } from "@/lib/firebase/client";
import { doc, setDoc } from "firebase/firestore";
import type { Booking } from "@/lib/bookings/types";

const bookingSchema = z.object({
  safariSlug: z.string(),
  departureDate: z.string().min(1, "Departure date is required"),
  adults: z.number().int().min(1).max(20),
  children: z.number().int().min(0).max(15),
  tier: z.enum(["budget", "mid-range", "luxury"]),
  transport: z.enum(["safari-van", "land-cruiser", "fly-in"]),
  optionalExperiences: z.array(z.string()).default([]),
  customerName: z.string().min(2, "Name must be at least 2 characters"),
  customerEmail: z.string().email("Valid email required"),
  customerPhone: z.string().min(5, "Phone number required"),
  country: z.string().min(2, "Country required"),
  pickupLocation: z.string().min(2, "Pickup location required"),
  emergencyContact: z.object({
    name: z.string().min(2),
    relationship: z.string().min(2),
    phone: z.string().min(5),
  }),
  specialRequests: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const validated = bookingSchema.parse(json);

    const safari = safariBySlug(validated.safariSlug);
    if (!safari) {
      return NextResponse.json(
        { error: "Safari package not found" },
        { status: 404 }
      );
    }

    // Authoritative server-side pricing
    const pricing = calculateBookingPricing({
      basePricePerPersonUsd: safari.fromPriceUsd,
      adults: validated.adults,
      children: validated.children,
      tier: validated.tier,
      transport: validated.transport,
      optionalExperiences: validated.optionalExperiences,
    });

    const bookingRefNum = `KA-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const bookingId = `book_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const now = new Date().toISOString();

    // Calculate return date based on duration
    const depDateObj = new Date(validated.departureDate);
    const retDateObj = new Date(depDateObj);
    retDateObj.setDate(retDateObj.getDate() + safari.days);
    const returnDate = retDateObj.toISOString().split("T")[0];

    const booking: Booking = {
      id: bookingId,
      bookingReference: bookingRefNum,
      customerId: validated.customerEmail, // Fallback customer ID or auth UID
      customerName: validated.customerName,
      customerEmail: validated.customerEmail,
      customerPhone: validated.customerPhone,
      country: validated.country,
      emergencyContact: validated.emergencyContact,
      specialRequests: validated.specialRequests,
      pickupLocation: validated.pickupLocation,

      safariSlug: safari.slug,
      safariTitle: safari.title,
      departureDate: validated.departureDate,
      returnDate,
      durationDays: safari.days,

      adults: validated.adults,
      children: validated.children,

      tier: validated.tier,
      transport: validated.transport,
      optionalExperiences: validated.optionalExperiences,

      basePricePerPerson: pricing.basePricePerPerson,
      totalPriceUsd: pricing.totalPriceUsd,
      depositAmountUsd: pricing.depositAmountUsd,
      paidAmountUsd: 0,
      remainingBalanceUsd: pricing.totalPriceUsd,
      paymentStatus: "pending",
      status: "pending",

      createdAt: now,
      updatedAt: now,
    };

    if (db) {
      try {
        const bookingDocRef = doc(db, orgPaths.bookings(), bookingId);
        await setDoc(bookingDocRef, booking);
      } catch (err) {
        console.warn("Firestore write skipped (local/rules fallback):", err);
      }
    }

    return NextResponse.json({
      success: true,
      booking,
      pricing,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.issues },
        { status: 400 }
      );
    }
    console.error("Booking creation error:", error);
    return NextResponse.json(
      { error: "Could not create booking. Please try again." },
      { status: 500 }
    );
  }
}
