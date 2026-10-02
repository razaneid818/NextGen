import type { PaymentProvider } from "../types";

/**
 * Development/testing provider. Lets the booking → payment → activation → ledger
 * flow be built and exercised end to end without real Whish Pay credentials.
 *
 * `createCheckout` returns a local URL that immediately marks the payment PAID
 * (`/api/payments/mock-confirm`) — simulating a successful webhook — so the rest
 * of the pipeline (admin activation, ledger entries, payouts) can be developed
 * and tested now. Never selected when PAYMENT_PROVIDER=whish.
 */
export const mockProvider: PaymentProvider = {
  name: "mock",

  async createCheckout({ bookingId, amountUSD, returnUrl }) {
    const providerRef = `MOCK-${bookingId}-${Date.now()}`;
    const checkoutUrl = `/api/payments/mock-confirm?bookingId=${bookingId}&providerRef=${providerRef}&amount=${amountUSD}&returnUrl=${encodeURIComponent(returnUrl)}`;
    return { checkoutUrl, providerRef };
  },

  async verifyWebhook() {
    // The mock provider confirms payment synchronously via mock-confirm, not a webhook.
    return { valid: false };
  },
};
