import { NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { requireApiSession } from "@/lib/api-auth";
import { badRequest } from "@/lib/dashboard";
import { kv } from "@/lib/kv";
import type { Role } from "@prisma/client";

export const runtime = "nodejs";

const ROLES = ["CUSTOMER", "PROVIDER", "AMBASSADOR", "ADMIN"] as const;

export async function GET(req: Request) {
  const gate = await requireApiSession(["ADMIN"]);
  if (!gate.ok) return gate.response;

  const { searchParams } = new URL(req.url);
  const roleRaw = searchParams.get("role") || undefined;
  const role = roleRaw && ROLES.includes(roleRaw as (typeof ROLES)[number]) ? roleRaw : undefined;
  const q = (searchParams.get("q") || "").trim();

  const users = await prisma.user.findMany({
    where: {
      ...(role ? { role: role as Role } : {}),
      ...(q
        ? {
            OR: [
              { email: { contains: q, mode: "insensitive" } },
              { name: { contains: q, mode: "insensitive" } },
            ],
          }
        : {}),
    },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      createdAt: true,
      providerProfile: { select: { id: true, businessName: true, approved: true } },
      ambassadorProfile: { select: { id: true, code: true, walletBalance: true } },
      _count: { select: { orders: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 200,
  });

  return NextResponse.json({
    users: users.map((u) => ({
      id: u.id,
      email: u.email,
      name: u.name,
      role: u.role,
      createdAt: u.createdAt,
      orderCount: u._count.orders,
      providerProfile: u.providerProfile,
      ambassadorProfile: u.ambassadorProfile,
    })),
  });
}

const createSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6).max(100),
  name: z.string().trim().min(1).max(120).optional(),
  role: z.enum(ROLES),
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

const patchSchema = z.object({
  userId: z.string().min(1),
  name: z.string().trim().min(1).max(120).nullable().optional(),
  role: z.enum(ROLES).optional(),
  password: z.string().min(6).max(100).optional(),
  businessName: z.string().trim().min(2).max(200).optional(),
  ambassadorCode: z.string().trim().min(2).max(40).optional(),
  approved: z.boolean().optional(),
});

export async function PATCH(req: Request) {
  const gate = await requireApiSession(["ADMIN"]);
  if (!gate.ok) return gate.response;

  let body: z.infer<typeof patchSchema>;
  try {
    body = patchSchema.parse(await req.json());
  } catch {
    return badRequest("Invalid patch");
  }

  const existing = await prisma.user.findUnique({
    where: { id: body.userId },
    include: { providerProfile: true, ambassadorProfile: true },
  });
  if (!existing) return badRequest("User not found");

  if (body.role && body.role !== existing.role && existing.role === "ADMIN") {
    const adminCount = await prisma.user.count({ where: { role: "ADMIN" } });
    if (adminCount <= 1) return badRequest("Cannot demote the last admin");
  }

  const nextRole = body.role || existing.role;

  if (nextRole === "PROVIDER" && !existing.providerProfile && !body.businessName) {
    return badRequest("businessName required when promoting to PROVIDER");
  }

  if (body.role === "AMBASSADOR" || (nextRole === "AMBASSADOR" && !existing.ambassadorProfile)) {
    const code =
      body.ambassadorCode?.toUpperCase().replace(/[^A-Z0-9_-]/g, "") ||
      existing.ambassadorProfile?.code ||
      `AMB${Date.now().toString(36).toUpperCase()}`;
    if (code.length < 2) return badRequest("Invalid ambassador code");
    const clash = await prisma.ambassadorProfile.findFirst({
      where: { code, NOT: { userId: existing.id } },
    });
    if (clash) return badRequest("Ambassador code already in use");
  }

  const data: {
    name?: string | null;
    role?: Role;
    passwordHash?: string;
  } = {};
  if (body.name !== undefined) data.name = body.name;
  if (body.role) data.role = body.role;
  if (body.password) data.passwordHash = await bcrypt.hash(body.password, 12);

  const user = await prisma.$transaction(async (tx) => {
    const updated = await tx.user.update({
      where: { id: body.userId },
      data,
      select: { id: true, email: true, name: true, role: true },
    });

    if (nextRole === "PROVIDER") {
      if (existing.providerProfile) {
        await tx.providerProfile.update({
          where: { userId: existing.id },
          data: {
            ...(body.businessName ? { businessName: body.businessName } : {}),
            ...(typeof body.approved === "boolean" ? { approved: body.approved } : {}),
          },
        });
      } else {
        await tx.providerProfile.create({
          data: {
            userId: existing.id,
            businessName: body.businessName!,
            approved: body.approved ?? false,
          },
        });
      }
    }

    if (nextRole === "AMBASSADOR") {
      const code =
        body.ambassadorCode?.toUpperCase().replace(/[^A-Z0-9_-]/g, "") ||
        existing.ambassadorProfile?.code ||
        `AMB${Date.now().toString(36).toUpperCase()}`;
      if (!existing.ambassadorProfile) {
        await tx.ambassadorProfile.create({
          data: { userId: existing.id, code },
        });
      } else if (body.ambassadorCode) {
        await tx.ambassadorProfile.update({
          where: { userId: existing.id },
          data: { code },
        });
      }
    }

    return updated;
  });

  await kv.del("analytics:v1");
  return NextResponse.json({ ok: true, user });
}
