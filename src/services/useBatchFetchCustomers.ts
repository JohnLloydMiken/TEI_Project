"use client";

import { useState, useEffect } from "react";
type Customer = {
  id: number;
  accountNo: string;
  customerName: string;
  depositAmount: string;
  notificationDate: string;
  claimedAt: string | null;
  claimedBy: number | null;
  batch: {
    month: number;
    year: number;
    fileName: string;
  };
  deadlineDate: string;
  daysRemaining: number;
  isExpired: Boolean;
  status: "Eligible" | "Expired" | "Claimed";
};
interface BatchResult {
  found: Customer[];
  notFound: string[];
}

type BatchFetchState = {
  results: BatchResult | null;
  loading: boolean;
  error: string | null;
};

// useBatchCustomerFetch.ts
export default function useBatchCustomerFetch() {
  const [results, setResults] = useState<BatchResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ✅ No useEffect, no dependency array, no fighting React
  const fetchBatch = async (accountNumbers: string[]) => {
    if (accountNumbers.length === 0) return;

    setLoading(true);
    setResults(null);
    setError(null);

    try {
      const response = await fetch("/api/customers/batch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accountNumbers }),
      });

      const json = await response.json();

      if (!response.ok) {
        setError(json.error ?? "Batch fetch failed");
        return;
      }

      setResults(json.data);
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const clear = () => {
    setResults(null);
    setError(null);
  };

  return { results, loading, error, fetchBatch, clear };
}