import RetentionRateChart from "./charts/custom-rentention-chart";
import { getCurrentBatchRetentionRate } from "@/lib/data/charts-data";

export default async function RetentionChart() {
  const data = await getCurrentBatchRetentionRate();

  return (
    <div className="bg-white rounded-lg p-3 flex flex-col space-y-5 shadow-sm hover:shadow-lg">
      <h1 className="text-teiblue font-medium text-xl">
        Customer Bill Deposit Retention Rate
      </h1>
      <RetentionRateChart rate={data.rate} batch={data.batch} />
    </div>
  );
}