// components/dashboard/eligibility-checker/batch/pending-table.tsx
"use client";
import { AnimatePresence, motion } from "motion/react";
import { CheckedCustomer } from "@/lib/actions/batch";
import { Loader2, AlertTriangle, X } from "lucide-react";
import { useState } from "react";

interface BatchList {
  customers: CheckedCustomer[];
  onRemove: (id: number) => void;
  onClaim: (id: number) => void;
  claimingIds: Set<number>;
}

interface PendingClaim {
  id: number;
  customerName: string;
  accountNo: string;
  status: string;
}

const StatusBadge = ({ status }: { status: string }) => {
  const styles: Record<string, string> = {
    Pending: "bg-yellow-50 text-yellow-600 border border-yellow-200",
    "BD Retained": "bg-blue-50 text-blue-600 border border-blue-200",
  };
  const dotColor: Record<string, string> = {
    Pending: "bg-yellow-500",
    "BD Retained": "bg-blue-500",
  };
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
        styles[status] ?? "bg-gray-100 text-gray-500 border border-gray-200"
      }`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dotColor[status] ?? "bg-gray-400"}`} />
      {status}
    </span>
  );
};

const ActionButton = ({
  status,
  isClaiming,
  onClick,
}: {
  status: string;
  isClaiming: boolean;
  onClick: () => void;
}) => {
  const canAct = (status === "Pending" || status === "BD Retained") && !isClaiming;
  const isUntagging = status === "BD Retained";

  return (
    <motion.button
      whileTap={{ scale: 0.96 }}
      whileHover={{ scale: canAct ? 1.02 : 1 }}
      disabled={!canAct}
      onClick={onClick}
      className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors whitespace-nowrap flex items-center gap-1.5
        ${
          canAct
            ? isUntagging
              ? "bg-amber-500 text-white hover:bg-amber-600 shadow-sm cursor-pointer"
              : "bg-teiorange text-white hover:bg-orange-600 shadow-sm cursor-pointer"
            : "bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed"
        }`}
    >
      {isClaiming ? (
        <>
          <Loader2 size={14} className="animate-spin" />
          Processing...
        </>
      ) : isUntagging ? (
        "Untag as BD Retained"
      ) : (
        "Mark as BD Retained"
      )}
    </motion.button>
  );
};

function ConfirmModal({
  pending,
  onConfirm,
  onCancel,
}: {
  pending: PendingClaim;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  const isUntagging = pending.status === "BD Retained";

  return (
    <motion.div
      key="backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
    >
      <motion.div
        key="modal"
        initial={{ opacity: 0, scale: 0.95, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 12 }}
        transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-sm bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden"
      >
        <div className="flex items-center justify-between px-6 pt-6 pb-4">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl ${isUntagging ? "bg-amber-50 text-amber-600" : "bg-emerald-50 text-emerald-600"}`}>
              <AlertTriangle size={20} />
            </div>
            <h3 className="text-base font-black text-[#1a3a5c] tracking-tight">
              {isUntagging ? "Untag Customer?" : "Mark as BD Retained?"}
            </h3>
          </div>
          <button onClick={onCancel} className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all">
            <X size={18} />
          </button>
        </div>

        <div className="px-6 pb-6 flex flex-col gap-5">
          <p className="text-sm text-slate-500 leading-relaxed">
            {isUntagging
              ? `This will revert ${pending.customerName} back to Pending.`
              : `This will tag ${pending.customerName} as BD Retained.`}{" "}
            <span className="font-semibold text-slate-700">Are you sure you want to continue?</span>
          </p>

          <div className="rounded-2xl bg-slate-50 border border-slate-100 px-4 py-3 flex flex-col gap-1">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Affected Account</p>
            <p className="font-black text-[#1a3a5c] text-sm">{pending.customerName}</p>
            <p className="font-mono text-xs text-slate-400">{pending.accountNo}</p>
          </div>

          <div className="flex gap-3">
            <button onClick={onCancel} className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-2xl transition-all active:scale-95 text-sm">
              Cancel
            </button>
            <button
              onClick={onConfirm}
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

        <div className="h-1 w-full bg-gradient-to-r from-[#1a3a5c] via-[#e87722] to-[#1a3a5c]/20" />
      </motion.div>
    </motion.div>
  );
}

