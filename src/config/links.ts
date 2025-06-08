
import type { LucideIcon } from "lucide-react";
import { LayoutDashboard, Users, Sparkles, Settings, ShoppingCart } from "lucide-react";

export interface NavLink {
  href: string;
  labelKey: "dashboard" | "debtManagement" | "aiAssistant" | "products" | "settings"; 
  icon: LucideIcon;
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
    href: "/products",
    labelKey: "products",
    icon: ShoppingCart,
  },
  {
    href: "/ai-assistant", 
    labelKey: "aiAssistant",
    icon: Sparkles,
  },
];

export const secondaryNavLinks: NavLink[] = [
  {
    href: "/settings", 
    labelKey: "settings",
    icon: Settings,
  },
];
