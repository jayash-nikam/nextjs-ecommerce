export default function Loading() {
  return (
    <div className="animate-fade-in-up">
      <div className="skeleton h-10 w-64 mb-2 rounded-lg" />
      <div className="skeleton h-5 w-32 mb-8 rounded" />

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="hidden lg:block w-72 shrink-0">
          <div className="card-surface p-5 space-y-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="skeleton h-8 rounded-xl" />
            ))}
          </div>
        </div>

        <div className="flex-1 grid gap-6 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="card-surface overflow-hidden">
              <div className="skeleton h-56 rounded-none" />
              <div className="p-5 space-y-3">
                <div className="skeleton h-3 w-16 rounded" />
                <div className="skeleton h-5 w-full rounded" />
                <div className="skeleton h-4 w-3/4 rounded" />
                <div className="skeleton h-10 w-full rounded-xl mt-4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
