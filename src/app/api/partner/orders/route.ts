import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { audit } from "@/lib/audit";
import { isProductClass, routeSource, shippingCents } from "@/lib/rules";
import { ensureKianPartnerOrg, partnerSecretOk } from "@/lib/partner-org";
import { openRxcoreOrder } from "@/lib/rxcore";
import { packPatient, type RxHereAddress, type RxHerePatient, type RxHerePrescriber } from "@/lib/rxhere";
import type { ClinicalChartPackage } from "@/lib/clinical-chart";

type PartnerLine = {
  sku?: string;
  qty?: number;
  sig?: string;
  name?: string;
  strength?: string;
  size?: string;
  dosageForm?: string;
};

type PartnerBody = {
  externalRef?: string;
  email?: string;
  partnerSite?: string;
  notes?: string;
  shippingMethod?: "2_DAY" | "OVERNIGHT";
  kianIntakeId?: string | null;
  clinicalChart?: ClinicalChartPackage | null;
  lines?: PartnerLine[];
  shipTo?: {
    name?: string;
    street1?: string;
    street2?: string;
    city?: string;
    state?: string;
    zip?: string;
  };
  patient?: {
    firstName?: string;
    lastName?: string;
    dateOfBirth?: string;
    gender?: string;
    phone?: string;
    email?: string;
    allergies?: string;
    address?: RxHereAddress;
  };
  prescriber?: RxHerePrescriber;
};

function splitName(full?: string) {
  const parts = String(full || "").trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return { firstName: "Patient", lastName: "Unknown" };
  if (parts.length === 1) return { firstName: parts[0], lastName: parts[0] };
  return { firstName: parts[0], lastName: parts.slice(1).join(" ") };
}

