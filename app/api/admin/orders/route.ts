import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireApiSession } from "@/lib/api-auth";
import type { Prisma } from "@prisma/client";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const gate = await requireApiSession(["ADMIN"]);
  if (!gate.ok) return gate.response;

  const { searchParams } = new URL(req.url);
  const take = Math.min(Number(searchParams.get("take") || 50), 100);
  const cursor = searchParams.get("cursor") || undefined;
  const status = searchParams.get("status") || undefined;
  const q = (searchParams.get("q") || "").trim();

  const where: Prisma.OrderWhereInput = {};
  if (status) {
    where.status = status as
      | "PENDING"
      | "PAID"
      | "FULFILLING"
      | "COMPLETED"
      | "CANCELLED"
      | "REFUNDED";
  }
  if (q) {
    where.OR = [
      { id: { contains: q } },
      { email: { contains: q, mode: "insensitive" } },
      { ambassadorCode: { contains: q, mode: "insensitive" } },
      { user: { name: { contains: q, mode: "insensitive" } } },
    ];
  }

  const orders = await prisma.order.findMany({
    where,
    include: {
      user: { select: { email: true, name: true } },
      ambassador: { select: { code: true } },
      subOrders: {
        include: {
          provider: { select: { businessName: true } },
          items: true,
        },
      },
      _count: { select: { items: true, ledgerEntries: true } },
    },
    orderBy: { createdAt: "desc" },
    take,
    ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
  });

  return NextResponse.json({
    orders: orders.map((o) => ({
      id: o.id,
      email: o.email,
      status: o.status,
      totalCents: o.totalCents,
      subtotalCents: o.subtotalCents,
      feeCents: o.feeCents,
      commissionCents: o.commissionCents,
      createdAt: o.createdAt,
      customerName: o.user?.name || null,
      ambassadorCode: o.ambassador?.code || o.ambassadorCode,
      itemCount: o._count.items,
      ledgerCount: o._count.ledgerEntries,
      subOrders: o.subOrders.map((s) => ({
        id: s.id,
        status: s.status,
        subtotalCents: s.subtotalCents,
        providerName: s.provider.businessName,
        items: s.items,
      })),
    })),
    nextCursor: orders.length === take ? orders[orders.length - 1]?.id : null,
  });
}
