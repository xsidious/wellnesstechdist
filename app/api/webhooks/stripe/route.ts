import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { sendOrderReceipt } from "@/lib/resend";

export const runtime = "nodejs";

export async function POST(req: Request) {
  if (!stripe) {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 503 });
  }

  const sig = req.headers.get("stripe-signature");
  if (!sig) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    return NextResponse.json({ error: "Webhook secret missing" }, { status: 503 });
  }

  const body = await req.text();
  let event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, secret);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Invalid signature";
    return NextResponse.json({ error: msg }, { status: 400 });
  }

  try {
    if (event.type === "payment_intent.succeeded") {
      const pi = event.data.object;
      const orderId = pi.metadata?.orderId;
      const order = orderId
        ? await prisma.order.findUnique({ where: { id: orderId } })
        : await prisma.order.findUnique({
            where: { stripePaymentIntentId: pi.id },
          });

      if (order && order.status === "PENDING") {
        await prisma.$transaction(async (tx) => {
          await tx.order.update({
            where: { id: order.id },
            data: { status: "PAID", stripePaymentIntentId: pi.id },
          });
          await tx.subOrder.updateMany({
            where: { orderId: order.id },
            data: { status: "PAID" },
          });
          await tx.ledgerEntry.updateMany({
            where: { orderId: order.id, status: "PENDING" },
            data: { status: "AVAILABLE" },
          });

          const commission = await tx.ledgerEntry.findFirst({
            where: {
              orderId: order.id,
              type: "AMBASSADOR_COMMISSION",
            },
          });
          if (commission?.ambassadorId) {
            await tx.ambassadorProfile.update({
              where: { id: commission.ambassadorId },
              data: { walletBalance: { increment: commission.amountCents } },
            });
          }
        });

        await sendOrderReceipt({
          to: order.email,
          orderId: order.id,
          totalCents: order.totalCents,
        }).catch(() => {});
      }
    }
  } catch (e) {
    console.error("stripe webhook handler error", e);
    return NextResponse.json({ error: "Handler failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
