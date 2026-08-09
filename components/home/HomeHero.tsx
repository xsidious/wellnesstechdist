import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getContentBlock, type HomeHeroBody } from "@/lib/content";

const DEFAULT_HERO: HomeHeroBody = {
  headline:
    "Precision peptides, exosomes & aesthetic equipment for physicians, MedSpa, Aesthetic practitioners and Clinics.",
  subcopy:
    "Wellness Tech Bio Distribution is a trusted resource for pharmaceutical-grade compounded peptide therapies, GLP-1 products, high quality cosmetic grade Korean exosomes, clinical aesthetic equipment, and medical-grade beauty and wellness equipment and education — connecting licensed physicians and medical practices with verified 503A/503B compounding partners and device manufacturers to deliver individualized, evidence-informed, results-focused medicine.",
  primaryCtaLabel: "Browse Compounded Therapies",
  primaryCtaHref: "#catalog",
  secondaryCtaLabel: "Shop marketplace",
  secondaryCtaHref: "/shop",
};

export async function HomeHero() {
  const hero = await getContentBlock("home.hero", DEFAULT_HERO);
  const headline = hero.headline || DEFAULT_HERO.headline!;
  // Allow italic "peptides" markup via simple replace if present as plain text
  const parts = headline.split(/(peptides)/i);

  return (
    <section className="relative overflow-hidden bg-primary text-primary-foreground">
      <div className="absolute inset-0 opacity-55">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/hero.jpg"
          alt=""
          width={1600}
          height={1200}
          className="size-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/85 to-primary/30" />
      </div>
      <div className="container-x relative grid gap-12 py-28 md:grid-cols-12 md:py-40">
        <div className="md:col-span-8">
          <h1 className="mt-6 font-display text-5xl font-semibold leading-[1.05] md:text-7xl">
            {parts.map((p, i) =>
              /^peptides$/i.test(p) ? (
                <span key={i} className="italic text-accent">
                  {p}
                </span>
              ) : (
                <span key={i}>{p}</span>
              ),
            )}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-primary-foreground/90">
            {hero.subcopy || DEFAULT_HERO.subcopy}
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            {(hero.primaryCtaHref || "").startsWith("http") ? (
              <a
                href={hero.primaryCtaHref}
                className="group inline-flex items-center gap-2 rounded-sm bg-accent px-6 py-3.5 text-sm font-semibold uppercase tracking-wider text-accent-foreground transition hover:bg-gold-soft"
              >
                {hero.primaryCtaLabel}{" "}
                <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            ) : (
              <a
                href={hero.primaryCtaHref || "#catalog"}
                className="group inline-flex items-center gap-2 rounded-sm bg-accent px-6 py-3.5 text-sm font-semibold uppercase tracking-wider text-accent-foreground transition hover:bg-gold-soft"
              >
                {hero.primaryCtaLabel || DEFAULT_HERO.primaryCtaLabel}{" "}
                <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            )}
            <Link
              href={hero.secondaryCtaHref || "/shop"}
              className="inline-flex items-center gap-2 rounded-sm border border-accent/50 bg-accent/10 px-6 py-3.5 text-sm font-semibold uppercase tracking-wider text-accent transition hover:bg-accent/20"
            >
              {hero.secondaryCtaLabel || DEFAULT_HERO.secondaryCtaLabel}{" "}
              <ArrowUpRight className="size-4" />
            </Link>
            <Link
              href="/affiliates"
              className="inline-flex items-center gap-2 rounded-sm border border-primary-foreground/50 px-6 py-3.5 text-sm font-semibold uppercase tracking-wider transition hover:bg-primary-foreground/10"
            >
              Become an Affiliate
            </Link>
            <a
              href="https://www.prescribeusa.com/register?role=provider&ref=cmp4iqnah00ci10n0xxewcr9x"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 rounded-sm border border-accent/40 px-6 py-3.5 text-sm font-semibold uppercase tracking-wider text-accent transition hover:bg-accent/10"
            >
              Become a Prescriber{" "}
              <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </div>
        </div>
      </div>
      <div className="relative border-t border-primary-foreground/25">
        <div className="container-x grid grid-cols-2 gap-8 py-8 text-sm md:grid-cols-4">
          {[
            { k: "100+", v: "Compounded Rx products" },
            { k: "503A/B", v: "Certified compounding" },
            { k: "Rx Only", v: "Physician supervised" },
            { k: "24/7", v: "Clinical support" },
          ].map((s) => (
            <div key={s.v}>
              <div className="font-display text-2xl text-accent">{s.k}</div>
              <div className="text-xs uppercase tracking-widest text-primary-foreground/80">{s.v}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
