import { DashboardShell } from "@/components/SiteLayout";

const nav = [
  { href: "/ambassador", label: "Overview" },
  { href: "/ambassador#links", label: "Links" },
  { href: "/ambassador#orders", label: "Orders" },
  { href: "/ambassador#ledger", label: "Ledger" },
  { href: "/shop", label: "Shop" },
];

export default function AmbassadorLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardShell title="Ambassador" nav={nav}>
      {children}
    </DashboardShell>
  );
}
