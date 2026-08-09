"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { fetchJson } from "@/lib/api/client";

export type CartDrawerItem = {
  id: string;
  quantity: number;
  priceCents: number;
  lineCents: number;
  variantName: string;
  productName: string;
  productSlug: string;
};

type CartSnapshot = {
  items: CartDrawerItem[];
  count: number;
  subtotalCents: number;
};

type CartUiContextValue = {
  open: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  refreshCart: () => Promise<void>;
  cart: CartSnapshot;
  loading: boolean;
};

const CartUiContext = createContext<CartUiContextValue | null>(null);

const empty: CartSnapshot = { items: [], count: 0, subtotalCents: 0 };

export function CartProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [cart, setCart] = useState<CartSnapshot>(empty);
  const [loading, setLoading] = useState(false);

  const refreshCart = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchJson<CartSnapshot>("/api/cart");
      setCart(data);
    } catch {
      setCart(empty);
    } finally {
      setLoading(false);
    }
  }, []);

  const openCart = useCallback(() => {
    setOpen(true);
    void refreshCart();
  }, [refreshCart]);

  const closeCart = useCallback(() => setOpen(false), []);
  const toggleCart = useCallback(() => {
    setOpen((v) => {
      const next = !v;
      if (next) void refreshCart();
      return next;
    });
  }, [refreshCart]);

  useEffect(() => {
    void refreshCart();
  }, [refreshCart]);

  useEffect(() => {
    function onOpen() {
      openCart();
    }
    function onUpdated() {
      void refreshCart();
    }
    window.addEventListener("wt:open-cart", onOpen);
    window.addEventListener("wt:cart-updated", onUpdated);
    return () => {
      window.removeEventListener("wt:open-cart", onOpen);
      window.removeEventListener("wt:cart-updated", onUpdated);
    };
  }, [openCart, refreshCart]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const value = useMemo(
    () => ({
      open,
      openCart,
      closeCart,
      toggleCart,
      refreshCart,
      cart,
      loading,
    }),
    [open, openCart, closeCart, toggleCart, refreshCart, cart, loading],
  );

  return <CartUiContext.Provider value={value}>{children}</CartUiContext.Provider>;
}

export function useCartUi() {
  const ctx = useContext(CartUiContext);
  if (!ctx) throw new Error("useCartUi must be used within CartProvider");
  return ctx;
}

export function emitOpenCart() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("wt:open-cart"));
  }
}

export function emitCartUpdated() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("wt:cart-updated"));
  }
}
