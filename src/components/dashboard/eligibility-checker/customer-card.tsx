"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CustomerCardProps } from "@/types/dashboard/customer-card";
import {
  User,
  Hash,
  Fingerprint,
  CheckCircle2,
  RotateCcw,
  AlertTriangle,
  X,
} from "lucide-react";

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
  const [showModal, setShowModal] = useState(false);
  const canClaim = status === "Pending" || status === "Eligible" || status === "BD Retained";

  const isUntagging = status === "BD Retained";
  const actionLabel = isUntagging ? "Untag as BD Retained" : "Mark as BD Retained";
  const modalTitle = isUntagging ? "Untag Customer?" : "Mark as BD Retained?";
  const modalMessage = isUntagging
    ? `This will revert ${accountName ?? "this customer"} back to Pending.`
    : `This will tag ${accountName ?? "this customer"} as BD Retained.`;

  async function handleConfirm() {
    setShowModal(false);
    await onClaim();
  }

  return (
    <>
      {/* Confirm Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            key="modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
          >
            <motion.div
              key="modal-card"
              initial={{ opacity: 0, scale: 0.95, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 12 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-sm bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between px-6 pt-6 pb-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-xl ${
                      isUntagging
                        ? "bg-amber-50 text-amber-600"
                        : "bg-emerald-50 text-emerald-600"
                    }`}
                  >
                    <AlertTriangle size={20} />
                  </div>
                  <h3 className="text-base font-black text-[#1a3a5c] tracking-tight">
                    {modalTitle}
                  </h3>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Modal Body */}
              <div className="px-6 pb-6 flex flex-col gap-5">
                <p className="text-sm text-slate-500 leading-relaxed">
                  {modalMessage}{" "}
                  <span className="font-semibold text-slate-700">
                    Are you sure you want to continue?
                  </span>
                </p>

                {/* Customer mini-summary */}
                <div className="rounded-2xl bg-slate-50 border border-slate-100 px-4 py-3 flex flex-col gap-1">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Affected Account
                  </p>
                  <p className="font-black text-[#1a3a5c] text-sm">
                    {accountName ?? "—"}
                  </p>
                  <p className="font-mono text-xs text-slate-400">
                    {accountNumber ?? "—"}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowModal(false)}
                    className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-2xl transition-all active:scale-95 text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirm}
                    className={`flex-1 py-3 font-bold rounded-2xl text-sm shadow-lg transition-all active:scale-95 text-white ${
                      isUntagging
                        ? "bg-amber-500 hover:bg-amber-600 shadow-amber-500/20"
                        : "bg-[#e87722] hover:bg-[#cf6a1f] shadow-[#e87722]/20"
                    }`}
                  >
                    Confirm
                  </button>
                </div>
              </div>

              {/* Brand accent */}
              <div className="h-1 w-full bg-gradient-to-r from-[#1a3a5c] via-[#e87722] to-[#1a3a5c]/20" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Customer Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
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

          {/* Status Badge */}
          <div className="flex flex-col md:items-end">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
              Verification Status
            </p>
            <span
              className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold border transition-colors ${getStatusStyle(status)}`}
            >
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
            onClick={() => setShowModal(true)}
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
                {actionLabel}
              </>
            )}
          </button>
        </div>

        {/* Brand Accent */}
        <div className="h-1.5 w-full bg-gradient-to-r from-[#1a3a5c] via-[#e87722] to-[#1a3a5c]/20" />
      </motion.div>
    </>
  );
}