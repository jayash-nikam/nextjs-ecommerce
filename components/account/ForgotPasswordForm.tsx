'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, CheckCircle2, Loader2, Mail } from 'lucide-react'
import { AuthCard } from '@/components/account/AccountSidebar'
import { DevOtpHint, OtpInput, OtpResendButton } from '@/components/account/OtpInput'
import { FormField, inputClassName } from '@/components/ui/FormField'
import { FormAlert } from '@/components/ui/FormAlert'
import { BRAND_NAME } from '@/lib/brand'
import {
  validateEmail,
  validatePassword,
  validateConfirmPassword,
  validateOtp,
} from '@/lib/validation'

type Step = 'email' | 'reset' | 'done'

export function ForgotPasswordForm() {
  const router = useRouter()
  const [step, setStep] = useState<Step>('email')
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [emailError, setEmailError] = useState('')
  const [otpError, setOtpError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [confirmError, setConfirmError] = useState('')
  const [serverError, setServerError] = useState('')
  const [loading, setLoading] = useState(false)
  const [devOtp, setDevOtp] = useState('')

  async function requestOtp(): Promise<void> {
    setServerError('')
    const err = validateEmail(email)
    setEmailError(err ?? '')
    if (err) return

    setLoading(true)
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()

      if (!res.ok) {
        setServerError(data.error || 'Failed to send verification code')
        return
      }

      setDevOtp(data.devOtp || '')
      setStep('reset')
      setOtp('')
      setOtpError('')
    } catch {
      setServerError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  async function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault()
    await requestOtp()
  }

  async function handleResetSubmit(e: React.FormEvent) {
    e.preventDefault()
    setServerError('')

    const otpErr = validateOtp(otp)
    const passErr = validatePassword(password)
    const confirmErr = validateConfirmPassword(password, confirm)

    setOtpError(otpErr ?? '')
    setPasswordError(passErr ?? '')
    setConfirmError(confirmErr ?? '')

    if (otpErr || passErr || confirmErr) return

    setLoading(true)
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp, password }),
      })
      const data = await res.json()

      if (!res.ok) {
        if (data.error?.toLowerCase().includes('code')) {
          setOtpError(data.error)
        } else {
          setServerError(data.error || 'Failed to reset password')
        }
        return
      }

      setStep('done')
    } catch {
      setServerError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (step === 'done') {
    return (
      <AuthCard title="Password updated" subtitle="You can now sign in with your new password">
        <div className="space-y-5 text-center">
          <div className="flex justify-center">
            <div className="w-14 h-14 rounded-full bg-emerald-500/10 flex items-center justify-center">
              <CheckCircle2 size={28} className="text-emerald-500" aria-hidden="true" />
            </div>
          </div>
          <button
            type="button"
            onClick={() => router.push('/account/login')}
            className="btn-primary w-full py-3"
          >
            Back to Sign In
          </button>
        </div>
      </AuthCard>
    )
  }

  if (step === 'reset') {
    return (
      <AuthCard
        title="Reset password"
        subtitle={`Enter the code sent to ${email}`}
      >
        <form onSubmit={handleResetSubmit} noValidate className="space-y-4">
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

          <FormField label="New Password" htmlFor="new-password" error={passwordError} required hint="At least 6 characters">
            <input
              id="new-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="new-password"
              className={inputClassName(!!passwordError)}
            />
          </FormField>

          <FormField label="Confirm Password" htmlFor="reset-confirm" error={confirmError} required>
            <input
              id="reset-confirm"
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="Repeat password"
              autoComplete="new-password"
              className={inputClassName(!!confirmError)}
            />
          </FormField>

          <button
            type="submit"
            disabled={loading || otp.length < 6}
            className="btn-primary w-full py-3 disabled:opacity-60"
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : 'Update Password'}
          </button>

          <OtpResendButton onResend={requestOtp} loading={loading} />

          <button
            type="button"
            onClick={() => {
              setStep('email')
              setServerError('')
              setOtpError('')
            }}
            className="flex items-center justify-center gap-1.5 w-full text-sm text-muted hover:text-foreground transition-colors"
          >
            <ArrowLeft size={14} aria-hidden="true" />
            Use a different email
          </button>
        </form>
      </AuthCard>
    )
  }

  return (
    <AuthCard
      title="Forgot password?"
      subtitle={`We'll email you a verification code to reset your ${BRAND_NAME} password`}
    >
      <form onSubmit={handleEmailSubmit} noValidate className="space-y-4">
        {serverError && <FormAlert>{serverError}</FormAlert>}

        <FormField label="Email" htmlFor="forgot-email" error={emailError} required>
          <input
            id="forgot-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            autoComplete="email"
            className={inputClassName(!!emailError)}
          />
        </FormField>

        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full py-3 disabled:opacity-60"
        >
          {loading ? <Loader2 size={18} className="animate-spin" /> : 'Send Verification Code'}
        </button>

        <p className="text-sm text-center text-muted">
          Remember your password?{' '}
          <Link href="/account/login" className="text-primary font-medium hover:underline">
            Sign in
          </Link>
        </p>
      </form>
    </AuthCard>
  )
}
