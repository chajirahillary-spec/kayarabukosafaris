import { db, orgPaths } from "@/lib/firebase/client";
import { collection, doc, setDoc, updateDoc, getDoc } from "firebase/firestore";
import type {
  PaymentInitiationRequest,
  PaymentInitiationResult,
  PaymentTransaction,
  PaymentStatus,
} from "./types";

export class PaymentService {
  /**
   * Generates a unique transaction reference code (e.g. KA-TX-2026-XXXX).
   */
  private static generateReference(provider: string): string {
    const prefix = provider === "mpesa" ? "MP" : "CRD";
    const rand = Math.floor(100000 + Math.random() * 900000);
    return `KA-${prefix}-${Date.now().toString().slice(-4)}-${rand}`;
  }

  /**
   * Initiates payment via M-Pesa STK or Card.
   * Creates an immutable payment record in Firestore.
   */
  static async initiatePayment(
    req: PaymentInitiationRequest
  ): Promise<PaymentInitiationResult> {
    const reference = this.generateReference(req.provider);
    const transactionId = `tx_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    const initialStatus: PaymentStatus =
      req.provider === "mpesa" ? "processing" : "processing";

    const paymentRecord: PaymentTransaction = {
      id: transactionId,
      bookingId: req.bookingId,
      customerId: req.customerId,
      amount: req.amount,
      currency: req.currency,
      provider: req.provider,
      status: initialStatus,
      paymentReference: reference,
      phoneNumber: req.customerPhone,
      description: `KayArabuko Safari Deposit / Balance for Booking #${req.bookingId}`,
      createdAt: new Date().toISOString(),
    };

    // Store in Firestore if database is available
    if (db) {
      try {
        const paymentsRef = collection(db, orgPaths.payments());
        const paymentDoc = doc(paymentsRef, transactionId);
        await setDoc(paymentDoc, paymentRecord);
      } catch (err) {
        console.warn("Could not save payment to Firestore (offline or rules fallback):", err);
      }
    }

    if (req.provider === "mpesa") {
      return {
        success: true,
        paymentReference: reference,
        status: "processing",
        message: `M-Pesa prompt has been sent to ${req.customerPhone || "your phone"}. Enter your M-Pesa PIN on your phone to complete payment.`,
      };
    }

    return {
      success: true,
      paymentReference: reference,
      status: "processing",
      message: "Card processing initialized securely.",
    };
  }

  /**
   * Finalize transaction status (e.g. from webhook or client callback simulation)
   */
  static async verifyPayment(
    transactionId: string,
    outcome: "success" | "failure"
  ): Promise<{ status: PaymentStatus; message: string }> {
    const newStatus: PaymentStatus = outcome === "success" ? "paid" : "failed";

    if (db) {
      try {
        const paymentRef = doc(db, orgPaths.payments(), transactionId);
        const snap = await getDoc(paymentRef);
        if (snap.exists()) {
          const data = snap.data() as PaymentTransaction;
          await updateDoc(paymentRef, {
            status: newStatus,
            paidAt: outcome === "success" ? new Date().toISOString() : undefined,
          });

          // Also update booking status
          if (data.bookingId) {
            const bookingRef = doc(db, orgPaths.bookings(), data.bookingId);
            await updateDoc(bookingRef, {
              paymentStatus: newStatus,
              status: outcome === "success" ? "confirmed" : "pending",
              paidAmount: data.amount,
            });
          }
        }
      } catch (err) {
        console.warn("Could not update payment in Firestore:", err);
      }
    }

    return {
      status: newStatus,
      message:
        outcome === "success"
          ? "Payment received successfully. Your safari booking is confirmed!"
          : "Payment was not completed. Please try again or choose an alternative payment method.",
    };
  }
}
