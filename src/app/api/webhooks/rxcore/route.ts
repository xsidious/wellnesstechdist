import { NextResponse } from "next/server";
import { ingestWebhook } from "@/lib/rxcore";

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get("x-rxcore-signature") || "";
  const result = await ingestWebhook(body, signature);
  if (!result.ok) return NextResponse.json({ error: result.error }, { status: result.status });
  return NextResponse.json({ ok: true, duplicate: result.duplicate });
}
