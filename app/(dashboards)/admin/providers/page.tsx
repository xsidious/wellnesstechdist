import { AdminProvidersPanel } from "@/components/admin/AdminProvidersPanel";
import { AdminCreateProviderForm } from "@/components/admin/AdminCreateUserForms";

export const dynamic = "force-dynamic";

export default function AdminProvidersPage() {
  return (
    <div className="space-y-10">
      <div>
        <h1 className="font-display text-3xl font-semibold text-primary">Providers</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Approve clinics, set Stripe Connect IDs, flag payouts, and create provider accounts.
        </p>
      </div>
      <AdminCreateProviderForm />
      <AdminProvidersPanel />
    </div>
  );
}
