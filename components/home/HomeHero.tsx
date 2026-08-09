import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getContentBlock, type HomeHeroBody } from "@/lib/content";

const DEFAULT_HERO: HomeHeroBody = {
  headline: "The B2B backbone for modern aesthetic & wellness practices.",
  subcopy:
    "Pharmaceutical-grade compounded therapies, Korean exosomes, and clinical equipment — sourced, verified, and delivered through a secure practitioner marketplace.",
  primaryCtaLabel: "Browse therapies",
  primaryCtaHref: "/products",
  secondaryCtaLabel: "Get practice access",
  secondaryCtaHref: "/register?role=PROVIDER",
};

export async function HomeHero() {
  const hero = await getContentBlock("home.hero", DEFAULT_HERO);
  // Prefer concise conversion copy; fall back if CMS still has a long legacy draft
  const cmsHeadline = (hero.headline || "").trim();
  const headline =
    cmsHeadline && cmsHeadline.length <= 140 ? cmsHeadline : DEFAULT_HERO.headline!;
  const parts = headline.split(/(peptides|B2B)/i);
  const cmsSub = (hero.subcopy || "").split(/\n\n+/)[0]?.trim() || "";
  const subcopy =
    cmsSub && cmsSub.length <= 220 ? cmsSub : DEFAULT_HERO.subcopy!;

  return (
    <section className="relative overflow-hidden">
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

      <div className="container-x relative flex min-h-[82vh] flex-col justify-center py-16 md:min-h-[78vh] md:py-24">
        <p className="hero-fade-1 font-display text-sm font-semibold uppercase tracking-[0.24em] text-accent md:text-base">
          Wellness Tech Distribution
        </p>
        <h1 className="hero-fade-2 mt-5 max-w-4xl font-display text-3xl font-semibold leading-[1.05] text-primary-foreground md:text-5xl lg:text-[3.4rem]">
          {parts.map((p, i) =>
            /^(peptides|B2B)$/i.test(p) ? (
              <span key={i} className="italic text-accent">
                {p}
              </span>
            ) : (
              <span key={i}>{p}</span>
            ),
          )}
        </h1>
        <p className="hero-fade-3 mt-6 max-w-2xl text-base leading-relaxed text-primary-foreground/90 md:text-lg">
          {subcopy}
        </p>
        <div className="hero-fade-4 mt-9 flex flex-wrap gap-3">
          <Link
            href={hero.primaryCtaHref || "/products"}
            className="group inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3.5 text-xs font-semibold uppercase tracking-[0.14em] text-accent-foreground shadow-[0_14px_32px_rgba(0,0,0,0.2)] transition hover:bg-gold-soft"
          >
            {hero.primaryCtaLabel || DEFAULT_HERO.primaryCtaLabel}
            <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
          <Link
            href={hero.secondaryCtaHref || "/register?role=PROVIDER"}
            className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/35 bg-primary-foreground/10 px-6 py-3.5 text-xs font-semibold uppercase tracking-[0.14em] text-primary-foreground backdrop-blur-sm transition hover:bg-primary-foreground/18"
          >
            {hero.secondaryCtaLabel || DEFAULT_HERO.secondaryCtaLabel}
            <ArrowUpRight className="size-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
