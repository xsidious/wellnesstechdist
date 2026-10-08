import Link from "next/link";
import { notFound } from "next/navigation";
import { ClinicalChartView } from "@/components/ClinicalChartView";
import { advanceOrder } from "@/lib/actions";
import { requireUser } from "@/lib/guard";
import { prisma } from "@/lib/prisma";

const STEPS = ["received", "verified", "compounding", "shipped", "delivered", "submitted", "on_hold"];

export default async function OrderDetail({ params }: { params: Promise<{ id: string }> }) {
  const user = await requireUser();
  const order = await prisma.order.findFirst({
    where: { id: (await params).id, orgId: user.orgId },
    include: {
      lines: true,
      events: { orderBy: { createdAt: "asc" } },
      clinicalPatient: true,
    },
  });
  if (!order) notFound();

  const timelineStatus = order.status === "submitted" ? "received" : order.status;

  return (
    <>
      <div className="dash-head">
        <div>
          <p className="kicker">Order</p>
          <p className="muted">
            <Link href="/portal/orders">← All orders</Link>
            {order.clinicalPatientId ? (
              <>
                {" · "}
                <Link href={`/portal/patients/${order.clinicalPatientId}`}>Open patient chart</Link>
              </>
            ) : null}
          </p>
        </div>
      </div>

      <div className="timeline">
        {["received", "verified", "compounding", "shipped", "delivered"].map((step) => (
          <span
            key={step}
            className={
              STEPS.indexOf(timelineStatus) >= STEPS.indexOf(step) || order.status === "delivered" ? "on" : ""
            }
          >
            {step}
          </span>
        ))}
      </div>
      {order.splitMessage ? <p className="note">{order.splitMessage}</p> : null}

      <ClinicalChartView
        chartRaw={order.clinicalChartJson || order.clinicalPatient?.clinicalChartJson}
        intakePayloadRaw={order.intakePayloadJson || order.clinicalPatient?.intakePayloadJson}
        signaturesRaw={order.signaturesJson || order.clinicalPatient?.signaturesJson}
        therapyRaw={order.therapyJson || order.clinicalPatient?.therapyJson}
        patientJson={order.patientJson}
        prescriberJson={order.prescriberJson}
        shipToJson={order.shipToJson}
        lines={order.lines}
        invoiceNumber={order.invoiceNumber}
        paymentStatus={order.paymentStatus}
        totalCents={order.totalCents}
        subtotalCents={order.subtotalCents}
        shippingFeeCents={order.shippingFeeCents}
        rxhereOrderId={order.rxhereOrderId}
        partnerExternalRef={order.partnerExternalRef}
        notes={order.notes}
      />

      <section className="panel">
        <h2>Status events</h2>
        <ul>
          {order.events.map((event) => (
            <li key={event.id}>
              {event.type} · {event.createdAt.toLocaleString()}
            </li>
          ))}
          {!order.events.length ? <li className="muted">No events yet.</li> : null}
        </ul>
        {order.status !== "delivered" ? (
          <form action={advanceOrder} className="stack" style={{ marginTop: 16 }}>
            <input type="hidden" name="orderId" value={order.id} />
            <button className="btn btn-accent">Advance sandbox fulfillment</button>
          </form>
        ) : (
          <p className="note">Delivered. Prescription lines do not post affiliate commission.</p>
        )}
      </section>
    </>
  );
}
