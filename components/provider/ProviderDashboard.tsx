"use client";

import Link from "next/link";
import { useState } from "react";
import { formatCents } from "@/lib/utils";
import { QueryProvider } from "@/components/QueryProvider";
import {
  useCreateProduct,
  useProviderMe,
  useProviderSubOrders,
  useToggleProduct,
  useUpdateSubOrder,
  useUpdateVariant,
} from "@/lib/api/provider";

const NEXT_STATUSES: Record<string, { label: string; status: string }[]> = {
  PAID: [
    { label: "Start fulfilling", status: "FULFILLING" },
    { label: "Cancel", status: "CANCELLED" },
  ],
  FULFILLING: [
    { label: "Mark shipped", status: "SHIPPED" },
    { label: "Cancel", status: "CANCELLED" },
  ],
  SHIPPED: [{ label: "Complete", status: "COMPLETED" }],
};

function Overview() {
  const { data, isLoading, error } = useProviderMe();
  const toggle = useToggleProduct();
  const updateVariant = useUpdateVariant();

  if (isLoading) return <p className="text-sm text-muted-foreground">Loading provider…</p>;
  if (error) return <p className="text-sm text-destructive">{error.message}</p>;
  if (!data) return null;

  return (
    <div className="space-y-8">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            label: "Status",
            value: data.profile.approved ? "Approved" : "Pending approval",
          },
          { label: "Catalog stock", value: String(data.stockHealth.totalUnits) },
          { label: "Open fulfillment", value: String(data.openFulfillmentCount) },
          { label: "Pending earnings", value: formatCents(data.earningsCents) },
        ].map((c) => (
          <div key={c.label} className="border-t border-primary/15 pt-4">
            <div className="text-xs uppercase tracking-widest text-muted-foreground">{c.label}</div>
            <div className="mt-1 font-display text-2xl font-semibold text-primary">{c.value}</div>
          </div>
        ))}
      </div>

      {data.stockHealth.lowStock.length > 0 && (
        <div className="rounded-sm border border-accent/30 bg-accent/10 p-4 text-sm">
          <strong className="text-primary">Low stock:</strong>{" "}
          {data.stockHealth.lowStock
            .slice(0, 8)
            .map((s) => `${s.sku} (${s.stock})`)
            .join(", ")}
        </div>
      )}

      <section id="products">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <h2 className="font-display text-xl font-semibold text-primary">Products</h2>
          <Link
            href="/provider/products/new"
            className="text-xs font-semibold uppercase tracking-wider text-accent hover:underline"
          >
            + New product
          </Link>
        </div>
        <ul className="mt-4 divide-y divide-primary/10 border-t border-primary/10">
          {data.products.map((p) => (
            <li key={p.id} className="py-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <Link href={`/product/${p.slug}`} className="font-medium text-primary hover:underline">
                    {p.name}
                  </Link>
                  <p className="text-xs text-muted-foreground">
                    {p.category} · {p.stock} units · {p.active ? "Active" : "Inactive"}
                  </p>
                </div>
                <button
                  type="button"
                  disabled={toggle.isPending || !data.profile.approved}
                  onClick={() => toggle.mutate({ id: p.id, active: !p.active })}
                  className="rounded-sm border border-primary/20 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider"
                >
                  {p.active ? "Deactivate" : "Activate"}
                </button>
              </div>
              <ul className="mt-3 space-y-2">
                {p.variants.map((v) => (
                  <li
                    key={v.id}
                    className="flex flex-wrap items-center gap-3 rounded-sm bg-muted/40 px-3 py-2 text-sm"
                  >
                    <span className="font-medium">{v.name}</span>
                    <span className="text-muted-foreground">{v.sku}</span>
                    <span>{formatCents(v.priceCents)}</span>
                    <label className="ml-auto flex items-center gap-2 text-xs">
                      Stock
                      <input
                        type="number"
                        min={0}
                        defaultValue={v.stock}
                        className="w-20 rounded-sm border border-input bg-background px-2 py-1"
                        onBlur={(e) => {
                          const stock = Number(e.target.value);
                          if (!Number.isNaN(stock) && stock !== v.stock) {
                            updateVariant.mutate({ id: v.id, stock });
                          }
                        }}
                      />
                    </label>
                  </li>
                ))}
              </ul>
            </li>
          ))}
          {data.products.length === 0 && (
            <li className="py-4 text-sm text-muted-foreground">No products yet.</li>
          )}
        </ul>
      </section>
    </div>
  );
}

