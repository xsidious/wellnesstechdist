"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const nav = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/products", label: "Compounded Therapies" },
  { href: "/exosomes", label: "Exosomes" },
  { href: "/shop", label: "Shop" },
  { href: "/supplies", label: "Supplies" },
  { href: "/prescribers", label: "Prescribers" },
  { href: "/training", label: "Training" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
];

export type HeaderUser = {
  role: string;
  name?: string | null;
  email?: string | null;
};

function dashboardForRole(role: string): { href: string; label: string } {
  switch (role) {
    case "ADMIN":
      return { href: "/admin", label: "Admin dashboard" };
    case "PROVIDER":
      return { href: "/provider", label: "Provider dashboard" };
    case "AMBASSADOR":
      return { href: "/ambassador", label: "Ambassador dashboard" };
    default:
      return { href: "/account", label: "My account" };
  }
}

export function SiteHeader({ user }: { user?: HeaderUser | null }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const dash = user ? dashboardForRole(user.role) : null;

  return (
    <header className="sticky top-0 z-50 border-b border-primary/10 bg-white">
      <div className="container-x flex h-16 items-center justify-between">
        <Link href="/" className="flex shrink-0 items-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/wellness-tech-logo.png"
            alt="Wellness Tech Distribution"
            className="h-11 w-auto max-w-[200px] object-contain object-left sm:h-12 sm:max-w-[240px]"
          />
        </Link>
        <nav className="hidden items-center gap-6 lg:flex">
          {nav.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                pathname === n.href ? "text-primary" : "text-primary/70"
              }`}
            >
              {n.label}
            </Link>
          ))}
          <Link
            href="/register?role=PROVIDER"
            className={`text-sm font-medium transition-colors hover:text-accent/80 ${
              pathname.startsWith("/register") || pathname.startsWith("/prescribers")
                ? "text-accent"
                : "text-accent"
            }`}
          >
            Become a Prescriber
          </Link>
          <Link
            href="/affiliates"
            className={`text-sm font-medium transition-colors hover:text-accent/80 ${
              pathname === "/affiliates" ? "text-accent" : "text-accent"
            }`}
          >
            Become an Affiliate
          </Link>
          {dash ? (
            <Link
              href={dash.href}
              className="rounded-sm border border-accent/40 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-accent transition hover:bg-accent/10"
            >
              {dash.label}
            </Link>
          ) : (
            <Link
              href="/login"
              className="text-sm font-medium text-primary/70 transition-colors hover:text-primary"
            >
              Sign in
            </Link>
          )}
          <Link
            href="/cart"
            className="rounded-sm bg-primary px-4 py-2 text-xs font-semibold uppercase tracking-wider text-primary-foreground transition hover:bg-primary/90"
          >
            Cart
          </Link>
        </nav>
        <button
          onClick={() => setOpen(!open)}
          className="lg:hidden"
          aria-label="Menu"
          type="button"
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>
      {open && (
        <div className="border-t border-primary/10 lg:hidden">
          <div className="container-x flex flex-col gap-1 py-4">
            {nav.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                onClick={() => setOpen(false)}
                className="rounded-sm px-2 py-2 text-sm font-medium text-primary/80"
              >
                {n.label}
              </Link>
            ))}
            <Link
              href="/register?role=PROVIDER"
              onClick={() => setOpen(false)}
              className="px-2 py-2 text-sm text-accent"
            >
              Become a Prescriber
            </Link>
            <Link
              href="/affiliates"
              onClick={() => setOpen(false)}
              className="px-2 py-2 text-sm text-accent"
            >
              Become an Affiliate
            </Link>
            {dash ? (
              <Link
                href={dash.href}
                onClick={() => setOpen(false)}
                className="px-2 py-2 text-sm font-semibold text-accent"
              >
                {dash.label}
              </Link>
            ) : (
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="px-2 py-2 text-sm font-medium"
              >
                Sign in
              </Link>
            )}
            <Link
              href="/cart"
              onClick={() => setOpen(false)}
              className="px-2 py-2 text-sm font-semibold"
            >
              Cart
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
