"use client";

import { motion, AnimatePresence } from "motion/react";
import { X, UserRoundPen } from "lucide-react";
import { useState, useEffect } from "react";
import { updateUserDetails } from "@/lib/actions/CSD-user-actions";
import { CSDUser } from "./manage-users-client";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  user: CSDUser | null;
}

export default function UpdateUserModal({ isOpen, onClose, user }: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Sync fields when the target user changes
  useEffect(() => {
    if (user) { setName(user.name); setEmail(user.email); setError(null); }
  }, [user]);

  const handleSubmit = async () => {
    if (!user || !name || !email) return;
    setIsLoading(true);
    setError(null);
    const result = await updateUserDetails({ id: user.id, name, email });
    setIsLoading(false);
    if (result.error) { setError(result.error); return; }
    onClose();
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={handleBackdropClick}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="relative w-full max-w-md mx-4 bg-white rounded-2xl shadow-2xl overflow-hidden"
          >
            <div className="h-1 w-full bg-linear-to-r from-tei-blue via-tei-blue to-tei-orange-lt" />
            <div className="p-6">
              <div className="flex items-start justify-between mb-1">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-tei-blue/10">
                    <UserRoundPen size={18} className="text-tei-blue" />
                  </div>
                  <h2 className="text-lg font-bold text-gray-800">Update User Info</h2>
                </div>
                <button
                  onClick={onClose}
                  className="flex items-center justify-center w-8 h-8 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>
              <p className="text-sm text-gray-400 mb-6 ml-12">Update name and email address.</p>

              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-gray-700">Full Name</label>
                  <input
                    type="text" value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-800 outline-none focus:border-tei-blue focus:ring-2 focus:ring-tei-blue/10 transition-all"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-gray-700">Company Email</label>
                  <input
                    type="email" value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-800 outline-none focus:border-tei-blue focus:ring-2 focus:ring-tei-blue/10 transition-all"
                  />
                </div>
                {error && <p className="text-sm text-red-500">{error}</p>}
              </div>

              <div className="flex items-center justify-end gap-3 mt-6">
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-lg text-sm font-medium text-gray-600 border border-gray-200 hover:bg-gray-50 transition-all cursor-pointer"
                >Cancel</motion.button>
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  onClick={handleSubmit}
                  disabled={!name || !email || isLoading}
                  className="px-5 py-2.5 rounded-lg text-sm font-medium text-white bg-tei-blue hover:bg-tei-blue/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer shadow-sm"
                >{isLoading ? "Saving..." : "Save Changes"}</motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}