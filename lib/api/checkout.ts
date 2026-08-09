"use client";

import { useMutation } from "@tanstack/react-query";
import { fetchJson } from "./client";

export type PlaceOrderResponse = {
  ok: true;
  orderId: string;
  clientSecret: string | null;
  totalCents: number;
};

/**
 * Example:
 * const placeOrder = usePlaceOrder();
 * placeOrder.mutate({ email: "buyer@clinic.com" });
 */
export function usePlaceOrder() {
  return useMutation({
    mutationFn: (body: { email: string; sessionId?: string }) =>
      fetchJson<PlaceOrderResponse>("/api/checkout/place-order", {
        method: "POST",
        body: JSON.stringify(body),
      }),
  });
}
