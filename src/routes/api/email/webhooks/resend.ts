import { createClient } from '@supabase/supabase-js'
import { createFileRoute } from '@tanstack/react-router'

type ResendEvent = {
  type?: string
  data?: {
    email_id?: string
    to?: string[] | string
    bounce?: { message?: string }
    tags?: Array<{ name?: string; value?: string }>
  }
}

function extractEmail(data: ResendEvent['data']): string | null {
  const to = data?.to
  if (Array.isArray(to) && to[0]) return String(to[0]).toLowerCase()
  if (typeof to === 'string' && to) return to.toLowerCase()
  return null
}

function mapEvent(type: string): { reason: 'bounce' | 'complaint'; status: 'bounced' | 'complained' } | null {
  if (type === 'email.bounced' || type === 'email.failed') {
    return { reason: 'bounce', status: 'bounced' }
  }
  if (type === 'email.complained') {
    return { reason: 'complaint', status: 'complained' }
  }
  return null
}

export const Route = createFileRoute('/api/email/webhooks/resend')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
        const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
        const webhookSecret = process.env.RESEND_WEBHOOK_SECRET

        if (!supabaseUrl || !supabaseServiceKey) {
          return Response.json({ error: 'Server configuration error' }, { status: 500 })
        }

        // Optional shared-secret header for simple webhook auth.
        // Prefer configuring Resend → this URL and set RESEND_WEBHOOK_SECRET.
        if (webhookSecret) {
          const provided =
            request.headers.get('x-webhook-secret') ||
            request.headers.get('authorization')?.replace(/^Bearer\s+/i, '')
          if (provided !== webhookSecret) {
            return Response.json({ error: 'Unauthorized' }, { status: 401 })
          }
        }

        let event: ResendEvent
        try {
          event = await request.json()
        } catch {
          return Response.json({ error: 'Invalid JSON' }, { status: 400 })
        }

        const mapped = event.type ? mapEvent(event.type) : null
        if (!mapped) {
          return Response.json({ ok: true, ignored: true })
        }

        const email = extractEmail(event.data)
        if (!email) {
          return Response.json({ error: 'Missing recipient' }, { status: 400 })
        }

        const messageId =
          event.data?.tags?.find((t) => t.name === 'message_id')?.value ??
          event.data?.email_id ??
          null

        const supabase = createClient(supabaseUrl, supabaseServiceKey)

        const { error: suppressError } = await supabase.from('suppressed_emails').upsert(
          {
            email,
            reason: mapped.reason,
            metadata: { resend_type: event.type, bounce: event.data?.bounce ?? null },
          },
          { onConflict: 'email' },
        )

        if (suppressError) {
          console.error('Failed to upsert suppressed email', { error: suppressError })
          return Response.json({ error: 'Failed to write suppression' }, { status: 500 })
        }

        await supabase.from('email_send_log').insert({
          message_id: messageId,
          template_name: 'system',
          recipient_email: email,
          status: mapped.status,
          error_message:
            mapped.reason === 'bounce'
              ? 'Permanent bounce — email address is invalid or rejected'
              : 'Spam complaint — recipient marked email as spam',
          metadata: { resend_type: event.type },
        })

        return Response.json({ success: true })
      },
    },
  },
})
