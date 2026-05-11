import * as React from "react";
import OverviewWidgets from "@/components/dashboard/eligibility-checker/widgets/overview-widgets";
import HistoricalChart from "@/components/dashboard/analytics/historical-barChart";
import CustomerPieChart from "@/components/dashboard/analytics/pie-chart";
import RetentionChart from "@/components/dashboard/analytics/retention-rate-chart";
export default async function OverviewPage() {
  return (
    <div className="flex flex-col space-y-4">
      <OverviewWidgets />

      <div className="w-full flex flex-row items-stretch space-x-3">
        {/* Left — bar chart takes 2/3 */}
        <div className="flex-2 min-w-0">
          <HistoricalChart />
        </div>

        {/* Right — retention + pie stacked, takes 1/3 */}
        <div className="flex-1 flex flex-col gap-3 min-w-0">
          <RetentionChart />
          <CustomerPieChart />
        </div>
      </div>
    </div>
  );
}
