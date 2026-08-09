import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { AgeGate } from "@/components/AgeGate";
import { CartProvider } from "@/components/cart/CartProvider";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { auth } from "@/lib/auth";

export async function SiteLayout({ children }: { children: React.ReactNode }) {
  const session = await auth().catch(() => null);
  const user = session?.user
    ? {
        role: session.user.role,
        name: session.user.name,
        email: session.user.email,
      }
    : null;

  return (
    <CartProvider>
      <div className="flex min-h-screen flex-col">
        <SiteHeader user={user} />
        <main className="flex-1">{children}</main>
        <SiteFooter />
        <AgeGate />
        <CartDrawer />
      </div>
    </CartProvider>
  );
}

export function DashboardShell({
  title,
  nav,
  children,
}: {
  title: string;
  nav: { href: string; label: string }[];
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-muted/40">
      <header className="px-3 pt-3">
        <div className="container-x rounded-2xl border border-primary/10 bg-white/90 shadow-[0_10px_30px_rgba(15,40,60,0.06)] backdrop-blur-xl">
          <div className="flex h-14 items-center justify-between px-4">
            <div className="flex items-center gap-6">
              <Link href="/" className="font-display text-sm font-semibold text-primary">
                WTBD
              </Link>
              <span className="text-xs font-semibold uppercase tracking-widest text-accent">
                {title}
              </span>
            </div>
            <nav className="flex gap-1">
              {nav.map((n) => (
                <Link
                  key={n.href}
                  href={n.href}
                  className="rounded-full px-3 py-1.5 text-sm text-primary/70 transition hover:bg-primary/[0.04] hover:text-primary"
                >
                  {n.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </header>
      <div className="container-x py-10">{children}</div>
    </div>
  );
}
