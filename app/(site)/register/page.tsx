import type { Metadata } from "next";
import Link from "next/link";
import { SignupForm } from "@/components/register/SignupForm";

export const metadata: Metadata = {
  title: "Create account",
  description: "Register as a provider or ambassador with Wellness Tech Bio Distribution.",
};

type SearchParams = Promise<{ role?: string; error?: string }>;

export default async function RegisterPage({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams;
  const raw = (sp.role || "PROVIDER").toUpperCase();
  const role = raw === "AMBASSADOR" ? "AMBASSADOR" : "PROVIDER";

  return (
    <section className="container-x py-16 md:py-24">
      <div className="mb-8 flex flex-wrap justify-center gap-3 text-xs font-semibold uppercase tracking-wider">
        <Link
          href="/register?role=PROVIDER"
          className={`rounded-sm px-4 py-2 ${
            role === "PROVIDER"
              ? "bg-primary text-primary-foreground"
              : "border border-primary/20 text-primary"
          }`}
        >
          Provider
        </Link>
        <Link
          href="/register?role=AMBASSADOR"
          className={`rounded-sm px-4 py-2 ${
            role === "AMBASSADOR"
              ? "bg-primary text-primary-foreground"
              : "border border-primary/20 text-primary"
          }`}
        >
          Ambassador
        </Link>
      </div>
      <SignupForm role={role} error={sp.error} />
    </section>
  );
}
