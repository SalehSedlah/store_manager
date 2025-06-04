
import type { LucideIcon } from "lucide-react";
import { LayoutDashboard, Users, Sparkles, Settings } from "lucide-react";

// NavLink interface now uses labelKey for translation
export interface NavLink {
  href: string;
  labelKey: string; // Key for useTranslations
  icon: LucideIcon;
  // isActive logic might need adjustment if pathname from next-intl/client doesn't include locale
}

export const mainNavLinks: NavLink[] = [
  {
    href: "/dashboard",
    labelKey: "dashboard", 
    icon: LayoutDashboard,
  },
  {
    href: "/debt-management",
    labelKey: "debtManagement", 
    icon: Users,
  },
  {
    href: "/ai-assistant",
    labelKey: "aiAssistant", 
    icon: Sparkles,
  },
];

export const secondaryNavLinks: NavLink[] = [
 /* {
    href: "/settings",
    labelKey: "settings", // Example if settings page is added
    icon: Settings,
  }, */
];
