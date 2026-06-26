import { StaticPageLayout } from '@/components/layout/StaticPageLayout'
import { BRAND_NAME, PRIVACY_EMAIL } from '@/lib/brand'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: `${BRAND_NAME} privacy policy.`,
}

export default function PrivacyPage() {
  return (
    <StaticPageLayout title="Privacy Policy">
      <p>
        We respect your privacy. {BRAND_NAME} collects only the information needed
        to provide our shopping experience — such as cart items stored locally
        in your browser and anonymous usage data to improve the platform.
      </p>
      <p>
        We do not sell your personal information to third parties. Payment and
        checkout data will be handled securely when those features are enabled.
      </p>
      <p>
        For questions about this policy, contact us at{' '}
        <a href={`mailto:${PRIVACY_EMAIL}`} className="text-primary hover:underline">
          {PRIVACY_EMAIL}
        </a>
        .
      </p>
    </StaticPageLayout>
  )
}
