import { removeCartItem } from "@/lib/actions";
import { requireUser } from "@/lib/guard";
import { money } from "@/lib/money";
import { prisma } from "@/lib/prisma";
import { fulfillmentGroups, isProductClass, shippingCents } from "@/lib/rules";

export default async function CartPage() {
  const user = await requireUser();
  const items = await prisma.cartItem.findMany({ where: { userId: user.id } });
  const products = await prisma.product.findMany({ where: { id: { in: items.map((item) => item.productId) } } });
  const byId = new Map(products.map((product) => [product.id, product]));
  const classes = products.filter((product) => isProductClass(product.productClass)).map((product) => product.productClass);
  const split = fulfillmentGroups(classes);
  const subtotal = items.reduce((sum, item) => sum + (byId.get(item.productId)?.priceCents || 0) * item.qty, 0);
  const shipping = items.length ? shippingCents(products.map((product) => product.storage)) : 0;
  return (
    <>
      <h1>Cart</h1>
      {split.message ? <p className="note">{split.message}</p> : null}
      <table className="table">
        <thead><tr><th>Item</th><th>Patient</th><th>Qty</th><th>Amount</th><th></th></tr></thead>
        <tbody>
          {items.map((item) => {
            const product = byId.get(item.productId);
            return (
              <tr key={item.id}>
                <td>{product?.name}</td>
                <td>{item.patientInitials || "Office"}</td>
                <td>{item.qty}</td>
                <td>{money((product?.priceCents || 0) * item.qty)}</td>
                <td><form action={removeCartItem}><input type="hidden" name="id" value={item.id} /><button>Remove</button></form></td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <p>Subtotal {money(subtotal)} · Shipping {money(shipping)} · One total {money(subtotal + shipping)}</p>
      {items.length ? <a className="btn btn-accent" href="/portal/checkout">Checkout</a> : <p>The cart is empty.</p>}
    </>
  );
}
