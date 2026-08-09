import { DashboardShell } from "@/components/SiteLayout";

const nav = [
  { href: "/provider", label: "Overview" },
  { href: "/provider#products", label: "Products" },
  { href: "/provider#orders", label: "Orders" },
  { href: "/provider/products/new", label: "New product" },
  { href: "/shop", label: "Shop" },
];

export default function ProviderLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardShell title="Provider" nav={nav}>
      {children}
    </DashboardShell>
  );
}
