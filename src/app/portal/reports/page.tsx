import { requireUser } from "@/lib/guard";
import { money } from "@/lib/money";
import { prisma } from "@/lib/prisma";

export default async function ReportsPage() {
  const user = await requireUser();
  const orders = await prisma.order.findMany({ where: { orgId: user.orgId }, include: { lines: true } });
  const spend = orders.reduce((sum, order) => sum + order.totalCents, 0);
  return (
    <>
      <h1>Reports</h1>
      <div className="grid-3">
        <div className="card"><span>Orders</span><b>{orders.length}</b></div>
        <div className="card"><span>Spend</span><b>{money(spend)}</b></div>
        <div className="card"><span>Lines</span><b>{orders.reduce((sum, order) => sum + order.lines.length, 0)}</b></div>
      </div>
      <p className="muted">Export is the table on Orders. Internal margin stays out of the practice view.</p>
    </>
  );
}
