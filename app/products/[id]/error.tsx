'use client'

import Link from 'next/link'
import { AlertCircle, ArrowLeft, RefreshCw } from 'lucide-react'

interface Props {
  error: Error
  reset: () => void
}

export default function Error({ error, reset }: Props) {
  return (
    <div className="card-surface max-w-lg mx-auto p-10 text-center animate-fade-in-up">
      <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-red-50 text-danger mb-5">
        <AlertCircle size={28} />
      </div>

      <h2 className="text-2xl font-bold mb-3">
        Product Not Found
      </h2>

      <p className="text-muted mb-8 leading-relaxed">
        The product you&apos;re looking for may not exist or has been removed.
      </p>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <button onClick={() => reset()} className="btn-secondary">
          <RefreshCw size={16} />
          Retry
        </button>
        <Link href="/products" className="btn-primary">
          <ArrowLeft size={16} />
          Back to Products
        </Link>
      </div>
    </div>
  )
}
