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
  // Keep the full homepage narrative; CTAs can still come from CMS.
  const headline = DEFAULT_HERO.headline!;
  const parts = headline.split(/(peptides)/i);
  const paragraphs = (DEFAULT_HERO.subcopy || "")
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <section className="px-3 pb-2 pt-1">
      <div className="relative overflow-hidden rounded-3xl shadow-[0_18px_50px_rgba(15,40,60,0.12)]">
        <div className="absolute inset-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/hero.jpg"
            alt=""
            width={1600}
            height={1200}
            className="hero-kenburns size-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/90 to-primary/40" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,oklch(0.78_0.14_85/0.18),transparent_45%)]" />
        </div>

        <div className="container-x relative py-12 md:py-16 lg:py-20">
          <p className="hero-fade-1 font-display text-sm font-semibold uppercase tracking-[0.22em] text-accent md:text-base">
            Wellness Tech Distribution
          </p>
          <h1 className="hero-fade-2 mt-4 max-w-4xl font-display text-3xl font-semibold leading-[1.08] text-primary-foreground md:text-4xl lg:text-[2.85rem]">
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
          <div className="hero-fade-3 mt-5 max-w-3xl space-y-3 text-sm leading-relaxed text-primary-foreground/90 md:text-[15px]">
            {paragraphs.map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>
          <div className="hero-fade-4 mt-7 flex flex-wrap gap-3">
            <Link
              href={hero.primaryCtaHref || "/products"}
              className="group inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3.5 text-xs font-semibold uppercase tracking-[0.14em] text-accent-foreground shadow-[0_14px_32px_rgba(0,0,0,0.2)] transition hover:bg-gold-soft"
            >
              {hero.primaryCtaLabel || DEFAULT_HERO.primaryCtaLabel}
              <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
            <Link
              href={hero.secondaryCtaHref || "/exosomes"}
              className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/35 bg-primary-foreground/10 px-6 py-3.5 text-xs font-semibold uppercase tracking-[0.14em] text-primary-foreground backdrop-blur-sm transition hover:bg-primary-foreground/18"
            >
              {hero.secondaryCtaLabel || DEFAULT_HERO.secondaryCtaLabel}
              <ArrowUpRight className="size-4" />
            </Link>
            <Link
              href="/register?role=PROVIDER"
              className="inline-flex items-center gap-2 rounded-full border border-accent/45 px-6 py-3.5 text-xs font-semibold uppercase tracking-[0.14em] text-accent transition hover:bg-accent/10"
            >
              Become a Prescriber
              <ArrowUpRight className="size-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
