import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const verticals = [
  {
    title: "Compounded Rx",
    eyebrow: "Peptides & GLP-1",
    body: "Pharmaceutical-grade compounded peptides, GLP-1 therapies, NAD+, and hormone protocols from verified 503A/503B partners.",
    href: "/products",
    cta: "Browse therapies",
    image: "/images/peptides-hero.jpg",
    alt: "Compounded peptide vial and clinical device on marble",
  },
  {
    title: "Exosomes",
    eyebrow: "Korean aesthetics",
    body: "Cosmetic-grade Korean exosome systems for regenerative aesthetics — SX, PX, Black Label, and hair protocols.",
    href: "/exosomes",
    cta: "Explore exosomes",
    image: "/images/cellexosome-black-label.png",
    alt: "CellExosome Black Label Korean exosome product",
    imageClass: "object-contain bg-black",
  },
];

export function HomeVerticalsSection() {
  return (
    <section id="catalog" className="container-x py-20 md:py-28">
      <div className="max-w-2xl">
        <span className="text-xs font-semibold uppercase tracking-widest text-accent">
          Therapeutic verticals
        </span>
        <h2 className="mt-3 font-display text-3xl font-semibold text-primary md:text-4xl">
          Compounded Rx and Korean exosomes. One standard of quality.
        </h2>
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        {verticals.map((v) => (
          <Link
            key={v.title}
            href={v.href}
            className="group overflow-hidden border border-primary/10 bg-background transition hover:border-accent/50"
          >
            <div className="relative aspect-[16/10] overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={v.image}
                alt={v.alt}
                width={1200}
                height={750}
                loading="lazy"
                className={`size-full transition duration-500 group-hover:scale-[1.02] ${
                  v.imageClass || "object-cover"
                }`}
              />
            </div>
            <div className="p-6 md:p-8">
              <span className="text-[10px] font-semibold uppercase tracking-widest text-accent">
                {v.eyebrow}
              </span>
              <h3 className="mt-2 font-display text-2xl font-semibold text-primary">{v.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{v.body}</p>
              <span className="mt-5 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary transition group-hover:text-accent">
                {v.cta} <ArrowUpRight className="size-3.5" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
