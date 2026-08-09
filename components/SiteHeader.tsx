"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { ChevronDown, Menu, ShoppingCart, X } from "lucide-react";
import { useCartUi } from "@/components/cart/CartProvider";

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
        href: "/training",
        label: "Training",
        description: "Clinician education & protocols",
      },
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

function dashboardForRole(role: string): { href: string; label: string } {
  switch (role) {
    case "ADMIN":
      return { href: "/admin", label: "Admin" };
    case "PROVIDER":
      return { href: "/provider", label: "Provider" };
    case "AMBASSADOR":
      return { href: "/ambassador", label: "Ambassador" };
    default:
      return { href: "/account", label: "Account" };
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
        className={`inline-flex items-center gap-1 px-2.5 py-2 text-[13px] font-medium tracking-wide transition-colors xl:px-3 ${
          active || open ? "text-primary" : "text-primary/60 hover:text-primary"
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
          className={`absolute top-[calc(100%+0.5rem)] z-50 min-w-[250px] border border-primary/10 bg-white py-2 shadow-[0_16px_48px_rgba(15,40,60,0.1)] ${
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
  const dash = user ? dashboardForRole(user.role) : null;
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
    <header className="sticky top-0 z-50 border-b border-primary/10 bg-white">
      <div className="container-x flex h-[4.5rem] items-center gap-3 xl:gap-6">
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
          className="ml-2 hidden min-w-0 flex-1 items-center justify-center gap-0.5 lg:flex"
          aria-label="Primary"
        >
          {primaryNav.map((item) => {
            if (item.type === "link") {
              const active = isActive(pathname, item.href, item.exact);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative px-2.5 py-2 text-[13px] font-medium tracking-wide transition-colors xl:px-3 ${
                    active ? "text-primary" : "text-primary/60 hover:text-primary"
                  }`}
                >
                  {item.label}
                  <span
                    className={`absolute inset-x-2.5 -bottom-0.5 h-[2px] origin-left bg-accent transition-transform duration-300 ${
                      active ? "scale-x-100" : "scale-x-0"
                    }`}
                  />
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

        <div className="ml-auto hidden items-center gap-1 lg:flex">
          <NavDropdown
            label="Join"
            items={joinLinks}
            active={dropdownActive(pathname, joinLinks)}
            align="right"
          />
          {dash ? (
            <Link
              href={dash.href}
              className="px-2.5 py-2 text-[13px] font-medium text-accent transition hover:text-accent/80"
            >
              {dash.label}
            </Link>
          ) : (
            <Link
              href="/login"
              className="px-2.5 py-2 text-[13px] font-medium text-primary/60 transition hover:text-primary"
            >
              Sign in
            </Link>
          )}
          <button
            type="button"
            onClick={openCart}
            aria-label={`Open cart${cart.count ? `, ${cart.count} items` : ""}`}
            className="relative ml-1 inline-flex size-10 items-center justify-center border border-primary/12 text-primary transition hover:border-primary/30 hover:bg-primary/[0.03]"
          >
            <ShoppingCart className="size-4" />
            {cart.count > 0 && (
              <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center bg-accent px-1 text-[10px] font-semibold text-accent-foreground">
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
            className="relative inline-flex size-10 items-center justify-center border border-primary/15 text-primary"
          >
            <ShoppingCart className="size-4" />
            {cart.count > 0 && (
              <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center bg-accent px-1 text-[10px] font-semibold text-accent-foreground">
                {cart.count > 99 ? "99+" : cart.count}
              </span>
            )}
          </button>
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="inline-flex size-10 items-center justify-center border border-primary/15 text-primary"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            type="button"
          >
            {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="fixed inset-0 top-[4.5rem] z-50 bg-white lg:hidden">
          <div className="container-x flex h-full flex-col overflow-y-auto pb-10 pt-2">
            <MobileGroup title="Menu">
              {primaryNav
                .filter((i): i is Extract<NavItem, { type: "link" }> => i.type === "link")
                .map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className={`py-3 text-base font-medium ${
                      isActive(pathname, item.href, item.exact)
                        ? "text-primary"
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
                      className={`py-3 text-base font-medium ${
                        isActive(pathname, item.href) ? "text-primary" : "text-primary/70"
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
                  className="py-3 text-base font-medium text-primary/70"
                >
                  {item.label}
                </Link>
              ))}
            </MobileGroup>

            <div className="mt-6">
              {dash ? (
                <Link
                  href={dash.href}
                  onClick={() => setMenuOpen(false)}
                  className="block border border-accent/40 px-4 py-3 text-center text-xs font-semibold uppercase tracking-[0.14em] text-accent"
                >
                  {dash.label}
                </Link>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setMenuOpen(false)}
                  className="block border border-primary/20 px-4 py-3 text-center text-xs font-semibold uppercase tracking-[0.14em] text-primary"
                >
                  Sign in
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
