import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/authz";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function TutorBookingClassroomPage({ params }: { params: { id: string } }) {
  let user;
  try {
    user = await requireRole("TUTOR");
  } catch {
    redirect("/login");
  }

  const booking = await prisma.booking.findUnique({
    where: { id: params.id },
    include: { sessionActivation: true, tutor: true, child: true },
  });

  if (!booking || booking.tutor.userId !== user.id) {
    redirect("/tutor/dashboard");
  }

  const canJoin = booking.status === "ACTIVE" && booking.sessionActivation;

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-2xl font-bold text-navy-900">Session with {booking.child.firstName}</h1>
      {canJoin ? (
        <div className="mt-8 aspect-video overflow-hidden rounded-xl2 border border-gray-200">
          <iframe
            src={booking.sessionActivation!.videoRoomUrl}
            allow="camera; microphone; fullscreen; display-capture"
            className="h-full w-full"
          />
        </div>
      ) : (
        <p className="card mt-8 text-gray-600">
          Not active yet (status: {booking.status}).
        </p>
      )}
    </div>
  );
}
