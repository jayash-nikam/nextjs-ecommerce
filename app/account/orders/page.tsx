import { OrdersList } from '@/components/account/OrdersList'

export default function OrdersPage() {
  return (
    <div>
      <header className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
          My <span className="gradient-text">Orders</span>
        </h1>
        <p className="text-muted mt-1">View and track your purchases</p>
      </header>
      <OrdersList />
    </div>
  )
}
