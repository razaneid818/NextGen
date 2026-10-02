import { NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
  bio: z.string().min(20),
  subjects: z.array(z.string()).min(1),
  ageGroups: z.array(z.enum(["LITTLE_4_7", "YOUNG_7_12"])).min(1),
  hourlyRateUSD: z.number().positive(),
  videoIntroUrl: z.string().url().optional(),
});

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const { name, email, password, bio, subjects, ageGroups, hourlyRateUSD, videoIntroUrl } =
    parsed.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ error: "An account with that email already exists." }, { status: 409 });
  }

  const passwordHash = await bcrypt.hash(password, 10);

  // Tutor accounts start PENDING — they do not appear in the marketplace or become
  // bookable until an admin reviews and approves the application.
  const user = await prisma.user.create({
    data: {
      name,
      email,
      passwordHash,
      role: "TUTOR",
      tutorProfile: {
        create: {
          bio,
          subjects,
          ageGroups,
          hourlyRateUSD,
          videoIntroUrl,
          status: "PENDING",
        },
      },
    },
  });

  return NextResponse.json(
    { id: user.id, message: "Application submitted. We'll review it and email you." },
    { status: 201 }
  );
}
