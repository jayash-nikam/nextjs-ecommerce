import Link from 'next/link'
import { BrandLogo } from '@/components/layout/BrandLogo'
import { PRODUCT_CATEGORIES, CATEGORY_META } from '@/lib/constants'
import { BRAND_NAME, BRAND_TAGLINE } from '@/lib/brand'

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="mt-auto site-footer border-t">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4 lg:col-span-1">
            <BrandLogo size="sm" />
            <p className="text-sm footer-muted leading-relaxed max-w-xs">
              {BRAND_TAGLINE}. Curated products for work, gaming, and everyday
              life.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-4 footer-heading">Shop</h3>
            <ul className="space-y-2.5">
              <li>
                <Link href="/products" className="text-sm footer-link">
                  All Products
                </Link>
              </li>
              {PRODUCT_CATEGORIES.map((cat) => (
                <li key={cat}>
                  <Link
                    href={`/products?category=${cat}`}
                    className="text-sm footer-link"
                  >
                    {CATEGORY_META[cat].label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-4 footer-heading">Company</h3>
            <ul className="space-y-2.5">
              <li>
                <Link href="/about" className="text-sm footer-link">
                  About
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm footer-link">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-4 footer-heading">Support</h3>
            <ul className="space-y-2.5 text-sm footer-muted">
              <li>Free delivery on orders ₹50,000+</li>
              <li>7-day easy returns</li>
              <li>Official warranty on all products</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs footer-muted">
          <p>© {year} {BRAND_NAME}. All rights reserved.</p>
          <div className="flex gap-5">
            <Link href="/privacy" className="footer-link">
              Privacy
            </Link>
            <Link href="/terms" className="footer-link">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
