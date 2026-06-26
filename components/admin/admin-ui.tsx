import type { OrderStatus } from '@/types/order'

const STATUS_STYLES: Record<OrderStatus, string> = {
  pending: 'bg-slate-500/20 text-slate-300 border-slate-500/30',
  processing: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  shipped: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
  delivered: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  cancelled: 'bg-red-500/20 text-red-300 border-red-500/30',
}

export function OrderStatusBadge({ status }: { status: OrderStatus | string }) {
  const key = status as OrderStatus
  return (
    <span
      className={`inline-flex items-center text-xs font-semibold px-2.5 py-0.5 rounded-full border capitalize ${STATUS_STYLES[key] ?? STATUS_STYLES.pending}`}
    >
      {status}
    </span>
  )
}

export function RoleBadge({ role }: { role: 'admin' | 'user' }) {
  return (
    <span
      className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
        role === 'admin'
          ? 'bg-indigo-500/20 text-indigo-300'
          : 'bg-slate-700 text-slate-400'
      }`}
    >
      {role}
    </span>
  )
}

export function AdminPanel({
  title,
  children,
  className = '',
}: {
  title?: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={`bg-slate-800/50 border border-white/10 rounded-2xl overflow-hidden ${className}`}
    >
      {title && (
        <div className="px-5 py-4 border-b border-white/10">
          <h3 className="font-semibold text-white text-sm">{title}</h3>
        </div>
      )}
      {children}
    </div>
  )
}

export function AdminStatCard({
  label,
  value,
  sub,
  icon: Icon,
  href,
  accent = 'indigo',
}: {
  label: string
  value: string | number
  sub?: string
  icon: React.ComponentType<{ size?: number; className?: string }>
  href?: string
  accent?: 'indigo' | 'emerald' | 'amber' | 'violet'
}) {
  const accents = {
    indigo: 'text-indigo-400',
    emerald: 'text-emerald-400',
    amber: 'text-amber-400',
    violet: 'text-violet-400',
  }

  const inner = (
    <>
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className={`p-2 rounded-xl bg-white/5 ${accents[accent]}`}>
          <Icon size={18} />
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-white">{value}</p>
          {sub && <p className="text-xs text-slate-500 mt-0.5">{sub}</p>}
        </div>
      </div>
      <p className="text-sm text-slate-400">{label}</p>
    </>
  )

  const className =
    'block bg-slate-800/50 border border-white/10 rounded-2xl p-5 hover:border-indigo-500/30 transition-colors'

  if (href) {
    return (
      <a href={href} className={className}>
        {inner}
      </a>
    )
  }

  return <div className={className}>{inner}</div>
}

export function AdminSearchInput({
  value,
  onChange,
  placeholder,
}: {
  value: string
  onChange: (v: string) => void
  placeholder?: string
}) {
  return (
    <input
      type="search"
      placeholder={placeholder ?? 'Search…'}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full max-w-md px-4 py-2.5 rounded-xl bg-slate-800 border border-white/10 text-white text-sm outline-none focus:ring-2 focus:ring-indigo-500/30 placeholder:text-slate-500"
    />
  )
}

export function AdminSelect({
  value,
  onChange,
  options,
  className = '',
}: {
  value: string
  onChange: (v: string) => void
  options: { value: string; label: string }[]
  className?: string
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`px-3 py-2 rounded-xl bg-slate-800 border border-white/10 text-sm text-white outline-none focus:ring-2 focus:ring-indigo-500/30 ${className}`}
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  )
}
