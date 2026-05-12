"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search } from "lucide-react";
import { motion } from "motion/react";
import CustomerCard from "./customer-card";
import { useState, useEffect } from "react";
import useFetchQualifiedUsers from "@/services/useFetchQulifiedUsers";
import { toast } from "sonner";
import useMarkAsClaimed from "@/services/useMarkeAsClaimed";
export default function IndividualChecker() {
  const pathname = usePathname();
  const individualPath = "/individual-checker";
  const batchPastePath = "/batch-checker/paste";
  const batchUploadPath = "/batch-checker/upload";
  const [accountNo, setAccountNo] = useState("");
  const [query, setQuery] = useState(""); // ✅ only fetch on button click
  const { customer, loading, error } = useFetchQualifiedUsers(query);
  const { markAsClaimed, claimingIds } = useMarkAsClaimed();

  async function handleClaim() {
    if (!customer?.id || !customer?.accountNo) return;
    await markAsClaimed(customer.id, customer.accountNo, () => {
      // Re-fetch to get updated status from DB
      setQuery("");
      setTimeout(() => setQuery(accountNo.trim()), 100);
    });
  }
  const tabs = [
    { label: "Individual", href: individualPath },
    { label: "Batch (paste)", href: batchPastePath },
    { label: "Batch (upload)", href: batchUploadPath },
  ];

  function handleCheck() {
    setQuery(accountNo.trim()); // ✅ triggers the useEffect in the hook
  }
  function handleClear() {
    setAccountNo("");
    setQuery("");
  }

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="w-full rounded-lg bg-white shadow-sm hover:shadow-lg flex flex-col"
    >
      {/* Header */}
      <div className="bg-teiblue px-4 py-2 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 rounded-t-lg">
        <p className="text-white text-lg sm:text-xl font-normal">
          Individual Checker
        </p>
        <p className="text-white/60 text-xs sm:text-sm font-normal">
          Enter account number to verify
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-b-gray-200 overflow-x-auto scrollbar-none">
        <ul className="flex flex-row min-w-max">
          {tabs.map((tab) => {
            const isActive = pathname === tab.href;
            return (
              <li
                key={tab.href}
                className={`group px-3 sm:px-4 py-2 hover:border-b-4 hover:border-b-teiorange transition-all ${
                  isActive ? "border-b-4 border-b-teiorange" : "border-none"
                }`}
              >
                <Link
                  href={tab.href}
                  className={`text-sm sm:text-base font-normal whitespace-nowrap group-hover:text-orange-700 transition-colors ${
                    isActive ? "text-orange-700" : "text-gray-400"
                  }`}
                >
                  {tab.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Search */}
      <div className="relative group w-10/12 mx-auto mt-2 border border-gray-100 rounded-2xl">
        <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
          <Search
            className="text-slate-400 group-focus-within:text-[#e87722] transition-colors"
            size={20}
          />
        </div>
        <input
          type="text"
          value={accountNo}
          onChange={(e) => setAccountNo(e.target.value)}
          placeholder="Enter Account Number (e.g. 906-2370-000)"
          className="w-full h-12 pl-14 pr-36 bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 outline-none focus:ring-2 focus:ring-gray-300/50 focus:border-gray-300 transition-all text-lg"
        />
        <button
          className="absolute right-2 top-2 bottom-2 px-8 bg-[#1a3a5c] text-white font-bold rounded-xl hover:bg-[#244a75] transition-all active:scale-95 shadow-lg shadow-[#1a3a5c]/20"
          onClick={handleCheck}
        >
          Verify
        </button>
      </div>

      {/* Results placeholder */}
      <div className="p-4 flex flex-col justify-center items-center ">
        <hr className="border-gray-200" />

        {!customer ? (
          <p className="text-center text-xs sm:text-sm uppercase text-gray-400 tracking-wider">
            Your results are here
          </p>
        ) : (
          <CustomerCard
            accountName={customer?.customerName}
            accountNumber={customer?.accountNo}
            accountCode={customer.accountCode}
            status={customer?.status ?? null}
            onClear={handleClear}
            onClaim={handleClaim} // ← new
            claiming={customer?.id ? claimingIds.has(customer.id) : false} // ← new
          />
        )}
      </div>
    </motion.div>
  );
}
