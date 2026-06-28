'use client'

export function AuthDivider({ label = 'or' }: { label?: string }) {
  return (
    <div className="auth-divider" role="separator">
      <span>{label}</span>
    </div>
  )
}
