"use client";

import Link from "next/link";
import { Minus, Plus, ShoppingCart, Trash2, X } from "lucide-react";
import { updateCartItem, removeCartItem } from "@/app/(site)/cart/actions";
import { formatCents } from "@/lib/utils";
import { useCartUi } from "@/components/cart/CartProvider";

export function CartDrawer() {
  const { open, closeCart, cart, loading, refreshCart } = useCartUi();

  async function setQty(itemId: string, quantity: number) {
    await updateCartItem(itemId, quantity);
    await refreshCart();
  }

  async function remove(itemId: string) {
    await removeCartItem(itemId);
    await refreshCart();
  }

  return (
    <>
      <div
        className={`fixed inset-0 z-[60] bg-primary/30 transition-opacity duration-300 ${
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={closeCart}
        aria-hidden={!open}
      />

      <aside
        className={`fixed inset-y-0 right-0 z-[70] flex w-full max-w-md flex-col bg-white shadow-[-12px_0_40px_rgba(15,40,60,0.12)] transition-transform duration-300 ease-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
        aria-hidden={!open}
        aria-label="Shopping cart"
      >
        <div className="flex items-center justify-between border-b border-primary/10 px-5 py-4">
          <div>
            <h2 className="font-display text-xl font-semibold text-primary">Your cart</h2>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {cart.count === 0
                ? "No items yet"
                : `${cart.count} item${cart.count === 1 ? "" : "s"}`}
            </p>
          </div>
          <button
            type="button"
            onClick={closeCart}
            className="inline-flex size-9 items-center justify-center border border-primary/15 text-primary transition hover:border-primary/30"
            aria-label="Close cart"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {loading && cart.items.length === 0 ? (
            <p className="text-sm text-muted-foreground">Loading cart…</p>
          ) : cart.items.length === 0 ? (
            <div className="flex h-full min-h-[240px] flex-col items-center justify-center text-center">
              <ShoppingCart className="size-8 text-primary/25" />
              <p className="mt-4 text-sm text-muted-foreground">Your cart is empty.</p>
              <Link
                href="/shop"
                onClick={closeCart}
                className="mt-5 text-xs font-semibold uppercase tracking-[0.14em] text-accent hover:underline"
              >
                Continue shopping
              </Link>
            </div>
          ) : (
            <ul className="divide-y divide-primary/10">
              {cart.items.map((item) => (
                <li key={item.id} className="py-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <Link
                        href={`/product/${item.productSlug}`}
                        onClick={closeCart}
                        className="font-medium text-primary hover:text-accent"
                      >
                        {item.productName}
                      </Link>
                      <p className="mt-0.5 text-xs text-muted-foreground">{item.variantName}</p>
                      <p className="mt-1 text-sm text-primary">
                        {formatCents(item.priceCents)}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => void remove(item.id)}
                      className="text-primary/40 transition hover:text-destructive"
                      aria-label={`Remove ${item.productName}`}
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <div className="inline-flex items-center border border-primary/15">
                      <button
                        type="button"
                        className="inline-flex size-8 items-center justify-center text-primary transition hover:bg-primary/5"
                        onClick={() => void setQty(item.id, item.quantity - 1)}
                        aria-label="Decrease quantity"
                      >
                        <Minus className="size-3.5" />
                      </button>
                      <span className="min-w-8 text-center text-sm font-medium text-primary">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        className="inline-flex size-8 items-center justify-center text-primary transition hover:bg-primary/5"
                        onClick={() => void setQty(item.id, item.quantity + 1)}
                        aria-label="Increase quantity"
                      >
                        <Plus className="size-3.5" />
                      </button>
                    </div>
                    <span className="text-sm font-semibold text-primary">
                      {formatCents(item.lineCents)}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="border-t border-primary/10 px-5 py-5">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span className="font-display text-lg font-semibold text-primary">
              {formatCents(cart.subtotalCents)}
            </span>
          </div>
          <div className="mt-4 grid gap-2">
            <Link
              href="/checkout"
              onClick={closeCart}
              className={`inline-flex items-center justify-center bg-primary px-4 py-3.5 text-xs font-semibold uppercase tracking-[0.14em] text-primary-foreground transition hover:bg-primary/90 ${
                cart.items.length === 0 ? "pointer-events-none opacity-40" : ""
              }`}
            >
              Checkout
            </Link>
            <Link
              href="/cart"
              onClick={closeCart}
              className="inline-flex items-center justify-center border border-primary/20 px-4 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-primary transition hover:border-primary/40"
            >
              View full cart
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
}
