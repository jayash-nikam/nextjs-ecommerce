'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Shield } from 'lucide-react'
import { useAdminStore } from '@/store/useAdminStore'
import { FormField, inputClassName } from '@/components/ui/FormField'
import { FormAlert } from '@/components/ui/FormAlert'
import {
  validateEmail,
  validatePassword,
  type FieldErrors,
} from '@/lib/validation'
import { BRAND_NAME } from '@/lib/brand'

interface LoginFields {
  email: string
  password: string
}

export function AdminLoginForm() {
  const router = useRouter()
  const setAuth = useAdminStore((s) => s.setAuth)
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
      const res = await fetch('/api/admin/login', {
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
      router.push('/admin')
    } catch {
      setServerError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-500 mb-4">
            <Shield size={28} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">{BRAND_NAME} Admin</h1>
          <p className="text-slate-400 text-sm mt-1">Sign in to manage your store</p>
        </div>

        <form
          onSubmit={handleSubmit}
          noValidate
          className="bg-slate-900 border border-white/10 rounded-2xl p-6 space-y-4"
        >
          {serverError && <FormAlert variant="dark">{serverError}</FormAlert>}

          <FormField label="Email" htmlFor="admin-email" error={errors.email} required theme="dark">
            <input
              id="admin-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`${inputClassName(!!errors.email)} bg-slate-800 border-white/10 text-white`}
              placeholder="admin@novacart.com"
            />
          </FormField>

          <FormField label="Password" htmlFor="admin-password" error={errors.password} required theme="dark">
            <input
              id="admin-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`${inputClassName(!!errors.password)} bg-slate-800 border-white/10 text-white`}
              placeholder="••••••••"
            />
          </FormField>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-indigo-500 to-violet-500 hover:opacity-90 disabled:opacity-60 transition-opacity"
          >
            {loading ? <Loader2 size={18} className="animate-spin mx-auto" /> : 'Sign In'}
          </button>

          <p className="text-xs text-center text-slate-500 pt-2">
            Demo: admin@novacart.com / admin123
          </p>
        </form>
      </div>
    </div>
  )
}
