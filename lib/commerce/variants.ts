import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";

export type VariantAttrs = Record<string, string>;

/**
 * Resolve a variable product variation (e.g. Size/Color) to an explicit SKU row.
 * Matching is case-insensitive on attribute keys and values.
 */
export async function resolveVariantByAttrs(
  productId: string,
  attrs: VariantAttrs,
): Promise<{
  id: string;
  sku: string;
  name: string;
  priceCents: number;
  stock: number;
  attrs: Prisma.JsonValue;
} | null> {
  const variants = await prisma.productVariant.findMany({
    where: { productId },
  });

  const wanted = normalizeAttrs(attrs);
  const wantedKeys = Object.keys(wanted);
  if (wantedKeys.length === 0) return null;

  for (const v of variants) {
    const current = normalizeAttrs((v.attrs as VariantAttrs) || {});
    const match = wantedKeys.every((k) => current[k] === wanted[k]);
    if (match && Object.keys(current).length === wantedKeys.length) {
      return v;
    }
  }
  return null;
}

export async function resolveVariantBySku(sku: string) {
  return prisma.productVariant.findUnique({
    where: { sku },
    include: { product: true },
  });
}

function normalizeAttrs(attrs: VariantAttrs): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(attrs || {})) {
    if (v == null || v === "") continue;
    out[String(k).trim().toLowerCase()] = String(v).trim().toLowerCase();
  }
  return out;
}
