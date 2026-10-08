import { redirect } from "next/navigation";
import { PortalFrame } from "@/components/PortalFrame";
import { requireUser, rolesOf } from "@/lib/guard";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser("/admin");
  if (!rolesOf(user.roles).includes("admin")) redirect("/portal");
  return <PortalFrame user={user}>{children}</PortalFrame>;
}
