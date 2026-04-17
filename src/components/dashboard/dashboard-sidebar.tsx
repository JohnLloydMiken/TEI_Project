"use client";
import * as React from "react";
import Link from "next/link";
import { DashboardSidebarProps } from "@/types/dashboard/dashboard-types";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { X, Menu, LogOut } from "lucide-react";

export default function DashboardSidebar({
  navItems,
  isAdmin,
}: DashboardSidebarProps) {
  const path = usePathname();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Role label */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="px-6 py-4 bg-teiblue border-b border-white/20 flex items-center justify-between"
      >
        <div>
          <p className="text-white font-medium text-2xl tracking-normal">
            TEI BDR System
          </p>
          <p className="text-white/60 text-xs mt-0.5">
            {isAdmin ? "Administrator Panel" : "Customer Service Dept."}
          </p>
        </div>
        {/* Close button — mobile only */}
        <button
          className="lg:hidden text-white/70 hover:text-white transition-colors"
          onClick={() => setMobileOpen(false)}
          aria-label="Close menu"
        >
          <X size={20} />
        </button>
      </motion.div>

      {/* Nav links */}
      <nav className="flex flex-col gap-1 flex-1 overflow-y-auto">
        {navItems.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              duration: 0.35,
              delay: 0.1 + index * 0.07,
              ease: "easeOut",
            }}
            className="flex flex-col space-y-2 border-b border-b-gray-300"
          >
            <div className="w-full">
              <div className="w-full px-6 py-3">
                <p className="text-xs uppercase mb-2 text-gray-400 tracking-widest">
                  {item?.title}
                </p>
              </div>
              {item.content.map((cont) => {
                const isActive = path === cont.href;
                return (
                  <Link
                    href={cont.href}
                    key={cont.href}
                    onClick={() => setMobileOpen(false)}
                    className="relative block"
                  >
                    <motion.div
                      whileHover={{ x: 4 }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 25,
                      }}
                      className={`flex flex-row justify-start items-center space-x-3 group px-6 py-3 transition-colors
                        ${
                          isActive
                            ? "bg-orange-100 border-l-4 border-l-teiorange"
                            : "hover:border-l-4 hover:border-l-teiorange hover:bg-orange-100"
                        }`}
                    >
                      <motion.div
                        animate={{ scale: isActive ? 1.2 : 1 }}
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 20,
                        }}
                        className={`p-1 rounded-full transition-colors ${
                          isActive
                            ? "bg-teiorange"
                            : "bg-gray-300 group-hover:bg-teiorange"
                        }`}
                      />
                      <p
                        className={`uppercase transition-colors text-sm font-normal ${
                          isActive
                            ? "text-orange-700 "
                            : "text-gray-500 group-hover:text-orange-700"
                        }`}
                      >
                        {cont.label}
                      </p>

                      {/* Active indicator pill */}
                     
                    </motion.div>
                  </Link>
                );
              })}
            </div>
          </motion.div>
        ))}
      </nav>

      {/* Sign out */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.4 }}
        className="p-4 border-t border-gray-200"
      >
        <p className="text-gray-400 text-xs mb-2">
          Signed in as {isAdmin ? "Admin" : "CSD"}
        </p>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          className="flex items-center gap-2 text-sm text-teiorange hover:text-red-500 transition-colors font-medium"
        >
          <LogOut size={14} />
          Sign out
        </motion.button>
      </motion.div>
    </div>
  );

  return (
    <>
      {/* ── Desktop sidebar (md+) ── */}
      <aside className="hidden md:flex w-64 lg:w-72 bg-white flex-col shrink-0 shadow-sm">
        {sidebarContent}
      </aside>

      {/* ── Mobile: hamburger trigger ── */}
      <div className="md:hidden fixed top-3 left-4 z-50">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => setMobileOpen(true)}
          className="p-2 bg-white rounded-lg shadow-md text-gray-700 hover:bg-orange-50 transition-colors"
          aria-label="Open menu"
        >
          <Menu size={22} />
        </motion.button>
      </div>

      {/* ── Mobile: overlay backdrop ── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden fixed inset-0 bg-black/40 z-40 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* ── Mobile: slide-in sidebar drawer ── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.aside
            key="mobile-sidebar"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 32 }}
            className="md:hidden fixed top-0 left-0 h-full w-72 bg-white z-50 flex flex-col shadow-2xl"
          >
            {sidebarContent}
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}
