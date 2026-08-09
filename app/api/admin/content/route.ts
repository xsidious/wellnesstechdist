import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireApiSession } from "@/lib/api-auth";
import { badRequest } from "@/lib/dashboard";
import { CONTENT_KEYS, upsertContentBlock } from "@/lib/content";

export const runtime = "nodejs";

export async function GET() {
  const gate = await requireApiSession(["ADMIN"]);
  if (!gate.ok) return gate.response;

  const rows = await prisma.siteContentBlock.findMany({
    orderBy: { key: "asc" },
  });

  const byKey = Object.fromEntries(rows.map((r) => [r.key, r]));
  const blocks = CONTENT_KEYS.map((key) => ({
    key,
    title: byKey[key]?.title || null,
    body: byKey[key]?.body || {},
    updatedAt: byKey[key]?.updatedAt || null,
  }));

  return NextResponse.json({ blocks });
}

const putSchema = z.object({
  key: z.enum(["home.hero", "home.cta", "faq.items", "contact.info"]),
  title: z.string().max(200).optional().nullable(),
  body: z.record(z.unknown()),
});

export async function PUT(req: Request) {
  const gate = await requireApiSession(["ADMIN"]);
  if (!gate.ok) return gate.response;

  let body: z.infer<typeof putSchema>;
  try {
    body = putSchema.parse(await req.json());
  } catch {
    return badRequest("Invalid content payload");
  }

  const row = await upsertContentBlock(body.key, body.body as never, {
    title: body.title || undefined,
    updatedBy: gate.session.user.id,
  });

  return NextResponse.json({ ok: true, block: row });
}
