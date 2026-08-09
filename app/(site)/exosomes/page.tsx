import type { Metadata } from "next";
import { ExosomesInteractive } from "@/components/exosomes/ExosomesInteractive";
import { PageHero } from "@/components/PageHero";

export const metadata: Metadata = {
  title: "Exosomes for Medical Aesthetics — Wellness Tech Bio Distribution",
  description:
    "Professional exosome, stem-cell and AAPE aesthetic systems. Register your practice to unlock the online order form.",
  openGraph: {
    title: "Exosomes for Medical Aesthetics — Wellness Tech Bio Distribution",
    description: "Verified-practice ordering for exosome aesthetic systems.",
  },
};

export default function ExosomesPage() {
  return (
    <>
      <PageHero
        eyebrow="Aesthetics Line"
        title="Exosomes for Medical Aesthetics"
        description="Professional exosomes, stem-cell and AAPE systems for in-clinic protocols and at-home patient regimens. Pricing and ordering are reserved for verified medical practitioners, MedSpas and authorized retailers — complete a one-time registration below to unlock the full catalog with SPA and MSRP pricing."
      >
        <div className="flex flex-wrap gap-2 text-[10px] uppercase tracking-widest">
          <span className="rounded-full bg-accent/20 px-3 py-1 text-accent">
            Practice verification required
          </span>
          <span className="rounded-full border border-primary-foreground/25 px-3 py-1 text-primary-foreground/85">
            For licensed professionals
          </span>
        </div>
      </PageHero>

      <section className="border-b border-primary/10 bg-background">
        <div className="container-x py-16 md:py-20">
          <span className="text-xs font-semibold uppercase tracking-widest text-accent">About the Manufacturer</span>
          <h2 className="mt-2 max-w-2xl font-display text-3xl font-semibold text-primary md:text-4xl">
            ABio Labs — Pioneering Korean exosome biotechnology.
          </h2>
          <div className="mt-8 grid gap-10 md:grid-cols-2 md:items-start">
            <div>
              <h3 className="font-display text-xl font-medium text-primary">A legacy of regenerative science</h3>
              <p className="mt-3 text-sm leading-relaxed text-primary/80">
                ABio Labs was founded in South Korea by a team of stem-cell biologists and dermatology
                researchers with a shared mission: to translate cutting-edge exosome science into safe,
                effective aesthetic solutions. Since its inception, ABio has focused exclusively on
                extracellular vesicle research — becoming one of the earliest Korean laboratories to
                commercialize lyophilized exosome formulations for professional aesthetic use.
              </p>
              <p className="mt-3 text-sm leading-relaxed text-primary/80">
                The company operates out of KFDA-registered, ISO-certified, cGMP (Current Good Manufacturing
                Practice) facilities in Korea, where every batch undergoes rigorous quality control — from
                stem-cell isolation and conditioned-media harvesting to tangential-flow filtration,
                nanoparticle-tracking analysis (NTA), and full Certificate of Analysis (COA) documentation. cGMP
                compliance ensures consistent identity, strength, quality and purity of every vial produced.
              </p>
            </div>
            <div>
              <h3 className="font-display text-xl font-medium text-primary">Expertise &amp; innovation</h3>
              <ul className="mt-3 space-y-3 text-sm text-primary/80">
                <li className="flex gap-3">
                  <span className="mt-0.5 size-1.5 shrink-0 rounded-full bg-accent" />
                  <span>
                    <strong>Stem-cell sourcing mastery:</strong> ABio maintains proprietary protocols for
                    isolating high-purity exosomes from human adipose-derived mesenchymal stem cells (AD-MSCs)
                    as well as plant stem-cell cultures — giving rise to the distinct SX (human-derived) and PX
                    (plant-derived) product series.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="mt-0.5 size-1.5 shrink-0 rounded-full bg-accent" />
                  <span>
                    <strong>Lyophilization leadership:</strong> ABio pioneered the freeze-dried exosome powder
                    format that preserves vesicle integrity at room temperature — eliminating cold-chain
                    logistics while maximizing potency at the point of reconstitution.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="mt-0.5 size-1.5 shrink-0 rounded-full bg-accent" />
                  <span>
                    <strong>Clinical validation:</strong> ABio formulations are used in thousands of aesthetic
                    clinics across Asia and are now expanding into the U.S. market through partnerships with
                    licensed medical distributors — backed by a growing body of clinical outcome data in skin
                    rejuvenation, post-procedure recovery, and hair restoration.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="mt-0.5 size-1.5 shrink-0 rounded-full bg-accent" />
                  <span>
                    <strong>Regulatory rigor:</strong> All ABio products are manufactured under KFDA cGMP
                    standards with full sterility, endotoxin, and particle-count testing — ensuring every vial
                    meets the strictest safety benchmarks for professional in-clinic use.
                  </span>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 rounded-sm border border-primary/10 bg-primary/5 p-5">
            <p className="text-sm leading-relaxed text-primary/80">
              <strong>Why we partner with ABio:</strong> Wellness Tech Bio Distribution selected ABio Labs as
              our supplier of the Highest Quality Korean Cosmetic Grade Hair and Skincare because of their
              unwavering commitment to scientific integrity, transparent manufacturing, and practitioner
              support. Their SX and PX series — along with the premium Celexo Black Label and AAPE lines — give
              U.S. aesthetic practices access to the same exosome technology that has defined the Korean
              regenerative-aesthetics market for over a decade.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-primary/10">
        <div className="container-x grid gap-10 py-16 md:grid-cols-12 md:py-20">
          <div className="md:col-span-5">
            <span className="text-xs font-semibold uppercase tracking-widest text-accent">
              Why High quality Cosmetic Grade Korean Exosomes
            </span>
            <h2 className="mt-2 font-display text-3xl font-semibold text-primary md:text-4xl">
              The global standard in regenerative aesthetics.
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-primary/80">
              South Korea is the world leader in exosomes science for medical aesthetics. Korean biotech
              laboratories pioneered the lyophilized (freeze-dried) exosomes format that is now the gold
              standard for in-clinic skin and hair rejuvenation — backed by a decade of clinical research,
              KFDA-grade manufacturing, and the most published aesthetic outcomes data of any region.
            </p>
            <div className="mt-6 overflow-hidden rounded-sm border border-primary/10">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/abio-exosomes-hero.jpg"
                alt="ABio Korean exosome skin booster product line"
                width={1280}
                height={896}
                loading="lazy"
                className="h-64 w-full object-cover md:h-80"
              />
            </div>
          </div>
          <div className="md:col-span-7">
            <ul className="grid gap-4 sm:grid-cols-2">
              <li className="rounded-sm border border-primary/10 bg-card p-5">
                <div className="text-xs font-semibold uppercase tracking-widest text-accent">Source</div>
                <h3 className="mt-1 font-display text-lg font-medium text-primary">Plant & stem-cell derived</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  high quality cosmetic grade Korean exosomes are isolated from rose stem cells, edelweiss,
                  salmon DNA, and human adipose-derived MSCs — purified to billions of vesicles per dose with
                  cytokine, growth-factor and microRNA payloads.
                </p>
              </li>
              <li className="rounded-sm border border-primary/10 bg-card p-5">
                <div className="text-xs font-semibold uppercase tracking-widest text-accent">Manufacturing</div>
                <h3 className="mt-1 font-display text-lg font-medium text-primary">KFDA cGMP facilities</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Produced in KFDA-registered ISO-certified clean rooms with tangential flow filtration,
                  sterility & endotoxin testing, NTA particle counting and full COA per lot.
                </p>
              </li>
              <li className="rounded-sm border border-primary/10 bg-card p-5">
                <div className="text-xs font-semibold uppercase tracking-widest text-accent">Format</div>
                <h3 className="mt-1 font-display text-lg font-medium text-primary">Lyophilized stability</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Freeze-dried powder + sterile solvent preserves vesicle integrity at room temperature —
                  reconstituted chairside for maximum potency at the point of treatment.
                </p>
              </li>
              <li className="rounded-sm border border-primary/10 bg-card p-5">
                <div className="text-xs font-semibold uppercase tracking-widest text-accent">Clinical use</div>
                <h3 className="mt-1 font-display text-lg font-medium text-primary">Post-procedure & standalone</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Used worldwide after microneedling, RF, fractional laser and PRP for accelerated healing,
                  brightening, pore refinement, scalp restoration and anti-aging dermal density.
                </p>
              </li>
              <li className="rounded-sm border border-primary/10 bg-card p-5 sm:col-span-2">
                <div className="text-xs font-semibold uppercase tracking-widest text-accent">Regulatory note</div>
                <p className="mt-2 text-sm text-muted-foreground">
                  In the U.S., exosomes are not FDA-approved injectables. Our high quality cosmetic grade Korean
                  exosomes are supplied for topical application following microchannel-creating procedures
                  (microneedling, RF microneedling, fractional laser) at the discretion of a licensed medical
                  professional. Practice verification is required before purchase.
                </p>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <ExosomesInteractive />
    </>
  );
}
