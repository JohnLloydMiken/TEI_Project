import { ICON_MAP } from "@/components/dashboard/dashboard-sidebar";
export interface DashboardHeaderProps{
    name: string | null | undefined,
    role: string | null | undefined,
}
export type IconKey = "search" | "file-text" | "arrow-down" | "folder-up" | "layout-dashboard";

export interface SidebarContent {
  label: string;
  href: string;
  href2?:string,
  Icon?: IconKey; // optional so nav items without icons still compile
}

export interface DashboardSidebarProps {
  navItems: { title: string; content: SidebarContent[] }[];
  isAdmin: boolean;
}