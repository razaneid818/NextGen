import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireRole, AuthError } from "@/lib/authz";

const schema = z.object({
  firstName: z.string().min(1),
  ageGroup: z.enum(["LITTLE_4_7", "YOUNG_7_12"]),
  notes: z.string().optional(),
});

export async function GET() {
  try {
    const user = await requireRole("PARENT");
    const parentProfile = await prisma.parentProfile.findUnique({ where: { userId: user.id } });
    if (!parentProfile) return NextResponse.json({ children: [] });
    const children = await prisma.child.findMany({ where: { parentId: parentProfile.id } });
    return NextResponse.json({ children });
  } catch (err) {
    if (err instanceof AuthError) {
      return NextResponse.json({ error: err.message }, { status: err.code === "UNAUTHENTICATED" ? 401 : 403 });
    }
    return NextResponse.json({ error: "Unexpected error listing children." }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await requireRole("PARENT");
    const parsed = schema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const parentProfile = await prisma.parentProfile.findUnique({ where: { userId: user.id } });
    if (!parentProfile) {
      return NextResponse.json({ error: "No parent profile found." }, { status: 400 });
    }

    const child = await prisma.child.create({
      data: { ...parsed.data, parentId: parentProfile.id },
    });

    return NextResponse.json({ child }, { status: 201 });
  } catch (err) {
    if (err instanceof AuthError) {
      return NextResponse.json({ error: err.message }, { status: err.code === "UNAUTHENTICATED" ? 401 : 403 });
    }
    console.error(err);
    return NextResponse.json({ error: "Unexpected error adding child." }, { status: 500 });
  }
}
