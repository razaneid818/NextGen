import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole, AuthError } from "@/lib/authz";
import { createDailyRoom } from "@/lib/video/daily";
import { PLATFORM_FEE_RATE, TUTOR_EARNINGS_RATE } from "@/lib/payments";

/**
 * THE gate. A session only becomes joinable through this route, and this route
 * only succeeds when:
 *   1. The caller is an authenticated ADMIN (requireRole).
 *   2. The booking's Payment.status === "PAID".
 *   3. The booking is currently AWAITING_ACTIVATION (not just "has a payment" —
 *      payment alone is never sufficient, and neither is a booking existing
 *      without payment).
 *
 * On success it provisions the video room, writes the SessionActivation row, a
 * LedgerEntry (80/20 split), and flips the booking to ACTIVE — all in one
 * transaction so there's never a state where one exists without the others.
 */
export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const admin = await requireRole("ADMIN");

    const booking = await prisma.booking.findUnique({
      where: { id: params.id },
      include: { payment: true },
    });

    if (!booking) {
      return NextResponse.json({ error: "Booking not found." }, { status: 404 });
    }

    if (booking.status !== "AWAITING_ACTIVATION") {
      return NextResponse.json(
        { error: `Booking is in status ${booking.status}, not AWAITING_ACTIVATION.` },
        { status: 409 }
      );
    }

    if (!booking.payment || booking.payment.status !== "PAID") {
      return NextResponse.json(
        { error: "Payment has not been confirmed as PAID for this booking." },
        { status: 409 }
      );
    }

    const { roomName, roomUrl } = await createDailyRoom(booking.id);

    const grossUSD = Number(booking.priceUSD);
    const platformFeeUSD = Math.round(grossUSD * PLATFORM_FEE_RATE * 100) / 100;
    const tutorEarningsUSD = Math.round(grossUSD * TUTOR_EARNINGS_RATE * 100) / 100;

    const [, , updatedBooking] = await prisma.$transaction([
      prisma.sessionActivation.create({
        data: {
          bookingId: booking.id,
          activatedByUserId: admin.id,
          videoRoomName: roomName,
          videoRoomUrl: roomUrl,
        },
      }),
      prisma.ledgerEntry.create({
        data: {
          bookingId: booking.id,
          tutorId: booking.tutorId,
          grossUSD,
          platformFeeUSD,
          tutorEarningsUSD,
        },
      }),
      prisma.booking.update({
        where: { id: booking.id },
        data: { status: "ACTIVE" },
      }),
    ]);

    return NextResponse.json({ booking: updatedBooking, roomUrl });
  } catch (err) {
    if (err instanceof AuthError) {
      return NextResponse.json({ error: err.message }, { status: err.code === "UNAUTHENTICATED" ? 401 : 403 });
    }
    console.error(err);
    return NextResponse.json({ error: "Unexpected error activating booking." }, { status: 500 });
  }
}
