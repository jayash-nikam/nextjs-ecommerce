'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { useAuthStore } from '@/store/useAuthStore'
import { AuthCard } from '@/components/account/AccountSidebar'
import { FormField, inputClassName } from '@/components/ui/FormField'
import { FormAlert } from '@/components/ui/FormAlert'
import { AuthDivider } from '@/components/account/AuthDivider'
import { GoogleSignInButton } from '@/components/account/GoogleSignInButton'
import { PhoneLoginForm } from '@/components/account/PhoneLoginForm'
import { BRAND_NAME, DEMO_EMAIL } from '@/lib/brand'
import {
  validateEmail,
  validatePassword,
  type FieldErrors,
} from '@/lib/validation'

type LoginTab = 'email' | 'phone'

interface LoginFields {
  email: string
  password: string
}

const GOOGLE_ERRORS: Record<string, string> = {
  google_denied: 'Google sign-in was cancelled.',
  google_invalid: 'Google sign-in failed. Please try again.',
  google_unverified: 'Your Google email is not verified.',
  google_failed: 'Google sign-in failed. Please try again.',
  google_not_configured: 'Google sign-in is not configured on this server.',
}

export function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const setUser = useAuthStore((s) => s.setUser)
  const [tab, setTab] = useState<LoginTab>('email')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<FieldErrors<LoginFields>>({})
  const [serverError, setServerError] = useState('')
  const [loading, setLoading] = useState(false)
  const [googleEnabled, setGoogleEnabled] = useState(false)

  useEffect(() => {
    const errorKey = searchParams.get('error')
    if (errorKey && GOOGLE_ERRORS[errorKey]) {
      setServerError(GOOGLE_ERRORS[errorKey])
    }
  }, [searchParams])

  useEffect(() => {
    fetch('/api/auth/google/status')
      .then((res) => res.json())
      .then((data) => setGoogleEnabled(Boolean(data.enabled)))
      .catch(() => setGoogleEnabled(false))
  }, [])

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
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()

      if (!res.ok) {
        setServerError(data.error || 'Login failed')
        return
      }

      setUser(data.user)
      router.push('/account')
    } catch {
      setServerError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthCard title="Welcome back" subtitle={`Sign in to your ${BRAND_NAME} account`}>
      <div className="space-y-5">
        <GoogleSignInButton
          disabled={!googleEnabled}
          hint={
            googleEnabled
              ? undefined
              : 'Add GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET to enable.'
          }
        />

        <AuthDivider />

        <div className="auth-tabs" role="tablist" aria-label="Sign in method">
          <button
            type="button"
            role="tab"
            aria-selected={tab === 'email'}
            className={`auth-tabs__btn${tab === 'email' ? ' auth-tabs__btn--active' : ''}`}
            onClick={() => setTab('email')}
          >
            Email
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={tab === 'phone'}
            className={`auth-tabs__btn${tab === 'phone' ? ' auth-tabs__btn--active' : ''}`}
            onClick={() => setTab('phone')}
          >
            Mobile OTP
          </button>
        </div>

        {serverError && <FormAlert>{serverError}</FormAlert>}

        {tab === 'email' ? (
          <form onSubmit={handleSubmit} noValidate className="space-y-4">
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

            <div className="text-xs text-center text-muted pt-2 border-t border-border">
              Demo: {DEMO_EMAIL} / password123
            </div>
          </form>
        ) : (
          <PhoneLoginForm />
        )}

        <p className="text-sm text-center text-muted">
          Don&apos;t have an account?{' '}
          <Link href="/account/register" className="text-primary font-medium hover:underline">
            Register
          </Link>
        </p>
      </div>
    </AuthCard>
  )
}
