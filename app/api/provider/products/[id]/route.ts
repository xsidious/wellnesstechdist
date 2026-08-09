import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireApiSession } from "@/lib/api-auth";
import { getProviderProfileForUser, notFound, badRequest } from "@/lib/dashboard";

export const runtime = "nodejs";

type Ctx = { params: Promise<{ id: string }> };

async function ownedProduct(userId: string, productId: string) {
  const profile = await getProviderProfileForUser(userId);
  if (!profile) return null;
  const product = await prisma.product.findFirst({
    where: { id: productId, providerId: profile.id },
    include: { variants: true, images: true },
  });
  return product ? { profile, product } : null;
}

export async function GET(_req: Request, ctx: Ctx) {
  const gate = await requireApiSession(["PROVIDER", "ADMIN"]);
  if (!gate.ok) return gate.response;
  const { id } = await ctx.params;
  const owned = await ownedProduct(gate.session.user.id, id);
  if (!owned) return notFound();
  return NextResponse.json({ product: owned.product });
}

const patchSchema = z.object({
  name: z.string().trim().min(2).max(200).optional(),
  description: z.string().trim().min(10).max(5000).optional(),
  category: z.string().trim().min(2).max(80).optional(),
  active: z.boolean().optional(),
  imageUrl: z.string().url().nullable().optional(),
});

export async function PATCH(req: Request, ctx: Ctx) {
  const gate = await requireApiSession(["PROVIDER", "ADMIN"]);
  if (!gate.ok) return gate.response;
  const { id } = await ctx.params;
  const owned = await ownedProduct(gate.session.user.id, id);
  if (!owned) return notFound();

  let body: z.infer<typeof patchSchema>;
  try {
    body = patchSchema.parse(await req.json());
  } catch {
    return badRequest("Invalid patch");
  }

  const product = await prisma.product.update({
    where: { id },
    data: {
      name: body.name,
      description: body.description,
      category: body.category,
      active: body.active,
    },
    include: { variants: true, images: true },
  });

  if (body.imageUrl !== undefined) {
    await prisma.productImage.deleteMany({ where: { productId: id } });
    if (body.imageUrl) {
      await prisma.productImage.create({
        data: { productId: id, url: body.imageUrl, alt: product.name, sortOrder: 0 },
      });
    }
  }

  const refreshed = await prisma.product.findUnique({
    where: { id },
    include: { variants: true, images: true },
  });

  return NextResponse.json({ ok: true, product: refreshed });
}

export async function DELETE(_req: Request, ctx: Ctx) {
  const gate = await requireApiSession(["PROVIDER", "ADMIN"]);
  if (!gate.ok) return gate.response;
  const { id } = await ctx.params;
  const owned = await ownedProduct(gate.session.user.id, id);
  if (!owned) return notFound();

  await prisma.product.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
