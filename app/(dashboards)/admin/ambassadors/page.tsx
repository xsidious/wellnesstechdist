import { AdminAmbassadorsPanel } from "@/components/admin/AdminAmbassadorsPanel";
import { AdminCreateAmbassadorForm } from "@/components/admin/AdminCreateUserForms";

export const dynamic = "force-dynamic";

export default function AdminAmbassadorsPage() {
  return (
    <div className="space-y-10">
      <div>
        <h1 className="font-display text-3xl font-semibold text-primary">Ambassadors</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Leaderboard, create accounts, and track attributed GMV.
        </p>
      </div>
      <AdminCreateAmbassadorForm />
      <AdminAmbassadorsPanel />
    </div>
  );
}
