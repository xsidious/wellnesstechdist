import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireApiSession } from "@/lib/api-auth";
import { getProviderProfileForUser, notFound } from "@/lib/dashboard";

export const runtime = "nodejs";

export async function GET() {
  const gate = await requireApiSession(["PROVIDER", "ADMIN"]);
  if (!gate.ok) return gate.response;
  const profile = await getProviderProfileForUser(gate.session.user.id);
  if (!profile) return notFound("Provider profile not found");

  const subOrders = await prisma.subOrder.findMany({
    where: { providerId: profile.id },
    include: {
      order: { select: { email: true, createdAt: true, status: true } },
      items: true,
    },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return NextResponse.json({
    subOrders: subOrders.map((s) => ({
      id: s.id,
      status: s.status,
      subtotalCents: s.subtotalCents,
      createdAt: s.createdAt,
      buyerEmail: s.order.email,
      orderStatus: s.order.status,
      items: s.items.map((i) => ({
        id: i.id,
        productName: i.productName,
        variantName: i.variantName,
        quantity: i.quantity,
        lineTotalCents: i.lineTotalCents,
      })),
    })),
  });
}
