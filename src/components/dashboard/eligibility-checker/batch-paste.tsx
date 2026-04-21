"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search } from "lucide-react";
import { motion } from "motion/react";
import CustomerCard from "./customer-card";
import { useState, useEffect } from "react";
import useFetchQualifiedUsers from "@/services/useFetchQulifiedUsers";
import { toast } from "sonner";
export default function BatchPasteChecker() {
  const pathname = usePathname();
  const individualPath = "/individual-checker";
  const batchPastePath = "/batch-checker/paste";
  const batchUploadPath = "/batch-checker/upload";
  const [accountNo, setAccountNo] = useState("");
  const [query, setQuery] = useState(""); // ✅ only fetch on button click
  const { customer, loading, error } = useFetchQualifiedUsers(query);

  const tabs = [
    { label: "Individual", href: individualPath },
    { label: "Batch (paste)", href: batchPastePath },
    { label: "Batch (upload)", href: batchUploadPath },
  ];

  function handleCheck() {
    setQuery(accountNo.trim()); // ✅ triggers the useEffect in the hook
  }
  function handleClear(){
    setAccountNo("")
    setQuery("")
    
  }

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="w-full rounded-lg bg-white shadow-[0_4px_10px_5px_rgb(0,0,0,0.08)] flex flex-col"
    >
      {/* Header */}
      <div className="bg-teiblue px-4 py-2 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 rounded-t-lg">
        <p className="text-white text-lg sm:text-xl font-normal">
          Bactch Paste Checker
        </p>
        <p className="text-white/60 text-xs sm:text-sm font-normal">
          Enter account numbes to verify
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
            className="shrink-0 flex flex-row justify-center items-center gap-1.5 sm:gap-2 border border-gray-200 p-2.5 sm:p-3 rounded-lg bg-teiblue text-white text-sm sm:text-base"
          >
            <span className="hidden xs:inline">Search</span>
            <Search color="white" size={18} />
          </motion.button>
        </div>
      </div>

      
    </motion.div>
  );
}
