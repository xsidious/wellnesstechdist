import { AdminContentPanel } from "@/components/admin/AdminContentPanel";

export const dynamic = "force-dynamic";

export default function AdminContentPage() {
  return (
    <div className="space-y-10">
      <div>
        <h1 className="font-display text-3xl font-semibold text-primary">Site content</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Edit key marketing blocks. Empty fields fall back to the hardcoded site copy.
        </p>
      </div>
      <AdminContentPanel />
    </div>
  );
}
