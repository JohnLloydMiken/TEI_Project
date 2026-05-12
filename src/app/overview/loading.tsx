export default function Loading() {
  return (
    <div className="w-full flex flex-col space-y-2">
      {/* Overview Widgets Skeleton */}
      <div className="flex gap-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex-1 h-24 rounded-lg bg-white shadow-[0_4px_10px_5px_rgb(0,0,0,0.08)] animate-pulse" />
        ))}
      </div>

      {/* Table Skeleton */}
      <div className="bg-white rounded-lg shadow-[0_4px_10px_5px_rgb(0,0,0,0.08)] px-4 py-3">
        
        {/* Tab bar skeleton */}
        <div className="flex gap-2 pb-3 border-b border-gray-100">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-8 w-24 rounded-lg bg-gray-100 animate-pulse" />
          ))}
        </div>

        {/* Table header skeleton */}
        <div className="flex gap-4 px-4 py-3 mt-2 bg-[#f0f4f9] rounded">
          {["w-28", "w-24", "w-40", "w-20"].map((w, i) => (
            <div key={i} className={`h-3 ${w} rounded bg-gray-200 animate-pulse`} />
          ))}
        </div>

        {/* Row skeletons */}
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            className="flex gap-4 px-4 py-4 border-b border-gray-100"
            style={{ animationDelay: `${i * 40}ms` }}
          >
            <div className="h-3 w-28 rounded bg-gray-100 animate-pulse" />
            <div className="h-3 w-24 rounded bg-gray-100 animate-pulse" />
            <div className="h-3 w-40 rounded bg-gray-100 animate-pulse" />
            <div className="h-5 w-20 rounded-full bg-gray-100 animate-pulse" />
          </div>
        ))}

        {/* Pagination skeleton */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="h-3 w-24 rounded bg-gray-100 animate-pulse" />
          <div className="flex gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="w-8 h-8 rounded-lg bg-gray-100 animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}