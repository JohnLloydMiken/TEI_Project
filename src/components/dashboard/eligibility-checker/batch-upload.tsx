"use client";

import { motion, AnimatePresence } from "motion/react";
import { AlertTriangle } from "lucide-react";
import ExcelDropzone from "@/components/dashboard/eligibility-checker/ExcelDropzone";
import CustomerTable from "@/components/dashboard/eligibility-checker/batch/customer-table";
import NotFoundTable from "@/components/dashboard/eligibility-checker/batch/not-found";
import useBatchCustomerFetch from "@/services/useBatchFetchCustomers";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";

interface BatchPasteUploadProps {
  results: ReturnType<typeof useBatchCustomerFetch>["results"];
  loading: boolean;
  error: string | null;
  fetchBatch: (accounts: string[]) => void;
  clear: () => void;
  onRemove: (id: number) => void;
}

type ViewTab = "found" | "notFound";

export default function BatchUpload({
  results,
  loading,
  error,
  fetchBatch,
  clear,
  onRemove,
}: BatchPasteUploadProps) {
  const pathname = usePathname();
  const [activeView, setActiveView] = useState<ViewTab>("found");

  const individualPath = "/individual-checker";
  const batchPastePath = "/batch-checker/paste";
  const batchUploadPath = "/batch-checker/upload";

  const tabs = [
    { label: "Individual", href: individualPath },
    { label: "Batch (paste)", href: batchPastePath },
    { label: "Batch (upload)", href: batchUploadPath },
  ];

  const foundCount = results?.found?.length ?? 0;
  const notFoundCount = results?.notFound?.length ?? 0;

  const viewTabs: { key: ViewTab; label: string; count: number }[] = [
    { key: "found", label: "Found", count: foundCount },
    { key: "notFound", label: "Not Found", count: notFoundCount },
  ];

  // Reset to "found" tab whenever a new result arrives
  useEffect(() => {
    if (results) setActiveView("found");
  }, [results]);

  const handleAccountsReady = (accountNumbers: string[]) => {
    fetchBatch(accountNumbers);
  };

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
            Batch Upload Checker
          </p>
          <p className="text-white/60 text-xs sm:text-sm font-normal">
            Upload a file to verify accounts
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

        {/* Dropzone */}
        <div className="w-full px-4 py-4 sm:px-6">
          <div className="w-full sm:w-10/12 md:w-11/12 flex flex-col items-center gap-2 sm:gap-3 mx-auto">
            <h2 className="text-sm font-semibold text-gray-600 mb-4">
              Upload File
            </h2>
            <ExcelDropzone
              onAccountsReady={handleAccountsReady}
              onClear={clear}
              loading={loading}
            />
          </div>
        </div>
      </div>

      {/* Loading */}
      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="px-6 py-8 flex items-center justify-center gap-3 text-gray-400"
          >
            <div className="w-4 h-4 border-2 border-teiorange border-t-transparent rounded-full animate-spin" />
            <span className="text-sm font-medium">Checking accounts…</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* API error */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="flex items-center gap-2 px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-red-500 text-sm"
          >
            <AlertTriangle className="w-4 h-4 shrink-0" />
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results Panel */}
      <AnimatePresence>
        {!loading && results && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="bg-white rounded-lg shadow-[0_4px_10px_5px_rgb(0,0,0,0.08)]"
          >
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

            {/* Table with fade transition */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeView}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
              >
                {activeView === "found" ? (
                  results.found.length > 0 ? (
                    <CustomerTable
                      customers={results.found}
                      onRemove={onRemove}
                    />
                  ) : (
                    <p className="px-6 py-10 text-center text-sm text-gray-400">
                      No matching accounts found in the database.
                    </p>
                  )
                ) : (
                  <NotFoundTable accountNumbers={results.notFound ?? []} />
                )}
              </motion.div>
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}