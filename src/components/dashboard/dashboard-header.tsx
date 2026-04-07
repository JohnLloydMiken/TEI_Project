import * as React from 'react';
import { User } from 'lucide-react';
import { DashboardHeaderProps } from '@/types/dashboard/dashboard-types';

export default function DashboardHeader({ name, role }: DashboardHeaderProps) {
  const isAdmin = role === "ADMIN";

  return (
    // ✅ w-full so it spans the entire top
    <header className="w-full bg-teiblue">
      <div className="w-full px-6 py-3 flex flex-row justify-between items-center">
        <p className="text-xs uppercase text-gray-100 font-medium">
          Tarlac Electric Inc. — Bill Deposit Refund System
        </p>
        <div className="flex flex-row items-center gap-2">
          <div className="rounded-full  p-2 bg-teiorange">
            <User className="text-white w-5 h-5" />
          </div>
          <p className="uppercase text-sm text-gray-100">
            {name} — {isAdmin ? "System Administrator" : "CSD"}
          </p>
        </div>
      </div>
    </header>
  );
}