import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { sendAgeConfirmAdmin } from "@/lib/resend";
import { rateLimit } from "@/lib/kv";

const schema = z.object({
  email: z.string().email().max(255),
  path: z.string().max(500).optional(),
  referrer: z.string().max(1000).optional(),
  userAgent: z.string().max(1000).optional(),
});

export async function POST(req: Request) {
  try {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    const rl = await rateLimit(`age:${ip}`, 20, 3600);
    if (!rl.ok) {
      return NextResponse.json({ error: "Rate limited" }, { status: 429 });
    }

    const json = await req.json();
    const parsed = schema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const data = parsed.data;
    try {
      await prisma.ageConfirmation.create({
        data: {
          email: data.email.toLowerCase(),
          path: data.path,
          referrer: data.referrer,
          userAgent: data.userAgent,
        },
      });
    } catch {
      /* DB optional for gate UX */
    }

    await sendAgeConfirmAdmin(data).catch(() => {});

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
