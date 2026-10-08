import Link from "next/link";
import { redirect } from "next/navigation";
import { audit } from "@/lib/audit";
import { requireUser, rolesOf } from "@/lib/guard";
import { prisma } from "@/lib/prisma";
import { parseJsonSafe } from "@/lib/clinical-chart";

export default async function PatientsPage() {
  const user = await requireUser();
  const roles = rolesOf(user.roles);
  if (roles.includes("billing") && !roles.some((role) => ["owner", "prescriber", "staff", "admin"].includes(role))) {
    redirect("/portal?notice=billing");
  }

  const [clinicalPatients, legacy] = await Promise.all([
    prisma.clinicalPatient.findMany({
      where: { orgId: user.orgId },
      orderBy: { updatedAt: "desc" },
      take: 200,
      include: { _count: { select: { orders: true } } },
    }),
    prisma.patientRef.findMany({ where: { orgId: user.orgId }, take: 50 }),
  ]);

  await audit({
    actorId: user.id,
    action: "phi.read",
    object: `patients:${user.orgId}`,
    after: `${clinicalPatients.length} charts`,
  });

  return (
    <>
      <div className="dash-head">
        <div>
          <p className="kicker">Clinical</p>
          <h1>Patients</h1>
          <p className="lede">
            Charts mirrored from KIAN — demographics, intake answers, prescriptions, and signatures.
          </p>
        </div>
      </div>

      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr>
              <th>Patient</th>
              <th>DOB</th>
              <th>Programs</th>
              <th>Status</th>
              <th>Orders</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {clinicalPatients.map((patient) => {
              const programs = parseJsonSafe<string[]>(patient.programsJson, []);
              return (
                <tr key={patient.id}>
                  <td>
                    <b>{patient.fullName}</b>
                    <div className="muted">{patient.email}</div>
                    {patient.phone ? <div className="muted">{patient.phone}</div> : null}
                  </td>
                  <td>{patient.dateOfBirth || "—"}</td>
                  <td>{programs.slice(0, 3).join(" · ") || "—"}</td>
                  <td>{patient.intakeStatus || "—"}</td>
                  <td>{patient._count.orders}</td>
                  <td>
                    <Link href={`/portal/patients/${patient.id}`}>Open chart</Link>
                  </td>
                </tr>
              );
            })}
            {!clinicalPatients.length ? (
              <tr>
                <td colSpan={6} className="muted">
                  No clinical charts yet. Charts appear when KIAN forwards a paid therapy order.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      {legacy.length ? (
        <section className="panel" style={{ marginTop: 24 }}>
          <h2>Legacy RxCore initials</h2>
          <table className="table">
            <thead>
              <tr>
                <th>Initials</th>
                <th>RxCore id</th>
              </tr>
            </thead>
            <tbody>
              {legacy.map((patient) => (
                <tr key={patient.id}>
                  <td>{patient.initials}</td>
                  <td>{patient.rxcorePatientId}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      ) : null}
    </>
  );
}
