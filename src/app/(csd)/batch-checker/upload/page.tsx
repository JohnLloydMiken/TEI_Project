// src/app/(dashboard)/csd/batch-excel/page.tsx
import BatchUpload from "@/components/dashboard/eligibility-checker/batch-upload";
import Widgets from "@/components/dashboard/eligibility-checker/widgets/widgets";
import { getCustomerCounts, getCurrentBatch } from "@/lib/data/widgets-data";
export default async function BatchExcelPage() {
  const [counts, batch] = await Promise.all([
    getCustomerCounts(),
    getCurrentBatch(),
  ]);

  const batchLabel = batch
    ? `${new Intl.DateTimeFormat("en-US", { month: "long" }).format(
        new Date(batch.year, batch.month - 1),
      )} ${batch.year}`
    : "No batch yet";
  return (
    <div className="w-full flex flex-col gap-3">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          Batch Check — Excel Upload
        </h1>
        <p className="text-sm text-gray-400 mt-1">
          Upload an Excel file to check multiple accounts at once. The file must
          contain an{" "}
          <span className="font-semibold text-gray-500">account_no</span>{" "}
          column.
        </p>
      </div>

      <Widgets
        batch={batchLabel}
        qualified={counts.total}
        pending={counts.pending}
        retained={counts.bdRetained}
      />
      <BatchUpload />
    </div>
  );
}
