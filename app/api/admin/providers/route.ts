import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { kv } from "@/lib/kv";
import { requireApiSession } from "@/lib/api-auth";
import { getFlaggedProviderIds, setProviderPayoutFlag } from "@/lib/payouts";

export const runtime = "nodejs";

const LOW_STOCK = 5;

export async function GET() {
  const gate = await requireApiSession(["ADMIN"]);
  if (!gate.ok) return gate.response;

  const flaggedIds = new Set(await getFlaggedProviderIds());

  const providers = await prisma.providerProfile.findMany({
    include: {
      user: { select: { email: true, name: true } },
      products: {
        include: {
          variants: { select: { stock: true, sku: true } },
        },
      },
      _count: { select: { subOrders: true, products: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  // Refresh flag set from live keys (in case set drifted)
  for (const p of providers) {
    const flag = await kv.get<string>(`payout:flag:${p.id}`);
    if (flag) flaggedIds.add(p.id);
  }

  const rows = providers.map((p) => {
    const stocks = p.products.flatMap((pr) => pr.variants.map((v) => v.stock));
    const totalStock = stocks.reduce((s, n) => s + n, 0);
    const lowStockSkus = p.products.flatMap((pr) =>
      pr.variants.filter((v) => v.stock <= LOW_STOCK).map((v) => v.sku),
    );
    return {
      id: p.id,
      businessName: p.businessName,
      approved: p.approved,
      stripeAccountId: p.stripeAccountId,
      npi: p.npi,
      phone: p.phone,
      email: p.user.email,
      name: p.user.name,
      productCount: p._count.products,
      subOrderCount: p._count.subOrders,
      payoutFlagged: flaggedIds.has(p.id),
      stockHealth: {
        totalUnits: totalStock,
        lowStockCount: lowStockSkus.length,
        lowStockSkus: lowStockSkus.slice(0, 20),
        status: !p.approved
          ? "unapproved"
          : lowStockSkus.length > 0
            ? "low"
            : totalStock === 0
              ? "empty"
              : "healthy",
      },
      createdAt: p.createdAt,
    };
  });

  return NextResponse.json({ providers: rows });
}

const postSchema = z.object({
  providerId: z.string().min(1),
  approved: z.boolean().optional(),
  payoutFlag: z.boolean().optional(),
  stripeAccountId: z.string().nullable().optional(),
});

export async function POST(req: Request) {
  const gate = await requireApiSession(["ADMIN"]);
  if (!gate.ok) return gate.response;

  let body: z.infer<typeof postSchema>;
  try {
    body = postSchema.parse(await req.json());
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const data: { approved?: boolean; stripeAccountId?: string | null } = {};
  if (typeof body.approved === "boolean") data.approved = body.approved;
  if (body.stripeAccountId !== undefined) data.stripeAccountId = body.stripeAccountId;

  const existing = await prisma.providerProfile.findUnique({
    where: { id: body.providerId },
    include: { user: { select: { email: true } } },
  });
  if (!existing) {
    return NextResponse.json({ error: "Provider not found" }, { status: 404 });
  }

  // Avoid Prisma empty-update errors when only payoutFlag is sent
  const provider =
    Object.keys(data).length > 0
      ? await prisma.providerProfile.update({
          where: { id: body.providerId },
          data,
          include: { user: { select: { email: true } } },
        })
      : existing;

  if (typeof body.payoutFlag === "boolean") {
    await setProviderPayoutFlag(provider.id, body.payoutFlag);
  }

  await kv.del("analytics:v1");

  return NextResponse.json({
    ok: true,
    provider: {
      id: provider.id,
      businessName: provider.businessName,
      approved: provider.approved,
      stripeAccountId: provider.stripeAccountId,
      email: provider.user.email,
      payoutFlagged:
        typeof body.payoutFlag === "boolean"
          ? body.payoutFlag
          : !!(await kv.get(`payout:flag:${provider.id}`)),
    },
  });
}
