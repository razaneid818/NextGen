/**
 * Every payment provider NextGen could plug in implements this interface.
 * The booking flow and ledger code depend only on this — never on a specific
 * provider's request/response shape — so swapping MOCK for the real Whish
 * Pay integration later touches only the `whish/` folder.
 */

export interface CreateCheckoutInput {
  bookingId: string;
  amountUSD: number;
  description: string;
  /** Where the payer is redirected after completing (or abandoning) payment. */
  returnUrl: string;
}

export interface CreateCheckoutResult {
  /** URL to redirect the parent to in order to complete payment. */
  checkoutUrl: string;
  /** Provider-side reference for this attempt, stored on the Payment row. */
  providerRef: string;
}

export interface VerifyWebhookInput {
  /** Raw request body as received (needed for signature verification). */
  rawBody: string;
  /** Headers from the incoming webhook request. */
  headers: Record<string, string>;
}

export interface VerifyWebhookResult {
  valid: boolean;
  bookingId?: string;
  providerRef?: string;
  status?: "PAID" | "FAILED" | "REFUNDED";
  amountUSD?: number;
}

export interface PaymentProvider {
  name: string;
  createCheckout(input: CreateCheckoutInput): Promise<CreateCheckoutResult>;
  verifyWebhook(input: VerifyWebhookInput): Promise<VerifyWebhookResult>;
}
