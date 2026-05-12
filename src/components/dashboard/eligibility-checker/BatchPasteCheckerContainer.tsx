"use client";
import BatchPasteChecker from "@/components/dashboard/eligibility-checker/batch-paste";
import useBatchCustomerFetch from "@/services/useBatchFetchCustomers";
import useMarkAsClaimed from "@/services/useMarkeAsClaimed";
import { useState, useEffect } from "react";

export default function BatchPasteCheckerContainer() {
  const { results, loading, error, fetchBatch, clear } = useBatchCustomerFetch();
  const { markAsClaimed, claimingIds } = useMarkAsClaimed();
  const [localResults, setLocalResults] = useState(results?.found ?? []);

  useEffect(() => {
    setLocalResults(results?.found ?? []);
  }, [results]);

  function handleRemove(id: number) {
    setLocalResults((prev) => prev.filter((c) => c.id !== id));
  }



  return (
    <BatchPasteChecker
      results={{ ...results, found: localResults, notFound: results?.notFound ?? [] }}
      fetchBatch={fetchBatch}       
      clear={clear}
      onRemove={handleRemove}
      onClaim={()=> ""}
      claimingIds={claimingIds}
      loading={loading}
      error={error}
    />
  );
}