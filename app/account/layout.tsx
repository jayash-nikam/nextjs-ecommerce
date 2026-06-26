import { AccountLayoutShell } from '@/components/account/AccountLayoutShell'

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <AccountLayoutShell>{children}</AccountLayoutShell>
}
