"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchJson } from "./client";

export type AdminAnalytics = {
  gmvCents: number;
  platformFeesCents: number;
  pendingProviderPayoutsCents: number;
  ambassador: {
    activeCount: number;
    totalCommissionPaidCents: number;
    totalWalletCents: number;
    top: { id: string; code: string; attributedGmvCents: number; orders: number }[];
  };
  ordersPaid: number;
  cachedAt: string;
  cache?: string;
};

export type AdminProvider = {
  id: string;
  businessName: string;
  approved: boolean;
  stripeAccountId: string | null;
  email: string;
  name: string | null;
  productCount: number;
  subOrderCount: number;
  stockHealth: {
    totalUnits: number;
    lowStockCount: number;
    lowStockSkus: string[];
    status: string;
  };
  createdAt: string;
};

export type CommissionTier = {
  id: string;
  name: string;
  percentBps: number;
  minOrderCents: number;
  active: boolean;
};

export type AmbassadorLeaderboardRow = {
  rank: number;
  id: string;
  code: string;
  email: string;
  name: string | null;
  walletBalanceCents: number;
  attributedGmvCents: number;
  orderCount: number;
  linkCount: number;
};

export type AdminProduct = {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: string;
  active: boolean;
  providerId: string;
  provider: { id: string; businessName: string; approved?: boolean };
  variants: {
    id: string;
    sku: string;
    name: string;
    priceCents: number;
    stock: number;
  }[];
};

export type AdminOrderRow = {
  id: string;
  email: string;
  status: string;
  totalCents: number;
  subtotalCents: number;
  feeCents: number;
  commissionCents: number;
  createdAt: string;
  customerName: string | null;
  ambassadorCode: string | null;
  itemCount: number;
  subOrders: {
    id: string;
    status: string;
    subtotalCents: number;
    providerName: string;
    items: {
      id: string;
      productName: string;
      variantName: string;
      quantity: number;
      lineTotalCents: number;
    }[];
  }[];
};

export type ContentBlock = {
  key: string;
  title: string | null;
  body: Record<string, unknown>;
  updatedAt: string | null;
};

export function useAdminAnalytics() {
  return useQuery({
    queryKey: ["admin", "analytics"],
    queryFn: () => fetchJson<AdminAnalytics>("/api/admin/analytics"),
  });
}

export function useAdminProviders() {
  return useQuery({
    queryKey: ["admin", "providers"],
    queryFn: async () => {
      const data = await fetchJson<{ providers: AdminProvider[] }>("/api/admin/providers");
      return data.providers;
    },
  });
}

export function useUpdateProvider() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: {
      providerId: string;
      approved?: boolean;
      payoutFlag?: boolean;
      stripeAccountId?: string | null;
    }) =>
      fetchJson<{ ok: true }>("/api/admin/providers", {
        method: "POST",
        body: JSON.stringify(body),
      }),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["admin", "providers"] });
      void qc.invalidateQueries({ queryKey: ["admin", "analytics"] });
    },
  });
}

export function useAdminAmbassadors() {
  return useQuery({
    queryKey: ["admin", "ambassadors"],
    queryFn: () =>
      fetchJson<{
        leaderboard: AmbassadorLeaderboardRow[];
        tiers: CommissionTier[];
      }>("/api/admin/ambassadors"),
  });
}

export function useUpdateCommissionTiers() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: {
      action: "upsert_tier";
      id?: string;
      name: string;
      percentBps: number;
      minOrderCents: number;
      active?: boolean;
    }) =>
      fetchJson<{ ok: true }>("/api/admin/ambassadors", {
        method: "POST",
        body: JSON.stringify(body),
      }),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["admin", "ambassadors"] });
      void qc.invalidateQueries({ queryKey: ["admin", "analytics"] });
    },
  });
}

export function useAdminPayouts() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (flaggedProvidersOnly: boolean) =>
      fetchJson<{ ok: true; paid: number; mode: string }>("/api/admin/payouts", {
        method: "POST",
        body: JSON.stringify({ flaggedProvidersOnly }),
      }),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["admin"] });
    },
  });
}

export function useCreateAdminUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: {
      email: string;
      password: string;
      name?: string;
      role: "PROVIDER" | "AMBASSADOR" | "ADMIN" | "CUSTOMER";
      businessName?: string;
      approved?: boolean;
      ambassadorCode?: string;
    }) =>
      fetchJson<{ ok: true }>("/api/admin/users", {
        method: "POST",
        body: JSON.stringify(body),
      }),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["admin"] });
    },
  });
}

export function useAdminProducts(params?: { q?: string; providerId?: string }) {
  const qs = new URLSearchParams();
  if (params?.q) qs.set("q", params.q);
  if (params?.providerId) qs.set("providerId", params.providerId);
  const suffix = qs.toString() ? `?${qs}` : "";
  return useQuery({
    queryKey: ["admin", "products", params],
    queryFn: async () => {
      const data = await fetchJson<{ products: AdminProduct[] }>(`/api/admin/products${suffix}`);
      return data.products;
    },
  });
}

export function useCreateAdminProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: {
      providerId: string;
      name: string;
      description: string;
      category: string;
      active?: boolean;
      variants: {
        sku: string;
        name: string;
        priceCents: number;
        stock: number;
      }[];
    }) =>
      fetchJson<{ ok: true; product: AdminProduct }>("/api/admin/products", {
        method: "POST",
        body: JSON.stringify(body),
      }),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["admin", "products"] });
    },
  });
}

export function useUpdateAdminProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      ...body
    }: {
      id: string;
      name?: string;
      description?: string;
      category?: string;
      active?: boolean;
      variants?: {
        id?: string;
        sku: string;
        name: string;
        priceCents: number;
        stock: number;
      }[];
    }) =>
      fetchJson<{ ok: true }>(`/api/admin/products/${id}`, {
        method: "PATCH",
        body: JSON.stringify(body),
      }),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["admin", "products"] });
    },
  });
}

export function useDeleteAdminProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      fetchJson<{ ok: true }>(`/api/admin/products/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["admin", "products"] });
    },
  });
}

export function useAdminOrders(status?: string) {
  const qs = status ? `?status=${encodeURIComponent(status)}` : "";
  return useQuery({
    queryKey: ["admin", "orders", status],
    queryFn: async () => {
      const data = await fetchJson<{ orders: AdminOrderRow[]; nextCursor: string | null }>(
        `/api/admin/orders${qs}`,
      );
      return data.orders;
    },
  });
}

export function useUpdateAdminOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: {
      id: string;
      status?: string;
      subOrderId?: string;
      subOrderStatus?: string;
    }) =>
      fetchJson<{ ok: true }>(`/api/admin/orders/${body.id}`, {
        method: "PATCH",
        body: JSON.stringify({
          status: body.status,
          subOrderId: body.subOrderId,
          subOrderStatus: body.subOrderStatus,
        }),
      }),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["admin", "orders"] });
      void qc.invalidateQueries({ queryKey: ["admin", "analytics"] });
    },
  });
}

export function useAdminContent() {
  return useQuery({
    queryKey: ["admin", "content"],
    queryFn: async () => {
      const data = await fetchJson<{ blocks: ContentBlock[] }>("/api/admin/content");
      return data.blocks;
    },
  });
}

export function useSaveAdminContent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: { key: string; title?: string | null; body: Record<string, unknown> }) =>
      fetchJson<{ ok: true }>("/api/admin/content", {
        method: "PUT",
        body: JSON.stringify(body),
      }),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["admin", "content"] });
    },
  });
}
