import { createHash, randomBytes } from "crypto";
import { prisma } from "@/lib/prisma";
import { audit } from "@/lib/audit";
import { commissionCents, isProductClass, type ProductClass } from "@/lib/rules";
import { encryptField } from "@/lib/crypto";

export type RxHereAddress = {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  zipCode: string;
  country?: string;
};

export type RxHerePatient = {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender?: string;
  phone?: string;
  email?: string;
  allergies?: string;
  address: RxHereAddress;
};

export type RxHerePrescriber = {
  npiNumber?: string;
  firstName?: string;
  lastName?: string;
  title?: string;
  practiceName?: string;
  phone?: string;
};

export type RxHereItem = {
  sku: string;
  name?: string;
  strength?: string;
  size?: string;
  dosageForm?: string;
  quantity: number;
  sig: string;
};

export type PlacePrescriptionInput = {
  partnerOrderId: string;
  shippingMethod?: "2_DAY" | "OVERNIGHT";
  items: RxHereItem[];
  patient: RxHerePatient;
  prescriber?: RxHerePrescriber;
  webhookUrl?: string;
};

const EVENT_STATUS: Record<string, string> = {
  COMPOUNDING: "compounding",
  QA_PENDING: "verified",
  SHIPPED: "shipped",
  IN_TRANSIT: "shipped",
  OUT_FOR_DELIVERY: "shipped",
  DELIVERED: "delivered",
  HOLD: "on_hold",
  EXCEPTION: "delayed",
  CANCELLED: "cancelled",
  PAID: "submitted",
  AWAITING_VERIFICATION: "received",
};

function baseUrl() {
  return (process.env.RXHERE_API_BASE_URL || "https://rxhere.qrolic.com/api").replace(/\/$/, "");
}

export function rxhereConfigured() {
  return Boolean(process.env.RXHERE_API_TOKEN?.trim());
}

export async function rxhereFetch(path: string, init: RequestInit = {}) {
  const token = process.env.RXHERE_API_TOKEN?.trim();
  if (!token) throw new Error("RXHERE_API_TOKEN is missing.");
  const url = `${baseUrl()}${path.startsWith("/") ? path : `/${path}`}`;
  const headers = new Headers(init.headers || {});
  headers.set("Authorization", `Bearer ${token}`);
  headers.set("Content-Type", "application/json");
  if (process.env.RXHERE_WEBHOOK_URL?.trim()) {
    headers.set("X-Webhook-URL", process.env.RXHERE_WEBHOOK_URL.trim());
  }
  const response = await fetch(url, { ...init, headers, cache: "no-store" });
  const text = await response.text();
  let data: unknown = {};
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = { raw: text };
  }
  return { ok: response.ok, status: response.status, data };
}

export async function getShippingRates() {
  return rxhereFetch("/logistics/shipping-rates");
}

export async function getOrderStatus(id: string) {
  return rxhereFetch(`/logistics/orders/${encodeURIComponent(id)}`);
}

export async function cancelOrder(id: string) {
  return rxhereFetch(`/logistics/orders/${encodeURIComponent(id)}/cancel`, { method: "POST", body: "{}" });
}

