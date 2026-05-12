import { motion } from "framer-motion";
import { CustomerCardProps } from "@/types/dashboard/customer-card";
import { User, Hash, Fingerprint, CheckCircle2, RotateCcw } from "lucide-react";

function getStatusStyle(status: string | null) {
  switch (status) {
    case "Pending":
      return "bg-amber-50 text-amber-700 border-amber-100";
    case "BD Retained":
      return "bg-blue-50 text-[#1a3a5c] border-blue-100";
    case "Eligible":
      return "bg-emerald-50 text-emerald-700 border-emerald-100";
    default:
      return "bg-slate-50 text-slate-600 border-slate-100";
  }
}

export default function CustomerCard({
  accountName,
  accountNumber,
  status,
  claiming,
  accountCode,
  onClaim,
  onClear,
}: CustomerCardProps) {
  const canClaim = status === "Pending" || status === "Eligible";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }} // Smooth "Springy" ease
      className="w-full max-w-2xl bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-slate-100 overflow-hidden"
    >
      {/* Top Identity Header */}
      <div className="p-8 pb-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-[#1a3a5c] border border-slate-100 shadow-sm">
            <User size={28} strokeWidth={1.5} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">
              Customer Name
            </p>
            <h2 className="text-2xl font-black text-[#1a3a5c] tracking-tight leading-tight">
              {accountName ?? "—"}
            </h2>
          </div>
        </div>

        {/* Status Badge with Pulse */}
        <div className="flex flex-col md:items-end">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
            Verification Status
          </p>
          <span className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold border transition-colors ${getStatusStyle(status)}`}>
            {(status === "Pending" || status === "Eligible") && (
              <span className="w-2 h-2 bg-current rounded-full animate-pulse" />
            )}
            {status ?? "Unknown"}
          </span>
        </div>
      </div>

      {/* Technical Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 bg-slate-50/50 border-y border-slate-100">
        <div className="p-6 md:border-r border-slate-100 flex items-center gap-4">
          <div className="p-2.5 bg-white rounded-xl shadow-sm border border-slate-100">
            <Fingerprint size={20} className="text-[#e87722]" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Account Code
            </p>
            <p className="font-mono font-bold text-[#1a3a5c] text-base">
              {accountCode ?? "N/A"}
            </p>
          </div>
        </div>
        <div className="p-6 flex items-center gap-4">
          <div className="p-2.5 bg-white rounded-xl shadow-sm border border-slate-100">
            <Hash size={20} className="text-[#e87722]" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Account No.
            </p>
            <p className="font-mono font-bold text-[#1a3a5c] text-base">
              {accountNumber ?? "—"}
            </p>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="p-4 bg-white flex gap-3">
        <button
          onClick={onClear}
          className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-slate-50 hover:bg-slate-100 text-slate-500 font-bold rounded-2xl transition-all active:scale-95"
        >
          <RotateCcw size={18} />
          Clear
        </button>
        <button
          disabled={!canClaim || claiming}
          onClick={onClaim}
          className={`flex-2 flex items-center justify-center gap-2 py-3.5 font-bold rounded-2xl shadow-lg transition-all active:scale-[0.98]
            ${canClaim && !claiming
              ? "bg-[#e87722] hover:bg-[#cf6a1f] text-white shadow-[#e87722]/20"
              : "bg-slate-100 text-slate-400 cursor-not-allowed shadow-none"
            }`}
        >
          {claiming ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Processing...
            </span>
          ) : (
            <>
              <CheckCircle2 size={18} />
              {status === "BD Retained" ? "Untagged AS BD Retained" : "Mark As BD Retained"}
            </>
          )}
        </button>
      </div>

      {/* Brand Accent */}
      <div className="h-1.5 w-full bg-linear-to-r from-[#1a3a5c] via-[#e87722] to-[#1a3a5c]/20" />
    </motion.div>
  );
}