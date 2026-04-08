// src/services/useFetchQualifiedUsers.ts
"use client";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
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
};

type FetchState = {
  customer: Customer | null;
  loading: boolean;
  error: string | null;
};

export default function useFetchQualifiedUsers(accountNo: string): FetchState {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
 
  useEffect(() => {
    if (!accountNo) return; // ✅ don't fetch if empty

    const fetchCustomer = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/customers/${accountNo}`);
        const json = await response.json();
        
        if (!response.ok) {
          setError(json.error ?? "Customer not found");
          setCustomer(null);
          return;
        }

        setCustomer(json.data); // ✅ matches { data: customer } from your API
      } catch (e) {
        setError("Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchCustomer();
  }, [accountNo]);

  return { customer, loading, error };
}