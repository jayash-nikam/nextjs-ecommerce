'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Loader2, Mail } from 'lucide-react'
import { useAuthStore } from '@/store/useAuthStore'
import { AuthCard } from '@/components/account/AccountSidebar'
import { DevOtpHint, OtpInput, OtpResendButton } from '@/components/account/OtpInput'
import { FormField, inputClassName } from '@/components/ui/FormField'
import { FormAlert } from '@/components/ui/FormAlert'
import { BRAND_NAME } from '@/lib/brand'
import {
  validateEmail,
  validatePassword,
  validateName,
  validateConfirmPassword,
  validateOtp,
  type FieldErrors,
} from '@/lib/validation'

interface RegisterFields {
  name: string
  email: string
  password: string
  confirm: string
}

type Step = 'details' | 'verify'

export function RegisterForm() {
  const router = useRouter()
  const setUser = useAuthStore((s) => s.setUser)
  const [step, setStep] = useState<Step>('details')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [otp, setOtp] = useState('')
  const [errors, setErrors] = useState<FieldErrors<RegisterFields>>({})
  const [otpError, setOtpError] = useState('')
  const [serverError, setServerError] = useState('')
  const [loading, setLoading] = useState(false)
  const [devOtp, setDevOtp] = useState('')

  function validateDetails(): boolean {
    const next: FieldErrors<RegisterFields> = {
      name: validateName(name) ?? undefined,
      email: validateEmail(email) ?? undefined,
      password: validatePassword(password) ?? undefined,
      confirm: validateConfirmPassword(password, confirm) ?? undefined,
    }
    setErrors(next)
    return !Object.values(next).some(Boolean)
  }

  async function sendOtp(): Promise<void> {
    setServerError('')
    setLoading(true)
    try {
      const res = await fetch('/api/auth/register/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      })
      const data = await res.json()

      if (!res.ok) {
        setServerError(data.error || 'Failed to send verification code')
        return
      }

      setDevOtp(data.devOtp || '')
      setStep('verify')
      setOtp('')
      setOtpError('')
    } catch {
      setServerError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  async function handleDetailsSubmit(e: React.FormEvent) {
    e.preventDefault()
    setServerError('')
    if (!validateDetails()) return
    await sendOtp()
  }

  async function handleVerifySubmit(e: React.FormEvent) {
    e.preventDefault()
    setServerError('')
    const otpErr = validateOtp(otp)
    setOtpError(otpErr ?? '')
    if (otpErr) return

    setLoading(true)
    try {
      const res = await fetch('/api/auth/register/verify', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      })
      const data = await res.json()

      if (!res.ok) {
        setOtpError(data.error || 'Verification failed')
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

  if (step === 'verify') {
    return (
      <AuthCard
        title="Verify your email"
        subtitle={`We sent a 6-digit code to ${email}`}
      >
        <form onSubmit={handleVerifySubmit} noValidate className="space-y-5">
          {serverError && <FormAlert>{serverError}</FormAlert>}

          <div className="flex justify-center">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Mail size={22} className="text-primary" aria-hidden="true" />
            </div>
          </div>

          <OtpInput
            value={otp}
            onChange={setOtp}
            error={otpError}
            disabled={loading}
            autoFocus
          />

          <DevOtpHint code={devOtp} />

          <button
            type="submit"
            disabled={loading || otp.length < 6}
            className="btn-primary w-full py-3 disabled:opacity-60"
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : 'Verify & Create Account'}
          </button>

          <OtpResendButton onResend={sendOtp} loading={loading} />

          <button
            type="button"
            onClick={() => {
              setStep('details')
              setServerError('')
              setOtpError('')
            }}
            className="flex items-center justify-center gap-1.5 w-full text-sm text-muted hover:text-foreground transition-colors"
          >
            <ArrowLeft size={14} aria-hidden="true" />
            Back to details
          </button>
        </form>
      </AuthCard>
    )
  }

  return (
    <AuthCard title="Create account" subtitle={`Join ${BRAND_NAME} today`}>
      <form onSubmit={handleDetailsSubmit} noValidate className="space-y-4">
        {serverError && <FormAlert>{serverError}</FormAlert>}

        <FormField label="Full Name" htmlFor="name" error={errors.name} required>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="John Doe"
            autoComplete="name"
            className={inputClassName(!!errors.name)}
          />
        </FormField>

        <FormField label="Email" htmlFor="reg-email" error={errors.email} required>
          <input
            id="reg-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            autoComplete="email"
            className={inputClassName(!!errors.email)}
          />
        </FormField>

        <FormField label="Password" htmlFor="reg-password" error={errors.password} required hint="At least 6 characters">
          <input
            id="reg-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            autoComplete="new-password"
            className={inputClassName(!!errors.password)}
          />
        </FormField>

        <FormField label="Confirm Password" htmlFor="confirm" error={errors.confirm} required>
          <input
            id="confirm"
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder="Repeat password"
            autoComplete="new-password"
            className={inputClassName(!!errors.confirm)}
          />
        </FormField>

        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full py-3 disabled:opacity-60"
        >
          {loading ? <Loader2 size={18} className="animate-spin" /> : 'Continue'}
        </button>

        <p className="text-sm text-center text-muted">
          Already have an account?{' '}
          <Link href="/account/login" className="text-primary font-medium hover:underline">
            Sign in
          </Link>
        </p>
      </form>
    </AuthCard>
  )
}
