import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import BookSessionForm from "./BookSessionForm";

export const dynamic = "force-dynamic";

export default async function TutorProfilePage({ params }: { params: { id: string } }) {
  const tutor = await prisma.tutorProfile.findFirst({
    where: { id: params.id, status: "APPROVED" },
    include: { user: true },
  });

  if (!tutor) notFound();

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-bold text-navy-900">{tutor.user.name}</h1>
      <p className="mt-3 text-gray-600">{tutor.bio}</p>
      <p className="mt-3 flex flex-wrap gap-1">
        {tutor.subjects.map((s) => (
          <span key={s} className="rounded-full bg-indigo-50 px-2 py-1 text-xs text-indigo">
            {s}
          </span>
        ))}
      </p>
      <p className="mt-3 font-semibold text-coral">${Number(tutor.hourlyRateUSD).toFixed(0)}/hr</p>

      <div className="card mt-10">
        <h2 className="text-lg font-bold">Book a session</h2>
        <BookSessionForm tutorId={tutor.id} hourlyRateUSD={Number(tutor.hourlyRateUSD)} />
      </div>
    </div>
  );
}
