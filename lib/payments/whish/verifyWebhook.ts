import type { VerifyWebhookInput, VerifyWebhookResult } from "../types";
import { getWhishConfig } from "./client";

/**
 * TODO: confirm against Whish Pay's merchant API documentation before going live.
 *
 * Once their webhook payload shape and signature scheme are confirmed, this should:
 *   1. Verify the signature header against `webhookSecret` (likely HMAC-SHA256 over
 *      the raw body — confirm the exact algorithm/header name with Whish Pay).
 *   2. Parse the confirmed payload to extract the merchant reference (bookingId),
 *      provider transaction reference, amount, and status.
 *
 * Until then, calling this throws loudly rather than fabricating a signature check.
 */
export async function verifyWebhook(
  _input: VerifyWebhookInput
): Promise<VerifyWebhookResult> {
  getWhishConfig();

  throw new Error(
    "Whish Pay verifyWebhook() is not yet implemented against a confirmed API contract. " +
      "Provide Whish Pay's webhook documentation (payload shape + signature scheme), then " +
      "implement real verification here."
  );
}
