import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/authz";
import { redirect } from "next/navigation";
import { createDailyRoom } from "@/lib/video/daily";
import { PLATFORM_FEE_RATE, TUTOR_EARNINGS_RATE } from "@/lib/payments";

export const dynamic = "force-dynamic";

async function activateBooking(formData: FormData) {
  "use server";
  const id = formData.get("id") as string;
  const admin = await requireRole("ADMIN");

  const booking = await prisma.booking.findUnique({ where: { id }, include: { payment: true } });
  if (!booking || booking.status !== "AWAITING_ACTIVATION") return;
  if (!booking.payment || booking.payment.status !== "PAID") return;

  const { roomName, roomUrl } = await createDailyRoom(booking.id);
  const grossUSD = Number(booking.priceUSD);
  const platformFeeUSD = Math.round(grossUSD * PLATFORM_FEE_RATE * 100) / 100;
  const tutorEarningsUSD = Math.round(grossUSD * TUTOR_EARNINGS_RATE * 100) / 100;

  await prisma.$transaction([
    prisma.sessionActivation.create({
      data: { bookingId: booking.id, activatedByUserId: admin.id, videoRoomName: roomName, videoRoomUrl: roomUrl },
    }),
    prisma.ledgerEntry.create({
      data: { bookingId: booking.id, tutorId: booking.tutorId, grossUSD, platformFeeUSD, tutorEarningsUSD },
    }),
    prisma.booking.update({ where: { id: booking.id }, data: { status: "ACTIVE" } }),
  ]);
}

export default async function AdminBookingsPage() {
  try {
    await requireRole("ADMIN");
  } catch {
    redirect("/login");
  }

  const bookings = await prisma.booking.findMany({
    include: { parent: { include: { user: true } }, tutor: { include: { user: true } }, payment: true, child: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <h1 className="text-3xl font-bold text-navy-900">Bookings &amp; activation</h1>
      <p className="mt-2 text-sm text-gray-600">
        A session only becomes joinable once payment is confirmed <strong>and</strong> you
        activate it here. Payment alone never unlocks the classroom.
      </p>
      <div className="mt-8 space-y-4">
        {bookings.map((b) => (
          <div key={b.id} className="card flex items-center justify-between">
            <div>
              <p className="font-heading font-bold">
                {b.child.firstName} with {b.tutor.user.name}
              </p>
              <p className="text-sm text-gray-600">
                Parent: {b.parent.user.name} · {b.type} · ${Number(b.priceUSD).toFixed(2)} ·{" "}
                {new Date(b.scheduledStart).toLocaleString()}
              </p>
              <p className="mt-1 text-xs text-gray-500">
                status: {b.status} · payment: {b.payment?.status ?? "none"}
              </p>
            </div>
            {b.status === "AWAITING_ACTIVATION" && b.payment?.status === "PAID" && (
              <form action={activateBooking}>
                <input type="hidden" name="id" value={b.id} />
                <button className="btn-primary text-sm">Activate session</button>
              </form>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
