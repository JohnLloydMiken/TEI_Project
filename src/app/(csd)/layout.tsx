import * as React from "react";
import { getServerSession } from "next-auth";
import { adminNav, csdNav } from "@/config/dashboard-nav.config";
import { authOptions } from "../api/auth/[...nextauth]/route";
import DashboardHeader from "@/components/dashboard/dashboard-header";
import DashboardSidebar from "@/components/dashboard/dashboard-sidebar";

export default async function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await getServerSession(authOptions);
  const isAdmin = session?.user.role === "ADMIN";
  const navItems = isAdmin ? adminNav : csdNav;

  return (
    <div className="flex flex-col h-screen">
      <DashboardHeader name={session?.user.name} role={session?.user.role} />

      <div className="flex flex-1 overflow-hidden">
        <DashboardSidebar navItems={navItems} isAdmin={isAdmin} />

        {/* Offset on mobile so hamburger button doesn't overlap content */}
        <main className="flex-1 overflow-y-auto bg-gray-100 p-6 md:pt-6 pt-16">
          {children}
        </main>
      </div>
    </div>
  );
}