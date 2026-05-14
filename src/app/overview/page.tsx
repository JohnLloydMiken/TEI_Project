
import * as React from "react";
import OverviewWidgets from "@/components/dashboard/eligibility-checker/widgets/overview-widgets";
import HistoricalChart from "@/components/dashboard/analytics/historical-barChart";
import CustomerPieChart from "@/components/dashboard/analytics/pie-chart";
import RetentionChart from "@/components/dashboard/analytics/retention-rate-chart";
import DashboardSkeleton from "@/components/skeletons/DashboardSkeleton";
import { Suspense } from "react";
export default function OverviewPage() {
  return (
    <div className="flex flex-col space-y-4">
      <Suspense fallback={<DashboardSkeleton />}>
        <OverviewWidgets />
      </Suspense>

      <div className="w-full flex lg:flex-row flex-col items-stretch md:space-x-3 space-y-2">
        <div className="flex-2 min-w-0">
          <Suspense fallback={<DashboardSkeleton />}>
            <HistoricalChart />
          </Suspense>
        </div>

        <div className="flex-1 flex flex-col gap-3 min-w-0">
          <Suspense fallback={<DashboardSkeleton />}>
            <RetentionChart />
          </Suspense>
          <Suspense fallback={<DashboardSkeleton />}>
            <CustomerPieChart />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
