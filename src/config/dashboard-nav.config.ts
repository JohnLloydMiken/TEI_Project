
import type { SidebarContent } from "@/types/dashboard/dashboard-types";

export const adminNav = [
  {
    title: "Management",
    content: [
      { label: "Upload List",      href: "/dashboard/admin_dashboard/upload_list",   Icon: "folder-up"  },
      { label: "Claimed History",  href: "/dashboard/admin_dashboard/claimed_history", Icon: "file-text" },
    ] satisfies SidebarContent[],
  },
  {
    title: "Reports",
    content: [
      { label: "Manage CSD Users", href: "/dashboard/admin_dashboard/manage_csd_users", Icon: "search"     },
      { label: "Export Data",      href: "/dashboard/admin_dashboard/export_data",       Icon: "arrow-down" },
    ] satisfies SidebarContent[],
  },
];

export const csdNav = [
  {
    title: "Checker",
    content: [
      { label: "Eligibility Checker", href: "/individual-checker",    Icon: "search"    },
      { label: "Batch Checker",       href: "/batch-checker/paste",   Icon: "file-text" },
    ] satisfies SidebarContent[],
  },
  {
    title: "Reports",
    content: [
      { label: "Claimed List",   href: "/dashboard/user_dashboard/claimed_list",    Icon: "arrow-down" },
      { label: "Export Records", href: "/dashboard/user_dashboard/export_records",  Icon: "folder-up"  },
    ] satisfies SidebarContent[],
  },
];