"use client";

import { useState } from "react";
import { formatCents } from "@/lib/utils";
import {
  useAdminAmbassadors,
  useUpdateCommissionTiers,
  useAdminPayouts,
  useAdminPayoutLedger,
  type CommissionTier,
} from "@/lib/api/admin";

function TierForm({
  initial,
  onDone,
}: {
  initial?: CommissionTier;
  onDone?: () => void;
}) {
  const update = useUpdateCommissionTiers();
  const [name, setName] = useState(initial?.name || "");
  const [percentBps, setPercentBps] = useState(String(initial?.percentBps ?? 500));
  const [minOrderCents, setMinOrderCents] = useState(String(initial?.minOrderCents ?? 0));
  const [active, setActive] = useState(initial?.active ?? true);

  return (
    <form
      className="grid gap-3 rounded-sm border border-primary/10 bg-card p-4 md:grid-cols-4"
      onSubmit={(e) => {
        e.preventDefault();
        update.mutate(
          {
            action: "upsert_tier",
            id: initial?.id,
            name,
            percentBps: Number(percentBps),
            minOrderCents: Number(minOrderCents),
            active,
          },
          { onSuccess: () => onDone?.() },
        );
      }}
    >
      <label className="block text-xs">
        <span className="font-semibold uppercase tracking-widest text-muted-foreground">Name</span>
        <input
          className="mt-1 w-full rounded-sm border border-input px-2 py-1.5"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </label>
      <label className="block text-xs">
        <span className="font-semibold uppercase tracking-widest text-muted-foreground">
          Commission (bps)
        </span>
        <input
          type="number"
          className="mt-1 w-full rounded-sm border border-input px-2 py-1.5"
          value={percentBps}
          onChange={(e) => setPercentBps(e.target.value)}
          required
        />
      </label>
      <label className="block text-xs">
        <span className="font-semibold uppercase tracking-widest text-muted-foreground">
          Min order (¢)
        </span>
        <input
          type="number"
          className="mt-1 w-full rounded-sm border border-input px-2 py-1.5"
          value={minOrderCents}
          onChange={(e) => setMinOrderCents(e.target.value)}
          required
        />
      </label>
      <div className="flex items-end gap-3">
        <label className="flex items-center gap-2 text-xs">
          <input type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} />
          Active
        </label>
        <button
          type="submit"
          disabled={update.isPending}
          className="rounded-sm bg-primary px-4 py-2 text-[10px] font-semibold uppercase tracking-wider text-primary-foreground"
        >
          {initial ? "Update" : "Add tier"}
        </button>
      </div>
      {update.isError && (
        <p className="md:col-span-4 text-xs text-destructive">{update.error.message}</p>
      )}
    </form>
  );
}

