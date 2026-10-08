import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { readUserId } from "@/lib/session";

export function rolesOf(raw: string) {
  try {
    const parsed = JSON.parse(raw) as string[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function currentUser() {
  const userId = await readUserId();
  if (!userId) return null;
  return prisma.user.findUnique({
    where: { id: userId },
    include: { org: true, credential: true, affiliate: true },
  });
}

export async function requireUser(nextPath = "") {
  const user = await currentUser();
  if (!user) {
    const next = nextPath.startsWith("/") && !nextPath.startsWith("//") ? `?next=${encodeURIComponent(nextPath)}` : "";
    redirect(`/login${next}`);
  }
  return user;
}
