"use client";

import { useState } from "react";
import { formatCents } from "@/lib/utils";
import {
  useAdminAmbassadors,
  useUpdateAmbassador,
  type AmbassadorLeaderboardRow,
} from "@/lib/api/admin";

function AmbassadorRow({ row }: { row: AmbassadorLeaderboardRow }) {
  const update = useUpdateAmbassador();
  const [open, setOpen] = useState(false);
  const [code, setCode] = useState(row.code);
  const [adjust, setAdjust] = useState("0");

  return (
    <>
      <tr className="border-b border-primary/10">
        <td className="py-3 pr-3 font-semibold text-accent">#{row.rank}</td>
        <td className="py-3 pr-3 font-medium">{row.code}</td>
        <td className="py-3 pr-3 text-muted-foreground">{row.email}</td>
        <td className="py-3 pr-3">{formatCents(row.attributedGmvCents)}</td>
        <td className="py-3 pr-3">{row.orderCount}</td>
        <td className="py-3 pr-3">{formatCents(row.walletBalanceCents)}</td>
        <td className="py-3 pr-3">{row.linkCount}</td>
        <td className="py-3">
          <button
            type="button"
            className="text-xs font-semibold uppercase tracking-wider text-accent"
            onClick={() => setOpen(!open)}
          >
            {open ? "Close" : "Manage"}
          </button>
        </td>
      </tr>
      {open && (
        <tr>
          <td colSpan={8} className="pb-4">
            <form
              className="grid gap-3 rounded-sm border border-primary/10 bg-card p-4 md:grid-cols-3"
              onSubmit={(e) => {
                e.preventDefault();
                const walletAdjustCents = Number(adjust);
                update.mutate({
                  ambassadorId: row.id,
                  code: code !== row.code ? code : undefined,
                  walletAdjustCents:
                    Number.isFinite(walletAdjustCents) && walletAdjustCents !== 0
                      ? walletAdjustCents
                      : undefined,
                });
                setAdjust("0");
              }}
            >
              <label className="block text-xs">
                <span className="font-semibold uppercase tracking-widest text-muted-foreground">
                  Referral code
                </span>
                <input
                  className="mt-1 w-full rounded-sm border border-input px-2 py-1.5 text-sm"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                />
              </label>
              <label className="block text-xs">
                <span className="font-semibold uppercase tracking-widest text-muted-foreground">
                  Wallet adjust (¢)
                </span>
                <input
                  type="number"
                  className="mt-1 w-full rounded-sm border border-input px-2 py-1.5 text-sm"
                  value={adjust}
                  onChange={(e) => setAdjust(e.target.value)}
                  placeholder="+500 or -500"
                />
              </label>
              <div className="flex items-end">
                <button
                  type="submit"
                  disabled={update.isPending}
                  className="rounded-sm bg-primary px-4 py-2 text-[10px] font-semibold uppercase tracking-wider text-primary-foreground"
                >
                  Save changes
                </button>
              </div>
              {update.isSuccess && (
                <p className="text-xs text-accent md:col-span-3">Ambassador updated.</p>
              )}
              {update.isError && (
                <p className="text-xs text-destructive md:col-span-3">{update.error.message}</p>
              )}
            </form>
          </td>
        </tr>
      )}
    </>
  );
}

export function AdminAmbassadorsPanel() {
  const { data, isLoading, error } = useAdminAmbassadors();

  if (isLoading) return <p className="text-sm text-muted-foreground">Loading ambassadors…</p>;
  if (error) return <p className="text-sm text-destructive">{error.message}</p>;

  const leaderboard = data?.leaderboard ?? [];

  return (
    <section className="space-y-4">
      <div>
        <h2 className="font-display text-xl font-semibold text-primary">Leaderboard</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Ranked by wallet balance · edit codes and adjust wallets from Manage.
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b border-primary/15 text-[10px] uppercase tracking-widest text-muted-foreground">
            <tr>
              <th className="py-2 pr-3">Rank</th>
              <th className="py-2 pr-3">Code</th>
              <th className="py-2 pr-3">Email</th>
              <th className="py-2 pr-3">GMV</th>
              <th className="py-2 pr-3">Orders</th>
              <th className="py-2 pr-3">Wallet</th>
              <th className="py-2 pr-3">Links</th>
              <th className="py-2"> </th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map((row) => (
              <AmbassadorRow key={row.id} row={row} />
            ))}
            {leaderboard.length === 0 && (
              <tr>
                <td colSpan={8} className="py-4 text-muted-foreground">
                  No ambassadors yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
