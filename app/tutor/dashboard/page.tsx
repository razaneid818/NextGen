import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/authz";
import { redirect } from "next/navigation";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function TutorDashboardPage() {
  let user;
  try {
    user = await requireRole("TUTOR");
  } catch {
    redirect("/login");
  }

  const tutorProfile = await prisma.tutorProfile.findUnique({ where: { userId: user.id } });
  if (!tutorProfile) redirect("/login");

  const bookings = await prisma.booking.findMany({
    where: { tutorId: tutorProfile.id },
    include: { child: true, parent: { include: { user: true } } },
    orderBy: { scheduledStart: "desc" },
  });

  const ledgerEntries = await prisma.ledgerEntry.findMany({
    where: { tutorId: tutorProfile.id },
    orderBy: { createdAt: "desc" },
  });

  const totalEarned = ledgerEntries.reduce((sum, e) => sum + Number(e.tutorEarningsUSD), 0);
  const unpaid = ledgerEntries.filter((e) => !e.payoutId);
  const unpaidTotal = unpaid.reduce((sum, e) => sum + Number(e.tutorEarningsUSD), 0);

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <h1 className="text-3xl font-bold text-navy-900">Tutor dashboard</h1>
      <p className="mt-1 text-sm text-gray-500">Status: {tutorProfile.status}</p>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <div className="card">
          <p className="text-sm text-gray-500">Total earned (80% of session fees)</p>
          <p className="mt-1 text-2xl font-bold text-indigo">${totalEarned.toFixed(2)}</p>
        </div>
        <div className="card">
          <p className="text-sm text-gray-500">Awaiting payout</p>
          <p className="mt-1 text-2xl font-bold text-coral">${unpaidTotal.toFixed(2)}</p>
        </div>
      </div>

      <h2 className="mt-12 text-xl font-bold text-navy-900">Your bookings</h2>
      <div className="mt-4 space-y-4">
        {bookings.length === 0 && <p className="text-gray-500">No bookings yet.</p>}
        {bookings.map((b) => (
          <div key={b.id} className="card">
            <p className="font-heading font-bold">
              {b.child.firstName} — parent {b.parent.user.name}
            </p>
            <p className="text-sm text-gray-600">
              {new Date(b.scheduledStart).toLocaleString()} · {b.type} · status: {b.status}
            </p>
            {b.status === "ACTIVE" && (
              <Link href={`/tutor/bookings/${b.id}`} className="btn-primary mt-3 inline-block text-sm">
                Join classroom
              </Link>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
