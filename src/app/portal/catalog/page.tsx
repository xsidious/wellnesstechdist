import Link from "next/link";
import { addToCart } from "@/lib/actions";
import { requireUser } from "@/lib/guard";
import { money } from "@/lib/money";
import { prisma } from "@/lib/prisma";
import { photoForClass } from "@/lib/photos";
import { canOrder, isProductClass } from "@/lib/rules";

export default async function CatalogPage({ searchParams }: { searchParams: Promise<{ office?: string }> }) {
  const user = await requireUser();
  const office = (await searchParams).office === "1";
  const products = await prisma.product.findMany({
    where: { active: true, ...(office ? { officeUse: true } : {}) },
    orderBy: { name: "asc" },
  });
  const showPrice = user.org.verificationTier >= 1;
  return (
    <>
      <h1>{office ? "Office stock" : "Catalog"}</h1>
      <p className="lede">
        {showPrice
          ? "Partner prices are 2× RxHere formulary wholesale (same for KIAN and all practitioners)."
          : "Tier 0 can browse. Prices unlock at Tier 1."}
      </p>
      <div className="grid-2">
        {products.map((product) => {
          const gate = isProductClass(product.productClass)
            ? canOrder(user.org.verificationTier, product.productClass, product.orderable)
            : { ok: false, reason: "Unknown class." };
          return (
            <article className="card" key={product.id}>
              <img className="card-photo" src={photoForClass(product.productClass, product.category)} alt="" />
              <span className="kicker">{product.category || product.form || product.productClass}</span>
              <b>{product.name}</b>
              <span>{product.description}</span>
              <span>{!showPrice ? "Price hidden" : product.priceCents ? money(product.priceCents) : "Price not set"} · {product.storage === "cold" ? "Cold chain" : "Ambient"}</span>
              {gate.ok ? (
                <form action={addToCart} className="stack">
                  <input type="hidden" name="productId" value={product.id} />
                  <label>Qty<input name="qty" type="number" min={1} defaultValue={1} /></label>
                  {product.rxRequired ? (
                    <>
                      <label>Patient initials<input name="initials" placeholder="A.B." /></label>
                      <label>Sig for the prescriber<input name="sig" placeholder="As directed by prescriber" /></label>
                    </>
                  ) : null}
                  <button className="btn btn-accent">Add to cart</button>
                </form>
              ) : <p className="error">{product.holdReason || gate.reason}</p>}
              <Link href={`/portal/catalog/${product.sku}`}>Details</Link>
            </article>
          );
        })}
      </div>
    </>
  );
}
