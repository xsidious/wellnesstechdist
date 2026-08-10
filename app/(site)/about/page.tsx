import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, MapPin, Package, ShieldCheck } from "lucide-react";
import { PageHero } from "@/components/PageHero";

const heroStats = [
  { icon: ShieldCheck, label: "503A & 503B verified" },
  { icon: Package, label: "100+ Rx products" },
  { icon: MapPin, label: "Nationwide network" },
];

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Wellness Tech Distribution — trusted sourcing, clinician education, and secure B2B tech to scale evidence-informed aesthetic and wellness medicine.",
  openGraph: {
    title: "About Us — Wellness Tech Distribution",
    description:
      "Trusted sourcing, clinician education, and secure B2B tech for modern aesthetic & wellness practices.",
  },
};

const whatWeDo = [
  {
    title: "Product supply",
    body: "Sourcing and distributing pharmaceutical‑grade compounded therapies, GLP‑1s, cosmetic Korean exosomes, and clinical aesthetic and medical‑grade wellness equipment from verified manufacturers and compounding partners.",
  },
  {
    title: "Education",
    body: "Practical, clinician‑focused training on product and device use, clinical protocols, and practice integration to improve patient outcomes and business performance.",
  },
  {
    title: "Practice enablement",
    body: "Turnkey support for medical practices, from procurement and inventory to workflow optimization and staff training.",
  },
];

const platform = [
  {
    title: "Modern architecture",
    body: "Next.js‑based frontend and backend for performance, scalability, and maintainability.",
  },
  {
    title: "Private VPS infrastructure",
    body: "Dedicated environments for greater control, isolation, and security versus typical multi‑tenant SaaS.",
  },
  {
    title: "Enterprise security",
    body: "Secure authentication, encrypted communications, and role‑based permissions to protect sensitive healthcare data.",
  },
  {
    title: "End‑to‑end ecosystem",
    body: "Tools and workflows for providers, administrators, pharmacies, and clinical staff—not just a patient portal.",
  },
  {
    title: "Advanced integrations",
    body: "Seamless connection with payment processors, CRM, analytics, communications, and other third‑party systems.",
  },
  {
    title: "Customizable & automated",
    body: "Configurable workflows and automation for onboarding, scheduling, document management, reporting, and operations.",
  },
  {
    title: "Long‑term partnership",
    body: "Strategic guidance, implementation support, and continuous development to evolve with your practice.",
  },
];

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

