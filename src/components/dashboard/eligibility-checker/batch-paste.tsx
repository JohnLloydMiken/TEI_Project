"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Trash } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect } from "react";
import { toast } from "sonner";

import useBatchCustomerFetch from "@/services/useBatchFetchCustomers";
import { toggleCustomerStatusAction, type CheckResult } from "@/lib/actions/batch";
import CustomerTable from "./batch/customer-table";
import NotFoundTable from "@/components/dashboard/eligibility-checker/batch/not-found";

type ViewTab = "found" | "notFound";

export default function BatchPasteChecker() {
  const pathname = usePathname();
  const { results, loading, error, fetchBatch, clear } = useBatchCustomerFetch();

  // Mirror BatchUpload: own the results mutation locally
  const [localResults, setLocalResults] = useState<CheckResult | null>(null);
  const [claimingIds, setClaimingIds] = useState<Set<number>>(new Set());
  const [accountNo, setAccountNo] = useState("");
  const [activeView, setActiveView] = useState<ViewTab>("found");

  const tabs = [
    { label: "Individual", href: "/individual-checker" },
    { label: "Batch (paste)", href: "/batch-checker/paste" },
    { label: "Batch (upload)", href: "/batch-checker/upload" },
  ];

  // Sync hook results → local state
  useEffect(() => {
    if (results) {
      setLocalResults(results);
      setActiveView("found");
    }
  }, [results]);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  function handleCheck() {
    const array = accountNo
      .split("\n")
      .map((a) => a.trim())
      .filter(Boolean);
    fetchBatch(array);
  }

  function handleClear() {
    setAccountNo("");
    setLocalResults(null);
    clear();
  }

  // ── Toggle Pending ↔ BD Retained (optimistic) ──────────────────────────
  async function handleClaim(customerId: number) {
    setClaimingIds((prev) => new Set(prev).add(customerId));

    const res = await toggleCustomerStatusAction(customerId);

    if (res.success) {
      setLocalResults((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          found: prev.found.map((c) =>
            c.id === customerId ? { ...c, status: res.newStatus } : c,
          ),
        };
      });
      toast.success(
        res.newStatus === "BD Retained"
          ? "Customer tagged as BD Retained."
          : "Customer untagged back to Pending.",
      );
    } else {
      toast.error(res.error);
    }

    setClaimingIds((prev) => {
      const next = new Set(prev);
      next.delete(customerId);
      return next;
    });
  }

  // ── UI-only remove ─────────────────────────────────────────────────────
  function handleRemove(customerId: number) {
    setLocalResults((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        found: prev.found.filter((c) => c.id !== customerId),
      };
    });
  }

  const foundCount = localResults?.found.length ?? 0;
  const notFoundCount = localResults?.notFound.length ?? 0;

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
          <p className="text-white text-lg sm:text-xl font-normal">Batch Paste Checker</p>
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
                <span
                  className={`inline-flex items-center justify-center min-w-5 h-5 px-1 rounded-full text-xs font-semibold transition-colors ${
                    isActive ? "bg-white/25 text-white" : "bg-gray-300 text-gray-600"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Table */}
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
                customers={localResults?.found ?? []}
                onRemove={handleRemove}
                onClaim={handleClaim}
                claimingIds={claimingIds}
              />
            ) : (
              <NotFoundTable accountNumbers={localResults?.notFound ?? []} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}