
import type { LucideIcon } from "lucide-react";
import { LayoutDashboard, Users, Sparkles, Settings, ShoppingCart } from "lucide-react"; // Added ShoppingCart icon

// NavLink label property is removed as labels will come from translation files via labelKey.
export interface NavLink {
  href: string;
  // labelKey refers to a key in a hardcoded map in AppSidebar for now
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
    href: "/products", // New link for Products
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
 /* {
    href: "/settings", 
    labelKey: "settings",
    icon: Settings,
  }, */
];
