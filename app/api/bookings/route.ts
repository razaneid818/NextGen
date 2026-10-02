import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireRole, AuthError } from "@/lib/authz";
import { getPaymentProvider } from "@/lib/payments";

const schema = z.object({
  childId: z.string(),
  tutorId: z.string(),
  type: z.enum(["DISCOVERY", "PAID"]),
  scheduledStart: z.string().datetime(),
  scheduledEnd: z.string().datetime(),
});

export async function POST(req: Request) {
  try {
    const user = await requireRole("PARENT");
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }
    const { childId, tutorId, type, scheduledStart, scheduledEnd } = parsed.data;

    const parentProfile = await prisma.parentProfile.findUnique({ where: { userId: user.id } });
    if (!parentProfile) {
      return NextResponse.json({ error: "No parent profile found." }, { status: 400 });
    }

    const child = await prisma.child.findFirst({ where: { id: childId, parentId: parentProfile.id } });
    if (!child) {
      return NextResponse.json({ error: "Child not found on this account." }, { status: 404 });
    }

    // Re-check approval status at booking time, not just at listing time — a tutor
    // who has since been de-approved must not become bookable via a stale page.
    const tutor = await prisma.tutorProfile.findFirst({ where: { id: tutorId, status: "APPROVED" } });
    if (!tutor) {
      return NextResponse.json({ error: "Tutor is not available for booking." }, { status: 404 });
    }

    const durationHours =
      (new Date(scheduledEnd).getTime() - new Date(scheduledStart).getTime()) / (1000 * 60 * 60);
    const priceUSD = type === "DISCOVERY" ? 0 : Number(tutor.hourlyRateUSD) * durationHours;

    const booking = await prisma.booking.create({
      data: {
        parentId: parentProfile.id,
        childId: child.id,
        tutorId: tutor.id,
        type,
        scheduledStart: new Date(scheduledStart),
        scheduledEnd: new Date(scheduledEnd),
        priceUSD,
        // Discovery sessions need no payment — they go straight to CONFIRMED.
        // Paid sessions wait for the tutor to confirm, then move to AWAITING_PAYMENT.
        status: type === "DISCOVERY" ? "CONFIRMED" : "REQUESTED",
      },
    });

    // For a paid booking, immediately set up a checkout so the parent can pay once
    // the tutor confirms — kept simple here by generating it up front.
    if (type === "PAID") {
      const provider = getPaymentProvider();
      const { checkoutUrl, providerRef } = await provider.createCheckout({
        bookingId: booking.id,
        amountUSD: priceUSD,
        description: `NextGen session with tutor ${tutor.id}`,
        returnUrl: `/parent/bookings/${booking.id}`,
      });

      await prisma.payment.create({
        data: {
          bookingId: booking.id,
          provider: provider.name,
          providerRef,
          amountUSD: priceUSD,
          status: "PENDING",
        },
      });

      return NextResponse.json({ booking, checkoutUrl }, { status: 201 });
    }

    return NextResponse.json({ booking }, { status: 201 });
  } catch (err) {
    if (err instanceof AuthError) {
      return NextResponse.json({ error: err.message }, { status: err.code === "UNAUTHENTICATED" ? 401 : 403 });
    }
    console.error(err);
    return NextResponse.json({ error: "Unexpected error creating booking." }, { status: 500 });
  }
}
