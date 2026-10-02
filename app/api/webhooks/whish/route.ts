import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getPaymentProvider } from "@/lib/payments";

/**
 * Whish Pay webhook receiver. Signature verification happens inside
 * provider.verifyWebhook() (lib/payments/whish/verifyWebhook.ts) — this route
 * never trusts a payload on its own. Currently throws via verifyWebhook until
 * Whish's real signature scheme is confirmed (see that file's TODO).
 */
export async function POST(req: Request) {
  const rawBody = await req.text();
  const headers = Object.fromEntries(req.headers.entries());

  const provider = getPaymentProvider();

  let result;
  try {
    result = await provider.verifyWebhook({ rawBody, headers });
  } catch (err) {
    console.error("Whish webhook verification failed:", err);
    return NextResponse.json({ error: "Webhook verification not available." }, { status: 503 });
  }

  if (!result.valid || !result.bookingId) {
    return NextResponse.json({ error: "Invalid webhook signature or payload." }, { status: 400 });
  }

  if (result.status === "PAID") {
    await prisma.$transaction([
      prisma.payment.update({
        where: { bookingId: result.bookingId },
        data: { status: "PAID", confirmedAt: new Date(), providerRef: result.providerRef },
      }),
      prisma.booking.update({
        where: { id: result.bookingId },
        data: { status: "AWAITING_ACTIVATION" },
      }),
    ]);
  } else if (result.status === "FAILED") {
    await prisma.payment.update({
      where: { bookingId: result.bookingId },
      data: { status: "FAILED" },
    });
  }

  return NextResponse.json({ received: true });
}
