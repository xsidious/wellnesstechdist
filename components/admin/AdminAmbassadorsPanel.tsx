"use client";

import { formatCents } from "@/lib/utils";
import { useAdminAmbassadors } from "@/lib/api/admin";

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
          Ranked by wallet balance · attributed GMV from paid orders.
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="border-b border-primary/15 text-[10px] uppercase tracking-widest text-muted-foreground">
            <tr>
              <th className="py-2 pr-3">Rank</th>
              <th className="py-2 pr-3">Code</th>
              <th className="py-2 pr-3">Email</th>
              <th className="py-2 pr-3">GMV</th>
              <th className="py-2 pr-3">Orders</th>
              <th className="py-2 pr-3">Wallet</th>
              <th className="py-2">Links</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map((row) => (
              <tr key={row.id} className="border-b border-primary/10">
                <td className="py-3 pr-3 font-semibold text-accent">#{row.rank}</td>
                <td className="py-3 pr-3 font-medium">{row.code}</td>
                <td className="py-3 pr-3 text-muted-foreground">{row.email}</td>
                <td className="py-3 pr-3">{formatCents(row.attributedGmvCents)}</td>
                <td className="py-3 pr-3">{row.orderCount}</td>
                <td className="py-3 pr-3">{formatCents(row.walletBalanceCents)}</td>
                <td className="py-3">{row.linkCount}</td>
              </tr>
            ))}
            {leaderboard.length === 0 && (
              <tr>
                <td colSpan={7} className="py-4 text-muted-foreground">
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
