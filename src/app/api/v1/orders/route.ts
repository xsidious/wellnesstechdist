import { NextResponse } from "next/server";
import { hashKey } from "@/lib/crypto";
import { prisma } from "@/lib/prisma";
import { createExternalOrder } from "@/lib/rxcore";

export async function POST(request: Request) {
  const header = request.headers.get("authorization") || "";
  const token = header.replace(/^Bearer\s+/i, "");
  const key = await prisma.apiKey.findUnique({ where: { keyHash: hashKey(token) } });
  if (!key) return NextResponse.json({ error: "Invalid API key." }, { status: 401 });
  const idempotency = request.headers.get("idempotency-key") || "";
  if (idempotency) {
    const seen = await prisma.idempotencyKey.findUnique({ where: { key: idempotency } });
    if (seen) return NextResponse.json(JSON.parse(seen.response));
  }
  const body = (await request.json()) as { sku?: string; qty?: number };
  const placer = await prisma.user.findFirst({ where: { orgId: key.orgId } });
  if (!placer || !body.sku) return NextResponse.json({ error: "SKU is required." }, { status: 400 });
  const created = await createExternalOrder({
    orgId: key.orgId,
    userId: placer.id,
    sku: body.sku,
    qty: Math.max(1, Number(body.qty || 1)),
    source: "api",
  });
  if ("error" in created) return NextResponse.json(created, { status: 422 });
  if (idempotency) {
    await prisma.idempotencyKey.create({ data: { key: idempotency, response: JSON.stringify(created) } });
  }
  return NextResponse.json(created);
}
