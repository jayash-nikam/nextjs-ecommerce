import { BRAND_NAME } from '@/lib/brand'
import { formatPhoneDisplay } from '@/lib/phone'

export async function sendOtpSms(phone: string, code: string): Promise<void> {
  const display = formatPhoneDisplay(phone)
  const body = `Your ${BRAND_NAME} verification code is ${code}. Valid for 10 minutes.`

  console.log(`[${BRAND_NAME} SMS OTP]`)
  console.log(`  To: ${display}`)
  console.log(`  Code: ${code}`)
  console.log(`  Body: ${body}`)

  // Hook for Twilio / MSG91 in production.
  if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
    const to = `+91${phone}`
    await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${process.env.TWILIO_ACCOUNT_SID}/Messages.json`,
      {
        method: 'POST',
        headers: {
          Authorization: `Basic ${Buffer.from(
            `${process.env.TWILIO_ACCOUNT_SID}:${process.env.TWILIO_AUTH_TOKEN}`,
          ).toString('base64')}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          To: to,
          From: process.env.TWILIO_FROM_NUMBER || '',
          Body: body,
        }),
      },
    )
  }
}
