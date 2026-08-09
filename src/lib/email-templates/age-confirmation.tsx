import React from 'react'
import { Body, Container, Head, Heading, Html, Preview, Text, Section, Hr } from '@react-email/components'
import type { TemplateEntry } from './registry'

interface Props {
  confirmedAt?: string
  email?: string
  userAgent?: string
  referrer?: string
  path?: string
}

const Email = ({ confirmedAt, email, userAgent, referrer, path }: Props) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>Age confirmation (21+) received on wellnesstechdistribution.com</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Age Confirmation Received</Heading>
        <Text style={text}>
          A visitor confirmed they are 21+ years of age and agreed to the site
          Terms &amp; Conditions, Chargeback &amp; Dispute Policy, and Research
          Use Only Policy on wellnesstechdistribution.com.
        </Text>
        <Hr style={hr} />
        <Section>
          <Text style={label}>Email</Text>
          <Text style={value}>{email || 'Not provided'}</Text>
          <Text style={label}>Confirmed at</Text>
          <Text style={value}>{confirmedAt || 'Unknown'}</Text>
          <Text style={label}>Page</Text>
          <Text style={value}>{path || 'Unknown'}</Text>
          <Text style={label}>Referrer</Text>
          <Text style={value}>{referrer || 'Direct'}</Text>
          <Text style={label}>User agent</Text>
          <Text style={value}>{userAgent || 'Unknown'}</Text>
        </Section>
        <Hr style={hr} />
        <Text style={footer}>
          This is an automated notification from Wellness Tech Bio Distribution.
        </Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: Email,
  subject: 'Age confirmation (21+) — wellnesstechdistribution.com',
  displayName: 'Age Gate Confirmation',
  to: 'contact@keepingitallnatural.com',
  previewData: {
    confirmedAt: new Date().toISOString(),
    email: 'visitor@example.com',
    userAgent: 'Mozilla/5.0',
    referrer: 'https://google.com',
    path: '/',
  },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: 'Arial, sans-serif' }
const container = { padding: '24px', maxWidth: '560px' }
const h1 = { color: '#0f172a', fontSize: '22px', margin: '0 0 12px' }
const text = { color: '#334155', fontSize: '14px', lineHeight: '22px' }
const label = { color: '#64748b', fontSize: '12px', textTransform: 'uppercase' as const, margin: '10px 0 2px', letterSpacing: '0.06em' }
const value = { color: '#0f172a', fontSize: '14px', margin: '0', wordBreak: 'break-word' as const }
const hr = { borderColor: '#e2e8f0', margin: '18px 0' }
const footer = { color: '#94a3b8', fontSize: '12px' }