import { Truck, Shield, RotateCcw, CreditCard } from 'lucide-react'

const items = [
  { icon: Truck, title: 'Free Delivery', desc: 'On all orders' },
  { icon: Shield, title: 'Official Warranty', desc: 'Manufacturer backed' },
  { icon: RotateCcw, title: '30-Day Returns', desc: 'Hassle-free policy' },
  { icon: CreditCard, title: 'Secure Checkout', desc: 'Encrypted payments' },
]

export function ProductTrustBar() {
  return (
    <div className="trust-bar">
      {items.map(({ icon: Icon, title, desc }) => (
        <div
          key={title}
          className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-br from-accent-soft/80 to-border-subtle/60 border border-border/60"
        >
          <div className="w-10 h-10 rounded-xl bg-card flex items-center justify-center shrink-0 shadow-sm">
            <Icon size={18} className="text-primary" />
          </div>
          <div>
            <p className="text-xs sm:text-sm font-bold">{title}</p>
            <p className="text-[0.6875rem] sm:text-xs text-muted mt-0.5">{desc}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
