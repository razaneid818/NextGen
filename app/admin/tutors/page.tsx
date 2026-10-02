import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/authz";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

async function reviewTutor(formData: FormData) {
  "use server";
  const id = formData.get("id") as string;
  const decision = formData.get("decision") as "APPROVED" | "REJECTED";
  const admin = await requireRole("ADMIN");
  await prisma.tutorProfile.update({
    where: { id },
    data: { status: decision, reviewedAt: new Date(), reviewedByUserId: admin.id },
  });
}

export default async function AdminTutorsPage() {
  try {
    await requireRole("ADMIN");
  } catch {
    redirect("/login");
  }

  const tutors = await prisma.tutorProfile.findMany({
    include: { user: true },
    orderBy: { appliedAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <h1 className="text-3xl font-bold text-navy-900">Tutor applications</h1>
      <div className="mt-8 space-y-4">
        {tutors.map((t) => (
          <div key={t.id} className="card flex items-center justify-between">
            <div>
              <p className="font-heading font-bold">
                {t.user.name} <span className="text-sm text-gray-400">({t.user.email})</span>
              </p>
              <p className="mt-1 text-sm text-gray-600">{t.bio}</p>
              <p className="mt-1 text-xs text-gray-500">
                {t.subjects.join(", ")} · ${Number(t.hourlyRateUSD).toFixed(0)}/hr · status: {t.status}
              </p>
            </div>
            {t.status === "PENDING" && (
              <div className="flex gap-2">
                <form action={reviewTutor}>
                  <input type="hidden" name="id" value={t.id} />
                  <input type="hidden" name="decision" value="APPROVED" />
                  <button className="btn-primary text-sm">Approve</button>
                </form>
                <form action={reviewTutor}>
                  <input type="hidden" name="id" value={t.id} />
                  <input type="hidden" name="decision" value="REJECTED" />
                  <button className="btn-secondary text-sm">Reject</button>
                </form>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
