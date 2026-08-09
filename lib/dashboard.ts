import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function getProviderProfileForUser(userId: string) {
  return prisma.providerProfile.findUnique({ where: { userId } });
}

export async function getAmbassadorProfileForUser(userId: string) {
  return prisma.ambassadorProfile.findUnique({ where: { userId } });
}

export function notFound(msg = "Not found") {
  return NextResponse.json({ error: msg }, { status: 404 });
}

export function badRequest(msg: string) {
  return NextResponse.json({ error: msg }, { status: 400 });
}

export function slugify(input: string) {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60);
}
