import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { VariantSelector } from "@/components/VariantSelector";

export const dynamic = "force-dynamic";

type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  try {
    const product = await prisma.product.findUnique({ where: { slug } });
    if (!product) return { title: "Product" };
    return { title: product.name, description: product.description.slice(0, 160) };
  } catch {
    return { title: "Product" };
  }
}

export default async function ProductPage({ params }: { params: Params }) {
  const { slug } = await params;
  let product = null;
  try {
    product = await prisma.product.findUnique({
      where: { slug },
      include: {
        variants: { orderBy: { priceCents: "asc" } },
        images: { orderBy: { sortOrder: "asc" } },
        provider: true,
      },
    });
  } catch {
    product = null;
  }

  if (!product || !product.active) notFound();

  const variants = product.variants.map((v) => ({
    id: v.id,
    name: v.name,
    sku: v.sku,
    priceCents: v.priceCents,
    stock: v.stock,
    attrs: (v.attrs as Record<string, string>) || {},
  }));

  return (
    <section className="container-x grid gap-12 py-16 md:grid-cols-2 md:py-24">
      <div>
        {product.images[0] ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.images[0].url}
            alt={product.images[0].alt || product.name}
            className="aspect-square w-full object-cover"
          />
        ) : (
          <div className="flex aspect-square items-center justify-center bg-muted text-sm text-muted-foreground">
            No image
          </div>
        )}
      </div>
      <div>
        <div className="text-xs uppercase tracking-wider text-accent">{product.category}</div>
        <h1 className="mt-2 font-display text-4xl font-semibold text-primary md:text-5xl">
          {product.name}
        </h1>
        <p className="mt-4 text-muted-foreground">{product.description}</p>
        <p className="mt-2 text-xs text-primary/60">Sold by {product.provider.businessName}</p>
        <div className="mt-8">
          <VariantSelector variants={variants} productName={product.name} />
        </div>
      </div>
    </section>
  );
}
