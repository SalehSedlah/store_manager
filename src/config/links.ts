
import type { LucideIcon } from "lucide-react";
import { LayoutDashboard, Users, Sparkles, Settings } from "lucide-react";

export interface NavLink {
  href: string;
  label: string; // This will now be a translation key, e.g., "dashboard"
  icon: LucideIcon;
  isActive?: (pathname: string) => boolean;
}

export const mainNavLinks: NavLink[] = [
  {
    href: "/dashboard",
    label: "dashboard", // Translation key for Sidebar.dashboard
    icon: LayoutDashboard,
    isActive: (pathname) => pathname.includes("/dashboard"),
  },
  {
    href: "/debt-management",
    label: "debtManagement", // Translation key for Sidebar.debtManagement
    icon: Users,
    isActive: (pathname) => pathname.includes("/debt-management"),
  },
  {
    href: "/ai-assistant",
    label: "aiAssistant", // Translation key for Sidebar.aiAssistant
    icon: Sparkles,
    isActive: (pathname) => pathname.includes("/ai-assistant"),
  },
];

export const secondaryNavLinks: NavLink[] = [
 /* {
    href: "/settings",
    label: "settings", // Example translation key
    icon: Settings,
    isActive: (pathname) => pathname.startsWith("/settings"),
  }, */
];
