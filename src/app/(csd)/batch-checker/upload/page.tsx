// src/app/(dashboard)/csd/batch-excel/page.tsx  ← adjust to your route structure
"use client";

import { motion, AnimatePresence } from "motion/react";
import { AlertTriangle } from "lucide-react";
import BatchPasteWidgets from "@/components/dashboard/eligibility-checker/widgets/batch-paste-widgets";
import { div } from "motion/react-client";
import useBatchCustomerFetch from "@/services/useBatchFetchCustomers";
import { useState, useEffect } from "react";
import BatchUpload from "@/components/dashboard/eligibility-checker/batch-upload";
export default function BatchExcelPage() {
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
        <h1 className="text-2xl font-bold text-gray-800">
          Batch Check — Excel Upload
        </h1>
        <p className="text-sm text-gray-400 mt-1">
          Upload an Excel file to check multiple accounts at once. The file must
          contain an{" "}
          <span className="font-semibold text-gray-500">Account No</span> or{" "}
          <span className="font-semibold text-gray-500">Account Number</span>{" "}
          column.
        </p>
      </div>
      <BatchPasteWidgets
        numberOfAcc={total || 0}
        eligible={eligible || "–"}
        expired={expired || "–"}
        claimed={claimed || "–"}
        notFound={notFound || "–"}
      />

      <BatchUpload
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
