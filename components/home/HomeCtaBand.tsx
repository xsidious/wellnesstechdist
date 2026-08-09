import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getContentBlock, type HomeCtaBody } from "@/lib/content";

const DEFAULT_CTA: HomeCtaBody = {
  eyebrow: "Ready to partner",
  headline: "Start with verified access to the formulary and marketplace.",
  body: "Register your practice, explore the shop, or speak with our clinical team about protocols and equipment.",
  ctaLabel: "Contact us",
  ctaHref: "/contact",
};

export async function HomeCtaBand() {
  const cta = await getContentBlock("home.cta", DEFAULT_CTA);
  if (!cta.headline && !cta.body) return null;

  return (
    <section className="bg-primary text-primary-foreground">
      <div className="container-x flex flex-col items-start gap-6 py-20 md:flex-row md:items-end md:justify-between md:py-24">
        <div className="max-w-2xl">
          <span className="text-xs font-semibold uppercase tracking-widest text-accent">
            {cta.eyebrow || DEFAULT_CTA.eyebrow}
          </span>
          <h2 className="mt-3 font-display text-3xl font-semibold md:text-4xl">
            {cta.headline || DEFAULT_CTA.headline}
          </h2>
          <p className="mt-4 text-primary-foreground/85">{cta.body || DEFAULT_CTA.body}</p>
        </div>
        <Link
          href={cta.ctaHref || "/contact"}
          className="inline-flex items-center gap-2 rounded-sm bg-accent px-6 py-3.5 text-sm font-semibold uppercase tracking-wider text-accent-foreground hover:bg-gold-soft"
        >
          {cta.ctaLabel || DEFAULT_CTA.ctaLabel} <ArrowUpRight className="size-4" />
        </Link>
      </div>
    </section>
  );
}
