import { AddressesManager } from '@/components/account/AddressesManager'

export default function AddressesPage() {
  return (
    <div>
      <header className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
          My <span className="gradient-text">Addresses</span>
        </h1>
        <p className="text-muted mt-1">Manage your delivery locations</p>
      </header>
      <AddressesManager />
    </div>
  )
}
