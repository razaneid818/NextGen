import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * Development-only endpoint the MOCK payment provider redirects to, simulating a
 * successful Whish Pay checkout + webhook in one step. Marks the Payment PAID and
 * moves the Booking to AWAITING_ACTIVATION — it still requires a human admin to
 * activate it before any classroom access is granted. Never wired up when
 * PAYMENT_PROVIDER=whish.
 */
export async function GET(req: Request) {
  if ((process.env.PAYMENT_PROVIDER ?? "mock") !== "mock") {
    return NextResponse.json({ error: "Mock confirm is disabled when PAYMENT_PROVIDER=whish." }, { status: 403 });
  }

  const url = new URL(req.url);
  const bookingId = url.searchParams.get("bookingId");
  const providerRef = url.searchParams.get("providerRef");
  const returnUrl = url.searchParams.get("returnUrl") ?? "/";

  if (!bookingId || !providerRef) {
    return NextResponse.json({ error: "Missing bookingId or providerRef." }, { status: 400 });
  }

  const payment = await prisma.payment.findUnique({ where: { bookingId } });
  if (!payment || payment.providerRef !== providerRef) {
    return NextResponse.json({ error: "Payment record not found or reference mismatch." }, { status: 404 });
  }

  await prisma.$transaction([
    prisma.payment.update({
      where: { bookingId },
      data: { status: "PAID", confirmedAt: new Date() },
    }),
    prisma.booking.update({
      where: { id: bookingId },
      data: { status: "AWAITING_ACTIVATION" },
    }),
  ]);

  return NextResponse.redirect(new URL(returnUrl, req.url));
}
