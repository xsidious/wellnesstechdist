"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { ChevronDown, Menu, ShoppingCart, X } from "lucide-react";
import { useCartUi } from "@/components/cart/CartProvider";
import { dashboardPathForRole } from "@/lib/auth-redirect";

type NavLeaf = { href: string; label: string; description?: string };

type NavItem =
  | { type: "link"; href: string; label: string; exact?: boolean }
  | { type: "dropdown"; label: string; items: NavLeaf[] };

const primaryNav: NavItem[] = [
  { type: "link", href: "/", label: "Home", exact: true },
  { type: "link", href: "/about", label: "About" },
  {
    type: "dropdown",
    label: "Catalog",
    items: [
      {
        href: "/products",
        label: "Compounded Therapies",
        description: "Peptides, GLP-1s, and Rx formularies",
      },
      {
        href: "/exosomes",
        label: "Exosomes",
        description: "Korean aesthetic systems",
      },
      {
        href: "/shop",
        label: "Shop",
        description: "Marketplace ordering",
      },
      {
        href: "/supplies",
        label: "Supplies",
        description: "Clinical consumables & equipment",
      },
    ],
  },
  {
    type: "dropdown",
    label: "Resources",
    items: [
      {
        href: "/faq",
        label: "FAQ",
        description: "Common questions",
      },
      {
        href: "/compliance",
        label: "503A / 503B",
        description: "Compounding compliance",
      },
      {
        href: "/prescribers",
        label: "For Prescribers",
        description: "Credentialing & practice access",
      },
      {
        href: "/training",
        label: "Training",
        description: "Clinician education & protocols",
      },
    ],
  },
  { type: "link", href: "/contact", label: "Contact" },
];

const joinLinks: NavLeaf[] = [
  {
    href: "/register?role=PROVIDER",
    label: "Become a Prescriber",
    description: "NPI verification & practice signup",
  },
  {
    href: "/affiliates",
    label: "Become an Affiliate",
    description: "Sales partner program",
  },
];

export type HeaderUser = {
  role: string;
  name?: string | null;
  email?: string | null;
};

function dashboardLabel(role: string): string {
  switch (role) {
    case "ADMIN":
      return "Admin";
    case "PROVIDER":
      return "Provider";
    case "AMBASSADOR":
      return "Ambassador";
    default:
      return "Account";
  }
}

function isActive(pathname: string, href: string, exact?: boolean) {
  const path = href.split("?")[0];
  if (exact || path === "/") return pathname === path;
  return pathname === path || pathname.startsWith(`${path}/`);
}

function dropdownActive(pathname: string, items: NavLeaf[]) {
  return items.some((item) => isActive(pathname, item.href));
}

