"use client";

import { useState, useTransition } from "react";
import { checkBatchAccountsAction, type CheckResult } from "@/lib/actions/batch";
import { toast } from "sonner";

type BatchFetchState = {
  results: CheckResult | null;
  loading: boolean;
  error: string | null;
};

export default function useBatchCustomerFetch() {
  const [results, setResults] = useState<CheckResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const fetchBatch = (accountNumbers: string[]) => {
    if (accountNumbers.length === 0) return;

    setResults(null);
    setError(null);

    startTransition(async () => {
      const res = await checkBatchAccountsAction(accountNumbers);

      if (!res.success) {
        setError(res.error);
        toast.error(res.error);
        return;
      }

      setResults(res.result);
    });
  };

  const clear = () => {
    setResults(null);
    setError(null);
  };

  return { results, loading: isPending, error, fetchBatch, clear };
}