import { AdminUsersPanel } from "@/components/admin/AdminUsersPanel";

export const dynamic = "force-dynamic";

export default function AdminUsersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-semibold text-primary">Users</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Create accounts, reset passwords, and manage roles across the marketplace.
        </p>
      </div>
      <AdminUsersPanel />
    </div>
  );
}
