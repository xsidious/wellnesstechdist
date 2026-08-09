import { Resend } from "resend";

export const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

export async function sendOrderReceipt(opts: {
  to: string;
  orderId: string;
  totalCents: number;
}) {
  if (!resend) {
    console.warn("Resend not configured — skipping receipt", opts.orderId);
    return;
  }
  const from =
    process.env.RESEND_FROM_EMAIL ||
    "Wellness Tech Bio Distribution <onboarding@resend.dev>";

  await resend.emails.send({
    from,
    to: opts.to,
    subject: `Order confirmed — ${opts.orderId}`,
    html: `<p>Thanks for your order.</p><p>Order ID: <strong>${opts.orderId}</strong></p><p>Total: $${(opts.totalCents / 100).toFixed(2)}</p>`,
  });
}

export async function sendAgeConfirmAdmin(opts: {
  email: string;
  path?: string;
  referrer?: string;
  userAgent?: string;
}) {
  if (!resend) {
    console.warn("Resend not configured — skipping age confirm email");
    return;
  }
  const from =
    process.env.RESEND_FROM_EMAIL ||
    "Wellness Tech Bio Distribution <onboarding@resend.dev>";
  const to = process.env.AGE_CONFIRM_TO || "contact@keepingitallnatural.com";

  await resend.emails.send({
    from,
    to,
    subject: "Age confirmation (21+) — wellnesstechdistribution.com",
    html: `<p>A visitor confirmed they are 21+.</p>
      <p>Email: ${opts.email}</p>
      <p>Path: ${opts.path || "—"}</p>
      <p>Referrer: ${opts.referrer || "Direct"}</p>
      <p>UA: ${opts.userAgent || "—"}</p>`,
  });
}
