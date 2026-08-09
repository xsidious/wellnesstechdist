"use server";

import { cookies } from "next/headers";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { CART_COOKIE } from "@/lib/cookies";

export async function getOrCreateSessionId() {
  const jar = await cookies();
  let sid = jar.get(CART_COOKIE)?.value;
  if (!sid) {
    sid = crypto.randomUUID();
    jar.set(CART_COOKIE, sid, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
      secure: process.env.NODE_ENV === "production",
    });
  }
  return sid;
}

export async function getCart() {
  const sid = await getOrCreateSessionId();
  return prisma.cart.findUnique({
    where: { sessionId: sid },
    include: {
      items: {
        include: {
          variant: {
            include: { product: true },
          },
        },
      },
    },
  });
}

async function ensureCart(sessionId: string) {
  const existing = await prisma.cart.findUnique({ where: { sessionId } });
  if (existing) return existing;
  return prisma.cart.create({ data: { sessionId } });
}

export async function addToCart(variantId: string, quantity: number) {
  try {
    if (!variantId || quantity < 1) return { error: "Invalid quantity" };
    const variant = await prisma.productVariant.findUnique({ where: { id: variantId } });
    if (!variant) return { error: "Variant not found" };
    if (variant.stock < quantity) return { error: "Insufficient stock" };

    const sid = await getOrCreateSessionId();
    const cart = await ensureCart(sid);

    await prisma.cartItem.upsert({
      where: { cartId_variantId: { cartId: cart.id, variantId } },
      create: { cartId: cart.id, variantId, quantity },
      update: { quantity: { increment: quantity } },
    });

    revalidatePath("/cart");
    revalidatePath("/shop");
    return { ok: true as const };
  } catch {
    return { error: "Could not add to cart" };
  }
}

export async function updateCartItem(itemId: string, quantity: number) {
  try {
    if (quantity < 1) {
      await prisma.cartItem.delete({ where: { id: itemId } });
    } else {
      await prisma.cartItem.update({
        where: { id: itemId },
        data: { quantity },
      });
    }
    revalidatePath("/cart");
    return { ok: true as const };
  } catch {
    return { error: "Could not update cart" };
  }
}

export async function removeCartItem(itemId: string) {
  try {
    await prisma.cartItem.delete({ where: { id: itemId } });
    revalidatePath("/cart");
    return { ok: true as const };
  } catch {
    return { error: "Could not remove item" };
  }
}
