import { AlertCircle } from 'lucide-react'

interface Props {
  children: React.ReactNode
  variant?: 'light' | 'dark'
}

export function FormAlert({ children, variant = 'light' }: Props) {
  return (
    <div
      className={`form-alert${variant === 'dark' ? ' form-alert--dark' : ''}`}
      role="alert"
      aria-live="assertive"
    >
      <AlertCircle size={18} className="shrink-0 mt-0.5" aria-hidden="true" />
      <span>{children}</span>
    </div>
  )
}
