import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/authz";
import { redirect } from "next/navigation";
import AddChildForm from "./AddChildForm";

export const dynamic = "force-dynamic";

export default async function ParentChildrenPage() {
  let user;
  try {
    user = await requireRole("PARENT");
  } catch {
    redirect("/login");
  }

  const parentProfile = await prisma.parentProfile.findUnique({ where: { userId: user.id } });
  const children = parentProfile
    ? await prisma.child.findMany({ where: { parentId: parentProfile.id } })
    : [];

  return (
    <div className="mx-auto max-w-2xl px-6 py-16">
      <h1 className="text-3xl font-bold text-navy-900">Your children</h1>
      <div className="mt-6 space-y-3">
        {children.map((c) => (
          <div key={c.id} className="card">
            <p className="font-heading font-bold">{c.firstName}</p>
            <p className="text-sm text-gray-500">{c.ageGroup.replace("_", " ")}</p>
          </div>
        ))}
      </div>
      <h2 className="mt-10 text-xl font-bold text-navy-900">Add a child</h2>
      <AddChildForm />
    </div>
  );
}
