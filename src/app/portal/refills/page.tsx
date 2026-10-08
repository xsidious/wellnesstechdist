import { approveRefill } from "@/lib/actions";
import { requireUser } from "@/lib/guard";
import { prisma } from "@/lib/prisma";

export default async function RefillsPage() {
  const user = await requireUser();
  const refills = await prisma.refill.findMany({ where: { orgId: user.orgId }, orderBy: { dueAt: "asc" } });
  const due = refills.filter((refill) => refill.status === "due");
  return (
    <>
      <h1>Refills</h1>
      <p>Drafted before run-out. Approval uses the saved payment token when autopay is on.</p>
      <form action={approveRefill} className="stack">
        <table className="table">
          <thead><tr><th></th><th>Patient</th><th>Product</th><th>Due</th><th>Status</th></tr></thead>
          <tbody>
            {refills.map((refill) => (
              <tr key={refill.id}>
                <td>{refill.status === "due" ? <input type="checkbox" name="refillId" value={refill.id} defaultChecked /> : null}</td>
                <td>{refill.patientInitials}</td>
                <td>{refill.productName}</td>
                <td>{refill.dueAt.toLocaleDateString()}</td>
                <td>{refill.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {due.length ? <button className="btn btn-accent">Approve selected</button> : null}
      </form>
    </>
  );
}
