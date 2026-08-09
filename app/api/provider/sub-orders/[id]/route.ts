import { NextResponse } from "next/server";
import { z } from "zod";
import type { SubOrderStatus } from "@prisma/client";
import { prisma } from "@/lib/db";
import { requireApiSession } from "@/lib/api-auth";
import { getProviderProfileForUser, notFound, badRequest } from "@/lib/dashboard";

export const runtime = "nodejs";

type Ctx = { params: Promise<{ id: string }> };

const ALLOWED: Record<string, SubOrderStatus[]> = {
  PAID: ["FULFILLING", "CANCELLED"],
  FULFILLING: ["SHIPPED", "CANCELLED"],
  SHIPPED: ["COMPLETED"],
};

const patchSchema = z.object({
  status: z.enum(["FULFILLING", "SHIPPED", "COMPLETED", "CANCELLED"]),
});

export async function PATCH(req: Request, ctx: Ctx) {
  const gate = await requireApiSession(["PROVIDER", "ADMIN"]);
  if (!gate.ok) return gate.response;
  const { id } = await ctx.params;

  const profile = await getProviderProfileForUser(gate.session.user.id);
  if (!profile) return notFound("Provider profile not found");

  const sub = await prisma.subOrder.findFirst({
    where: { id, providerId: profile.id },
  });
  if (!sub) return notFound();

  let body: z.infer<typeof patchSchema>;
  try {
    body = patchSchema.parse(await req.json());
  } catch {
    return badRequest("Invalid status");
  }

  const nextAllowed = ALLOWED[sub.status] || [];
  if (!nextAllowed.includes(body.status)) {
    return badRequest(`Cannot transition ${sub.status} → ${body.status}`);
  }

  const updated = await prisma.subOrder.update({
    where: { id },
    data: { status: body.status },
  });

  return NextResponse.json({ ok: true, subOrder: updated });
}
