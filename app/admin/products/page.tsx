import { Suspense } from 'react'
import { Loader2 } from 'lucide-react'
import { ProductsManager } from '@/components/admin/ProductsManager'

export const metadata = { title: 'Admin Products' }

export default function AdminProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center py-20">
          <Loader2 size={28} className="text-indigo-400 animate-spin" />
        </div>
      }
    >
      <ProductsManager />
    </Suspense>
  )
}
