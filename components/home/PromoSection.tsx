import Link from 'next/link'
import { Tag, Truck, ShieldCheck, ArrowRight } from 'lucide-react'

const perks = [
  { icon: Tag, title: 'Best Deals', desc: 'Competitive prices on premium brands' },
  { icon: Truck, title: 'Fast Delivery', desc: 'Free shipping on orders ₹50,000+' },
  { icon: ShieldCheck, title: 'Secure Shopping', desc: 'Official warranty on every product' },
]

export function PromoSection() {
  return (
    <section className="py-14 sm:py-20 border-t border-border">
      <div className="relative rounded-3xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/5" />
        <div className="relative grid lg:grid-cols-2 gap-10 p-8 sm:p-12 lg:p-14 items-center">
          <div>
            <span className="inline-block text-xs font-semibold uppercase tracking-wider text-primary mb-4">
              Limited Time
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-4">
              Upgrade your setup{' '}
              <span className="gradient-text">today</span>
            </h2>
            <p className="text-muted leading-relaxed mb-8 max-w-md">
              Explore our full catalog of 100+ premium tech products. Filter by
              category, price, and rating to find your perfect match.
            </p>
            <Link href="/products" className="btn-primary px-8 py-3.5">
              Explore Catalog
              <ArrowRight size={18} />
            </Link>
          </div>

          <div className="grid sm:grid-cols-3 lg:grid-cols-1 gap-4">
            {perks.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="flex items-start gap-4 p-4 rounded-2xl bg-card/80 border border-border backdrop-blur-sm"
              >
                <div className="p-2.5 rounded-xl bg-accent-soft text-primary shrink-0">
                  <Icon size={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">{title}</h3>
                  <p className="text-xs text-muted mt-0.5">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
