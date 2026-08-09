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
    body: "Secure, Next.js-based B2B system on private VPS with role‑based security, API integrations, customizable workflows, automation, and end‑to‑end practice enablement.",
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
    <section className="border-b border-primary/10 bg-primary/5">
      <div className="container-x py-24 md:py-32">
        <p className="max-w-3xl font-display text-2xl font-semibold leading-snug text-primary md:text-3xl">
          Pharmaceutical‑grade therapies. Verified compounding partners. Enterprise‑grade digital
          platform.
        </p>

        <div className="mt-16 grid gap-14 lg:grid-cols-2">
          <div>
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

          <div>
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

        <div className="mt-16 max-w-3xl border-t border-primary/10 pt-12">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-accent">Ideal for</h2>
          <p className="mt-4 text-base leading-relaxed text-primary/90 md:text-lg">
            Medical spas, aesthetic clinics, concierge wellness practices, and physician groups seeking
            compliant product sourcing, staff training, and scalable digital infrastructure.
          </p>
          <p className="mt-6 text-sm leading-relaxed text-muted-foreground md:text-base">
            Schedule a demo or request a practice assessment to see how Wellness Tech Distribution can
            supply, train, and build the technology backbone for your growth.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-sm bg-primary px-6 py-3.5 text-sm font-semibold uppercase tracking-wider text-primary-foreground transition hover:bg-primary/90"
            >
              Schedule a demo <ArrowUpRight className="size-4" />
            </Link>
            <Link
              href="/register?role=PROVIDER"
              className="inline-flex items-center gap-2 rounded-sm border border-primary/25 px-6 py-3.5 text-sm font-semibold uppercase tracking-wider text-primary transition hover:border-accent hover:text-accent"
            >
              Request practice assessment
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