export async function POST(request: Request) {
  if (!partnerSecretOk(request.headers.get("x-wt-partner-secret"))) {
    return NextResponse.json({ ok: false, error: "Unauthorized." }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as PartnerBody | null;
  if (!body) return NextResponse.json({ ok: false, error: "Invalid JSON." }, { status: 400 });

  const externalRef = String(body.externalRef || "").trim();
  const email = String(body.email || "").trim().toLowerCase();
  const lines = (body.lines || [])
    .map((line) => ({
      sku: String(line.sku || "").trim(),
      qty: Math.max(1, Number(line.qty) || 1),
      sig: String(line.sig || "").trim(),
      name: String(line.name || "").trim(),
      strength: String(line.strength || "").trim(),
      size: String(line.size || "").trim(),
      dosageForm: String(line.dosageForm || "").trim(),
    }))
    .filter((line) => line.sku);

  if (!externalRef) return NextResponse.json({ ok: false, error: "externalRef is required." }, { status: 400 });
  if (!email.includes("@")) return NextResponse.json({ ok: false, error: "A valid email is required." }, { status: 400 });
  if (!lines.length) return NextResponse.json({ ok: false, error: "At least one line with a SKU is required." }, { status: 400 });

  const existing = await prisma.order.findFirst({ where: { partnerExternalRef: externalRef } });
  if (existing) {
    return NextResponse.json({ ok: true, orderId: existing.id, duplicate: true, invoiceNumber: existing.invoiceNumber });
  }

  const products = await prisma.product.findMany({
    where: { sku: { in: lines.map((line) => line.sku) }, active: true },
  });
  const bySku = new Map(products.map((product) => [product.sku, product]));
  const missing = lines.filter((line) => !bySku.has(line.sku)).map((line) => line.sku);
  if (missing.length) {
    return NextResponse.json(
      { ok: false, error: `Unknown SKUs on Wellness Tech: ${missing.join(", ")}. Sync the RxHere formulary first.` },
      { status: 400 },
    );
  }

  const ship = body.shipTo || {};
  const named = splitName(
    ship.name ||
      (body.patient?.firstName && body.patient?.lastName
        ? `${body.patient.firstName} ${body.patient.lastName}`
        : undefined),
  );
  const address: RxHereAddress = body.patient?.address || {
    line1: String(ship.street1 || "").trim() || "Address on file",
    line2: ship.street2 ? String(ship.street2).trim() : undefined,
    city: String(ship.city || "").trim() || "Unknown",
    state: String(ship.state || "").trim() || "FL",
    zipCode: String(ship.zip || "").trim() || "00000",
    country: "US",
  };

  const patient: RxHerePatient = {
    firstName: String(body.patient?.firstName || named.firstName).trim(),
    lastName: String(body.patient?.lastName || named.lastName).trim(),
    dateOfBirth: String(body.patient?.dateOfBirth || "1990-01-01").trim(),
    gender: body.patient?.gender,
    phone: body.patient?.phone || undefined,
    email: body.patient?.email || email,
    allergies: body.patient?.allergies || "NKDA",
    address,
  };

  const { org, user } = await ensureKianPartnerOrg();
  const packed = packPatient(patient);
  let subtotal = 0;
  const storages: string[] = [];
  const lineCreates = lines.map((line) => {
    const product = bySku.get(line.sku)!;
    subtotal += product.priceCents * line.qty;
    storages.push(product.storage);
    return {
      sku: product.sku,
      name: line.name || product.name,
      productClass: product.productClass,
      qty: line.qty,
      unitPriceCents: product.priceCents,
      patientInitials: `${patient.firstName[0] || ""}${patient.lastName[0] || ""}`.toUpperCase(),
      sig: line.sig || "As directed by prescribing clinician.",
      strength: line.strength || product.strength || "",
      size: line.size || product.size || "",
      dosageForm: line.dosageForm || product.form || "",
      routedSource: isProductClass(product.productClass) ? routeSource(product.productClass) : "Held",
    };
  });

  const shipping = shippingCents(storages);
  const count = await prisma.order.count();
  const chart = body.clinicalChart || null;
  const kianIntakeId = String(body.kianIntakeId || chart?.intake?.id || "").trim();
  const fullName =
    chart?.patient?.fullName ||
    `${patient.firstName} ${patient.lastName}`.trim() ||
    email;
  const programs = chart?.intake?.programs || [];
  const signatures = chart?.signatures || [];
  const intakePayload = chart?.intake?.payload || {};
  const therapy = chart?.therapy || {};

  const clinicalPatient = await prisma.clinicalPatient.upsert({
    where: {
      orgId_email_kianIntakeId: {
        orgId: org.id,
        email,
        kianIntakeId: kianIntakeId || `order:${externalRef}`,
      },
    },
    create: {
      orgId: org.id,
      email,
      fullName,
      phone: String(chart?.patient?.phone || patient.phone || "").trim(),
      dateOfBirth: String(chart?.patient?.dateOfBirth || patient.dateOfBirth || "").trim(),
      gender: String(chart?.patient?.gender || patient.gender || "").trim(),
      allergies: String(chart?.patient?.allergies || patient.allergies || "NKDA").trim(),
      medications: String(chart?.patient?.medications || "").trim(),
      addressJson: JSON.stringify(chart?.patient?.address || patient.address || {}),
      kianIntakeId: kianIntakeId || `order:${externalRef}`,
      kianReference: String(chart?.intake?.reference || "").trim(),
      sourceSite: String(body.partnerSite || "kian-prive"),
      intakeStatus: String(chart?.intake?.status || "").trim(),
      statusNote: String(chart?.intake?.statusNote || "").trim(),
      programsJson: JSON.stringify(programs),
      intakePayloadJson: JSON.stringify(intakePayload),
      signaturesJson: JSON.stringify(signatures),
      therapyJson: JSON.stringify(therapy),
      clinicalChartJson: JSON.stringify(chart || {}),
    },
    update: {
      fullName,
      phone: String(chart?.patient?.phone || patient.phone || "").trim(),
      dateOfBirth: String(chart?.patient?.dateOfBirth || patient.dateOfBirth || "").trim(),
      gender: String(chart?.patient?.gender || patient.gender || "").trim(),
      allergies: String(chart?.patient?.allergies || patient.allergies || "NKDA").trim(),
      medications: String(chart?.patient?.medications || "").trim(),
      addressJson: JSON.stringify(chart?.patient?.address || patient.address || {}),
      kianReference: String(chart?.intake?.reference || "").trim(),
      sourceSite: String(body.partnerSite || "kian-prive"),
      intakeStatus: String(chart?.intake?.status || "").trim(),
      statusNote: String(chart?.intake?.statusNote || "").trim(),
      programsJson: JSON.stringify(programs),
      intakePayloadJson: JSON.stringify(intakePayload),
      signaturesJson: JSON.stringify(signatures),
      therapyJson: JSON.stringify(therapy),
      clinicalChartJson: JSON.stringify(chart || {}),
    },
  });

  const order = await prisma.order.create({
    data: {
      orgId: org.id,
      placedById: user.id,
      clinicalPatientId: clinicalPatient.id,
      invoiceNumber: `WT-KIAN-${String(count + 1).padStart(5, "0")}`,
      status: "submitted",
      paymentStatus: "paid_external",
      shippingFeeCents: shipping,
      subtotalCents: subtotal,
      totalCents: subtotal + shipping,
      source: "kian-prive",
      partnerExternalRef: externalRef,
      shippingMethod: body.shippingMethod === "OVERNIGHT" ? "OVERNIGHT" : "2_DAY",
      notes: [body.notes || "", `Partner site: ${body.partnerSite || "kian-prive"}`, `Customer: ${email}`]
        .filter(Boolean)
        .join("\n"),
      patientJson: packed.patientJson,
      patientCipher: packed.patientCipher,
      prescriberJson: JSON.stringify(body.prescriber || {}),
      shipToJson: JSON.stringify(ship),
      kianIntakeId: clinicalPatient.kianIntakeId,
      clinicalChartJson: JSON.stringify(chart || {}),
      intakePayloadJson: JSON.stringify(intakePayload),
      signaturesJson: JSON.stringify(signatures),
      therapyJson: JSON.stringify(therapy),
      lines: { create: lineCreates },
    },
    include: { lines: true },
  });

  await prisma.clinicalPatient.update({
    where: { id: clinicalPatient.id },
    data: { lastOrderId: order.id },
  });

  try {
    const rxcoreOrderId = await openRxcoreOrder({
      orderId: order.id,
      lines: order.lines
        .filter((line) => isProductClass(line.productClass))
        .map((line) => ({
          productClass: line.productClass as "503A",
          patientInitials: line.patientInitials,
        })),
      prescription: {
        patient,
        prescriber: body.prescriber,
        shippingMethod: body.shippingMethod === "OVERNIGHT" ? "OVERNIGHT" : "2_DAY",
      },
    });
    await audit({
      actorId: user.id,
      action: "partner.order_created",
      object: order.id,
      after: `${externalRef}:${rxcoreOrderId}`,
    });
    return NextResponse.json({
      ok: true,
      orderId: order.id,
      invoiceNumber: order.invoiceNumber,
      rxhereOrderId: rxcoreOrderId,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Pharmacy submission failed.";
    await prisma.order.update({
      where: { id: order.id },
      data: { status: "on_hold", splitMessage: message },
    });
    return NextResponse.json({ ok: true, orderId: order.id, invoiceNumber: order.invoiceNumber, warning: message });
  }
}
