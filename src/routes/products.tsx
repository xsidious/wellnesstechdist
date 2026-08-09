import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { CatalogEmbed } from "@/components/CatalogEmbed";

export const Route = createFileRoute("/products")({
  head: () => ({
    meta: [
      { title: "Compounded Therapies — Wellness Tech Bio Distribution" },
      { name: "description", content: "Browse our compounded Rx product catalog: GLP-1s, peptides, NAD+, hormone & sexual health, and combination blends." },
      { property: "og:title", content: "Compounded Therapies — Wellness Tech Bio Distribution" },
      { property: "og:description", content: "503A & 503B compounded Rx product catalog for physicians." },
    ],
  }),
  component: Products,
});

function Products() {
  return (
    <SiteLayout>
      <section className="border-b border-primary/10 bg-primary/5">
        <div className="container-x py-16 md:py-24 text-center">
          <span className="text-xs font-semibold uppercase tracking-widest text-accent">Compounded Therapies</span>
          <h1 className="mt-3 max-w-3xl mx-auto font-display text-4xl font-semibold text-primary md:text-5xl">Compounded Rx products. Physician-supervised.</h1>
          <p className="mt-4 max-w-2xl mx-auto text-muted-foreground">Browse our full catalog of 503A & 503B compounded therapies below.</p>
        </div>
      </section>

      <section className="container-x py-12 md:py-16">
        <CatalogEmbed source="products_page" />
      </section>

      <p className="container-x pb-12 text-center text-xs text-muted-foreground">
        For licensed healthcare practitioners only. Compounded medications require a valid patient-practitioner relationship and are not FDA-approved for the indications listed. Clinical judgment required.
      </p>
    </SiteLayout>
  );
}