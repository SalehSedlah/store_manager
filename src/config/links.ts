
import type { LucideIcon } from "lucide-react";
import { LayoutDashboard, Users, Sparkles, Settings } from "lucide-react";

export interface NavLink {
  href: string;
  label: string; 
  labelKey: string; 
  icon: LucideIcon;
}

export const mainNavLinks: NavLink[] = [
  {
    href: "/dashboard", 
    label: "Dashboard", 
    labelKey: "dashboard",
    icon: LayoutDashboard,
  },
  {
    href: "/debt-management", 
    label: "Debt Management", 
    labelKey: "debtManagement",
    icon: Users,
  },
  {
    href: "/ai-assistant", 
    label: "AI Assistant", 
    labelKey: "aiAssistant",
    icon: Sparkles,
  },
];

export const secondaryNavLinks: NavLink[] = [
 /* {
    href: "/settings", 
    label: "Settings", 
    labelKey: "settings",
    icon: Settings,
  }, */
];
