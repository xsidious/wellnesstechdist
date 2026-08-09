import {
  Users,
  Link2,
  ClipboardCheck,
  PackageCheck,
} from "lucide-react";

const steps = [
  {
    icon: Users,
    step: "01",
    title: "Credential",
    desc: "Licensed physicians and practices register with NPI verification and prescribing credentials.",
  },
  {
    icon: Link2,
    step: "02",
    title: "Match",
    desc: "We connect your practice with verified 503A patient-specific or 503B outsourcing partners.",
  },
  {
    icon: ClipboardCheck,
    step: "03",
    title: "Prescribe",
    desc: "You write the Rx. Partner pharmacies compound to spec under your clinical direction.",
  },
  {
    icon: PackageCheck,
    step: "04",
    title: "Fulfill",
    desc: "Product ships to practice or patient. Logistics, continuity, and reorder support included.",
  },
];

export function HomeProcessSection() {
  return (
    <section className="container-x py-20 md:py-28">
      <div className="mx-auto max-w-3xl text-center">
        <span className="text-xs font-semibold uppercase tracking-widest text-accent">
          How it works
        </span>
        <h2 className="mt-3 font-display text-3xl font-semibold text-primary md:text-4xl">
          From credentialing to fulfillment — without the usual friction.
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
          A clinical resource that connects licensed practices with rigorously vetted compounding
          partners — not a generic e‑commerce storefront.
        </p>
      </div>

      <div className="mt-12 overflow-hidden rounded-3xl border border-primary/10 shadow-[0_18px_50px_rgba(15,40,60,0.06)]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/people-consult.jpg"
          alt="Physician consulting with a patient across a clean modern office desk"
          width={1280}
          height={896}
          loading="lazy"
          className="h-56 w-full object-cover md:h-80"
        />
      </div>

      <div className="mt-10 grid gap-4 md:grid-cols-4">
        {steps.map((s) => (
          <div
            key={s.step}
            className="rounded-3xl border border-primary/10 bg-white/90 p-6 text-center shadow-[0_12px_32px_rgba(15,40,60,0.04)]"
          >
            <div className="mx-auto flex size-12 items-center justify-center rounded-full border border-accent/30 bg-accent/10">
              <s.icon className="size-5 text-accent" />
            </div>
            <div className="mt-5 text-[10px] font-semibold uppercase tracking-[0.18em] text-accent">
              {s.step}
            </div>
            <h3 className="mt-2 font-display text-xl font-semibold text-primary">{s.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
