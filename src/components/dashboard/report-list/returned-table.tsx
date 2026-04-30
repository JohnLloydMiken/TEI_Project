"use client";
import { motion } from "motion/react";
import { useFetchReturnedCustomers } from "@/services/useFetchReturnedCustomers";

const HEADERS = ["Account No.", "Full Name", "Notif. Date", "Claim / Returned Date", "Processed By"];

const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

export default function ReturnedCustomersTable() {
  const { customers, isLoading, error } = useFetchReturnedCustomers();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="overflow-x-auto py-3 px-3 bg-white rounded-lg shadow-[0_4px_10px_5px_rgb(0,0,0,0.08)]"
    >
      <table className="w-full text-sm text-left border-collapse">
        <thead>
          <tr className="bg-tei-blue">
            {HEADERS.map((h) => (
              <th
                key={h}
                className="text-xs font-bold uppercase tracking-wider text-white px-4 py-3 whitespace-nowrap"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {isLoading && (
            <tr>
              <td colSpan={5} className="px-4 py-6 text-center text-gray-400 text-sm">
                Loading...
              </td>
            </tr>
          )}
          {error && (
            <tr>
              <td colSpan={5} className="px-4 py-6 text-center text-red-400 text-sm">
                {error}
              </td>
            </tr>
          )}
          {!isLoading && !error && customers.map((c, index) => (
            <tr
              key={c.id}
              className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                index % 2 === 0 ? "bg-white" : "bg-slate-50/50"
              }`}
            >
              <td className="px-4 py-3 text-gray-700 font-medium">{c.accountNo}</td>
              <td className="px-4 py-3 text-gray-700">{c.customerName}</td>
              <td className="px-4 py-3 text-gray-600">{formatDate(c.notificationDate)}</td>
              <td className="px-4 py-3 text-gray-600">{formatDate(c.claimedAt)}</td>
              <td className="px-4 py-3 text-gray-600">{c.processedBy}</td>
            </tr>
          ))}
          {!isLoading && !error && customers.length === 0 && (
            <tr>
              <td colSpan={5} className="px-4 py-6 text-center text-gray-400 text-sm">
                No returned customers found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </motion.div>
  );
}