
import type { LucideIcon } from "lucide-react";
import { LayoutDashboard, Users, Sparkles, Settings } from "lucide-react";

export interface NavLink {
  href: string;
  label: string; 
  icon: LucideIcon;
  isActive?: (pathname: string) => boolean;
}

export const mainNavLinks: NavLink[] = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    isActive: (pathname) => pathname.includes("/dashboard"),
  },
  {
    href: "/debt-management",
    label: "Debt Management",
    icon: Users,
    isActive: (pathname) => pathname.includes("/debt-management"),
  },
  {
    href: "/ai-assistant",
    label: "AI Assistant",
    icon: Sparkles,
    isActive: (pathname) => pathname.includes("/ai-assistant"),
  },
];

export const secondaryNavLinks: NavLink[] = [
 /* {
    href: "/settings",
    label: "Settings",
    icon: Settings,
    isActive: (pathname) => pathname.startsWith("/settings"),
  }, */
];
