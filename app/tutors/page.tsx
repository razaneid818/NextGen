import { prisma } from "@/lib/prisma";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function TutorsPage() {
  const tutors = await prisma.tutorProfile.findMany({
    where: { status: "APPROVED" },
    include: { user: true },
    orderBy: { appliedAt: "asc" },
  });

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <h1 className="text-3xl font-bold text-navy-900">Meet our tutors</h1>
      <p className="mt-2 text-gray-600">
        Every tutor listed here has been personally reviewed and approved by the NextGen team.
      </p>

      {tutors.length === 0 ? (
        <p className="mt-12 text-gray-500">
          No approved tutors yet — check back soon, or book a free discovery session and we'll
          match your child with the right tutor directly.
        </p>
      ) : (
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {tutors.map((t) => (
            <div key={t.id} className="card">
              <h3 className="font-heading text-lg font-bold">{t.user.name}</h3>
              <p className="mt-2 text-sm text-gray-600">{t.bio}</p>
              <p className="mt-3 flex flex-wrap gap-1 text-xs">
                {t.subjects.map((s) => (
                  <span key={s} className="rounded-full bg-indigo-50 px-2 py-1 text-indigo">
                    {s}
                  </span>
                ))}
              </p>
              <p className="mt-3 font-semibold text-coral">${Number(t.hourlyRateUSD).toFixed(0)}/hr</p>
              <Link href={`/tutors/${t.id}`} className="btn-secondary mt-4 w-full text-sm">
                View profile
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
