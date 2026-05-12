// components/dashboard/dashboard-skeleton.tsx
import React from "react";

const Skeleton = ({ className }: { className: string }) => (
  <div className={`bg-gray-200 animate-pulse rounded-lg ${className}`} />
);

export default function DashboardSkeleton() {
  return (
    <div className="space-y-8 w-full p-6">
      {/* 1. Widgets Skeleton */}
      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:flex lg:flex-row gap-10">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="relative flex-1 space-x-6 shadow-sm border border-gray-100 rounded-lg flex bg-white items-center justify-center min-h-30"
          >
            <Skeleton className="w-11 h-11 rounded-full" />
            <div className="space-y-3">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-6 w-16" />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 2. Main Bar Chart Skeleton (Takes up 2/3) */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex justify-between mb-6">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-32" />
          </div>
          <div className="w-full h-[65vh] flex items-end gap-4 px-2">
            {/* Mocking Bar Columns */}
            {[...Array(12)].map((_, i) => (
              <div key={i} className="flex-1 flex flex-col gap-2 items-center">
                <Skeleton className={`w-full rounded-t ${i % 2 === 0 ? 'h-32' : 'h-48'}`} />
                <Skeleton className="h-3 w-8" />
              </div>
            ))}
          </div>
        </div>

        {/* 3. Gauges / Pie Chart Skeleton (Takes up 1/3) */}
        <div className="lg:col-span-1 space-y-8">
          {/* Gauge Skeleton */}
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col items-center">
            <Skeleton className="h-5 w-32 mb-6" />
            {/* Half-donut shape */}
            <div className="relative w-62.5 h-35 overflow-hidden">
               <div className="w-62.5 h-62.5 border-20 border-gray-200 rounded-full" />
            </div>
            <Skeleton className="h-8 w-20 mt-4" />
            <Skeleton className="h-3 w-40 mt-2" />
          </div>

          {/* Pie Chart Skeleton */}
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col items-center">
            <Skeleton className="h-5 w-32 mb-6" />
            <Skeleton className="w-48 h-48 rounded-full border-25 border-gray-200" />
            <div className="flex gap-4 mt-6">
               <Skeleton className="h-3 w-16" />
               <Skeleton className="h-3 w-16" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}