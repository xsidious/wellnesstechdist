import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ClinicalChartView } from "@/components/ClinicalChartView";
import { audit } from "@/lib/audit";
import { requireUser, rolesOf } from "@/lib/guard";
import { prisma } from "@/lib/prisma";

export default async function PatientChartPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await requireUser();
  const roles = rolesOf(user.roles);
  if (roles.includes("billing") && !roles.some((role) => ["owner", "prescriber", "staff", "admin"].includes(role))) {
    redirect("/portal?notice=billing");
  }

  const { id } = await params;
  const patient = await prisma.clinicalPatient.findFirst({
    where: { id, orgId: user.orgId },
    include: {
      orders: {
        orderBy: { createdAt: "desc" },
        include: { lines: true },
        take: 20,
      },
    },
  });
  if (!patient) notFound();

  await audit({
    actorId: user.id,
    action: "phi.read",
    object: `clinicalPatient:${patient.id}`,
    after: patient.email,
  });

  const latest = patient.orders[0] || null;

  return (
    <>
      <div className="dash-head">
        <div>
          <p className="kicker">Patient chart</p>
          <p className="muted">
            <Link href="/portal/patients">← Patients</Link>
            {latest ? (
              <>
                {" · "}
                <Link href={`/portal/orders/${latest.id}`}>Latest order {latest.invoiceNumber}</Link>
              </>
            ) : null}
          </p>
          <h1>{patient.fullName}</h1>
        </div>
      </div>

      {latest ? (
        <ClinicalChartView
          chartRaw={patient.clinicalChartJson || latest.clinicalChartJson}
          intakePayloadRaw={patient.intakePayloadJson || latest.intakePayloadJson}
          signaturesRaw={patient.signaturesJson || latest.signaturesJson}
          therapyRaw={patient.therapyJson || latest.therapyJson}
          patientJson={latest.patientJson}
          prescriberJson={latest.prescriberJson}
          shipToJson={latest.shipToJson}
          lines={latest.lines}
          invoiceNumber={latest.invoiceNumber}
          paymentStatus={latest.paymentStatus}
          totalCents={latest.totalCents}
          subtotalCents={latest.subtotalCents}
          shippingFeeCents={latest.shippingFeeCents}
          rxhereOrderId={latest.rxhereOrderId}
          partnerExternalRef={latest.partnerExternalRef}
          notes={latest.notes}
        />
      ) : (
        <section className="panel">
          <p className="muted">Chart saved, but no linked orders yet.</p>
        </section>
      )}

      {patient.orders.length > 1 ? (
        <section className="panel">
          <h2>Order history</h2>
          <ul>
            {patient.orders.map((order) => (
              <li key={order.id}>
                <Link href={`/portal/orders/${order.id}`}>{order.invoiceNumber}</Link>
                {" · "}
                {order.status} · {order.createdAt.toLocaleDateString()}
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </>
  );
}
