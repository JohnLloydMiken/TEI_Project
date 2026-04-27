import { motion } from "framer-motion"; // Changed to framer-motion standard
import { CustomerCardProps } from "@/types/dashboard/customer-card";
import { User, IdCard, Clock10, CheckCircle } from "lucide-react";
import { div } from "motion/react-client";

const STATUS_STYLES: Record<string, string> = {
  Eligible: "bg-green-100 text-green-800",
  NotFound: "bg-amber-100 text-amber-800",
  Claimed: "bg-blue-100 text-blue-800",
  Expired: "bg-red-100 text-red-800",
};

function getStatusStyle(status: string | null) {
  if (!status) return "bg-gray-100 text-gray-600";
  return STATUS_STYLES[status] ?? "bg-gray-100 text-gray-600";
}

export default function CustomerCard({
  accountName,
  accountNumber,
  notifiedDate,
  deadlineDate,
  daysRemaining, // Fixed spelling
  depositAmount,
  status,
  claiming,
  onClaim,
  onClear,
}: CustomerCardProps) {
  const canClaim = status === "Eligible";
  const totalDays = 30;
  const elapsed = totalDays - Number(daysRemaining ?? 0);
  const progressPct = Math.min(100, Math.max(0, (elapsed / totalDays) * 100));

  const formatDate = (d: Date | string | null) =>
    d
      ? new Date(d).toLocaleDateString("en-PH", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      : "—";

  const formatAmount = (a: number | string | null) =>
    a !== null && a !== ""
      ? `₱${Number(a).toLocaleString("en-PH", { minimumFractionDigits: 2 })}`
      : "—";

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="relative md:w-10/12 lg:w-2/5 bg-linear-to-br from-white to-gray-50 rounded-2xl p-5 border border-gray-100 shadow-sm w-11/12 overflow-hidden"
    >
      {/* The Gradient Left Border */}
      <div className="absolute inset-y-0 left-0 w-1 bg-linear-to-b rounded-xl from-teiorange  to-teiblue" />

      {/* Header */}
      <div className="relative z-10 flex items-start justify-between mb-4">
        <div className="flex flex-col gap-2.5">
          <div className="flex items-center gap-2">
            <User size={16} className="text-gray-400" />
            <p className="text-lg font-semibold text-gray-900">
              {accountName ?? "—"}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <IdCard size={16} className="text-gray-400" />
            <div>
              <p className="text-[10px] uppercase tracking-wider text-gray-400 leading-tight">
                Account No.
              </p>
              <p className="text-sm font-bold text-teiblue">
                {accountNumber ?? "—"}
              </p>
            </div>
          </div>
        </div>
        <span
          className={`text-xs font-semibold px-2.5 py-1 rounded-full ${getStatusStyle(status)}`}
        >
          {status ?? "Unknown"}
        </span>
      </div>

      {/* Notified + Deposit */}
      <div className="relative z-10 border-t border-gray-50 pt-4 pb-4 flex items-end justify-between">
        <div>
          <p className="text-[11px] text-gray-400">Notified on</p>
          <p className="text-[14px] font-medium text-gray-900 mt-0.5">
            {formatDate(notifiedDate)}
          </p>
        </div>
        <div className="text-right">
          <p className="text-[11px] text-gray-400">Deposit Amount</p>
          <p className="text-xl font-bold text-gray-900 tracking-tight">
            {formatAmount(depositAmount)}
          </p>
        </div>
      </div>

      {/* Timeline */}
      <div className="relative z-10 border-t border-gray-50 pt-4 mb-5">
        <div className="flex items-center gap-1.5 mb-3">
          <Clock10 size={14} className="text-gray-400" />
          <span className="text-xs font-medium text-gray-500">Timeline</span>
        </div>

        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] text-gray-400">Notified</span>
          <div className="flex flex-col items-center">
            <span className="text-2xl font-bold text-gray-900 leading-none">
              {daysRemaining ?? 0}
            </span>
            <span className="text-[10px] font-medium text-gray-400 uppercase">
              Days Left
            </span>
          </div>
          <span className="text-[11px] text-gray-400">Deadline</span>
        </div>

        {/* Animated progress bar */}
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden mb-2">
          <motion.div
            initial={{ width: "0%" }}
            animate={{ width: `${progressPct}%` }}
            transition={{ duration: 1, ease: "circOut", delay: 0.2 }}
            className="h-full rounded-full bg-linear-to-r from-blue-500 to-red-400"
          />
        </div>

        <div className="flex justify-between text-[11px] font-medium text-gray-500">
          <span>{formatDate(notifiedDate)}</span>
          <span>{formatDate(deadlineDate)}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="relative z-10 flex gap-2">
        <button
          disabled={!canClaim || claiming}
          onClick={onClaim}
          className={`flex-1 flex items-center justify-center gap-2 text-[13px] font-semibold py-2.5 rounded-xl transition-all shadow-sm
      ${
        canClaim && !claiming
          ? "bg-blue-600 hover:bg-blue-700 active:scale-95 text-white shadow-blue-200"
          : "bg-gray-100 text-gray-400 cursor-not-allowed"
      }`}
        >
          <CheckCircle size={15} />
          {claiming && "Claiming..."}
          {!claiming && status === "Claimed" && "Already Claimed"}
          {!claiming && status === "Expired" && "Eligibility Expired"}
          {!claiming && status === "Eligible" && "Mark as Claimed"}
          {!claiming && !status && "Mark as Claimed"}
        </button>
        <button
          onClick={onClear}
          className="flex-[0.4] text-[13px] font-semibold text-gray-600 border border-gray-200 rounded-xl py-2.5 hover:bg-gray-50 transition-all active:scale-95"
        >
          Clear
        </button>
      </div>
    </motion.div>
  );
}
