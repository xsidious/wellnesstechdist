import { CheckoutForm } from "@/components/CheckoutForm";
import { requireUser } from "@/lib/guard";
import { prisma } from "@/lib/prisma";
import { fulfillmentGroups, isProductClass, shippingCents } from "@/lib/rules";
import { money } from "@/lib/money";

export default async function CheckoutPage() {
  const user = await requireUser();
  const items = await prisma.cartItem.findMany({ where: { userId: user.id } });
  const products = await prisma.product.findMany({ where: { id: { in: items.map((item) => item.productId) } } });
  const classes = products.flatMap((product) => (isProductClass(product.productClass) ? [product.productClass] : []));
  const split = fulfillmentGroups(classes);
  const subtotal = items.reduce((sum, item) => {
    const product = products.find((entry) => entry.id === item.productId);
    return sum + (product?.priceCents || 0) * item.qty;
  }, 0);
  const shipping = shippingCents(products.map((product) => product.storage));
  return (
    <>
      <h1>Checkout</h1>
      <p>Sandbox shipping is {money(shipping)}. One invoice total {money(subtotal + shipping)}.</p>
      {split.message ? <p className="note">{split.message}</p> : null}
      <CheckoutForm />
    </>
  );
}
