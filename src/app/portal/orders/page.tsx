import Link from "next/link";
import { requireUser } from "@/lib/guard";
import { money } from "@/lib/money";
import { prisma } from "@/lib/prisma";

export default async function OrdersPage() {
  const user = await requireUser();
  const orders = await prisma.order.findMany({ where: { orgId: user.orgId }, orderBy: { createdAt: "desc" } });
  return (
    <>
      <h1>Orders</h1>
      <table className="table">
        <thead><tr><th>Invoice</th><th>Status</th><th>RxCore</th><th>Total</th></tr></thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td><Link href={`/portal/orders/${order.id}`}>{order.invoiceNumber}</Link></td>
              <td>{order.status}</td>
              <td>{order.rxcoreOrderId}</td>
              <td>{money(order.totalCents)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
