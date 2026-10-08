import Link from "next/link";
import { Logo } from "@/components/Logo";
import { logout } from "@/lib/actions";
import { rolesOf } from "@/lib/guard";
import { tierLabel } from "@/lib/rules";

export function PortalFrame({
  user,
  children,
}: {
  user: { name: string; email: string; roles: string; org: { legalName: string; verificationTier: number; assignedRep: string } };
  children: React.ReactNode;
}) {
  const roles = rolesOf(user.roles);
  const admin = roles.includes("admin") && !roles.some((role) => ["owner", "prescriber", "staff"].includes(role));
  const billingOnly = roles.includes("billing") && !roles.some((role) => ["owner", "prescriber", "staff", "admin"].includes(role));
  const affiliateOnly = roles.includes("affiliate") && !roles.some((role) => ["owner", "prescriber", "staff"].includes(role));
  const links = admin
    ? [
        ["/admin", "Dashboard"],
        ["/admin/orders", "Orders"],
        ["/admin/patients", "Patients"],
        ["/admin/practices", "Practices"],
        ["/admin/prescribers", "Prescribers"],
        ["/admin/affiliates", "Affiliates"],
        ["/admin/products", "Catalog"],
        ["/admin/refills", "Refills"],
        ["/admin/messages", "Messages"],
        ["/admin/audit", "Audit log"],
        ["/admin/migration", "Migration"],
        ["/developers", "Developers"],
      ]
    : affiliateOnly
      ? [
          ["/portal", "Dashboard"],
          ["/portal/affiliate", "Commissions"],
          ["/portal/education", "Materials"],
        ]
      : [
          ["/portal", "Dashboard"],
          ["/portal/catalog", "Catalog"],
          ["/portal/cart", "Cart"],
          ["/portal/orders", "Orders"],
          ["/portal/invoices", "Invoices"],
          ["/portal/refills", "Refills"],
          ["/portal/office-stock", "Office stock"],
          ["/portal/reports", "Reports"],
          ["/portal/messages", "Messages"],
          ["/portal/education", "Education"],
          ["/portal/settings", "Settings"],
          ...(billingOnly ? [] : [["/portal/patients", "Patients"]]),
        ];
  return (
    <div className="portal">
      <aside className="side">
        <div className="side-top">
          <Link href={admin ? "/admin" : "/portal"} aria-label="Dashboard"><Logo tone="white" /></Link>
          <p className="side-meta">
            {user.org.legalName}
            <span>{admin ? "Administrator" : tierLabel(user.org.verificationTier)}</span>
            {!admin ? <span>Rep {user.org.assignedRep}</span> : null}
          </p>
          <form className="side-out-mobile" action={logout}><button className="btn btn-ghost">Sign out</button></form>
        </div>
        <nav className="side-links" aria-label="Account">
          {links.map(([href, label]) => (
            <Link key={href} href={href}>{label}</Link>
          ))}
        </nav>
        <form className="side-out" action={logout}><button className="btn btn-ghost">Sign out</button></form>
      </aside>
      <div className="main stack">{children}</div>
    </div>
  );
}
