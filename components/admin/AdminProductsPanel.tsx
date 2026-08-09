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

function CreateProductForm() {
  const { data: providers = [] } = useAdminProviders();
  const create = useCreateAdminProduct();
  const [providerId, setProviderId] = useState("");
  const [name, setName] = useState("");
  const [category, setCategory] = useState("general");
  const [description, setDescription] = useState("");
  const [variantName, setVariantName] = useState("Standard");
  const [sku, setSku] = useState("");
  const [priceCents, setPriceCents] = useState("9900");
  const [stock, setStock] = useState("25");

  return (
    <section className="space-y-3 rounded-sm border border-primary/10 bg-card p-5">
      <h2 className="font-display text-lg font-semibold text-primary">Create product</h2>
      <form
        className="grid gap-3 md:grid-cols-2"
        onSubmit={(e) => {
          e.preventDefault();
          create.mutate({
            providerId,
            name,
            category,
            description: description || `${name} marketplace listing.`,
            variants: [
              {
                sku: sku || `SKU-${Date.now().toString(36).toUpperCase()}`,
                name: variantName,
                priceCents: Number(priceCents),
                stock: Number(stock),
              },
            ],
          });
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
  const variant = product.variants[0];
  const [stock, setStock] = useState(String(variant?.stock ?? 0));
  const [priceCents, setPriceCents] = useState(String(variant?.priceCents ?? 0));

  return (
    <li className="grid gap-3 border-b border-primary/10 py-4 md:grid-cols-[1.5fr_1fr_auto]">
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
        </div>
      </div>
      {variant && (
        <div className="flex flex-wrap gap-2">
          <input
            type="number"
            className="w-24 rounded-sm border border-input px-2 py-1.5 text-sm"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            title="Stock"
          />
          <input
            type="number"
            className="w-28 rounded-sm border border-input px-2 py-1.5 text-sm"
            value={priceCents}
            onChange={(e) => setPriceCents(e.target.value)}
            title="Price cents"
          />
          <span className="self-center text-xs text-muted-foreground">
            {formatCents(Number(priceCents) || 0)}
          </span>
        </div>
      )}
      <div className="flex flex-wrap gap-2">
        {variant && (
          <button
            type="button"
            disabled={update.isPending}
            className="rounded-sm border border-primary/20 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider"
            onClick={() =>
              update.mutate({
                id: product.id,
                variants: [
                  {
                    id: variant.id,
                    sku: variant.sku,
                    name: variant.name,
                    priceCents: Number(priceCents),
                    stock: Number(stock),
                  },
                ],
              })
            }
          >
            Save stock
          </button>
        )}
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
            if (confirm(`Delete ${product.name}?`)) del.mutate(product.id);
          }}
        >
          Delete
        </button>
      </div>
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
