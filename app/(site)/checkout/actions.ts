"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { AMB_COOKIE } from "@/lib/cookies";
import { placeOrderCore } from "@/lib/commerce/place-order";
import { getOrCreateSessionId } from "@/app/(site)/cart/actions";

export type PlaceOrderResult =
  | { ok: true; orderId: string; clientSecret: string | null }
  | { error: string };

export async function placeOrder(formData: FormData): Promise<PlaceOrderResult> {
  const email = String(formData.get("email") || "")
    .trim()
    .toLowerCase();

  const session = await auth();
  const jar = await cookies();
  const ambCode = jar.get(AMB_COOKIE)?.value?.toLowerCase() || null;
  const sid = await getOrCreateSessionId();

  const result = await placeOrderCore({
    email,
    userId: session?.user?.id || null,
    ambassadorCode: ambCode,
    sessionId: sid,
  });

  if ("error" in result) return { error: result.error };
  return { ok: true, orderId: result.orderId, clientSecret: result.clientSecret };
}

export async function placeOrderAndRedirect(formData: FormData) {
  const res = await placeOrder(formData);
  if ("error" in res) {
    redirect(`/checkout?error=${encodeURIComponent(res.error)}`);
  }
  redirect(`/checkout?success=1&orderId=${res.orderId}`);
}
