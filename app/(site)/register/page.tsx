import type { Metadata } from "next";
import Link from "next/link";
import { SignupForm } from "@/components/register/SignupForm";
import { PageHero } from "@/components/PageHero";

export const metadata: Metadata = {
  title: "Create account",
  description:
    "Register as a provider or ambassador with Wellness Tech Distribution. Providers verify NPI for approval.",
};

type SearchParams = Promise<{ role?: string; error?: string }>;

export default async function RegisterPage({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams;
  const raw = (sp.role || "PROVIDER").toUpperCase();
  const role = raw === "AMBASSADOR" ? "AMBASSADOR" : "PROVIDER";

  return (
    <>
      <PageHero
        eyebrow="Partner onboarding"
        title={role === "PROVIDER" ? "Create your provider account" : "Create your ambassador account"}
        description="A guided multi-step registration with verification. Providers use NPI lookup; ambassadors set up territory-ready profiles."
        size="sm"
      >
        <div className="flex flex-wrap gap-2">
          <Link
            href="/register?role=PROVIDER"
            className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] transition ${
              role === "PROVIDER"
                ? "bg-accent text-accent-foreground"
                : "border border-primary-foreground/30 text-primary-foreground hover:border-accent"
            }`}
          >
            Provider
          </Link>
          <Link
            href="/register?role=AMBASSADOR"
            className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] transition ${
              role === "AMBASSADOR"
                ? "bg-accent text-accent-foreground"
                : "border border-primary-foreground/30 text-primary-foreground hover:border-accent"
            }`}
          >
            Ambassador
          </Link>
        </div>
      </PageHero>

      <section className="container-x py-10 md:py-14">
        <SignupForm role={role} error={sp.error} />
      </section>
    </>
  );
}