export function AdminPayoutsPanel() {
  const { data, isLoading, error } = useAdminAmbassadors();
  const ledger = useAdminPayoutLedger();
  const payout = useAdminPayouts();
  const [editing, setEditing] = useState<CommissionTier | null>(null);

  if (isLoading) return <p className="text-sm text-muted-foreground">Loading…</p>;
  if (error) return <p className="text-sm text-destructive">{error.message}</p>;

  const tiers = data?.tiers ?? [];
  const summary = ledger.data?.summary;
  const available = ledger.data?.available ?? [];
  const recent = ledger.data?.recentPayouts ?? [];

  return (
    <div className="space-y-10">
      <section className="space-y-4">
        <div>
          <h2 className="font-display text-xl font-semibold text-primary">Commission tiers</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Dynamic tiers by minimum order size (basis points).
          </p>
        </div>
        <ul className="divide-y divide-primary/10 border-t border-primary/10">
          {tiers.map((t) => (
            <li key={t.id} className="flex flex-wrap items-center justify-between gap-3 py-3 text-sm">
              <span>
                {t.name}{" "}
                {!t.active && <span className="text-muted-foreground">(inactive)</span>}
              </span>
              <span className="text-muted-foreground">
                {(t.percentBps / 100).toFixed(2)}% · min {formatCents(t.minOrderCents)}
              </span>
              <button
                type="button"
                className="text-xs font-semibold uppercase tracking-wider text-accent"
                onClick={() => setEditing(t)}
              >
                Edit
              </button>
            </li>
          ))}
        </ul>
        <TierForm
          key={editing?.id || "new"}
          initial={editing || undefined}
          onDone={() => setEditing(null)}
        />
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="font-display text-xl font-semibold text-primary">Available ledger</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Review AVAILABLE balances before running payouts.
          </p>
        </div>
        {ledger.isLoading && <p className="text-sm text-muted-foreground">Loading ledger…</p>}
        {summary && (
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-sm border border-primary/10 bg-card p-4">
              <div className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                Available total
              </div>
              <div className="mt-1 font-display text-2xl font-semibold text-primary">
                {formatCents(summary.availableCents)}
              </div>
              <div className="text-xs text-muted-foreground">{summary.availableCount} entries</div>
            </div>
            <div className="rounded-sm border border-primary/10 bg-card p-4">
              <div className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                By type
              </div>
              <ul className="mt-2 space-y-1 text-xs">
                {Object.entries(summary.byType).map(([type, cents]) => (
                  <li key={type} className="flex justify-between gap-2">
                    <span>{type}</span>
                    <span>{formatCents(cents)}</span>
                  </li>
                ))}
                {Object.keys(summary.byType).length === 0 && (
                  <li className="text-muted-foreground">Nothing available</li>
                )}
              </ul>
            </div>
            <div className="rounded-sm border border-primary/10 bg-card p-4">
              <div className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                Flagged providers
              </div>
              <div className="mt-1 font-display text-2xl font-semibold text-primary">
                {summary.flaggedProviderIds.length}
              </div>
              <div className="text-xs text-muted-foreground">For flagged-only payout runs</div>
            </div>
          </div>
        )}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="border-b border-primary/15 text-[10px] uppercase tracking-widest text-muted-foreground">
              <tr>
                <th className="py-2 pr-3">Type</th>
                <th className="py-2 pr-3">Party</th>
                <th className="py-2 pr-3">Order</th>
                <th className="py-2">Amount</th>
              </tr>
            </thead>
            <tbody>
              {available.map((e) => (
                <tr key={e.id} className="border-b border-primary/10">
                  <td className="py-2 pr-3">{e.type}</td>
                  <td className="py-2 pr-3 text-muted-foreground">
                    {e.providerName || e.ambassadorCode || "—"}
                  </td>
                  <td className="py-2 pr-3 text-xs text-muted-foreground">
                    {e.orderEmail || e.orderId || "—"}
                  </td>
                  <td className="py-2 font-medium">{formatCents(e.amountCents)}</td>
                </tr>
              ))}
              {!ledger.isLoading && available.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-3 text-muted-foreground">
                    No AVAILABLE ledger entries.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="font-display text-xl font-semibold text-primary">Run payouts</h2>
        <p className="text-sm text-muted-foreground">
          Marks AVAILABLE ledger rows as PAID. Flagged-only mode pays only flagged providers&apos;
          earnings (plus commissions/fees in that run).
        </p>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            disabled={payout.isPending}
            onClick={() => {
              if (confirm("Pay ALL available ledger entries?")) payout.mutate(false);
            }}
            className="rounded-sm bg-primary px-4 py-2 text-xs font-semibold uppercase tracking-wider text-primary-foreground"
          >
            Pay all available
          </button>
          <button
            type="button"
            disabled={payout.isPending || !(summary?.flaggedProviderIds.length)}
            onClick={() => {
              if (confirm("Pay flagged providers only?")) payout.mutate(true);
            }}
            className="rounded-sm border border-accent/40 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-accent disabled:opacity-50"
          >
            Pay flagged providers only
          </button>
        </div>
        {payout.isSuccess && (
          <p className="text-sm text-accent">
            Paid {payout.data.paid} entries ({payout.data.mode}).
          </p>
        )}
        {payout.isError && <p className="text-sm text-destructive">{payout.error.message}</p>}
      </section>

      <section className="space-y-3">
        <h2 className="font-display text-xl font-semibold text-primary">Recent payouts</h2>
        <ul className="divide-y divide-primary/10 border-t border-primary/10 text-sm">
          {recent.map((e) => (
            <li key={e.id} className="flex flex-wrap justify-between gap-2 py-2">
              <div>
                <div>{e.description || "Payout"}</div>
                <div className="text-xs text-muted-foreground">
                  {e.paidAt ? new Date(e.paidAt).toLocaleString() : "—"} ·{" "}
                  {e.orderEmail || e.ambassadorCode || "—"}
                </div>
              </div>
              <div className="font-medium">{formatCents(e.amountCents)}</div>
            </li>
          ))}
          {recent.length === 0 && (
            <li className="py-3 text-muted-foreground">No payout history yet.</li>
          )}
        </ul>
      </section>
    </div>
  );
}
