import { AdminShell } from "@/components/admin/AdminShell";
import { QueryProvider } from "@/components/QueryProvider";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <AdminShell>{children}</AdminShell>
    </QueryProvider>
  );
}