export async function placePrescriptionOrder(input: PlacePrescriptionInput) {
  if (!rxhereConfigured()) {
    const sandboxId = `RXC-${randomBytes(4).toString("hex").toUpperCase()}`;
    return {
      ok: true as const,
      sandbox: true as const,
      orderId: sandboxId,
      orderIds: [sandboxId],
      partnerOrderId: input.partnerOrderId,
      batchId: "",
      status: "AWAITING_VERIFICATION",
    };
  }

  const body = {
    partnerOrderId: input.partnerOrderId,
    shippingMethod: input.shippingMethod || "2_DAY",
    items: input.items.map((item) => ({
      sku: item.sku,
      name: item.name,
      strength: item.strength,
      size: item.size,
      dosageForm: item.dosageForm,
      quantity: item.quantity,
      sig: item.sig,
    })),
    patient: {
      ...input.patient,
      address: {
        ...input.patient.address,
        country: input.patient.address.country || "US",
      },
    },
    ...(input.prescriber ? { prescriber: input.prescriber } : {}),
  };

  const headers: HeadersInit = {};
  if (input.webhookUrl) headers["X-Webhook-URL"] = input.webhookUrl;

  const result = await rxhereFetch("/logistics/orders", {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });

  if (!result.ok) {
    const message =
      typeof result.data === "object" && result.data && "message" in result.data
        ? String((result.data as { message?: string }).message)
        : typeof result.data === "object" && result.data && "error" in result.data
          ? String((result.data as { error?: string }).error)
          : `RxHere order failed (${result.status}).`;
    return { ok: false as const, status: result.status, error: message, data: result.data };
  }

  const data = result.data as {
    orderId?: string;
    orderIds?: string[];
    partnerOrderId?: string;
    batchId?: string;
    status?: string;
  };

  return {
    ok: true as const,
    sandbox: false as const,
    orderId: data.orderId || data.orderIds?.[0] || "",
    orderIds: data.orderIds || (data.orderId ? [data.orderId] : []),
    partnerOrderId: data.partnerOrderId || input.partnerOrderId,
    batchId: data.batchId || "",
    status: data.status || "AWAITING_VERIFICATION",
    data,
  };
}

/** Probe common catalog paths. Returns rows if the staging API exposes a list. */
export async function probeFormularyCatalog(): Promise<
  { sku: string; name?: string; medication?: string; strength?: string; size?: string; form?: string; price?: number; category?: string; description?: string }[] | null
> {
  if (!rxhereConfigured()) return null;
  const paths = ["/logistics/products", "/formulary", "/catalog", "/products", "/logistics/formulary"];
  for (const path of paths) {
    try {
      const result = await rxhereFetch(path);
      if (!result.ok) continue;
      const data = result.data as { data?: unknown; products?: unknown; items?: unknown } | unknown[];
      const list = Array.isArray(data)
        ? data
        : Array.isArray((data as { data?: unknown }).data)
          ? (data as { data: unknown[] }).data
          : Array.isArray((data as { products?: unknown }).products)
            ? (data as { products: unknown[] }).products
            : Array.isArray((data as { items?: unknown }).items)
              ? (data as { items: unknown[] }).items
              : null;
      if (!list?.length) continue;
      return list
        .map((row) => {
          const item = row as Record<string, unknown>;
          const sku = String(item.sku || item.SKU || item.productSku || "").trim();
          if (!sku) return null;
          return {
            sku,
            name: item.name ? String(item.name) : undefined,
            medication: item.medication ? String(item.medication) : undefined,
            strength: item.strength ? String(item.strength) : undefined,
            size: item.size ? String(item.size) : undefined,
            form: item.form || item.dosageForm ? String(item.form || item.dosageForm) : undefined,
            price: typeof item.price === "number" ? item.price : Number(item.price || item.unitPrice || 0) || undefined,
            category: item.category ? String(item.category) : undefined,
            description: item.description ? String(item.description) : undefined,
          };
        })
        .filter(Boolean) as {
        sku: string;
        name?: string;
        medication?: string;
        strength?: string;
        size?: string;
        form?: string;
        price?: number;
        category?: string;
        description?: string;
      }[];
    } catch {
      continue;
    }
  }
  return null;
}

export function verifyRxHereWebhookSecret(request: Request) {
  const expected = process.env.RXHERE_WEBHOOK_SECRET?.trim();
  if (!expected) return false;
  const a = request.headers.get("x-webhook-secret") || "";
  const b = request.headers.get("x-courier-secret") || "";
  return a === expected || b === expected;
}

export function packPatient(patient: RxHerePatient) {
  const json = JSON.stringify(patient);
  return { patientJson: json, patientCipher: encryptField(json) };
}

