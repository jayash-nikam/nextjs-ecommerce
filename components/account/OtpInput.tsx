'use client'

import { useEffect, useId, useRef, useState } from 'react'
import { FormField, inputClassName } from '@/components/ui/FormField'

interface Props {
  value: string
  onChange: (value: string) => void
  error?: string
  disabled?: boolean
  autoFocus?: boolean
}

const DIGITS = 6

export function OtpInput({
  value,
  onChange,
  error,
  disabled,
  autoFocus,
}: Props) {
  const inputId = useId()
  const errorId = useId()
  const inputRef = useRef<HTMLInputElement>(null)
  const digits = value.padEnd(DIGITS, ' ').slice(0, DIGITS).split('')

  useEffect(() => {
    if (autoFocus) inputRef.current?.focus()
  }, [autoFocus])

  function handleChange(raw: string) {
    const cleaned = raw.replace(/\D/g, '').slice(0, DIGITS)
    onChange(cleaned)
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Backspace' && !value) {
      e.preventDefault()
    }
  }

  return (
    <div className="otp-field">
      <label htmlFor={inputId} className="form-label">
        Verification code
        <span className="form-label__required" aria-hidden="true">
          *
        </span>
        <span className="sr-only"> (required)</span>
      </label>

      <div
        className={`otp-input${error ? ' otp-input--error' : ''}${disabled ? ' otp-input--disabled' : ''}`}
        onClick={() => inputRef.current?.focus()}
      >
        {digits.map((digit, i) => (
          <span
            key={i}
            className={`otp-input__cell${digit.trim() ? ' otp-input__cell--filled' : ''}${value.length === i ? ' otp-input__cell--active' : ''}`}
            aria-hidden="true"
          >
            {digit.trim() || '·'}
          </span>
        ))}
        <input
          ref={inputRef}
          id={inputId}
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          pattern="\d{6}"
          maxLength={DIGITS}
          value={value}
          onChange={(e) => handleChange(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          className="otp-input__hidden"
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
        />
      </div>

      {error && (
        <p id={errorId} className="form-error" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}

export function OtpResendButton({
  onResend,
  loading,
  cooldown = 60,
}: {
  onResend: () => void | Promise<void>
  loading?: boolean
  cooldown?: number
}) {
  const [seconds, setSeconds] = useState(cooldown)

  useEffect(() => {
    if (seconds <= 0) return
    const timer = setTimeout(() => setSeconds((s) => s - 1), 1000)
    return () => clearTimeout(timer)
  }, [seconds])

  async function handleResend() {
    await onResend()
    setSeconds(cooldown)
  }

  return (
    <p className="text-sm text-center text-muted">
      Didn&apos;t receive the code?{' '}
      {seconds > 0 ? (
        <span>Resend in {seconds}s</span>
      ) : (
        <button
          type="button"
          onClick={handleResend}
          disabled={loading}
          className="text-primary font-medium hover:underline disabled:opacity-60"
        >
          {loading ? 'Sending…' : 'Resend code'}
        </button>
      )}
    </p>
  )
}

export function DevOtpHint({ code }: { code?: string }) {
  if (!code) return null
  return (
    <p className="text-xs text-center text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
      Dev mode: your code is <strong className="font-mono">{code}</strong>
    </p>
  )
}
