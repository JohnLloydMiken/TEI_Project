"use client";

import { motion, AnimatePresence } from "motion/react";
import { X, KeyRound, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { updateUserPassword } from "@/lib/actions/CSD-user-actions";
import { CSDUser } from "./manage-users-client";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  user: CSDUser | null;
}

export default function UpdatePasswordModal({ isOpen, onClose, user }: Props) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reset = () => {
    setCurrentPassword(""); setNewPassword("");
    setShowCurrent(false); setShowNew(false); setError(null);
  };

  const handleClose = () => { reset(); onClose(); };

  const handleSubmit = async () => {
    if (!user || !currentPassword || !newPassword) return;
    setIsLoading(true);
    setError(null);
    const result = await updateUserPassword({
      id: user.id,
      currentPassword,
      newPassword,
    });
    setIsLoading(false);
    if (result.error) { setError(result.error); return; }
    handleClose();
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) handleClose();
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
                    <KeyRound size={18} className="text-tei-blue" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-800">Change Password</h2>
                    {user && <p className="text-xs text-gray-400">{user.name}</p>}
                  </div>
                </div>
                <button
                  onClick={handleClose}
                  className="flex items-center justify-center w-8 h-8 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>
              <p className="text-sm text-gray-400 mb-6 ml-12">
                Verify current password before setting a new one.
              </p>

              <div className="flex flex-col gap-4">
                {/* Current Password */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-gray-700">Current Password</label>
                  <div className="relative">
                    <input
                      type={showCurrent ? "text" : "password"}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="Enter current password"
                      className="w-full px-3 py-2.5 pr-10 rounded-lg border border-gray-200 text-sm text-gray-800 placeholder-gray-300 outline-none focus:border-tei-blue focus:ring-2 focus:ring-tei-blue/10 transition-all"
                    />
                    <button type="button" onClick={() => setShowCurrent(!showCurrent)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                    >
                      {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {/* New Password */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-gray-700">New Password</label>
                  <div className="relative">
                    <input
                      type={showNew ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new password"
                      className="w-full px-3 py-2.5 pr-10 rounded-lg border border-gray-200 text-sm text-gray-800 placeholder-gray-300 outline-none focus:border-tei-blue focus:ring-2 focus:ring-tei-blue/10 transition-all"
                    />
                    <button type="button" onClick={() => setShowNew(!showNew)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                    >
                      {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {error && <p className="text-sm text-red-500">{error}</p>}
              </div>

              <div className="flex items-center justify-end gap-3 mt-6">
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  onClick={handleClose}
                  className="px-5 py-2.5 rounded-lg text-sm font-medium text-gray-600 border border-gray-200 hover:bg-gray-50 transition-all cursor-pointer"
                >Cancel</motion.button>
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  onClick={handleSubmit}
                  disabled={!currentPassword || !newPassword || isLoading}
                  className="px-5 py-2.5 rounded-lg text-sm font-medium text-white bg-tei-blue hover:bg-tei-blue/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer shadow-sm"
                >{isLoading ? "Updating..." : "Update Password"}</motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}