export default function Pending({ customers, onRemove, onClaim, claimingIds }: BatchList) {
  const [pendingClaim, setPendingClaim] = useState<PendingClaim | null>(null);

  function requestClaim(c: CheckedCustomer) {
    setPendingClaim({ id: c.id, customerName: c.customerName, accountNo: c.accountNo, status: c.status });
  }

  function handleConfirm() {
    if (!pendingClaim) return;
    onClaim(pendingClaim.id);
    setPendingClaim(null);
  }

  return (
    <>
      <AnimatePresence>
        {pendingClaim && (
          <ConfirmModal pending={pendingClaim} onConfirm={handleConfirm} onCancel={() => setPendingClaim(null)} />
        )}
      </AnimatePresence>

      <div className="py-3 px-3">
        {/* Desktop */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="bg-[#f0f4f9]">
                {["Account Number", "Account Code", "Account Name", "Status", "Action"].map((h) => (
                  <th key={h} className="text-xs font-bold uppercase tracking-wider text-gray-400 px-4 py-3 whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {customers.map((c) => (
                <tr key={c.id} className="border-b border-gray-100 hover:bg-[#f8fafc] transition-colors">
                  <td className="px-4 py-4"><span className="font-mono text-sm font-medium text-teiblue">{c.accountNo}</span></td>
                  <td className="px-4 py-4"><span className="font-mono text-sm font-medium text-teiblue">{c.accountCode}</span></td>
                  <td className="px-4 py-4"><span className="text-sm font-semibold text-gray-800">{c.customerName}</span></td>
                  <td className="px-4 py-4"><StatusBadge status={c.status} /></td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <ActionButton status={c.status} isClaiming={claimingIds.has(c.id)} onClick={() => requestClaim(c)} />
                      <motion.button
                        whileTap={{ scale: 0.96 }}
                        whileHover={{ scale: 1.02 }}
                        onClick={() => onRemove(c.id)}
                        className="px-4 py-2 rounded-lg text-sm font-semibold border border-gray-200 bg-gray-100 text-gray-400 hover:bg-red-50 hover:text-red-400 hover:border-red-200 transition-colors whitespace-nowrap cursor-pointer"
                      >
                        Remove
                      </motion.button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile */}
        <div className="flex flex-col gap-3 md:hidden">
          {customers.map((c) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-xl border border-gray-200 bg-white shadow-sm p-4 flex flex-col gap-3"
            >
              <div className="flex items-start justify-between gap-2">
                <span className="text-sm font-semibold text-gray-800 leading-snug">{c.customerName}</span>
                <StatusBadge status={c.status} />
              </div>
              <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-xs">
                <div>
                  <p className="text-gray-400 font-bold uppercase tracking-wider mb-0.5">Account No.</p>
                  <span className="font-mono font-medium text-teiblue">{c.accountNo}</span>
                </div>
                <div>
                  <p className="text-gray-400 font-bold uppercase tracking-wider mb-0.5">Account Code</p>
                  <span className="font-mono font-medium text-teiblue">{c.accountCode}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 pt-1 border-t border-gray-100">
                <ActionButton status={c.status} isClaiming={claimingIds.has(c.id)} onClick={() => requestClaim(c)} />
                <motion.button
                  whileTap={{ scale: 0.96 }}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => onRemove(c.id)}
                  className="px-4 py-2 rounded-lg text-sm font-semibold border border-gray-200 bg-gray-100 text-gray-400 hover:bg-red-50 hover:text-red-400 hover:border-red-200 transition-colors whitespace-nowrap cursor-pointer"
                >
                  Remove
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </>
  );
}