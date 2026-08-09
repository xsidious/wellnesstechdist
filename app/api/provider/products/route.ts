import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireApiSession } from "@/lib/api-auth";
import { getProviderProfileForUser, notFound, badRequest, slugify } from "@/lib/dashboard";

export const runtime = "nodejs";

const createSchema = z.object({
  name: z.string().trim().min(2).max(200),
  description: z.string().trim().min(10).max(5000),
  category: z.string().trim().min(2).max(80),
  imageUrl: z.string().url().optional().nullable(),
  variants: z
    .array(
      z.object({
        sku: z.string().trim().min(2).max(80),
        name: z.string().trim().min(1).max(120),
        priceCents: z.number().int().positive(),
        stock: z.number().int().min(0),
        attrs: z.record(z.string()).optional(),
      }),
    )
    .min(1),
});

export async function GET() {
  const gate = await requireApiSession(["PROVIDER", "ADMIN"]);
  if (!gate.ok) return gate.response;
  const profile = await getProviderProfileForUser(gate.session.user.id);
  if (!profile) return notFound("Provider profile not found");

  const products = await prisma.product.findMany({
    where: { providerId: profile.id },
    include: { variants: true, images: true },
    orderBy: { updatedAt: "desc" },
  });

  return NextResponse.json({ products });
}

export async function POST(req: Request) {
  const gate = await requireApiSession(["PROVIDER", "ADMIN"]);
  if (!gate.ok) return gate.response;
  const profile = await getProviderProfileForUser(gate.session.user.id);
  if (!profile) return notFound("Provider profile not found");

  let body: z.infer<typeof createSchema>;
  try {
    body = createSchema.parse(await req.json());
  } catch {
    return badRequest("Invalid product payload");
  }

  let slug = slugify(body.name);
  if (await prisma.product.findUnique({ where: { slug } })) {
    slug = `${slug}-${Date.now().toString(36)}`;
  }

  const product = await prisma.product.create({
    data: {
      providerId: profile.id,
      slug,
      name: body.name,
      description: body.description,
      category: body.category,
      active: profile.approved,
      variants: {
        create: body.variants.map((v) => ({
          sku: v.sku,
          name: v.name,
          priceCents: v.priceCents,
          stock: v.stock,
          attrs: v.attrs || {},
        })),
      },
      images: body.imageUrl
        ? { create: [{ url: body.imageUrl, alt: body.name, sortOrder: 0 }] }
        : undefined,
    },
    include: { variants: true, images: true },
  });

  return NextResponse.json({ ok: true, product }, { status: 201 });
}
