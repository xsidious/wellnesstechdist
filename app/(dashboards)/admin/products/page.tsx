import { AdminProductsPanel } from "@/components/admin/AdminProductsPanel";

export const dynamic = "force-dynamic";

export default function AdminProductsPage() {
  return (
    <div className="space-y-10">
      <div>
        <h1 className="font-display text-3xl font-semibold text-primary">Products</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Cross-provider catalog — create listings, edit stock, activate or deactivate.
        </p>
      </div>
      <AdminProductsPanel />
    </div>
  );
}
