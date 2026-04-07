// src/app/dashboard/user_dashboard/eligibility_checker/page.tsx
"use client"; // ✅ needed because we're using a hook
import * as React from "react";
import { useState } from "react";
import useFetchQualifiedUsers from "@/services/useFetchQulifiedUsers";

export default function EligibilityCheckerPage() {
  const [accountNo, setAccountNo] = useState("");
  const [query, setQuery] = useState(""); // ✅ only fetch on button click
  const { customer, loading, error } = useFetchQualifiedUsers(query);

  function handleCheck() {
    setQuery(accountNo.trim()); // ✅ triggers the useEffect in the hook
  }

  return (
    <div>
      <input
        type="text"
        value={accountNo}
        onChange={(e) => setAccountNo(e.target.value)}
        placeholder="e.g. 00123456678"
        className="border px-3 py-2 rounded-lg text-sm"
      />
      <button
        onClick={handleCheck}
        className="ml-2 bg-teiblue text-white px-4 py-2 rounded-lg text-sm"
      >
        Check
      </button>

      {/* States */}
      {loading && <p className="text-gray-400 text-sm mt-4">Searching...</p>}
      {error && <p className="text-red-500 text-sm mt-4">{error}</p>}

      {/* Result */}
      {customer && (
        <div className="mt-4 border rounded-lg p-4">
          <p className="font-semibold">{customer.customerName}</p>
          <p className="text-sm text-gray-500">{customer.accountNo}</p>
          <p className="text-sm">Deposit: ₱{customer.depositAmount}</p>
          <p className="text-sm text-green-600">
            {customer.claimedAt ? "Claimed" : "Eligible"}
          </p>
        </div>
      )}
    </div>
  );
}