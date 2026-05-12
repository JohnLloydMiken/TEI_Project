// No "use client" — this runs on the server
import Widgets from "@/components/dashboard/eligibility-checker/widgets/widgets";
import IndividualChecker from "@/components/dashboard/eligibility-checker/individual-checker";
import { prisma } from "@/lib/prisma"; // your Prisma client
import { getCustomerCounts, getCurrentBatch } from "@/lib/data/widgets-data";

export default async function EligibilityCheckerPage() {
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

      <Widgets
        batch={batchLabel}
        qualified={counts.total}
        pending={counts.pending}
        retained={counts.bdRetained}
      />

      <IndividualChecker />
    </div>
  );
}
