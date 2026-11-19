export type PaymentProvider = "mpesa" | "card" | "bank_transfer";

export type PaymentStatus =
  | "pending"
  | "processing"
  | "paid"
  | "partially_paid"
  | "failed"
  | "refunded";

export type Currency = "USD" | "KES";

export interface PaymentTransaction {
  id: string;
  bookingId: string;
  customerId: string;
  amount: number;
  currency: Currency;
  provider: PaymentProvider;
  status: PaymentStatus;
  paymentReference: string;
  transactionId?: string;
  phoneNumber?: string; // For M-Pesa STK push
  description: string;
  createdAt: string;
  paidAt?: string;
  metadata?: Record<string, string | number | boolean>;
}

export interface PaymentInitiationRequest {
  bookingId: string;
  customerId: string;
  amount: number;
  currency: Currency;
  provider: PaymentProvider;
  customerPhone?: string;
  customerEmail: string;
  customerName: string;
}

export interface PaymentInitiationResult {
  success: boolean;
  paymentReference: string;
  status: PaymentStatus;
  message: string;
  checkoutUrl?: string; // For card gateway redirection
}
