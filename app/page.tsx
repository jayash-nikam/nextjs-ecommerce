import { Suspense } from 'react'
import { HeroBanner } from '@/components/home/HeroBanner'
import { CategoryShowcase } from '@/components/home/CategoryShowcase'
import { FeaturedProducts } from '@/components/home/FeaturedProducts'
import { PromoSection } from '@/components/home/PromoSection'

function FeaturedSkeleton() {
  return (
    <section className="py-14 sm:py-20 border-t border-border">
      <div className="skeleton h-8 w-48 mb-8 rounded-lg" />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="card-surface overflow-hidden">
            <div className="skeleton h-56 rounded-none" />
            <div className="p-5 space-y-3">
              <div className="skeleton h-4 w-3/4 rounded" />
              <div className="skeleton h-6 w-1/2 rounded" />
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default function Home() {
  return (
    <div className="animate-fade-in-up page-full-bleed">
      <HeroBanner />

      <div className="page-inset">
        <CategoryShowcase />

        <Suspense fallback={<FeaturedSkeleton />}>
          <FeaturedProducts />
        </Suspense>

        <PromoSection />
      </div>
    </div>
  )
}
