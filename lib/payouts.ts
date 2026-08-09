import { prisma } from "@/lib/db";
import { kv } from "@/lib/kv";

export type PayoutResult = { ok: true; paid: number; mode: "flagged" | "all" };

const FLAG_SET_KEY = "payout:flagged:ids";

export async function getFlaggedProviderIds(): Promise<string[]> {
  const ids = (await kv.get<string[]>(FLAG_SET_KEY)) ?? [];
  return Array.isArray(ids) ? ids : [];
}

export async function setProviderPayoutFlag(providerId: string, flagged: boolean) {
  const key = `payout:flag:${providerId}`;
  if (flagged) {
    await kv.set(key, "1", { ex: 60 * 60 * 24 * 7 });
    const ids = new Set(await getFlaggedProviderIds());
    ids.add(providerId);
    await kv.set(FLAG_SET_KEY, [...ids], { ex: 60 * 60 * 24 * 7 });
  } else {
    await kv.del(key);
    const ids = (await getFlaggedProviderIds()).filter((id) => id !== providerId);
    if (ids.length) await kv.set(FLAG_SET_KEY, ids, { ex: 60 * 60 * 24 * 7 });
    else await kv.del(FLAG_SET_KEY);
  }
}

/**
 * Mark AVAILABLE ledger rows as PAID.
 * When flaggedProvidersOnly is true, only PROVIDER_EARNING rows for flagged providers are paid
 * (ambassador commissions / admin fees are also paid in that run).
 * When false, all AVAILABLE rows are paid regardless of flags.
 */
export async function runPayouts(opts?: {
  flaggedProvidersOnly?: boolean;
}): Promise<PayoutResult> {
  const flaggedOnly = opts?.flaggedProvidersOnly ?? false;
  const mode: "flagged" | "all" = flaggedOnly ? "flagged" : "all";

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
  const flaggedList = await getFlaggedProviderIds();
  const flaggedProviders = new Set<string>();

  for (const providerId of new Set([...subOrders.map((s) => s.providerId), ...flaggedList])) {
    const flag = await kv.get<string>(`payout:flag:${providerId}`);
    if (flag) flaggedProviders.add(providerId);
  }

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

  if (mode === "flagged") {
    for (const providerId of flaggedProviders) {
      await setProviderPayoutFlag(providerId, false);
    }
  }

  return { ok: true, paid, mode };
}
