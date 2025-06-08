
import type { LucideIcon } from "lucide-react";
import { LayoutDashboard, Users, Sparkles, Settings, ShoppingCart } from "lucide-react";

export interface NavLink {
  href: string;
  label: string; // Changed from labelKey to direct label
  labelKey: "dashboard" | "debtManagement" | "aiAssistant" | "products" | "settings"; // Keep for mapping if needed, or remove if direct labels are enough
  icon: LucideIcon;
}

export const mainNavLinks: NavLink[] = [
  {
    href: "/dashboard", 
    label: "لوحة التحكم",
    labelKey: "dashboard",
    icon: LayoutDashboard,
  },
  {
    href: "/debt-management", 
    label: "إدارة الديون",
    labelKey: "debtManagement",
    icon: Users,
  },
  {
    href: "/products",
    label: "المنتجات",
    labelKey: "products",
    icon: ShoppingCart,
  },
  {
    href: "/ai-assistant", 
    label: "المساعد الذكي",
    labelKey: "aiAssistant",
    icon: Sparkles,
  },
];

export const secondaryNavLinks: NavLink[] = [
  {
    href: "/settings", 
    label: "إدارة الحساب",
    labelKey: "settings",
    icon: Settings,
  },
];
