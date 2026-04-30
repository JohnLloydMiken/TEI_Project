"use client";
import { motion } from "motion/react";
import { useFetchCSDUsers } from "@/services/useFetchCSDUser";

export default function CSDUserTable() {
  const { users, isLoading, error } = useFetchCSDUsers();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="overflow-x-auto py-3 px-3 bg-white rounded-lg"
    >
      <table className="w-full text-sm text-left border-collapse">
        <thead>
          <tr className="bg-tei-blue">
            {["Full Name", "Email", "Created At", "Returned Processed", "Edit User"].map((h) => (
              <th
                key={h}
                className="text-xs font-bold uppercase tracking-wider text-white px-4 py-3 whitespace-nowrap shadow-[0_4px_10px_5px_rgb(0,0,0,0.08)]"
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
                Loading users...
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
          {!isLoading && !error && users.map((user, index) => (
            <tr
              key={user.id}
              className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                index % 2 === 0 ? "bg-white" : "bg-slate-50/50"
              }`}
            >
              <td className="px-4 py-3 font-medium text-gray-700">{user.name}</td>
              <td className="px-4 py-3 text-gray-600">{user.email}</td>
              <td className="px-4 py-3 text-gray-600">
                {new Date(user.createdAt).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </td>
              <td className="px-4 py-3 text-gray-600">{user.claimsProcessed}</td>
              <td className="px-4 py-3">
                {/* Edit button — wired up later */}
                <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-white bg-tei-orange-lt hover:bg-tei-orange-lt/90 transition-all cursor-pointer shadow-sm">
                  Edit
                </button>
              </td>
            </tr>
          ))}
          {!isLoading && !error && users.length === 0 && (
            <tr>
              <td colSpan={5} className="px-4 py-6 text-center text-gray-400 text-sm">
                No users found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </motion.div>
  );
}