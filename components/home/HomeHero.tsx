import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getContentBlock, type HomeHeroBody } from "@/lib/content";

const DEFAULT_HERO: HomeHeroBody = {
  headline:
    "Precision peptides, exosomes & aesthetic equipment for physicians, MedSpa, Aesthetic practitioners and Clinics.",
  subcopy:
    "Wellness Tech Distribution partners with licensed physicians and medical practices to deliver pharmaceutical‑grade compounded peptide therapies, GLP‑1 products, cosmetic‑grade Korean exosomes, clinical aesthetic devices, and medical‑grade beauty & wellness equipment. We verify 503A/503B compounding partners and device manufacturers, handle procurement and distribution, and provide clinician‑focused education so teams learn to use products and devices safely and effectively.\n\nBuilt on a secure, Next.js-based B2B platform hosted on private VPS infrastructure, we offer enterprise‑grade security, advanced third‑party integrations, highly customizable workflows, and automation that streamline onboarding, scheduling, inventory, documentation, reporting and billing. More than software, we deliver an end‑to‑end business ecosystem—implementation, ongoing support, and strategic partnership—so practices can scale, improve outcomes, and boost ROI.",
  primaryCtaLabel: "Browse Compounded Therapies",
  primaryCtaHref: "/products",
  secondaryCtaLabel: "Explore exosomes",
  secondaryCtaHref: "/exosomes",
};

export async function HomeHero() {
  const hero = await getContentBlock("home.hero", DEFAULT_HERO);
  const headline = hero.headline || DEFAULT_HERO.headline!;
  // Allow italic "peptides" markup via simple replace if present as plain text
  const parts = headline.split(/(peptides)/i);
  const subcopy = hero.subcopy || DEFAULT_HERO.subcopy || "";
  const subcopyParagraphs = subcopy.split(/\n\n+/).map((p) => p.trim()).filter(Boolean);

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
      <div className="container-x relative grid gap-8 py-14 md:grid-cols-12 md:py-20">
        <div className="md:col-span-8">
          <h1 className="mt-2 font-display text-3xl font-semibold leading-[1.1] md:text-5xl">
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
          <div className="mt-4 max-w-2xl space-y-3 text-sm leading-relaxed text-primary-foreground/90 md:text-base">
            {subcopyParagraphs.map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>
          <div className="mt-7 flex flex-wrap gap-3">
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
            <Link
              href="/register?role=PROVIDER"
              className="group inline-flex items-center gap-2 rounded-sm border border-accent/40 px-6 py-3.5 text-sm font-semibold uppercase tracking-wider text-accent transition hover:bg-accent/10"
            >
              Become a Prescriber{" "}
              <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>
        </div>
      </div>
      <div className="relative border-t border-primary-foreground/25">
        <div className="container-x grid grid-cols-2 gap-6 py-5 text-sm md:grid-cols-4">
          {[
            { k: "100+", v: "Compounded Rx products" },
            { k: "503A/B", v: "Certified compounding" },
            { k: "Rx Only", v: "Physician supervised" },
            { k: "24/7", v: "Clinical support" },
          ].map((s) => (
            <div key={s.v}>
              <div className="font-display text-xl text-accent md:text-2xl">{s.k}</div>
              <div className="text-[10px] uppercase tracking-widest text-primary-foreground/80 md:text-xs">
                {s.v}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
