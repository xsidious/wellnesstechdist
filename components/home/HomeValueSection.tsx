import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const deliver = [
  {
    title: "Products",
    body: "Compounded peptides, GLP‑1 therapies, cosmetic Korean exosomes, clinical aesthetic & medical‑grade equipment from vetted 503A/503B partners and manufacturers.",
  },
  {
    title: "Education",
    body: "Practical, outcomes‑driven clinician training and protocols that maximize safety, efficacy, and ROI.",
  },
  {
    title: "Platform & operations",
    body: "Secure B2B system with role‑based access, integrations, customizable workflows, and end‑to‑end practice enablement.",
  },
];

const why = [
  {
    title: "Reduce risk",
    body: "Verified suppliers and enterprise security protect patients and practices.",
  },
  {
    title: "Improve outcomes",
    body: "Clinical education + proven protocols increase treatment effectiveness.",
  },
  {
    title: "Scale efficiently",
    body: "Automation and custom workflows cut admin time and expand service capacity.",
  },
];

export function HomeValueSection() {
  return (
    <section className="border-b border-primary/10 bg-primary/[0.035]">
      <div className="container-x py-20 md:py-28">
        <p className="max-w-3xl font-display text-2xl font-semibold leading-snug text-primary md:text-3xl">
          Pharmaceutical‑grade therapies. Verified compounding partners. Enterprise‑grade digital
          platform.
        </p>

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-primary/10 bg-white/80 p-7 shadow-[0_16px_40px_rgba(15,40,60,0.04)] md:p-9">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-accent">
              What we deliver
            </h2>
            <ul className="mt-6 space-y-6">
              {deliver.map((item) => (
                <li key={item.title} className="flex gap-4">
                  <span className="mt-2 size-1.5 shrink-0 rounded-full bg-accent" />
                  <div>
                    <h3 className="font-display text-lg font-semibold text-primary">{item.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-3xl border border-primary/10 bg-white/80 p-7 shadow-[0_16px_40px_rgba(15,40,60,0.04)] md:p-9">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-accent">
              Why it matters
            </h2>
            <ul className="mt-6 space-y-6">
              {why.map((item) => (
                <li key={item.title} className="flex gap-4">
                  <span className="mt-2 size-1.5 shrink-0 rounded-full bg-accent" />
                  <div>
                    <h3 className="font-display text-lg font-semibold text-primary">{item.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-8 rounded-3xl border border-primary/10 bg-white/80 p-7 shadow-[0_16px_40px_rgba(15,40,60,0.04)] md:p-9">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-accent">Ideal for</h2>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-primary/90 md:text-lg">
            Medical spas, aesthetic clinics, concierge wellness practices, and physician groups seeking
            compliant product sourcing, staff training, and scalable digital infrastructure.
          </p>
          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-muted-foreground md:text-base">
            Schedule a demo or request a practice assessment to see how Wellness Tech Distribution can
            supply, train, and build the technology backbone for your growth.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3.5 text-xs font-semibold uppercase tracking-[0.14em] text-primary-foreground shadow-[0_12px_28px_rgba(20,70,100,0.2)] transition hover:bg-primary/90"
            >
              Schedule a demo <ArrowUpRight className="size-4" />
            </Link>
            <Link
              href="/register?role=PROVIDER"
              className="inline-flex items-center gap-2 rounded-full border border-primary/20 px-6 py-3.5 text-xs font-semibold uppercase tracking-[0.14em] text-primary transition hover:border-accent hover:text-accent"
            >
              Request practice assessment
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
