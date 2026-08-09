import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { kv } from "@/lib/kv";
import { requireApiSession } from "@/lib/api-auth";
import { badRequest } from "@/lib/dashboard";

export const runtime = "nodejs";

export async function GET() {
  const gate = await requireApiSession(["ADMIN"]);
  if (!gate.ok) return gate.response;

  const paidStatuses = ["PAID", "FULFILLING", "COMPLETED"] as const;

  const [ambassadors, tiers] = await Promise.all([
    prisma.ambassadorProfile.findMany({
      include: {
        user: { select: { id: true, email: true, name: true } },
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
    userId: a.userId,
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

const postSchema = z.discriminatedUnion("action", [
  z.object({
    action: z.literal("upsert_tier"),
    id: z.string().optional(),
    name: z.string().min(1).max(80),
    percentBps: z.number().int().min(0).max(10000),
    minOrderCents: z.number().int().min(0).default(0),
    active: z.boolean().optional().default(true),
  }),
  z.object({
    action: z.literal("update_ambassador"),
    ambassadorId: z.string().min(1),
    code: z.string().trim().min(2).max(40).optional(),
    walletAdjustCents: z.number().int().optional(),
  }),
]);

export async function POST(req: Request) {
  const gate = await requireApiSession(["ADMIN"]);
  if (!gate.ok) return gate.response;

  let body: z.infer<typeof postSchema>;
  try {
    body = postSchema.parse(await req.json());
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  if (body.action === "upsert_tier") {
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

  const amb = await prisma.ambassadorProfile.findUnique({
    where: { id: body.ambassadorId },
  });
  if (!amb) return badRequest("Ambassador not found");

  const data: { code?: string; walletBalance?: { increment: number } } = {};
  if (body.code) {
    const code = body.code.toUpperCase().replace(/[^A-Z0-9_-]/g, "");
    if (code.length < 2) return badRequest("Invalid code");
    const clash = await prisma.ambassadorProfile.findFirst({
      where: { code, NOT: { id: amb.id } },
    });
    if (clash) return badRequest("Code already in use");
    data.code = code;
  }
  if (typeof body.walletAdjustCents === "number" && body.walletAdjustCents !== 0) {
    data.walletBalance = { increment: body.walletAdjustCents };
  }

  const updated = await prisma.ambassadorProfile.update({
    where: { id: amb.id },
    data,
    include: { user: { select: { email: true, name: true } } },
  });

  if (typeof body.walletAdjustCents === "number" && body.walletAdjustCents !== 0) {
    await prisma.ledgerEntry.create({
      data: {
        ambassadorId: amb.id,
        type: "AMBASSADOR_COMMISSION",
        status: body.walletAdjustCents > 0 ? "AVAILABLE" : "CANCELLED",
        amountCents: Math.abs(body.walletAdjustCents),
        description: `Admin wallet adjustment (${body.walletAdjustCents > 0 ? "+" : "-"}${Math.abs(body.walletAdjustCents)}¢)`,
      },
    });
  }

  await kv.del("analytics:v1");
  return NextResponse.json({
    ok: true,
    ambassador: {
      id: updated.id,
      code: updated.code,
      walletBalanceCents: updated.walletBalance,
      email: updated.user.email,
    },
  });
}
