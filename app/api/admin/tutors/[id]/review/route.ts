import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireRole, AuthError } from "@/lib/authz";

const schema = z.object({ decision: z.enum(["APPROVED", "REJECTED"]) });

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const admin = await requireRole("ADMIN");
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const tutor = await prisma.tutorProfile.update({
      where: { id: params.id },
      data: {
        status: parsed.data.decision,
        reviewedAt: new Date(),
        reviewedByUserId: admin.id,
      },
    });

    return NextResponse.json({ tutor });
  } catch (err) {
    if (err instanceof AuthError) {
      return NextResponse.json({ error: err.message }, { status: err.code === "UNAUTHENTICATED" ? 401 : 403 });
    }
    console.error(err);
    return NextResponse.json({ error: "Unexpected error reviewing tutor." }, { status: 500 });
  }
}
