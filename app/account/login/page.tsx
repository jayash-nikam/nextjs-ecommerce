import { Suspense } from 'react'
import { Loader2 } from 'lucide-react'
import { LoginForm } from '@/components/account/LoginForm'

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center py-20">
          <Loader2 size={28} className="text-primary animate-spin" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  )
}
