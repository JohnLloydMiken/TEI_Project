export interface DashboardHeaderProps{
    name: string | null | undefined,
    role: string | null | undefined,
}
export interface DashboardSidebarProps {
  navItems: { title: string; content: SidebarContent[] }[];
  isAdmin: boolean;
}

interface SidebarContent{
    label: string 
    href: string 
}