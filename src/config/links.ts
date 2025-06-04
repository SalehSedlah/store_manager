
import type { LucideIcon } from "lucide-react";
import { LayoutDashboard, Users, Sparkles, Settings } from "lucide-react";

// NavLink interface updated to use direct label
export interface NavLink {
  href: string;
  label: string; // Direct string label
  labelKey: string; // Kept for consistency if needed later, but label is used now
  icon: LucideIcon;
}

export const mainNavLinks: NavLink[] = [
  {
    href: "/dashboard", // No locale prefix
    label: "Dashboard", 
    labelKey: "dashboard",
    icon: LayoutDashboard,
  },
  {
    href: "/debt-management", // No locale prefix
    label: "Debt Management", 
    labelKey: "debtManagement",
    icon: Users,
  },
  {
    href: "/ai-assistant", // No locale prefix
    label: "AI Assistant", 
    labelKey: "aiAssistant",
    icon: Sparkles,
  },
];

export const secondaryNavLinks: NavLink[] = [
 /* {
    href: "/settings", // No locale prefix
    label: "Settings", 
    labelKey: "settings",
    icon: Settings,
  }, */
];
