"use client";

import Link from "next/link";
import { ArrowUpRight, Lock } from "lucide-react";
import { useAccess } from "@/lib/access";

const resources = [
  {
    title: "Compounded Peptides",
    desc: "503A & 503B compounded peptide therapies — BPC-157, TB-500, GHK-Cu, CJC-1295, and signature blends.",
    href: "/products",
  },
  {
    title: "GLP-1 Therapies",
    desc: "Semaglutide, Tirzepatide, and Retatrutide — injectable and sublingual formulations for weight management.",
    href: "/products",
  },
  {
    title: "Korean Exosomes",
    desc: "Premium cosmetic-grade Korean exosome therapies for medical aesthetics — SX, PX, Spicule, hair, and skin booster lines.",
    href: "/exosomes",
  },
  {
    title: "Aesthetic & Medical Devices",
    desc: "Distribution of clinical aesthetic devices, injectable ancillaries, and medical supplies for modern practices.",
    href: "/supplies",
  },
];

export function ResourcesSection() {
  const access = useAccess();
  const unlocked = !!access;
  return (
    <section className="container-x py-20 md:py-28">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <span className="text-xs font-semibold uppercase tracking-widest text-accent">
            Practitioner resources
          </span>
          <h2 className="mt-3 max-w-3xl font-display text-3xl font-semibold text-primary md:text-4xl">
            A single source for the modalities defining today&apos;s practice.
          </h2>
          {!unlocked && (
            <p className="mt-4 inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/5 px-3 py-1 text-xs uppercase tracking-widest text-primary/70">
              <Lock className="size-3" /> Verified practitioners & affiliates only
            </p>
          )}
        </div>
      </div>
      <div className="mt-10 grid gap-3 md:grid-cols-2">
        {resources.map((r, i) =>
          unlocked ? (
            <Link
              key={r.title}
              href={r.href}
              className="group rounded-3xl border border-primary/10 bg-white/90 p-7 shadow-[0_12px_32px_rgba(15,40,60,0.04)] transition hover:-translate-y-0.5 hover:border-accent/40"
            >
              <ResourceCardContent index={i} title={r.title} desc={r.desc} locked={false} />
            </Link>
          ) : (
            <a
              key={r.title}
              href="#register"
              className="group rounded-3xl border border-primary/10 bg-white/90 p-7 shadow-[0_12px_32px_rgba(15,40,60,0.04)] transition hover:-translate-y-0.5 hover:border-accent/40"
            >
              <ResourceCardContent index={i} title={r.title} desc={r.desc} locked />
            </a>
          ),
        )}
      </div>
      {!unlocked && (
        <p className="mt-6 text-sm text-muted-foreground">
          Register your practice below or{" "}
          <Link href="/affiliates" className="text-primary underline-offset-4 hover:underline">
            apply as an affiliate
          </Link>{" "}
          to unlock these pages.
        </p>
      )}
    </section>
  );
}

function ResourceCardContent({
  index,
  title,
  desc,
  locked,
}: {
  index: number;
  title: string;
  desc: string;
  locked: boolean;
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <div className="text-xs uppercase tracking-widest text-accent">0{index + 1}</div>
        <h3 className="mt-2 font-display text-2xl font-semibold text-primary">{title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{desc}</p>
        {locked && (
          <span className="mt-3 inline-flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-primary/60">
            <Lock className="size-3" /> Locked — register to access
          </span>
        )}
      </div>
      {locked ? (
        <Lock className="mt-1 size-5 shrink-0 text-primary/40" />
      ) : (
        <ArrowUpRight className="mt-1 size-5 shrink-0 text-primary transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
      )}
    </div>
  );
}
