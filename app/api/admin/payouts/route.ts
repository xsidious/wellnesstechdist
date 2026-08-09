import { NextResponse } from "next/server";
import { requireApiSession } from "@/lib/api-auth";
import { runPayouts } from "@/lib/payouts";
import { kv } from "@/lib/kv";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const gate = await requireApiSession(["ADMIN"]);
  if (!gate.ok) return gate.response;

  let flaggedProvidersOnly = false;
  try {
    const body = await req.json();
    flaggedProvidersOnly = !!body?.flaggedProvidersOnly;
  } catch {
    /* empty body ok */
  }

  try {
    const result = await runPayouts({ flaggedProvidersOnly });
    await kv.del("analytics:v1");
    return NextResponse.json(result);
  } catch (e) {
    console.error("admin payouts failed", e);
    return NextResponse.json({ error: "Payouts failed" }, { status: 500 });
  }
}
