import CustomBarChart from "./charts/custom-bar-chart";
import { getHistoricalData } from "@/lib/data/charts-data";

export default async function HistoricalChart() {
  const data = await getHistoricalData();

  return (
    <div className="h-full bg-white rounded-lg p-3 flex flex-col space-y-5 shadow-sm hover:shadow-lg">
      <h1 className="text-teiblue font-medium text-xl">
        Bill Deposit Refund History
      </h1>
      <div className="flex-1">
        <CustomBarChart data={data} />
      </div>
    </div>
  );
}