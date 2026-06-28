'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { useAuthStore } from '@/store/useAuthStore'
import { FormField, inputClassName } from '@/components/ui/FormField'
import { FormAlert } from '@/components/ui/FormAlert'
import { DevOtpHint, OtpInput, OtpResendButton } from '@/components/account/OtpInput'
import { validateName, validatePhone, validateOtp } from '@/lib/validation'
import { formatPhoneDisplay } from '@/lib/phone'

type Step = 'phone' | 'verify'

export function PhoneLoginForm() {
  const router = useRouter()
  const setUser = useAuthStore((s) => s.setUser)
  const [step, setStep] = useState<Step>('phone')
  const [phone, setPhone] = useState('')
  const [name, setName] = useState('')
  const [otp, setOtp] = useState('')
  const [isNewUser, setIsNewUser] = useState(false)
  const [phoneError, setPhoneError] = useState('')
  const [nameError, setNameError] = useState('')
  const [otpError, setOtpError] = useState('')
  const [serverError, setServerError] = useState('')
  const [loading, setLoading] = useState(false)
  const [devOtp, setDevOtp] = useState('')

  async function sendOtp() {
    setServerError('')
    const err = validatePhone(phone)
    setPhoneError(err ?? '')
    if (err) return

    setLoading(true)
    try {
      const res = await fetch('/api/auth/phone/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      })
      const data = await res.json()

      if (!res.ok) {
        setServerError(data.error || 'Failed to send code')
        return
      }

      setIsNewUser(Boolean(data.isNewUser))
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

  async function handlePhoneSubmit(e: React.FormEvent) {
    e.preventDefault()
    await sendOtp()
  }

  async function handleVerifySubmit(e: React.FormEvent) {
    e.preventDefault()
    setServerError('')

    const otpErr = validateOtp(otp)
    setOtpError(otpErr ?? '')
    if (otpErr) return

    if (isNewUser) {
      const nErr = validateName(name)
      setNameError(nErr ?? '')
      if (nErr) return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/auth/phone/verify', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone,
          otp,
          ...(isNewUser ? { name } : {}),
        }),
      })
      const data = await res.json()

      if (!res.ok) {
        if (data.needsName) {
          setIsNewUser(true)
          setNameError(data.error || 'Name is required')
          return
        }
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
      <form onSubmit={handleVerifySubmit} noValidate className="space-y-4">
        <button
          type="button"
          onClick={() => setStep('phone')}
          className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-primary transition-colors"
        >
          <ArrowLeft size={16} />
          Change number
        </button>

        <p className="text-sm text-muted">
          Code sent to <strong className="text-foreground">{formatPhoneDisplay(phone)}</strong>
        </p>

        {serverError && <FormAlert>{serverError}</FormAlert>}
        <DevOtpHint code={devOtp} />

        <OtpInput
          value={otp}
          onChange={setOtp}
          error={otpError}
          disabled={loading}
          autoFocus
        />

        {isNewUser && (
          <FormField label="Your name" htmlFor="phone-name" error={nameError} required>
            <input
              id="phone-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full name"
              autoComplete="name"
              className={inputClassName(!!nameError)}
            />
          </FormField>
        )}

        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full py-3 disabled:opacity-60"
        >
          {loading ? <Loader2 size={18} className="animate-spin" /> : 'Verify & Sign In'}
        </button>

        <OtpResendButton onResend={sendOtp} loading={loading} />
      </form>
    )
  }

  return (
    <form onSubmit={handlePhoneSubmit} noValidate className="space-y-4">
      {serverError && <FormAlert>{serverError}</FormAlert>}

      <FormField label="Mobile number" htmlFor="login-phone" error={phoneError} required>
        <div className="flex">
          <span className="inline-flex items-center px-3 rounded-l-xl border border-r-0 border-border bg-border-subtle text-sm text-muted">
            +91
          </span>
          <input
            id="login-phone"
            type="tel"
            inputMode="numeric"
            value={phone}
            onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
            placeholder="9876543210"
            autoComplete="tel"
            className={`${inputClassName(!!phoneError)} rounded-l-none`}
          />
        </div>
      </FormField>

      <button
        type="submit"
        disabled={loading}
        className="btn-primary w-full py-3 disabled:opacity-60"
      >
        {loading ? <Loader2 size={18} className="animate-spin" /> : 'Send OTP'}
      </button>

      <p className="text-xs text-center text-muted">
        We&apos;ll send a 6-digit code to verify your number.
      </p>
    </form>
  )
}