const whyItMatters = [
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

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About us"
        title="Wellness Tech Distribution"
        description="Trusted sourcing, clinician education, and secure B2B tech to scale evidence‑informed aesthetic and wellness medicine."
        visual="ambient"
        media={
          <>
            <div className="overflow-hidden rounded-2xl border border-accent/30 shadow-[0_16px_40px_rgba(0,0,0,0.18)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/people-team.jpg"
                alt="Clinical team at a modern aesthetic and wellness practice"
                width={1280}
                height={896}
                loading="eager"
                className="block h-auto w-full"
              />
            </div>
            <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-3 md:grid-cols-1 lg:grid-cols-3">
              {heroStats.map((stat) => (
                <div
                  key={stat.label}
                  className="flex items-center gap-2 rounded-xl border border-primary-foreground/15 bg-primary-foreground/8 px-3 py-2.5 backdrop-blur-sm"
                >
                  <stat.icon className="size-4 shrink-0 text-accent" />
                  <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-primary-foreground/90">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </>
        }
      />

      <section className="container-x py-16 md:py-24">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-accent">
          Who we are
        </h2>
        <div className="mt-6 max-w-3xl space-y-5 text-base leading-relaxed text-primary/90 md:text-lg">
          <p>
            Wellness Tech Distribution connects licensed physicians and medical practices with verified
            503A/503B compounding partners and device manufacturers to deliver individualized,
            evidence‑informed, results‑focused medicine. We supply pharmaceutical‑grade compounded peptide
            therapies, GLP‑1 products, high‑quality cosmetic‑grade Korean exosomes, clinical aesthetic
            devices, and medical‑grade beauty &amp; wellness equipment — paired with comprehensive
            education so clinicians can maximize clinical outcomes and return on investment.
          </p>
        </div>
      </section>

      <section className="border-y border-primary/10 bg-primary/5">
        <div className="container-x py-16 md:py-24">
          <h2 className="font-display text-3xl font-semibold text-primary md:text-4xl">What we do</h2>
          <ul className="mt-10 space-y-8">
            {whatWeDo.map((item) => (
              <li key={item.title} className="flex gap-4">
                <span className="mt-2 size-1.5 shrink-0 rounded-full bg-accent" />
                <div>
                  <h3 className="font-display text-xl font-semibold text-primary">{item.title}</h3>
                  <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground md:text-base">
                    {item.body}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="container-x py-16 md:py-24">
        <h2 className="font-display text-3xl font-semibold text-primary md:text-4xl">
          Our platform differentiator
        </h2>
        <p className="mt-4 max-w-3xl text-muted-foreground">
          We build and operate a B2B healthcare platform that goes beyond consumer telehealth by providing
          a secure, scalable, customizable ecosystem for providers and organizations:
        </p>
        <ul className="mt-10 grid gap-8 md:grid-cols-2">
          {platform.map((item) => (
            <li key={item.title} className="flex gap-4">
              <span className="mt-2 size-1.5 shrink-0 rounded-full bg-accent" />
              <div>
                <h3 className="font-display text-lg font-semibold text-primary">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="border-y border-primary/10 bg-primary/5">
        <div className="container-x py-16 md:py-24">
          <h2 className="font-display text-3xl font-semibold text-primary md:text-4xl">
            Why partners choose us
          </h2>
          <p className="mt-6 max-w-3xl text-base leading-relaxed text-primary/90 md:text-lg">
            We combine trusted product sourcing and clinical education with a robust, enterprise‑grade
            digital infrastructure so practices can deliver safer, more effective, and more efficient care.
            Our focus is practical: empower clinicians with the right therapies, devices, workflows, and
            training — supported by a platform designed to scale with their business needs.
          </p>
        </div>
      </section>

      <section className="border-t border-primary/10 bg-card">
        <div className="container-x py-16 md:py-24">
          <span className="text-xs font-semibold uppercase tracking-widest text-accent">
            Sales collateral
          </span>
          <h2 className="mt-3 max-w-3xl font-display text-3xl font-semibold text-primary md:text-4xl">
            Complete supply, training, and technology for modern aesthetic &amp; wellness practices
          </h2>
          <p className="mt-4 max-w-2xl text-lg text-primary/85">
            Pharmaceutical‑grade therapies. Verified compounding partners. Enterprise‑grade digital
            platform.
          </p>

          <div className="mt-12 grid gap-12 lg:grid-cols-2">
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-widest text-accent">
                What we deliver
              </h3>
              <ul className="mt-5 space-y-5">
                {deliver.map((item) => (
                  <li key={item.title} className="flex gap-3">
                    <span className="mt-2 size-1.5 shrink-0 rounded-full bg-accent" />
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      <strong className="text-primary">{item.title}:</strong> {item.body}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-widest text-accent">
                Why it matters
              </h3>
              <ul className="mt-5 space-y-5">
                {whyItMatters.map((item) => (
                  <li key={item.title} className="flex gap-3">
                    <span className="mt-2 size-1.5 shrink-0 rounded-full bg-accent" />
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      <strong className="text-primary">{item.title}:</strong> {item.body}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-12 max-w-3xl border-t border-primary/10 pt-10">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-accent">Ideal for</h3>
            <p className="mt-3 text-base leading-relaxed text-primary/90">
              Medical spas, aesthetic clinics, concierge wellness practices, and physician groups seeking
              compliant product sourcing, staff training, and scalable digital infrastructure.
            </p>
            <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
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
    </>
  );
}
