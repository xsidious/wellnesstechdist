import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const categories = [
  {
    title: "GLP-1 & weight",
    href: "/products",
    image: "/images/cat-glp1.jpg",
    alt: "GLP-1 weight management therapies",
  },
  {
    title: "Peptides",
    href: "/products",
    image: "/images/cat-peptides.jpg",
    alt: "Compounded peptide therapies",
  },
  {
    title: "Exosomes",
    href: "/exosomes",
    image: "/images/cat-exosomes.jpg",
    alt: "Korean cosmetic-grade exosomes",
  },
  {
    title: "Anti-aging",
    href: "/products",
    image: "/images/cat-antiaging.jpg",
    alt: "Anti-aging and longevity protocols",
  },
  {
    title: "Performance",
    href: "/products",
    image: "/images/cat-performance.jpg",
    alt: "Performance and recovery therapies",
  },
  {
    title: "Equipment",
    href: "/supplies",
    image: "/images/cat-equipment.jpg",
    alt: "Clinical aesthetic equipment",
  },
];

export function HomeCategoriesSection() {
  return (
    <section className="container-x py-20 md:py-28">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl">
          <span className="text-xs font-semibold uppercase tracking-widest text-accent">
            Formulary & systems
          </span>
          <h2 className="mt-3 font-display text-3xl font-semibold text-primary md:text-4xl">
            Built around the modalities practices buy every week.
          </h2>
        </div>
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 self-start rounded-full border border-primary/15 px-5 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-primary transition hover:border-accent hover:text-accent md:self-auto"
        >
          View marketplace <ArrowUpRight className="size-3.5" />
        </Link>
      </div>

      <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((c) => (
          <Link
            key={c.title}
            href={c.href}
            className="group relative aspect-[4/3] overflow-hidden rounded-3xl"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={c.image}
              alt={c.alt}
              width={800}
              height={600}
              loading="lazy"
              className="size-full object-cover transition duration-700 group-hover:scale-[1.05]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/85 via-primary/25 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-5">
              <h3 className="font-display text-xl font-semibold text-primary-foreground">
                {c.title}
              </h3>
              <span className="inline-flex size-9 items-center justify-center rounded-full bg-accent text-accent-foreground transition group-hover:scale-105">
                <ArrowUpRight className="size-4" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
