"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchJson } from "./client";

export type ProviderMe = {
  profile: {
    id: string;
    businessName: string;
    approved: boolean;
    stripeAccountId: string | null;
  };
  stockHealth: {
    totalUnits: number;
    productCount: number;
    lowStock: { sku: string; stock: number; product: string }[];
    status: string;
  };
  earningsCents: number;
  openFulfillmentCount: number;
  products: {
    id: string;
    slug: string;
    name: string;
    category: string;
    active: boolean;
    imageUrl: string | null;
    stock: number;
    variants: {
      id: string;
      sku: string;
      name: string;
      priceCents: number;
      stock: number;
      attrs: unknown;
    }[];
  }[];
};

export type ProviderSubOrder = {
  id: string;
  status: string;
  subtotalCents: number;
  createdAt: string;
  buyerEmail: string;
  orderStatus: string;
  items: {
    id: string;
    productName: string;
    variantName: string;
    quantity: number;
    lineTotalCents: number;
  }[];
};

export function useProviderMe() {
  return useQuery({
    queryKey: ["provider", "me"],
    queryFn: () => fetchJson<ProviderMe>("/api/provider/me"),
  });
}

export function useProviderSubOrders() {
  return useQuery({
    queryKey: ["provider", "sub-orders"],
    queryFn: async () => {
      const data = await fetchJson<{ subOrders: ProviderSubOrder[] }>(
        "/api/provider/sub-orders",
      );
      return data.subOrders;
    },
  });
}

export function useUpdateSubOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: { id: string; status: string }) =>
      fetchJson<{ ok: true }>(`/api/provider/sub-orders/${body.id}`, {
        method: "PATCH",
        body: JSON.stringify({ status: body.status }),
      }),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["provider"] });
    },
  });
}

export function useCreateProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: {
      name: string;
      description: string;
      category: string;
      imageUrl?: string | null;
      variants: {
        sku: string;
        name: string;
        priceCents: number;
        stock: number;
        attrs?: Record<string, string>;
      }[];
    }) =>
      fetchJson<{ ok: true; product: { id: string } }>("/api/provider/products", {
        method: "POST",
        body: JSON.stringify(body),
      }),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["provider"] });
    },
  });
}

export function useUpdateVariant() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: {
      id: string;
      stock?: number;
      priceCents?: number;
      name?: string;
      sku?: string;
    }) =>
      fetchJson<{ ok: true }>(`/api/provider/variants/${body.id}`, {
        method: "PATCH",
        body: JSON.stringify(body),
      }),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["provider"] });
    },
  });
}

export function useToggleProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: { id: string; active: boolean }) =>
      fetchJson<{ ok: true }>(`/api/provider/products/${body.id}`, {
        method: "PATCH",
        body: JSON.stringify({ active: body.active }),
      }),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["provider"] });
    },
  });
}
