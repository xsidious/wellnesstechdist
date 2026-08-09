import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireApiSession } from "@/lib/api-auth";
import { getProviderProfileForUser, notFound } from "@/lib/dashboard";

export const runtime = "nodejs";

export async function GET() {
  const gate = await requireApiSession(["PROVIDER", "ADMIN"]);
  if (!gate.ok) return gate.response;

  const profile = await getProviderProfileForUser(gate.session.user.id);
  if (!profile) return notFound("Provider profile not found");

  const [products, earnings, subOrders] = await Promise.all([
    prisma.product.findMany({
      where: { providerId: profile.id },
      include: { variants: true, images: { orderBy: { sortOrder: "asc" }, take: 1 } },
      orderBy: { updatedAt: "desc" },
    }),
    prisma.ledgerEntry.aggregate({
      where: {
        type: "PROVIDER_EARNING",
        status: { in: ["AVAILABLE", "PENDING"] },
        subOrder: { providerId: profile.id },
      },
      _sum: { amountCents: true },
    }),
    prisma.subOrder.count({
      where: { providerId: profile.id, status: { in: ["PAID", "FULFILLING"] } },
    }),
  ]);

  const stocks = products.flatMap((p) => p.variants.map((v) => v.stock));
  const totalUnits = stocks.reduce((s, n) => s + n, 0);
  const lowStock = products.flatMap((p) =>
    p.variants.filter((v) => v.stock <= 5).map((v) => ({ sku: v.sku, stock: v.stock, product: p.name })),
  );

  return NextResponse.json({
    profile: {
      id: profile.id,
      businessName: profile.businessName,
      approved: profile.approved,
      stripeAccountId: profile.stripeAccountId,
    },
    stockHealth: {
      totalUnits,
      productCount: products.length,
      lowStock,
      status: !profile.approved
        ? "unapproved"
        : lowStock.length
          ? "low"
          : totalUnits === 0
            ? "empty"
            : "healthy",
    },
    earningsCents: earnings._sum.amountCents ?? 0,
    openFulfillmentCount: subOrders,
    products: products.map((p) => ({
      id: p.id,
      slug: p.slug,
      name: p.name,
      category: p.category,
      active: p.active,
      imageUrl: p.images[0]?.url ?? null,
      stock: p.variants.reduce((s, v) => s + v.stock, 0),
      variants: p.variants.map((v) => ({
        id: v.id,
        sku: v.sku,
        name: v.name,
        priceCents: v.priceCents,
        stock: v.stock,
        attrs: v.attrs,
      })),
    })),
  });
}
