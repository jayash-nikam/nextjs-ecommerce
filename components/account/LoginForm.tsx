'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { useAuthStore } from '@/store/useAuthStore'
import { AuthCard } from '@/components/account/AccountSidebar'
import { FormField, inputClassName } from '@/components/ui/FormField'
import { FormAlert } from '@/components/ui/FormAlert'
import { BRAND_NAME, DEMO_EMAIL } from '@/lib/brand'
import {
  validateEmail,
  validatePassword,
  type FieldErrors,
} from '@/lib/validation'

interface LoginFields {
  email: string
  password: string
}

export function LoginForm() {
  const router = useRouter()
  const setAuth = useAuthStore((s) => s.setAuth)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<FieldErrors<LoginFields>>({})
  const [serverError, setServerError] = useState('')
  const [loading, setLoading] = useState(false)

  function validate(): boolean {
    const next: FieldErrors<LoginFields> = {
      email: validateEmail(email) ?? undefined,
      password: validatePassword(password) ?? undefined,
    }
    setErrors(next)
    return !next.email && !next.password
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setServerError('')
    if (!validate()) return

    setLoading(true)
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()

      if (!res.ok) {
        setServerError(data.error || 'Login failed')
        return
      }

      setAuth(data.user, data.token)
      router.push('/account')
    } catch {
      setServerError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthCard title="Welcome back" subtitle={`Sign in to your ${BRAND_NAME} account`}>
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        {serverError && <FormAlert>{serverError}</FormAlert>}

        <FormField label="Email" htmlFor="email" error={errors.email} required>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            autoComplete="email"
            className={inputClassName(!!errors.email)}
          />
        </FormField>

        <FormField label="Password" htmlFor="password" error={errors.password} required>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            autoComplete="current-password"
            className={inputClassName(!!errors.password)}
          />
        </FormField>

        <div className="text-right">
          <Link
            href="/account/forgot-password"
            className="text-sm text-primary font-medium hover:underline"
          >
            Forgot password?
          </Link>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full py-3 disabled:opacity-60"
        >
          {loading ? <Loader2 size={18} className="animate-spin" /> : 'Sign In'}
        </button>

        <p className="text-sm text-center text-muted">
          Don&apos;t have an account?{' '}
          <Link href="/account/register" className="text-primary font-medium hover:underline">
            Register
          </Link>
        </p>

        <div className="text-xs text-center text-muted pt-2 border-t border-border">
          Demo: {DEMO_EMAIL} / password123
        </div>
      </form>
    </AuthCard>
  )
}
