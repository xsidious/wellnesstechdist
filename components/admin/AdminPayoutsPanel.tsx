"use client";

import { useState } from "react";
import { formatCents } from "@/lib/utils";
import {
  useAdminAmbassadors,
  useUpdateCommissionTiers,
  useAdminPayouts,
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
  const payout = useAdminPayouts();
  const [editing, setEditing] = useState<CommissionTier | null>(null);

  if (isLoading) return <p className="text-sm text-muted-foreground">Loading…</p>;
  if (error) return <p className="text-sm text-destructive">{error.message}</p>;

  const tiers = data?.tiers ?? [];

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

      <section className="space-y-3">
        <h2 className="font-display text-xl font-semibold text-primary">Payouts</h2>
        <p className="text-sm text-muted-foreground">
          Run ledger payouts for AVAILABLE entries. Flagged mode only pays providers you flagged.
        </p>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            disabled={payout.isPending}
            onClick={() => payout.mutate(false)}
            className="rounded-sm bg-primary px-4 py-2 text-xs font-semibold uppercase tracking-wider text-primary-foreground"
          >
            Pay all available
          </button>
          <button
            type="button"
            disabled={payout.isPending}
            onClick={() => payout.mutate(true)}
            className="rounded-sm border border-accent/40 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-accent"
          >
            Pay flagged providers only
          </button>
        </div>
        {payout.isSuccess && (
          <p className="text-sm text-accent">
            Paid {payout.data.paid} entries ({payout.data.mode}).
          </p>
        )}
        {payout.isError && (
          <p className="text-sm text-destructive">{payout.error.message}</p>
        )}
      </section>
    </div>
  );
}
