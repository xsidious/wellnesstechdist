"use client";

import { useState } from "react";
import {
  useAdminProviders,
  useUpdateProvider,
  type AdminProvider,
} from "@/lib/api/admin";

function StockBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    healthy: "bg-emerald-deep/10 text-emerald-deep",
    low: "bg-accent/20 text-accent-foreground",
    empty: "bg-destructive/10 text-destructive",
    unapproved: "bg-muted text-muted-foreground",
  };
  return (
    <span
      className={`rounded-sm px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${styles[status] || styles.unapproved}`}
    >
      {status}
    </span>
  );
}

function ProviderRow({ p }: { p: AdminProvider }) {
  const update = useUpdateProvider();
  const [stripeId, setStripeId] = useState(p.stripeAccountId || "");

  return (
    <li className="grid gap-3 border-b border-primary/10 py-4 md:grid-cols-[1.4fr_1fr_auto]">
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="font-medium text-primary">{p.businessName}</div>
          {p.payoutFlagged && (
            <span className="rounded-sm bg-accent/20 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-accent-foreground">
              Payout flagged
            </span>
          )}
        </div>
        <div className="text-sm text-muted-foreground">{p.email}</div>
        <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <StockBadge status={p.stockHealth.status} />
          <span>{p.stockHealth.totalUnits} units</span>
          <span>{p.productCount} products</span>
          <span>{p.subOrderCount} sub-orders</span>
          {p.npi && <span>NPI {p.npi}</span>}
          {p.phone && <span>{p.phone}</span>}
        </div>
        {p.stockHealth.lowStockSkus.length > 0 && (
          <p className="mt-1 text-xs text-destructive">
            Low: {p.stockHealth.lowStockSkus.slice(0, 5).join(", ")}
          </p>
        )}
      </div>
      <div>
        <label className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
          Stripe account
        </label>
        <input
          value={stripeId}
          onChange={(e) => setStripeId(e.target.value)}
          placeholder="acct_..."
          className="mt-1 w-full rounded-sm border border-input bg-background px-2 py-1.5 text-sm"
        />
      </div>
      <div className="flex flex-wrap items-start gap-2">
        <button
          type="button"
          disabled={update.isPending}
          onClick={() =>
            update.mutate({
              providerId: p.id,
              approved: !p.approved,
            })
          }
          className="rounded-sm bg-primary px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-primary-foreground disabled:opacity-50"
        >
          {p.approved ? "Unapprove" : "Approve"}
        </button>
        <button
          type="button"
          disabled={update.isPending}
          onClick={() =>
            update.mutate({
              providerId: p.id,
              stripeAccountId: stripeId || null,
            })
          }
          className="rounded-sm border border-primary/20 px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-primary"
        >
          Save Stripe
        </button>
        <button
          type="button"
          disabled={update.isPending || !p.approved}
          onClick={() =>
            update.mutate({
              providerId: p.id,
              payoutFlag: !p.payoutFlagged,
            })
          }
          className="rounded-sm border border-accent/40 px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-accent disabled:opacity-50"
        >
          {p.payoutFlagged ? "Clear flag" : "Flag payout"}
        </button>
        {update.isSuccess && <span className="text-xs text-accent">Saved</span>}
        {update.isError && (
          <span className="text-xs text-destructive">{update.error.message}</span>
        )}
      </div>
    </li>
  );
}

export function AdminProvidersPanel() {
  const { data, isLoading, error } = useAdminProviders();

  if (isLoading) return <p className="text-sm text-muted-foreground">Loading providers…</p>;
  if (error) return <p className="text-sm text-destructive">{error.message}</p>;

  const providers = data ?? [];
  const flagged = providers.filter((p) => p.payoutFlagged).length;

  return (
    <section id="providers" className="space-y-4">
      <div>
        <h2 className="font-display text-xl font-semibold text-primary">Providers</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Stock health, verification, Stripe Connect IDs, and payout flags
          {flagged > 0 ? ` · ${flagged} flagged` : ""}.
        </p>
      </div>
      {providers.length === 0 ? (
        <p className="text-sm text-muted-foreground">No providers yet.</p>
      ) : (
        <ul>
          {providers.map((p) => (
            <ProviderRow key={p.id} p={p} />
          ))}
        </ul>
      )}
    </section>
  );
}
