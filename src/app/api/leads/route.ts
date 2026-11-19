import { NextResponse } from "next/server";
import { z } from "zod";
import { db, orgPaths } from "@/lib/firebase/client";
import { doc, setDoc } from "firebase/firestore";
import type { Lead } from "@/lib/bookings/types";

const leadSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  country: z.string().optional(),
  travelDates: z.string().optional(),
  travellerCount: z.number().int().positive().optional(),
  budgetRange: z.string().optional(),
  areaOfInterest: z.string().optional(),
  preferredLocation: z.string().optional(),
  interestedDestinations: z.array(z.string()).default([]),
  interestedStyles: z.array(z.any()).default([]),
  source: z
    .enum([
      "google",
      "instagram",
      "facebook",
      "tiktok",
      "whatsapp",
      "direct",
      "referral",
      "campaign",
    ])
    .default("direct"),
  notes: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const validated = leadSchema.parse(json);

    const leadId = `lead_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const leadRefNum = `KA-ENQ-${Math.floor(1000 + Math.random() * 9000)}`;

    const newLead: Lead = {
      id: leadId,
      leadReference: leadRefNum,
      name: validated.name,
      email: validated.email,
      phone: validated.phone,
      country: validated.country,
      travelDates: validated.travelDates,
      travellerCount: validated.travellerCount,
      budgetRange: validated.budgetRange,
      areaOfInterest: validated.areaOfInterest,
      preferredLocation: validated.preferredLocation,
      interestedDestinations: validated.interestedDestinations,
      interestedStyles: validated.interestedStyles,
      source: validated.source,
      status: "new",
      notes: validated.notes,
      createdAt: new Date().toISOString(),
    };

    if (db) {
      try {
        const leadDocRef = doc(db, orgPaths.leads(), leadId);
        await setDoc(leadDocRef, newLead);
      } catch (err) {
        console.warn("Could not save lead to Firestore (offline fallback):", err);
      }
    }

    return NextResponse.json({
      success: true,
      lead: newLead,
      message: "Experience enquiry received. Our team will connect with you shortly.",
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.issues },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Could not submit enquiry." },
      { status: 500 }
    );
  }
}
