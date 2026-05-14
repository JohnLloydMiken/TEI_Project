"use client";

import { motion } from "motion/react";
import { UserRoundPlus } from "lucide-react";
import { useState } from "react";
import CSDWidgets from "./widget";
import CreateUserModal from "./create-user-modal";
import CSDUserTable from "./user-table";
import { createUser } from "@/lib/actions/CSD-user-actions";

export type CSDUser = {
  id: number;
  name: string;
  email: string;
  createdAt: string;
  taggedCount: number;
};

interface Props {
  initialUsers: CSDUser[];
}

export default function ManageUsersClient({ initialUsers }: Props) {
  const [isModalOpen, setModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreateUser = async (data: {
    fullName: string;
    email: string;
    password: string;
  }) => {
    setError(null);
    const result = await createUser({
      name: data.fullName,
      email: data.email,
      password: data.password,
    });
    if (result.error) { setError(result.error); return; }
    setModalOpen(false);
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
            onClick={() => setModalOpen(true)}
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

      <CreateUserModal
        isOpen={isModalOpen}
        onClose={() => { setModalOpen(false); setError(null); }}
        onSubmit={handleCreateUser}
      />

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <CSDWidgets CSDUser={initialUsers.length} />
      <CSDUserTable initialUsers={initialUsers} />
    </div>
  );
}