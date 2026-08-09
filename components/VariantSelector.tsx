"use client";

import { useMemo, useState, useTransition } from "react";
import { formatCents } from "@/lib/utils";
import { addToCart } from "@/app/(site)/cart/actions";
import { emitCartUpdated, emitOpenCart } from "@/components/cart/CartProvider";

type Variant = {
  id: string;
  name: string;
  sku: string;
  priceCents: number;
  stock: number;
  attrs: Record<string, string>;
};

export function VariantSelector({
  variants,
  productName,
}: {
  variants: Variant[];
  productName: string;
}) {
  const sizes = useMemo(
    () => [...new Set(variants.map((v) => v.attrs.size || v.attrs.Size || v.name).filter(Boolean))],
    [variants],
  );
  const colors = useMemo(
    () => [...new Set(variants.map((v) => v.attrs.color || v.attrs.Color).filter(Boolean))],
    [variants],
  );

  const [size, setSize] = useState(sizes[0] || "");
  const [color, setColor] = useState(colors[0] || "");
  const [qty, setQty] = useState(1);
  const [message, setMessage] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const selected = useMemo(() => {
    return (
      variants.find((v) => {
        const vSize = v.attrs.size || v.attrs.Size || v.name;
        const vColor = v.attrs.color || v.attrs.Color || "";
        const sizeOk = !sizes.length || vSize === size;
        const colorOk = !colors.length || vColor === color;
        return sizeOk && colorOk;
      }) || variants[0]
    );
  }, [variants, size, color, sizes.length, colors.length]);

  function onAdd() {
    if (!selected) return;
    setMessage(null);
    startTransition(async () => {
      const res = await addToCart(selected.id, qty);
      if (res.error) {
        setMessage(res.error);
        return;
      }
      setMessage(`Added ${productName} to cart`);
      emitCartUpdated();
      emitOpenCart();
    });
  }

  if (!variants.length) {
    return <p className="text-sm text-muted-foreground">No variants available.</p>;
  }

  return (
    <div className="space-y-5">
      {sizes.length > 0 && (
        <div>
          <label className="text-xs font-semibold uppercase tracking-widest text-primary/70">Size</label>
          <div className="mt-2 flex flex-wrap gap-2">
            {sizes.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSize(s)}
                className={`rounded-sm border px-3 py-2 text-sm ${
                  size === s ? "border-accent bg-accent/10 text-primary" : "border-primary/15"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}
      {colors.length > 0 && (
        <div>
          <label className="text-xs font-semibold uppercase tracking-widest text-primary/70">Color</label>
          <div className="mt-2 flex flex-wrap gap-2">
            {colors.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setColor(c)}
                className={`rounded-sm border px-3 py-2 text-sm ${
                  color === c ? "border-accent bg-accent/10 text-primary" : "border-primary/15"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      )}
      <div className="flex items-end gap-4">
        <div>
          <label className="text-xs font-semibold uppercase tracking-widest text-primary/70">Qty</label>
          <input
            type="number"
            min={1}
            max={selected?.stock || 1}
            value={qty}
            onChange={(e) => setQty(Math.max(1, Number(e.target.value) || 1))}
            className="mt-2 w-20 rounded-sm border border-input px-3 py-2 text-sm"
          />
        </div>
        <div className="pb-2 text-lg font-semibold text-primary">
          {selected ? formatCents(selected.priceCents) : "—"}
        </div>
      </div>
      <p className="text-xs text-muted-foreground">
        {selected?.stock ? `${selected.stock} in stock · ${selected.sku}` : "Out of stock"}
      </p>
      <button
        type="button"
        disabled={!selected?.stock || pending}
        onClick={onAdd}
        className="rounded-sm bg-primary px-6 py-3 text-sm font-semibold uppercase tracking-wider text-primary-foreground disabled:opacity-50"
      >
        {pending ? "Adding…" : "Add to cart"}
      </button>
      {message && <p className="text-sm text-muted-foreground">{message}</p>}
    </div>
  );
}
