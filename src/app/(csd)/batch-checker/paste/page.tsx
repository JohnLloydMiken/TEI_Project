"use client";

import Widgets from "@/components/dashboard/eligibility-checker/widgets/widgets";
import BatchPasteWidgets from "@/components/dashboard/eligibility-checker/widgets/batch-paste-widgets";
import BatchPasteChecker from "@/components/dashboard/eligibility-checker/batch-paste";
import useBatchCustomerFetch from "@/services/useBatchFetchCustomers";
import { useState, useEffect } from "react";
export default function BatchPaste() {
  const { results, loading, error, fetchBatch, clear } =
    useBatchCustomerFetch();

  // Derive widget values from results
  const found = results?.found ?? [];
  const eligible = found.filter((c) => c.status === "Eligible").length;
  const expired = found.filter((c) => c.status === "Expired").length;
  const claimed = found.filter((c) => c.status === "Claimed").length;
  const notFound = results?.notFound?.length ?? 0;
  const total = found.length + notFound;
  const [localResults, setLocalResults] = useState(results?.found ?? []);
  

  // keep localResults in sync when a new search runs
  useEffect(() => {
    setLocalResults(results?.found ?? []);
  }, [results]);

  function handleRemove(id: number) {
    setLocalResults((prev) => prev.filter((c) => c.id !== id));
  }
  return (
    <div className="w-full flex flex-col gap-3">
      <div>
        <h1 className="text-2xl text-teiblue font-bold">Eligibility Checker</h1>
        <p className="text-sm text-gray-400 font-light">
          Verify account refund eligibility in bulk or individually
        </p>
      </div>

      <BatchPasteWidgets
        numberOfAcc={total || 0}
        eligible={eligible || "–"}
        expired={expired || "–"}
        claimed={claimed || "–"}
        notFound={notFound || "–"}
      />

      {/* Pass the hook's internals down as props */}
      <BatchPasteChecker
        results={{
          ...results,
          found: localResults,
          notFound: results?.notFound ?? [],
        }}
        fetchBatch={fetchBatch}
        clear={clear}
        onRemove={handleRemove}
        loading={loading} // ← missing
        error={error} // ← missing
      />
    </div>
  );
}
