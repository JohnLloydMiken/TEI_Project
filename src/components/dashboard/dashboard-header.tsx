"use client";
import * as React from "react";
import { User } from "lucide-react";
import { DashboardHeaderProps } from "@/types/dashboard/dashboard-types";
import { usePathname } from "next/navigation";
export default function DashboardHeader({ name, role }: DashboardHeaderProps) {
  const isAdmin = role === "ADMIN";

  const pathname = usePathname();
  const cleanPath = pathname.replace(/^\/+/, "");

  const path = cleanPath.startsWith("dashboard/") ? cleanPath.slice(10) : cleanPath
 


  const getInitials = (name: string) => {
    const parts = name.trim().split(" ").filter(Boolean);

    if (parts.length === 0) return "";
    if (parts.length === 1) return parts[0][0].toUpperCase();

    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };
  const initials = getInitials(name ?? "Guest");

  return (
    // ✅ w-full so it spans the entire top
    <header className="w-full bg-white z-10 shadow-gray-300 shadow">
      <div className="w-full px-6 py-2 flex flex-row md:justify-between justify-end items-center">
        <p className=" text-xs md:block hidden uppercase text-gray-400 font-normal">
          Dashboards {""} {">"} {""}
           {""}  {""}
          <span className="text-sm text-tei-blue-mid font-semibold">
            {path}
          </span>
        </p>
        <div className="flex flex-row items-center gap-2 border border-gray-200 bg-[#f0f4f9] p-2 w-2/5 lg:w-[12%] rounded-full">
          <div className="rounded-full p-2 flex w-7 h-7  text-white  justify-center items-center bg-linear-to-br from-tei-orange-lt to-tei-blue">
           <p className="text-xs font-bold">{initials}</p>
          </div>
          <div>
            <p className="uppercase text-[10px] font-bold text-tei-navy">
            {name}
          </p>
          <p className="text-[10px] font-medium text-gray-400">{isAdmin ? "System Administrator" : "CSD Staff"}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
