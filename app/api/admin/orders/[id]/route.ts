import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireApiSession } from "@/lib/api-auth";
import { badRequest, notFound } from "@/lib/dashboard";
import { kv } from "@/lib/kv";

export const runtime = "nodejs";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: Request, ctx: Ctx) {
  const gate = await requireApiSession(["ADMIN"]);
  if (!gate.ok) return gate.response;
  const { id } = await ctx.params;

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      user: { select: { email: true, name: true } },
      ambassador: { select: { code: true, id: true } },
      items: true,
      subOrders: {
        include: {
          provider: { select: { id: true, businessName: true } },
          items: true,
        },
      },
      ledgerEntries: true,
    },
  });
  if (!order) return notFound();
  return NextResponse.json({
    order: {
      ...order,
      ambassadorCode: order.ambassador?.code || order.ambassadorCode,
      subOrders: order.subOrders.map((s) => ({
        id: s.id,
        status: s.status,
        subtotalCents: s.subtotalCents,
        providerName: s.provider.businessName,
        items: s.items.map((i) => ({
          id: i.id,
          productName: i.productName,
          variantName: i.variantName,
          quantity: i.quantity,
          lineTotalCents: i.lineTotalCents,
        })),
      })),
      ledgerEntries: order.ledgerEntries.map((e) => ({
        id: e.id,
        type: e.type,
        status: e.status,
        amountCents: e.amountCents,
        description: e.description,
        createdAt: e.createdAt,
        paidAt: e.paidAt,
      })),
    },
  });
}

const patchSchema = z.object({
  status: z
    .enum(["PENDING", "PAID", "FULFILLING", "COMPLETED", "CANCELLED", "REFUNDED"])
    .optional(),
  subOrderId: z.string().optional(),
  subOrderStatus: z
    .enum(["PENDING", "PAID", "FULFILLING", "SHIPPED", "COMPLETED", "CANCELLED"])
    .optional(),
});

export async function PATCH(req: Request, ctx: Ctx) {
  const gate = await requireApiSession(["ADMIN"]);
  if (!gate.ok) return gate.response;
  const { id } = await ctx.params;

  const existing = await prisma.order.findUnique({ where: { id } });
  if (!existing) return notFound();

  let body: z.infer<typeof patchSchema>;
  try {
    body = patchSchema.parse(await req.json());
  } catch {
    return badRequest("Invalid patch");
  }

  if (body.subOrderId && body.subOrderStatus) {
    const sub = await prisma.subOrder.findFirst({
      where: { id: body.subOrderId, orderId: id },
    });
    if (!sub) return badRequest("Sub-order not found on this order");
    await prisma.subOrder.update({
      where: { id: body.subOrderId },
      data: { status: body.subOrderStatus },
    });
  }

  if (body.status) {
    await prisma.order.update({
      where: { id },
      data: { status: body.status },
    });

    if (body.status === "CANCELLED" || body.status === "REFUNDED") {
      await prisma.ledgerEntry.updateMany({
        where: {
          orderId: id,
          status: { in: ["PENDING", "AVAILABLE"] },
        },
        data: { status: "CANCELLED" },
      });
    }

    if (body.status === "COMPLETED" || body.status === "FULFILLING") {
      await prisma.ledgerEntry.updateMany({
        where: {
          orderId: id,
          status: "PENDING",
        },
        data: { status: "AVAILABLE" },
      });
    }
  }

  await kv.del("analytics:v1");

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      subOrders: {
        include: {
          provider: { select: { businessName: true } },
          items: true,
        },
      },
    },
  });

  return NextResponse.json({ ok: true, order });
}
