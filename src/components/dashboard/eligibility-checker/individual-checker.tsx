"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search } from "lucide-react";
import { motion } from "motion/react";
import CustomerCard from "./customer-card";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  CheckedCustomer,
  checkSingleAccountAction,
  toggleCustomerStatusAction,
} from "@/lib/actions/batch";

export default function IndividualChecker() {
  const pathname = usePathname();
  const [accountNo, setAccountNo] = useState("");
  const [customer, setCustomer] = useState<CheckedCustomer | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [claimingIds, setClaimingIds] = useState<Set<number>>(new Set());

  const tabs = [
    { label: "Individual", href: "/individual-checker" },
    { label: "Batch (paste)", href: "/batch-checker/paste" },
    { label: "Batch (upload)", href: "/batch-checker/upload" },
  ];

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  async function handleCheck() {
    const trimmed = accountNo.trim();
    if (!trimmed) return;

    setLoading(true);
    setError(null);
    setCustomer(null);

    const res = await checkSingleAccountAction(trimmed);

    if (res.success) {
      setCustomer(res.customer);
    } else {
      setError(res.error);
    }

    setLoading(false);
  }

  async function handleClaim() {
    if (!customer?.id) return;

    setClaimingIds((prev) => new Set(prev).add(customer.id));

    const res = await toggleCustomerStatusAction(customer.id);

    if (res.success) {
      setCustomer((prev) => (prev ? { ...prev, status: res.newStatus } : prev));
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
      next.delete(customer.id);
      return next;
    });
  }

  function handleClear() {
    setAccountNo("");
    setCustomer(null);
    setError(null);
  }

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
          onKeyDown={(e) => e.key === "Enter" && handleCheck()}
          placeholder="Enter Account Number (e.g. 906-2370-000)"
          className="w-full h-12 pl-14 pr-36 bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 outline-none focus:ring-2 focus:ring-gray-300/50 focus:border-gray-300 transition-all text-lg"
        />
        <button
          onClick={handleCheck}
          disabled={loading}
          className="absolute right-2 top-2 bottom-2 px-8 bg-[#1a3a5c] text-white font-bold rounded-xl hover:bg-[#244a75] transition-all active:scale-95 shadow-lg shadow-[#1a3a5c]/20 disabled:opacity-60"
        >
          {loading ? "Checking..." : "Verify"}
        </button>
      </div>

      {/* Results */}
      <div className="p-4 flex flex-col justify-center items-center">
        <hr className="border-gray-200" />
        {!customer ? (
          <p className="text-center text-xs sm:text-sm uppercase text-gray-400 tracking-wider">
            Your results are here
          </p>
        ) : (
          <CustomerCard
            accountName={customer.customerName}
            accountNumber={customer.accountNo}
            accountCode={customer.accountCode}
            status={customer.status ?? null}
            onClear={handleClear}
            onClaim={handleClaim}
            claiming={claimingIds.has(customer.id)}
          />
        )}
      </div>
    </motion.div>
  );
}