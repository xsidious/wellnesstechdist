import { redirect } from "next/navigation";
import { put } from "@vercel/blob";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

function slugify(input: string) {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60);
}

async function createProduct(formData: FormData) {
  "use server";
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const schema = z.object({
    name: z.string().trim().min(2).max(200),
    description: z.string().trim().min(10).max(5000),
    category: z.string().trim().min(2).max(80),
    variantName: z.string().trim().min(1).max(120),
    priceCents: z.coerce.number().int().positive(),
    stock: z.coerce.number().int().min(0),
    sku: z.string().trim().min(2).max(80),
  });

  const parsed = schema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
    category: formData.get("category"),
    variantName: formData.get("variantName"),
    priceCents: formData.get("priceCents"),
    stock: formData.get("stock"),
    sku: formData.get("sku"),
  });
  if (!parsed.success) {
    redirect("/provider/products/new?error=Invalid+form");
  }

  const profile = await prisma.providerProfile.findUnique({
    where: { userId: session.user.id },
  });
  if (!profile) redirect("/provider?error=No+provider+profile");

  const data = parsed.data;
  let slug = slugify(data.name);
  const clash = await prisma.product.findUnique({ where: { slug } });
  if (clash) slug = `${slug}-${Date.now().toString(36)}`;

  let imageUrl: string | null = null;
  const file = formData.get("image");
  if (file && file instanceof File && file.size > 0 && process.env.BLOB_READ_WRITE_TOKEN) {
    const blob = await put(`products/${slug}-${file.name}`, file, {
      access: "public",
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });
    imageUrl = blob.url;
  }

  const product = await prisma.product.create({
    data: {
      providerId: profile.id,
      slug,
      name: data.name,
      description: data.description,
      category: data.category,
      active: profile.approved,
      variants: {
        create: {
          sku: data.sku,
          name: data.variantName,
          attrs: { size: data.variantName },
          priceCents: data.priceCents,
          stock: data.stock,
        },
      },
      ...(imageUrl
        ? {
            images: {
              create: { url: imageUrl, alt: data.name, sortOrder: 0 },
            },
          }
        : {}),
    },
  });

  redirect(`/product/${product.slug}`);
}

type SearchParams = Promise<{ error?: string }>;

export default async function NewProductPage({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams;
  return (
    <div className="mx-auto max-w-xl space-y-6">
      <h1 className="font-display text-3xl font-semibold text-primary">New product</h1>
      {sp.error && <p className="text-sm text-destructive">{sp.error}</p>}
      <form action={createProduct} className="space-y-4" encType="multipart/form-data">
        {(
          [
            ["name", "Name", "text"],
            ["category", "Category", "text"],
            ["variantName", "Variant name / size", "text"],
            ["sku", "SKU", "text"],
            ["priceCents", "Price (cents)", "number"],
            ["stock", "Stock", "number"],
          ] as const
        ).map(([name, label, type]) => (
          <div key={name}>
            <label className="text-xs font-semibold uppercase tracking-widest text-primary/70">
              {label}
            </label>
            <input
              name={name}
              type={type}
              required
              className="mt-2 w-full rounded-sm border border-input px-3 py-2.5 text-sm"
            />
          </div>
        ))}
        <div>
          <label className="text-xs font-semibold uppercase tracking-widest text-primary/70">
            Description
          </label>
          <textarea
            name="description"
            required
            rows={4}
            className="mt-2 w-full rounded-sm border border-input px-3 py-2.5 text-sm"
          />
        </div>
        <div>
          <label className="text-xs font-semibold uppercase tracking-widest text-primary/70">
            Image
          </label>
          <input name="image" type="file" accept="image/*" className="mt-2 block w-full text-sm" />
        </div>
        <button
          type="submit"
          className="rounded-sm bg-primary px-6 py-3 text-sm font-semibold uppercase tracking-wider text-primary-foreground"
        >
          Create product
        </button>
      </form>
    </div>
  );
}
