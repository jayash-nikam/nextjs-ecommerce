export default function Loading() {
  return (
    <div className="animate-fade-in-up max-w-6xl mx-auto">
      <div className="skeleton h-5 w-32 mb-8 rounded" />

      <div className="grid lg:grid-cols-2 gap-10 lg:gap-14">
        <div className="card-surface p-2">
          <div className="skeleton aspect-square rounded-xl" />
        </div>

        <div className="space-y-5">
          <div className="skeleton h-4 w-20 rounded" />
          <div className="skeleton h-10 w-3/4 rounded-lg" />
          <div className="skeleton h-6 w-32 rounded" />
          <div className="skeleton h-8 w-40 rounded-lg" />
          <div className="space-y-2">
            <div className="skeleton h-4 w-full rounded" />
            <div className="skeleton h-4 w-full rounded" />
            <div className="skeleton h-4 w-2/3 rounded" />
          </div>
          <div className="skeleton h-12 w-48 rounded-xl" />
        </div>
      </div>
    </div>
  )
}
