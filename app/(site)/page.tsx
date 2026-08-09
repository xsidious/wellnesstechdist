import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowUpRight,
  ShieldCheck,
  Stethoscope,
  Users,
  Link2,
  PackageCheck,
  ClipboardCheck,
  BadgeDollarSign,
  Cpu,
} from "lucide-react";
import { CatalogEmbed } from "@/components/CatalogEmbed";
import { DownloadsSection } from "@/components/home/DownloadsSection";
import { ResourcesSection } from "@/components/home/ResourcesSection";
import { RegistrationSection } from "@/components/home/RegistrationSection";
import { HomeHero } from "@/components/home/HomeHero";
import { HomeCtaBand } from "@/components/home/HomeCtaBand";

export const metadata: Metadata = {
  title: "Wellness Tech Bio Distribution — Compounded Rx Resource for Practitioners",
  description:
    "503A & 503B compounded GLP-1s, peptides, NAD+ and hormone therapies for licensed physicians, clinics, and accredited sales affiliates.",
  openGraph: {
    title: "Wellness Tech Bio Distribution",
    description: "100+ compounded Rx products. Physician-supervised. Practitioner-only.",
  },
};

export default function HomePage() {
  return (
    <>
      <HomeHero />

      <section id="catalog" className="container-x py-24 md:py-32">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-accent">
              Therapeutic verticals
            </span>
            <h2 className="mt-3 max-w-2xl font-display text-4xl font-semibold text-primary md:text-5xl">
              Compounded Rx & high quality cosmetic grade Korean exosomes. One standard of quality.
            </h2>
          </div>
        </div>
        <div className="mt-14">
          <CatalogEmbed />
        </div>
      </section>

      <section className="container-x py-24 md:py-32">
        <div className="grid gap-12 md:grid-cols-12 md:items-center">
          <div className="md:col-span-6 overflow-hidden rounded-sm border border-primary/10 bg-black">
            <img
              src="/images/cellexosome-black-label.png"
              alt="CellExosome Black Label — Korean stem cell exosome skin booster"
              width={1200}
              height={1800}
              loading="lazy"
              className="h-72 w-full object-contain md:h-[28rem]"
            />
          </div>
          <div className="md:col-span-6">
            <span className="text-xs font-semibold uppercase tracking-widest text-accent">
              New — Now available
            </span>
            <h2 className="mt-3 font-display text-4xl font-semibold text-primary md:text-5xl">
              high quality cosmetic grade Korean exosomes for regenerative aesthetics.
            </h2>
            <p className="mt-5 text-muted-foreground">
              Lyophilized exosome boosters, stem-cell serums and AAPE systems from leading Korean biotech
              labs — now distributed alongside our compounded Rx catalog. Two clinical lines for distinct
              indications:
            </p>
            <ul className="mt-6 space-y-3 text-sm">
              <li className="flex gap-3">
                <span className="mt-1 inline-block size-2 rounded-full bg-accent" />
                <span>
                  <strong className="text-primary">SX Series</strong> —{" "}
                  <span className="text-muted-foreground">
                    Human-derived exosomes. Stem-cell rejuvenation for mature or photo-aged skin.
                  </span>
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-1 inline-block size-2 rounded-full bg-accent" />
                <span>
                  <strong className="text-primary">PX Series</strong> —{" "}
                  <span className="text-muted-foreground">
                    Plant-derived exosomes. Daily aesthetic refinement — pore, oil balance and calming.
                  </span>
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-1 inline-block size-2 rounded-full bg-accent" />
                <span>
                  <strong className="text-primary">Black Label & Hair</strong> —{" "}
                  <span className="text-muted-foreground">
                    Microneedling, scalp and post-procedure protocols.
                  </span>
                </span>
              </li>
            </ul>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/exosomes"
                className="inline-flex items-center gap-2 rounded-sm bg-primary px-6 py-3.5 text-sm font-semibold uppercase tracking-wider text-primary-foreground hover:bg-primary/90"
              >
                Explore exosomes <ArrowUpRight className="size-4" />
              </Link>
              <Link
                href="/exosomes"
                className="inline-flex items-center gap-2 rounded-sm border border-primary/30 px-6 py-3.5 text-sm font-semibold uppercase tracking-wider text-primary hover:border-accent hover:text-accent"
              >
                Register to order
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-primary/5 py-24 md:py-32">
        <div className="container-x">
          <span className="text-xs font-semibold uppercase tracking-widest text-accent">Who we serve</span>
          <h2 className="mt-3 max-w-3xl font-display text-4xl font-semibold text-primary md:text-5xl">
            Built for the practices defining modern medicine.
          </h2>
          <div className="mt-10 overflow-hidden rounded-sm border border-primary/10">
            <img
              src="/images/people-team.jpg"
              alt="Diverse team of medical aesthetic practitioners in a modern clinic"
              width={1280}
              height={896}
              loading="lazy"
              className="h-64 w-full object-cover md:h-96"
            />
          </div>
          <div className="mt-14 grid gap-px overflow-hidden rounded-sm bg-primary/10 md:grid-cols-2 lg:grid-cols-3">
            {[
              "Medical practices & weight loss clinics",
              "Anti-aging & longevity specialists",
              "Sports medicine & performance physicians",
              "Hormone & functional medicine providers",
              "Aesthetic & regenerative practices",
              "Sales affiliates & territory reps",
              "Independent prescribers & telehealth physicians",
            ].map((w) => (
              <div key={w} className="bg-background p-8">
                <Stethoscope className="size-5 text-accent" />
                <div className="mt-4 font-display text-lg font-medium text-primary">{w}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-x py-24 md:py-32">
        <div className="text-center">
          <span className="text-xs font-semibold uppercase tracking-widest text-accent">How it works</span>
          <h2 className="mt-3 font-display text-4xl font-semibold text-primary md:text-5xl">
            A direct line to verified compounding partners.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            Wellness Tech Bio Distribution is not a distributor — we are a clinical resource that connects
            licensed physicians and medical practices with rigorously vetted 503A and 503B compounding
            partners.
          </p>
        </div>
        <div className="mt-12 overflow-hidden rounded-sm border border-primary/10">
          <img
            src="/images/people-consult.jpg"
            alt="Physician consulting with a patient across a clean modern office desk"
            width={1280}
            height={896}
            loading="lazy"
            className="h-64 w-full object-cover md:h-96"
          />
        </div>
        <div className="mt-14 grid gap-8 md:grid-cols-4">
          {[
            {
              icon: Users,
              step: "01",
              title: "Connect",
              desc: "Licensed physicians and practices register with Wellness Tech Bio Distribution and submit their prescribing credentials.",
            },
            {
              icon: Link2,
              step: "02",
              title: "Match",
              desc: "We match your practice with verified 503A patient-specific or 503B outsourcing compounding partners.",
            },
            {
              icon: ClipboardCheck,
              step: "03",
              title: "Prescribe",
              desc: "You write the Rx. Our partner pharmacies compound to spec under your clinical direction — never off-the-shelf.",
            },
            {
              icon: PackageCheck,
              step: "04",
              title: "Fulfill",
              desc: "Medication is shipped directly to your practice or patient. We track logistics and support continuity of care.",
            },
          ].map((s) => (
            <div key={s.step} className="relative text-center">
              <div className="mx-auto flex size-14 items-center justify-center rounded-full border border-accent/30 bg-accent/10">
                <s.icon className="size-6 text-accent" />
              </div>
              <div className="mt-6 text-xs font-semibold uppercase tracking-widest text-accent">{s.step}</div>
              <h3 className="mt-2 font-display text-xl font-semibold text-primary">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.desc}</p>
            </div>
          ))}
        </div>
        <div className="mt-12 text-center">
          <p className="inline-block rounded-sm border border-primary/10 bg-primary/5 px-6 py-3 text-sm text-muted-foreground">
            All partners are verified for USP compliance, FDA 503A/503B registration, and state board
            licensure.
          </p>
        </div>
      </section>

      <section className="container-x py-24 md:py-32">
        <div className="text-center">
          <span className="text-xs font-semibold uppercase tracking-widest text-accent">Why choose us</span>
          <h2 className="mt-3 font-display text-4xl font-semibold text-primary md:text-5xl">
            What makes us different.
          </h2>
        </div>
        <div className="mt-14 grid gap-8 md:grid-cols-3">
          {[
            {
              icon: ShieldCheck,
              title: "Quality",
              desc: "USP-grade compounds, batch-tested and certified. Every product meets rigorous pharmaceutical standards before it reaches your practice.",
            },
            {
              icon: BadgeDollarSign,
              title: "Price",
              desc: "Competitive wholesale pricing with volume discounts. We negotiate directly with partners to pass savings on to your practice.",
            },
            {
              icon: Cpu,
              title: "Advanced Technology",
              desc: "Cutting-edge compounding technology, next-generation peptide synthesis, and the latest in high quality cosmetic grade Korean exosomes and aesthetic innovations.",
            },
          ].map((d) => (
            <div key={d.title} className="rounded-sm border border-primary/10 bg-card p-8 text-center">
              <div className="mx-auto flex size-14 items-center justify-center rounded-full border border-accent/30 bg-accent/10">
                <d.icon className="size-7 text-accent" />
              </div>
              <h3 className="mt-6 font-display text-xl font-semibold text-primary">{d.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{d.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <DownloadsSection />
      <ResourcesSection />
      <RegistrationSection />
      <HomeCtaBand />
    </>
  );
}
