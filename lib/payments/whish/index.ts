import type { PaymentProvider } from "../types";
import { createCheckout } from "./createCheckout";
import { verifyWebhook } from "./verifyWebhook";

export const whishProvider: PaymentProvider = {
  name: "whish",
  createCheckout,
  verifyWebhook,
};
