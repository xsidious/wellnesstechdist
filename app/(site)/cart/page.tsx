import type { Metadata } from "next";
import Link from "next/link";
import { getCart, updateCartItem, removeCartItem } from "./actions";
import { formatCents } from "@/lib/utils";
import { PageHero } from "@/components/PageHero";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Cart",
};

export default async function CartPage() {
  let cart = null;
  try {
    cart = await getCart();
  } catch {
    cart = null;
  }

  const items = cart?.items ?? [];
  const subtotal = items.reduce(
    (sum, i) => sum + i.quantity * i.variant.priceCents,
    0,
  );

  return (
    <>
      <PageHero
        eyebrow="Marketplace"
        title="Cart"
        description="Review items before checkout."
        size="sm"
      />
      <section className="container-x py-10 md:py-14">
      {items.length === 0 ? (
        <p className="text-muted-foreground">
          Your cart is empty.{" "}
          <Link href="/shop" className="text-accent hover:underline">
            Continue shopping
          </Link>
        </p>
      ) : (
        <div className="space-y-6">
          <ul className="divide-y divide-primary/10 border-t border-primary/10">
            {items.map((item) => (
              <li key={item.id} className="flex flex-wrap items-center justify-between gap-4 py-5">
                <div>
                  <div className="font-medium text-primary">{item.variant.product.name}</div>
                  <div className="text-sm text-muted-foreground">{item.variant.name}</div>
                  <div className="text-sm text-primary">{formatCents(item.variant.priceCents)}</div>
                </div>
                <div className="flex items-center gap-3">
                  <form
                    action={async (fd) => {
                      "use server";
                      const q = Number(fd.get("qty"));
                      await updateCartItem(item.id, q);
                    }}
                    className="flex items-center gap-2"
                  >
                    <input
                      name="qty"
                      type="number"
                      min={1}
                      defaultValue={item.quantity}
                      className="w-16 rounded-sm border border-input px-2 py-1 text-sm"
                    />
                    <button type="submit" className="text-xs uppercase tracking-wider text-accent">
                      Update
                    </button>
                  </form>
                  <form
                    action={async () => {
                      "use server";
                      await removeCartItem(item.id);
                    }}
                  >
                    <button type="submit" className="text-xs uppercase tracking-wider text-destructive">
                      Remove
                    </button>
                  </form>
                </div>
              </li>
            ))}
          </ul>
          <div className="flex items-center justify-between border-t border-primary/15 pt-6">
            <div className="text-lg font-semibold text-primary">
              Subtotal {formatCents(subtotal)}
            </div>
            <Link
              href="/checkout"
              className="rounded-sm bg-primary px-6 py-3 text-sm font-semibold uppercase tracking-wider text-primary-foreground"
            >
              Checkout
            </Link>
          </div>
        </div>
      )}
    </section>
    </>
  );
}
