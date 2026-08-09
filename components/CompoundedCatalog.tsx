"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search, ArrowUpRight, FileDown } from "lucide-react";
import {
  COMPOUNDED_CATALOG,
  KIND_LABEL,
  type CatalogCategory,
  type CatalogProduct,
} from "@/lib/catalog/compounded-catalog";
import { useTrackEvent } from "@/lib/useTrackEvent";

const SALES_SHEET = "/docs/Compounded_Wellness_Sales_Sheet.pdf";

function ProductRow({ product }: { product: CatalogProduct }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-primary/10 last:border-0">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-start justify-between gap-3 px-4 py-3 text-left transition hover:bg-primary/5"
      >
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-semibold text-primary">{product.name}</span>
            <span className="rounded-sm bg-accent/15 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-accent">
              {KIND_LABEL[product.kind]}
            </span>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">{product.strength}</p>
        </div>
        <span className="mt-1 text-xs text-accent">{open ? "−" : "+"}</span>
      </button>
      {open && (
        <div className="space-y-2 px-4 pb-4 text-xs leading-relaxed text-muted-foreground">
          <p>
            <span className="font-semibold text-primary">Use: </span>
            {product.use}
          </p>
          <p>
            <span className="font-semibold text-primary">Contraindications: </span>
            {product.contraindications}
          </p>
          <p>
            <span className="font-semibold text-primary">Side effects: </span>
            {product.sideEffects}
          </p>
        </div>
      )}
    </div>
  );
}

function CategoryBlock({ category }: { category: CatalogCategory }) {
  return (
    <section className="overflow-hidden rounded-sm border border-primary/10 bg-card">
      <div className="border-b border-primary/10 bg-primary/5 px-4 py-3">
        <h3 className="font-display text-base font-semibold text-primary">{category.title}</h3>
        <p className="mt-1 text-xs text-muted-foreground">{category.blurb}</p>
      </div>
      <div>
        {category.products.map((p) => (
          <ProductRow key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}

export function CompoundedCatalog({
  onInteract,
  source = "catalog_embed",
}: {
  onInteract?: () => void;
  source?: string;
}) {
  const track = useTrackEvent();
  const [query, setQuery] = useState("");
  const [activeId, setActiveId] = useState<string>("all");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return COMPOUNDED_CATALOG.map((cat) => {
      if (activeId !== "all" && cat.id !== activeId) return null;
      const products = cat.products.filter((p) => {
        if (!q) return true;
        return (
          p.name.toLowerCase().includes(q) ||
          p.use.toLowerCase().includes(q) ||
          p.strength.toLowerCase().includes(q) ||
          cat.title.toLowerCase().includes(q)
        );
      });
      if (!products.length) return null;
      return { ...cat, products };
    }).filter(Boolean) as CatalogCategory[];
  }, [query, activeId]);

  const total = COMPOUNDED_CATALOG.reduce((n, c) => n + c.products.length, 0);

  return (
    <div className="mx-auto w-full max-w-3xl" onClick={onInteract} onKeyDown={onInteract}>
      <div className="rounded-sm border border-primary/10 bg-card p-4 md:p-5">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-accent">
              Practitioner formulary
            </p>
            <h2 className="mt-1 font-display text-xl font-semibold text-primary">Compounded Rx catalog</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              {total}+ formulations · 503A & 503B · physician-supervised
            </p>
          </div>
          <a
            href={SALES_SHEET}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-accent hover:underline"
          >
            <FileDown className="size-3.5" /> Full sales sheet
          </a>
        </div>

        <div className="relative mt-4">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products…"
            className="w-full rounded-sm border border-input bg-background py-2.5 pl-10 pr-3 text-sm outline-none focus:border-accent"
          />
        </div>

        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          <FilterChip active={activeId === "all"} onClick={() => setActiveId("all")} label="All" />
          {COMPOUNDED_CATALOG.map((c) => (
            <FilterChip
              key={c.id}
              active={activeId === c.id}
              onClick={() => setActiveId(c.id)}
              label={c.title.split("&")[0].trim()}
            />
          ))}
        </div>
      </div>

      <div className="mt-4 max-h-[640px] space-y-4 overflow-y-auto pr-1">
        {filtered.length === 0 ? (
          <p className="rounded-sm border border-primary/10 bg-card p-6 text-center text-sm text-muted-foreground">
            No products match your search.
          </p>
        ) : (
          filtered.map((cat) => <CategoryBlock key={cat.id} category={cat} />)
        )}
      </div>

      <div className="mt-6 rounded-sm border border-primary/10 bg-card p-6 text-center">
        <p className="text-sm text-muted-foreground">
          Ready to offer these therapies in your practice? Licensed practitioners can register for
          prescribing access and start ordering today.
        </p>
        <Link
          href="/register?role=PROVIDER"
          onClick={() => track("catalog_prescriber_cta_click", source)}
          className="mt-4 inline-flex items-center justify-center gap-2 rounded-sm bg-primary px-6 py-3 text-sm font-semibold uppercase tracking-wider text-primary-foreground transition hover:bg-primary/90"
        >
          Become a Prescriber <ArrowUpRight className="size-4" />
        </Link>
      </div>
    </div>
  );
}

function FilterChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`shrink-0 rounded-sm border px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider transition ${
        active
          ? "border-accent bg-accent/15 text-accent"
          : "border-primary/15 text-primary/70 hover:border-accent/40 hover:text-accent"
      }`}
    >
      {label}
    </button>
  );
}
