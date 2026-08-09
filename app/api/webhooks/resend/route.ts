import { NextResponse } from "next/server";

/** Optional Resend bounce/complaint webhook stub. */
export async function POST(req: Request) {
  const secret = process.env.RESEND_WEBHOOK_SECRET;
  if (secret) {
    const header = req.headers.get("svix-signature") || req.headers.get("resend-signature");
    if (!header) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  try {
    const payload = await req.json();
    console.info("resend webhook", payload?.type || "unknown");
  } catch {
    /* ignore parse errors */
  }

  return NextResponse.json({ ok: true });
}
