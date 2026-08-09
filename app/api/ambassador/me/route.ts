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

  const paidStatuses = ["PAID", "FULFILLING", "COMPLETED"] as const;

  const [orders, commissionAgg, tiers, allAmbs] = await Promise.all([
    prisma.order.findMany({
      where: { ambassadorId: profile.id, status: { in: [...paidStatuses] } },
      select: { totalCents: true },
    }),
    prisma.ledgerEntry.aggregate({
      where: {
        ambassadorId: profile.id,
        type: "AMBASSADOR_COMMISSION",
        status: { in: ["AVAILABLE", "PAID", "PENDING"] },
      },
      _sum: { amountCents: true },
    }),
    prisma.commissionTier.findMany({
      where: { active: true },
      orderBy: { minOrderCents: "desc" },
    }),
    prisma.ambassadorProfile.findMany({
      select: { id: true, walletBalance: true },
      orderBy: { walletBalance: "desc" },
    }),
  ]);

  const attributedGmvCents = orders.reduce((s, o) => s + o.totalCents, 0);
  const tier =
    tiers.find((t) => attributedGmvCents >= t.minOrderCents) ||
    tiers[tiers.length - 1] ||
    null;
  const rank = allAmbs.findIndex((a) => a.id === profile.id) + 1;

  return NextResponse.json({
    profile: {
      id: profile.id,
      code: profile.code,
      walletBalanceCents: profile.walletBalance,
    },
    attributedGmvCents,
    orderCount: orders.length,
    commissionEarnedCents: commissionAgg._sum.amountCents ?? 0,
    rank: rank || null,
    ambassadorCount: allAmbs.length,
    tier: tier
      ? {
          id: tier.id,
          name: tier.name,
          percentBps: tier.percentBps,
          minOrderCents: tier.minOrderCents,
        }
      : null,
    shareUrl: `/shop?ref=${encodeURIComponent(profile.code)}`,
  });
}
