import type { Metadata } from "next";
import { CatalogEmbed } from "@/components/CatalogEmbed";
import { PageHero } from "@/components/PageHero";

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
      <PageHero
        eyebrow="Compounded Therapies"
        title="Compounded Rx products. Physician-supervised."
        description="Browse our full catalog of 503A & 503B compounded therapies below."
        align="center"
        size="sm"
      />

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