async function notifyKianStatus(payload: {
  externalRef: string;
  status: string;
  trackingNumber?: string;
  carrier?: string;
  event: string;
  occurredAt?: string;
  reason?: string;
}) {
  const url = process.env.KIAN_STATUS_WEBHOOK_URL?.trim();
  const secret = process.env.KIAN_PARTNER_SECRET?.trim();
  if (!url || !secret || !payload.externalRef) return;
  try {
    await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-wt-partner-secret": secret,
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    });
  } catch {
    // Status callbacks are best-effort.
  }
}

export async function ingestRxHereWebhook(body: string, request: Request) {
  if (!verifyRxHereWebhookSecret(request)) {
    return { ok: false as const, status: 401, error: "Invalid webhook secret." };
  }
  const payload = JSON.parse(body) as {
    reference?: string;
    logisticsReference?: string;
    event?: string;
    trackingNumber?: string | null;
    carrier?: string | null;
    description?: string;
    reason?: string | null;
    occurredAt?: string;
    proofOfDelivery?: { signedBy?: string; deliveredAt?: string } | null;
  };
  if (!payload.reference || !payload.event) {
    return { ok: false as const, status: 400, error: "Missing reference or event." };
  }

  const eventId = createHash("sha256")
    .update(`${payload.reference}|${payload.event}|${payload.occurredAt || ""}`)
    .digest("hex");
  const duplicate = await prisma.orderEvent.findUnique({ where: { eventId } });
  if (duplicate) return { ok: true as const, duplicate: true };

  const order =
    (await prisma.order.findFirst({
      where: { partnerExternalRef: payload.reference },
      include: { lines: true, org: true },
    })) ||
    (await prisma.order.findFirst({
      where: { invoiceNumber: payload.reference },
      include: { lines: true, org: true },
    })) ||
    (await prisma.order.findFirst({
      where: { OR: [{ rxhereOrderId: payload.reference }, { rxcoreOrderId: payload.reference }] },
      include: { lines: true, org: true },
    }));

  if (!order) return { ok: false as const, status: 404, error: "Order not found." };

  const status = EVENT_STATUS[payload.event] || order.status;
  await prisma.orderEvent.create({
    data: { orderId: order.id, eventId, type: payload.event, payload: body },
  });
  await prisma.webhookDelivery.create({
    data: { eventId, type: payload.event, payload: body, status: "delivered" },
  });
  await prisma.order.update({
    where: { id: order.id },
    data: {
      status,
      trackingNumber: payload.trackingNumber || order.trackingNumber,
      rxhereOrderId: payload.logisticsReference || order.rxhereOrderId,
    },
  });
  await prisma.orderLine.updateMany({ where: { orderId: order.id }, data: { lineStatus: status } });

  if (payload.event === "DELIVERED" && order.org.referringAffiliateId) {
    const affiliate = await prisma.affiliateProfile.findUnique({ where: { userId: order.org.referringAffiliateId } });
    if (affiliate) {
      let eligible = 0;
      let amount = 0;
      for (const line of order.lines) {
        if (!isProductClass(line.productClass)) continue;
        const lineCents = line.unitPriceCents * line.qty;
        const commission = commissionCents(line.productClass as ProductClass, lineCents);
        if (commission > 0) {
          eligible += lineCents;
          amount += commission;
        }
      }
      if (amount > 0) {
        const existing = await prisma.commission.findFirst({ where: { orderId: order.id, affiliateUserId: affiliate.userId } });
        if (!existing) {
          await prisma.commission.create({
            data: {
              affiliateUserId: affiliate.userId,
              orgId: order.orgId,
              orderId: order.id,
              eligibleCents: eligible,
              rateBps: 1000,
              amountCents: amount,
              status: "pending_batch",
            },
          });
        }
      }
    }
  }

  await audit({
    action: "rxhere.webhook",
    object: order.id,
    after: `${payload.event}:${status}`,
  });

  await notifyKianStatus({
    externalRef: order.partnerExternalRef || order.invoiceNumber,
    status,
    trackingNumber: payload.trackingNumber || undefined,
    carrier: payload.carrier || undefined,
    event: payload.event,
    occurredAt: payload.occurredAt,
    reason: payload.reason || undefined,
  });

  return { ok: true as const, duplicate: false, status };
}
