export const adminNav = [
  {
    title: "Management",
    content: [
      { label: "Upload List", href: "/dashboard/admin_dashboard/upload_list" },
      {
        label: "Claimed History",
        href: "/dashboard/admin_dashboard/claimed_history",
      },
    ],
  },
  {
    title: "Reports",
    content: [
      {
        label: "Manage CSD Users",
        href: "/dashboard/admin_dashboard/manage_csd_users",
      },
      { label: "Export Data", href: "/dashboard/admin_dashboard/export_data" },
    ],
  },
];

export const csdNav = [
  {
    title: "Checker",
    content: [
      {
        label: "Eligibility Checker",
        href: "/individual-checker",
      },
      {
        label: "Batch Checker",
        href: "/batch-checker/paste",
      },
    ],
  },
  {
    title: "Reports",
    content: [
      { label: "Claimed List", 
        href: "/dashboard/user_dashboard/claimed_list" },
      {
        label: "Export Records",
        href: "/dashboard/user_dashboard/export_records",
      },
    ],
  },
];
