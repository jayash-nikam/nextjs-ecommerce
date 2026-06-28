import Link from 'next/link'
import { BrandLogo } from '@/components/layout/BrandLogo'
import { FooterAccordion } from '@/components/layout/FooterAccordion'
import { PRODUCT_CATEGORIES, CATEGORY_META } from '@/lib/constants'
import { cmsPagesByGroup } from '@/lib/cms/content'
import { BRAND_NAME, BRAND_TAGLINE } from '@/lib/brand'

export function Footer() {
  const year = new Date().getFullYear()
  const companyLinks = cmsPagesByGroup('company')
  const supportLinks = cmsPagesByGroup('support')
  const legalLinks = cmsPagesByGroup('legal')

  const shopLinks = [
    { href: '/products', label: 'All Products' },
    ...PRODUCT_CATEGORIES.map((cat) => ({
      href: `/products?category=${cat}`,
      label: CATEGORY_META[cat].label,
    })),
  ]

  return (
    <footer className="mt-auto site-footer border-t">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-10 sm:py-14">
        <div className="grid gap-8 lg:gap-10 lg:grid-cols-4">
          <div className="space-y-4 lg:col-span-1 pb-2 lg:pb-0">
            <BrandLogo size="sm" />
            <p className="text-sm footer-muted leading-relaxed max-w-xs">
              {BRAND_TAGLINE}. Curated products for work, gaming, and everyday
              life.
            </p>
            <div className="flex flex-wrap gap-2 pt-1 lg:hidden text-xs footer-muted">
              <span className="px-2.5 py-1 rounded-full border border-white/15">Free shipping</span>
              <span className="px-2.5 py-1 rounded-full border border-white/15">30-day returns</span>
            </div>
          </div>

          <div className="lg:contents divide-y lg:divide-y-0 divide-white/10">
            <FooterAccordion
              title="Shop"
              links={shopLinks}
              defaultOpen
            />
            <FooterAccordion
              title="Company"
              links={companyLinks.map((p) => ({ href: p.href, label: p.navLabel }))}
            />
            <FooterAccordion
              title="Support"
              links={[
                ...supportLinks.map((p) => ({ href: p.href, label: p.navLabel })),
              ]}
            />
          </div>
        </div>

        <div className="mt-8 sm:mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs footer-muted">
          <p>© {year} {BRAND_NAME}. All rights reserved.</p>
          <div className="flex flex-wrap justify-center gap-x-5 gap-y-2">
            {legalLinks.map((page) => (
              <Link key={page.slug} href={page.href} className="footer-link">
                {page.navLabel}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
