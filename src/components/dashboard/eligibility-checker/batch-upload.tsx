"use client";

import { useState, useTransition } from "react";
import { motion, AnimatePresence } from "motion/react";
import { AlertTriangle } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { toast } from "sonner";

import ExcelDropzone from "@/components/dashboard/eligibility-checker/ExcelDropzone";
import CustomerTable from "@/components/dashboard/eligibility-checker/batch/customer-table";
import NotFoundTable from "@/components/dashboard/eligibility-checker/batch/not-found";
import PendingTable from "./batch/pending";
import ReturnedTable from "./batch/returned";

import {
  checkBatchAccountsAction,
  toggleCustomerStatusAction,
  type CheckResult,
} from "@/lib/actions/batch";

type ViewTab = "found" | "notFound" | "pending" | "retained";

export default function BatchUpload() {
  const pathname = usePathname();

  const [results, setResults] = useState<CheckResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [claimingIds, setClaimingIds] = useState<Set<number>>(new Set());
  const [isChecking, startCheck] = useTransition();
  const [activeView, setActiveView] = useState<ViewTab>("found");

  const tabs = [
    { label: "Individual", href: "/individual-checker" },
    { label: "Batch (paste)", href: "/batch-checker/paste" },
    { label: "Batch (upload)", href: "/batch-checker/upload" },
  ];

  // ── On file parsed: run the DB lookup ──────────────────────────────────────
  const handleReady = (accountNos: string[]) => {
    setError(null);
    setResults(null);

    startCheck(async () => {
      const res = await checkBatchAccountsAction(accountNos);
      if (!res.success) {
        setError(res.error);
        return;
      }
      setResults(res.result);
      setActiveView("found");
    });
  };

  const handleClear = () => {
    setResults(null);
    setError(null);
  };

  // ── Toggle Pending ↔ BD Retained ───────────────────────────────────────────
  const handleClaim = async (customerId: number) => {
    setClaimingIds((prev) => new Set(prev).add(customerId));

    const res = await toggleCustomerStatusAction(customerId);

    if (res.success) {
      // Optimistic local update — no refetch
      setResults((prev) => {
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
  };

  // ── UI-only remove (masterlist is not touched) ─────────────────────────────
  const handleRemove = (customerId: number) => {
    setResults((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        found: prev.found.filter((c) => c.id !== customerId),
      };
    });
  };

  // ── Derived ────────────────────────────────────────────────────────────────
  const pendingCustomers = results?.found.filter((c) => c.status === "Pending") ?? [];
  const retainedCustomers = results?.found.filter((c) => c.status === "BD Retained") ?? [];

  const viewTabs: { key: ViewTab; label: string; count: number }[] = [
    { key: "found",    label: "Found",    count: results?.found.length ?? 0 },
    { key: "notFound", label: "Not Found", count: results?.notFound.length ?? 0 },
    { key: "pending",  label: "Pending",  count: pendingCustomers.length },
    { key: "retained", label: "Retained", count: retainedCustomers.length },
  ];

  const sharedProps = { onRemove: handleRemove, onClaim: handleClaim, claimingIds };

  const renderTable = () => {
    switch (activeView) {
      case "found":    return <CustomerTable customers={results?.found ?? []} {...sharedProps} />;
      case "pending":  return <PendingTable customers={pendingCustomers} {...sharedProps} />;
      case "retained": return <ReturnedTable customers={retainedCustomers} {...sharedProps} />;
      case "notFound": return <NotFoundTable accountNumbers={results?.notFound ?? []} />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="w-full flex flex-col space-y-3"
    >
      {/* ── Upload card ── */}
      <div className="w-full rounded-lg bg-white shadow-[0_4px_10px_5px_rgb(0,0,0,0.08)]">
        <div className="bg-teiblue px-4 py-2 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 rounded-t-lg">
          <p className="text-white text-lg sm:text-xl font-normal">Batch Upload Checker</p>
          <p className="text-white/60 text-xs sm:text-sm font-normal">
            Upload a file to verify accounts
          </p>
        </div>

        {/* Nav tabs */}
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
            <h2 className="text-sm font-semibold text-gray-600 mb-2">Upload File</h2>
            <ExcelDropzone
              onReady={handleReady}
              onClear={handleClear}
              loading={isChecking}
            />
          </div>
        </div>
      </div>

      {/* ── Checking spinner ── */}
      <AnimatePresence>
        {isChecking && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="px-6 py-8 flex items-center justify-center gap-3 text-gray-400"
          >
            <div className="w-4 h-4 border-2 border-teiorange border-t-transparent rounded-full animate-spin" />
            <span className="text-sm font-medium">Checking accounts against masterlist…</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Error ── */}
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

      {/* ── Results panel ── */}
      <AnimatePresence>
        {!isChecking && results && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="bg-white rounded-lg shadow-[0_4px_10px_5px_rgb(0,0,0,0.08)]"
          >
            {/* View tab switcher */}
            <div className="p-3 flex flex-row flex-wrap items-center gap-2 border-b border-gray-100">
              {viewTabs.map(({ key, label, count }) => {
                const isActive = activeView === key;
                return (
                  <button
                    key={key}
                    onClick={() => setActiveView(key)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? key === "found"
                          ? "bg-teiblue text-white shadow-sm"
                          : "bg-teiorange text-white shadow-sm"
                        : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                    }`}
                  >
                    {label}
                    <span
                      className={`inline-flex items-center justify-center min-w-5 h-5 px-1 rounded-full text-xs font-semibold ${
                        isActive ? "bg-white/25 text-white" : "bg-gray-300 text-gray-600"
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
                {renderTable()}
              </motion.div>
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}