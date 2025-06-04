import type { LucideIcon } from "lucide-react";
import { LayoutDashboard, Users, Sparkles, Settings } from "lucide-react";

export interface NavLink {
  href: string;
  label: string; // This will now be used as a fallback or if translationKey is not provided
  translationKey?: keyof IntlMessages["AppSidebar"]; // Add this for specific keys from AppSidebar namespace
  icon: LucideIcon;
  isActive?: (pathname: string) => boolean;
}

export const mainNavLinks: NavLink[] = [
  {
    href: "/dashboard",
    label: "Dashboard",
    translationKey: "dashboard",
    icon: LayoutDashboard,
    isActive: (pathname) => pathname.includes("/dashboard"), // Ensure this works with locale prefixes
  },
  {
    href: "/debt-management",
    label: "Debt Management",
    translationKey: "debtManagement",
    icon: Users,
    isActive: (pathname) => pathname.includes("/debt-management"),
  },
  {
    href: "/ai-assistant",
    label: "AI Assistant",
    translationKey: "aiAssistant",
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
