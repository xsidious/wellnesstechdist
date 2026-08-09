"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { ChevronDown, Menu, ShoppingCart, X } from "lucide-react";

type NavLeaf = { href: string; label: string; description?: string };

type NavItem =
  | { type: "link"; href: string; label: string; exact?: boolean }
  | { type: "dropdown"; label: string; items: NavLeaf[] };

/** Primary nav: catalog + resources grouped to keep the bar short. */
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
}: {
  label: string;
  items: NavLeaf[];
  active: boolean;
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
        className={`relative inline-flex items-center gap-1 px-3.5 py-3 text-[13px] font-medium tracking-wide transition-colors ${
          active || open ? "text-primary" : "text-primary/55 hover:text-primary"
        }`}
      >
        {label}
        <ChevronDown
          className={`size-3.5 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
        <span
          className={`absolute inset-x-3 bottom-0 h-[2px] origin-left bg-accent transition-transform duration-300 ${
            active ? "scale-x-100" : "scale-x-0"
          }`}
        />
      </button>
      {open && (
        <div
          role="menu"
          aria-labelledby={id}
          className="absolute left-0 top-full z-50 min-w-[260px] border border-primary/10 bg-white py-2 shadow-[0_12px_40px_rgba(15,40,60,0.08)]"
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

function MobileGroup({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="border-b border-primary/10 py-3">
      <div className="px-4 pb-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-primary/45">
        {title}
      </div>
      <div className="flex flex-col">{children}</div>
    </div>
  );
}

export function SiteHeader({ user }: { user?: HeaderUser | null }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const dash = user ? dashboardForRole(user.role) : null;

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-50 bg-white">
      <div className="border-b border-primary/10">
        <div className="container-x flex h-[4.25rem] items-center justify-between gap-4">
          <Link
            href="/"
            className="flex shrink-0 items-center"
            aria-label="Wellness Tech Distribution home"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/wellness-tech-logo.png"
              alt="Wellness Tech Distribution"
              className="h-11 w-auto max-w-[210px] object-contain object-left sm:h-12 sm:max-w-[230px]"
            />
          </Link>

          <div className="hidden items-center gap-1 lg:flex">
            <NavDropdown
              label="Join"
              items={joinLinks}
              active={dropdownActive(pathname, joinLinks)}
            />
            <span className="mx-1 h-4 w-px bg-primary/15" aria-hidden />
            {dash ? (
              <Link
                href={dash.href}
                className="px-3 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-accent transition hover:text-accent/80"
              >
                {dash.label}
              </Link>
            ) : (
              <Link
                href="/login"
                className="px-3 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-primary/70 transition hover:text-primary"
              >
                Sign in
              </Link>
            )}
            <Link
              href="/cart"
              aria-label="Cart"
              title="Cart"
              className="ml-1 inline-flex size-10 items-center justify-center bg-primary text-primary-foreground transition hover:bg-primary/90"
            >
              <ShoppingCart className="size-4" />
            </Link>
          </div>

          <div className="flex items-center gap-2 lg:hidden">
            <Link
              href="/cart"
              aria-label="Cart"
              className="inline-flex size-10 items-center justify-center border border-primary/15 text-primary transition hover:border-primary/30"
            >
              <ShoppingCart className="size-4" />
            </Link>
            <button
              onClick={() => setOpen((v) => !v)}
              className="inline-flex size-10 items-center justify-center border border-primary/15 text-primary transition hover:border-primary/30"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              type="button"
            >
              {open ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>
      </div>

      <div className="hidden border-b border-primary/10 bg-white lg:block">
        <nav className="container-x flex items-center gap-0.5" aria-label="Primary">
          {primaryNav.map((item) => {
            if (item.type === "link") {
              const active = isActive(pathname, item.href, item.exact);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative px-3.5 py-3 text-[13px] font-medium tracking-wide transition-colors ${
                    active ? "text-primary" : "text-primary/55 hover:text-primary"
                  }`}
                >
                  {item.label}
                  <span
                    className={`absolute inset-x-3 bottom-0 h-[2px] origin-left bg-accent transition-transform duration-300 ${
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
      </div>

      {open && (
        <div className="fixed inset-0 top-[4.25rem] z-50 bg-white lg:hidden">
          <div className="container-x flex h-full flex-col overflow-y-auto pb-10 pt-2">
            <MobileGroup title="Browse">
              {primaryNav
                .filter((i): i is Extract<NavItem, { type: "link" }> => i.type === "link")
                .map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={`px-4 py-3 text-base font-medium ${
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
                      onClick={() => setOpen(false)}
                      className={`px-4 py-3 text-base font-medium ${
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
                  onClick={() => setOpen(false)}
                  className="px-4 py-3 text-base font-medium text-primary/70"
                >
                  {item.label}
                </Link>
              ))}
            </MobileGroup>

            <div className="mt-6 grid grid-cols-2 gap-2 px-4">
              {dash ? (
                <Link
                  href={dash.href}
                  onClick={() => setOpen(false)}
                  className="border border-accent/40 px-4 py-3 text-center text-xs font-semibold uppercase tracking-[0.14em] text-accent"
                >
                  {dash.label}
                </Link>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setOpen(false)}
                  className="border border-primary/20 px-4 py-3 text-center text-xs font-semibold uppercase tracking-[0.14em] text-primary"
                >
                  Sign in
                </Link>
              )}
              <Link
                href="/cart"
                onClick={() => setOpen(false)}
                aria-label="Cart"
                className="inline-flex items-center justify-center bg-primary px-4 py-3 text-primary-foreground"
              >
                <ShoppingCart className="size-4" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
