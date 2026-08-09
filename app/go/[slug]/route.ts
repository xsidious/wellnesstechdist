import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const runtime = "nodejs";

type Ctx = { params: Promise<{ slug: string }> };

/** Public redirect that increments tracked ambassador link clicks. */
export async function GET(req: Request, ctx: Ctx) {
  const { slug } = await ctx.params;
  const link = await prisma.ambassadorLink.findUnique({
    where: { slug },
    include: { ambassador: { select: { code: true } } },
  });

  if (!link) {
    return NextResponse.redirect(new URL("/shop", req.url));
  }

  await prisma.ambassadorLink.update({
    where: { id: link.id },
    data: { clicks: { increment: 1 } },
  });

  const dest = new URL(link.destination, req.url);
  dest.searchParams.set("ref", link.ambassador.code);
  return NextResponse.redirect(dest);
}
