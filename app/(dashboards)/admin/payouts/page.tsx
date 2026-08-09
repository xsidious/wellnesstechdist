import { AdminPayoutsPanel } from "@/components/admin/AdminPayoutsPanel";

export const dynamic = "force-dynamic";

export default function AdminPayoutsPage() {
  return (
    <div className="space-y-10">
      <div>
        <h1 className="font-display text-3xl font-semibold text-primary">Payouts & tiers</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Commission tiers and ledger payout runs.
        </p>
      </div>
      <AdminPayoutsPanel />
    </div>
  );
}
