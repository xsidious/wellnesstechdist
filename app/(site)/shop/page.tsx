import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { formatCents } from "@/lib/utils";
import { PageHero } from "@/components/PageHero";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Shop",
  description: "Wellness Tech marketplace — live product inventory.",
};

type SearchParams = Promise<{ category?: string }>;

export default async function ShopPage({ searchParams }: { searchParams: SearchParams }) {
  const { category } = await searchParams;
  let products: Awaited<ReturnType<typeof loadProducts>> = [];
  let error: string | null = null;

  try {
    products = await loadProducts(category);
  } catch {
    error = "Catalog temporarily unavailable. Please try again shortly.";
  }

  return (
    <>
      <PageHero
        eyebrow="Marketplace"
        title="Shop"
        description={
          category ? (
            <>
              Filtered by category: <span className="text-accent">{category}</span>
            </>
          ) : (
            "Live product inventory for verified practices and partners."
          )
        }
        size="sm"
      />
      <section className="container-x py-12 md:py-16">
        {error && <p className="text-muted-foreground">{error}</p>}
        {!error && products.length === 0 && (
          <p className="text-muted-foreground">No products listed yet. Check back soon.</p>
        )}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => {
            const min = Math.min(...p.variants.map((v) => v.priceCents));
            return (
              <Link
                key={p.id}
                href={`/product/${p.slug}`}
                className="group border-t border-primary/15 pt-5 transition hover:border-accent"
              >
                <div className="text-xs uppercase tracking-wider text-accent">{p.category}</div>
                <h2 className="mt-2 font-display text-xl font-semibold text-primary group-hover:text-accent">
                  {p.name}
                </h2>
                <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{p.description}</p>
                <p className="mt-4 text-sm font-medium text-primary">
                  From {formatCents(Number.isFinite(min) ? min : 0)}
                </p>
              </Link>
            );
          })}
        </div>
      </section>
    </>
  );
}

async function loadProducts(category?: string) {
  return prisma.product.findMany({
    where: {
      active: true,
      ...(category ? { category } : {}),
      provider: { approved: true },
    },
    include: {
      variants: { orderBy: { priceCents: "asc" } },
      images: { orderBy: { sortOrder: "asc" }, take: 1 },
    },
    orderBy: { name: "asc" },
  });
}
