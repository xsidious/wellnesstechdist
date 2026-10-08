import Link from "next/link";
import { requireUser } from "@/lib/guard";
import { money } from "@/lib/money";
import { prisma } from "@/lib/prisma";

export default async function AffiliatePortal() {
  const user = await requireUser();
  if (!user.affiliate) return <p>This account is not an affiliate. <Link href="/signup?type=affiliate">Open an affiliate signup</Link>.</p>;
  const accounts = await prisma.organization.findMany({ where: { referringAffiliateId: user.id } });
  const commissions = await prisma.commission.findMany({ where: { affiliateUserId: user.id }, include: { order: true } });
  const total = commissions.reduce((sum, row) => sum + row.amountCents, 0);
  return (
    <>
      <h1>Affiliate portal</h1>
      <p>Code <strong>{user.affiliate.code}</strong>. Share <span className="note">/?ref={user.affiliate.code}</span></p>
      <p>W-9 {user.affiliate.w9Status}. Payout token stored. ACH batches stay pending until finance and compliance sign off.</p>
      <h2>Referred accounts</h2>
      <ul>{accounts.map((account) => <li key={account.id}>{account.legalName} · {account.status}</li>)}</ul>
      <h2>Commissions · {money(total)}</h2>
      <table className="table">
        <thead><tr><th>Invoice</th><th>Eligible</th><th>Amount</th><th>Status</th></tr></thead>
        <tbody>
          {commissions.map((row) => (
            <tr key={row.id}><td>{row.order.invoiceNumber}</td><td>{money(row.eligibleCents)}</td><td>{money(row.amountCents)}</td><td>{row.status}</td></tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
