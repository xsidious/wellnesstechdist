import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { AuthError } from "next-auth";
import bcrypt from "bcryptjs";
import { ArrowUpRight } from "lucide-react";
import { signIn } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { resolvePostLoginPath } from "@/lib/auth-redirect";

export const metadata: Metadata = { title: "Login" };

type SearchParams = Promise<{ callbackUrl?: string; error?: string; registered?: string }>;

export default async function LoginPage({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams;

  async function loginAction(formData: FormData) {
    "use server";
    const email = String(formData.get("email") || "").toLowerCase().trim();
    const password = String(formData.get("password") || "");
    const callbackUrl = String(formData.get("callbackUrl") || "");

    const user = await prisma.user.findUnique({ where: { email } });
    const valid =
      !!user?.passwordHash && (await bcrypt.compare(password, user.passwordHash));

    if (!valid || !user) {
      const qs = new URLSearchParams({ error: "CredentialsSignin" });
      if (callbackUrl) qs.set("callbackUrl", callbackUrl);
      redirect(`/login?${qs.toString()}`);
    }

    const redirectTo = resolvePostLoginPath(user.role, callbackUrl || null);

    try {
      await signIn("credentials", { email, password, redirectTo });
    } catch (e) {
      if (e instanceof AuthError) {
        const qs = new URLSearchParams({ error: "CredentialsSignin" });
        if (callbackUrl) qs.set("callbackUrl", callbackUrl);
        redirect(`/login?${qs.toString()}`);
      }
      throw e;
    }
  }

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
            <Link href="/register?role=PROVIDER" className="font-medium text-primary underline-offset-4 hover:underline">
              Provider
            </Link>{" "}
            or{" "}
            <Link href="/register?role=AMBASSADOR" className="font-medium text-primary underline-offset-4 hover:underline">
              Ambassador
            </Link>
            .
          </p>

          {sp.registered && (
            <p className="mt-4 rounded-2xl bg-accent/15 px-4 py-3 text-sm text-accent-foreground">
              Account submitted for verification. You can sign in while approval is pending.
            </p>
          )}
          {sp.error && (
            <p className="mt-4 rounded-2xl bg-destructive/10 px-4 py-3 text-sm text-destructive">
              Invalid email or password.
            </p>
          )}

          <form action={loginAction} className="mt-8 space-y-4">
            <input type="hidden" name="callbackUrl" value={sp.callbackUrl || ""} />
            <div>
              <label className="text-xs font-semibold uppercase tracking-widest text-primary/70">
                Email
              </label>
              <input
                name="email"
                type="email"
                required
                autoComplete="email"
                className="mt-2 w-full rounded-2xl border border-input bg-background px-4 py-3 text-sm outline-none transition focus:border-primary/40"
              />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-widest text-primary/70">
                Password
              </label>
              <input
                name="password"
                type="password"
                required
                minLength={6}
                autoComplete="current-password"
                className="mt-2 w-full rounded-2xl border border-input bg-background px-4 py-3 text-sm outline-none transition focus:border-primary/40"
              />
            </div>
            <button
              type="submit"
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3.5 text-xs font-semibold uppercase tracking-[0.14em] text-primary-foreground shadow-[0_12px_28px_rgba(20,70,100,0.22)] transition hover:bg-primary/90"
            >
              Sign in <ArrowUpRight className="size-4" />
            </button>
          </form>

          <p className="mt-6 text-xs leading-relaxed text-muted-foreground">
            After login you are redirected by role: Admin → <code className="text-primary">/admin</code>,
            Provider → <code className="text-primary">/provider</code>, Ambassador →{" "}
            <code className="text-primary">/ambassador</code>, Customer →{" "}
            <code className="text-primary">/account</code>.
          </p>
        </div>
      </div>
      </div>
    </section>
  );
}
