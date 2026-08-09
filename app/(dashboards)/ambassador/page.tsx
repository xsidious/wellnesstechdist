import { AmbassadorDashboard } from "@/components/ambassador/AmbassadorDashboard";

export const dynamic = "force-dynamic";

export default function AmbassadorPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-semibold text-primary">Ambassador dashboard</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Referral links, attributed orders, commission wallet, and ledger.
        </p>
        <nav className="mt-4 flex flex-wrap gap-4 text-xs font-semibold uppercase tracking-wider text-accent">
          <a href="#links">Links</a>
          <a href="#orders">Orders</a>
          <a href="#ledger">Ledger</a>
        </nav>
      </div>
      <AmbassadorDashboard />
    </div>
  );
}
