import { DashboardShell } from "@/components/SiteLayout";

const nav = [
  { href: "/account", label: "Orders" },
  { href: "/shop", label: "Shop" },
  { href: "/", label: "Home" },
];

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardShell title="Account" nav={nav}>
      {children}
    </DashboardShell>
  );
}
