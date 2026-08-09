"use client";

import { useState } from "react";
import { formatCents } from "@/lib/utils";
import {
  useAdminProducts,
  useAdminProviders,
  useCreateAdminProduct,
  useUpdateAdminProduct,
  useDeleteAdminProduct,
  type AdminProduct,
} from "@/lib/api/admin";

function dollarsToCents(value: string) {
  const n = Number(value);
  if (!Number.isFinite(n)) return 0;
  return Math.round(n * 100);
}

function centsToDollars(cents: number) {
  return (cents / 100).toFixed(2);
}

function CreateProductForm() {
  const { data: providers = [] } = useAdminProviders();
  const create = useCreateAdminProduct();
  const [providerId, setProviderId] = useState("");
  const [name, setName] = useState("");
  const [category, setCategory] = useState("general");
  const [description, setDescription] = useState("");
  const [variantName, setVariantName] = useState("Standard");
  const [sku, setSku] = useState("");
  const [priceDollars, setPriceDollars] = useState("99.00");
  const [stock, setStock] = useState("25");

  return (
    <section className="space-y-3 rounded-sm border border-primary/10 bg-card p-5">
      <h2 className="font-display text-lg font-semibold text-primary">Create product</h2>
      <form
        className="grid gap-3 md:grid-cols-2"
        onSubmit={(e) => {
          e.preventDefault();
          create.mutate(
            {
              providerId,
              name,
              category,
              description: description || `${name} marketplace listing.`,
              variants: [
                {
                  sku: sku || `SKU-${Date.now().toString(36).toUpperCase()}`,
                  name: variantName,
                  priceCents: dollarsToCents(priceDollars),
                  stock: Number(stock),
                },
              ],
            },
            {
              onSuccess: () => {
                setName("");
                setDescription("");
                setSku("");
              },
            },
          );
        }}
      >
        <select
          className="rounded-sm border border-input px-3 py-2 text-sm md:col-span-2"
          value={providerId}
          onChange={(e) => setProviderId(e.target.value)}
          required
        >
          <option value="">Select provider…</option>
          {providers.map((p) => (
            <option key={p.id} value={p.id}>
              {p.businessName} ({p.email})
            </option>
          ))}
        </select>
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
          step="0.01"
          min="0"
          className="rounded-sm border border-input px-3 py-2 text-sm"
          placeholder="Price ($)"
          value={priceDollars}
          onChange={(e) => setPriceDollars(e.target.value)}
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
          disabled={create.isPending || !providerId}
          className="rounded-sm bg-primary px-4 py-2 text-xs font-semibold uppercase tracking-wider text-primary-foreground md:col-span-2"
        >
          Create product
        </button>
        {create.isSuccess && <p className="text-sm text-accent md:col-span-2">Product created.</p>}
        {create.isError && (
          <p className="text-sm text-destructive md:col-span-2">{create.error.message}</p>
        )}
      </form>
    </section>
  );
}

