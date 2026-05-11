import type { SidebarContent } from "@/types/dashboard/dashboard-types";

export const adminNav = [
    {
    title: "General",
    content: [
      {
        label: "Overview",
        href: "/overview",
        Icon: "layout-dashboard",
      },
    ] satisfies SidebarContent[],
  },
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
        href: "/reports/returned-list",
        Icon: "file-text",
      },

      {
        label: "Export Data",
        href: "/reports/export-data",
        Icon: "arrow-down",
      },
    ] satisfies SidebarContent[],
  },
];

export const csdNav = [
   {
    title: "General",
    content: [
      {
        label: "Overview",
        href: "/overview",
        Icon: "layout-dashboard",
      },
    ] satisfies SidebarContent[],
  },
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
        label: "Returned List",
        href: "/reports/returned-list",
        Icon: "file-text",
      },

      {
        label: "Export Data",
        href: "/reports/export-data",
        Icon: "arrow-down",
      },
    ] satisfies SidebarContent[],
  },
];
