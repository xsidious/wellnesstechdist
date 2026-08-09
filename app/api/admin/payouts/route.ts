import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireApiSession } from "@/lib/api-auth";
import { getFlaggedProviderIds, runPayouts } from "@/lib/payouts";
import { kv } from "@/lib/kv";

export const runtime = "nodejs";

export async function GET() {
  const gate = await requireApiSession(["ADMIN"]);
  if (!gate.ok) return gate.response;

  const [available, recentPaid, flaggedIds] = await Promise.all([
    prisma.ledgerEntry.findMany({
      where: { status: "AVAILABLE" },
      orderBy: { createdAt: "desc" },
      take: 100,
      include: {
        order: { select: { id: true, email: true } },
        ambassador: { select: { code: true } },
        subOrder: { select: { provider: { select: { id: true, businessName: true } } } },
      },
    }),
    prisma.ledgerEntry.findMany({
      where: { type: "PAYOUT", status: "PAID" },
      orderBy: { paidAt: "desc" },
      take: 30,
      include: {
        order: { select: { id: true, email: true } },
        ambassador: { select: { code: true } },
      },
    }),
    getFlaggedProviderIds(),
  ]);

  const byType = available.reduce(
    (acc, row) => {
      acc[row.type] = (acc[row.type] || 0) + row.amountCents;
      return acc;
    },
    {} as Record<string, number>,
  );

  return NextResponse.json({
    summary: {
      availableCount: available.length,
      availableCents: available.reduce((s, r) => s + r.amountCents, 0),
      byType,
      flaggedProviderIds: flaggedIds,
    },
    available: available.map((e) => ({
      id: e.id,
      type: e.type,
      status: e.status,
      amountCents: e.amountCents,
      description: e.description,
      createdAt: e.createdAt,
      orderId: e.orderId,
      orderEmail: e.order?.email ?? null,
      ambassadorCode: e.ambassador?.code ?? null,
      providerName: e.subOrder?.provider.businessName ?? null,
      providerId: e.subOrder?.provider.id ?? null,
    })),
    recentPayouts: recentPaid.map((e) => ({
      id: e.id,
      amountCents: e.amountCents,
      description: e.description,
      paidAt: e.paidAt,
      orderId: e.orderId,
      orderEmail: e.order?.email ?? null,
      ambassadorCode: e.ambassador?.code ?? null,
    })),
  });
}

export async function POST(req: Request) {
  const gate = await requireApiSession(["ADMIN"]);
  if (!gate.ok) return gate.response;

  let flaggedProvidersOnly = false;
  try {
    const body = await req.json();
    flaggedProvidersOnly = !!body?.flaggedProvidersOnly;
  } catch {
    /* empty body ok */
  }

  try {
    const result = await runPayouts({ flaggedProvidersOnly });
    await kv.del("analytics:v1");
    return NextResponse.json(result);
  } catch (e) {
    console.error("admin payouts failed", e);
    return NextResponse.json({ error: "Payouts failed" }, { status: 500 });
  }
}
