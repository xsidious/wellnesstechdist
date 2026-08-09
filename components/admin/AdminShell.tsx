"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";

const NAV = [
  { href: "/admin", label: "Overview", exact: true },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/providers", label: "Providers" },
  { href: "/admin/ambassadors", label: "Ambassadors" },
  { href: "/admin/users", label: "Users" },
  { href: "/admin/content", label: "Site content" },
  { href: "/admin/payouts", label: "Payouts & tiers" },
  { href: "/shop", label: "View shop", external: true },
] as const;

function isActive(pathname: string, href: string, exact?: boolean) {
  if (exact) return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-muted/40 lg:flex">
      <div
        className={`fixed inset-0 z-40 bg-primary/40 lg:hidden ${open ? "block" : "hidden"}`}
        onClick={() => setOpen(false)}
        aria-hidden
      />
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-primary/10 bg-background transition-transform lg:static lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-14 items-center justify-between border-b border-primary/10 px-5">
          <Link href="/" className="font-display text-sm font-semibold text-primary">
            WTBD
          </Link>
          <span className="text-[10px] font-semibold uppercase tracking-widest text-accent">Admin</span>
        </div>
        <nav className="flex-1 space-y-0.5 overflow-y-auto p-3">
          {NAV.map((item) => {
            const active =
              "external" in item && item.external
                ? false
                : isActive(pathname, item.href, "exact" in item ? item.exact : false);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`block rounded-sm px-3 py-2.5 text-sm transition ${
                  active
                    ? "bg-primary text-primary-foreground"
                    : "text-primary/75 hover:bg-primary/5 hover:text-primary"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-primary/10 p-4 text-xs text-muted-foreground">
          <Link href="/account" className="hover:text-primary">
            Account
          </Link>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-14 items-center gap-3 border-b border-primary/10 bg-background px-4 lg:px-8">
          <button
            type="button"
            className="rounded-sm border border-primary/15 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary lg:hidden"
            onClick={() => setOpen(true)}
          >
            Menu
          </button>
          <p className="text-sm text-muted-foreground">Marketplace control center</p>
        </header>
        <main className="flex-1 px-4 py-8 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
