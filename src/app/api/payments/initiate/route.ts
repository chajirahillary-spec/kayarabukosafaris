import { NextResponse } from "next/server";
import { z } from "zod";
import { PaymentService } from "@/lib/payments/service";

const paymentInitSchema = z.object({
  bookingId: z.string().min(1),
  customerId: z.string().min(1),
  amount: z.number().positive(),
  currency: z.enum(["USD", "KES"]),
  provider: z.enum(["mpesa", "card", "bank_transfer"]),
  customerPhone: z.string().optional(),
  customerEmail: z.string().email(),
  customerName: z.string().min(1),
});

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const validated = paymentInitSchema.parse(json);

    const result = await PaymentService.initiatePayment(validated);

    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid payment request", details: error.issues },
        { status: 400 }
      );
    }
    console.error("Payment initiation error:", error);
    return NextResponse.json(
      { error: "Payment initiation failed. Please try again." },
      { status: 500 }
    );
  }
}
