// components/dashboard/eligibility-checker/batch/customer-table.tsx
"use client";
import { motion } from "motion/react";
import { toast } from "sonner";
import { Clock, Loader2, } from "lucide-react"; // ← add Loader2
interface BatchList {
  customers: Customer[];
  onRemove: (id: number) => void; // ← new
}
type Customer = {
  id: number;
  accountNo: string;
  customerName: string;
  accountCode:string,
  batch: { month: number; year: number; fileName: string };
  status: "Pending" | "BD Retained";
};
interface BatchList {
  customers: Customer[];
  onRemove: (id: number) => void;
  onClaim: (id: number, accountNo: string) => void; // ← add
  claimingIds: Set<number>; // ← add
}

const StatusBadge = ({ status }: { status: Customer["status"] }) => {
  const styles = {
    "Pending": "bg-green-50 text-green-600 border border-green-200",
    "BD Retained": "bg-blue-50 text-blue-600 border border-blue-200",
  };
  const dotColor = {
    "Pending": "bg-green-500",
    "BD Retained": "bg-blue-500",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${styles[status]}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dotColor[status]}`} />
      {status}
    </span>
  );
};


// Replace ActionButton with this:
const ActionButton = ({
  status,
  isClaiming,
  onClick,
}: {
  status: Customer["status"];
  isClaiming: boolean;
  onClick: () => void;
}) => {
  const isActive = status === "Pending" && !isClaiming;
  return (
    <motion.button
      whileTap={{ scale: 0.96 }}
      whileHover={{ scale: 1.02 }}
      disabled={!isActive}
      onClick={onClick}
      className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors whitespace-nowrap flex items-center gap-1.5
        ${
          isActive
            ? "bg-teiorange text-white hover:bg-orange-600 shadow-sm cursor-pointer"
            : "bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed"
        }`}
    >
      {isClaiming ? (
        <>
          <Loader2 size={14} className="animate-spin" />
          Claiming...
        </>
      ) : (
        <>
          {status === "BD Retained" && "Already Returned"}
          {status === "Pending" && "Mark as Returned"}
        </>
      )}
    </motion.button>
  );
};

export default function CustomerTable({
  customers,
  onRemove,
  onClaim, // ← new
  claimingIds, // ← new
}: BatchList) {
  const formatDate = (d: Date | string | null) =>
    d
      ? new Date(d).toLocaleDateString("en-PH", {
          month: "short",
          day: "numeric",
          year: "numeric",  
        })
      : "—";

  return (
    <motion.div className="overflow-x-auto py-3 px-3">
      <table className="w-full text-sm text-left">
        <thead>
          <tr className="bg-[#f0f4f9]">
            {[
              "Account Number",
              "Account Code",
              "Account Name",
              "Status",
              "Action",
            ].map((h) => (
              <th
                key={h}
                className="text-xs font-bold uppercase tracking-wider text-gray-400 px-4 py-3 whitespace-nowrap"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {customers.map((c) => (
            <tr
              key={c.id}
              className="border-b border-gray-100 hover:bg-[#f8fafc] transition-colors"
            >
              <td className="px-4 py-4">
                <span className="font-mono text-sm font-medium text-teiblue hover:underline cursor-pointer">
                  {c.accountNo}
                </span>
              </td>
              <td className="px-4 py-4">
                <span className="font-mono text-sm font-medium text-teiblue hover:underline cursor-pointer">
                  {c.accountCode}
                </span>
              </td>
                            
              <td className="px-4 py-4">
                <span className="text-sm font-semibold text-gray-800">
                  {c.customerName}
                </span>
              </td>
              <td className="px-4 py-4">
                <StatusBadge status={c.status} />
              </td>
             
              <td className="px-4 py-4">
                <div className="flex items-center gap-2">
                  <ActionButton
                    status={c.status}
                    isClaiming={claimingIds.has(c.id)}
                    onClick={() => onClaim(c.id, c.accountNo)}
                  />
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
    </motion.div>
  );
}
