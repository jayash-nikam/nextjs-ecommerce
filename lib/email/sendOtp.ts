import { BRAND_NAME } from '@/lib/brand'
import type { OtpPurpose } from '@/types/otp'

const PURPOSE_COPY: Record<OtpPurpose, { subject: string; intro: string }> = {
  register: {
    subject: `Verify your ${BRAND_NAME} account`,
    intro: 'Use this code to complete your registration:',
  },
  reset: {
    subject: `Reset your ${BRAND_NAME} password`,
    intro: 'Use this code to reset your password:',
  },
  phone_login: {
    subject: `Sign in to ${BRAND_NAME}`,
    intro: 'Use this code to sign in:',
  },
}

export async function sendOtpEmail(
  to: string,
  code: string,
  purpose: OtpPurpose,
): Promise<void> {
  const { subject, intro } = PURPOSE_COPY[purpose]
  const body = `${intro}\n\n${code}\n\nThis code expires in 10 minutes. If you didn't request this, you can ignore this email.`

  // Demo / dev: log to server console. Swap for Resend/SendGrid in production.
  console.log(`[${BRAND_NAME} OTP] ${subject}`)
  console.log(`  To: ${to}`)
  console.log(`  Code: ${code}`)
  console.log(`  Body:\n${body}`)

  if (process.env.RESEND_API_KEY) {
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: process.env.EMAIL_FROM || `noreply@novacart.com`,
        to,
        subject,
        text: body,
      }),
    })
  }
}
