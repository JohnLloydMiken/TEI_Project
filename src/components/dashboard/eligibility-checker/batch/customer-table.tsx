"use client";
import { motion } from "motion/react";

import { toast } from "sonner";

interface BatchList {
  customers: Customer[];
}
type Customer = {
  id: number;
  accountNo: string;
  customerName: string;
  depositAmount: string;
  notificationDate: string;
  claimedAt: string | null;
  claimedBy: number | null;
  batch: {
    month: number;
    year: number;
    fileName: string;
  };
  deadlineDate: string;
  daysRemaining: number;
  isExpired: Boolean;
  status: "Eligible" | "Expired" | "Claimed";
};

export default function CustomerTable({ customers }: BatchList) {
  const formatDate = (d: Date | string | null) =>
    d
      ? new Date(d).toLocaleDateString("en-PH", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      : "—";

  if (!customers) {
    toast.error("User Not Found");
  }
  return (
    <motion.div className="overflow-x-auto  sm:px-6 py-3">
      <table className="w-full text-sm text-left ">
        {/* ✅ thead outside tbody, both direct children of table */}

        <thead className="">
          <tr className="bg-teiblue">
            <th className="text-white text-[1rem] font-normal px-4 py-3">Account Number</th>
            <th className="text-white text-[1rem] font-normal px-4 py-3">Account Name</th>
            <th className="text-white text-[1rem] font-normal px-4 py-3">Status</th>
            <th className="text-white text-[1rem] font-normal px-4 py-3">Notified Date</th>
            <th className="text-white text-[1rem] font-normal px-4 py-3">Days Remaining</th>
            <th className="text-white text-[1rem] font-normal px-4 py-3">Deadline Date</th>
            <th className="text-white text-[1rem] font-normal px-4 py-3">Action</th>
          </tr>
        </thead>

        <tbody>
          {customers.map((c) => (
            // ✅ key on tr, not on fragment
            <tr key={c.id} className="border-b border-b-gray-300">
              {/* ✅ td inside tr, not tr inside tr */}
              <td className="text-gray-400 text-sm font-normal px-4 py-3">{c.accountNo}</td>
              <td className="text-gray-400 text-sm font-normal px-4 py-3">{c.customerName}</td>
              <td>{c.status}</td>
              <td className="text-gray-400 text-sm font-normal px-4 py-3">{formatDate(c.notificationDate)}</td>
              <td>{c.daysRemaining}</td>
              <td className="text-gray-400 text-sm font-normal px-4 py-3">{formatDate(c.deadlineDate)}</td>
              <td>
                <motion.button whileTap={{ scale: 0.96 }}>
                  Mark as Claimed
                </motion.button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </motion.div>
  );
}
