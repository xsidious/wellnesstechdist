import { PortalFrame } from "@/components/PortalFrame";
import { requireUser } from "@/lib/guard";

export default async function PortalLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser();
  return <PortalFrame user={user}>{children}</PortalFrame>;
}
