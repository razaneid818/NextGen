import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole, AuthError } from "@/lib/authz";

/**
 * Returns the classroom room URL — but only to the parent or tutor on this exact
 * booking, and only when the booking is ACTIVE with a SessionActivation row.
 * This is the single choke point both the parent and tutor portals call before
 * rendering "Join classroom"; neither portal is trusted to gate this on its own.
 */
export async function GET(_req: Request, { params }: { params: { id: string } }) {
  try {
    const user = await requireRole("PARENT", "TUTOR");

    const booking = await prisma.booking.findUnique({
      where: { id: params.id },
      include: {
        sessionActivation: true,
        parent: true,
        tutor: true,
      },
    });

    if (!booking) {
      return NextResponse.json({ error: "Booking not found." }, { status: 404 });
    }

    const isParentOnBooking = user.role === "PARENT" && booking.parent.userId === user.id;
    const isTutorOnBooking = user.role === "TUTOR" && booking.tutor.userId === user.id;
    if (!isParentOnBooking && !isTutorOnBooking) {
      return NextResponse.json({ error: "You do not have access to this booking." }, { status: 403 });
    }

    if (booking.status !== "ACTIVE" || !booking.sessionActivation) {
      return NextResponse.json(
        { error: "This session has not been activated yet.", status: booking.status },
        { status: 409 }
      );
    }

    return NextResponse.json({ roomUrl: booking.sessionActivation.videoRoomUrl });
  } catch (err) {
    if (err instanceof AuthError) {
      return NextResponse.json({ error: err.message }, { status: err.code === "UNAUTHENTICATED" ? 401 : 403 });
    }
    console.error(err);
    return NextResponse.json({ error: "Unexpected error fetching classroom." }, { status: 500 });
  }
}
