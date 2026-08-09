"use client";

import { useAdminAnalytics } from "@/lib/api/admin";
import { formatCents } from "@/lib/utils";
import { QueryProvider } from "@/components/QueryProvider";

export function AdminAnalyticsPanel() {
  const { data, isLoading, error, isFetching } = useAdminAnalytics();

  if (isLoading) {
    return <p className="text-sm text-muted-foreground">Loading live analytics…</p>;
  }

  if (error) {
    return (
      <p className="text-sm text-destructive">
        Could not load analytics API ({error.message}). Sign in as ADMIN and ensure DATABASE_URL is
        set.
      </p>
    );
  }

  if (!data) return null;

  const cards = [
    { label: "GMV", value: formatCents(data.gmvCents) },
    { label: "Platform fees", value: formatCents(data.platformFeesCents) },
    {
      label: "Pending provider payouts",
      value: formatCents(data.pendingProviderPayoutsCents),
    },
    { label: "Paid orders", value: String(data.ordersPaid) },
    {
      label: "Ambassador commissions",
      value: formatCents(data.ambassador.totalCommissionPaidCents),
    },
    {
      label: "Active ambassadors",
      value: String(data.ambassador.activeCount),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-display text-xl font-semibold text-primary">
          Live marketplace metrics
        </h2>
        <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
          TanStack Query · {data.cache || "api"}
          {isFetching ? " · refreshing" : ""}
        </span>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c) => (
          <div key={c.label} className="border-t border-primary/15 pt-4">
            <div className="text-xs uppercase tracking-widest text-muted-foreground">
              {c.label}
            </div>
            <div className="mt-1 font-display text-2xl font-semibold text-primary">{c.value}</div>
          </div>
        ))}
      </div>
      {data.ambassador.top.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-primary">Top ambassadors</h3>
          <ul className="mt-2 divide-y divide-primary/10 border-t border-primary/10">
            {data.ambassador.top.map((a) => (
              <li key={a.id} className="flex justify-between py-2 text-sm">
                <span>{a.code}</span>
                <span>
                  {formatCents(a.attributedGmvCents)} · {a.orders} orders
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

/** Standalone island with its own QueryClient (for isolated embeds). */
export function AdminAnalyticsIsland() {
  return (
    <QueryProvider>
      <AdminAnalyticsPanel />
    </QueryProvider>
  );
}
