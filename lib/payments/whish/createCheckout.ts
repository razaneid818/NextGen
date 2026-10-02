import type { CreateCheckoutInput, CreateCheckoutResult } from "../types";
import { getWhishConfig } from "./client";

/**
 * TODO: confirm against Whish Pay's merchant API documentation before going live.
 *
 * This is deliberately NOT implemented with a guessed request/response shape.
 * Once Whish Pay's API docs (or merchant onboarding packet) are in hand, this
 * function should:
 *   1. POST to `${baseUrl}/<their checkout-session endpoint>` with the amount,
 *      currency, a merchant reference (bookingId), and the return URL.
 *   2. Authenticate per their documented scheme (likely an API key header,
 *      possibly combined with a signed payload — confirm before implementing).
 *   3. Return the hosted checkout URL and provider-side reference they give back.
 *
 * Until then, calling this throws loudly rather than returning a plausible-looking
 * but fabricated URL.
 */
export async function createCheckout(
  _input: CreateCheckoutInput
): Promise<CreateCheckoutResult> {
  getWhishConfig(); // validates env vars are present; throws a clear error otherwise

  throw new Error(
    "Whish Pay createCheckout() is not yet implemented against a confirmed API contract. " +
      "Provide Whish Pay's merchant API documentation, then implement the real request here. " +
      "Set PAYMENT_PROVIDER=mock to continue developing the booking/ledger flow in the meantime."
  );
}
