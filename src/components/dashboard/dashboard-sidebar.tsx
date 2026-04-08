"use client";
import * as React from "react";
import Link from "next/link";
import { DashboardSidebarProps } from "@/types/dashboard/dashboard-types";
import { usePathname } from "next/navigation";
export default function DashboardSidebar({
  navItems,
  isAdmin,
}: DashboardSidebarProps) {
  const path = usePathname();
  return (
    <aside className="w-72 bg-white flex flex-col shrink-0">
      {/* Role label */}
      <div className="px-6 py-4 bg-teiblue border-b border-white/20">
        <p className="text-white font-bold text-lg tracking-wider">
          TEI BDR System
        </p>
        <p className="text-white/60 text-xs mt-0.5">
          {isAdmin ? "Administrator Panel" : "Customer Service Dept."}
        </p>
      </div>

      {/* Nav links */}
      <nav className="flex flex-col gap-1  flex-1">
        {navItems.map((item, index) => (
          <div
            key={index}
            className=" flex flex-col space-y-2 border-b border-b-gray-300"
          >
            <div className="w-full  ">
              <div className="w-full px-6 py-3">
                <p className="text-xs uppercase mb-2 text-gray-400">
                  {item?.title}
                </p>
              </div>
              {item.content.map((cont, _) => (
                <Link
                  href={cont.href}
                  key={cont.href}
                  className={`flex flex-row justify-start items-center space-x-3 group  px-6 py-3 transition-colors
                    ${
                      path === cont.href
                        ? "bg-orange-100 border-l-4 border-l-teiorange"
                        : "hover:border-l-4 hover:border-l-teiorange hover:bg-orange-100"
                    }
                    `}
                >
                  <div
                    className={`bg-gray-300 p-1 rounded-full  group-hover:bg-teiorange transition-colors ${
                      path === cont.href
                        ? "bg-teiorange"
                        : "bg-gray-300 group-hover:bg-teiorange"
                    }`}
                  />
                  <p
                    className={`uppercase transition-colors ${
                      path === cont.href
                        ? "text-teiorange"
                        : "group-hover:text-teiorange"
                    }`}
                  >
                    {cont.label}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Sign out */}
      <div className="p-4 border-t border-white/20">
        <p className="text-white/50 text-xs">
          Sign out as {isAdmin ? "Admin" : "CSD"}
        </p>

        <button>Signed in</button>
      </div>
    </aside>
  );
}
