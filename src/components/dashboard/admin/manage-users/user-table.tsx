"use client";

import { motion } from "motion/react";
import { useState } from "react";
import { CSDUser } from "./manage-users-client";
import UpdateUserModal from "./update-user-modal";
import UpdatePasswordModal from "./update-password-modal";

interface Props {
  initialUsers: CSDUser[];
}

export default function CSDUserTable({ initialUsers }: Props) {
  const [editTarget, setEditTarget] = useState<CSDUser | null>(null);
  const [passwordTarget, setPasswordTarget] = useState<CSDUser | null>(null);

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="overflow-x-auto py-3 px-3 bg-white rounded-lg"
      >
        <table className="w-full text-sm text-left border-collapse">
          <thead>
            <tr className="bg-tei-blue">
              {["Full Name", "Email", "Created At", "Tagged Processed", "Edit Info", "Edit Password"].map((h) => (
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
            {initialUsers.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-gray-400 text-sm">
                  No users found.
                </td>
              </tr>
            )}
            {initialUsers.map((user, index) => (
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
                    month: "long", day: "numeric", year: "numeric",
                  })}
                </td>
                <td className="px-4 py-3 text-gray-600">{user.taggedCount}</td>

                {/* Edit Info */}
                <td className="px-4 py-3">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    onClick={() => setEditTarget(user)}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium text-white bg-tei-orange-lt hover:bg-tei-orange-lt/90 transition-all cursor-pointer shadow-sm"
                  >
                    Edit
                  </motion.button>
                </td>

                {/* Edit Password */}
                <td className="px-4 py-3">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    onClick={() => setPasswordTarget(user)}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium text-white bg-slate-500 hover:bg-slate-600 transition-all cursor-pointer shadow-sm"
                  >
                    Password
                  </motion.button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </motion.div>

      {/* Modals */}
      <UpdateUserModal
        isOpen={!!editTarget}
        user={editTarget}
        onClose={() => setEditTarget(null)}
      />
      <UpdatePasswordModal
        isOpen={!!passwordTarget}
        user={passwordTarget}
        onClose={() => setPasswordTarget(null)}
      />
    </>
  );
}