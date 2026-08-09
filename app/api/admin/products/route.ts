import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireApiSession } from "@/lib/api-auth";
import { badRequest, slugify } from "@/lib/dashboard";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const gate = await requireApiSession(["ADMIN"]);
  if (!gate.ok) return gate.response;

  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q")?.trim();
  const providerId = searchParams.get("providerId") || undefined;
  const activeParam = searchParams.get("active");

  const products = await prisma.product.findMany({
    where: {
      ...(providerId ? { providerId } : {}),
      ...(activeParam === "true" ? { active: true } : {}),
      ...(activeParam === "false" ? { active: false } : {}),
      ...(q
        ? {
            OR: [
              { name: { contains: q, mode: "insensitive" } },
              { slug: { contains: q, mode: "insensitive" } },
              { category: { contains: q, mode: "insensitive" } },
            ],
          }
        : {}),
    },
    include: {
      variants: true,
      images: true,
      provider: {
        select: { id: true, businessName: true, approved: true },
      },
    },
    orderBy: { updatedAt: "desc" },
    take: 200,
  });

  return NextResponse.json({ products });
}

const createSchema = z.object({
  providerId: z.string().min(1),
  name: z.string().trim().min(2).max(200),
  description: z.string().trim().min(10).max(5000),
  category: z.string().trim().min(2).max(80),
  active: z.boolean().optional(),
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

export async function POST(req: Request) {
  const gate = await requireApiSession(["ADMIN"]);
  if (!gate.ok) return gate.response;

  let body: z.infer<typeof createSchema>;
  try {
    body = createSchema.parse(await req.json());
  } catch {
    return badRequest("Invalid product payload");
  }

  const provider = await prisma.providerProfile.findUnique({ where: { id: body.providerId } });
  if (!provider) return badRequest("Provider not found");

  let slug = slugify(body.name);
  if (await prisma.product.findUnique({ where: { slug } })) {
    slug = `${slug}-${Date.now().toString(36)}`;
  }

  const product = await prisma.product.create({
    data: {
      providerId: body.providerId,
      slug,
      name: body.name,
      description: body.description,
      category: body.category,
      active: body.active ?? provider.approved,
      variants: {
        create: body.variants.map((v) => ({
          sku: v.sku,
          name: v.name,
          priceCents: v.priceCents,
          stock: v.stock,
          attrs: v.attrs || {},
        })),
      },
    },
    include: {
      variants: true,
      provider: { select: { id: true, businessName: true } },
    },
  });

  return NextResponse.json({ ok: true, product }, { status: 201 });
}
