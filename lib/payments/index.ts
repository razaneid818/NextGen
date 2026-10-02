import type { PaymentProvider } from "./types";
import { mockProvider } from "./mock";
import { whishProvider } from "./whish";

/**
 * Selects the active payment provider from PAYMENT_PROVIDER. Defaults to "mock"
 * so the app runs in development without real Whish Pay credentials. Never
 * silently falls back to mock in production — set PAYMENT_PROVIDER=whish
 * explicitly once Whish credentials and API contract are confirmed.
 */
export function getPaymentProvider(): PaymentProvider {
  const selected = process.env.PAYMENT_PROVIDER ?? "mock";

  if (selected === "whish") return whishProvider;
  if (selected === "mock") return mockProvider;

  throw new Error(`Unknown PAYMENT_PROVIDER "${selected}". Use "mock" or "whish".`);
}

export const PLATFORM_FEE_RATE = 0.2; // 20% platform commission
export const TUTOR_EARNINGS_RATE = 0.8; // 80% to tutor
