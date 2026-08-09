export type OutboundEmail = {
  to: string
  from: string
  subject: string
  html: string
  text?: string
  messageId?: string
  unsubscribeToken?: string
}

export class EmailSendError extends Error {
  status: number
  retryAfterSeconds: number | null

  constructor(message: string, status: number, retryAfterSeconds: number | null = null) {
    super(message)
    this.name = 'EmailSendError'
    this.status = status
    this.retryAfterSeconds = retryAfterSeconds
  }
}

function siteOrigin(): string {
  return (
    process.env.SITE_URL ||
    process.env.VITE_SITE_URL ||
    'https://wellnesstechdistribution.com'
  ).replace(/\/$/, '')
}

/**
 * Send via Resend API. Requires RESEND_API_KEY and a verified from-domain.
 * Optional RESEND_FROM_EMAIL overrides the queue payload's from address.
 */
export async function sendTransactionalEmail(email: OutboundEmail): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    throw new EmailSendError('Missing RESEND_API_KEY', 500)
  }

  const from = process.env.RESEND_FROM_EMAIL || email.from
  const headers: Record<string, string> = {}

  if (email.unsubscribeToken) {
    const unsubUrl = `${siteOrigin()}/email/unsubscribe?token=${encodeURIComponent(email.unsubscribeToken)}`
    headers['List-Unsubscribe'] = `<${unsubUrl}>`
    headers['List-Unsubscribe-Post'] = 'List-Unsubscribe=One-Click'
  }

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to: [email.to],
      subject: email.subject,
      html: email.html,
      text: email.text,
      headers: Object.keys(headers).length ? headers : undefined,
      tags: email.messageId
        ? [{ name: 'message_id', value: String(email.messageId).slice(0, 256) }]
        : undefined,
    }),
  })

  if (res.ok) return

  const body = await res.text().catch(() => '')
  const retryAfterHeader = res.headers.get('retry-after')
  const retryAfterSeconds = retryAfterHeader ? Number(retryAfterHeader) || 60 : null

  throw new EmailSendError(
    `Resend error ${res.status}: ${body.slice(0, 500)}`,
    res.status,
    retryAfterSeconds,
  )
}
