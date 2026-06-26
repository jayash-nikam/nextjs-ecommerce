import { StaticPageLayout } from '@/components/layout/StaticPageLayout'
import { ContactForm } from '@/components/contact/ContactForm'
import { BRAND_NAME, SUPPORT_EMAIL } from '@/lib/brand'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact',
  description: `Get in touch with ${BRAND_NAME} support.`,
}

export default function ContactPage() {
  return (
    <StaticPageLayout
      title="Contact Us"
      description="We'd love to hear from you."
    >
      <p>
        Have a question about an order, product, or your account? Reach out and
        our team will get back to you within 1–2 business days.
      </p>

      <ContactForm />

      <ul className="space-y-2 not-prose mt-8">
        <li>
          <strong>Email:</strong>{' '}
          <a href={`mailto:${SUPPORT_EMAIL}`} className="text-primary hover:underline">
            {SUPPORT_EMAIL}
          </a>
        </li>
        <li>
          <strong>Phone:</strong> +91 1800-123-4567
        </li>
        <li>
          <strong>Hours:</strong> Mon–Sat, 9 AM – 6 PM IST
        </li>
      </ul>
    </StaticPageLayout>
  )
}
