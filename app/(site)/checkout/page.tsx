import type { Metadata } from "next";
import Link from "next/link";
import { getCart } from "@/app/(site)/cart/actions";
import { placeOrderAndRedirect } from "./actions";
import { formatCents } from "@/lib/utils";
import { auth } from "@/lib/auth";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Checkout",
};

type SearchParams = Promise<{ error?: string; success?: string; orderId?: string }>;

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const sp = await searchParams;
  const session = await auth().catch(() => null);

  if (sp.success && sp.orderId) {
    return (
      <section className="container-x py-16 md:py-24">
        <h1 className="font-display text-4xl font-semibold text-primary">Order placed</h1>
        <p className="mt-4 text-muted-foreground">
          Thank you. Order ID: <span className="font-medium text-primary">{sp.orderId}</span>
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          If Stripe is configured, complete payment with the client secret returned to your session.
          Webhooks will mark the order paid.
        </p>
        <Link href="/shop" className="mt-8 inline-flex text-accent hover:underline">
          Back to shop
        </Link>
      </section>
    );
  }

  let cart = null;
  try {
    cart = await getCart();
  } catch {
    cart = null;
  }
  const items = cart?.items ?? [];
  const subtotal = items.reduce((s, i) => s + i.quantity * i.variant.priceCents, 0);

  return (
    <section className="container-x py-16 md:py-24">
      <h1 className="font-display text-4xl font-semibold text-primary">Checkout</h1>
      {sp.error && <p className="mt-4 text-sm text-destructive">{sp.error}</p>}
      {items.length === 0 ? (
        <p className="mt-6 text-muted-foreground">
          Nothing to checkout.{" "}
          <Link href="/shop" className="text-accent hover:underline">
            Browse shop
          </Link>
        </p>
      ) : (
        <div className="mt-10 grid gap-12 md:grid-cols-2">
          <div>
            <h2 className="font-display text-xl font-semibold text-primary">Order summary</h2>
            <ul className="mt-4 divide-y divide-primary/10 border-t border-primary/10">
              {items.map((i) => (
                <li key={i.id} className="flex justify-between py-3 text-sm">
                  <span>
                    {i.variant.product.name} × {i.quantity}
                  </span>
                  <span>{formatCents(i.variant.priceCents * i.quantity)}</span>
                </li>
              ))}
            </ul>
            <div className="mt-4 text-lg font-semibold">Subtotal {formatCents(subtotal)}</div>
          </div>
          <form action={placeOrderAndRedirect} className="space-y-4">
            <div>
              <label htmlFor="email" className="text-xs font-semibold uppercase tracking-widest text-primary/70">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                defaultValue={session?.user?.email || ""}
                className="mt-2 w-full rounded-sm border border-input px-3 py-2.5 text-sm"
              />
            </div>
            <button
              type="submit"
              className="w-full rounded-sm bg-primary px-6 py-3 text-sm font-semibold uppercase tracking-wider text-primary-foreground"
            >
              Place order
            </button>
          </form>
        </div>
      )}
    </section>
  );
}
