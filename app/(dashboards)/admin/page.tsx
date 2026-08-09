import Link from "next/link";
import { AdminAnalyticsPanel } from "@/components/AdminAnalyticsIsland";
import { AdminRecentOrders } from "@/components/admin/AdminOrdersPanel";

export const dynamic = "force-dynamic";

const QUICK = [
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/providers", label: "Providers" },
  { href: "/admin/ambassadors", label: "Ambassadors" },
  { href: "/admin/users", label: "Users" },
  { href: "/admin/content", label: "Site content" },
  { href: "/admin/payouts", label: "Payouts" },
];

export default function AdminOverviewPage() {
  return (
    <div className="space-y-10">
      <div>
        <h1 className="font-display text-3xl font-semibold text-primary">Overview</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Marketplace analytics and shortcuts into operations.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {QUICK.map((q) => (
          <Link
            key={q.href}
            href={q.href}
            className="rounded-sm border border-primary/15 px-3 py-2 text-xs font-semibold uppercase tracking-wider text-primary hover:border-accent hover:text-accent"
          >
            {q.label}
          </Link>
        ))}
      </div>

      <section className="rounded-sm border border-primary/10 bg-card p-6">
        <AdminAnalyticsPanel />
      </section>

      <AdminRecentOrders />
    </div>
  );
}
