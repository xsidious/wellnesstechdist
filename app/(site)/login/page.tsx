import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { AuthError } from "next-auth";
import { signIn } from "@/lib/auth";

export const metadata: Metadata = { title: "Login" };

type SearchParams = Promise<{ callbackUrl?: string; error?: string; registered?: string }>;

export default async function LoginPage({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams;

  async function loginAction(formData: FormData) {
    "use server";
    const email = String(formData.get("email") || "");
    const password = String(formData.get("password") || "");
    const callbackUrl = String(formData.get("callbackUrl") || "/account");
    try {
      await signIn("credentials", { email, password, redirectTo: callbackUrl });
    } catch (e) {
      if (e instanceof AuthError) {
        redirect(`/login?error=CredentialsSignin&callbackUrl=${encodeURIComponent(callbackUrl)}`);
      }
      throw e;
    }
  }

  return (
    <section className="container-x flex min-h-[60vh] items-center justify-center py-16">
      <div className="w-full max-w-md">
        <h1 className="font-display text-3xl font-semibold text-primary">Sign in</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          No account? Register as{" "}
          <Link href="/register?role=PROVIDER" className="text-accent hover:underline">
            Provider
          </Link>{" "}
          or{" "}
          <Link href="/register?role=AMBASSADOR" className="text-accent hover:underline">
            Ambassador
          </Link>
        </p>
        {sp.registered && (
          <p className="mt-4 text-sm text-accent">
            Account submitted for verification. You can sign in while approval is pending.
          </p>
        )}
        {sp.error && (
          <p className="mt-4 text-sm text-destructive">Invalid email or password.</p>
        )}
        <form action={loginAction} className="mt-8 space-y-4">
          <input type="hidden" name="callbackUrl" value={sp.callbackUrl || "/account"} />
          <div>
            <label className="text-xs font-semibold uppercase tracking-widest text-primary/70">
              Email
            </label>
            <input
              name="email"
              type="email"
              required
              className="mt-2 w-full rounded-sm border border-input px-3 py-2.5 text-sm"
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
              className="mt-2 w-full rounded-sm border border-input px-3 py-2.5 text-sm"
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-sm bg-primary px-6 py-3 text-sm font-semibold uppercase tracking-wider text-primary-foreground"
          >
            Sign in
          </button>
        </form>
      </div>
    </section>
  );
}
