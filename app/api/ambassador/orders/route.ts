import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireApiSession } from "@/lib/api-auth";
import { getAmbassadorProfileForUser, notFound } from "@/lib/dashboard";

export const runtime = "nodejs";

export async function GET() {
  const gate = await requireApiSession(["AMBASSADOR", "ADMIN"]);
  if (!gate.ok) return gate.response;
  const profile = await getAmbassadorProfileForUser(gate.session.user.id);
  if (!profile) return notFound("Ambassador profile not found");

  const orders = await prisma.order.findMany({
    where: { ambassadorId: profile.id },
    select: {
      id: true,
      email: true,
      status: true,
      totalCents: true,
      commissionCents: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return NextResponse.json({ orders });
}
