import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { AMB_COOKIE, CART_COOKIE } from "@/lib/cookies";
import { placeOrderCore } from "@/lib/commerce/place-order";
import { prisma } from "@/lib/db";

export const runtime = "nodejs";

const bodySchema = z.object({
  email: z.string().email(),
  /** Optional explicit cart session; defaults to wt_cart_sid cookie. */
  sessionId: z.string().optional(),
});

export async function POST(req: Request) {
  let body: z.infer<typeof bodySchema>;
  try {
    body = bodySchema.parse(await req.json());
  } catch {
    return NextResponse.json({ error: "Valid email is required" }, { status: 400 });
  }

  const jar = await cookies();
  const session = await auth();
  const ambCode = jar.get(AMB_COOKIE)?.value?.toLowerCase() || null;

  let sessionId = body.sessionId || jar.get(CART_COOKIE)?.value || null;
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    jar.set(CART_COOKIE, sessionId, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
      secure: process.env.NODE_ENV === "production",
    });
  }

  // Ensure cart exists for session (guest carts are created on add-to-cart)
  const cart = await prisma.cart.findUnique({ where: { sessionId } });
  if (!cart) {
    return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
  }

  const result = await placeOrderCore({
    email: body.email,
    userId: session?.user?.id || null,
    ambassadorCode: ambCode,
    sessionId,
  });

  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  return NextResponse.json({
    ok: true,
    orderId: result.orderId,
    clientSecret: result.clientSecret,
    totalCents: result.totalCents,
  });
}
