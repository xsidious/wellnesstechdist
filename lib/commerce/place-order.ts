import { prisma } from "@/lib/db";
import { calcCommission, calcPlatformFee, providerNet } from "@/lib/commerce/fees";
import { requireStripe } from "@/lib/stripe";
import { acquireVariantLocks, releaseVariantLocks } from "@/lib/kv";

export type PlaceOrderInput = {
  email: string;
  userId?: string | null;
  ambassadorCode?: string | null;
  sessionId: string;
};

export type PlaceOrderResult =
  | { ok: true; orderId: string; clientSecret: string | null; totalCents: number }
  | { error: string };

/**
 * Atomic multi-provider checkout:
 * KV locks → Prisma transaction (stock, order, sub-orders, ledger) → Stripe PI.
 */
export async function placeOrderCore(input: PlaceOrderInput): Promise<PlaceOrderResult> {
  const email = input.email.trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: "Valid email is required" };
  }

  const cart = await prisma.cart.findUnique({
    where: { sessionId: input.sessionId },
    include: {
      items: {
        include: {
          variant: { include: { product: true } },
        },
      },
    },
  });

  if (!cart || cart.items.length === 0) {
    return { error: "Cart is empty" };
  }

  const lockKeys = cart.items.map((i) => i.variantId);
  const locked = await acquireVariantLocks(lockKeys);
  if (!locked) {
    return { error: "Checkout is busy for one or more items — retry shortly" };
  }

  try {
    const ambCode = input.ambassadorCode?.toLowerCase() || null;
    const ambassador = ambCode
      ? await prisma.ambassadorProfile.findUnique({ where: { code: ambCode } })
      : null;

    const commissionTier = await prisma.commissionTier.findMany({
      where: { active: true },
      orderBy: { minOrderCents: "desc" },
    });

    const result = await prisma.$transaction(async (tx) => {
      const lines: {
        variantId: string;
        quantity: number;
        unitPriceCents: number;
        productName: string;
        variantName: string;
        providerId: string;
      }[] = [];

      for (const item of cart.items) {
        const variant = await tx.productVariant.findUnique({
          where: { id: item.variantId },
          include: { product: true },
        });
        if (!variant || variant.stock < item.quantity) {
          throw new Error(`Insufficient stock for ${item.variant.name}`);
        }
        const updated = await tx.productVariant.updateMany({
          where: { id: variant.id, stock: { gte: item.quantity } },
          data: { stock: { decrement: item.quantity } },
        });
        if (updated.count !== 1) {
          throw new Error(`Could not reserve stock for ${variant.name}`);
        }
        lines.push({
          variantId: variant.id,
          quantity: item.quantity,
          unitPriceCents: variant.priceCents,
          productName: variant.product.name,
          variantName: variant.name,
          providerId: variant.product.providerId,
        });
      }

      const subtotalCents = lines.reduce((s, l) => s + l.unitPriceCents * l.quantity, 0);
      const feeCents = calcPlatformFee(subtotalCents);
      const tier = commissionTier.find((t) => subtotalCents >= t.minOrderCents) || null;
      const commissionCents =
        ambassador && tier ? calcCommission(subtotalCents, tier.percentBps) : 0;

      const order = await tx.order.create({
        data: {
          userId: input.userId || null,
          email,
          status: "PENDING",
          subtotalCents,
          feeCents,
          commissionCents,
          totalCents: subtotalCents,
          currency: "usd",
          ambassadorId: ambassador?.id || null,
          ambassadorCode: ambassador?.code || null,
        },
      });

      const byProvider = new Map<string, typeof lines>();
      for (const line of lines) {
        const arr = byProvider.get(line.providerId) || [];
        arr.push(line);
        byProvider.set(line.providerId, arr);
      }

      for (const [providerId, providerLines] of byProvider) {
        const providerSubtotal = providerLines.reduce(
          (s, l) => s + l.unitPriceCents * l.quantity,
          0,
        );
        const share = subtotalCents > 0 ? providerSubtotal / subtotalCents : 0;
        const providerFee = Math.round(feeCents * share);
        const providerCommission = Math.round(commissionCents * share);
        const providerEarning = providerNet(providerSubtotal, providerFee, providerCommission);

        const subOrder = await tx.subOrder.create({
          data: {
            orderId: order.id,
            providerId,
            status: "PENDING",
            subtotalCents: providerSubtotal,
          },
        });

        for (const line of providerLines) {
          await tx.orderItem.create({
            data: {
              orderId: order.id,
              subOrderId: subOrder.id,
              variantId: line.variantId,
              productName: line.productName,
              variantName: line.variantName,
              quantity: line.quantity,
              unitPriceCents: line.unitPriceCents,
              lineTotalCents: line.unitPriceCents * line.quantity,
            },
          });
        }

        await tx.ledgerEntry.create({
          data: {
            orderId: order.id,
            subOrderId: subOrder.id,
            type: "ADMIN_FEE",
            status: "PENDING",
            amountCents: providerFee,
            description: `Platform fee for sub-order ${subOrder.id}`,
          },
        });

        await tx.ledgerEntry.create({
          data: {
            orderId: order.id,
            subOrderId: subOrder.id,
            type: "PROVIDER_EARNING",
            status: "PENDING",
            amountCents: providerEarning,
            description: `Provider earning for sub-order ${subOrder.id}`,
          },
        });
      }

      if (ambassador && commissionCents > 0) {
        await tx.ledgerEntry.create({
          data: {
            orderId: order.id,
            ambassadorId: ambassador.id,
            type: "AMBASSADOR_COMMISSION",
            status: "PENDING",
            amountCents: commissionCents,
            description: `Ambassador commission ${ambassador.code}`,
          },
        });
      }

      await tx.cartItem.deleteMany({ where: { cartId: cart.id } });

      return { orderId: order.id, totalCents: order.totalCents, email };
    });

    let clientSecret: string | null = null;
    try {
      const stripe = requireStripe();
      const pi = await stripe.paymentIntents.create({
        amount: result.totalCents,
        currency: "usd",
        receipt_email: result.email,
        metadata: { orderId: result.orderId },
        automatic_payment_methods: { enabled: true },
      });
      await prisma.order.update({
        where: { id: result.orderId },
        data: { stripePaymentIntentId: pi.id },
      });
      clientSecret = pi.client_secret;
    } catch (e) {
      console.warn("Stripe PI creation skipped/failed", e);
    }

    return {
      ok: true,
      orderId: result.orderId,
      clientSecret,
      totalCents: result.totalCents,
    };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Checkout failed";
    return { error: msg };
  } finally {
    await releaseVariantLocks(lockKeys);
  }
}
