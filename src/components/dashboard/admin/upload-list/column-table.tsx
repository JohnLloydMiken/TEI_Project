"use client";
import { motion } from "motion/react";

export default function ColumnTable() {
  const expectedFormat = [
    { column: ["accountNo", "customerName", "depositAmount", "notificationDate", "phone", "email"] },
    { type: ["Text", "Text", "Number", "Date", "Number", "Text"] },
    { required: ["Yes", "Yes", "Yes", "Yes", "Optional", "Optional"] },
  ];

  // Extract arrays for easier access
  const columns = expectedFormat[0].column || [];
  const types = expectedFormat[1].type || [];
  const requirements = expectedFormat[2].required || [];

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="overflow-x-auto py-3 px-3"
    >
      <table className="w-full text-sm text-left border-collapse">
        <thead>
          <tr className="bg-[#f0f4f9]">
            {["Column", "Type", "Required"].map((h) => (
              <th
                key={h}
                className="text-xs font-bold uppercase tracking-wider text-gray-400 px-4 py-3 whitespace-nowrap"
              >
                {h}
              
            </th>
            )
            )}
          </tr>
        </thead>
        <tbody>

          {columns.map((colName, index) => (
            <tr key={colName} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
              <td className="px-4 py-3 font-medium text-gray-700">{colName}</td>
              <td className="px-4 py-3 text-gray-600">{types[index]}</td>
              <td className="px-4 py-3">
                <span className={requirements[index] === "Yes" ? "text-blue-600 font-semibold" : "text-gray-400"}>
                  {requirements[index]}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </motion.div>
  );
}
