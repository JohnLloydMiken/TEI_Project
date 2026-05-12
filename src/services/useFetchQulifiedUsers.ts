// src/services/useFetchQualifiedUsers.ts
"use client";
import { useState, useEffect } from "react";

type Customer = {
  id: number;
  accountNo: string;
  accountCode: string
  customerName: string;
  batch: {
    month: number;
    year: number;
    fileName: string;
  };
 
  status:  string,
};

type FetchState = {
  customer: Customer | null;
  loading: boolean;
  error: string | null;
};

export default function useFetchQualifiedUsers(accountNumber: string): FetchState {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
 
  useEffect(() => {
    if (!accountNumber) {
  setCustomer(null); // ← add this
  return;
} // ✅ don't fetch if empty

    const fetchCustomer = async () => {
      setLoading(true);
      setError(null);
      setCustomer(null); 
      try {
        const response = await fetch(`/api/customers/${accountNumber}`);
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
  }, [accountNumber]);

  return { customer, loading, error };
}