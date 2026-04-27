"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Trash } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

import { useState, useEffect } from "react";
import useBatchCustomerFetch from "@/services/useBatchFetchCustomers";
import { toast } from "sonner";
import CustomerTable from "./batch/customer-table";
import NotFoundTable from "@/components/dashboard/eligibility-checker/batch/not-found";

interface BatchPasteCheckerProps {
  results: ReturnType<typeof useBatchCustomerFetch>["results"];
  loading: boolean;
  error: string | null;
  fetchBatch: (accounts: string[]) => void;
  clear: () => void;
  onRemove: (id: number) => void;
  onClaim: (id: number, accountNo: string) => void; // ← add
  claimingIds: Set<number>; // ← add
}

type ViewTab = "found" | "notFound";

export default function BatchPasteChecker({
  results,
  loading,
  error,
  fetchBatch,
  clear,
  onRemove,
  onClaim, // ← add
  claimingIds,
}: BatchPasteCheckerProps) {
  const pathname = usePathname();

  const individualPath = "/individual-checker";
  const batchPastePath = "/batch-checker/paste";
  const batchUploadPath = "/batch-checker/upload";

  const [accountNo, setAccountNo] = useState("");
  const [activeView, setActiveView] = useState<ViewTab>("found");

  const tabs = [
    { label: "Individual", href: individualPath },
    { label: "Batch (paste)", href: batchPastePath },
    { label: "Batch (upload)", href: batchUploadPath },
  ];

  const foundCount = results?.found?.length ?? 0;
  const notFoundCount = results?.notFound?.length ?? 0;

  function handleCheck() {
    const array = accountNo
      .split("\n")
      .map((a) => a.trim())
      .filter(Boolean);

    fetchBatch(array);
  }

  function handleClear() {
    setAccountNo("");
    clear();
  }

  // Reset to "found" tab whenever a new search completes
  useEffect(() => {
    if (results) setActiveView("found");
  }, [results]);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  const viewTabs: { key: ViewTab; label: string; count: number }[] = [
    { key: "found", label: "Found", count: foundCount },
    { key: "notFound", label: "Not Found", count: notFoundCount },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="w-full flex flex-col space-y-3"
    >
      <div className="w-full rounded-lg bg-white shadow-[0_4px_10px_5px_rgb(0,0,0,0.08)]">
        {/* Header */}
        <div className="bg-teiblue px-4 py-2 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 rounded-t-lg">
          <p className="text-white text-lg sm:text-xl font-normal">
            Batch Paste Checker
          </p>
          <p className="text-white/60 text-xs sm:text-sm font-normal">
            Enter account numbers to verify
          </p>
        </div>

        {/* Nav Tabs */}
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
        <div className="w-full px-4 py-4 sm:px-6">
          <div className="w-full sm:w-10/12 md:w-11/12 flex flex-row items-center gap-2 sm:gap-3 mx-auto">
            <textarea
              name="customer-search"
              className="flex-1 min-w-0 border border-gray-200 rounded-lg p-2.5 sm:p-3 bg-gray-100 outline-none text-sm sm:text-base resize-none"
              placeholder="Paste Account Number here one per line"
              value={accountNo}
              onChange={(e) => setAccountNo(e.target.value)}
            />
            <motion.button
              whileTap={{ scale: 0.96 }}
              whileHover={{ scale: 1.02 }}
              onClick={handleCheck}
              disabled={loading}
              className="shrink-0 flex flex-row justify-center items-center gap-1.5 sm:gap-2 border border-gray-200 p-2.5 sm:p-3 rounded-lg bg-teiblue text-white text-sm sm:text-base disabled:opacity-60"
            >
              <span className="xs:inline">Search</span>
              <Search color="white" size={18} />
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.96 }}
              whileHover={{ scale: 1.02 }}
              onClick={handleClear}
              className="shrink-0 flex flex-row justify-center items-center gap-1.5 sm:gap-2 border border-gray-200 p-2.5 sm:p-3 rounded-lg bg-teiorange text-white text-sm sm:text-base"
            >
              <span className="xs:inline">Clear</span>
              <Trash color="white" size={18} />
            </motion.button>
          </div>
        </div>
      </div>

      {/* Results Panel */}
      <div className="bg-white rounded-lg shadow-[0_4px_10px_5px_rgb(0,0,0,0.08)]">
        {/* View Tab Switcher */}
        <div className="p-3 flex flex-row items-center gap-2 border-b border-gray-100">
          {viewTabs.map(({ key, label, count }) => {
            const isActive = activeView === key;
            return (
              <button
                key={key}
                onClick={() => setActiveView(key)}
                className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? key === "found"
                      ? "bg-teiblue text-white shadow-sm"
                      : "bg-teiorange text-white shadow-sm"
                    : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                }`}
              >
                {label}
                {/* Count badge */}
                <span
                  className={`inline-flex items-center justify-center min-w-5 h-5 px-1 rounded-full text-xs font-semibold transition-colors ${
                    isActive
                      ? "bg-white/25 text-white"
                      : "bg-gray-300 text-gray-600"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Table Area with fade transition */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeView}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
          >
            {activeView === "found" ? (
              <CustomerTable
                customers={results?.found ?? []}
                onRemove={onRemove}
                onClaim={onClaim} // ← add
                claimingIds={claimingIds} // ← add
              />
            ) : (
              <NotFoundTable accountNumbers={results?.notFound ?? []} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
