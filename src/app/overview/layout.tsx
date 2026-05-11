import * as React from "react";
import { getServerSession } from "next-auth";
import { adminNav, csdNav } from "@/config/dashboard-nav.config";
import { authOptions } from "../api/auth/[...nextauth]/route";
import DashboardHeader from "@/components/dashboard/dashboard-header";
import DashboardSidebar from "@/components/dashboard/dashboard-sidebar";

export default async function OvereviewLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await getServerSession(authOptions);
  const isAdmin = session?.user.role === "ADMIN";
  const navItems = isAdmin ? adminNav : csdNav;

   return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar sits in the row, fixed-width, full height */}
      <DashboardSidebar navItems={navItems} isAdmin={isAdmin} />

      {/* Right column: header stacked above scrollable main */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <DashboardHeader name={session?.user.name} role={session?.user.role} />

        <main className="flex-1 overflow-y-auto bg-[#F9FAFB] px-6 py-3">
          {children}
        </main>
      </div>
    </div>
  );
}
