import type { Metadata } from "next";
import Link from "next/link";
import { LoginForm } from "@/components/LoginForm";

export const metadata: Metadata = { title: "Login" };

type SearchParams = Promise<{ callbackUrl?: string; error?: string; registered?: string }>;

export default async function LoginPage({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams;

  return (
    <section className="px-3 py-8 md:py-12">
      <div className="container-x flex min-h-[60vh] items-center justify-center">
        <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl border border-primary/10 bg-white shadow-[0_24px_80px_rgba(15,40,60,0.08)] md:grid-cols-2">
          <div className="relative hidden bg-primary p-10 text-primary-foreground md:flex md:flex-col md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
                Practitioner portal
              </p>
              <h1 className="mt-4 font-display text-3xl font-semibold leading-tight">
                Sign in to your Wellness Tech workspace.
              </h1>
              <p className="mt-4 text-sm leading-relaxed text-primary-foreground/80">
                Providers, ambassadors, and admins each land in their own dashboard after login —
                orders, approvals, commissions, and catalog controls in one secure B2B system.
              </p>
            </div>
            <ul className="mt-10 space-y-3 text-sm text-primary-foreground/85">
              <li>Admin → marketplace control center</li>
              <li>Provider → catalog & fulfillment</li>
              <li>Ambassador → referrals & wallet</li>
            </ul>
          </div>

          <div className="p-8 md:p-10">
            <h2 className="font-display text-2xl font-semibold text-primary md:hidden">Sign in</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              No account? Register as{" "}
              <Link
                href="/register?role=PROVIDER"
                className="font-medium text-primary underline-offset-4 hover:underline"
              >
                Provider
              </Link>{" "}
              or{" "}
              <Link
                href="/register?role=AMBASSADOR"
                className="font-medium text-primary underline-offset-4 hover:underline"
              >
                Ambassador
              </Link>
              .
            </p>

            <LoginForm
              callbackUrl={sp.callbackUrl}
              registered={sp.registered}
              initialError={sp.error}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
