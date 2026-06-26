'use client'

import { useEffect } from 'react'
import { AlertCircle, RefreshCw } from 'lucide-react'

interface Props {
  error: Error
  reset: () => void
}

export default function Error({ error, reset }: Props) {
  useEffect(() => {
    console.error('Products Page Error:', error)
  }, [error])

  return (
    <div className="card-surface max-w-lg mx-auto p-10 text-center animate-fade-in-up">
      <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-red-50 text-danger mb-5">
        <AlertCircle size={28} />
      </div>

      <h2 className="text-2xl font-bold mb-3">
        Something went wrong
      </h2>

      <p className="text-muted mb-8 leading-relaxed">
        We couldn&apos;t load the products. Please check your connection and try again.
      </p>

      <button onClick={() => reset()} className="btn-primary">
        <RefreshCw size={16} />
        Try Again
      </button>
    </div>
  )
}
