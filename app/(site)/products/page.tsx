import type { Metadata } from "next";
import { CatalogEmbed } from "@/components/CatalogEmbed";

export const metadata: Metadata = {
  title: "Compounded Therapies — Wellness Tech Bio Distribution",
  description:
    "Browse our compounded Rx product catalog: GLP-1s, peptides, NAD+, hormone & sexual health, and combination blends.",
  openGraph: {
    title: "Compounded Therapies — Wellness Tech Bio Distribution",
    description: "503A & 503B compounded Rx product catalog for physicians.",
  },
};

export default function ProductsPage() {
  return (
    <>
      <section className="border-b border-primary/10 bg-primary/5">
        <div className="container-x py-16 text-center md:py-24">
          <span className="text-xs font-semibold uppercase tracking-widest text-accent">
            Compounded Therapies
          </span>
          <h1 className="mx-auto mt-3 max-w-3xl font-display text-4xl font-semibold text-primary md:text-5xl">
            Compounded Rx products. Physician-supervised.
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            Browse our full catalog of 503A &amp; 503B compounded therapies below.
          </p>
        </div>
      </section>

      <section className="container-x py-12 md:py-16">
        <CatalogEmbed source="products_page" />
      </section>

      <p className="container-x pb-12 text-center text-xs text-muted-foreground">
        For licensed healthcare practitioners only. Compounded medications require a valid
        patient-practitioner relationship and are not FDA-approved for the indications listed. Clinical
        judgment required.
      </p>
    </>
  );
}
