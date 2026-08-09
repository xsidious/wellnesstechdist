"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchJson } from "./client";

export type AmbassadorMe = {
  profile: { id: string; code: string; walletBalanceCents: number };
  attributedGmvCents: number;
  orderCount: number;
  commissionEarnedCents: number;
  rank: number | null;
  ambassadorCount: number;
  tier: { id: string; name: string; percentBps: number; minOrderCents: number } | null;
  shareUrl: string;
};

export type AmbassadorLink = {
  id: string;
  slug: string;
  destination: string;
  clicks: number;
  createdAt: string;
};

export type AmbassadorOrder = {
  id: string;
  email: string;
  status: string;
  totalCents: number;
  commissionCents: number;
  createdAt: string;
};

export type AmbassadorLedgerEntry = {
  id: string;
  type: string;
  status: string;
  amountCents: number;
  description: string | null;
  orderId: string | null;
  createdAt: string;
  paidAt: string | null;
};

export function useAmbassadorMe() {
  return useQuery({
    queryKey: ["ambassador", "me"],
    queryFn: () => fetchJson<AmbassadorMe>("/api/ambassador/me"),
  });
}

export function useAmbassadorLinks() {
  return useQuery({
    queryKey: ["ambassador", "links"],
    queryFn: async () => {
      const data = await fetchJson<{ links: AmbassadorLink[] }>("/api/ambassador/links");
      return data.links;
    },
  });
}

export function useCreateAmbassadorLink() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: { slug?: string; destination?: string }) =>
      fetchJson<{ ok: true; link: AmbassadorLink }>("/api/ambassador/links", {
        method: "POST",
        body: JSON.stringify(body),
      }),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["ambassador", "links"] });
      void qc.invalidateQueries({ queryKey: ["ambassador", "me"] });
    },
  });
}

export function useAmbassadorOrders() {
  return useQuery({
    queryKey: ["ambassador", "orders"],
    queryFn: async () => {
      const data = await fetchJson<{ orders: AmbassadorOrder[] }>("/api/ambassador/orders");
      return data.orders;
    },
  });
}

export function useAmbassadorLedger() {
  return useQuery({
    queryKey: ["ambassador", "ledger"],
    queryFn: async () => {
      const data = await fetchJson<{ entries: AmbassadorLedgerEntry[] }>(
        "/api/ambassador/ledger",
      );
      return data.entries;
    },
  });
}
