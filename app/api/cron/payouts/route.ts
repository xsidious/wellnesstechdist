import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { runPayouts } from "@/lib/payouts";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Daily payout cron — marks AVAILABLE ledger entries as PAID.
 * Protect with Authorization: Bearer CRON_SECRET (or ?secret=).
 * Honors admin payout flags when present.
 */
export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  const auth = req.headers.get("authorization");
  const url = new URL(req.url);
  const q = url.searchParams.get("secret");
  const ok = !secret || auth === `Bearer ${secret}` || q === secret;

  if (!ok) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await runPayouts();
    return NextResponse.json(result);
  } catch (e) {
    console.error("payouts cron failed", e);
    return NextResponse.json({ error: "Payouts failed" }, { status: 500 });
  }
}
