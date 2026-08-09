import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const paths = [
  {
    title: "For practices",
    eyebrow: "Prescribers",
    body: "NPI-verified access to compounded formularies, exosomes, supplies, and practice onboarding.",
    href: "/register?role=PROVIDER",
    cta: "Request practice access",
    tone: "primary" as const,
  },
  {
    title: "For sales partners",
    eyebrow: "Affiliates",
    body: "Territory-backed commissions, clinical enablement kits, and a catalog clinics already ask for.",
    href: "/affiliates",
    cta: "Join affiliate program",
    tone: "accent" as const,
  },
  {
    title: "For procurement",
    eyebrow: "Marketplace",
    body: "Browse therapies, aesthetic systems, and clinical supplies — then check out with role-based pricing.",
    href: "/shop",
    cta: "Open the shop",
    tone: "muted" as const,
  },
];

export function HomePathsSection() {
  return (
    <section className="container-x py-16 md:py-20">
      <div className="mx-auto max-w-2xl text-center">
        <span className="text-xs font-semibold uppercase tracking-widest text-accent">
          Start where you are
        </span>
        <h2 className="mt-3 font-display text-3xl font-semibold text-primary md:text-4xl">
          Three clear paths into the Wellness Tech network.
        </h2>
      </div>

      <div className="mt-10 grid gap-4 md:grid-cols-3">
        {paths.map((p) => (
          <Link
            key={p.title}
            href={p.href}
            className={`group relative flex flex-col overflow-hidden rounded-3xl border p-7 transition duration-300 hover:-translate-y-1 md:p-8 ${
              p.tone === "primary"
                ? "border-primary/15 bg-primary text-primary-foreground shadow-[0_22px_50px_rgba(20,70,100,0.22)]"
                : p.tone === "accent"
                  ? "border-accent/35 bg-accent/15 text-primary shadow-[0_18px_40px_rgba(180,140,40,0.12)]"
                  : "border-primary/10 bg-white/90 text-primary shadow-[0_16px_40px_rgba(15,40,60,0.06)]"
            }`}
          >
            <span
              className={`text-[10px] font-semibold uppercase tracking-[0.18em] ${
                p.tone === "primary" ? "text-accent" : "text-accent"
              }`}
            >
              {p.eyebrow}
            </span>
            <h3 className="mt-3 font-display text-2xl font-semibold">{p.title}</h3>
            <p
              className={`mt-3 flex-1 text-sm leading-relaxed ${
                p.tone === "primary" ? "text-primary-foreground/85" : "text-muted-foreground"
              }`}
            >
              {p.body}
            </p>
            <span
              className={`mt-7 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] ${
                p.tone === "primary" ? "text-accent" : "text-primary"
              }`}
            >
              {p.cta}
              <ArrowUpRight className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
