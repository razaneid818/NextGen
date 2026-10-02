import { auth } from "@/auth";
import type { Role } from "@prisma/client";

/**
 * Server-side role gate. Every protected route handler / server component calls
 * this — role checks must never live only in the UI. Throws a typed error the
 * caller turns into a 401/403 response or redirect.
 */
export async function requireRole(...allowed: Role[]) {
  const session = await auth();
  if (!session?.user) {
    throw new AuthError("UNAUTHENTICATED", "You must be signed in.");
  }
  if (!allowed.includes(session.user.role)) {
    throw new AuthError("FORBIDDEN", "You do not have access to this resource.");
  }
  return session.user;
}

export class AuthError extends Error {
  code: "UNAUTHENTICATED" | "FORBIDDEN";
  constructor(code: "UNAUTHENTICATED" | "FORBIDDEN", message: string) {
    super(message);
    this.code = code;
  }
}