function ProductRow({ product }: { product: AdminProduct }) {
  const update = useUpdateAdminProduct();
  const del = useDeleteAdminProduct();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(product.name);
  const [category, setCategory] = useState(product.category);
  const [description, setDescription] = useState(product.description);
  const [variants, setVariants] = useState(
    product.variants.map((v) => ({
      id: v.id,
      sku: v.sku,
      name: v.name,
      priceDollars: centsToDollars(v.priceCents),
      stock: String(v.stock),
    })),
  );

  return (
    <li className="border-b border-primary/10 py-4">
      <div className="grid gap-3 md:grid-cols-[1.5fr_1fr_auto]">
        <div>
          <div className="font-medium text-primary">{product.name}</div>
          <div className="text-xs text-muted-foreground">
            {product.provider.businessName} · {product.category} · {product.slug}
          </div>
          <div className="mt-1 text-xs">
            {product.active ? (
              <span className="text-accent">Active</span>
            ) : (
              <span className="text-muted-foreground">Inactive</span>
            )}
            {" · "}
            {product.variants.length} variant{product.variants.length === 1 ? "" : "s"}
          </div>
          <div className="mt-1 text-xs text-muted-foreground">
            {product.variants.length
              ? `From ${formatCents(Math.min(...product.variants.map((v) => v.priceCents)))}`
              : "No variants"}
          </div>
        </div>
        <div className="text-xs text-muted-foreground">
          {product.variants.map((v) => (
            <div key={v.id}>
              {v.name}: {v.stock} @ {formatCents(v.priceCents)}
            </div>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className="rounded-sm border border-primary/20 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider"
            onClick={() => setOpen(!open)}
          >
            {open ? "Close" : "Edit"}
          </button>
          <button
            type="button"
            disabled={update.isPending}
            className="rounded-sm bg-primary px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-primary-foreground"
            onClick={() => update.mutate({ id: product.id, active: !product.active })}
          >
            {product.active ? "Deactivate" : "Activate"}
          </button>
          <button
            type="button"
            disabled={del.isPending}
            className="rounded-sm border border-destructive/40 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-destructive"
            onClick={() => {
              if (confirm(`Delete ${product.name}? Products with order history are deactivated.`)) {
                del.mutate(product.id);
              }
            }}
          >
            Delete
          </button>
        </div>
      </div>

      {open && (
        <form
          className="mt-4 space-y-3 rounded-sm border border-primary/10 bg-card p-4"
          onSubmit={(e) => {
            e.preventDefault();
            update.mutate({
              id: product.id,
              name,
              category,
              ...(description.trim().length >= 10 ? { description: description.trim() } : {}),
              variants: variants.map((v) => ({
                id: v.id || undefined,
                sku: v.sku,
                name: v.name,
                priceCents: dollarsToCents(v.priceDollars),
                stock: Number(v.stock),
              })),
            });
          }}
        >
          <div className="grid gap-3 md:grid-cols-2">
            <input
              className="rounded-sm border border-input px-3 py-2 text-sm"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <input
              className="rounded-sm border border-input px-3 py-2 text-sm"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            />
            <textarea
              className="min-h-20 rounded-sm border border-input px-3 py-2 text-sm md:col-span-2"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Variants
              </span>
              <button
                type="button"
                className="text-xs font-semibold uppercase tracking-wider text-accent"
                onClick={() =>
                  setVariants((prev) => [
                    ...prev,
                    {
                      id: "",
                      sku: `SKU-${Date.now().toString(36).toUpperCase()}`,
                      name: "New variant",
                      priceDollars: "99.00",
                      stock: "0",
                    },
                  ])
                }
              >
                Add variant
              </button>
            </div>
            {variants.map((v, idx) => (
              <div key={v.id || `new-${idx}`} className="grid gap-2 md:grid-cols-4">
                <input
                  className="rounded-sm border border-input px-2 py-1.5 text-sm"
                  value={v.name}
                  onChange={(e) =>
                    setVariants((prev) =>
                      prev.map((row, i) => (i === idx ? { ...row, name: e.target.value } : row)),
                    )
                  }
                  placeholder="Name"
                />
                <input
                  className="rounded-sm border border-input px-2 py-1.5 text-sm"
                  value={v.sku}
                  onChange={(e) =>
                    setVariants((prev) =>
                      prev.map((row, i) => (i === idx ? { ...row, sku: e.target.value } : row)),
                    )
                  }
                  placeholder="SKU"
                />
                <input
                  type="number"
                  step="0.01"
                  className="rounded-sm border border-input px-2 py-1.5 text-sm"
                  value={v.priceDollars}
                  onChange={(e) =>
                    setVariants((prev) =>
                      prev.map((row, i) =>
                        i === idx ? { ...row, priceDollars: e.target.value } : row,
                      ),
                    )
                  }
                  placeholder="Price $"
                />
                <input
                  type="number"
                  className="rounded-sm border border-input px-2 py-1.5 text-sm"
                  value={v.stock}
                  onChange={(e) =>
                    setVariants((prev) =>
                      prev.map((row, i) => (i === idx ? { ...row, stock: e.target.value } : row)),
                    )
                  }
                  placeholder="Stock"
                />
              </div>
            ))}
          </div>
          <button
            type="submit"
            disabled={update.isPending}
            className="rounded-sm bg-primary px-4 py-2 text-xs font-semibold uppercase tracking-wider text-primary-foreground"
          >
            Save product
          </button>
          {update.isSuccess && <span className="ml-3 text-xs text-accent">Saved</span>}
          {update.isError && (
            <span className="ml-3 text-xs text-destructive">{update.error.message}</span>
          )}
          {del.isSuccess && del.data?.softDeleted && (
            <p className="text-xs text-accent">{del.data.message}</p>
          )}
        </form>
      )}
    </li>
  );
}

export function AdminProductsPanel() {
  const [q, setQ] = useState("");
  const { data: products = [], isLoading, error } = useAdminProducts({ q: q || undefined });

  return (
    <div className="space-y-8">
      <CreateProductForm />
      <div>
        <input
          className="mb-4 w-full max-w-md rounded-sm border border-input px-3 py-2 text-sm"
          placeholder="Search products…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        {isLoading && <p className="text-sm text-muted-foreground">Loading products…</p>}
        {error && <p className="text-sm text-destructive">{error.message}</p>}
        <ul>
          {products.map((p) => (
            <ProductRow key={p.id} product={p} />
          ))}
          {!isLoading && products.length === 0 && (
            <li className="py-4 text-sm text-muted-foreground">No products found.</li>
          )}
        </ul>
      </div>
    </div>
  );
}
