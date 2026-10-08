import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/guard";
import { money } from "@/lib/money";
import { photoForClass } from "@/lib/photos";

export default async function ProductDetail({ params }: { params: Promise<{ sku: string }> }) {
  await requireUser();
  const product = await prisma.product.findUnique({ where: { sku: (await params).sku } });
  if (!product) notFound();
  return (
    <>
      <img className="dash-photo" src={photoForClass(product.productClass, product.category)} alt="" />
      <p className="kicker">{product.category || product.productClass}</p>
      <h1>{product.name}</h1>
      {product.form ? <p>{product.form}</p> : null}
      <p>{product.description}</p>
      <p>SKU {product.sku} · RxCore {product.rxcoreFormularyId} · BUD {product.budDays || "n/a"} days</p>
      <p>{product.priceCents ? money(product.priceCents) : "No public price"}</p>
      {product.holdReason ? <p className="note">{product.holdReason}</p> : null}
    </>
  );
}
