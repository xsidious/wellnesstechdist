import { AdminOrdersPanel } from "@/components/admin/AdminOrdersPanel";

export const dynamic = "force-dynamic";

export default function AdminOrdersPage() {
  return (
    <div className="space-y-10">
      <div>
        <h1 className="font-display text-3xl font-semibold text-primary">Orders</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Marketplace orders, sub-order fulfillment, and status overrides.
        </p>
      </div>
      <AdminOrdersPanel />
    </div>
  );
}
