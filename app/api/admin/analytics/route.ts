import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { kv } from "@/lib/kv";
import { requireApiSession } from "@/lib/api-auth";

export const runtime = "nodejs";

const CACHE_KEY = "analytics:v1";
const CACHE_TTL = 60;

export async function GET() {
  const gate = await requireApiSession(["ADMIN"]);
  if (!gate.ok) return gate.response;

  const cached = await kv.get<{
    gmvCents: number;
    platformFeesCents: number;
    pendingProviderPayoutsCents: number;
    ambassador: {
      activeCount: number;
      totalCommissionPaidCents: number;
      totalWalletCents: number;
      top: { id: string; code: string; attributedGmvCents: number; orders: number }[];
    };
    ordersPaid: number;
    cachedAt: string;
  }>(CACHE_KEY);

  if (cached) {
    return NextResponse.json({ ...cached, cache: "hit" });
  }

  const paidStatuses = ["PAID", "FULFILLING", "COMPLETED"] as const;

  const [gmvAgg, feeAgg, payoutAgg, ordersPaid, ambassadors, commissionPaid] =
    await Promise.all([
      prisma.order.aggregate({
        where: { status: { in: [...paidStatuses] } },
        _sum: { totalCents: true },
      }),
      prisma.ledgerEntry.aggregate({
        where: {
          type: "ADMIN_FEE",
          status: { in: ["AVAILABLE", "PAID"] },
        },
        _sum: { amountCents: true },
      }),
      prisma.ledgerEntry.aggregate({
        where: { type: "PROVIDER_EARNING", status: "AVAILABLE" },
        _sum: { amountCents: true },
      }),
      prisma.order.count({ where: { status: { in: [...paidStatuses] } } }),
      prisma.ambassadorProfile.findMany({
        select: {
          id: true,
          code: true,
          walletBalance: true,
          _count: { select: { orders: true } },
          orders: {
            where: { status: { in: [...paidStatuses] } },
            select: { totalCents: true },
          },
        },
        orderBy: { walletBalance: "desc" },
        take: 10,
      }),
      prisma.ledgerEntry.aggregate({
        where: {
          type: "AMBASSADOR_COMMISSION",
          status: { in: ["AVAILABLE", "PAID"] },
        },
        _sum: { amountCents: true },
      }),
    ]);

  const top = ambassadors.map((a) => ({
    id: a.id,
    code: a.code,
    attributedGmvCents: a.orders.reduce((s, o) => s + o.totalCents, 0),
    orders: a._count.orders,
  }));

  const payload = {
    gmvCents: gmvAgg._sum.totalCents ?? 0,
    platformFeesCents: feeAgg._sum.amountCents ?? 0,
    pendingProviderPayoutsCents: payoutAgg._sum.amountCents ?? 0,
    ambassador: {
      activeCount: await prisma.ambassadorProfile.count(),
      totalCommissionPaidCents: commissionPaid._sum.amountCents ?? 0,
      totalWalletCents: ambassadors.reduce((s, a) => s + a.walletBalance, 0),
      top,
    },
    ordersPaid,
    cachedAt: new Date().toISOString(),
  };

  await kv.set(CACHE_KEY, payload, { ex: CACHE_TTL });
  return NextResponse.json({ ...payload, cache: "miss" });
}
