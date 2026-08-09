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
