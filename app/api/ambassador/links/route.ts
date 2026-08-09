import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireApiSession } from "@/lib/api-auth";
import { getAmbassadorProfileForUser, notFound, badRequest, slugify } from "@/lib/dashboard";

export const runtime = "nodejs";

export async function GET() {
  const gate = await requireApiSession(["AMBASSADOR", "ADMIN"]);
  if (!gate.ok) return gate.response;
  const profile = await getAmbassadorProfileForUser(gate.session.user.id);
  if (!profile) return notFound("Ambassador profile not found");

  const links = await prisma.ambassadorLink.findMany({
    where: { ambassadorId: profile.id },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ links });
}

const createSchema = z.object({
  slug: z.string().trim().min(2).max(60).optional(),
  destination: z.string().trim().min(1).max(300).default("/shop"),
});

export async function POST(req: Request) {
  const gate = await requireApiSession(["AMBASSADOR", "ADMIN"]);
  if (!gate.ok) return gate.response;
  const profile = await getAmbassadorProfileForUser(gate.session.user.id);
  if (!profile) return notFound("Ambassador profile not found");

  let body: z.infer<typeof createSchema>;
  try {
    body = createSchema.parse(await req.json());
  } catch {
    return badRequest("Invalid link");
  }

  let slug = slugify(body.slug || `${profile.code}-${Date.now().toString(36)}`);
  if (!slug) slug = `${profile.code}-${Date.now().toString(36)}`;

  const dest = body.destination.startsWith("/") ? body.destination : `/${body.destination}`;

  try {
    const link = await prisma.ambassadorLink.create({
      data: {
        ambassadorId: profile.id,
        slug,
        destination: dest,
      },
    });
    return NextResponse.json({ ok: true, link }, { status: 201 });
  } catch {
    return badRequest("Slug already taken");
  }
}
