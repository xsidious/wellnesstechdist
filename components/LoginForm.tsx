"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { ArrowUpRight } from "lucide-react";
import { dashboardPathForRole } from "@/lib/auth-redirect";

export function LoginForm({
  callbackUrl,
  registered,
  initialError,
}: {
  callbackUrl?: string;
  registered?: string;
  initialError?: string;
}) {
  const router = useRouter();
  const [error, setError] = useState(Boolean(initialError));
  const [pending, setPending] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(false);
    setPending(true);

    const fd = new FormData(e.currentTarget);
    const email = String(fd.get("email") || "")
      .toLowerCase()
      .trim();
    const password = String(fd.get("password") || "");

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (!result || result.error) {
      setError(true);
      setPending(false);
      return;
    }

    // Read role from the freshly set session cookie
    let redirectTo = "/account";
    try {
      const sessionRes = await fetch("/api/auth/session", { cache: "no-store" });
      const session = (await sessionRes.json()) as {
        user?: { role?: string };
      };
      const roleHome = dashboardPathForRole(session.user?.role);
      const cb = callbackUrl || "";
      if (cb.startsWith("/") && !cb.startsWith("//") && !cb.startsWith("/login")) {
        redirectTo = cb === "/account" || cb === "/account/" ? roleHome : cb;
      } else {
        redirectTo = roleHome;
      }
    } catch {
      redirectTo = "/account";
    }

    router.replace(redirectTo);
    router.refresh();
  }

  return (
    <>
      {registered && (
        <p className="mt-4 rounded-2xl bg-accent/15 px-4 py-3 text-sm text-accent-foreground">
          Account submitted for verification. You can sign in while approval is pending.
        </p>
      )}
      {error && (
        <p className="mt-4 rounded-2xl bg-destructive/10 px-4 py-3 text-sm text-destructive">
          Invalid email or password.
        </p>
      )}

      <form onSubmit={onSubmit} className="mt-8 space-y-4">
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
          disabled={pending}
          className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3.5 text-xs font-semibold uppercase tracking-[0.14em] text-primary-foreground shadow-[0_12px_28px_rgba(20,70,100,0.22)] transition hover:bg-primary/90 disabled:opacity-60"
        >
          {pending ? "Signing in…" : "Sign in"} <ArrowUpRight className="size-4" />
        </button>
      </form>

      <p className="mt-6 text-xs leading-relaxed text-muted-foreground">
        Demo access: <code className="text-primary">admin@wellnesstech.local</code> /{" "}
        <code className="text-primary">Demo1234!</code>
        <br />
        Also: provider@ / ambassador@ with the same password.
      </p>
    </>
  );
}
