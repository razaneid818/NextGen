import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/authz";
import { redirect } from "next/navigation";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function ParentBookingsPage() {
  let user;
  try {
    user = await requireRole("PARENT");
  } catch {
    redirect("/login");
  }

  const parentProfile = await prisma.parentProfile.findUnique({ where: { userId: user.id } });
  const bookings = parentProfile
    ? await prisma.booking.findMany({
        where: { parentId: parentProfile.id },
        include: { tutor: { include: { user: true } }, child: true, payment: true },
        orderBy: { scheduledStart: "desc" },
      })
    : [];

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <h1 className="text-3xl font-bold text-navy-900">Your bookings</h1>
      <div className="mt-8 space-y-4">
        {bookings.length === 0 && <p className="text-gray-500">No bookings yet.</p>}
        {bookings.map((b) => (
          <div key={b.id} className="card">
            <p className="font-heading font-bold">
              {b.child.firstName} with {b.tutor.user.name}
            </p>
            <p className="text-sm text-gray-600">
              {new Date(b.scheduledStart).toLocaleString()} · {b.type} · status: {b.status}
            </p>
            {b.status === "ACTIVE" && (
              <Link href={`/parent/bookings/${b.id}`} className="btn-primary mt-3 inline-block text-sm">
                Join classroom
              </Link>
            )}
            {b.status === "AWAITING_PAYMENT" && b.payment && (
              <p className="mt-2 text-sm text-coral-600">Payment pending.</p>
            )}
            {b.status === "AWAITING_ACTIVATION" && (
              <p className="mt-2 text-sm text-gray-500">
                Payment received — waiting for the session to be activated.
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
