import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireApiSession } from "@/lib/api-auth";
import { getProviderProfileForUser, notFound, badRequest } from "@/lib/dashboard";

export const runtime = "nodejs";

type Ctx = { params: Promise<{ id: string }> };

const patchSchema = z.object({
  sku: z.string().trim().min(2).max(80).optional(),
  name: z.string().trim().min(1).max(120).optional(),
  priceCents: z.number().int().positive().optional(),
  stock: z.number().int().min(0).optional(),
  attrs: z.record(z.string()).optional(),
});

async function ownedVariant(userId: string, variantId: string) {
  const profile = await getProviderProfileForUser(userId);
  if (!profile) return null;
  return prisma.productVariant.findFirst({
    where: { id: variantId, product: { providerId: profile.id } },
    include: { product: true },
  });
}

export async function PATCH(req: Request, ctx: Ctx) {
  const gate = await requireApiSession(["PROVIDER", "ADMIN"]);
  if (!gate.ok) return gate.response;
  const { id } = await ctx.params;
  const variant = await ownedVariant(gate.session.user.id, id);
  if (!variant) return notFound();

  let body: z.infer<typeof patchSchema>;
  try {
    body = patchSchema.parse(await req.json());
  } catch {
    return badRequest("Invalid patch");
  }

  const updated = await prisma.productVariant.update({
    where: { id },
    data: body,
  });
  return NextResponse.json({ ok: true, variant: updated });
}

export async function DELETE(_req: Request, ctx: Ctx) {
  const gate = await requireApiSession(["PROVIDER", "ADMIN"]);
  if (!gate.ok) return gate.response;
  const { id } = await ctx.params;
  const variant = await ownedVariant(gate.session.user.id, id);
  if (!variant) return notFound();

  const count = await prisma.productVariant.count({
    where: { productId: variant.productId },
  });
  if (count <= 1) return badRequest("Product must keep at least one variant");

  await prisma.productVariant.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
