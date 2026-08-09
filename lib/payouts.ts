import { prisma } from "@/lib/db";
import { kv } from "@/lib/kv";

export type PayoutResult = { ok: true; paid: number; mode: "flagged" | "all" };

/**
 * Mark AVAILABLE ledger rows as PAID.
 * If any provider payout flags exist in KV, only pay those providers' PROVIDER_EARNING rows
 * (plus all AVAILABLE ambassador commissions / admin fees unless flaggedOnly).
 */
export async function runPayouts(opts?: {
  flaggedProvidersOnly?: boolean;
}): Promise<PayoutResult> {
  const flaggedOnly = opts?.flaggedProvidersOnly ?? false;

  // Scan recent provider IDs for flags (providers with AVAILABLE earnings)
  const providerEarnings = await prisma.ledgerEntry.findMany({
    where: { type: "PROVIDER_EARNING", status: "AVAILABLE" },
    select: { id: true, subOrderId: true },
    take: 500,
  });

  const subOrderIds = providerEarnings
    .map((e) => e.subOrderId)
    .filter((id): id is string => !!id);

  const subOrders = subOrderIds.length
    ? await prisma.subOrder.findMany({
        where: { id: { in: subOrderIds } },
        select: { id: true, providerId: true },
      })
    : [];

  const providerBySub = new Map(subOrders.map((s) => [s.id, s.providerId]));
  const flaggedProviders = new Set<string>();

  for (const providerId of new Set(subOrders.map((s) => s.providerId))) {
    const flag = await kv.get<string>(`payout:flag:${providerId}`);
    if (flag) flaggedProviders.add(providerId);
  }

  const mode: "flagged" | "all" =
    flaggedOnly || flaggedProviders.size > 0 ? "flagged" : "all";

  const available = await prisma.ledgerEntry.findMany({
    where: { status: "AVAILABLE" },
    take: 500,
  });

  let paid = 0;
  for (const entry of available) {
    if (mode === "flagged" && entry.type === "PROVIDER_EARNING") {
      const providerId = entry.subOrderId
        ? providerBySub.get(entry.subOrderId)
        : undefined;
      if (!providerId || !flaggedProviders.has(providerId)) continue;
    }

    await prisma.ledgerEntry.update({
      where: { id: entry.id },
      data: { status: "PAID", paidAt: new Date() },
    });

    if (entry.type === "AMBASSADOR_COMMISSION" && entry.ambassadorId) {
      await prisma.ambassadorProfile.update({
        where: { id: entry.ambassadorId },
        data: { walletBalance: { decrement: entry.amountCents } },
      });
    }

    await prisma.ledgerEntry.create({
      data: {
        orderId: entry.orderId,
        subOrderId: entry.subOrderId,
        ambassadorId: entry.ambassadorId,
        type: "PAYOUT",
        status: "PAID",
        amountCents: entry.amountCents,
        description: `Payout for ledger ${entry.id}`,
        paidAt: new Date(),
      },
    });
    paid += 1;
  }

  for (const providerId of flaggedProviders) {
    await kv.del(`payout:flag:${providerId}`);
  }

  return { ok: true, paid, mode };
}
