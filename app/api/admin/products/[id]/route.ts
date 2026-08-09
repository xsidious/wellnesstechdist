import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireApiSession } from "@/lib/api-auth";
import { badRequest, notFound } from "@/lib/dashboard";

export const runtime = "nodejs";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: Request, ctx: Ctx) {
  const gate = await requireApiSession(["ADMIN"]);
  if (!gate.ok) return gate.response;
  const { id } = await ctx.params;

  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      variants: true,
      images: true,
      provider: { select: { id: true, businessName: true, approved: true } },
    },
  });
  if (!product) return notFound();
  return NextResponse.json({ product });
}

const patchSchema = z.object({
  name: z.string().trim().min(2).max(200).optional(),
  description: z.string().trim().min(10).max(5000).optional(),
  category: z.string().trim().min(2).max(80).optional(),
  active: z.boolean().optional(),
  variants: z
    .array(
      z.object({
        id: z.string().optional(),
        sku: z.string().trim().min(2).max(80),
        name: z.string().trim().min(1).max(120),
        priceCents: z.number().int().positive(),
        stock: z.number().int().min(0),
      }),
    )
    .optional(),
});

export async function PATCH(req: Request, ctx: Ctx) {
  const gate = await requireApiSession(["ADMIN"]);
  if (!gate.ok) return gate.response;
  const { id } = await ctx.params;

  const existing = await prisma.product.findUnique({ where: { id } });
  if (!existing) return notFound();

  let body: z.infer<typeof patchSchema>;
  try {
    body = patchSchema.parse(await req.json());
  } catch {
    return badRequest("Invalid patch");
  }

  await prisma.$transaction(async (tx) => {
    await tx.product.update({
      where: { id },
      data: {
        name: body.name,
        description: body.description,
        category: body.category,
        active: body.active,
      },
    });

    if (body.variants) {
      for (const v of body.variants) {
        if (v.id) {
          await tx.productVariant.update({
            where: { id: v.id },
            data: {
              sku: v.sku,
              name: v.name,
              priceCents: v.priceCents,
              stock: v.stock,
            },
          });
        } else {
          await tx.productVariant.create({
            data: {
              productId: id,
              sku: v.sku,
              name: v.name,
              priceCents: v.priceCents,
              stock: v.stock,
              attrs: {},
            },
          });
        }
      }
    }
  });

  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      variants: true,
      images: true,
      provider: { select: { id: true, businessName: true } },
    },
  });

  return NextResponse.json({ ok: true, product });
}

export async function DELETE(_req: Request, ctx: Ctx) {
  const gate = await requireApiSession(["ADMIN"]);
  if (!gate.ok) return gate.response;
  const { id } = await ctx.params;

  const existing = await prisma.product.findUnique({
    where: { id },
    include: { variants: { select: { id: true } } },
  });
  if (!existing) return notFound();

  const variantIds = existing.variants.map((v) => v.id);
  const orderItemCount =
    variantIds.length === 0
      ? 0
      : await prisma.orderItem.count({ where: { variantId: { in: variantIds } } });

  if (orderItemCount > 0) {
    await prisma.product.update({ where: { id }, data: { active: false } });
    return NextResponse.json({
      ok: true,
      softDeleted: true,
      message: "Product has order history — deactivated instead of deleted.",
    });
  }

  await prisma.product.delete({ where: { id } });
  return NextResponse.json({ ok: true, softDeleted: false });
}
