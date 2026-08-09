import { ProviderDashboard } from "@/components/provider/ProviderDashboard";

export const dynamic = "force-dynamic";

export default function ProviderPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-semibold text-primary">Provider dashboard</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Manage variable products, stock, and multi-provider fulfillment.
        </p>
        <nav className="mt-4 flex flex-wrap gap-4 text-xs font-semibold uppercase tracking-wider text-accent">
          <a href="#products">Products</a>
          <a href="#orders">Orders</a>
          <a href="#quick-create">Quick add</a>
          <a href="/provider/products/new">New product</a>
        </nav>
      </div>
      <ProviderDashboard />
    </div>
  );
}
