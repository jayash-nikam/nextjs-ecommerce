'use client'

import Image from 'next/image'
import { Mail, Phone, Shield } from 'lucide-react'
import { useAuthStore } from '@/store/useAuthStore'
import { getAuthProviderLabel, getUserContact } from '@/lib/user/display'
import { formatPhoneDisplay } from '@/lib/phone'

export function AccountProfile() {
  const user = useAuthStore((s) => s.user)
  if (!user) return null

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Profile</h1>
        <p className="text-muted mt-1">Your account details and sign-in methods</p>
      </header>

      <div className="card-surface p-6 space-y-6">
        <div className="flex items-center gap-4">
          {user.avatarUrl ? (
            <Image
              src={user.avatarUrl}
              alt=""
              width={64}
              height={64}
              className="rounded-2xl object-cover"
            />
          ) : (
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-2xl font-bold">
              {user.name.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <h2 className="text-xl font-semibold">{user.name}</h2>
            <p className="text-sm text-muted">{getUserContact(user)}</p>
            <span className={`auth-method-badge auth-method-badge--${user.authProvider} mt-2`}>
              {getAuthProviderLabel(user.authProvider)}
            </span>
          </div>
        </div>

        <dl className="grid sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-border-subtle border border-border">
            <dt className="text-xs font-semibold uppercase tracking-wider text-muted flex items-center gap-1.5 mb-1">
              <Mail size={14} />
              Email
            </dt>
            <dd className="font-medium">{user.email || 'Not linked'}</dd>
          </div>
          <div className="p-4 rounded-xl bg-border-subtle border border-border">
            <dt className="text-xs font-semibold uppercase tracking-wider text-muted flex items-center gap-1.5 mb-1">
              <Phone size={14} />
              Mobile
            </dt>
            <dd className="font-medium">
              {user.phone ? formatPhoneDisplay(user.phone) : 'Not linked'}
            </dd>
          </div>
        </dl>

        <div className="p-4 rounded-xl border border-border bg-accent-soft/40">
          <div className="flex items-start gap-3">
            <Shield size={18} className="text-primary shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-semibold">Sign-in method</p>
              <p className="text-muted mt-1">
                You signed up with <strong>{getAuthProviderLabel(user.authProvider)}</strong>.
                {user.authProvider === 'email' &&
                  ' You can reset your password from the forgot password page.'}
                {user.authProvider === 'phone' &&
                  ' Use your mobile number and OTP to sign in again.'}
                {user.authProvider === 'google' &&
                  ' Use the Continue with Google button on the login page.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
