import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/authz";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function ParentBookingClassroomPage({ params }: { params: { id: string } }) {
  let user;
  try {
    user = await requireRole("PARENT");
  } catch {
    redirect("/login");
  }

  const booking = await prisma.booking.findUnique({
    where: { id: params.id },
    include: { sessionActivation: true, parent: true, tutor: { include: { user: true } }, child: true },
  });

  if (!booking || booking.parent.userId !== user.id) {
    redirect("/parent/bookings");
  }

  const canJoin = booking.status === "ACTIVE" && booking.sessionActivation;

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-2xl font-bold text-navy-900">
        {booking.child.firstName}'s session with {booking.tutor.user.name}
      </h1>
      <p className="mt-2 text-sm text-gray-600">{new Date(booking.scheduledStart).toLocaleString()}</p>

      {canJoin ? (
        <div className="mt-8 aspect-video overflow-hidden rounded-xl2 border border-gray-200">
          <iframe
            src={booking.sessionActivation!.videoRoomUrl}
            allow="camera; microphone; fullscreen; display-capture"
            className="h-full w-full"
          />
        </div>
      ) : (
        <div className="card mt-8">
          <p className="text-gray-600">
            This session isn't active yet (current status: <strong>{booking.status}</strong>).
            Once payment is confirmed and our team activates the session, the classroom will
            appear here automatically.
          </p>
        </div>
      )}
    </div>
  );
}
