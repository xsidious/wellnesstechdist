import * as React from 'react'
import { render } from '@react-email/render'
import { createClient } from '@supabase/supabase-js'
import { createFileRoute } from '@tanstack/react-router'
import { TEMPLATES } from '@/lib/email-templates/registry'

const SITE_NAME = 'wellnesstechdistribution'
const SENDER_DOMAIN = 'notify.wellnesstechdistribution.com'
const FROM_DOMAIN = 'notify.wellnesstechdistribution.com'

function generateToken(): string {
  const bytes = new Uint8Array(32)
  crypto.getRandomValues(bytes)
  return Array.from(bytes).map((b) => b.toString(16).padStart(2, '0')).join('')
}

export const Route = createFileRoute('/api/public/age-confirm')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
        const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
        if (!supabaseUrl || !supabaseServiceKey) {
          return Response.json({ error: 'Server misconfigured' }, { status: 500 })
        }

        let body: Record<string, unknown> = {}
        try { body = await request.json() } catch { /* allow empty */ }

        const template = TEMPLATES['age-confirmation']
        const to = template.to!
        const messageId = crypto.randomUUID()

        const templateData = {
          confirmedAt: new Date().toISOString(),
          email: String(body.email ?? ''),
          userAgent: String(body.userAgent ?? request.headers.get('user-agent') ?? ''),
          referrer: String(body.referrer ?? request.headers.get('referer') ?? ''),
          path: String(body.path ?? ''),
        }

        const supabase = createClient(supabaseUrl, supabaseServiceKey)

        // Ensure an unsubscribe token exists for the recipient (required by queue payload)
        const normalized = to.toLowerCase()
        let unsubscribeToken: string
        const { data: existing } = await supabase
          .from('email_unsubscribe_tokens')
          .select('token')
          .eq('email', normalized)
          .maybeSingle()

        if (existing?.token) {
          unsubscribeToken = existing.token
        } else {
          unsubscribeToken = generateToken()
          await supabase
            .from('email_unsubscribe_tokens')
            .upsert({ token: unsubscribeToken, email: normalized }, { onConflict: 'email', ignoreDuplicates: true })
          const { data: stored } = await supabase
            .from('email_unsubscribe_tokens')
            .select('token')
            .eq('email', normalized)
            .maybeSingle()
          if (stored?.token) unsubscribeToken = stored.token
        }

        const element = React.createElement(template.component, templateData)
        const html = await render(element)
        const text = await render(element, { plainText: true })
        const subject = typeof template.subject === 'function' ? template.subject(templateData) : template.subject

        await supabase.from('email_send_log').insert({
          message_id: messageId,
          template_name: 'age-confirmation',
          recipient_email: to,
          status: 'pending',
        })

        const { error: enqueueError } = await supabase.rpc('enqueue_email', {
          queue_name: 'transactional_emails',
          payload: {
            message_id: messageId,
            to,
            from: `${SITE_NAME} <noreply@${FROM_DOMAIN}>`,
            sender_domain: SENDER_DOMAIN,
            subject,
            html,
            text,
            purpose: 'transactional',
            label: 'age-confirmation',
            idempotency_key: messageId,
            unsubscribe_token: unsubscribeToken,
            queued_at: new Date().toISOString(),
          },
        })

        if (enqueueError) {
          console.error('age-confirm enqueue failed', enqueueError)
          return Response.json({ error: 'enqueue_failed' }, { status: 500 })
        }

        // Kick the queue worker so mail sends without waiting on external cron.
        // Failures are non-fatal — the message remains queued for the next process run.
        if (process.env.RESEND_API_KEY) {
          try {
            const origin = new URL(request.url).origin
            const secret = process.env.EMAIL_QUEUE_SECRET || supabaseServiceKey
            void fetch(`${origin}/api/email/queue/process`, {
              method: 'POST',
              headers: { Authorization: `Bearer ${secret}` },
            }).catch((err) => console.warn('age-confirm queue kick failed', err))
          } catch (err) {
            console.warn('age-confirm queue kick setup failed', err)
          }
        }

        return Response.json({ ok: true })
      },
    },
  },
})