import type { SidebarContent } from "@/types/dashboard/dashboard-types";

export const adminNav = [
  {
    title: "Management",
    content: [
      {
        label: "Upload List",
        href: "/dashboard/upload-list",
        Icon: "folder-up",
      },
      {
        label: "Manage CSD Users",
        href: "/dashboard/manage-users",
        Icon: "search",
      },
    ] satisfies SidebarContent[],
  },
  {
    title: "Reports",
    content: [
      {
        label: "Returned List",
        href: "/dashboard/returned-list",
        Icon: "file-text",
      },

      {
        label: "Export Data",
        href: "/dashboard/admin_dashboard/export_data",
        Icon: "arrow-down",
      },
    ] satisfies SidebarContent[],
  },
];

export const csdNav = [
  {
    title: "Checker",
    content: [
      {
        label: "Eligibility Checker",
        href: "/individual-checker",
        Icon: "search",
      },
      {
        label: "Batch Checker",
        href: "/batch-checker/paste",
        Icon: "file-text",
        href2: "/batch-checker/upload",
      },
    ] satisfies SidebarContent[],
  },
  {
    title: "Reports",
    content: [
      {
        label: "Retured List",
        href: "/dashboard/user_dashboard/claimed_list",
        Icon: "arrow-down",
      },
      {
        label: "Export Records",
        href: "/dashboard/user_dashboard/export_records",
        Icon: "folder-up",
      },
    ] satisfies SidebarContent[],
  },
];
