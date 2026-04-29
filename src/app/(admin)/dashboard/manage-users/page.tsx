"use client";
import { motion } from "motion/react";
import { UserRoundPlus } from "lucide-react";
import CSDWidgets from "@/components/dashboard/admin/manage-users/widget";
import CreateUserModal from "@/components/dashboard/admin/manage-users/create-user-modal";
import { useState } from "react";

export default function ManageUsers() {
  const [isActive, setActive] = useState(false);

  const handleCreateUser = async (data: { fullName: string; email: string; password: string }) => {
    // TODO: wire up your Prisma/API call here
    console.log("Creating user:", data);
  };

  return (
    <div className="w-full flex flex-col gap-3 relative">
      <div className="w-full flex items-center justify-between">
        <div>
          <h1 className="text-2xl text-teiblue font-bold">Manage CSD Users</h1>
          <p className="text-sm text-gray-400 font-light">
            Create and Manage CSD User Accounts
          </p>
        </div>
        <div className="group">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
            onClick={() => setActive(true)}
            className="flex items-center justify-center gap-2 rounded-lg bg-tei-blue p-2 shadow-sm transition-all cursor-pointer"
          >
            <UserRoundPlus
              size={24}
              className="text-white transition-colors duration-300 group-hover:text-tei-orange-lt"
            />
            <p className="text-sm font-medium text-white transition-colors duration-300 group-hover:text-amber-300">
              Create New User
            </p>
          </motion.button>
        </div>
      </div>

      {/* Modal — rendered at page level, outside the widget stack */}
      <CreateUserModal
        isOpen={isActive}
        onClose={() => setActive(false)}
        onSubmit={handleCreateUser}
      />

      <CSDWidgets CSDUser={5} />
    </div>
  );
}