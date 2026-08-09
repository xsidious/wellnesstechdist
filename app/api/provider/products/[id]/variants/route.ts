import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireApiSession } from "@/lib/api-auth";
import { getProviderProfileForUser, notFound, badRequest } from "@/lib/dashboard";

export const runtime = "nodejs";

type Ctx = { params: Promise<{ id: string }> };

const variantSchema = z.object({
  sku: z.string().trim().min(2).max(80),
  name: z.string().trim().min(1).max(120),
  priceCents: z.number().int().positive(),
  stock: z.number().int().min(0),
  attrs: z.record(z.string()).optional(),
});

export async function POST(req: Request, ctx: Ctx) {
  const gate = await requireApiSession(["PROVIDER", "ADMIN"]);
  if (!gate.ok) return gate.response;
  const { id: productId } = await ctx.params;

  const profile = await getProviderProfileForUser(gate.session.user.id);
  if (!profile) return notFound("Provider profile not found");

  const product = await prisma.product.findFirst({
    where: { id: productId, providerId: profile.id },
  });
  if (!product) return notFound();

  let body: z.infer<typeof variantSchema>;
  try {
    body = variantSchema.parse(await req.json());
  } catch {
    return badRequest("Invalid variant");
  }

  try {
    const variant = await prisma.productVariant.create({
      data: {
        productId,
        sku: body.sku,
        name: body.name,
        priceCents: body.priceCents,
        stock: body.stock,
        attrs: body.attrs || {},
      },
    });
    return NextResponse.json({ ok: true, variant }, { status: 201 });
  } catch {
    return badRequest("SKU may already exist");
  }
}
