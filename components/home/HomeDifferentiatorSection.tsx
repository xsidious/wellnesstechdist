import { ShieldCheck, BadgeDollarSign, Cpu } from "lucide-react";

const differentiators = [
  {
    icon: ShieldCheck,
    title: "Quality you can defend",
    desc: "USP-grade compounds, batch discipline, and partner verification before anything reaches your practice.",
  },
  {
    icon: BadgeDollarSign,
    title: "Wholesale economics",
    desc: "Competitive practice pricing with volume pathways negotiated directly with compounding partners.",
  },
  {
    icon: Cpu,
    title: "Ops that scale",
    desc: "Role-based portals, ordering, attribution, and clinician education in one B2B system.",
  },
];

export function HomeDifferentiatorSection() {
  return (
    <section className="bg-primary/[0.035] py-20 md:py-28">
      <div className="container-x">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-semibold uppercase tracking-widest text-accent">
            Why practices switch
          </span>
          <h2 className="mt-3 font-display text-3xl font-semibold text-primary md:text-4xl">
            Compliance, catalog depth, and operational speed — together.
          </h2>
        </div>
        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {differentiators.map((d) => (
            <div
              key={d.title}
              className="rounded-3xl border border-primary/10 bg-white/90 p-8 shadow-[0_16px_40px_rgba(15,40,60,0.05)]"
            >
              <div className="flex size-12 items-center justify-center rounded-2xl border border-accent/30 bg-accent/10">
                <d.icon className="size-6 text-accent" />
              </div>
              <h3 className="mt-6 font-display text-xl font-semibold text-primary">{d.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{d.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
