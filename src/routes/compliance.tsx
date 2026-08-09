import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { FileDown, ShieldCheck, FlaskConical, AlertTriangle, Lock } from "lucide-react";
import { useAccess } from "@/lib/access";
import { CatalogAccessGate } from "@/components/CatalogAccessGate";

export const Route = createFileRoute("/compliance")({
  head: () => ({
    meta: [
      { title: "503A & 503B Compliance — Wellness Tech Bio Distribution" },
      { name: "description", content: "Understanding the difference between 503A patient-specific compounding and 503B FDA-registered outsourcing. Reference for licensed practitioners." },
      { property: "og:title", content: "503A & 503B — Wellness Tech Bio Distribution" },
      { property: "og:description", content: "Compounded Rx compliance reference." },
    ],
  }),
  component: Compliance,
});

function Compliance() {
  const access = useAccess();
  const unlocked = !!access;
  return (
    <SiteLayout>
      <section className="bg-primary text-primary-foreground">
        <div className="container-x py-24 md:py-32">
          <span className="text-xs font-semibold uppercase tracking-widest text-accent">Compliance</span>
          <h1 className="mt-3 max-w-3xl font-display text-5xl font-semibold leading-tight md:text-7xl">503A & 503B compounded Rx.</h1>
          <p className="mt-6 max-w-2xl text-primary-foreground/90">Every product in our catalog is compounded under strict 503A or 503B guidelines. All orders are physician-prescribed, batch-tested, and dispensed with complete traceability.</p>
        </div>
      </section>

      <section className="container-x grid gap-8 py-24 md:grid-cols-2">
        <div className="rounded-sm border border-primary/10 bg-card p-10">
          <div className="flex items-center gap-3 text-accent">
            <ShieldCheck className="size-6" />
            <span className="text-xs font-semibold uppercase tracking-widest">503A</span>
          </div>
          <h2 className="mt-3 font-display text-3xl font-semibold text-primary">Traditional Patient-Specific</h2>
          <p className="mt-3 text-muted-foreground">Requires a valid individual patient prescription. Regulated by state pharmacy boards. Must comply with USP &lt;795&gt;/&lt;797&gt; standards.</p>
          <ul className="mt-6 space-y-3 text-sm text-primary/80">
            <li>• Patient-specific Rx required</li>
            <li>• State pharmacy board oversight</li>
            <li>• Custom dose & formulation</li>
            <li>• No FDA batch approval</li>
          </ul>
        </div>
        <div className="rounded-sm border border-accent/30 bg-primary p-10 text-primary-foreground">
          <div className="flex items-center gap-3 text-accent">
            <FlaskConical className="size-6" />
            <span className="text-xs font-semibold uppercase tracking-widest">503B</span>
          </div>
          <h2 className="mt-3 font-display text-3xl font-semibold">FDA-Registered Outsourcing</h2>
          <p className="mt-3 text-primary-foreground/90">Federally registered under FDA oversight. May produce large batches for healthcare facilities without an individual Rx. Operates under CGMP standards.</p>
          <ul className="mt-6 space-y-3 text-sm text-primary-foreground/90">
            <li>• FDA-registered & inspected</li>
            <li>• CGMP manufacturing standards</li>
            <li>• Can supply facilities without Rx</li>
            <li>• Consistent batch quality controls</li>
          </ul>
        </div>
      </section>

      <section className="bg-primary/5 py-24">
        <div className="container-x">
          <span className="text-xs font-semibold uppercase tracking-widest text-accent">Nature classification</span>
          <h2 className="mt-3 max-w-2xl font-display text-4xl font-semibold text-primary">How we classify every compound.</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {[
              { tag: "Natural", desc: "Identical or derived from naturally occurring compounds." },
              { tag: "Semi-Synthetic", desc: "Structurally modified analog of a natural compound." },
              { tag: "Synthetic", desc: "Fully laboratory-synthesized; no direct natural counterpart." },
            ].map((n) => (
              <div key={n.tag} className="rounded-sm border border-primary/10 bg-card p-6">
                <div className="inline-flex rounded-full bg-accent/15 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-accent">{n.tag}</div>
                <p className="mt-4 text-sm text-muted-foreground">{n.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-x py-24">
        <div className="rounded-sm border border-accent/40 bg-accent/5 p-8 md:p-12">
          <div className="flex items-start gap-4">
            <AlertTriangle className="mt-1 size-6 shrink-0 text-accent" />
            <div>
              <h3 className="font-display text-xl font-semibold text-primary">Clinical Reference Only</h3>
              <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
                Side effects and contraindications listed in our materials reflect the most commonly reported. This is not an exhaustive safety profile. Individual responses vary. Always conduct a full patient assessment before prescribing. Compounded medications are not FDA-approved for the indications listed.
              </p>
            </div>
          </div>
        </div>

        {unlocked ? (
          <div className="mt-12 grid gap-4 md:grid-cols-2">
            {[
              { file: "/docs/WellnessTechBio_Marketing_Presentation.pdf", name: "Precision Peptide Therapy Catalog" },
              { file: "/docs/Compounded_Wellness_Sales_Sheet.pdf", name: "Compounded Wellness Protocols" },
              { file: "/docs/503A_503B_With_Contraindications.pdf", name: "503A & 503B Contraindication Reference" },
            ].map((d) => (
              <a key={d.file} href={d.file} target="_blank" rel="noopener noreferrer"
                className="group flex items-center justify-between gap-4 rounded-sm border border-primary/15 bg-card p-5 transition hover:border-accent">
                <div className="flex items-center gap-3">
                  <FileDown className="size-5 text-accent" />
                  <span className="text-sm font-medium text-primary">{d.name}</span>
                </div>
                <span className="text-xs uppercase tracking-widest text-muted-foreground group-hover:text-accent">PDF</span>
              </a>
            ))}
          </div>
        ) : (
          <div className="mt-12">
            <div className="mb-6 flex items-center gap-2 text-primary/70">
              <Lock className="size-4 text-accent" />
              <span className="text-xs font-semibold uppercase tracking-widest">Catalogs & marketing materials — request access below</span>
            </div>
            <CatalogAccessGate source="compliance_downloads" />
          </div>
        )}
      </section>
    </SiteLayout>
  );
}