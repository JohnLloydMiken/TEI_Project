import { motion } from "framer-motion"; // Changed to framer-motion standard
import { CustomerCardProps } from "@/types/dashboard/customer-card";
import { User, IdCard, Clock10, CheckCircle } from "lucide-react";

function getStatusStyle(status: string | null) {
  if (status === "Pending"){
     return "bg-yellow-100 text-yellow-800";
  }else if (status === "BD Retained"){
    return "bg-blue-100 text-blue-800"
  }else{
      return "bg-gray-100 text-gray-600";
  }
  
}

export default function CustomerCard({
  accountName,
  accountNumber,
  status,
  claiming,
  onClaim,
  onClear,
}: CustomerCardProps) {
  const canClaim = status === "Pending";

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
          {!claiming && status === "BD Retained" && "Customer BD Retained"}
          {!claiming && status === "Expired" && "Eligibility Expired"}
          {!claiming && status === "Eligible" && "Mark as BD Retained"}
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
