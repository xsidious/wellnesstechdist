import { auth } from "@/lib/auth";
import type { Role } from "@prisma/client";
import { NextResponse } from "next/server";

export type AuthedSession = {
  user: {
    id: string;
    email: string;
    name?: string | null;
    role: Role;
  };
};

export async function requireApiSession(roles?: Role[]): Promise<
  | { ok: true; session: AuthedSession }
  | { ok: false; response: NextResponse }
> {
  const session = await auth();
  if (!session?.user?.id || !session.user.email) {
    return {
      ok: false,
      response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }

  const role = session.user.role;
  if (roles && roles.length > 0 && !roles.includes(role)) {
    return {
      ok: false,
      response: NextResponse.json({ error: "Forbidden" }, { status: 403 }),
    };
  }

  return {
    ok: true,
    session: {
      user: {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
        role,
      },
    },
  };
}
