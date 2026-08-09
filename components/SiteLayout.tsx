import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { AgeGate } from "@/components/AgeGate";
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
    <div className="flex min-h-screen flex-col">
      <SiteHeader user={user} />
      <main className="flex-1">{children}</main>
      <SiteFooter />
      <AgeGate />
    </div>
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
      <header className="border-b border-primary/10 bg-background">
        <div className="container-x flex h-14 items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="font-display text-sm font-semibold text-primary">
              WTBD
            </Link>
            <span className="text-xs font-semibold uppercase tracking-widest text-accent">
              {title}
            </span>
          </div>
          <nav className="flex gap-4">
            {nav.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className="text-sm text-primary/70 hover:text-primary"
              >
                {n.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>
      <div className="container-x py-10">{children}</div>
    </div>
  );
}
