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
        <div className="container-x grid gap-12 py-16 md:grid-cols-12 md:py-20">
          <div className="md:col-span-7">
            <span className="text-xs font-semibold uppercase tracking-widest text-accent">
              Resources
            </span>
            <h2 className="mt-3 font-display text-3xl font-semibold md:text-4xl">
              Download our practitioner materials.
            </h2>
            <p className="mt-4 max-w-xl text-primary-foreground/85">
              Full catalog, compounded wellness protocols, and 503A/503B contraindication reference —
              available to verified registered practitioners and affiliates.
            </p>
            {unlocked && (
              <p className="mt-4 inline-flex items-center gap-2 rounded-full border border-accent/40 px-3 py-1 text-xs uppercase tracking-widest text-accent">
                Access granted — {access?.role}
              </p>
            )}
          </div>
          <div className="md:col-span-5 space-y-3">
            {unlocked ? (
              downloads.map((d) => (
                <a
                  key={d.file}
                  href={d.file}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-between gap-4 rounded-2xl border border-accent/30 bg-primary/40 p-5 transition hover:border-accent hover:bg-primary/60"
                >
                  <div className="flex items-center gap-3">
                    <FileDown className="size-5 text-accent" />
                    <span className="text-sm font-medium">{d.name}</span>
                  </div>
                  <ArrowUpRight className="size-4 text-accent transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </a>
              ))
            ) : (
              <LockedPanel />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function LockedPanel() {
  return (
    <div className="rounded-2xl border border-accent/30 bg-primary/40 p-6">
      <div className="flex items-center gap-2 text-accent">
        <Lock className="size-4" />
        <span className="text-xs font-semibold uppercase tracking-widest">Verified access required</span>
      </div>
      <p className="mt-3 text-sm text-primary-foreground/90">
        Catalogs, downloads and marketing tools are restricted to verified practitioners and affiliates.
        Complete the request form below to unlock.
      </p>
      <ul className="mt-4 space-y-2 text-sm text-primary-foreground/90">
        {downloads.map((d) => (
          <li key={d.file} className="flex items-center gap-2 opacity-70">
            <Lock className="size-3.5 text-accent" /> {d.name}
          </li>
        ))}
      </ul>
      <div className="mt-6 rounded-2xl bg-background p-1">
        <CatalogAccessGate source="home_downloads" />
      </div>
    </div>
  );
}
