"use client";
import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { Customer } from "@/types/customer";
import { ChevronLeft, ChevronRight } from "lucide-react";

type TabKey = "all" | "Pending" | "BD Retained";

const HEADERS = ["Account No.", "Account Code", "Full Name", "Status"];

const tabs: { key: TabKey; label: string }[] = [
  { key: "all",         label: "All"         },
  { key: "Pending",     label: "Pending"      },
  { key: "BD Retained", label: "BD Retained"  },
];
const StatusBadge = ({ status }: { status: Customer["status"] }) => {
  const styles: Record<string, string> = {
    Pending:      "bg-yellow-50 text-yellow-600 border border-yellow-200",
    "BD Retained":"bg-blue-50  text-blue-600  border border-blue-200",
  };
  const dot: Record<string, string> = {
    Pending:      "bg-yellow-500",
    "BD Retained":"bg-blue-500",
  };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${styles[status]}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dot[status]}`} />
      {status}
    </span>
  );
};
interface Props {
  customers: Customer[];
  total: number;
  pageCount: number;
  currentPage: number;
  currentStatus?: string;
}

export default function CustomersTable({
  customers,
  total,
  pageCount,
  currentPage,
  currentStatus,
}: Props) {
  const router = useRouter();
  const pathname = usePathname();

  const navigate = (page: number, status?: string) => {
    const params = new URLSearchParams();
    params.set("page", String(page));
    if (status && status !== "all") params.set("status", status);
    router.push(`${pathname}?${params.toString()}`);
  };

  const activeTab: TabKey = (currentStatus as TabKey) ?? "all";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white rounded-lg shadow-[0_4px_10px_5px_rgb(0,0,0,0.08)]"
    >
      {/* Tab Bar */}
      <div className="flex items-center gap-1 px-4 pt-3 pb-0 border-b border-gray-100 relative">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => navigate(1, tab.key)}
            className={`px-4 py-2 rounded-t-lg text-sm font-semibold transition-colors cursor-pointer
              ${activeTab === tab.key
                ? "bg-teiblue text-white"
                : "text-gray-500 hover:bg-gray-100"
              }`}
          >
            {tab.label}
          </button>
        ))}
         {/* Pagination Controls */}
      <div className="absolute right-0 flex items-center justify-between px-4 py-3 ">
        <p className="text-xs text-gray-400">
          Page {currentPage} of {pageCount}
        </p>
        <div className="flex items-center gap-1">
          <button
            disabled={currentPage <= 1}
            onClick={() => navigate(currentPage - 1, activeTab)}
            className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
          >
            <ChevronLeft size={16} />
          </button>

          {/* Page number buttons — show a window around current page */}
          {Array.from({ length: pageCount }, (_, i) => i + 1)
            .filter((p) => p === 1 || p === pageCount || Math.abs(p - currentPage) <= 1)
            .reduce<(number | "...")[]>((acc, p, i, arr) => {
              if (i > 0 && p - (arr[i - 1] as number) > 1) acc.push("...");
              acc.push(p);
              return acc;
            }, [])
            .map((p, i) =>
              p === "..." ? (
                <span key={`ellipsis-${i}`} className="px-2 text-gray-400 text-sm">…</span>
              ) : (
                <button
                  key={p}
                  onClick={() => navigate(p as number, activeTab)}
                  className={`w-8 h-8 rounded-lg text-sm font-semibold transition-colors cursor-pointer
                    ${currentPage === p
                      ? "bg-teiblue text-white"
                      : "hover:bg-gray-100 text-gray-600"
                    }`}
                >
                  {p}
                </button>
              )
            )}

          <button
            disabled={currentPage >= pageCount}
            onClick={() => navigate(currentPage + 1, activeTab)}
            className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto px-3 py-3">
        <table className="w-full text-sm text-left">
          <thead>
            <tr className="bg-[#f0f4f9]">
              {HEADERS.map((h) => (
                <th key={h} className="text-xs font-bold uppercase tracking-wider text-gray-400 px-4 py-3 whitespace-nowrap">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {customers.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-gray-400">No records found.</td>
              </tr>
            ) : (
              customers.map((c) => (
                <tr key={c.id} className="border-b border-gray-100 hover:bg-[#f8fafc] transition-colors">
                  <td className="px-4 py-4 font-mono text-sm font-medium text-teiblue">{c.accountNo}</td>
                  <td className="px-4 py-4 text-gray-700">{c.accountCode}</td>
                  <td className="px-4 py-4 font-semibold text-gray-800">{c.customerName}</td>
                  <td className="px-4 py-4"><StatusBadge status={c.status} /></td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

    
    </motion.div>
  );
}