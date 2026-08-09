"use client";

import { ArrowUpRight, FileDown, Lock } from "lucide-react";
import { useAccess } from "@/lib/access";
import { CatalogAccessGate } from "@/components/CatalogAccessGate";

const downloads = [
  {
    name: "Precision Peptide Therapy — Marketing Catalog",
    file: "/docs/WellnessTechBio_Marketing_Presentation.pdf",
  },
  {
    name: "Compounded Wellness Protocols — Sales Sheet",
    file: "/docs/Compounded_Wellness_Sales_Sheet.pdf",
  },
  {
    name: "503A & 503B Contraindication Reference",
    file: "/docs/503A_503B_With_Contraindications.pdf",
  },
];

export function DownloadsSection() {
  const access = useAccess();
  const unlocked = !!access;
  return (
    <section className="px-3 py-6 md:py-8">
      <div className="overflow-hidden rounded-3xl bg-primary text-primary-foreground shadow-[0_24px_60px_rgba(15,40,60,0.16)]">
        <div className="container-x py-10 md:py-12">
          <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <span className="text-xs font-semibold uppercase tracking-widest text-accent">
                Resources
              </span>
              <h2 className="mt-2 font-display text-2xl font-semibold md:text-3xl">
                Download our practitioner materials.
              </h2>
              <p className="mt-2 text-sm text-primary-foreground/85">
                Full catalog, compounded wellness protocols, and 503A/503B contraindication reference —
                available to verified registered practitioners and affiliates.
              </p>
            </div>
            {unlocked && (
              <p className="inline-flex items-center gap-2 rounded-full border border-accent/40 px-3 py-1 text-xs uppercase tracking-widest text-accent">
                Access granted — {access?.role}
              </p>
            )}
          </div>

          {unlocked ? (
            <div className="mt-6 grid gap-3 md:grid-cols-3">
              {downloads.map((d) => (
                <a
                  key={d.file}
                  href={d.file}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-between gap-3 rounded-2xl border border-accent/30 bg-primary/40 p-4 transition hover:border-accent hover:bg-primary/60"
                >
                  <div className="flex items-center gap-3">
                    <FileDown className="size-5 shrink-0 text-accent" />
                    <span className="text-sm font-medium leading-snug">{d.name}</span>
                  </div>
                  <ArrowUpRight className="size-4 shrink-0 text-accent transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </a>
              ))}
            </div>
          ) : (
            <div className="mt-6 grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
              <div className="rounded-2xl border border-accent/25 bg-primary/35 p-4 md:p-5">
                <div className="flex items-center gap-2 text-accent">
                  <Lock className="size-4" />
                  <span className="text-xs font-semibold uppercase tracking-widest">
                    Verified access required
                  </span>
                </div>
                <p className="mt-2 text-sm text-primary-foreground/90">
                  Catalogs and marketing tools unlock after a short practitioner request.
                </p>
                <ul className="mt-3 space-y-1.5 text-sm text-primary-foreground/85">
                  {downloads.map((d) => (
                    <li key={d.file} className="flex items-start gap-2">
                      <Lock className="mt-0.5 size-3.5 shrink-0 text-accent" />
                      <span className="leading-snug">{d.name}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-2xl bg-white p-4 text-foreground md:p-5">
                <CatalogAccessGate source="home_downloads" embedded />
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