function NavDropdown({
  label,
  items,
  active,
  align = "left",
}: {
  label: string;
  items: NavLeaf[];
  active: boolean;
  align?: "left" | "right";
}) {
  const [open, setOpen] = useState(false);
  const id = useId();
  const ref = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function clearClose() {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  }

  function scheduleClose() {
    clearClose();
    closeTimer.current = setTimeout(() => setOpen(false), 120);
  }

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
      clearClose();
    };
  }, []);

  return (
    <div
      ref={ref}
      className="relative"
      onMouseEnter={() => {
        clearClose();
        setOpen(true);
      }}
      onMouseLeave={scheduleClose}
    >
      <button
        type="button"
        id={id}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className={`inline-flex items-center gap-1 rounded-full px-3 py-2 text-[13px] font-medium tracking-wide transition-colors ${
          active || open
            ? "bg-primary/[0.06] text-primary"
            : "text-primary/65 hover:bg-primary/[0.04] hover:text-primary"
        }`}
      >
        {label}
        <ChevronDown
          className={`size-3.5 opacity-70 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
      {open && (
        <div
          role="menu"
          aria-labelledby={id}
          className={`absolute top-[calc(100%+0.55rem)] z-50 min-w-[270px] overflow-hidden rounded-2xl border border-primary/10 bg-white/95 py-2 shadow-[0_20px_50px_rgba(15,40,60,0.12)] backdrop-blur-md ${
            align === "right" ? "right-0" : "left-0"
          }`}
        >
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              role="menuitem"
              onClick={() => setOpen(false)}
              className="block px-4 py-2.5 transition hover:bg-primary/[0.04]"
            >
              <span className="block text-sm font-medium text-primary">{item.label}</span>
              {item.description && (
                <span className="mt-0.5 block text-xs text-muted-foreground">
                  {item.description}
                </span>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function MobileGroup({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="border-b border-primary/10 py-3">
      <div className="px-1 pb-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-primary/40">
        {title}
      </div>
      <div className="flex flex-col">{children}</div>
    </div>
  );
}

export function SiteHeader({ user }: { user?: HeaderUser | null }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const dash = user
    ? { href: dashboardPathForRole(user.role), label: dashboardLabel(user.role) }
    : null;
  const { openCart, cart } = useCartUi();

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [menuOpen]);

  return (
    <header className="sticky top-0 z-50 px-3 pt-3 pb-2">
      <div className="container-x rounded-2xl border border-primary/10 bg-white/90 shadow-[0_12px_40px_rgba(15,40,60,0.08)] backdrop-blur-xl">
        <div className="flex h-[4.25rem] items-center gap-3 px-3 sm:px-4 xl:gap-5">
          <Link
            href="/"
            className="flex shrink-0 items-center"
            aria-label="Wellness Tech Distribution home"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/wellness-tech-logo.png"
              alt="Wellness Tech Distribution"
              className="h-10 w-auto max-w-[180px] object-contain object-left sm:h-11 sm:max-w-[200px]"
            />
          </Link>

          <nav
            className="ml-1 hidden min-w-0 flex-1 items-center justify-center gap-0.5 lg:flex"
            aria-label="Primary"
          >
            {primaryNav.map((item) => {
              if (item.type === "link") {
                const active = isActive(pathname, item.href, item.exact);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`rounded-full px-3 py-2 text-[13px] font-medium tracking-wide transition-colors ${
                      active
                        ? "bg-primary/[0.06] text-primary"
                        : "text-primary/65 hover:bg-primary/[0.04] hover:text-primary"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              }
              return (
                <NavDropdown
                  key={item.label}
                  label={item.label}
                  items={item.items}
                  active={dropdownActive(pathname, item.items)}
                />
              );
            })}
          </nav>

          <div className="ml-auto hidden items-center gap-1.5 lg:flex">
            <NavDropdown
              label="Join"
              items={joinLinks}
              active={dropdownActive(pathname, joinLinks)}
              align="right"
            />
            {dash ? (
              <Link
                href={dash.href}
                className="rounded-full bg-accent/20 px-3.5 py-2 text-[13px] font-semibold text-accent-foreground transition hover:bg-accent/30"
              >
                {dash.label}
              </Link>
            ) : (
              <Link
                href="/login"
                className="rounded-full px-3.5 py-2 text-[13px] font-medium text-primary/70 transition hover:bg-primary/[0.04] hover:text-primary"
              >
                Sign in
              </Link>
            )}
            <Link
              href="/register?role=PROVIDER"
              className="ml-1 hidden rounded-full bg-primary px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-primary-foreground shadow-[0_8px_20px_rgba(20,70,100,0.2)] transition hover:bg-primary/90 xl:inline-flex"
            >
              Get access
            </Link>
            <button
              type="button"
              onClick={openCart}
              aria-label={`Open cart${cart.count ? `, ${cart.count} items` : ""}`}
              className="relative ml-0.5 inline-flex size-10 items-center justify-center rounded-full border border-primary/12 text-primary transition hover:border-primary/30 hover:bg-primary/[0.04]"
            >
              <ShoppingCart className="size-4" />
              {cart.count > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-semibold text-accent-foreground">
                  {cart.count > 99 ? "99+" : cart.count}
                </span>
              )}
            </button>
          </div>

          <div className="ml-auto flex items-center gap-2 lg:hidden">
            <button
              type="button"
              onClick={openCart}
              aria-label={`Open cart${cart.count ? `, ${cart.count} items` : ""}`}
              className="relative inline-flex size-10 items-center justify-center rounded-full border border-primary/15 text-primary"
            >
              <ShoppingCart className="size-4" />
              {cart.count > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-semibold text-accent-foreground">
                  {cart.count > 99 ? "99+" : cart.count}
                </span>
              )}
            </button>
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="inline-flex size-10 items-center justify-center rounded-full border border-primary/15 text-primary"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              type="button"
            >
              {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>
      </div>

      {menuOpen && (
        <div className="fixed inset-x-0 bottom-0 top-[5.25rem] z-50 px-3 pb-3 lg:hidden">
          <div className="flex h-full flex-col overflow-y-auto rounded-2xl border border-primary/10 bg-white/95 p-4 shadow-[0_20px_60px_rgba(15,40,60,0.12)] backdrop-blur-xl">
            <MobileGroup title="Menu">
              {primaryNav
                .filter((i): i is Extract<NavItem, { type: "link" }> => i.type === "link")
                .map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className={`rounded-xl px-2 py-3 text-base font-medium ${
                      isActive(pathname, item.href, item.exact)
                        ? "bg-primary/[0.05] text-primary"
                        : "text-primary/70"
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
            </MobileGroup>

            {primaryNav
              .filter((i): i is Extract<NavItem, { type: "dropdown" }> => i.type === "dropdown")
              .map((group) => (
                <MobileGroup key={group.label} title={group.label}>
                  {group.items.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMenuOpen(false)}
                      className={`rounded-xl px-2 py-3 text-base font-medium ${
                        isActive(pathname, item.href) ? "bg-primary/[0.05] text-primary" : "text-primary/70"
                      }`}
                    >
                      {item.label}
                    </Link>
                  ))}
                </MobileGroup>
              ))}

            <MobileGroup title="Join">
              {joinLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className="rounded-xl px-2 py-3 text-base font-medium text-primary/70"
                >
                  {item.label}
                </Link>
              ))}
            </MobileGroup>

            <div className="mt-6 grid gap-2">
              {dash ? (
                <Link
                  href={dash.href}
                  onClick={() => setMenuOpen(false)}
                  className="rounded-full bg-accent/25 px-4 py-3.5 text-center text-xs font-semibold uppercase tracking-[0.14em] text-accent-foreground"
                >
                  {dash.label} dashboard
                </Link>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setMenuOpen(false)}
                  className="rounded-full border border-primary/15 px-4 py-3.5 text-center text-xs font-semibold uppercase tracking-[0.14em] text-primary"
                >
                  Sign in
                </Link>
              )}
              <Link
                href="/register?role=PROVIDER"
                onClick={() => setMenuOpen(false)}
                className="rounded-full bg-primary px-4 py-3.5 text-center text-xs font-semibold uppercase tracking-[0.14em] text-primary-foreground"
              >
                Get practice access
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
