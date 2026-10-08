import { NextResponse } from "next/server";
import { conciergeReply } from "@/lib/concierge";

export async function POST(request: Request) {
  const body = (await request.json()) as { message?: string };
  const message = String(body.message || "").slice(0, 500);
  return NextResponse.json({ reply: conciergeReply(message) });
}
