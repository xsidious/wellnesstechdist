import Link from "next/link";
import { requireUser, rolesOf } from "@/lib/guard";
import { prisma } from "@/lib/prisma";
import { money } from "@/lib/money";
import { photos } from "@/lib/photos";
import { tierLabel } from "@/lib/rules";

export default async function PortalHome() {
  const user = await requireUser();
  const roles = rolesOf(user.roles);
  if (roles.includes("affiliate") && !roles.includes("owner") && !roles.includes("prescriber")) {
    return (
      <div className="stack">
        <div className="dash-head">
          <div>
            <span className="kicker">Affiliate</span>
            <h1>Welcome back, {user.name}</h1>
            <p className="lede">Code {user.affiliate?.code}. Commission posts when a referred practice’s device or supply order is delivered.</p>
          </div>
          <Link className="btn btn-accent" href="/portal/affiliate">View statements</Link>
        </div>
        <img className="dash-photo" src={photos.equipment} alt="Clinical equipment ready for a practice" />
      </div>
    );
  }
  const [openOrders, refills, cart] = await Promise.all([
    prisma.order.count({ where: { orgId: user.orgId, status: { not: "delivered" } } }),
    prisma.refill.count({ where: { orgId: user.orgId, status: "due" } }),
    prisma.cartItem.count({ where: { userId: user.id } }),
  ]);
  const recent = await prisma.order.findMany({ where: { orgId: user.orgId }, orderBy: { createdAt: "desc" }, take: 5 });
  return (
    <div className="stack">
      <div className="dash-head">
        <div>
          <span className="kicker">{tierLabel(user.org.verificationTier)}</span>
          <h1>{user.org.legalName}</h1>
          <p className="lede">One cart for every product class. Prescription lines are signed by a prescriber and fulfilled by RxHere.</p>
        </div>
        <div className="quick">
          <Link className="btn btn-accent" href="/portal/catalog">Browse catalog</Link>
          <Link className="btn btn-ghost" href="/portal/cart">Cart ({cart})</Link>
        </div>
      </div>
      <img className="dash-photo" src={photos.hero} alt="Treatment room at the practice" />
      <div className="stat-grid">
        <div className="stat"><span>Open orders</span><b>{openOrders}</b></div>
        <div className="stat"><span>Refills due</span><b>{refills}</b></div>
        <div className="stat"><span>Cart lines</span><b>{cart}</b></div>
      </div>
      <div className="rep">
        <img src={photos.consult} alt="" />
        <div>
          <b>{user.org.assignedRep}</b>
          <div className="muted">Your Wellness Tech representative. Pharmacy decisions stay with RxHere.</div>
          <Link href="/portal/messages">Message {user.org.assignedRep.split(" ")[0]}</Link>
        </div>
      </div>
      <section className="stack">
        <div className="dash-head">
          <h2 style={{ margin: 0 }}>Recent invoices</h2>
          <Link href="/portal/orders">All orders</Link>
        </div>
        <div className="table-wrap">
          <table className="table">
            <thead><tr><th>Invoice</th><th>Status</th><th>Total</th></tr></thead>
            <tbody>
              {recent.map((order) => (
                <tr key={order.id}><td><Link href={`/portal/orders/${order.id}`}>{order.invoiceNumber}</Link></td><td>{order.status}</td><td>{money(order.totalCents)}</td></tr>
              ))}
              {!recent.length ? <tr><td colSpan={3}>No orders yet. A new account starts with an empty order list.</td></tr> : null}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
