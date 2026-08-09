import { NextResponse } from "next/server";
import { getCart } from "@/app/(site)/cart/actions";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const cart = await getCart();
    const items = (cart?.items ?? []).map((item) => ({
      id: item.id,
      quantity: item.quantity,
      priceCents: item.variant.priceCents,
      lineCents: item.quantity * item.variant.priceCents,
      variantName: item.variant.name,
      productName: item.variant.product.name,
      productSlug: item.variant.product.slug,
    }));
    const count = items.reduce((s, i) => s + i.quantity, 0);
    const subtotalCents = items.reduce((s, i) => s + i.lineCents, 0);
    return NextResponse.json({ items, count, subtotalCents });
  } catch (e) {
    console.error("cart GET failed", e);
    return NextResponse.json({ items: [], count: 0, subtotalCents: 0 });
  }
}