function OrdersPanel() {
  const { data, isLoading, error } = useProviderSubOrders();
  const update = useUpdateSubOrder();

  if (isLoading) return <p className="text-sm text-muted-foreground">Loading orders…</p>;
  if (error) return <p className="text-sm text-destructive">{error.message}</p>;

  return (
    <section id="orders" className="space-y-4">
      <h2 className="font-display text-xl font-semibold text-primary">Fulfillment</h2>
      <ul className="divide-y divide-primary/10 border-t border-primary/10">
        {(data ?? []).map((s) => (
          <li key={s.id} className="space-y-2 py-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <div className="font-medium text-primary">{s.id.slice(0, 10)}…</div>
                <div className="text-xs text-muted-foreground">
                  {s.buyerEmail} · {s.status} · {formatCents(s.subtotalCents)}
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {(NEXT_STATUSES[s.status] || []).map((a) => (
                  <button
                    key={a.status}
                    type="button"
                    disabled={update.isPending}
                    onClick={() => update.mutate({ id: s.id, status: a.status })}
                    className="rounded-sm border border-primary/20 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider"
                  >
                    {a.label}
                  </button>
                ))}
              </div>
            </div>
            <ul className="text-xs text-muted-foreground">
              {s.items.map((i) => (
                <li key={i.id}>
                  {i.quantity}× {i.productName} ({i.variantName}) — {formatCents(i.lineTotalCents)}
                </li>
              ))}
            </ul>
          </li>
        ))}
        {(data ?? []).length === 0 && (
          <li className="py-4 text-sm text-muted-foreground">No sub-orders yet.</li>
        )}
      </ul>
    </section>
  );
}

function QuickCreate() {
  const create = useCreateProduct();
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Peptides");
  const [description, setDescription] = useState("");
  const [variantName, setVariantName] = useState("Default");
  const [sku, setSku] = useState("");
  const [priceCents, setPriceCents] = useState("9900");
  const [stock, setStock] = useState("10");

  return (
    <section id="quick-create" className="space-y-3 rounded-sm border border-primary/10 bg-card p-5">
      <h2 className="font-display text-xl font-semibold text-primary">Quick add product</h2>
      <p className="text-sm text-muted-foreground">
        Creates a variable product with one SKU. Use New product for images and multi-variants.
      </p>
      <form
        className="grid gap-3 md:grid-cols-2"
        onSubmit={(e) => {
          e.preventDefault();
          create.mutate({
            name,
            category,
            description: description || `${name} — practitioner formulary listing.`,
            variants: [
              {
                sku: sku || `${name.slice(0, 8).toUpperCase().replace(/\s/g, "")}-01`,
                name: variantName,
                priceCents: Number(priceCents),
                stock: Number(stock),
                attrs: { size: variantName },
              },
            ],
          });
        }}
      >
        <input
          className="rounded-sm border border-input px-3 py-2 text-sm"
          placeholder="Product name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          className="rounded-sm border border-input px-3 py-2 text-sm"
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        />
        <input
          className="rounded-sm border border-input px-3 py-2 text-sm md:col-span-2"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          className="rounded-sm border border-input px-3 py-2 text-sm"
          placeholder="Variant name"
          value={variantName}
          onChange={(e) => setVariantName(e.target.value)}
        />
        <input
          className="rounded-sm border border-input px-3 py-2 text-sm"
          placeholder="SKU"
          value={sku}
          onChange={(e) => setSku(e.target.value)}
        />
        <input
          type="number"
          className="rounded-sm border border-input px-3 py-2 text-sm"
          placeholder="Price cents"
          value={priceCents}
          onChange={(e) => setPriceCents(e.target.value)}
        />
        <input
          type="number"
          className="rounded-sm border border-input px-3 py-2 text-sm"
          placeholder="Stock"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
        />
        <button
          type="submit"
          disabled={create.isPending}
          className="rounded-sm bg-primary px-4 py-2 text-xs font-semibold uppercase tracking-wider text-primary-foreground md:col-span-2"
        >
          Create product
        </button>
        {create.isSuccess && (
          <p className="text-sm text-accent md:col-span-2">Product created.</p>
        )}
        {create.isError && (
          <p className="text-sm text-destructive md:col-span-2">{create.error.message}</p>
        )}
      </form>
    </section>
  );
}

function Body() {
  return (
    <div className="space-y-12">
      <Overview />
      <OrdersPanel />
      <QuickCreate />
    </div>
  );
}

export function ProviderDashboard() {
  return (
    <QueryProvider>
      <Body />
    </QueryProvider>
  );
}
