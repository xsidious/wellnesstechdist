import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { kv } from "@/lib/kv";
import { requireApiSession } from "@/lib/api-auth";

export const runtime = "nodejs";

export async function GET() {
  const gate = await requireApiSession(["ADMIN"]);
  if (!gate.ok) return gate.response;

  const paidStatuses = ["PAID", "FULFILLING", "COMPLETED"] as const;

  const [ambassadors, tiers] = await Promise.all([
    prisma.ambassadorProfile.findMany({
      include: {
        user: { select: { email: true, name: true } },
        orders: {
          where: { status: { in: [...paidStatuses] } },
          select: { totalCents: true },
        },
        _count: { select: { orders: true, links: true } },
      },
      orderBy: { walletBalance: "desc" },
    }),
    prisma.commissionTier.findMany({ orderBy: { minOrderCents: "asc" } }),
  ]);

  const leaderboard = ambassadors.map((a, index) => ({
    rank: index + 1,
    id: a.id,
    code: a.code,
    email: a.user.email,
    name: a.user.name,
    walletBalanceCents: a.walletBalance,
    attributedGmvCents: a.orders.reduce((s, o) => s + o.totalCents, 0),
    orderCount: a._count.orders,
    linkCount: a._count.links,
  }));

  return NextResponse.json({
    leaderboard,
    tiers: tiers.map((t) => ({
      id: t.id,
      name: t.name,
      percentBps: t.percentBps,
      minOrderCents: t.minOrderCents,
      active: t.active,
    })),
  });
}

const tierSchema = z.object({
  action: z.literal("upsert_tier"),
  id: z.string().optional(),
  name: z.string().min(1).max(80),
  percentBps: z.number().int().min(0).max(10000),
  minOrderCents: z.number().int().min(0).default(0),
  active: z.boolean().optional().default(true),
});

export async function POST(req: Request) {
  const gate = await requireApiSession(["ADMIN"]);
  if (!gate.ok) return gate.response;

  let body: z.infer<typeof tierSchema>;
  try {
    body = tierSchema.parse(await req.json());
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const tier = body.id
    ? await prisma.commissionTier.update({
        where: { id: body.id },
        data: {
          name: body.name,
          percentBps: body.percentBps,
          minOrderCents: body.minOrderCents,
          active: body.active,
        },
      })
    : await prisma.commissionTier.create({
        data: {
          name: body.name,
          percentBps: body.percentBps,
          minOrderCents: body.minOrderCents,
          active: body.active,
        },
      });

  await kv.del("analytics:v1");

  return NextResponse.json({ ok: true, tier });
}
