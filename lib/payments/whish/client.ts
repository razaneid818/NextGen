/**
 * Thin config/HTTP wrapper for Whish Pay.
 *
 * IMPORTANT: the exact request/response shape for Whish Pay's merchant API is not
 * fabricated here. This file deliberately throws until real credentials AND the
 * provider's API documentation are available — see createCheckout.ts / verifyWebhook.ts
 * for the specific TODOs. Wiring fake endpoint shapes in would silently produce a
 * payment flow that looks complete but doesn't work against the real provider.
 */

export interface WhishConfig {
  apiKey: string;
  apiSecret: string;
  baseUrl: string;
  webhookSecret: string;
}

export function getWhishConfig(): WhishConfig {
  const apiKey = process.env.WHISH_API_KEY;
  const apiSecret = process.env.WHISH_API_SECRET;
  const baseUrl = process.env.WHISH_BASE_URL;
  const webhookSecret = process.env.WHISH_WEBHOOK_SECRET;

  if (!apiKey || !apiSecret || !baseUrl || !webhookSecret) {
    throw new Error(
      "Whish Pay is not configured. Set WHISH_API_KEY, WHISH_API_SECRET, WHISH_BASE_URL and " +
        "WHISH_WEBHOOK_SECRET (see .env.example), or set PAYMENT_PROVIDER=mock for development."
    );
  }

  return { apiKey, apiSecret, baseUrl, webhookSecret };
}
