import { NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { requireApiSession } from "@/lib/api-auth";
import { badRequest } from "@/lib/dashboard";
import { kv } from "@/lib/kv";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const gate = await requireApiSession(["ADMIN"]);
  if (!gate.ok) return gate.response;

  const { searchParams } = new URL(req.url);
  const role = searchParams.get("role") || undefined;

  const users = await prisma.user.findMany({
    where: role ? { role: role as "ADMIN" | "PROVIDER" | "AMBASSADOR" | "CUSTOMER" } : undefined,
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      createdAt: true,
      providerProfile: { select: { id: true, businessName: true, approved: true } },
      ambassadorProfile: { select: { id: true, code: true, walletBalance: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 200,
  });

  return NextResponse.json({ users });
}

const createSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6).max(100),
  name: z.string().trim().min(1).max(120).optional(),
  role: z.enum(["CUSTOMER", "PROVIDER", "AMBASSADOR", "ADMIN"]),
  businessName: z.string().trim().min(2).max(200).optional(),
  approved: z.boolean().optional(),
  ambassadorCode: z.string().trim().min(2).max(40).optional(),
});

export async function POST(req: Request) {
  const gate = await requireApiSession(["ADMIN"]);
  if (!gate.ok) return gate.response;

  let body: z.infer<typeof createSchema>;
  try {
    body = createSchema.parse(await req.json());
  } catch {
    return badRequest("Invalid user payload");
  }

  const email = body.email.toLowerCase();
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return badRequest("Email already registered");

  if (body.role === "PROVIDER" && !body.businessName) {
    return badRequest("businessName required for providers");
  }

  const passwordHash = await bcrypt.hash(body.password, 12);
  let code = body.ambassadorCode?.toUpperCase().replace(/[^A-Z0-9_-]/g, "") || undefined;
  if (body.role === "AMBASSADOR") {
    if (!code) code = `AMB${Date.now().toString(36).toUpperCase()}`;
    const clash = await prisma.ambassadorProfile.findUnique({ where: { code } });
    if (clash) return badRequest("Ambassador code already in use");
  }

  const user = await prisma.user.create({
    data: {
      email,
      name: body.name || null,
      role: body.role,
      passwordHash,
      ...(body.role === "PROVIDER"
        ? {
            providerProfile: {
              create: {
                businessName: body.businessName!,
                approved: body.approved ?? false,
              },
            },
          }
        : {}),
      ...(body.role === "AMBASSADOR"
        ? {
            ambassadorProfile: {
              create: { code: code! },
            },
          }
        : {}),
    },
    include: {
      providerProfile: true,
      ambassadorProfile: true,
    },
  });

  await kv.del("analytics:v1");

  return NextResponse.json(
    {
      ok: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        providerProfile: user.providerProfile,
        ambassadorProfile: user.ambassadorProfile,
      },
    },
    { status: 201 },
  );
}
