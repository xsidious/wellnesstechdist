/** Platform fee and ambassador commission helpers (basis points). */
export const PLATFORM_FEE_BPS = Number(process.env.PLATFORM_FEE_BPS || 1000); // 10%

export function calcPlatformFee(subtotalCents: number) {
  return Math.round((subtotalCents * PLATFORM_FEE_BPS) / 10000);
}

export function calcCommission(subtotalCents: number, percentBps: number) {
  return Math.round((subtotalCents * percentBps) / 10000);
}

export function providerNet(subtotalCents: number, feeCents: number, commissionCents: number) {
  // Fee + commission come from subtotal; provider receives remainder.
  return Math.max(0, subtotalCents - feeCents - commissionCents);
}
