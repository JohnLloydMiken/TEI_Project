// No "use client" — Server Component
import Widgets from "@/components/dashboard/eligibility-checker/widgets/widgets";
import BatchPasteCheckerContainer from "@/components/dashboard/eligibility-checker/BatchPasteCheckerContainer";
import { getCustomerCounts, getCurrentBatch } from "@/lib/data/widgets-data";

export default async function BatchPastePage() {
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
        <h1 className="text-2xl text-teiblue font-bold">Eligibility Checker</h1>
        <p className="text-sm text-gray-400 font-light">
          Verify account refund eligibility in bulk or individually
        </p>
      </div>

      {/* Static — rendered on server, no loading state needed */}
      <Widgets
        batch={batchLabel}
        qualified={counts.total}
        pending={counts.pending}
        retained={counts.bdRetained}
      />

      {/* Interactive — stays fully client-side */}
      <BatchPasteCheckerContainer />
    </div>
  );
}